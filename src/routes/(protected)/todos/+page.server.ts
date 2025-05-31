import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { todo } from '$lib/server/db/schema';

export const actions: Actions = {
	createTodo: async (event) => {
		const formData = await event.request.formData();

		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized', type: 'error' });
		}

		if (!title || title.trim() === '') {
			return fail(400, { message: 'Title is required', type: 'error' });
		}
		if (!description || description.trim() === '') {
			return fail(400, { message: 'Description is required', type: 'error' });
		}

		try {
			await db.insert(table.todo).values({
				id: nanoid(),
				title: title.trim(),
				description: description.trim(),
				completed: false,
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: event.locals.user.id
			});
		} catch (e) {
			console.error('Database error:', e);
			return fail(500, { message: 'An error has occurred: ' + (e as Error).message, type: 'error' });
		}

		return redirect(302, '/todos', { message: 'La tâche a bien été créée', type: 'success' });
	},
	toggleTodo: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { message: 'Id is required', type: 'error' });
		try {

			await db.update(table.todo)
				.set({ completed: sql`NOT ${table.todo.completed}` })
				.where(eq(table.todo.id, id));

		} catch (e) {
			console.error('Database error:', e);
			return fail(500, { message: 'An error has occurred: ' + (e as Error).message, type: 'error' });
		}

		return redirect(302, '/todos', { message: 'La tâche a bien été modifiée', type: 'success' });
	},
	deleteTodo: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { message: 'Id is required' });
		try {
			await db.delete(table.todo).where(eq(table.todo.id, id));
		} catch (e) {
			console.error('Database error:', e);
			return fail(500, { message: 'An error has occurred: ' + (e as Error).message, type: 'error' });
		}
		return redirect(302, '/todos', { message: 'La tâche a bien été supprimée', type: 'success' });
	}
}

export const load: PageServerLoad = async (event) => {

	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	try {
		const todos = await db.select().from(table.todo).where(eq(todo.userId, event.locals.user.id))
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