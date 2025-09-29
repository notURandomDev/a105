import { useEffect, useState } from "react";
import { MailTabKey } from "@/types/components";
import { getApplicationsByField } from "@/services/applicationService";
import { extractMusicianBaseBandIDs } from "@/utils/band";
import { mapMusiciansIntoIds } from "@/utils/musician";
import { Mail } from "@/models/mail";
import { useUserMusicians } from "../user/useUserMusicians";
import { Musician } from "@/models/musician";
import { usePaginatedData } from "../util/usePaginatedData";

export const DefaultMailTabKey: MailTabKey = "myApplications";

interface FetchMailsParams {
  userMusicians: Musician[];
  autoPagination?: boolean;
}

export const useMailTab = () => {
  // Tab初始值：待审批申请
  const [activeMailTabKey, setActiveMailTabKey] =
    useState<MailTabKey>(DefaultMailTabKey);

  // 获取用户的所有乐手数据
  const { userMusicians, fetchUserMusicians } = useUserMusicians();

  const { data: mailsData, fetchPaginatedData } = usePaginatedData<Mail>();

  // 根据所处tab获取乐队数据
  const fetchMails = async (params: FetchMailsParams) => {
    const { userMusicians, autoPagination = false } = params;
    // 如果用户还没有任何的乐手身份，那么：
    // - 不可能发出申请：在乐队详情界面加入乐队时，会被提示先创建自己的乐手身份
    // - 不可能收到申请：用户必须加入乐队，才能管理乐队；如果没有乐手身份，代表无法加入乐队
    if (!userMusicians.length) return;

    // 根据当前活跃的 TabKey 判断需要查询的字段类型
    let query;

    // 获取待审批申请（别人申请加入自己的乐队）
    // 用户 -> 乐手 -> 所有用户在的乐队 -> 申请记录 -> 邮件
    if (activeMailTabKey === "incomingApplications") {
      const targetBandIDs = extractMusicianBaseBandIDs(userMusicians); // 获取用户所在的乐队ID
      query = { targetBandID: targetBandIDs };
    }

    // 获取我的申请（自己申请加入别人的乐队）
    // 用户 -> 用户的所有乐手身份 -> 申请记录 -> 邮件
    else {
      // activeMailTabKey === "myApplications"
      const applyingMusicianIDs = mapMusiciansIntoIds(userMusicians); // 获取用户所有乐手身份的ID
      query = { applyingMusicianID: applyingMusicianIDs };
    }

    return fetchPaginatedData({
      autoPagination,
      fetchFn: async (pageIndex: number) => {
        return getApplicationsByField({ query, pageIndex }).then((rawData) => {
          const mails: Mail[] = rawData.data.map((a) => ({
            application: a,
            applyingMusician: userMusicians.find(
              (m) => m._id === a.applyingMusicianID
            ),
          }));
          return { ...rawData, data: mails };
        });
      },
    });
  };

  // 监听乐队Tab类型的变化，更新乐队数据
  useEffect(() => {
    fetchMails({ userMusicians });
  }, [activeMailTabKey]);

  return {
    activeMailTabKey,
    setActiveMailTabKey,
    mailsData,
    fetchMails,
    fetchUserMusicians,
    userMusicians,
  };
};
