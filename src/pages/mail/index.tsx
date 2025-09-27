import { ScrollView, View } from "@tarojs/components";
import "./index.scss";
import JXMailCard, { JXMailCardProps } from "@/components/Cards/JXMailCard";
import { PullRefresh, Tabs } from "@taroify/core";
import { MailTabKey } from "@/types/components";
import { DefaultMailTabKey, useMailTab } from "@/hooks/mail/useMailTab";
import { useDidShow, usePageScroll } from "@tarojs/taro";
import { useState } from "react";
import JXListBottom from "@/components/JXListBottom";
import { useMutexLoad } from "@/hooks/util/useMutexLoad";

const MAIL_TAB_CONFIG: Record<MailTabKey, { label: string }> = {
  incomingApplications: { label: "待审批申请" },
  myApplications: { label: "我的申请" },
};

export default function MailPage() {
  const {
    activeMailTabKey,
    setActiveMailTabKey,
    mailsData,
    fetchMails,
    fetchUserMusicians,
    disablePagination,
  } = useMailTab();

  const [reachTop, setReachTop] = useState(true);
  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  const { mails } = mailsData;

  // 页面出现时，刷新数据；不进行自动分页
  useDidShow(() => {
    // 用户离开邮箱界面之后，有可能去创建了乐队
    // 这就导致用户的乐手身份数据有可能过时了
    disablePagination();
    fetchUserMusicians();
  });

  const { mutexLoad: mutexFetchMore, loading: fetchingMore } = useMutexLoad();
  const { mutexLoad: mutexPullRefresh, loading: pullRefreshing } =
    useMutexLoad();

  // 点击按钮，加载更多数据
  const handleFetchMoreData = async () => {
    mutexFetchMore(() => fetchMails());
  };

  // 下拉刷新，重新获取第一页的数据
  const handlePullRefresh = async () => {
    mutexPullRefresh(() => {
      disablePagination();
      return fetchMails();
    });
  };

  // 审批状态更新，重新获取第一页数据
  const handleStatusChange = () => {
    disablePagination();
    fetchMails();
  };

  return (
    <View className="mail page">
      <View className="flex">
        <Tabs
          defaultValue={DefaultMailTabKey}
          value={activeMailTabKey}
          onChange={setActiveMailTabKey}
          sticky
          lazyRender
          animated
          swipeable
        >
          {Object.entries(MAIL_TAB_CONFIG).map(([tabKey, config]) => {
            const readonly = tabKey === "myApplications";
            return (
              <Tabs.TabPane value={tabKey} title={config.label}>
                <ScrollView scrollY className="scrollable">
                  <PullRefresh
                    className="tab-container page-padding-compensate"
                    loading={pullRefreshing}
                    reachTop={reachTop}
                    onRefresh={handlePullRefresh}
                  >
                    {mails.map((mail) => {
                      const { application, applyingMusician } = mail;
                      const mailCardData: JXMailCardProps = {
                        application,
                        applicantName:
                          applyingMusician?.nickname || "applicantName", // 为application实体添加冗余字段处理
                        applicantPosition:
                          applyingMusician?.position || "bassist",
                        readonly,
                        onStatusChange: handleStatusChange,
                      };
                      return <JXMailCard {...mailCardData} />;
                    })}
                    <View className="flex grow" style={{ paddingTop: 12 }}>
                      <JXListBottom
                        loadMoreText="加载更多申请记录"
                        loading={fetchingMore}
                        onFetchMore={handleFetchMoreData}
                        hasMore={mailsData.pagination.hasMore}
                      />
                    </View>
                  </PullRefresh>
                </ScrollView>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </View>
    </View>
  );
}
