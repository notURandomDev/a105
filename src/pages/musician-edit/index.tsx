import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import { Cell, Checkbox, Field, Input, Textarea } from "@taroify/core";
import JXBandPosPicker from "@/components/Pickers/JXBandPosPicker";
import JXGenreChip from "@/components/JXGenreChip";
import { GENRES } from "@/constants/utils/genre";
import { Genre } from "@/models/genre";
import JXButton from "@/components/JXButton";
import { useMusicianForm } from "@/hooks/musician/useMusicianForm";
import { MUSICIAN_DISPLAY } from "@/constants/utils/musician";

export default function MusicianEdit() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const {
    formData,
    pickerActive,
    setPickerActive,
    appendMusicianProfile,
    getExcludedPositions,
    handleSubmit,
    updateFormData,
  } = useMusicianForm();

  return (
    <View className="musician-edit config-page">
      {formData.map((mp, index) => {
        // mp stands for musician-profile
        const { label, emoji } = MUSICIAN_DISPLAY[mp.position];

        return (
          <View className="container-v" style={{ gap: 24 }}>
            <View>
              <JXFormLabel px>{`乐手档案${index + 1}`}</JXFormLabel>
              <Cell.Group inset bordered={false}>
                <Field label="位置类型">
                  <Input readonly value={`${label} ${emoji}`} />
                </Field>
                <Field label="简介" align="start">
                  <Textarea
                    autoHeight
                    placeholder="介绍一下你的特色吧！"
                    limit={100}
                    value={mp.bio}
                    onChange={(e) =>
                      updateFormData(index, { bio: e.detail.value })
                    }
                  />
                </Field>
              </Cell.Group>
              <JXFormLabel px>乐手风格（多选）</JXFormLabel>
              <Checkbox.Group
                direction="horizontal"
                className="chip-container"
                style={{ padding: "0 16px" }}
                onChange={(value) => updateFormData(index, { genre: value })}
                value={formData[index].genre}
              >
                {Object.keys(GENRES).map((g: Genre) => (
                  <Checkbox
                    name={g}
                    icon={
                      <JXGenreChip genre={g} active={mp.genre.includes(g)} />
                    }
                  />
                ))}
              </Checkbox.Group>
            </View>
          </View>
        );
      })}

      <JXBandPosPicker
        exclude={getExcludedPositions()}
        onConfirm={(position) => {
          appendMusicianProfile(position);
          setPickerActive(false);
        }}
        onCancel={() => setPickerActive(false)}
        open={pickerActive}
        title="选择乐手位置"
      />

      <View
        className="page-padding-h container-v"
        style={{
          paddingTop: 16,
          paddingBottom: 16,
          gap: 16,
        }}
      >
        <JXButton onClick={() => setPickerActive(true)} variant="outlined">
          添加
        </JXButton>
        <JXButton onClick={handleSubmit}>保存</JXButton>
      </View>
    </View>
  );
}
