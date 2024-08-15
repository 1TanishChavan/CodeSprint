import React from "react";
import useAppStore from "../store/useStore";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  ...props
}) => {
  const { darkMode } = useAppStore();

  const getButtonClass = () => {
    const baseClass =
      "px-4 py-2 rounded-md text-white font-semibold transition duration-300";
    switch (variant) {
      case "primary":
        return `${baseClass} ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        }`;
      case "secondary":
        return `${baseClass} ${
          darkMode
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-gray-500 hover:bg-gray-600"
        }`;
      case "warning":
        return `${baseClass} ${
          darkMode
            ? "bg-teal-600 hover:bg-teal-700"
            : "bg-teal-500 hover:bg-teal-600"
        }`;
      case "danger":
        return `${baseClass} ${
          darkMode
            ? "bg-red-600 hover:bg-red-700"
            : "bg-red-500 hover:bg-red-600"
        }`;
      default:
        return baseClass;
    }
  };

  return (
    <button className={getButtonClass()} {...props}>
      {children}
    </button>
  );
};

export default Button;
