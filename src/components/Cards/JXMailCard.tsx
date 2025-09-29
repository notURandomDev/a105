import JXCardContainer from "../JXCardContainer";
import { View } from "@tarojs/components";
import JXBodyLabel from "../Labels/JXBodyLabel";
import JXTitleLabel from "../Labels/JXTitleLabel";
import JXSecondaryLabel from "../Labels/JXSecondaryLabel";
import JXButton from "../JXButton";
import { Application, ApplicationStatus } from "@/models/application";
import { getSmartTime } from "@/utils/DatetimeHelper";
import { JXColor } from "@/constants/colors/theme";
import { MUSICIAN_DISPLAY_CONFIG } from "@/constants/utils/musician";
import { PositionType } from "@/models/position";
import { updateApplicationStatus } from "@/services/applicationService";
import {
  getBandPositionsByBand,
  updateBandPosition,
} from "@/services/bandPositionService";
import { updateMusicianBandIDs } from "@/services/musicianService";
import { isBandFull } from "@/utils/band";
import { getBandById, updateBand } from "@/services/bandsService";

const ColorMap: Record<ApplicationStatus, JXColor> = {
  pending: "gray",
  approved: "green",
  rejected: "pink",
};

export interface JXMailCardProps {
  application: Application;
  applicantName: string;
  applicantPosition: PositionType;
  readonly?: boolean;
  onStatusChange: () => void;
}
export default function JXMailCard({
  application,
  applicantName,
  applicantPosition,
  readonly = false,
  onStatusChange,
}: JXMailCardProps) {
  const { status, appliedAt, _id, targetBandID } = application;

  // ✅ 审批申请：同意
  const handleApprove = async () => {
    // 1. [Application] 更新申请记录的状态（已通过）
    await updateApplicationStatus({ applicationID: _id, status: "approved" });

    // 2. [Musician] 更新乐手所在乐队信息（ bandIDs列表中添加一项 ）
    await updateMusicianBandIDs({
      _id: application.applyingMusicianID,
      bandID: targetBandID,
    });

    // 3. [BandPosition] 更新乐队位置信息（ recruiting -> occupied ）
    await updateBandPosition({
      _id: application.applyingBandPositionID,
      data: {
        joinedAt: new Date(),
        status: "occupied",
        nickname: applicantName,
        musicianID: application.applyingMusicianID,
      },
    });

    // 4. [BandPosition] 查询更新乐队位置信息后，该乐队最新的乐队位置信息情况
    const bandPositions =
      (await getBandPositionsByBand({ bandID: targetBandID })) || [];

    // 5. ^[Band] 可选，判断是否需要更新乐队状态
    // 同意申请的前提，是乐队还有空余的位置；因此状态肯定是 recruiting 而不是 active
    if (isBandFull(bandPositions)) {
      // 5.1. 获取乐队信息(statusLogs历史)
      const band = await getBandById({ _id: targetBandID });
      if (!band) return;

      // 5.2. 更新乐队信息
      const now = new Date();
      await updateBand({
        bandID: targetBandID,
        data: {
          formedAt: now,
          status: "active",
          statusLogs: [{ at: now, status: "active" }, ...band.statusLogs],
          statusUpdatedAt: now,
        },
      });
    }

    // 6. 事件上抛给邮箱页面，更新数据
    onStatusChange();
  };

  // ❌ 审批申请：拒绝
  const handleReject = async () => {
    // 1. 更新申请记录的状态（已拒绝）
    await updateApplicationStatus({ applicationID: _id, status: "rejected" });
    // 2. 更新数据（上抛给邮箱页面）
    onStatusChange();
  };

  // CTA按钮文案
  const getReadonlyButtonTitle = () => {
    if (status === "approved") return "已通过";
    if (status === "rejected") return "未通过";
    return "审核中";
  };

  const renderButton = () => {
    if (readonly) {
      return (
        <JXButton
          disabled
          variant={status === "pending" ? "outlined" : "solid"}
        >
          {getReadonlyButtonTitle()}
        </JXButton>
      );
    } else {
      return (
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
      );
    }
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
            <JXBodyLabel>{`${MUSICIAN_DISPLAY_CONFIG[applicantPosition].label} ${MUSICIAN_DISPLAY_CONFIG[applicantPosition].emoji}`}</JXBodyLabel>
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
            <JXTitleLabel>{application.targetBandName}</JXTitleLabel>
          </View>
        </View>
        {/* 根据不同情况，渲染按钮组件 */}
        {renderButton()}
      </JXCardContainer>
    </View>
  );
}
