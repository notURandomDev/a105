import { MUSICIAN_DISPLAY_CONFIG } from "@/constants/utils/musician";
import { CreateMusicianRequest } from "@/models/musician";
import { PositionType } from "@/models/position";
import {
  createMusicians,
  getMusiciansByUserID,
  updateMusicians,
} from "@/services/musicianService";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

type FormItemStatus = "new" | "edited" | "pristine";

export interface MusicianFormItem {
  _id?: string | number; // 更新接口需要使用
  position: PositionType;
  bio: string;
  status: FormItemStatus;
}

export const useMusicianForm = () => {
  const { userInfo } = useUserStore();
  const [formData, setFormData] = useState<MusicianFormItem[]>([]);
  const [pickerActive, setPickerActive] = useState(false);

  // 获取用户乐手信息，更新表单
  const fetchMusicians = async () => {
    const userID = userInfo?._id;
    if (!userID) return;

    // 获取用户所有的乐手身份
    const fetchedMusicians = (await getMusiciansByUserID({ userID })) || [];
    if (!fetchedMusicians.length) return;

    // 根据获取到的用户乐手信息，更新表单
    setFormData(fetchedMusicians.map((m) => ({ ...m, status: "pristine" })));
  };

  // 监听：获取到用户信息的全局状态，加载用户的乐手身份数据
  useEffect(() => {
    fetchMusicians();
  }, [userInfo?._id]);

  // 判断用户是否对表单进行了编辑
  const didUserEdit = () => formData.some((mp) => mp.status !== "pristine");

  // 更新表单数据
  const updateFormData = (index: number, updates: Partial<MusicianFormItem>) =>
    setFormData((prev) =>
      prev.map((mp, idx) =>
        idx === index // 被更新的乐手身份下标
          ? {
              ...mp,
              ...updates,
              // 新创建(new)的乐手身份 优先级大于 被修改(edited)的乐手身份信息
              // 如果是新创建的乐手身份，就算信息更新，状态还是 new
              // 因为 `handleSubmit` 对于这两种状态的处理逻辑不同
              status: mp.status !== "new" ? "edited" : "new",
            }
          : mp
      )
    );

  // 创建新的乐手身份
  const appendMusicianProfile = (value: PositionType) =>
    setFormData((prev) => [
      ...prev, // 保持其它乐手身份不变
      { position: value, bio: "", status: "new" },
    ]);

  // 返回一个用户还未创建过的乐手身份列表，给 picker 使用
  const getExcludedPositions = () => {
    // 已经存在的乐手位置
    const existingPositions = formData.flatMap((mp) => mp.position);
    return Object.keys(MUSICIAN_DISPLAY_CONFIG).filter((p) =>
      existingPositions.includes(p as PositionType)
    ) as PositionType[];
  };

  // 处理表单提交操作
  const handleSubmit = async () => {
    // 需要进行创建的新身份
    const toCreate: CreateMusicianRequest[] = formData
      .filter((item) => item.status === "new")
      .map((item) => ({
        ...item,
        bandIDs: [],
        nickname: userInfo?.nickName ?? "no-nick-name-in-zustand",
        userID: userInfo?._id ?? "no-user-id-in-zustand",
      }));

    // 只传入需要更新的字段，没传入的字段默认不更新
    // 此处的_id一定被定义过，""只是 defensive code
    const toUpdate = formData
      .filter((item) => item.status === "edited")
      .map((item) => ({ ...item, _id: item._id ?? "" }));

    // 创建身份 / 更新身份
    if (toCreate.length) await createMusicians({ musicians: toCreate });
    if (toUpdate.length) await updateMusicians({ musicians: toUpdate });

    // 刷新乐手数据，重新渲染乐手表单
    fetchMusicians();
  };

  return {
    formData,
    setFormData,
    pickerActive,
    setPickerActive,
    appendMusicianProfile,
    getExcludedPositions,
    handleSubmit,
    updateFormData,
    didUserEdit,
  };
};
