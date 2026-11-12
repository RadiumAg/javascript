import { useState } from 'react';
import { useMount } from 'ahooks';
import { gulimallApi } from '@/api';
import type { WareInfo } from '@/types';

/** 仓库下拉选项 + id→仓库名，库存/采购需求/采购单三个页面共用 */
export function useWareOptions() {
  const [wares, setWares] = useState<WareInfo[]>([]);

  useMount(() => {
    gulimallApi.wareInfoList({ page: 1, limit: 500 }).then((res) => {
      if (res.code === 0) setWares(res.page?.list ?? []);
    });
  });

  return {
    wares,
    options: wares.map((w) => ({ value: w.id, label: w.name })),
    wareName: (id?: number) => wares.find((w) => w.id === id)?.name ?? (id == null ? '-' : String(id)),
  };
}
