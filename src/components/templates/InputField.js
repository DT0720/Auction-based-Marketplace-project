// src/components/Form/InputField.js
import { Input } from "../ui/input";

export default function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  maxLength,
  required = false,
}) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required={required}
        className="mt-1"
      />
    </div>
  );
}
