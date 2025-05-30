import type { LayoutServerLoad } from './$types';

import { count, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { todo } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.user) {
		// Récupérer le nombre de todos de l'utilisateur
		const userTodosCount = await db.select({ count: count() })
			.from(todo)
			.where(eq(todo.userId, locals.user.id));

		return {
			user: locals.user,
			todoCount: userTodosCount[0].count as number
		};
	}
	
	return {
		user: null,
		todoCount: 0
	};
};