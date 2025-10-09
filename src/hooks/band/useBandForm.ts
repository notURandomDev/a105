import { getAllBands } from "@/services/bandsService";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { PositionType } from "@/models/position";
import { CreateBandPositionRequest } from "@/models/band-position";
import { createBandWithPositions, getPositionsByStatus } from "@/utils/band";
import { useUserMusicians } from "../user/useUserMusicians";
import { isFormValid } from "@/utils/form";

const DefaultFormDataBase = {
  name: "", // 乐队名
  description: "这是一段乐队简介",
};

interface FormData {
  name: string;
  description: string;
  positions: CreateBandPositionRequest[];
}

type ActivePickerState = "recruiting" | "occupied" | null;

// 在创建乐队时使用的表单数据
export const useBandForm = () => {
  const [feedback, setFeedback] = useState({ name: "" }); // 将来可扩展
  const [activePicker, setActivePicker] = useState<ActivePickerState>(null);
  const [bandNameConflicted, setBandNameConflicted] = useState(true);

  // 获取用户的所有乐手身份，作为 picker 的数据来源
  // picker 不能展示用户没有注册过的乐手身份！
  const { userInfo, userMusicians } = useUserMusicians();

  const [formData, setFormData] = useState<FormData>({
    ...DefaultFormDataBase,
    positions: [],
  });

  useEffect(() => {
    if (!userMusicians.length) return;
    // 根据用户的乐手信息，对表单数据进行初始化
    setFormData({
      ...DefaultFormDataBase,
      positions: [
        {
          status: "occupied",
          position: userMusicians[0].position,
        },
        {
          position: "bassist",
          status: "recruiting",
          recruitNote: "律动强",
        },
      ],
    });
  }, [userMusicians]);

  // 获取全部乐队，判断用户起的乐队名是否已经存在
  const fetchBandNames = async () => {
    const { data: bands } = await getAllBands({});
    return bands.map((b) => b.name);
  };

  // 获取 picker 标题文案
  const getPickerTitle = () => {
    if (activePicker === "occupied") return "你已创建的乐手位置";
    if (activePicker === "recruiting") return "你想招募的乐手位置";
    return "";
  };

  // 更新乐队名
  const updateName = (value: string) =>
    setFormData((prev) => ({ ...prev, name: value }));

  // 更新乐队简介
  const updateDescription = (value: string) =>
    setFormData((prev) => ({ ...prev, description: value }));

  // 更新乐手位置
  const updatePositions = async (position: PositionType) => {
    // 更新用户的乐手位置
    if (activePicker === "occupied") {
      setFormData((prev) => ({
        ...prev,
        positions: prev.positions.map((p) =>
          p.status === "occupied" ? { ...p, position } : p
        ),
      }));
    }

    // 更新招募的乐手位置
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

  // 移除招募乐手位置
  const removeRecruitingPosition = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.filter((_, idx) => idx !== index + 1),
    }));

  // 从表单获取当前已有的乐手招募要求数据，与 Input 组件进行绑定
  const getRecruitNote = (index: number) =>
    formData.positions.find((_, idx) => idx + 1 === index)?.recruitNote;

  // 更新表单乐手位置的招募要求数据
  const updateRecruitNote = (value: string, index: number) =>
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.map((p, idx) =>
        idx === index + 1 ? { ...p, recruitNote: value } : p
      ),
    }));

  // 提交表单回调函数
  const handleSubmit = async () => {
    // 再次判断乐队名是否冲突
    const isBandNameUnique = !(await checkDuplicateBandName(formData.name));
    if (!isBandNameUnique) return;

    const now = new Date();
    const { positions, ...createInput } = formData;

    await createBandWithPositions({
      band: {
        ...createInput,
        status: "recruiting",
        statusUpdatedAt: now,
        statusLogs: [{ at: now, status: "recruiting" }],
      },
      positions: positions.map((p) =>
        p.status === "occupied"
          ? {
              ...p,
              joinedAt: new Date(),
              nickname: userInfo?.nickName ?? "something-is-wrong",
              // 能进入创建乐队的前提，是用于已经有乐手身份了；因此这里访问下标的操作是安全的
              musicianID: userMusicians[0]._id,
            }
          : {
              ...p,
              recruitNote: "喜欢就申请加入吧！",
            }
      ),
    });

    Taro.showToast({ icon: "success", title: "乐队创建成功" });
    setTimeout(() => {
      Taro.navigateBack();
    }, 2000);
  };

  // 验证表单有效性
  // 作用：决定是否显示 "创建乐队" 的 CTA 按钮
  const formValid = () => {
    const { name, description, positions } = formData;
    const { recruitingPositions, occupiedPositions } =
      getPositionsByStatus(positions);
    return isFormValid([
      name?.length > 0,
      description?.length > 0,
      recruitingPositions.length > 0,
      occupiedPositions.length > 0,
      !bandNameConflicted,
    ]);
  };

  // 检查用户取的乐队名是否和当前已经存在的乐队名冲突
  // 调用时机：乐队名输入控件的 onBlur 事件
  const checkDuplicateBandName = async (name: string) => {
    let duplicateBandName;
    let exists = false;
    const bandNameEmpty = !name.trim().length;

    // 乐队名非空，进行查重
    if (!bandNameEmpty) {
      const bandNames = await fetchBandNames();
      duplicateBandName = bandNames.find(
        (bn) => bn.toLowerCase() === name.toLowerCase()
      );
      exists = Boolean(duplicateBandName);
    }

    setFeedback((prev) => ({
      ...prev,
      name: exists ? `乐队名已存在（${duplicateBandName}）` : "",
    }));
    setBandNameConflicted(exists);
    return exists;
  };

  return {
    formData,
    setFormData,
    activePicker,
    setActivePicker,
    feedback,
    setFeedback,
    getPickerTitle,
    updatePositions,
    handleSubmit,
    formValid,
    checkDuplicateBandName,
    removeRecruitingPosition,
    getRecruitNote,
    updateRecruitNote,
    updateDescription,
    updateName,
    userMusicians,
    bandNameConflicted,
    setBandNameConflicted,
  };
};
