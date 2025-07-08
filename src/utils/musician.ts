import { getAllMusicians } from "@/services/musicianService";
import { getBandNameMap } from "./band";
import { BandConfig, Musician, MusicianProfile } from "@/models/musician";

interface GetMusicianProfilesParams {
  production?: boolean;
}

// 大体逻辑：获取所有乐手信息，然后以用户为单位对乐手进行分组
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
    const combinedGenres = [...new Set(musicians.flatMap((m) => m.genre))];
    const nickname = musicians[0].nickname ?? "no-musician-profile";
    musicianProfiles.push({ musicians, bandConfigs, nickname, combinedGenres });
  }

  console.log("musicianProfiles", musicianProfiles);
  return musicianProfiles;
};
