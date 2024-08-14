import React, { useState } from "react";
import useAppStore from "../store/useStore";

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputBox: React.FC<InputBoxProps> = ({ label, id, ...props }) => {
  const { darkMode } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          {...props}
          className={`w-full p-3 rounded-md transition-colors duration-200 ease-in-out
            ${
              darkMode
                ? "bg-gray-800 text-white border-transparent"
                : "bg-white text-black border-gray-300"
            }
            ${
              isFocused
                ? darkMode
                  ? "ring-2 ring-blue-500"
                  : "ring-2 ring-blue-500"
                : ""
            }
            focus:outline-none`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {darkMode && (
          <div
            className={`absolute inset-0 rounded-md pointer-events-none ${
              isFocused ? "border-2 border-blue-500" : "border border-gray-600"
            }`}
          ></div>
        )}
      </div>
    </div>
  );
};

export default InputBox;
