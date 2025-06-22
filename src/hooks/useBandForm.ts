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

  const OCCUPIED_MUSICIAN_BASE_DATA = {
    status: "occupied" as PositionStatus,
    nickname: userInfo?.nickName ?? "replace-this-with-actual-user-nickname",
    userID: userInfo?._id ?? "replace-this-with-actual-user-id",
  };

  const [activePicker, setActivePicker] = useState<ActivePickerState>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "JOINT",
    description: "这是一段乐队简介",
    genre: ["EDM"],
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
  const [feedback, setFeedback] = useState({
    name: "",
  });

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

  const updatePositions = (position: PositionType) => {
    if (activePicker === "occupied") {
      const { recruitingPositions } = getPositionsByStatus(formData.positions);

      setFormData((prev) => ({
        ...prev,
        positions: [
          ...recruitingPositions,
          {
            position,
            status: "occupied",
            joinedAt: new Date(),
          },
        ],
      }));
    }

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

  const removeRecruitingPosition = (index: number) => {
    const { recruitingPositions, occupiedPositions } = getPositionsByStatus(
      formData.positions
    );
    const reducedPositions = recruitingPositions.filter(
      (_, idx) => idx !== index
    );

    setFormData((prev) => ({
      ...prev,
      positions: [...reducedPositions, ...occupiedPositions],
    }));
  };

  const getRecruitNote = (index: number) => {
    const { recruitingPositions } = getPositionsByStatus(formData.positions);
    const currentPosition = recruitingPositions.find((_, idx) => idx === index);
    return currentPosition?.recruitNote;
  };

  const handleRecruitNoteChange = (value: string, index: number) => {
    const { recruitingPositions, occupiedPositions } = getPositionsByStatus(
      formData.positions
    );
    const unchangedPositions = recruitingPositions.filter(
      (_, idx) => idx !== index
    );
    const currentPosition = recruitingPositions.find((_, idx) => idx === index);
    if (!currentPosition) return;

    setFormData((prev) => ({
      ...prev,
      positions: [
        ...occupiedPositions,
        ...unchangedPositions,
        { ...currentPosition, recruitNote: value },
      ],
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    const now = new Date();

    Taro.showLoading();

    const res = await createBandWithPositions({
      band: {
        ...formData,
        status: "recruiting",
        statusUpdatedAt: now,
        statusLogs: [{ at: now, status: "recruiting" }],
      },
      positions: formData.positions,
    });

    if (!res) {
      JXToast.networkError();
      Taro.hideLoading();
      return;
    }

    Taro.hideLoading();
    Taro.showToast({ icon: "success", title: "乐队创建成功" });
    setTimeout(() => Taro.navigateBack(), 2000);
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
    handleRecruitNoteChange,
  };
};
