import { useMemo, useState, type FC } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Flex,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Steps,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useMemoizedFn, useMount } from 'ahooks';
import { gulimallApi } from '@/api';
import { message } from '@/api/feedback';
import { ImageUpload } from '@/components/ImageUpload';
import type { Attr, AttrGroup, Brand, SpuSavePayload } from '@/types';
import { CategoryTreeSelect } from './CategoryTreeSelect';

type Combo = { attrId: number; attrName: string; value: string };

type SkuRow = {
  key: string;
  combo: Combo[];
  skuName: string;
  price?: number;
  stock?: number;
  skuTitle?: string;
  skuSubtitle?: string;
  enable: number;
  images: string[];
};

type Basic = {
  spuName: string;
  catelogId?: number;
  brandId?: number;
  weight?: number;
  publishStatus: number;
};

const splitValues = (v?: string) => (v ? v.split(/[;,，；]/).filter(Boolean) : []);

const comboKey = (combo: Combo[]) => combo.map((c) => `${c.attrId}:${c.value}`).join('|');

/**
 * 发布商品四步向导：基本信息 -> 销售属性与规格 -> SKU 信息 -> 图片与描述。
 * 提交体是跨 7 张表的嵌套 VO，后端 composite save 未实现前保存会失败（预期）。
 */
const SpuAddPage: FC = () => {
  const [step, setStep] = useState(0);
  const [basic, setBasic] = useState<Basic>({ spuName: '', publishStatus: 0 });
  const [brands, setBrands] = useState<Brand[]>([]);

  const [saleAttrs, setSaleAttrs] = useState<Attr[]>([]);
  const [specGroups, setSpecGroups] = useState<{ group: AttrGroup; attrs: Attr[] }[]>([]);
  const [step2Loading, setStep2Loading] = useState(false);

  const [saleChoice, setSaleChoice] = useState<Record<number, string[]>>({});
  const [specChoice, setSpecChoice] = useState<Record<number, string>>({});
  const [skus, setSkus] = useState<SkuRow[]>([]);

  const [spuImages, setSpuImages] = useState<string[]>([]);
  const [decript, setDecript] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useMount(() => {
    gulimallApi.brandList({ page: 1, limit: 200 }).then((res) => {
      if (res.code === 0) setBrands(res.page?.list ?? []);
    });
  });

  /** 老后端不认 catelogId/attrType 过滤，这里拉全量再前端筛，新旧后端都能跑 */
  const loadStep2 = useMemoizedFn(async (catelogId: number) => {
    setStep2Loading(true);
    try {
      const [attrRes, groupRes] = await Promise.all([
        gulimallApi.attrList({ page: 1, limit: 500 }),
        gulimallApi.attrGroupList({ page: 1, limit: 500 }),
      ]);
      const attrs = (attrRes.page?.list ?? []).filter(
        (a) => a.catelogId === catelogId && a.attrType === 0,
      );
      const groups = (groupRes.page?.list ?? []).filter((g) => g.catelogId === catelogId);
      const withAttrs = await Promise.all(
        groups.map(async (group) => ({
          group,
          attrs: (await gulimallApi.attrGroupRelationAttrs(group.attrGroupId)).data ?? [],
        })),
      );
      setSaleAttrs(attrs);
      setSpecGroups(withAttrs.filter((g) => g.attrs.length));
    } finally {
      setStep2Loading(false);
    }
  });

  const regenSkus = useMemoizedFn((nextChoice: Record<number, string[]>, prevSkus: SkuRow[], name: string) => {
    const entries = saleAttrs
      .map((a) => ({ a, vals: nextChoice[a.attrId] ?? [] }))
      .filter((e) => e.vals.length);
    let combos: Combo[][] = [[]];
    for (const { a, vals } of entries) {
      combos = combos.flatMap((c) =>
        vals.map((v) => [...c, { attrId: a.attrId, attrName: a.attrName, value: v }]),
      );
    }
    const old = new Map(prevSkus.map((s) => [s.key, s]));
    setSkus(
      combos.map((combo) => {
        const key = comboKey(combo);
        return (
          old.get(key) ?? {
            key,
            combo,
            skuName: [name, ...combo.map((c) => c.value)].filter(Boolean).join(' '),
            enable: 1,
            images: [],
          }
        );
      }),
    );
  });

  const gotoNext = useMemoizedFn(() => {
    if (step === 0) {
      if (!basic.spuName.trim() || !basic.catelogId || !basic.brandId) {
        message.warning('商品名、所属分类、品牌都要填');
        return;
      }
      void loadStep2(basic.catelogId);
    }
    if (step === 2 && skus.length === 0) {
      regenSkus(saleChoice, skus, basic.spuName);
    }
    setStep((s) => Math.min(s + 1, 3));
  });

  const buildPayload = useMemoizedFn((): SpuSavePayload => ({
    spuName: basic.spuName.trim(),
    catalogId: basic.catelogId!,
    brandId: basic.brandId!,
    weight: basic.weight,
    publishStatus: basic.publishStatus,
    description: decript || undefined,
    images: spuImages,
    attrs: Object.entries(specChoice)
      .filter(([, v]) => v)
      .map(([attrId, value]) => {
        const attr = specGroups.flatMap((g) => g.attrs).find((a) => String(a.attrId) === attrId);
        return { attrId: Number(attrId), attrName: attr?.attrName ?? '', value };
      }),
    skus: skus.map((s) => ({
      skuName: s.skuName,
      price: s.price,
      stock: s.stock,
      skuTitle: s.skuTitle,
      skuSubtitle: s.skuSubtitle,
      enable: s.enable,
      images: s.images,
      saleAttrValues: s.combo.map((c) => ({
        attrId: c.attrId,
        attrName: c.attrName,
        attrValue: c.value,
      })),
    })),
  }));

  const handleSave = useMemoizedFn(async () => {
    if (!skus.length) {
      message.warning('至少要有一个 SKU');
      return;
    }
    const payload = buildPayload();
    setSaving(true);
    try {
      const res = await gulimallApi.spuSave(payload);
      if (res.code !== 0) {
        message.error(res.msg || '保存失败');
        return;
      }
      message.success('发布成功');
    } catch (e) {
      // 后端 composite save 还没写，404 是预期内的
      message.error(`保存请求失败（后端 /spu/save 尚未实现）：${e instanceof Error ? e.message : e}`);
    } finally {
      setSaving(false);
    }
  });

  const updateSku = (key: string, patch: Partial<SkuRow>) =>
    setSkus((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const skuColumns = useMemo(
    () => [
      {
        title: '销售属性组合',
        dataIndex: 'combo',
        width: 200,
        render: (combo: Combo[]) =>
          combo.length ? combo.map((c) => <Tag key={`${c.attrId}-${c.value}`}>{c.value}</Tag>) : <Tag>默认</Tag>,
      },
      {
        title: 'SKU 名称',
        dataIndex: 'skuName',
        width: 180,
        render: (v: string, row: SkuRow) => (
          <Input size="small" value={v} onChange={(e) => updateSku(row.key, { skuName: e.target.value })} />
        ),
      },
      {
        title: '价格',
        dataIndex: 'price',
        width: 110,
        render: (v: number | undefined, row: SkuRow) => (
          <InputNumber size="small" min={0} precision={2} style={{ width: '100%' }} value={v} onChange={(n) => updateSku(row.key, { price: n ?? undefined })} />
        ),
      },
      {
        title: '库存',
        dataIndex: 'stock',
        width: 100,
        render: (v: number | undefined, row: SkuRow) => (
          <InputNumber size="small" min={0} precision={0} style={{ width: '100%' }} value={v} onChange={(n) => updateSku(row.key, { stock: n ?? undefined })} />
        ),
      },
      {
        title: '标题',
        dataIndex: 'skuTitle',
        width: 150,
        render: (v: string | undefined, row: SkuRow) => (
          <Input size="small" value={v} onChange={(e) => updateSku(row.key, { skuTitle: e.target.value })} />
        ),
      },
      {
        title: '副标题',
        dataIndex: 'skuSubtitle',
        width: 150,
        render: (v: string | undefined, row: SkuRow) => (
          <Input size="small" value={v} onChange={(e) => updateSku(row.key, { skuSubtitle: e.target.value })} />
        ),
      },
      {
        title: '上架',
        dataIndex: 'enable',
        width: 70,
        align: 'center' as const,
        render: (v: number, row: SkuRow) => (
          <Switch size="small" checked={v === 1} onChange={(c) => updateSku(row.key, { enable: c ? 1 : 0 })} />
        ),
      },
      {
        title: 'SKU 图片',
        dataIndex: 'images',
        width: 130,
        render: (v: string[], row: SkuRow) => (
          <ImageUpload multiple maxCount={5} value={v} onChange={(urls: string[]) => updateSku(row.key, { images: urls })} />
        ),
      },
    ],
    [],
  );

  return (
    <Card size="small" style={{ margin: 12 }} title="发布商品">
      <Steps
        current={step}
        size="small"
        style={{ marginBottom: 20 }}
        items={[
          { title: '基本信息' },
          { title: '销售属性与规格' },
          { title: 'SKU 信息' },
          { title: '图片与描述' },
        ]}
      />

      {step === 0 && (
        <Flex vertical gap={12} style={{ maxWidth: 560 }}>
          <Flex gap={8} align="center">
            <span style={{ width: 80 }}>商品名称</span>
            <Input value={basic.spuName} onChange={(e) => setBasic((b) => ({ ...b, spuName: e.target.value }))} />
          </Flex>
          <Flex gap={8} align="center">
            <span style={{ width: 80 }}>所属分类</span>
            <CategoryTreeSelect
              style={{ flex: 1 }}
              value={basic.catelogId}
              onChange={(v) => setBasic((b) => ({ ...b, catelogId: v }))}
            />
          </Flex>
          <Flex gap={8} align="center">
            <span style={{ width: 80 }}>品牌</span>
            <Select
              style={{ flex: 1 }}
              showSearch
              optionFilterProp="label"
              value={basic.brandId}
              onChange={(v) => setBasic((b) => ({ ...b, brandId: v }))}
              options={brands.map((b) => ({ value: b.brandId, label: b.name }))}
            />
          </Flex>
          <Flex gap={8} align="center">
            <span style={{ width: 80 }}>重量(kg)</span>
            <InputNumber min={0} style={{ width: 160 }} value={basic.weight} onChange={(n) => setBasic((b) => ({ ...b, weight: n ?? undefined }))} />
          </Flex>
          <Flex gap={8} align="center">
            <span style={{ width: 80 }}>上架状态</span>
            <Radio.Group
              value={basic.publishStatus}
              onChange={(e) => setBasic((b) => ({ ...b, publishStatus: e.target.value }))}
              options={[
                { value: 0, label: '下架' },
                { value: 1, label: '上架' },
              ]}
            />
          </Flex>
        </Flex>
      )}

      {step === 1 && (
        <Flex gap={12} align="flex-start">
          <Card size="small" title="销售属性（勾选值生成 SKU 组合）" style={{ width: 380, flexShrink: 0 }} loading={step2Loading}>
            {saleAttrs.length === 0 && !step2Loading && (
              <Typography.Text type="secondary">该分类下没有销售属性（attr_type=0）</Typography.Text>
            )}
            <Flex vertical gap={12}>
              {saleAttrs.map((a) => (
                <div key={a.attrId}>
                  <div style={{ marginBottom: 4 }}>{a.attrName}</div>
                  <Checkbox.Group
                    value={saleChoice[a.attrId] ?? []}
                    onChange={(vals) => {
                      const next = { ...saleChoice, [a.attrId]: vals as string[] };
                      setSaleChoice(next);
                      regenSkus(next, skus, basic.spuName);
                    }}
                    options={splitValues(a.valueSelect)}
                  />
                </div>
              ))}
            </Flex>
          </Card>
          <Card size="small" title="规格参数（SPU 级，落 product_attr_value）" style={{ flex: 1, minWidth: 0 }} loading={step2Loading}>
            {specGroups.length === 0 && !step2Loading && (
              <Typography.Text type="secondary">该分类下的分组还没关联基本属性</Typography.Text>
            )}
            <Flex vertical gap={12}>
              {specGroups.map(({ group, attrs }) => (
                <div key={group.attrGroupId}>
                  <Tag color="blue">{group.attrGroupName}</Tag>
                  <Flex vertical gap={8} style={{ marginTop: 8 }}>
                    {attrs.map((a) => {
                      const values = splitValues(a.valueSelect);
                      return (
                        <Flex key={a.attrId} gap={8} align="center">
                          <span style={{ width: 120 }}>{a.attrName}</span>
                          {values.length ? (
                            <Select
                              style={{ width: 240 }}
                              allowClear
                              value={specChoice[a.attrId]}
                              onChange={(v) => setSpecChoice((s) => ({ ...s, [a.attrId]: v ?? '' }))}
                              options={values.map((v) => ({ value: v, label: v }))}
                            />
                          ) : (
                            <Input
                              style={{ width: 240 }}
                              value={specChoice[a.attrId] ?? ''}
                              onChange={(e) => setSpecChoice((s) => ({ ...s, [a.attrId]: e.target.value }))}
                            />
                          )}
                        </Flex>
                      );
                    })}
                  </Flex>
                </div>
              ))}
            </Flex>
          </Card>
        </Flex>
      )}

      {step === 2 && (
        <>
          <Space style={{ marginBottom: 12 }}>
            <Tag color="blue">{skus.length} 个 SKU</Tag>
            <Button size="small" onClick={() => regenSkus(saleChoice, skus, basic.spuName)}>
              按销售属性重新生成
            </Button>
          </Space>
          <Table<SkuRow>
            rowKey="key"
            size="small"
            columns={skuColumns}
            dataSource={skus}
            pagination={false}
            scroll={{ x: 1100 }}
          />
        </>
      )}

      {step === 3 && (
        <Flex vertical gap={16} style={{ maxWidth: 720 }}>
          <div>
            <div style={{ marginBottom: 8 }}>商品图片</div>
            <ImageUpload multiple maxCount={5} value={spuImages} onChange={setSpuImages} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>商品描述</div>
            <Input.TextArea rows={6} value={decript} onChange={(e) => setDecript(e.target.value)} />
          </div>
          <Space>
            <Button onClick={() => setPreviewOpen(true)}>预览提交体</Button>
          </Space>
        </Flex>
      )}

      <Flex gap={8} style={{ marginTop: 20 }}>
        {step > 0 && <Button onClick={() => setStep((s) => s - 1)}>上一步</Button>}
        {step < 3 && (
          <Button type="primary" onClick={gotoNext}>
            下一步
          </Button>
        )}
        {step === 3 && (
          <Button type="primary" loading={saving} onClick={handleSave}>
            保存
          </Button>
        )}
      </Flex>

      <Modal title="提交体预览" open={previewOpen} footer={null} width={720} onCancel={() => setPreviewOpen(false)}>
        <pre style={{ maxHeight: 480, overflow: 'auto', fontSize: 12 }}>
          {JSON.stringify(buildPayload(), null, 2)}
        </pre>
      </Modal>
    </Card>
  );
};

export default SpuAddPage;
