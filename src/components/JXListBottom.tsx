import { Divider, Loading } from "@taroify/core";
import JXButton from "./JXButton";

interface JXListBottomProps {
  // 状态
  hasMore: boolean;
  loading: boolean;
  // 回调函数
  onFetchMore: () => void;
  // 文案
  loadingText?: string;
  loadedText?: string;
  loadMoreText?: string;
}

const JXListBottom = (props: JXListBottomProps) => {
  const { hasMore = false, loading = false, onFetchMore } = props;

  const loadMoreText = props.loadMoreText ?? "加载更多";
  const loadedText = props.loadedText ?? "已加载全部数据";
  const loadingText = props.loadingText ?? "加载中...";

  if (!hasMore) return <Divider>{loadedText}</Divider>;

  return (
    <JXButton fullWidth disabled={loading} onClick={onFetchMore}>
      {loading ? <Loading size={12}>{loadingText}</Loading> : loadMoreText}
    </JXButton>
  );
};

export default JXListBottom;
