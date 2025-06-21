import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Cell, Checkbox, Field, Input, Textarea } from "@taroify/core";
import JXGenreChip from "@/components/JXGenreChip";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import { GENRES } from "@/constants/utils/genre";
import JXButton from "@/components/JXButton";
import JXBandPosPicker from "@/components/Pickers/JXBandPosPicker";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { Close } from "@taroify/icons";
import { useBandForm } from "@/hooks/useBandForm";
import { Genre } from "@/models/genre";
import { getPositionsByStatus } from "@/utils/band";

export default function BandCreate() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const {
    formData,
    setFormData,
    activePicker,
    setActivePicker,
    feedback,
    getPickerTitle,
    updatePositions,
    handleSubmit,
    isFormDataValid,
    checkDuplicateBandName,
    removeRecruitingPosition,
  } = useBandForm();

  const { recruitingPositions, occupiedPositions } = getPositionsByStatus(
    formData.positions
  );

  return (
    <View className="band-create config-page">
      <JXFormLabel px>乐队基本信息</JXFormLabel>
      <Cell.Group inset bordered={false}>
        <Field
          feedback={
            <Field.Feedback status="invalid">{feedback.name}</Field.Feedback>
          }
          label="乐队名"
        >
          <Input
            onBlur={(e) => checkDuplicateBandName(e.detail.value)}
            placeholder="取个响亮的队名！"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.detail.value }))
            }
          />
        </Field>
        <Field label="乐队简介" align="start">
          <Textarea
            value={formData.description}
            autoHeight
            placeholder="你想组个什么样的乐队呢？"
            limit={100}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.detail.value,
              }))
            }
          />
        </Field>
      </Cell.Group>

      <JXFormLabel px>乐队风格（多选）</JXFormLabel>
      <Checkbox.Group
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            genre: value,
          }))
        }
        value={formData.genre}
        direction="horizontal"
        className="chip-container"
        style={{ padding: "0 16px" }}
      >
        {Object.keys(GENRES).map((g: Genre) => (
          <Checkbox
            name={g}
            icon={<JXGenreChip genre={g} active={formData.genre.includes(g)} />}
          />
        ))}
      </Checkbox.Group>

      <JXFormLabel px>你的位置</JXFormLabel>
      <View
        className="container-v"
        style={{ gap: occupiedPositions.length ? 12 : 0 }}
      >
        {occupiedPositions.length > 0 && (
          <Cell.Group inset bordered={false}>
            {
              <Field label="你的位置">
                <Input
                  readonly
                  value={`${
                    MUSICIAN_DISPLAY[occupiedPositions[0].position].emoji
                  }  ${MUSICIAN_DISPLAY[occupiedPositions[0].position].label}`}
                />
              </Field>
            }
          </Cell.Group>
        )}
        <View className="page-padding-h container-v">
          <JXButton
            variant="outlined"
            onClick={() => setActivePicker("occupied")}
          >
            选择
          </JXButton>
        </View>
      </View>

      <JXFormLabel px>招募乐手位置</JXFormLabel>
      <View
        className="container-v"
        style={{ gap: recruitingPositions.length ? 12 : 0 }}
      >
        <Cell.Group inset bordered={false}>
          {recruitingPositions.map(({ position: p }, index) => (
            <Field label={`位置${index + 1}`}>
              <Input
                readonly
                value={`${MUSICIAN_DISPLAY[p].emoji}  ${MUSICIAN_DISPLAY[p].label}`}
              />
              <Close
                size={16}
                color="red"
                onClick={() => removeRecruitingPosition(index)}
              />
            </Field>
          ))}
        </Cell.Group>
        <View className="page-padding-h container-v">
          <JXButton
            variant="outlined"
            onClick={() => setActivePicker("recruiting")}
          >
            添加
          </JXButton>
        </View>
      </View>

      <JXBandPosPicker
        open={activePicker !== null}
        title={getPickerTitle()}
        onCancel={() => setActivePicker(null)}
        onConfirm={(position) => {
          updatePositions(position);
          setActivePicker(null);
        }}
      />
      {isFormDataValid() && (
        <View
          className="page-padding-h container-v"
          style={{ paddingTop: 16, paddingBottom: 16 }}
        >
          <JXButton onClick={handleSubmit}>创建乐队</JXButton>
        </View>
      )}
    </View>
  );
}
