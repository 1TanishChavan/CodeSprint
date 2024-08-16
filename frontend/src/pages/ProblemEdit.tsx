import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import useAppStore from "../store/useStore";
// import { Problem } from "../types";
interface TestCase {
  id: number;
  input: string;
  output: string;
  isPublic: boolean;
  status?: "unchanged" | "modified" | "added" | "deleted";
}
interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  testCases: TestCase[];
}
const ProblemEdit: React.FC = () => {
  const { darkMode } = useAppStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletedTestCases, setDeletedTestCases] = useState<number[]>();
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get<Problem>(`/problems/edit/${id}`);
        setProblem(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setDifficulty(response.data.difficulty);
        setTestCases(response.data.testCases || []);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setError("Failed to fetch problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // Update handleTestCaseChange
  const handleTestCaseChange = (
    index: number,
    field: keyof TestCase,
    value: string | boolean
  ) => {
    setTestCases((prevTestCases) =>
      prevTestCases.map((testCase, i) =>
        i === index
          ? {
              ...testCase,
              [field]: value,
              status: testCase.status === "added" ? "added" : "modified",
            }
          : testCase
      )
    );
  };

  // Update addTestCase
  const addTestCase = () => {
    setTestCases((prevTestCases) => [
      ...prevTestCases,
      {
        id: Date.now(),
        input: "",
        output: "",
        isPublic: false,
        status: "added",
      }, // Using Date.now() as a temporary ID
    ]);
  };

  // Update removeTestCase
  const removeTestCase = (index: number) => {
    setTestCases((prevTestCases) => {
      const testCase = prevTestCases[index];
      if (testCase.status === "added") {
        return prevTestCases.filter((_, i) => i !== index);
      } else {
        // @ts-ignore
        setDeletedTestCases((prev) => [...prev, testCase.id]);
        return prevTestCases.filter((_, i) => i !== index);
      }
    });
  };

  // Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(`/problems/${id}`, {
        title,
        description,
        difficulty,
        testCases: testCases.filter((tc) => tc.status !== "unchanged"),
        deletedTestCases,
      });
      navigate("/problems");
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to update problem");
    }
  };

  if (loading) {
    return (
      <div className={darkMode ? "text-white" : "text-black"}>Loading...</div>
    );
  }

  if (error) {
    return (
      <div className={darkMode ? "text-red-300" : "text-red-600"}>
        Error: {error}
      </div>
    );
  }

  if (!problem) {
    return (
      <div className={darkMode ? "text-white" : "text-black"}>
        Problem not found
      </div>
    );
  }

  const inputClassName = `w-full p-2 border rounded ${
    darkMode
      ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
      : "bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500"
  } appearance-none focus:outline-none focus:ring-2`;

  const buttonClassName = `px-4 py-2 rounded ${
    darkMode
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-blue-500 text-white hover:bg-blue-600"
  }`;

  return (
    <div
      className={`container mx-auto px-4 py-8 transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Edit Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClassName}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClassName}
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
            className={inputClassName}
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
              key={testCase.id}
              className={`mb-4 p-4 border rounded ${
                darkMode ? "border-gray-600" : "border-gray-300"
              }`}
            >
              <div className="mb-2">
                <label htmlFor={`input-${index}`} className="block mb-1">
                  Input
                </label>
                <textarea
                  id={`input-${index}`}
                  value={testCase.input}
                  onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                  }
                  className={inputClassName}
                  rows={2}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`output-${index}`} className="block mb-1">
                  Output
                </label>
                <textarea
                  id={`output-${index}`}
                  value={testCase.output}
                  onChange={(e) =>
                    handleTestCaseChange(index, "output", e.target.value)
                  }
                  className={inputClassName}
                  rows={2}
                  required
                />
              </div>
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
              <button
                type="button"
                onClick={() => removeTestCase(index)}
                className={`px-2 py-1 rounded ${
                  darkMode
                    ? "bg-red-700 text-white hover:bg-red-800"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Remove Test Case
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTestCase}
            className={buttonClassName}
          >
            Add Test Case
          </button>
        </div>
        <button
          type="submit"
          className={`${buttonClassName} ${
            darkMode
              ? "bg-green-700 hover:bg-green-800"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Update Problem
        </button>
      </form>
    </div>
  );
};

export default ProblemEdit;
