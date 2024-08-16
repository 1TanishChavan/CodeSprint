import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodingEnvironment from "../components/CodingEnvironment";
import Modal from "../components/Modal";
import api from "../api";
import useAppStore from "../store/useStore";
import {
  Problem,
  Submission,
  SubmissionResult,
  LanguageMismatch,
} from "../types";

// interface Submission {
//   id: number;
//   status: "Accepted" | "Failed";
//   language: string;
//   submittedAt: string;
// }

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<{
    status: string;
    suggestion: string;
    detailedStatus: string;
    results: SubmissionResult[];
  } | null>(null);
  const [languageMismatch, setLanguageMismatch] =
    useState<LanguageMismatch | null>(null);
  const [emptyCode, setEmptyCode] = useState<{
    status: string;
    empty: string;
    suggestion: string;
    detailedStatus: string;
  } | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  useEffect(() => {
    const fetchProblemAndSubmissions = async () => {
      try {
        setLoading(true);
        const [problemResponse, submissionsResponse] = await Promise.all([
          api.get(`/problems/${id}`),
          api.get(`/problems?problemId=${id}`),
        ]);
        setProblem(problemResponse.data);
        setSubmissions(submissionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load problem details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemAndSubmissions();
  }, [id, user]);

  const handleSubmissionComplete = (
    submission:
      | { status: string; results: SubmissionResult[] }
      | { error: string; specifiedLanguage: string; actualLanguage: string }
      | {
          status: string;
          empty: string;
          suggestion: string;
          detailedStatus: string;
        }
  ) => {
    if ("error" in submission && submission.error === "Language mismatch") {
      setLanguageMismatch({
        specifiedLanguage: submission.specifiedLanguage,
        actualLanguage: submission.actualLanguage,
      });
      setLatestSubmission(null);
      setShowResultsModal(true);
    } else if (
      "empty" in submission &&
      submission.empty === "Empty code submission"
    ) {
      setEmptyCode({
        status: submission.status,
        empty: submission.empty,
        suggestion: submission.suggestion,
        detailedStatus: submission.detailedStatus,
      });
      setLatestSubmission(null);
      setShowResultsModal(true);
    } else {
      setLanguageMismatch(null);
      setLatestSubmission(
        submission as {
          status: string;
          suggestion: string;
          detailedStatus: string;
          results: SubmissionResult[];
        }
      );
      setShowResultsModal(true);
      // @ts-ignore
      setSubmissions((prev) => [
        {
          id: Date.now(),
          // @ts-ignore
          status: submission.status,
          language: "Unknown",
          submittedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!problem) {
    return <div className="container mx-auto p-4">Problem not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate("/problems")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Back to Problems
      </button>
      <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
      <p
        className={`mb-4 text-lg font-semibold ${getDifficultyColor(
          problem.difficulty
        )}`}
      >
        Difficulty: {problem.difficulty}
      </p>
      <div
        className="mb-6 prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: problem.description }}
      />
      <h2 className="text-2xl font-semibold mb-2">Sample Test Cases</h2>
      <div className="mb-6">
        {problem.testCases.map((testCase, index) => (
          <div
            key={index}
            className="mb-2 p-4 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <p className="font-mono">Input: {testCase.input}</p>
            <p className="font-mono">Output: {testCase.output}</p>
          </div>
        ))}
      </div>

      <CodingEnvironment
        problemId={problem.id}
        onSubmissionComplete={handleSubmissionComplete}
      />
      {languageMismatch && (
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
        >
          <h2 className="text-2xl font-semibold mb-4">Language Mismatch</h2>
          <p className={`text-lg font-semibold ${"Rejected text-red-500"}`} />
          <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className="font-bold">Language Mismatch Detected</p>
            <p>You specified: {languageMismatch.specifiedLanguage}</p>
            <p>Detected language: {languageMismatch.actualLanguage}</p>
            <p>
              Please ensure you're using the correct language for your
              submission.
            </p>
          </div>
        </Modal>
      )}
      {emptyCode && (
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
        >
          <h2 className="text-2xl font-semibold mb-4">{emptyCode.empty}</h2>
          <p className={`text-lg font-semibold ${"Rejected text-red-500"}`} />
          <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className={`text-lg font-semibold text-red-500`}>
              Status: {emptyCode.status}
            </p>
            <p className="mt-2">{emptyCode.detailedStatus}</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Suggestion:</h3>
            <p>{emptyCode.suggestion}</p>
          </div>
        </Modal>
      )}

      {latestSubmission && (
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
        >
          <h2 className="text-2xl font-semibold mb-4">Submission Results</h2>
          <p
            className={`text-lg font-semibold ${
              latestSubmission.status === "Accepted"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            Status: {latestSubmission.status}
          </p>
          <p className="mt-2">{latestSubmission.detailedStatus}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Suggestion:</h3>
          <p>{latestSubmission.suggestion}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">
            Test Case Results:
          </h3>
          <ul className="mt-2 space-y-2">
            {latestSubmission.results.map((result, index) => (
              <li
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-2 rounded"
              >
                <p>
                  Test Case {index + 1}: {result.matches ? "Passed" : "Failed"}
                </p>
                {!result.matches && (
                  <>
                    <p>Expected: {result.expectedOutput}</p>
                    <p>Actual: {result.actualOutput}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
};

export default ProblemDetail;
