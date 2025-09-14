import { Band } from "@/models/band";
import { BandConfig, Musician, MusicianProfile } from "@/models/musician";
import { PositionType } from "@/models/position";
import { selectBandNamesByIDs } from "./bandSelectors";
import { useMusicianStore } from "@/stores/musicianStore";

export const selectMusiciansByUser = (
  musicians: Musician[],
  userID: string | number
) => musicians.filter((m) => m.userID === userID);

export const selectMusiciansWithPositions = (
  musicians: Musician[],
  positions: PositionType[]
) => musicians.filter((m) => positions.includes(m.position));

// 根据用户对乐手身份进行分组
export const selectMusicianProfiles = (
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
  const bandNameMap = selectBandNamesByIDs(bands, bandIDs);

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

// 查找某用户某职位的乐手身份
export const selectMatchingMusician = (
  userID: string | number,
  position: PositionType
) => {
  const allMusicians = useMusicianStore.getState().musicians;
  const match = allMusicians.find(
    (m) => m.position === position && m.userID === userID
  );
  return match;
};

// [snapshot] 根据乐手 ID 选中乐手
export const selectMusicianByID = (musicianID: string | number) => {
  const allMusicians = useMusicianStore.getState().musicians;
  return allMusicians.find((m) => m._id === musicianID);
};
