import { useEffect, useRef, useState } from "react";
import { MailTabKey } from "@/types/components";
import { getApplicationsByField } from "@/services/applicationService";
import { extractMusicianBaseBandIDs } from "@/utils/band";
import { mapMusiciansIntoIds } from "@/utils/musician";
import { Mail } from "@/models/mail";
import { useUserMusicians } from "../user/useUserMusicians";
import { Application } from "@/models/application";
import { TcbServiceResult } from "@/types/service/shared";

const production = true;

interface MailsData {
  mails: Mail[];
  pagination: {
    hasMore: boolean;
    pageIndex: number;
  };
}

export const DefaultMailTabKey: MailTabKey = "myApplications";
export const DefaultMailsData = {
  mails: [],
  pagination: {
    hasMore: false,
    pageIndex: 0,
  },
};

export const useMailTab = () => {
  // Tab初始值：待审批申请
  const [activeMailTabKey, setActiveMailTabKey] =
    useState<MailTabKey>(DefaultMailTabKey);

  // 记录上次是为哪个 tab 获取的数据
  const lastFetchedMailTabKey = useRef<MailTabKey | null>(null);

  const [mailsData, setMailsData] = useState<MailsData>(DefaultMailsData);

  // 获取用户的所有乐手数据
  const { userMusicians } = useUserMusicians({ production });

  // 更加简洁地更新状态
  const updateMailsData = async (
    autoPagination: boolean,
    fetchFn: () => TcbServiceResult<Application[]>
  ) => {
    const { hasMore, data } = await fetchFn(); // 调用传入的函数

    // 将 applications 映射成 mails
    const newMails = data.map((application) => ({
      application,
      applyingMusician: userMusicians.find(
        (m) => m._id === application.applyingMusicianID
      ),
    }));

    setMailsData((prev) => {
      // tab变化：重新从第一页的数据开始获取
      // tab没变：追加分页数据
      const tabChanged = activeMailTabKey !== lastFetchedMailTabKey.current;
      // 如果禁用了 `autoPagination`，说明是页面二次初始化；需要重新获取第一页数据
      const resetData = tabChanged || !autoPagination;

      const pageIndex = resetData ? 1 : prev.pagination.pageIndex + 1;
      const mails = resetData ? newMails : [...prev.mails, ...newMails];

      return { mails, pagination: { pageIndex, hasMore } };
    });
  };

  // 根据所处tab获取乐队数据
  const fetchMails = async (autoPagination = true) => {
    // 如果用户还没有任何的乐手身份，那么：
    // - 不可能发出申请：在乐队详情界面加入乐队时，会被提示先创建自己的乐手身份
    // - 不可能收到申请：用户必须加入乐队，才能管理乐队；如果没有乐手身份，代表无法加入乐队
    if (!activeMailTabKey || !userMusicians.length) return;

    // 如果当前的 tab 变了，那么重置页数，获取 tab 第一页的数据
    let pageIndex =
      activeMailTabKey === lastFetchedMailTabKey.current && autoPagination
        ? mailsData.pagination.pageIndex
        : 0;

    // 获取待审批申请（别人申请加入自己的乐队）
    // 用户 -> 乐手 -> 所有用户在的乐队 -> 申请记录 -> 邮件
    if (activeMailTabKey === "incomingApplications") {
      const targetBandIDs = extractMusicianBaseBandIDs(userMusicians); // 获取用户所在的乐队ID
      await updateMailsData(autoPagination, () =>
        getApplicationsByField({
          query: {
            targetBandID: targetBandIDs,
          },
          pageIndex,
          production,
        })
      );
    }

    // 获取我的申请（自己申请加入别人的乐队）
    // 用户 -> 用户的所有乐手身份 -> 申请记录 -> 邮件
    if (activeMailTabKey === "myApplications") {
      const applyingMusicianIDs = mapMusiciansIntoIds(userMusicians); // 获取用户所有乐手身份的ID
      await updateMailsData(autoPagination, () =>
        getApplicationsByField({
          query: {
            applyingMusicianID: applyingMusicianIDs,
          },
          pageIndex,
          production,
        })
      );
    }

    // 更新上次获取的数据类型
    lastFetchedMailTabKey.current = activeMailTabKey;
  };

  // 监听乐队Tab类型的变化，更新乐队数据
  useEffect(() => {
    fetchMails();
  }, [activeMailTabKey, userMusicians]);

  return {
    activeMailTabKey,
    setActiveMailTabKey,
    lastFetchedMailTabKey,
    mailsData,
    fetchMails,
  };
};
