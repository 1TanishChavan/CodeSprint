import React, { useEffect, useState } from 'react';
import api from '../api'; 

interface Submission {
  id: number;
  problemId: number;
  problemTitle: string
  status: string;
  language: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/user/dashboard');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Your Submissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
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
              <tr key={submission.id} className="border-b dark:border-gray-600">
                <td className="py-2 px-4">{submission.problemTitle}</td>
                <td className="py-2 px-4">{submission.status}</td>
                <td className="py-2 px-4">{submission.language}</td>
                <td className="py-2 px-4">{new Date(submission.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;