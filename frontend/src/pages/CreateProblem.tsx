import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface TestCase {
  input: string;
  output: string;
  isPublic: boolean;
}

const CreateProblem: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([{ input: '', output: '', isPublic: false }]);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleTestCaseChange = (index: number, field: keyof TestCase, value: string | boolean) => {
    const updatedTestCases = testCases.map((testCase, i) => 
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '', isPublic: false }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    
    try {
      await api.post('/problems', { title, description, difficulty, testCases });
      navigate('/problems');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create problem');
    }
  };

  const inputClassName = `w-full p-2 border rounded ${
    isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
  }`;

  const buttonClassName = `px-4 py-2 rounded ${
    isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
  }`;

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      {error && <div className={`border px-4 py-3 rounded mb-4 ${isDarkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'}`}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Title</label>
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
          <label htmlFor="description" className="block mb-2">Description</label>
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
          <label htmlFor="difficulty" className="block mb-2">Difficulty</label>
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
            <div key={index} className={`mb-4 p-4 border rounded ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <div className="mb-2">
                <label htmlFor={`input-${index}`} className="block mb-1">Input</label>
                <textarea
                  id={`input-${index}`}
                  value={testCase.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  className={inputClassName}
                  rows={2}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`output-${index}`} className="block mb-1">Output</label>
                <textarea
                  id={`output-${index}`}
                  value={testCase.output}
                  onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
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
                    onChange={(e) => handleTestCaseChange(index, 'isPublic', e.target.checked)}
                    className="mr-2"
                  />
                  Public test case
                </label>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className={`px-2 py-1 rounded ${isDarkMode ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  Remove Test Case
                </button>
              )}
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
          className={`${buttonClassName} ${isDarkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-500 hover:bg-green-600'}`}
        >
          Create Problem
        </button>
      </form>
    </div>
  )};

export default CreateProblem;