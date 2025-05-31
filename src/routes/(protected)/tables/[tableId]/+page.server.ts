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

export const actions: Actions = {
	// Créer un nouveau record
	createRecord: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		const tableId = params.tableId;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			// Récupérer les colonnes pour validation
			const { columns } = await TableService.getTableWithColumns(tableId);

			const data = await request.formData();
			const values: RecordValues = {};

			// Construire les valeurs et valider
			for (const column of columns) {
				const rawValue = data.get(column.id);

				// Vérifier les champs requis
				if (column.isRequired && (!rawValue || rawValue === '')) {
					return fail(400, {
						error: `Le champ "${column.name}" est requis`,
						fieldError: column.id
					});
				}

				// Valider et convertir la valeur si elle existe
				if (rawValue !== null && rawValue !== '') {
					try {
						values[column.id] = ValidationService.validateValue(
							column.type,
							rawValue,
							column.config || {}
						);
					} catch (validationError) {
						return fail(400, {
							error: `Erreur dans "${column.name}": ${validationError.message}`,
							fieldError: column.id
						});
					}
				} else if (!column.isRequired) {
					// Valeur par défaut pour les champs non requis
					values[column.id] = ValidationService.getDefaultValue(column.type, column.config || {});
				}
			}

			const recordId = await RecordService.createRecord(tableId, values);

			return {
				success: true,
				recordId,
				message: 'Enregistrement créé avec succès'
			};
		} catch (error) {
			console.error('Erreur lors de la création:', error);
			return fail(500, { error: 'Erreur lors de la création de l\'enregistrement' });
		}
	},

	// Modifier un record existant
	updateRecord: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const recordId = data.get('recordId') as string;
			const tableId = data.get('tableId') as string;

			if (!recordId) {
				return fail(400, { error: 'ID d\'enregistrement requis' });
			}

			// Récupérer les colonnes pour validation
			const { columns } = await TableService.getTableWithColumns(tableId);

			const values: RecordValues = {};

			// Construire les valeurs et valider
			for (const column of columns) {
				const rawValue = data.get(column.id);

				// Vérifier les champs requis
				if (column.isRequired && (!rawValue || rawValue === '')) {
					return fail(400, {
						error: `Le champ "${column.name}" est requis`,
						fieldError: column.id
					});
				}

				// Valider et convertir la valeur si elle existe
				if (rawValue !== null && rawValue !== '') {
					try {
						values[column.id] = ValidationService.validateValue(
							column.type,
							rawValue,
							column.config || {}
						);
					} catch (validationError) {
						return fail(400, {
							error: `Erreur dans "${column.name}": ${validationError.message}`,
							fieldError: column.id
						});
					}
				} else if (!column.isRequired) {
					values[column.id] = ValidationService.getDefaultValue(column.type, column.config || {});
				}
			}

			await RecordService.updateRecord(recordId, values);

			return {
				success: true,
				updated: recordId,
				message: 'Enregistrement modifié avec succès'
			};
		} catch (error) {
			console.error('Erreur lors de la modification:', error);
			return fail(500, { error: 'Erreur lors de la modification de l\'enregistrement' });
		}
	},

	// Supprimer un record
	deleteRecord: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const recordId = data.get('recordId') as string;

			if (!recordId) {
				return fail(400, { error: 'ID d\'enregistrement requis' });
			}

			await RecordService.deleteRecord(recordId);

			return {
				success: true,
				deleted: recordId,
				message: 'Enregistrement supprimé avec succès'
			};
		} catch (error) {
			console.error('Erreur lors de la suppression:', error);
			return fail(500, { error: 'Erreur lors de la suppression de l\'enregistrement' });
		}
	},

	// Supprimer plusieurs records
	deleteMultiple: async ({ request, locals }) => {
		const userId = locals.user?.id;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const recordIdsString = data.get('recordIds') as string;

			if (!recordIdsString) {
				return fail(400, { error: 'IDs d\'enregistrements requis' });
			}

			const recordIds = JSON.parse(recordIdsString);

			// Supprimer tous les records sélectionnés
			for (const recordId of recordIds) {
				await RecordService.deleteRecord(recordId);
			}

			return {
				success: true,
				deletedMultiple: recordIds.length,
				message: `${recordIds.length} enregistrement(s) supprimé(s) avec succès`
			};
		} catch (error) {
			console.error('Erreur lors de la suppression multiple:', error);
			return fail(500, { error: 'Erreur lors de la suppression des enregistrements' });
		}
	},

	// Dupliquer un record
	duplicateRecord: async ({ request, params, locals }) => {
		const userId = locals.user?.id;
		const tableId = params.tableId;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const data = await request.formData();
			const recordId = data.get('recordId') as string;

			if (!recordId) {
				return fail(400, { error: 'ID d\'enregistrement requis' });
			}

			// Récupérer le record original
			const originalRecord = await RecordService.getRecord(recordId);
			if (!originalRecord) {
				return fail(404, { error: 'Enregistrement non trouvé' });
			}

			// Créer un nouveau record avec les mêmes valeurs
			const newRecordId = await RecordService.createRecord(tableId, originalRecord.values);

			return {
				success: true,
				duplicated: newRecordId,
				message: 'Enregistrement dupliqué avec succès'
			};
		} catch (error) {
			console.error('Erreur lors de la duplication:', error);
			return fail(500, { error: 'Erreur lors de la duplication de l\'enregistrement' });
		}
	},

	// Exporter les données (CSV)
	exportData: async ({ params, locals }) => {
		const userId = locals.user?.id;
		const tableId = params.tableId;

		if (!userId) {
			return fail(401, { error: 'Non authentifié' });
		}

		try {
			const { table, columns } = await TableService.getTableWithColumns(tableId);
			const records = await RecordService.getTableRecords(tableId);

			// Générer le CSV
			const headers = columns.map(col => col.name).join(',');
			const rows = records.map(record => {
				return columns.map(col => {
					const value = record.values[col.id];
					// Échapper les guillemets et virgules
					const stringValue = value?.toString() || '';
					return `"${stringValue.replace(/"/g, '""')}"`;
				}).join(',');
			});

			const csvContent = [headers, ...rows].join('\n');

			return {
				success: true,
				exportData: csvContent,
				filename: `${table.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.csv`,
				message: 'Export généré avec succès'
			};
		} catch (error) {
			console.error('Erreur lors de l\'export:', error);
			return fail(500, { error: 'Erreur lors de l\'export des données' });
		}
	}
};