import React, { useEffect, useState } from "react";
import api from "../api";
import useAppStore from "../store/useStore";
import { Submission } from "../types";
// interface Submission {
//   id: number;
//   problemId: number;
//   problemTitle: string;
//   status: string;
//   language: string;
//   createdAt: string;
// }

const Dashboard: React.FC = () => {
  const { user } = useAppStore();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/user/dashboard");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Your Submissions</h2>
      <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-4 text-left">Problem Title</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Language</th>
                  <th className="py-2 px-4 text-left">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b dark:border-gray-600"
                  >
                    <td className="py-2 px-4">{submission.problemTitle}</td>
                    <td className="py-2 px-4">{submission.status}</td>
                    <td className="py-2 px-4">{submission.language}</td>
                    <td className="py-2 px-4">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
