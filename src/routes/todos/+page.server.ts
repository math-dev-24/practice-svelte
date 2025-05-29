// +page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { eq, sql } from 'drizzle-orm';

export const actions: Actions = {
	createTodo: async (event) => {
		const formData = await event.request.formData();

		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		if (!title || title.trim() === '') {
			return fail(400, { message: 'Title is required' });
		}
		if (!description || description.trim() === '') {
			return fail(400, { message: 'Description is required' });
		}

		try {
			await db.insert(table.todo).values({
				id: nanoid(),
				title: title.trim(),
				description: description.trim(),
				completed: false,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} catch (e) {
			console.error('Database error:', e);
			return fail(500, { message: 'An error has occurred: ' + (e as Error).message });
		}

		return redirect(302, '/todos');
	},
	toggleTodo: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { message: 'Id is required' });
		try {

			await db.update(table.todo)
				.set({ completed: sql`NOT ${table.todo.completed}` })
				.where(eq(table.todo.id, id));

		} catch (e) {
			console.error('Database error:', e);
			return fail(500, { message: 'An error has occurred: ' + (e as Error).message });
		}

		return redirect(302, '/todos');
	},
	deleteTodo: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { message: 'Id is required' });
		try {
			await db.delete(table.todo).where(eq(table.todo.id, id));
		} catch (e) {
			console.error('Database error:', e);
			return fail(500, { message: 'An error has occurred: ' + (e as Error).message });
		}
		return redirect(302, '/todos');
	}
}

export const load: PageServerLoad = async () => {
	try {
		const todos = await db.select().from(table.todo).all();
		return {
			todos
		};
	} catch (e) {
		console.error('Load error:', e);
		return {
			todos: []
		};
	}
}