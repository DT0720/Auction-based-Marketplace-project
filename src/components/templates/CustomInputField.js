// src/components/Form/CustomInputField.js
import React from "react";
import { Input } from "../ui/input";

export default function CustomInputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  maxLength,
  className = "",
  margin = "",
  padding = ""
}) {
    return (
        <div className={`${margin} ${padding} ${className}`}>
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
