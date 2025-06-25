import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { Genre } from "@/models/genre";
import { CreateMusicianInput } from "@/models/musician";
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
  genre: Genre[];
  status: FormItemStatus;
}

export const useMusicianForm = () => {
  const { userInfo } = useUserStore();
  const [formData, setFormData] = useState<MusicianFormItem[]>([]);
  const [pickerActive, setPickerActive] = useState(false);

  // 在乐手档案表单刚加载出来的时候，需要先获取乐手的档案渲染已有的 选项
  useEffect(() => {
    fetchMusicianProfiles();
  }, []);

  const fetchMusicianProfiles = async () => {
    const musicians = await getMusiciansByUserID({
      userID: userInfo?._id ?? "",
      production: false,
    });
    if (!musicians) return;

    setFormData(musicians.map((m) => ({ ...m, status: "pristine" })));
  };

  const updateFormData = (index: number, updates: Partial<MusicianFormItem>) =>
    setFormData((prev) =>
      prev.map((mp, idx) =>
        idx === index
          ? {
              ...mp,
              ...updates,
              status: mp.status !== "new" ? "edited" : mp.status,
            }
          : mp
      )
    );

  const appendMusicianProfile = (value: PositionType) =>
    setFormData((prev) => [
      ...prev,
      { position: value, genre: [], bio: "", status: "new" },
    ]);

  const getExcludedPositions = () => {
    const existingPositions = formData.flatMap((mp) => mp.position);
    return Object.keys(MUSICIAN_DISPLAY).filter((p) =>
      existingPositions.includes(p as PositionType)
    ) as PositionType[];
  };

  const handleSubmit = async () => {
    const toCreate: CreateMusicianInput[] = formData
      .filter((item) => item.status === "new")
      .map((item) => ({
        ...item,
        bandIDs: [],
        nickname: userInfo?.nickName ?? "no-nick-name-in-zustand",
        userID: userInfo?._id ?? "no-user-id-in-zustand",
      }));

    // 只传入需要更新的字段，没传入的字段默认不更新
    // 此处的_id一定被定义过，""只是 defensive code
    const toUpdate = formData.map((item) => ({ ...item, _id: item._id ?? "" }));

    Promise.all([
      createMusicians({ musicians: toCreate }),
      updateMusicians({ musicians: toUpdate }),
    ]);
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
  };
};
