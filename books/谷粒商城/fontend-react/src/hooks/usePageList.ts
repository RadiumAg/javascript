import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '@/api/http';
import type { PageData, R } from '@/types';

export interface PageResult<T> {
  list: T[];
  total: number;
}

/**
 * 列表页通用分页 hook（对应各 Vue 页面的 getDataList + dataForm.page/limit）
 * fetcher 接收 {page, limit, ...filter}，返回 page.list/totalCount
 */
export function usePageList<T = Record<string, any>>(
  url: string,
  filter: Record<string, any> = {},
  opts: { immediate?: boolean; defaultLimit?: number } = {}
) {
  const [list, setList] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(opts.defaultLimit ?? 10);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (p = page, l = limit, f = filter) => {
      setLoading(true);
      try {
        const data = await apiGet<R & { page?: PageData<T> }>(url, { page: p, limit: l, ...f });
        if (data && data.code === 0 && data.page) {
          setList(data.page.list ?? []);
          setTotal(data.page.totalCount ?? 0);
        } else {
          setList([]);
          setTotal(0);
        }
      } finally {
        setLoading(false);
      }
    },
    [url, page, limit, filter]
  );

  useEffect(() => {
    if (opts.immediate !== false) void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const query = (f = filter) => {
    setPage(1);
    void fetchData(1, limit, f);
  };

  return {
    list,
    total,
    page,
    limit,
    loading,
    refresh: () => fetchData(page, limit, filter),
    onPageChange: (p: number, l: number) => {
      const np = l !== limit ? 1 : p;
      setPage(np);
      setLimit(l);
      void fetchData(np, l, filter);
    },
    query
  };
}

export const paginationProps = (pl: {
  total: number;
  page: number;
  limit: number;
  onPageChange: (p: number, l: number) => void;
}) => ({
  current: pl.page,
  pageSize: pl.limit,
  total: pl.total,
  showTotal: (t: number) => `共 ${t} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: [10, 20, 50, 100],
  onChange: pl.onPageChange
});
