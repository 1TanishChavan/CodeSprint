import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import api from "../api";
import useAppStore from "../store/useStore";

interface CodingEnvironmentProps {
  problemId: number;
  onSubmissionComplete: (submission: any) => void;
}

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

const CodingEnvironment: React.FC<CodingEnvironmentProps> = ({
  problemId,
  onSubmissionComplete,
}) => {
  const { user } = useAppStore();
  const { darkMode } = useAppStore();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to submit code.");
      return;
    }
    if (!code.trim()) {
      onSubmissionComplete({
        status: "Empty Code",
        empty: "Empty Code Submitted",
        suggestion: "Please write some code before submitting.",
        detailedStatus: "Submission failed due to empty code.",
      });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await api.post("/submissions", {
        userId: user.id,
        problemId,
        code,
        language,
      });
      if (response.data.error === "Language mismatch") {
        onSubmissionComplete(response.data);
        return;
      }

      onSubmissionComplete(response.data);
    } catch (error: any) {
      console.error("Submission failed:", error);

      setError(
        error.response?.data?.error ||
          "An error occurred while submitting your code."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`mt-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`p-2 border rounded mb-2 sm:mb-0 sm:mr-2 ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          disabled={submitting || !user}
          className={`px-4 py-2 rounded transition duration-300 ${
            darkMode
              ? "bg-green-700 text-white hover:bg-green-800 disabled:opacity-50"
              : "bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
          }`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme={darkMode ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontFamily: "'Fira Code', monospace",
          fontSize: 14,
        }}
      />
    </div>
  );
};

export default CodingEnvironment;
