import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from './models/schema';
import { users, problems, testCases, submissions } from './models/schema';
import { db } from './db';

async function seed() {
    // Seed users (unchanged)
    const createdUsers = await db.insert(users).values([
        { name: 'John Doe', email: 'john@example.com', password: 'hashed_password', role: 'solver' },
        { name: 'Jane Smith', email: 'jane@example.com', password: 'hashed_password', role: 'creator' },
        { name: 'Admin User', email: 'admin@example.com', password: 'hashed_password', role: 'admin' },
    ]).returning();

    // Seed problems (unchanged)
    const createdProblems = await db.insert(problems).values([
        { title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', difficulty: 'Easy', creatorId: createdUsers[1].id },
        { title: 'Reverse String', description: 'Write a function that reverses a string. The input string is given as an array of characters s.', difficulty: 'Easy', creatorId: createdUsers[1].id },
        { title: 'Palindrome Number', description: 'Given an integer x, return true if x is a palindrome, and false otherwise.', difficulty: 'Easy', creatorId: createdUsers[1].id },
        { title: 'Valid Anagram', description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', difficulty: 'Easy', creatorId: createdUsers[1].id },
        { title: 'Binary Search', description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.', difficulty: 'Medium', creatorId: createdUsers[1].id },
        { title: 'Merge Sorted Arrays', description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order.', difficulty: 'Medium', creatorId: createdUsers[1].id },
        { title: 'Reverse Bits', description: 'Reverse bits of a given 32 bits unsigned integer.', difficulty: 'Medium', creatorId: createdUsers[1].id },
        { title: 'Longest Palindromic Substring', description: 'Given a string s, return the longest palindromic substring in s.', difficulty: 'Medium', creatorId: createdUsers[1].id },
        { title: 'Count Set Bits', description: 'Write a function that takes an unsigned integer and returns the number of "1" bits it has (also known as the Hamming weight).', difficulty: 'Easy', creatorId: createdUsers[1].id },
        { title: 'Rotate Array', description: 'Given an array, rotate the array to the right by k steps, where k is non-negative.', difficulty: 'Medium', creatorId: createdUsers[1].id },
    ]).returning();

    // Seed test cases (problem-specific)
    const testCasesData = [
        // Two Sum
        { problemId: createdProblems[0].id, input: '[2,7,11,15], target = 9', output: '[0,1]', isPublic: true },
        { problemId: createdProblems[0].id, input: '[3,2,4], target = 6', output: '[1,2]', isPublic: true },
        { problemId: createdProblems[0].id, input: '[3,3], target = 6', output: '[0,1]', isPublic: false },
        { problemId: createdProblems[0].id, input: '[1,2,3,4,5], target = 9', output: '[3,4]', isPublic: false },
        { problemId: createdProblems[0].id, input: '[-1,-2,-3,-4,-5], target = -8', output: '[2,4]', isPublic: false },

        // Reverse String
        { problemId: createdProblems[1].id, input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]', isPublic: true },
        { problemId: createdProblems[1].id, input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', isPublic: true },
        { problemId: createdProblems[1].id, input: '["a"]', output: '["a"]', isPublic: false },
        { problemId: createdProblems[1].id, input: '["a","b","c","d"]', output: '["d","c","b","a"]', isPublic: false },
        { problemId: createdProblems[1].id, input: '[""]', output: '[""]', isPublic: false },

        // Palindrome Number
        { problemId: createdProblems[2].id, input: '121', output: 'true', isPublic: true },
        { problemId: createdProblems[2].id, input: '-121', output: 'false', isPublic: true },
        { problemId: createdProblems[2].id, input: '10', output: 'false', isPublic: false },
        { problemId: createdProblems[2].id, input: '1221', output: 'true', isPublic: false },
        { problemId: createdProblems[2].id, input: '0', output: 'true', isPublic: false },

        // Valid Anagram
        { problemId: createdProblems[3].id, input: 's = "anagram", t = "nagaram"', output: 'true', isPublic: true },
        { problemId: createdProblems[3].id, input: 's = "rat", t = "car"', output: 'false', isPublic: true },
        { problemId: createdProblems[3].id, input: 's = "listen", t = "silent"', output: 'true', isPublic: false },
        { problemId: createdProblems[3].id, input: 's = "hello", t = "world"', output: 'false', isPublic: false },
        { problemId: createdProblems[3].id, input: 's = "", t = ""', output: 'true', isPublic: false },

        // Binary Search
        { problemId: createdProblems[4].id, input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', isPublic: true },
        { problemId: createdProblems[4].id, input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', isPublic: true },
        { problemId: createdProblems[4].id, input: 'nums = [1], target = 1', output: '0', isPublic: false },
        { problemId: createdProblems[4].id, input: 'nums = [1,2,3,4,5], target = 6', output: '-1', isPublic: false },
        { problemId: createdProblems[4].id, input: 'nums = [-5,-3,0,2,5], target = -3', output: '1', isPublic: false },

        // Merge Sorted Arrays
        { problemId: createdProblems[5].id, input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]', isPublic: true },
        { problemId: createdProblems[5].id, input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]', isPublic: true },
        { problemId: createdProblems[5].id, input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]', isPublic: false },
        { problemId: createdProblems[5].id, input: 'nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3', output: '[1,2,3,4,5,6]', isPublic: false },
        { problemId: createdProblems[5].id, input: 'nums1 = [1,2,3,4,5,0], m = 5, nums2 = [6], n = 1', output: '[1,2,3,4,5,6]', isPublic: false },

        // Reverse Bits
        { problemId: createdProblems[6].id, input: '00000010100101000001111010011100', output: '00111001011110000010100101000000', isPublic: true },
        { problemId: createdProblems[6].id, input: '11111111111111111111111111111101', output: '10111111111111111111111111111111', isPublic: true },
        { problemId: createdProblems[6].id, input: '00000000000000000000000000000001', output: '10000000000000000000000000000000', isPublic: false },
        { problemId: createdProblems[6].id, input: '11111111111111111111111111111111', output: '11111111111111111111111111111111', isPublic: false },
        { problemId: createdProblems[6].id, input: '10101010101010101010101010101010', output: '01010101010101010101010101010101', isPublic: false },

        // Longest Palindromic Substring
        { problemId: createdProblems[7].id, input: '"babad"', output: '"bab"', isPublic: true },
        { problemId: createdProblems[7].id, input: '"cbbd"', output: '"bb"', isPublic: true },
        { problemId: createdProblems[7].id, input: '"a"', output: '"a"', isPublic: false },
        { problemId: createdProblems[7].id, input: '"racecar"', output: '"racecar"', isPublic: false },
        { problemId: createdProblems[7].id, input: '"abcde"', output: '"a"', isPublic: false },

        // Count Set Bits
        { problemId: createdProblems[8].id, input: '00000000000000000000000000001011', output: '3', isPublic: true },
        { problemId: createdProblems[8].id, input: '00000000000000000000000010000000', output: '1', isPublic: true },
        { problemId: createdProblems[8].id, input: '11111111111111111111111111111111', output: '32', isPublic: false },
        { problemId: createdProblems[8].id, input: '00000000000000000000000000000000', output: '0', isPublic: false },
        { problemId: createdProblems[8].id, input: '10101010101010101010101010101010', output: '16', isPublic: false },

        // Rotate Array
        { problemId: createdProblems[9].id, input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]', isPublic: true },
        { problemId: createdProblems[9].id, input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]', isPublic: true },
        { problemId: createdProblems[9].id, input: 'nums = [1], k = 0', output: '[1]', isPublic: false },
        { problemId: createdProblems[9].id, input: 'nums = [1,2,3,4,5], k = 5', output: '[1,2,3,4,5]', isPublic: false },
        { problemId: createdProblems[9].id, input: 'nums = [1,2], k = 3', output: '[2,1]', isPublic: false },
    ];

    await db.insert(testCases).values(testCasesData);

    // Seed submissions (unchanged)
    await db.insert(submissions).values([
        { userId: createdUsers[0].id, problemId: createdProblems[0].id, code: 'function twoSum(nums, target) { /* ... */ }', language: 'javascript', status: 'Accepted' },
        { userId: createdUsers[0].id, problemId: createdProblems[1].id, code: 'def reverse_string(s): # ...', language: 'python', status: 'Rejected' },
        { userId: createdUsers[0].id, problemId: createdProblems[2].id, code: 'public boolean isPalindrome(int x) { /* ... */ }', language: 'java', status: 'Accepted' },
        { userId: createdUsers[0].id, problemId: createdProblems[3].id, code: '#include <iostream>\n// ...\nbool isAnagram(string s, string t) { /* ... */ }', language: 'cpp', status: 'Accepted' },
        { userId: createdUsers[0].id, problemId: createdProblems[4].id, code: 'fn binary_search(arr: &[i32], target: i32) -> Option<usize> { /* ... */ }', language: 'rust', status: 'In Progress' },
    ]);

    console.log('Seed data inserted successfully');
}

export async function seeding() {
    try {

        console.log('Migrating and seeding database...');
        await migrate(db, { migrationsFolder: './../database/migrations' });
        await seed();
        console.log('Migration and seeding completed.');
        return true
    } catch (err: any) {
        return false
    }
}
