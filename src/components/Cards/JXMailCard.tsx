import JXCardContainer from "../JXCardContainer";
import { Text, View } from "@tarojs/components";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXButton from "../JXButton";
import { Application, ApplicationStatus } from "@/models/application";
import { MOCK_BAND_POSITIONS } from "@/constants/database/band-positions";
import { getSmartTime } from "@/utils/DatetimeHelper";
import { JXColor } from "@/constants/colors/theme";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import JXEmoji from "../JXEmoji";

const MOCK_APPLICATION: Application = {
  _id: 123,
  appliedAt: new Date(2025, 6, 23, 10, 47), // 申请时间
  status: "pending", // 申请状态
  applicantName: "Kyle", // 申请人名称
  applicantPosition: "drummer", // 申请人职位
  bandName: "JOINT", // 乐队名称
  bandPositions: [...MOCK_BAND_POSITIONS.recruiting],
};

const ColorMap: Record<ApplicationStatus, JXColor> = {
  pending: "gray",
  approved: "green",
  rejected: "pink",
};

interface JXMailCardProps {
  application: Application;
}
export default function JXMailCard({
  application = MOCK_APPLICATION,
}: JXMailCardProps) {
  const {
    status,
    appliedAt,
    applicantName,
    applicantPosition,
    bandName,
    bandPositions,
  } = application;

  return (
    <View className="container-v" style={{ gap: 4 }}>
      <View
        className="container-h"
        style={{ justifyContent: "center", paddingTop: 4, paddingBottom: 4 }}
      >
        <View className="">
          <JXSecondaryLabel>{`${getSmartTime(appliedAt)}`}</JXSecondaryLabel>
        </View>
      </View>
      <JXCardContainer color={ColorMap[status]} style={{ gap: 16 }}>
        <View
          className="container-h"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }} className="container-v">
            <JXTitleLabel>{applicantName}</JXTitleLabel>
            <JXBodyLabel>{`${MUSICIAN_DISPLAY[applicantPosition].label} ${MUSICIAN_DISPLAY[applicantPosition].emoji}`}</JXBodyLabel>
          </View>

          <View
            style={{ flex: 1, justifyContent: "center" }}
            className="container-h"
          >
            <JXSecondaryLabel>申请加入乐队</JXSecondaryLabel>
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

        <View
          className="container-h grow"
          style={{ justifyContent: "space-between", gap: 12 }}
        >
          <View className="container-v" style={{ flex: 1 }}>
            <JXButton disabled={status !== "pending"} variant="outlined">
              {status === "rejected" ? "已拒绝" : "拒绝"}
            </JXButton>
          </View>
          <View className="container-v" style={{ flex: 1 }}>
            <JXButton disabled={status !== "pending"}>
              {status === "approved" ? "已同意" : "同意"}
            </JXButton>
          </View>
        </View>
      </JXCardContainer>
    </View>
  );
}
