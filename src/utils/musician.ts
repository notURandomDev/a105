import { getAllMusicians } from "@/services/musicianService";
import { getBandNameMap } from "./band";
import { BandConfig, Musician, MusicianProfile } from "@/models/musician";
import { PositionType } from "@/models/position";
import { selectMatchingMusician } from "@/selectors/musicianSelectors";
import Taro from "@tarojs/taro";

interface GetMusicianProfilesParams {
  production?: boolean;
}

// [含API请求] 大体逻辑：获取所有乐手信息，然后以用户为单位对乐手进行分组
export const getMusicianProfiles = async ({
  production = false,
}: GetMusicianProfilesParams = {}) => {
  if (!production) return;

  // 获取全部乐手数据
  const musicians = await getAllMusicians({ production: true });
  if (!musicians) return;

  // 对乐手数据根据用户进行分组
  const userGroup = musicians.reduce<Record<string, Musician[]>>(
    (acc, musician) => {
      const { userID } = musician;
      if (!acc[userID]) {
        acc[userID] = [];
      }
      acc[userID].push(musician);
      return acc;
    },
    {}
  );

  // 获取所有乐手所在的所有乐队ID
  const bandIDs = musicians.flatMap((mp) => mp.bandIDs);
  // 获取所有（乐队ID -> 乐队名）的映射
  const bandNameMap = await getBandNameMap(bandIDs);
  if (!bandNameMap) return;

  // 对于每一个用户，生成一份乐手档案
  let musicianProfiles: MusicianProfile[] = [];
  for (const [_userID, musicians] of Object.entries(userGroup)) {
    const bandConfigs: BandConfig[] = musicians
      .filter(({ bandIDs }) => bandIDs.length)
      .flatMap(
        // 遍历每个乐手 (musician)
        ({ bandIDs, position }) =>
          // 遍历每个乐手的每个乐队(bandID)
          bandIDs.map<BandConfig>((bandID) =>
            // 将每个乐队的ID，映射成一个 bandConfig 对象
            ({
              bandID,
              position,
              bandName: bandNameMap.get(bandID) ?? "乐队名不存在，这不太可能",
            })
          )
      );
    const nickname = musicians[0].nickname ?? "no-musician-profile";
    musicianProfiles.push({ musicians, bandConfigs, nickname });
  }

  return musicianProfiles;
};

// 【快照】检查（用户的乐手档案）是否有与（传参位置）相匹配的乐手档案
export const matchUserMusician = async (
  userID: string | number,
  position: PositionType
) => {
  // 判断根据用户的乐手数据，选择相应的乐手档案（获取到乐手ID）
  const match = selectMatchingMusician(userID, position);
  if (match) return match;

  // 如果用户没有该 position 的乐手身份，应该引导用户创建该乐手身份；不能直接更新乐队位置信息
  const res = await Taro.showModal({
    title: "你暂时还没有该乐手身份",
    content: "请先完善乐手信息",
    confirmText: "前往完善",
  });
  if (res.confirm) Taro.navigateTo({ url: "/pages/musician-edit/index" });
  return;
};
