import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: serial('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull()
});

export const todo = pgTable('todo', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	completed: boolean('completed').notNull().default(false),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Todo = typeof todo.$inferSelect;