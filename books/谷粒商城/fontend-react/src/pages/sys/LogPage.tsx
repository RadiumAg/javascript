import { useState } from 'react';
import { Button, Card, Col, Input, Row, Space, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { SysLog } from '@/types';
import { paginationProps, usePageList } from '@/hooks/usePageList';

/** 对应 views/modules/sys/log.vue；搜索框提示“用户名／用户操作”，后端实际只按 username LIKE（SPEC D8） */
export default function LogPage() {
  const [key, setKey] = useState('');
  const pl = usePageList<SysLog>('/sys/log/list', { key: key || undefined });

  const overflow = (v?: string) =>
    v ? (
      <Tooltip title={v}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 240, display: 'inline-block', verticalAlign: 'bottom' }}>
          {v}
        </span>
      </Tooltip>
    ) : (
      '-'
    );

  const columns: ColumnsType<SysLog> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '用户操作', dataIndex: 'operation', width: 120 },
    { title: '请求方法', dataIndex: 'method', width: 160, ellipsis: true, render: overflow },
    { title: '请求参数', dataIndex: 'params', width: 160, ellipsis: true, render: overflow },
    { title: '执行时长(毫秒)', dataIndex: 'time', width: 120 },
    { title: 'IP地址', dataIndex: 'ip', width: 140 },
    { title: '创建时间', dataIndex: 'createDate', width: 180 }
  ];

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Space style={{ marginBottom: 12 }}>
          <Input
            placeholder="用户名／用户操作"
            allowClear
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onPressEnter={() => pl.query({ key: key || undefined })}
            style={{ width: 240 }}
          />
          <Button type="primary" onClick={() => pl.query({ key: key || undefined })}>
            查询
          </Button>
        </Space>
        <Card styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="id"
            size="middle"
            loading={pl.loading}
            columns={columns}
            dataSource={pl.list}
            pagination={paginationProps(pl)}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Col>
    </Row>
  );
}
