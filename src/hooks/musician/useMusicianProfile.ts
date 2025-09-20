import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { MusicianProfile } from "@/models/musician";
import { aggregateMusicianProfiles } from "@/utils/musician";
import { useUserBands } from "../user/useUserBands";

export const useMusicianProfile = () => {
  const [musicianProfile, setMusicianProfile] =
    useState<MusicianProfile | null>(null);

  // 1. 获取用户所有的乐手身份 + 所在的乐队
  const { userBands, userMusicians } = useUserBands();

  useEffect(() => {
    if (!userMusicians.length || !userBands.length) return;

    // 2. 聚合乐手和乐队实体
    // 主要是为了得到 bandConfigs，展示用户在不同乐队中的乐手位置
    const aggregateMusicianProfile = async () => {
      setPageTitle(userMusicians[0].nickname);
      const musicianProfile = aggregateMusicianProfiles(
        userMusicians,
        userBands
      );
      setMusicianProfile(musicianProfile[0]);
    };

    aggregateMusicianProfile();
  }, [userMusicians, userBands]);

  // 设置页面标题
  const setPageTitle = (nickName: string) =>
    Taro.setNavigationBarTitle({
      title: "乐手档案｜" + nickName,
    });

  return { musicianProfile };
};
