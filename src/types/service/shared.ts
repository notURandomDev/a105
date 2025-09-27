export type TcbService<P, R> = (params: P) => TcbServiceResult<R>;

export type TcbServiceResult<T> = Promise<{
  data: T[];
  hasMore: boolean;
  error: Error | null;
}>;

export type JxReqParamsBase = {
  production?: boolean;
  pageIndex?: number;
};
