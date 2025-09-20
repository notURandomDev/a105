import { getMusiciansByUserID } from "@/services/musicianService";
import { BandConfig, Musician, MusicianProfile } from "@/models/musician";
import { PositionType } from "@/models/position";
import { Band } from "@/models/band";
import { generateBandNameMap } from "./band";

// 检查（用户的乐手档案）是否有与（传参位置）相匹配的乐手档案
export const matchUserMusician = async (
  userID: string | number,
  position: PositionType
) => {
  // 获取用户所有的乐手身份
  const musicians = (await getMusiciansByUserID({ userID })) || [];
  // 找到与申请的乐手位置相匹配的乐手身份
  return musicians.find((m) => m.position === position);
};

// 将乐手数组映射成乐手ID（自动去重）
export const mapMusiciansIntoIds = (musicians: Musician[]) => [
  ...new Set(musicians.map((m) => m._id)),
];

// 将乐手数组映射成乐手位置（自动去重）
export const mapMusiciansIntoPositions = (musicians: Musician[]) => [
  ...new Set(musicians.map((m) => m.position)),
];

// 根据用户对乐手身份进行分组
export const aggregateMusicianProfiles = (
  musicians: Musician[],
  bands: Band[]
): MusicianProfile[] => {
  // 对乐手数据根据用户进行分组
  const userGroup = musicians.reduce<Record<string, Musician[]>>(
    (acc, musician) => {
      const { userID } = musician;
      if (!acc[userID]) acc[userID] = [];
      acc[userID].push(musician);
      return acc;
    },
    {}
  );

  // 获取所有乐手所在的所有乐队ID（未去重）
  const bandIDs = musicians.flatMap((mp) => mp.bandIDs);
  // 获取所有（乐队ID -> 乐队名）的映射
  const bandNameMap = generateBandNameMap(bands, bandIDs);

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
