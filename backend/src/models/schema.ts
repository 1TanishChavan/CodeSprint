import { pgTable, serial, text, timestamp, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    role: text('role').notNull().default('solver'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const problems = pgTable('problems', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    difficulty: text('difficulty'),
    creatorId: integer('creator_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const testCases = pgTable('test_cases', {
    id: serial('id').primaryKey(),
    problemId: integer('problem_id').references(() => problems.id),
    input: text('input').notNull(),
    output: text('output').notNull(),
    isPublic: boolean('is_public').notNull().default(false),
});

export const submissions = pgTable('submissions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    problemId: integer('problem_id').references(() => problems.id),
    code: text('code').notNull(),
    language: text('language').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});