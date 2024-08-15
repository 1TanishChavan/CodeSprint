import express from 'express';
import { db } from '../db';
import { submissions, problems, testCases } from '../models/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from '../middleware/auth';
import NodeCache from 'node-cache';
import { logger, promptLogger } from '../utils/logger';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Initialize cache
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache for 10 minutes

async function checkCodeWithGemini(problemTitle: string, problemDescription: string, code: string, language: string, testCases: any[]) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
        }
    });

    const prompt = `
    You are a code execution and validation system. Your task is to analyze the following code for the given problem and execute it with multiple sets of inputs, comparing the outputs to the expected outputs.
    
    Problem Title: ${problemTitle}
    Problem Description: ${problemDescription}
    
    Code (${language}):
    ${code}
    
    Test Cases:
    ${testCases.map((tc, index) => `
    Test Case ${index + 1}:
    Input: ${tc.input}
    Expected Output: ${tc.output}
    `).join('\n')}
    
    Important Instructions:
    1. Verify that the provided code matches the specified language (${language}). If there's a mismatch, report it as an error.
    2. Execute the code for each test case using the given input.
    3. Compare the actual output with the expected output. The comparison should be case-sensitive and type-sensitive.
    4. If there are any errors in the code execution, provide the error message.
    
    For each test case, provide the following information:
    1. The actual output produced by the code on the given input.
    2. Whether the actual output exactly matches the expected output (true/false).
    3. Any error messages encountered during execution.
    
    Return your response in the following JSON format:
    {
        "languageCheck": {
            "specifiedLanguage": "${language}",
            "actualLanguage": "The language of the provided code",
            "matches": true/false
        },
        "results": [
            {
                "testCaseId": 1,
                "input": "The input for this test case",
                "expectedOutput": "The expected output for this test case",
                "actualOutput": "The output produced by the code",
                "matches": true/false,
                "error": "Any error message, or null if no errors"
            },
            // ... (for each test case)
        ],
        "suggestion": "Your 2-line suggestion for improving the code",
        "status": "If all the matches of testcase are true than send Accepted if not than send Failed"
        "detailedStatus": "A string describing the overall status, including passed and failed test cases"

    }
    `;

    try {
        promptLogger.debug('Gemini Prompt:', { prompt });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        promptLogger.debug('Gemini Response:', { response: text });

        try {
            return JSON.parse(text);
        } catch (error) {
            logger.error("Error parsing Gemini response", { error, text });
            throw new Error("Failed to parse Gemini response");
        }
    } catch (error) {
        logger.error("Error calling Gemini API", { error });
        throw error;
    }
}

router.post('/', authenticateToken, async (req, res) => {
    const { problemId, code, language } = req.body;
    const userId = req.user?.userId;

    if (!code.trim()) {
        return res.status(400).json({
            message: 'Submission processed',
            status: 'Failed',
            error: 'Empty code submission',
            results: [],
            suggestion: 'Please write some code before submitting.',
            detailedStatus: 'Submission failed due to empty code.'
        });
    }

    let eva: {
        status: "Accepted" | "Failed",
        suggestion: string,
        detailedStatus: string
    } = {
        status: "Failed",
        suggestion: "",
        detailedStatus: ""
    };

    if (!userId) {
        return res.status(403).json({ error: 'Unauthorized submission' });
    }

    try {
        // Fetch problem details
        const [problem] = await db.select().from(problems).where(eq(problems.id, problemId));
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Fetch all test cases for the problem
        const testCasesData = await db.select().from(testCases).where(eq(testCases.problemId, problemId));

        // Generate cache key
        const cacheKey = `${problemId}:${language}:${code}`;

        // Try to get results from cache
        let results = cache.get(cacheKey);

        if (!results) {
            logger.info("Cache miss, calling Gemini API", { problemId, language });
            // If not in cache, call Gemini API
            const geminiResponse = await checkCodeWithGemini(problem.title, problem.description, code, language, testCasesData);

            // Check for language mismatch
            const languageCheck = geminiResponse.languageCheck;
            if (!languageCheck.matches) {
                return res.status(201).json({
                    error: 'Language mismatch',
                    specifiedLanguage: languageCheck.specifiedLanguage,
                    actualLanguage: languageCheck.actualLanguage
                });
            }

            // Process Gemini results
            results = geminiResponse.results.map((result: any, index: number) => ({
                testCaseId: testCasesData[index].id,
                input: testCasesData[index].input,
                expectedOutput: testCasesData[index].output,
                actualOutput: result.actualOutput,
                matches: result.matches,
                error: result.error,
            }));

            eva.status = geminiResponse.status;
            eva.detailedStatus = geminiResponse.detailedStatus;
            eva.suggestion = geminiResponse.suggestion;

            // Store in cache
            cache.set(cacheKey, results);
            logger.info("Stored results in cache", { cacheKey });
        } else {
            logger.info("Cache hit, using cached results", { cacheKey });
        }

        // Determine overall submission status
        // @ts-ignore
        // const status = results.every((r: any) => r.matches) ? 'Accepted' : 'Failed';

        // Save submission to database
        const [newSubmission] = await db.insert(submissions).values({
            userId,
            problemId,
            code,
            language,
            status: eva.status,
        }).returning();

        logger.info("New submission created", { submissionId: newSubmission.id, status: eva.status });

        res.status(201).json({
            message: 'Submission processed',
            submissionId: newSubmission.id,
            status: eva.status,
            results,
            suggestion: eva.suggestion,
            detailedStatus: eva.detailedStatus
        });
    } catch (error: any) {
        logger.error("Error processing submission", { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'An error occurred while processing your submission. Please try again later.' });
    }
});

export default router;