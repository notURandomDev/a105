export type PaginatedState = {
  pagination: {
    hasMore: boolean; // 用于判断是否展示 [获取更多数据] 的 CTA 按钮
    pageIndex: number; // 作为请求参数值
  };
};

export type FormItemStatus = "new" | "edited" | "pristine";
