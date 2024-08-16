import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useAppStore from "../store/useStore";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
// import { TestCase } from "../types";

interface TestCase {
  input: string;
  output: string;
  isPublic: boolean;
}

const CreateProblem: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", output: "", isPublic: false },
  ]);
  const [error, setError] = useState("");
  const { darkMode } = useAppStore();

  const handleTestCaseChange = (
    index: number,
    field: keyof TestCase,
    value: string | boolean
  ) => {
    const updatedTestCases = testCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "", isPublic: false }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/problems", {
        title,
        description,
        difficulty,
        test_cases: testCases,
      });
      navigate("/problems");
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to create problem");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <InputBox
          label="Title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full p-2 border rounded ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            rows={5}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="difficulty" className="block mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={`w-full p-2 border rounded ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Test Cases</h2>
          {testCases.map((testCase, index) => (
            <div
              key={index}
              className={`mb-4 p-4 border rounded ${
                darkMode ? "border-gray-600" : "border-gray-300"
              }`}
            >
              <InputBox
                label="Input"
                id={`input-${index}`}
                type="text"
                value={testCase.input}
                onChange={(e) =>
                  handleTestCaseChange(index, "input", e.target.value)
                }
                required
              />
              <InputBox
                label="Output"
                id={`output-${index}`}
                type="text"
                value={testCase.output}
                onChange={(e) =>
                  handleTestCaseChange(index, "output", e.target.value)
                }
                required
              />
              <div className="mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={testCase.isPublic}
                    onChange={(e) =>
                      handleTestCaseChange(index, "isPublic", e.target.checked)
                    }
                    className="mr-2"
                  />
                  Public test case
                </label>
              </div>
              {index > 0 && (
                <Button variant="danger" onClick={() => removeTestCase(index)}>
                  Remove Test Case
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={addTestCase} variant="warning">
            Add Test Case
          </Button>
        </div>
        <Button type="submit">Create Problem</Button>
      </form>
    </div>
  );
};

export default CreateProblem;
