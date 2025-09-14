import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { Musician, MusicianProfile } from "@/models/musician";
import { selectMusicianProfiles } from "@/selectors/musicianSelectors";
import { getMusiciansByUserID } from "@/services/musicianService";
import { getMusicianBaseBands } from "@/utils/band";

export const useMusicianProfile = () => {
  const [userID, setUserID] = useState<string | null>(null);
  const [musicianProfile, setMusicianProfile] =
    useState<MusicianProfile | null>(null);

  // 1. 获取用户所有的乐手身份
  const fetchMusicians = async (userID: string | number) => {
    const musicians = await getMusiciansByUserID({ userID });
    return musicians;
  };

  // 2. 获取用户所在的乐队
  const fetchBands = async (musicians: Musician[]) => {
    const bands = await getMusicianBaseBands(musicians);
    return bands;
  };

  // 3. 聚合乐手和乐队实体
  // 主要是为了得到 bandConfigs，展示用户在不同乐队中的乐手位置
  const aggregateMusicianProfile = async (userID: string | number) => {
    const musicians = (await fetchMusicians(userID)) || [];
    const bands = (await fetchBands(musicians)) || [];

    setPageTitle(musicians[0].nickname);

    const musicianProfile = selectMusicianProfiles(musicians, bands);
    setMusicianProfile(musicianProfile[0]);
  };

  useEffect(() => {
    if (!userID) return;
    aggregateMusicianProfile(userID);
  }, [userID]);

  // 设置页面标题
  const setPageTitle = (nickName: string) =>
    Taro.setNavigationBarTitle({
      title: "乐手档案｜" + nickName,
    });

  return { userID, setUserID, musicianProfile };
};
