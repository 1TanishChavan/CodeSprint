import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import useAppStore from "../store/useStore";
import { Problem } from "../types";

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, darkMode } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get("/problems");
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Coding Problems</h1>
      <p className="text-small mb-4">
        Challenge yourself with coding problems and improve your skills!
      </p>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:"
          className={`w-full p-3 rounded-md transition-colors duration-200 ease-in-out
            ${
              darkMode
                ? "bg-gray-800 text-white border-transparent"
                : "bg-white text-black border"
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
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            className="bg-stone-100 dark:bg-gray-800 p-4 rounded shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
            <p className="mb-2">{problem.description}</p>
            <p className="mb-2">Difficulty: {problem.difficulty}</p>
            <div className="flex space-x-2">
              <Link
                to={`/problems/${problem.id}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Solve this problem
              </Link>
              {(user?.role === "creator" || user?.role === "admin") && (
                <Link
                  to={`/problems/${problem.id}/edit`}
                  className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;
