import JXCardContainer from "../JXCardContainer";
import { Text, View } from "@tarojs/components";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXButton from "../JXButton";
import { Application, ApplicationStatus } from "@/models/application";
import { getSmartTime } from "@/utils/DatetimeHelper";
import { JXColor } from "@/constants/colors/theme";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { BandPosition } from "@/models/band-position";
import { PositionType } from "@/models/position";
import { updateApplicationStatus } from "@/services/applicationService";
import { useApplicationStore } from "@/stores/applicationStore";
import { useJoinBand } from "@/hooks/band/useJoinBand";

const ColorMap: Record<ApplicationStatus, JXColor> = {
  pending: "gray",
  approved: "green",
  rejected: "pink",
};

export interface JXMailCardProps {
  application: Application;
  bandName: string;
  bandPositions: BandPosition[];
  applicantName: string;
  applicantPosition: PositionType;
  readonly?: boolean;
}
export default function JXMailCard({
  application,
  bandName,
  bandPositions,
  applicantName,
  applicantPosition,
  readonly = false,
}: JXMailCardProps) {
  const { status, appliedAt, _id } = application;

  const { fetchApplications } = useApplicationStore();
  const joinBand = useJoinBand();

  const handleApprove = async () => {
    // 更新申请记录的状态（已通过）
    await updateApplicationStatus({
      applicationID: _id,
      status: "approved",
    });

    // 加入乐队
    const { applyingMusicianID, applyingBandPositionID, targetBandID } =
      application;
    await joinBand(applyingMusicianID, applyingBandPositionID, targetBandID);

    // 更新全局缓存数据
    fetchApplications();
  };

  const handleReject = async () => {
    const res = await updateApplicationStatus({
      applicationID: _id,
      status: "rejected",
    });
    if (res) fetchApplications();
  };

  const getReadonlyButtonTitle = () => {
    if (status === "approved") return "已通过";
    if (status === "rejected") return "未通过";
    return "审核中";
  };

  return (
    <View className="container-v" style={{ gap: 4 }}>
      <View
        className="container-h"
        style={{ justifyContent: "center", paddingTop: 4, paddingBottom: 4 }}
      ></View>
      <JXCardContainer color={ColorMap[status]} style={{ gap: 16 }}>
        <View
          className="container-h"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }} className="container-v">
            <JXTitleLabel>{readonly ? "我" : applicantName}</JXTitleLabel>
            <JXBodyLabel>{`${MUSICIAN_DISPLAY[applicantPosition].label} ${MUSICIAN_DISPLAY[applicantPosition].emoji}`}</JXBodyLabel>
          </View>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            className="container-v"
          >
            <JXSecondaryLabel>申请加入乐队</JXSecondaryLabel>
            <JXSecondaryLabel>{`${getSmartTime(appliedAt)}`}</JXSecondaryLabel>
          </View>

          <View
            className="container-v"
            style={{ alignItems: "flex-end", flex: 1 }}
          >
            <JXTitleLabel>{bandName}</JXTitleLabel>
            <View className="container-h" style={{ gap: 6 }}>
              {bandPositions.map((bp) => (
                <Text
                  style={{
                    fontSize: 12,
                    filter: `grayscale(${bp.status === "occupied" ? 100 : 0}%)`,
                  }}
                >
                  {MUSICIAN_DISPLAY[bp.position].emoji}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {readonly ? (
          <JXButton
            disabled
            variant={status === "pending" ? "outlined" : "solid"}
          >
            {getReadonlyButtonTitle()}
          </JXButton>
        ) : (
          <View
            className="container-h grow"
            style={{ justifyContent: "space-between", gap: 12 }}
          >
            <View className="container-v" style={{ flex: 1 }}>
              <JXButton
                onClick={handleReject}
                disabled={status !== "pending"}
                variant="outlined"
              >
                {status === "rejected" ? "已拒绝" : "拒绝"}
              </JXButton>
            </View>
            <View className="container-v" style={{ flex: 1 }}>
              <JXButton onClick={handleApprove} disabled={status !== "pending"}>
                {status === "approved" ? "已同意" : "同意"}
              </JXButton>
            </View>
          </View>
        )}
      </JXCardContainer>
    </View>
  );
}
