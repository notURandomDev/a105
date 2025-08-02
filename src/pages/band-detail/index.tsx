import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import JXMusicianCardSM from "@/components/Cards/JXMusicianCardSM";
import { Image, Loading } from "@taroify/core";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXGenreChip from "@/components/JXGenreChip";
import JXMusicianCardRC from "@/components/Cards/JXMusicianCardRC";
import { useBandProfile } from "@/hooks/useBandProfile";
import { getYMDfromDate } from "@/utils/DatetimeHelper";
import { BandPosition } from "@/models/band-position";
import { useEffect } from "react";
import { PositionType } from "@/models/position";
import { useUserStore } from "@/stores/userStore";
import { matchUserMusician } from "@/utils/musician";
import { createApplication } from "@/services/applicationService";
import { useApplicationStore } from "@/stores/applicationStore";
import { selectApplicationsByUserPendingBp } from "@/selectors/applicationSelectors";
import { useMusiciansWithUser } from "@/hooks/musician/useMusiciansWithUser";

export default function BandDetail() {
  useLoad((options: Record<string, string>) => {
    if (!options.bandID) return;
    setBandID(options.bandID);
  });

  const { userInfo } = useUserStore();
  const { fetchApplications, applications } = useApplicationStore();
  const { userMusicians } = useMusiciansWithUser();

  const {
    band,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
    setBandID,
  } = useBandProfile();

  useEffect(() => {
    let title = "乐队详情";
    if (band?.info.name) title = band.info.name;
    Taro.setNavigationBarTitle({ title });
  }, [band]);

  // 乐手点击加入乐队按钮
  const handleRcClick = async (
    position: PositionType,
    positionID: string | number
  ) => {
    console.log("here");
    if (!band || !userInfo) return;

    // 找到匹配用户位置的乐手ID
    const matchedMusician = await matchUserMusician(userInfo._id, position);
    if (!matchedMusician) return;

    // 发送申请加入乐队的请求
    const res = await createApplication({
      appliedAt: new Date(),
      applyingMusicianID: matchedMusician._id,
      applyingBandPositionID: positionID,
      status: "pending",
      targetBandID: band.info._id,
    });
    if (res) fetchApplications();
  };

  return (
    <View className="band-detail page-padding">
      {band ? (
        <>
          <Image
            style={{ borderRadius: 16 }}
            height={300}
            width={"100%"}
            mode="aspectFill"
            src={require("../../../assets/grok.jpg")}
          />
          <JXHugeLabel>{band?.info.name}</JXHugeLabel>
          <JXMetricCard
            label={isRecruiting ? "发布时间" : "成立时间"}
            emoji="🗓️"
            value={
              isRecruiting
                ? getYMDfromDate(
                    band?.info.statusUpdatedAt
                      ? new Date(band?.info.statusUpdatedAt)
                      : new Date()
                  )
                : getYMDfromDate(band?.info.formedAt ?? new Date())
            }
          />
          <JXFormLabel>乐队风格</JXFormLabel>
          <View className="chip-container">
            {band?.info.genre.map((g) => (
              <JXGenreChip genre={g} />
            ))}
          </View>

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
                  // 判断用户是否申请了该位置
                  const userMusicianIDs = userMusicians.map((um) => um._id);
                  const userApplications = selectApplicationsByUserPendingBp(
                    applications,
                    userMusicianIDs,
                    bp._id
                  );
                  return (
                    <JXMusicianCardRC
                      readonly={userApplications.length > 0}
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
