export interface User {
  _id: string | number;
  openid?: string;
  avatarFileID?: string | null;
  avatarUrl?: string | null;
  nickName?: string | null;
  bandIDs?: string[];
  roles?: BandRole[];
}

enum BandRole {
  Drummer = "drummer",
  Guitarist = "guitarist",
  Bassist = "bassist",
  Keyboardist = "keyboardist",
  Vocalist = "vocalist",
}
