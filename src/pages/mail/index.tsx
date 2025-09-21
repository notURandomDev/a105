import { View } from "@tarojs/components";
import "./index.scss";
import JXMailCard, { JXMailCardProps } from "@/components/Cards/JXMailCard";
import { Divider, Loading, Tabs } from "@taroify/core";
import { MailTabKey } from "@/types/components";
import { DefaultMailTabKey, useMailTab } from "@/hooks/mail/useMailTab";
import { useDidShow } from "@tarojs/taro";
import { useState } from "react";
import JXButton from "@/components/JXButton";

const MAIL_TAB_CONFIG: Record<MailTabKey, { label: string }> = {
  incomingApplications: { label: "待审批申请" },
  myApplications: { label: "我的申请" },
};

export default function MailPage() {
  const { activeMailTabKey, setActiveMailTabKey, mailsData, fetchMails } =
    useMailTab();

  const [loading, setLoading] = useState(false);

  const {
    mails,
    pagination: { hasMore },
  } = mailsData;

  // 页面出现时，刷新数据；不进行自动分页
  useDidShow(() => {
    fetchMails(false);
  });

  // 点击按钮，加载更多数据
  const handleFetchMoreData = async () => {
    setLoading(true);
    await fetchMails();
    setLoading(false);
  };

  // 根据不同场景，返回不同的底部组件
  const Bottom = () => {
    if (!hasMore) return <Divider>已加载全部数据</Divider>;

    return (
      <JXButton disabled={loading} onClick={handleFetchMoreData}>
        {loading ? <Loading size={12}>加载中...</Loading> : "加载更多申请记录"}
      </JXButton>
    );
  };

  return (
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
          <Tabs.TabPane
            value={tabKey}
            title={config.label}
            className="tab-pane"
          >
            <View
              className="tab-container"
              style={{ paddingLeft: 24, paddingRight: 24 }}
            >
              {mails.map((mail) => {
                const { application, applyingMusician } = mail;
                const mailCardData: JXMailCardProps = {
                  application,
                  applicantName: applyingMusician?.nickname || "applicantName", // 为application实体添加冗余字段处理
                  applicantPosition: applyingMusician?.position || "bassist",
                  readonly,
                  onStatusChange: () => fetchMails(),
                };
                return <JXMailCard {...mailCardData} />;
              })}
              <Bottom />
            </View>
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
}
