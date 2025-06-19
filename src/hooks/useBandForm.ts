import { Position } from "@/models/musician";
import { BandPreview } from "@/models/band";
import { createBand, getAllBands } from "@/services/bandsService";
import { JXToast } from "@/utils/toast";
import Taro from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";
import { Genre } from "@/models/genre";

interface FormData {
  name: string;
  description: string;
  genre: Genre[];
  missingPositions: Position[];
  occupiedPositions: Position[];
}

type ActivePickerState = "missing" | "occupied" | null;

interface UseBandFormParams {
  production?: boolean;
}
export const useBandForm = ({ production = false }: UseBandFormParams = {}) => {
  const bandNamesRef = useRef<string[]>([]);

  const [activePicker, setActivePicker] = useState<ActivePickerState>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    genre: [],
    missingPositions: [],
    occupiedPositions: ["vocalist"],
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
    if (activePicker === "missing") return "选择招募乐手位置";
    return "";
  };

  const updatePositions = (position: Position) => {
    if (activePicker === "occupied") {
      setFormData((prev) => ({
        ...prev,
        occupiedPositions: [position],
      }));
    }

    if (activePicker === "missing") {
      setFormData((prev) => ({
        ...prev,
        missingPositions: [...prev.missingPositions, position],
      }));
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
    const now = new Date();

    Taro.showLoading();
    const res = await createBand({
      band: {
        ...formData,
        status: "recruiting",
        statusUpdatedAt: now,
        statusLogs: [{ at: now, status: "recruiting" }],
      },
      production: true,
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
    const { name, description, genre, missingPositions, occupiedPositions } =
      formData;

    if (!name || !description) return false;

    return (
      name?.length > 0 &&
      description?.length > 0 &&
      genre.length > 0 &&
      missingPositions.length > 0 &&
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

  const generateBandPreview = (): BandPreview => {
    const { name, description, genre, missingPositions, occupiedPositions } =
      formData;

    return {
      name,
      description,
      genre,
      missingPositions,
      occupiedPositions,
      status: "recruiting",
      statusUpdatedAt: new Date(),
    };
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
    generateBandPreview,
  };
};
