import type { PageServerLoad, Actions } from './$types';
import { TableService } from '$lib/services';
import { ValidationService } from '$lib/services';
import { fail, redirect, error } from '@sveltejs/kit';
import type { ColumnType, ColumnConfig } from '$lib/types/record.type';

export const load: PageServerLoad = async ({ params, locals }) => {
	const userId = locals.user?.id;
	const tableId = params.tableId;

	if (!userId) {
		throw redirect(302, '/login');
	}

	try {
		const { table, columns } = await TableService.getTableWithColumns(tableId);

		if (table.userId !== userId) {
			throw error(403, 'Accès non autorisé');
		}

		return {
			table: {
				id: table.id,
				name: table.name,
				description: table.description
			},
			columns: columns.map(col => ({
				id: col.id,
				name: col.name,
				type: col.type,
				order: col.order,
				isRequired: col.isRequired,
				config: col.config,
				createdAt: col.createdAt.toISOString()
			}))
		};
	} catch (err) {
		console.error('Erreur lors du chargement des colonnes:', err);
		throw error(404, 'Table non trouvée');
	}
};

export const actions: Actions = {
	addColumn: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		const tableId = params.tableId;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const name = data.get('name') as string;
			const type = data.get('type') as ColumnType;

			let config: ColumnConfig = {};

			if (type === 'select' || type === 'multiselect') {
				const optionsString = data.get('options') as string;
				config.options = optionsString.split('\n').map(opt => opt.trim()).filter(Boolean);
			}

			if (type === 'rating') {
				const maxRating = data.get('maxRating');
				config.maxRating = maxRating ? parseInt(maxRating as string) : 5;
			}

			if (type === 'number') {
				const format = data.get('numberFormat') as string;
				if (format) config.format = format as any;
			}

			if (!name || name.trim().length === 0) {
				return fail(400, { error: 'Le nom de la colonne est requis' });
			}

			const configErrors = ValidationService.validateColumnConfig(type, config);
			if (configErrors.length > 0) {
				return fail(400, { error: configErrors.join(', ') });
			}

			const columnId = await TableService.addColumn(
				tableId,
				name.trim(),
				type,
				undefined,
				config
			);

			return {
				success: true,
				columnId
			};
		} catch (error) {
			console.error('Erreur lors de l\'ajout de colonne:', error);
			return fail(500, { error: 'Erreur lors de l\'ajout de la colonne' });
		}
	},

	// Modifier une colonne
	updateColumn: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const columnId = data.get('columnId') as string;
			const name = data.get('name') as string;
			const type = data.get('type') as ColumnType;

			let config: ColumnConfig = {};

			if (type === 'select' || type === 'multiselect') {
				const optionsString = data.get('options') as string;
				config.options = optionsString.split('\n').map(opt => opt.trim()).filter(Boolean);
			}

			if (type === 'rating') {
				const maxRating = data.get('maxRating');
				config.maxRating = maxRating ? parseInt(maxRating as string) : 5;
			}

			if (type === 'number') {
				const format = data.get('numberFormat') as string;
				if (format) config.format = format as any;
			}

			if (!name || name.trim().length === 0) {
				return fail(400, { error: 'Le nom de la colonne est requis' });
			}

			const configErrors = ValidationService.validateColumnConfig(type, config);
			if (configErrors.length > 0) {
				return fail(400, { error: configErrors.join(', ') });
			}

			await TableService.updateColumn(columnId, {
				name: name.trim(),
				type,
				config
			});

			return {
				success: true,
				updated: columnId
			};
		} catch (error) {
			console.error('Erreur lors de la modification:', error);
			return fail(500, { error: 'Erreur lors de la modification de la colonne' });
		}
	},

	// Supprimer une colonne
	deleteColumn: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const columnId = data.get('columnId') as string;

			if (!columnId) {
				return fail(400, { error: 'ID de colonne requis' });
			}

			await TableService.deleteColumn(columnId);

			return {
				success: true,
				deleted: columnId
			};
		} catch (error) {
			console.error('Erreur lors de la suppression:', error);
			return fail(500, { error: 'Erreur lors de la suppression de la colonne' });
		}
	},

	// Réorganiser les colonnes
	reorderColumns: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const ordersString = data.get('orders') as string;
			const orders = JSON.parse(ordersString);

			// Mettre à jour l'ordre de chaque colonne
			for (const { columnId, order } of orders) {
				await TableService.updateColumn(columnId, { order });
			}

			return {
				success: true,
				reordered: true
			};
		} catch (error) {
			console.error('Erreur lors de la réorganisation:', error);
			return fail(500, { error: 'Erreur lors de la réorganisation des colonnes' });
		}
	}
};