import type { PageServerLoad, Actions } from './$types';
import { TableService, RecordService, ValidationService } from '$lib/services';
import { fail, redirect, error } from '@sveltejs/kit';
import type { RecordValues, RecordFilter, RecordSort } from '$lib/types';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const userId = locals.user?.id;
	const tableId = params.tableId;

	if (!userId) {
		throw redirect(302, '/login');
	}

	if (!tableId) {
		throw redirect(302, '/tables');
	}

	try {

		const { table, columns } = await TableService.getTableWithColumns(tableId);

		if (table.userId !== userId) {
			throw error(403, 'Accès non autorisé');
		}

		const searchParams = url.searchParams;
		const search = searchParams.get('search') || '';
		const filterParam = searchParams.get('filters');
		const sortParam = searchParams.get('sorts');

		let records;

		if (search) {
			records = await RecordService.searchInTable(tableId, search);
		}

		else if (filterParam) {
			try {
				const filters: RecordFilter[] = JSON.parse(filterParam);
				records = await RecordService.filterRecords(tableId, filters);
			} catch {
				records = await RecordService.getTableRecords(tableId);
			}
		}

		else if (sortParam) {
			try {
				const sorts: RecordSort[] = JSON.parse(sortParam);
				records = await RecordService.sortRecords(tableId, sorts);
			} catch {
				records = await RecordService.getTableRecords(tableId);
			}
		}
		else {
			records = await RecordService.getTableRecords(tableId);
		}

		const stats = await RecordService.getTableStats(tableId);

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
				config: col.config
			})),
			records: records.map(record => ({
				id: record.id,
				values: record.values,
				createdAt: record.createdAt.toISOString(),
				updatedAt: record.updatedAt.toISOString()
			})),
			stats,
			currentSearch: search,
			currentFilters: filterParam,
			currentSorts: sortParam
		};
	} catch (err) {
		console.error('Erreur lors du chargement des données:', err);
		throw error(404, 'Table non trouvée');
	}
};
