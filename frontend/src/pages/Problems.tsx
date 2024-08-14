import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import useAppStore from "../store/useStore";
import { Problem } from "../types";

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { user } = useAppStore();

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Coding Problems</h1>
      <p className="text-small mb-4">
        Challenge yourself with coding problems and improve your skills!
      </p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
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
