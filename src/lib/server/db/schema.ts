import { pgTable, serial, text, timestamp, boolean, json, integer } from 'drizzle-orm/pg-core';

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

export const table = pgTable('table', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const column = pgTable('column', {
	id: text('id').primaryKey(),
	tableId: text('table_id')
		.notNull()
		.references(() => table.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	type: text('type').notNull(),
	order: integer('order').notNull().default(0),
	isRequired: boolean('is_required').default(false),
	config: json('config'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const record = pgTable('record', {
	id: text('id').primaryKey(),
	tableId: text('table_id')
		.notNull()
		.references(() => table.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	values: json('values')
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Table = typeof table.$inferSelect;
export type Column = typeof column.$inferSelect;
export type Record = typeof record.$inferSelect;