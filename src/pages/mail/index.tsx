import { View } from "@tarojs/components";
import "./index.scss";
import JXMailCard, { JXMailCardProps } from "@/components/Cards/JXMailCard";
import { Tabs } from "@taroify/core";
import { MailTabKey } from "@/types/components";
import { useMailTab } from "@/hooks/mail/useMailTab";
import { useDidShow } from "@tarojs/taro";

const MAIL_TAB_CONFIG: Record<MailTabKey, { label: string }> = {
  incomingApplications: { label: "待审批申请" },
  myApplications: { label: "我的申请" },
};

export default function Mail() {
  const { activeMailTabKey, setActiveMailTabKey, mails, fetchMails } =
    useMailTab();

  // 页面出现时，刷新数据
  useDidShow(() => {
    fetchMails(activeMailTabKey);
  });

  return (
    <Tabs
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
                  onStatusChange: () => fetchMails(activeMailTabKey),
                };
                return <JXMailCard {...mailCardData} />;
              })}
            </View>
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
}
