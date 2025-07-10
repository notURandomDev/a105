import { getAllBands } from "@/services/bandsService";
import { JXToast } from "@/utils/toast";
import Taro from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";
import { Genre } from "@/models/genre";
import { PositionType } from "@/models/position";
import {
  CreateBandPositionInput,
  PositionStatus,
} from "@/models/band-position";
import { createBandWithPositions, getPositionsByStatus } from "@/utils/band";
import { useUserStore } from "@/stores/userStore";
import { useBandStore } from "@/stores/bandStore";
import { useBandPositionStore } from "@/stores/bandPositionStore";
import { useMusicianStore } from "@/stores/musicianStore";
import { matchUserMusician } from "@/utils/musician";

const DEFAULT_FORM_DATA_BASE = {
  name: "JOINT",
  description: "这是一段乐队简介",
  genre: ["EDM"] as Genre[],
};

interface FormData {
  name: string;
  description: string;
  genre: Genre[];
  positions: CreateBandPositionInput[];
}

type ActivePickerState = "recruiting" | "occupied" | null;

interface UseBandFormParams {
  production?: boolean;
}
export const useBandForm = ({ production = false }: UseBandFormParams = {}) => {
  const bandNamesRef = useRef<string[]>([]);
  const { userInfo } = useUserStore();
  const fetchBands = useBandStore((s) => s.fetchBands);
  const fetchBandPositions = useBandPositionStore((s) => s.fetchBandPositions);
  const fetchMusicians = useMusicianStore((s) => s.fetchMusicians);

  const OCCUPIED_MUSICIAN_BASE_DATA = {
    status: "occupied" as PositionStatus,
    nickname: userInfo?.nickName ?? "replace-this-with-actual-user-nickname",
    userID: userInfo?._id ?? "replace-this-with-actual-user-id",
  };

  const [activePicker, setActivePicker] = useState<ActivePickerState>(null);
  const [formData, setFormData] = useState<FormData>({
    ...DEFAULT_FORM_DATA_BASE,
    positions: [
      {
        ...OCCUPIED_MUSICIAN_BASE_DATA,
        position: "vocalist",
        joinedAt: new Date(),
      },
      {
        position: "bassist",
        status: "recruiting",
        recruitNote: "律动强",
      },
    ],
  });
  // feedback 字段将来可扩展
  const [feedback, setFeedback] = useState({ name: "" });

  useEffect(() => {
    fetchAllBands();
  }, []);

  const fetchAllBands = async () => {
    const bands = await getAllBands({ production });
    if (!bands) return;

    const names = bands.map((b) => b.name);
    bandNamesRef.current = names;
  };

  const getPickerTitle = () => {
    if (activePicker === "occupied") return "选择你的位置";
    if (activePicker === "recruiting") return "选择招募乐手位置";
    return "";
  };

  const updateName = (value: string) =>
    setFormData((prev) => ({ ...prev, name: value }));

  const updateDescription = (value: string) =>
    setFormData((prev) => ({ ...prev, description: value }));

  const updateGenre = (value: Genre[]) =>
    setFormData((prev) => ({ ...prev, genre: value }));

  const updatePositions = async (position: PositionType) => {
    // 更新【你的位置】
    if (activePicker === "occupied") {
      // 首先要判断创建者是否有该乐手身份
      if (!userInfo?._id) return;
      const match = await matchUserMusician(userInfo?._id, position);
      if (!match) return;
      const joinedAt = new Date();
      setFormData((prev) => ({
        ...prev,
        positions: prev.positions.map((p) =>
          p.status === "occupied"
            ? { ...OCCUPIED_MUSICIAN_BASE_DATA, position, joinedAt }
            : p
        ),
      }));
    }

    // 更新【招募乐手位置】
    if (activePicker === "recruiting") {
      setFormData((prev) => ({
        ...prev,
        positions: [
          ...prev.positions,
          { position, status: "recruiting", recruitNote: "" },
        ],
      }));
    }
  };

  const removeRecruitingPosition = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.filter((_, idx) => idx !== index + 1),
    }));

  const getRecruitNote = (index: number) =>
    formData.positions.find((_, idx) => idx + 1 === index)?.recruitNote;

  const updateRecruitNote = (value: string, index: number) =>
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.map((p, idx) =>
        idx === index + 1 ? { ...p, recruitNote: value } : p
      ),
    }));

  const handleSubmit = async () => {
    const now = new Date();

    Taro.showLoading();

    const { positions, ...createInput } = formData;
    const res = await createBandWithPositions({
      band: {
        ...createInput,
        status: "recruiting",
        statusUpdatedAt: now,
        statusLogs: [{ at: now, status: "recruiting" }],
      },
      positions,
    });

    if (!res) {
      JXToast.networkError();
      Taro.hideLoading();
      return;
    }

    Taro.hideLoading();
    Taro.showToast({ icon: "success", title: "乐队创建成功" });
    await Promise.all([fetchBands(), fetchBandPositions(), fetchMusicians()]);
    Taro.navigateBack();
  };

  const isFormDataValid = () => {
    const { name, description, genre, positions } = formData;

    const { recruitingPositions, occupiedPositions } =
      getPositionsByStatus(positions);

    return (
      name?.length > 0 &&
      description?.length > 0 &&
      genre.length > 0 &&
      recruitingPositions.length > 0 &&
      occupiedPositions.length > 0
    );
  };

  const checkDuplicateBandName = (name: string) => {
    if (!name.trim()) return;
    const exists = bandNamesRef.current.includes(name);

    if (exists) {
      setFeedback((prev) => ({ ...prev, name: "乐队名已存在" }));
    } else {
      setFeedback((prev) => ({ ...prev, name: "" }));
    }
  };

  return {
    formData,
    setFormData,
    activePicker,
    setActivePicker,
    feedback,
    setFeedback,
    bandNamesRef,
    getPickerTitle,
    updatePositions,
    handleSubmit,
    isFormDataValid,
    checkDuplicateBandName,
    removeRecruitingPosition,
    getRecruitNote,
    updateRecruitNote,
    updateGenre,
    updateDescription,
    updateName,
  };
};
