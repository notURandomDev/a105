import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { CreateMusicianRequest } from "@/models/musician";
import { PositionType } from "@/models/position";
import { createMusicians, updateMusicians } from "@/services/musicianService";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { useMusiciansWithUser } from "./useMusiciansWithUser";

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

  const { userMusicians, fetchMusicians } = useMusiciansWithUser();

  useEffect(() => {
    if (!userMusicians) return;
    setFormData(userMusicians.map((m) => ({ ...m, status: "pristine" })));
  }, [userMusicians]);

  const didUserEdit = () => formData.some((mp) => mp.status !== "pristine");

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
      { position: value, bio: "", status: "new" },
    ]);

  const getExcludedPositions = () => {
    const existingPositions = formData.flatMap((mp) => mp.position);
    return Object.keys(MUSICIAN_DISPLAY).filter((p) =>
      existingPositions.includes(p as PositionType)
    ) as PositionType[];
  };

  const handleSubmit = async () => {
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

    await Promise.all([
      createMusicians({ musicians: toCreate }),
      updateMusicians({ musicians: toUpdate }),
    ]);

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
