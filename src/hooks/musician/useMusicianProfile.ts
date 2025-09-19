import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { Musician, MusicianProfile } from "@/models/musician";
import { getMusicianBaseBands } from "@/utils/band";
import { aggregateMusicianProfiles } from "@/utils/musician";
import { useUserMusicians } from "../user/useUserMusicians";

export const useMusicianProfile = () => {
  const [userID, setUserID] = useState<string | number | null>(null);
  const [musicianProfile, setMusicianProfile] =
    useState<MusicianProfile | null>(null);

  // 1. 获取用户所有的乐手身份
  const { userMusicians } = useUserMusicians();

  // 2. 获取用户所在的乐队
  const fetchBands = async (musicians: Musician[]) => {
    const bands = await getMusicianBaseBands(musicians);
    return bands;
  };

  // 3. 聚合乐手和乐队实体
  // 主要是为了得到 bandConfigs，展示用户在不同乐队中的乐手位置
  const aggregateMusicianProfile = async () => {
    const bands = (await fetchBands(userMusicians)) || [];
    setPageTitle(userMusicians[0].nickname);
    const musicianProfile = aggregateMusicianProfiles(userMusicians, bands);
    setMusicianProfile(musicianProfile[0]);
  };

  useEffect(() => {
    aggregateMusicianProfile();
  }, [userMusicians]);

  // 设置页面标题
  const setPageTitle = (nickName: string) =>
    Taro.setNavigationBarTitle({
      title: "乐手档案｜" + nickName,
    });

  return { userID, setUserID, musicianProfile };
};
