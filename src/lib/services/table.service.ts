import { db } from '$lib/server/db';
import { table, column } from '$lib/server/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type {
	ColumnType,
	ColumnConfig,
	ColumnWithConfig
} from '$lib/types/record.type';

export class TableService {

	static async createTable(
		userId: string,
		name: string,
		description?: string,
		defaultColumns?: Array<{ name: string; type: ColumnType; config?: ColumnConfig }>
	) {
		const tableId = nanoid();
		const now = new Date();

		// Créer la tables
		await db.insert(table).values({
			id: tableId,
			name,
			description,
			userId,
			createdAt: now,
			updatedAt: now
		});

		// Ajouter les colonnes par défaut
		const columnsToCreate = defaultColumns || [
			{ name: 'Nom', type: 'text' as ColumnType },
		];

		for (let i = 0; i < columnsToCreate.length; i++) {
			await this.addColumn(tableId, columnsToCreate[i].name, columnsToCreate[i].type, i, columnsToCreate[i].config);
		}

		return tableId;
	}

	static async addColumn(
		tableId: string,
		name: string,
		type: ColumnType,
		order?: number,
		config: ColumnConfig = {}
	) {
		const columnId = nanoid();
		const now = new Date();

		if (order === undefined) {
			const existingColumns = await db
				.select({ order: column.order })
				.from(column)
				.where(eq(column.tableId, tableId))
				.orderBy(desc(column.order))
				.limit(1);

			order = existingColumns[0]?.order ? existingColumns[0].order + 1 : 0;
		}

		await db.insert(column).values({
			id: columnId,
			tableId,
			name,
			type,
			order,
			config: JSON.stringify(config),
			createdAt: now,
			updatedAt: now
		});

		return columnId;
	}

	static async getTableWithColumns(tableId: string) {
		const tableData = await db
			.select()
			.from(table)
			.where(eq(table.id, tableId))
			.limit(1);

		if (!tableData[0]) {
			throw new Error('Table non trouvée');
		}

		const columns = await db
			.select()
			.from(column)
			.where(eq(column.tableId, tableId))
			.orderBy(asc(column.order));

		const typedColumns: ColumnWithConfig[] = columns.map((col: any) => ({
			...col,
			type: col.type as ColumnType,
			config: typeof col.config === 'string' ? JSON.parse(col.config) : (col.config as ColumnConfig || {})
		}));

		return {
			table: tableData[0],
			columns: typedColumns
		};
	}

	static async getUserTables(userId: string) {
		return db
			.select()
			.from(table)
			.where(eq(table.userId, userId))
			.orderBy(desc(table.updatedAt));
	}

	static async updateTable(tableId: string, updates: { name?: string; description?: string }) {
		await db
			.update(table)
			.set({
				...updates,
				updatedAt: new Date()
			})
			.where(eq(table.id, tableId));
	}

	static async deleteTable(tableId: string) {
		await db
			.delete(table)
			.where(eq(table.id, tableId));
	}

	static async updateColumn(columnId: string, updates: { name?: string; type?: ColumnType; config?: ColumnConfig; order?: number }) {
		const updateData: any = {
			...updates,
			updatedAt: new Date()
		};

		if (updates.config) {
			updateData.config = JSON.stringify(updates.config);
		}

		await db
			.update(column)
			.set(updateData)
			.where(eq(column.id, columnId));
	}

	static async deleteColumn(columnId: string) {
		await db
			.delete(column)
			.where(eq(column.id, columnId));
	}
}