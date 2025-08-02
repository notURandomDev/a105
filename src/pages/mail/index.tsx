import { View } from "@tarojs/components";
import "./index.scss";
import JXMailCard, { JXMailCardProps } from "@/components/Cards/JXMailCard";
import { selectBandByID } from "@/selectors/bandSelectors";
import { selectPositionsByBand } from "@/selectors/bandPositionSelectors";
import { useBandPositionStore } from "@/stores/bandPositionStore";
import { selectMusicianByID } from "@/selectors/musicianSelectors";
import { Tabs } from "@taroify/core";
import { useApplicationData } from "@/hooks/application/useApplicationData";
import { useState } from "react";
import { selectApplicationsByTime } from "@/selectors/applicationSelectors";

export type MailTab = "incomingApplications" | "myApplications";

const MAIL_TABS: { value: MailTab; label: string }[] = [
  { value: "incomingApplications", label: "待审批申请" },
  { value: "myApplications", label: "我的申请" },
];

export default function Mail() {
  const allBandPositions = useBandPositionStore((s) => s.bandPositions);

  const { myApplications, incomingApplications, allBands } =
    useApplicationData();
  const [activeTab, setActiveTab] = useState<MailTab>("myApplications");

  return (
    <Tabs
      value={activeTab}
      onChange={setActiveTab}
      sticky
      lazyRender
      animated
      swipeable
    >
      {MAIL_TABS.map((tab) => {
        const isIncomingApplicationsTab = tab.value === "incomingApplications";
        const applicationData = selectApplicationsByTime(
          isIncomingApplicationsTab ? incomingApplications : myApplications
        );

        return (
          <Tabs.TabPane
            value={tab.value}
            title={tab.label}
            className="tab-pane"
          >
            <View
              className="tab-container"
              style={{ paddingLeft: 24, paddingRight: 24 }}
            >
              {applicationData.map((application) => {
                const bandID = application.targetBandID;
                const applyingMusician = selectMusicianByID(
                  application.applyingMusicianID
                );
                const band = selectBandByID(allBands, bandID);

                if (!band || !applyingMusician) return;
                const bandPositions = selectPositionsByBand(
                  allBandPositions,
                  bandID
                );
                const { nickname, position } = applyingMusician;
                const mailCardData: JXMailCardProps = {
                  application,
                  bandName: band.name,
                  bandPositions,
                  applicantName: nickname,
                  applicantPosition: position,
                  readonly: !isIncomingApplicationsTab,
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
