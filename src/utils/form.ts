interface FormValidProps {
  // 需要满足数组中所有的条件，才算有效
  (values: any[]): boolean;
}

export const isFormValid: FormValidProps = (values) => {
  return values.every((v) => v);
};
