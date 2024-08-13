import { users, problems, testCases } from './schema';
import bcrypt from 'bcrypt';

const difficulties = ['Easy', 'Medium', 'Hard'];
const roles = ['solver', 'creator', 'admin'];

const codingProblems = [
    {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "Easy",
        testCases: [
            { input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }), output: JSON.stringify([0, 1]) },
            { input: JSON.stringify({ nums: [3, 2, 4], target: 6 }), output: JSON.stringify([1, 2]) },
            { input: JSON.stringify({ nums: [3, 3], target: 6 }), output: JSON.stringify([0, 1]) },
        ]
    },
    {
        title: "Reverse Integer",
        description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], then return 0.",
        difficulty: "Medium",
        testCases: [
            { input: JSON.stringify({ x: 123 }), output: JSON.stringify(321) },
            { input: JSON.stringify({ x: -123 }), output: JSON.stringify(-321) },
            { input: JSON.stringify({ x: 120 }), output: JSON.stringify(21) },
        ]
    },
    {
        title: "Longest Palindromic Substring",
        description: "Given a string s, return the longest palindromic substring in s.",
        difficulty: "Medium",
        testCases: [
            { input: JSON.stringify({ s: "babad" }), output: JSON.stringify("bab") },
            { input: JSON.stringify({ s: "cbbd" }), output: JSON.stringify("bb") },
            { input: JSON.stringify({ s: "a" }), output: JSON.stringify("a") },
        ]
    },
    {
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: 1. Open brackets must be closed by the same type of brackets. 2. Open brackets must be closed in the correct order.",
        difficulty: "Easy",
        testCases: [
            { input: JSON.stringify({ s: "()" }), output: JSON.stringify(true) },
            { input: JSON.stringify({ s: "()[]{}" }), output: JSON.stringify(true) },
            { input: JSON.stringify({ s: "(]" }), output: JSON.stringify(false) },
        ]
    },
    {
        title: "Merge k Sorted Lists",
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        difficulty: "Hard",
        testCases: [
            { input: JSON.stringify({ lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }), output: JSON.stringify([1, 1, 2, 3, 4, 4, 5, 6]) },
            { input: JSON.stringify({ lists: [] }), output: JSON.stringify([]) },
            { input: JSON.stringify({ lists: [[]] }), output: JSON.stringify([]) },
        ]
    },
];
// @ts-ignore
const generateUsers = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync('password123', 10),
        role: roles[Math.floor(Math.random() * roles.length)],
    }));
};

// @ts-ignore
const generateAdditionalTestCases = (problemId, baseTestCases) => {
    const additionalTestCases = Array.from({ length: 17 }, (_, i) => ({
        problemId,
        input: JSON.stringify({ sample: `additional_input_${i + 1}` }),
        output: JSON.stringify({ result: `additional_output_${i + 1}` }),
        isPublic: false,
    }));

    return [
        // @ts-ignore
        ...baseTestCases.map((testCase, index) => ({
            ...testCase,
            problemId,
            isPublic: index < 2, // Make the first two test cases public
        })),
        // ...additionalTestCases
    ];
};

// @ts-ignore
export async function seed(db) {
    // Insert users
    const createdUsers = await db.insert(users).values(generateUsers(10)).returning();
    // @ts-ignore
    const userIds = createdUsers.map(user => user.id);

    // Insert problems and test cases
    for (const problem of codingProblems) {
        const [createdProblem] = await db.insert(problems).values({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            creatorId: userIds[Math.floor(Math.random() * userIds.length)],
        }).returning();

        await db.insert(testCases).values(generateAdditionalTestCases(createdProblem.id, problem.testCases));
    }

    console.log('Seed data inserted successfully');
}
