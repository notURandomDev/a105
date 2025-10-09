export interface User {
  _id: string | number;
  openid?: string;
  avatarUrl?: string | null;
  nickName?: string | null;
  roles?: BandRole[];
}

enum BandRole {
  Drummer = "drummer",
  Guitarist = "guitarist",
  Bassist = "bassist",
  Keyboardist = "keyboardist",
  Vocalist = "vocalist",
}
