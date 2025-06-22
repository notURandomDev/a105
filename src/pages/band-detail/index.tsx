import { View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import JXMusicianCardSM from "@/components/Cards/JXMusicianCardSM";
import { Image } from "@taroify/core";
import JXHugeLabel from "@/components/Labels/JXHugeLabel";
import JXMetricCard from "@/components/Cards/JXMetricCard";
import JXGenreChip from "@/components/JXGenreChip";
import JXMusicianCardRC from "@/components/Cards/JXMusicianCardRC";
import { useBandProfile } from "@/hooks/useBandProfile";
import { getYMDfromDate } from "@/utils/DatetimeHelper";
import { BandPosition } from "@/models/band-position";
import { useEffect } from "react";

export default function BandDetail() {
  useLoad((options: Record<string, string>) => {
    const parsedBand = JSON.parse(options.band);
    setTimeout(() => setBand(parsedBand), 500);
  });

  const {
    band,
    setBand,
    isRecruiting,
    recruitingPositions,
    occupiedPositions,
  } = useBandProfile();

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "乐队档案" + `｜${band?.info.name ?? ""}`,
    });
  }, [band]);

  return (
    <View className="band-detail page-padding">
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
            {(recruitingPositions as BandPosition[]).map((p) => (
              <JXMusicianCardRC musician={p} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}
