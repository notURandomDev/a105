import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import { Cell, Checkbox, Field, Input, Textarea } from "@taroify/core";
import JXGenreChip from "@/components/JXGenreChip";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import { BAND_GENRES } from "@/constants/utils/genre";
import { BandGenre } from "@/models/band";
import JXButton from "@/components/JXButton";
import JXBandPosPicker from "@/components/Pickers/JXBandPosPicker";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";
import { Close } from "@taroify/icons";
import JXBandCard from "@/components/Cards/JXBandCard";
import { useBandForm } from "@/hooks/useBandForm";

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
    generateBandPreview,
  } = useBandForm();

  return (
    <View className="band-create config-page">
      <JXFormLabel>乐队基本信息</JXFormLabel>
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

      <JXFormLabel>乐队风格（多选）</JXFormLabel>
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
        {Object.keys(BAND_GENRES).map((g: BandGenre) => (
          <Checkbox
            name={g}
            icon={<JXGenreChip genre={g} active={formData.genre.includes(g)} />}
          />
        ))}
      </Checkbox.Group>

      <JXFormLabel>你的位置</JXFormLabel>
      <View
        className="container-v"
        style={{ gap: formData.occupiedPositions.length ? 12 : 0 }}
      >
        {formData.occupiedPositions.length > 0 && (
          <Cell.Group inset bordered={false}>
            {
              <Field label="你的位置">
                <Input
                  readonly
                  value={`${
                    MUSICIAN_DISPLAY[formData.occupiedPositions[0]].emoji
                  } ${MUSICIAN_DISPLAY[formData.occupiedPositions[0]].label}`}
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

      <JXFormLabel>招募乐手位置</JXFormLabel>
      <View
        className="container-v"
        style={{ gap: formData.missingPositions.length ? 12 : 0 }}
      >
        <Cell.Group inset bordered={false}>
          {formData.missingPositions.map((p, index) => (
            <Field label={`位置${index + 1}`}>
              <Input
                readonly
                value={`${MUSICIAN_DISPLAY[p].emoji} ${MUSICIAN_DISPLAY[p].label}`}
              />
              <Close
                size={16}
                color="red"
                onClick={() => {
                  const newPositions = formData.missingPositions.filter(
                    (_, idx) => idx !== index
                  );
                  setFormData((prev) => ({
                    ...prev,
                    missingPositions: newPositions,
                  }));
                }}
              />
            </Field>
          ))}
        </Cell.Group>
        <View className="page-padding-h container-v">
          <JXButton
            variant="outlined"
            onClick={() => setActivePicker("missing")}
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
        <>
          <JXFormLabel>乐队信息预览</JXFormLabel>
          <View className="page-padding-h container-v" style={{ gap: 12 }}>
            <JXBandCard addBtnDisabled bandInfo={generateBandPreview()} />
            <JXButton onClick={handleSubmit}>创建乐队</JXButton>
          </View>
        </>
      )}
    </View>
  );
}
