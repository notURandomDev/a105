import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import JXMusicianCardSM from "@/components/Cards/JXMusicianCardSM";
import { Image, Loading } from "@taroify/core";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXMusicianCardRC from "@/components/Cards/JXMusicianCardRC";
import { useBandProfile } from "@/hooks/band/useBandProfile";
import { getYMDfromDate } from "@/utils/DatetimeHelper";
import { BandPosition } from "@/models/band-position";
import { PositionType } from "@/models/position";
import { useUserStore } from "@/stores/userStore";
import { matchUserMusician } from "@/utils/musician";
import { createApplication } from "@/services/applicationService";
import { MUSICIAN_DISPLAY_CONFIG } from "@/constants/utils/musician";

export default function BandDetail() {
  useLoad((options: Record<string, string>) => {
    if (!options.bandID) return;
    setBandID(options.bandID);
  });

  const { userInfo } = useUserStore();

  const {
    bandProfile,
    fetchBandProfile,
    applications,
    fetchApplications,
    bandID,
    setBandID,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
  } = useBandProfile();

  // 乐手点击加入乐队按钮
  const handleRcClick = async (
    position: PositionType,
    positionID: string | number
  ) => {
    if (!bandProfile || !userInfo || !bandID) return;

    // 1. 找到匹配用户位置的乐手ID
    const matchedMusician = await matchUserMusician(userInfo._id, position);
    // 如果用户没有该 position 的乐手身份，引导用户创建该乐手身份
    if (!matchedMusician) {
      const positionLabel = MUSICIAN_DISPLAY_CONFIG[position].label;
      const res = await Taro.showModal({
        title: `请创建 「${positionLabel}」 身份`,
        content: `想要以该身份加入乐队，请先完善信息～`,
        confirmText: "前往创建",
      });
      if (res.confirm) Taro.navigateTo({ url: "/pages/musician-edit/index" });
      // 不更新乐队位置信息，提前退出
      return;
    }

    // 2. 发送申请加入乐队的请求
    await createApplication({
      appliedAt: new Date(),
      applyingMusicianID: matchedMusician._id,
      applyingBandPositionID: positionID,
      status: "pending",
      targetBandID: bandProfile.info._id,
      targetBandName: bandProfile.info.name,
    });

    // 3. 刷新乐队档案 + 申请记录信息
    fetchApplications(bandID);
    fetchBandProfile(bandID);

    // 4. 操作成功提示
    Taro.showModal({
      title: "申请成功！",
      content: "请耐心等待乐队成员审核，可在收件箱中查看审批进度",
      confirmText: "我了解了",
    });
  };

  return (
    <View className="band-detail page-padding">
      {bandProfile ? (
        <>
          <Image
            style={{ borderRadius: 16 }}
            height={300}
            width={"100%"}
            mode="aspectFill"
            src={require("../../../assets/grok.jpg")}
          />
          <JXHugeLabel>{bandProfile?.info.name}</JXHugeLabel>
          <JXMetricCard
            label={isRecruiting ? "发布时间" : "成立时间"}
            emoji="🗓️"
            value={
              isRecruiting
                ? getYMDfromDate(
                    bandProfile?.info.statusUpdatedAt
                      ? new Date(bandProfile?.info.statusUpdatedAt)
                      : new Date()
                  )
                : getYMDfromDate(bandProfile?.info.formedAt ?? new Date())
            }
          />

          <JXFormLabel>乐队成员</JXFormLabel>
          <View className="card-gap container-v">
            {(occupiedPositions as BandPosition[]).map((p) => (
              <JXMusicianCardSM musician={p} />
            ))}
          </View>

          {recruitingPositions.length > 0 && (
            <>
              <JXFormLabel>招募乐手位置</JXFormLabel>
              <View className="card-gap container-v">
                {(recruitingPositions as BandPosition[]).map((bp) => {
                  // 判断用户是否不能对该位置重复发送申请
                  // 用户有没有对该位置待审核的申请记录
                  const isLocked = applications
                    .filter((a) => a.status === "pending")
                    .map((a) => a.applyingBandPositionID)
                    .includes(bp._id);

                  return (
                    <JXMusicianCardRC
                      readonly={isLocked}
                      bandPosition={bp}
                      onClick={() => handleRcClick(bp.position, bp._id)}
                    />
                  );
                })}
              </View>
            </>
          )}
        </>
      ) : (
        <Loading />
      )}
    </View>
  );
}
