export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'creator' | 'solver';
}

export interface Problem {
    id: number;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    testCases: TestCase[];
}

export interface Submission {
    id: number;
    userId: number;
    problemId: number;
    problemTitle?: string;
    code: string;
    language: string;
    status: 'pending' | 'accepted' | 'rejected';
    submittedAt: string;
}

export interface TestCase {
    id?: number;
    problemId?: number;
    input: string;
    output: string;
    isPublic: boolean;
}

export interface SubmissionResult {
    testCaseId: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    matches: boolean;
    error: string | null;
}


export interface AppState {
    user: User | null;
    token: string | null;
    darkMode: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    login: (user: User, token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    toggleDarkMode: () => void;
}

export interface LanguageMismatch {
    specifiedLanguage: string;
    actualLanguage: string;
}