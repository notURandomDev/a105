// 已废弃，使用 useMailTab.ts

import { Application } from "@/models/application";
import {
  selectApplicationsByBands,
  selectApplicationsByMusicians,
} from "@/selectors/applicationSelectors";
import { useEffect, useState } from "react";
import { useApplicationStore } from "@/stores/applicationStore";
import { useMusiciansWithUser } from "../musician/useMusiciansWithUser";
import { useBandStore } from "@/stores/bandStore";
import { useBandsWithUser } from "../band/useBandsWithUser";

export const useApplicationData = () => {
  const allBands = useBandStore((s) => s.bands);
  const userBands = useBandsWithUser();
  const { userMusicians } = useMusiciansWithUser();
  const { applications } = useApplicationStore();

  // 用户发起的申请
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  // 待审批的申请
  const [incomingApplications, setIncomingApplications] = useState<
    Application[]
  >([]);

  // 响应：待审核申请
  // 条件：只审核用户所在的乐队相关的申请
  useEffect(() => {
    const filteredApplications = selectApplicationsByBands(
      applications,
      userBands
    );
    if (!filteredApplications.length) return;
    setIncomingApplications(filteredApplications);
  }, [allBands, applications]);

  // 响应：我的申请
  // 条件：只显示由用户乐手身份发出的申请
  useEffect(() => {
    const filteredApplications = selectApplicationsByMusicians(
      applications,
      userMusicians
    );
    if (!filteredApplications) return;
    setMyApplications(filteredApplications);
  }, [applications, userMusicians]);

  return { myApplications, incomingApplications, allBands };
};
