import React from "react";
import useAppStore from "../store/useStore";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { darkMode } = useAppStore();

  return (
    <div
      className={`p-4 rounded-md mb-4 ${
        darkMode
          ? "bg-red-900 border-red-700 text-red-200"
          : "bg-red-100 border-red-400 text-red-700"
      }`}
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
