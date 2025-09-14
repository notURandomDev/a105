// 仅在前端存在的实体（Application + Musician）

import { Application } from "./application";
import { Musician } from "./musician";

export interface Mail {
  application: Application;
  applyingMusician?: Musician;
}
