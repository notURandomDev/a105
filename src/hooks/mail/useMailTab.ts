import { useEffect, useState } from "react";
import { MailTabKey } from "@/types/components";
import { getApplicationsByField } from "@/services/applicationService";
import { extractMusicianBaseBandIDs } from "@/utils/band";
import { mapMusiciansIntoIds } from "@/utils/musician";
import { Musician } from "@/models/musician";
import { Mail } from "@/models/mail";
import { useUserMusicians } from "../musician/useUserMusicians";

const PRODUCTION = true;

export const useMailTab = () => {
  // Tab初始值：待审批申请
  const [activeMailTabKey, setActiveMailTabKey] = useState<MailTabKey>(
    "incomingApplications"
  );
  const [mails, setMails] = useState<Mail[]>([]);

  const { userMusicians } = useUserMusicians();

  // 获取待审批申请（别人申请加入自己的乐队）
  // 用户 -> 乐手 -> 所有用户在的乐队 -> 申请记录 -> 邮件
  const fetchIncomingMails = async (musicians: Musician[]) => {
    const targetBandIDs = extractMusicianBaseBandIDs(musicians); // 获取用户所在的乐队ID
    const applications =
      (await getApplicationsByField({
        field: "targetBandID",
        value: targetBandIDs,
        production: PRODUCTION,
      })) || [];
    return applications.map((a) => ({
      application: a,
      applyingMusician: musicians.find((m) => m._id === a.applyingMusicianID),
    }));
  };

  // 获取我的申请（自己申请加入别人的乐队）
  // 用户 -> 用户的所有乐手身份 -> 申请记录 -> 邮件
  const fetchOutgoingApplications = async (musicians: Musician[]) => {
    const applyingMusicianIDs = mapMusiciansIntoIds(musicians); // 获取用户所有乐手身份的ID
    const applications =
      (await getApplicationsByField({
        field: "applyingMusicianID",
        value: applyingMusicianIDs,
        production: PRODUCTION,
      })) || [];
    return applications.map((a) => ({
      application: a,
      applyingMusician: musicians.find((m) => m._id === a.applyingMusicianID),
    }));
  };

  // 根据所处tab获取乐队数据
  const fetchMails = async (tabKey: MailTabKey) => {
    // 如果用户还没有任何的乐手身份，那么：
    // - 不可能发出申请：在乐队详情界面加入乐队时，会被提示先创建自己的乐手身份
    // - 不可能收到申请：用户必须加入乐队，才能管理乐队；如果没有乐手身份，代表无法加入乐队
    if (!userMusicians.length) return;

    let fetchedMails: Mail[] = [];
    if (tabKey === "myApplications") {
      fetchedMails = (await fetchIncomingMails(userMusicians)) || [];
    }
    if (tabKey === "incomingApplications") {
      fetchedMails = (await fetchOutgoingApplications(userMusicians)) || [];
    }

    setMails(fetchedMails);
  };

  // 监听乐队Tab类型的变化，更新乐队数据
  useEffect(() => {
    fetchMails(activeMailTabKey);
  }, [activeMailTabKey, userMusicians]);

  return {
    activeMailTabKey,
    setActiveMailTabKey,
    mails,
    fetchMails,
  };
};
