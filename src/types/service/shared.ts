export type TcbService<P, R> = (params: P) => TcbServiceResult<R>;

export type TcbRawServiceResult<T> = {
  data: T[];
  hasMore: boolean;
  error: Error | null;
};

export type TcbServiceResult<T> = Promise<TcbRawServiceResult<T>>;

export type JxReqParamsBase = {
  production?: boolean;
  pageIndex?: number;
};
