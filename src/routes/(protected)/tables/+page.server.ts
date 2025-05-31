import type { PageServerLoad, Actions } from './$types';
import { TableService } from '$lib/services';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		throw redirect(302, '/login');
	}

	try {
		const tables = await TableService.getUserTables(userId);

		return {
			tables: tables.map(table => ({
				id: table.id,
				name: table.name,
				description: table.description,
				createdAt: table.createdAt.toISOString(),
				updatedAt: table.updatedAt.toISOString()
			}))
		};
	} catch (error) {
		console.error('Erreur lors du chargement des tables:', error);
		return {
			tables: []
		};
	}
};

export const actions: Actions = {
	// Créer une nouvelle tables
	create: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const name = data.get('name') as string;
			const description = data.get('description') as string;

			if (!name || name.trim().length === 0) {
				return fail(400, { error: 'Le nom est requis' });
			}

			const tableId = await TableService.createTable(
				userId,
				name.trim(),
				description?.trim() || undefined
			);

			return {
				success: true,
				tableId
			};
		} catch (error) {
			console.error('Erreur lors de la création:', error);
			return fail(500, { error: 'Erreur lors de la création de la tables' });
		}
	},

	// Modifier une tables
	update: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const tableId = data.get('id') as string;
			const name = data.get('name') as string;
			const description = data.get('description') as string;

			if (!tableId || !name || name.trim().length === 0) {
				return fail(400, { error: 'ID et nom sont requis' });
			}

			await TableService.updateTable(tableId, {
				name: name.trim(),
				description: description?.trim() || undefined
			});

			return {
				success: true,
				updated: tableId
			};
		} catch (error) {
			console.error('Erreur lors de la modification:', error);
			return fail(500, { error: 'Erreur lors de la modification de la tables' });
		}
	},

	// Supprimer une tables
	delete: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const tableId = data.get('id') as string;

			if (!tableId) {
				return fail(400, { error: 'ID de tables requis' });
			}

			await TableService.deleteTable(tableId);

			return {
				success: true,
				deleted: tableId
			};
		} catch (error) {
			console.error('Erreur lors de la suppression:', error);
			return fail(500, { error: 'Erreur lors de la suppression de la tables' });
		}
	}
};