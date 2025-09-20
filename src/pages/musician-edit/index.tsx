import { View } from "@tarojs/components";
import "./index.scss";
import JXFormLabel from "@/components/Labels/JXFormLabel";
import { Cell, Field, Input, Textarea } from "@taroify/core";
import JXBandPosPicker from "@/components/Pickers/JXBandPosPicker";
import JXButton from "@/components/JXButton";
import { useMusicianForm } from "@/hooks/musician/useMusicianForm";
import { MUSICIAN_DISPLAY_CONFIG } from "@/constants/utils/musician";
import { JXToast } from "@/utils/toast";

export default function MusicianEdit() {
  const {
    formData,
    pickerActive,
    setPickerActive,
    appendMusicianProfile,
    getExcludedPositions,
    handleSubmit,
    updateFormData,
    didUserEdit,
  } = useMusicianForm();

  return (
    <View className="musician-edit config-page">
      {formData.map((mp, index) => {
        // mp stands for musician-profile
        const { label, emoji } = MUSICIAN_DISPLAY_CONFIG[mp.position];

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
          gap: 8,
        }}
      >
        <JXButton onClick={() => setPickerActive(true)} variant="outlined">
          添加
        </JXButton>
        {didUserEdit() && (
          <JXButton
            onClick={async () => {
              await handleSubmit();
              JXToast.success("保存成功！");
            }}
          >
            保存
          </JXButton>
        )}
      </View>
    </View>
  );
}
