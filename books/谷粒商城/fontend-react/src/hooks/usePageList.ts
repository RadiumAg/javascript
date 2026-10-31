import { useCallback, useEffect, useState } from 'react';
import type { PageRes } from '@/types';

export interface PageResult<T> {
  list: T[];
  total: number;
}

/** 列表接口函数：renrenApi.userList 这类，入参是 {page, limit, ...过滤条件} */
export type PageFetcher<T> = (params: Record<string, any>) => Promise<PageRes<T>>;

/**
 * 列表页通用分页 hook（对应各 Vue 页面的 getDataList + dataForm.page/limit）
 * 传接口函数而不是 URL，URL 和响应类型都由 api 层持有
 */
export function usePageList<T = Record<string, any>>(
  fetcher: PageFetcher<T>,
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
        const data = await fetcher({ page: p, limit: l, ...f });
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
    [fetcher, page, limit, filter]
  );

  useEffect(() => {
    if (opts.immediate !== false) void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

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
