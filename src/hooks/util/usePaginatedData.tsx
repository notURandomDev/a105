import { TcbServiceResult } from "@/types/service/shared";
import { useState } from "react";

interface PaginatedData<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    pageIndex: number;
  };
}

interface FetchPaginatedDataParams<T> {
  // 是否启用自动分页，获取下一页数据
  autoPagination?: boolean;
  // 外部定义的回调函数
  fetchFn: (pageIndex: number) => TcbServiceResult<T>;
}

const createDefaultData = <T,>() => ({
  data: [] as T[],
  pagination: {
    hasMore: false,
    pageIndex: 0,
  },
});

export const usePaginatedData = <T,>() => {
  const [paginatedData, setPaginatedData] = useState<PaginatedData<T>>(
    createDefaultData<T>()
  );

  const fetchPaginatedData = async (params: FetchPaginatedDataParams<T>) => {
    const { autoPagination = false, fetchFn } = params;

    const pageIndex = autoPagination ? paginatedData.pagination.pageIndex : 0;

    // `fetchFn` 通常包含 API 请求函数
    const fetchedData = await fetchFn(pageIndex);
    const { data, hasMore } = fetchedData;

    setPaginatedData((prev) => {
      const newData = autoPagination ? [...prev.data, ...data] : data;
      const pagination = { hasMore, pageIndex: pageIndex + 1 };
      return { data: newData, pagination };
    });
  };

  return { data: paginatedData, fetchPaginatedData };
};
