import { db } from '$lib/server/db';
import { record } from '$lib/server/db/schema';
import { eq, and, sql, desc, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type {
	RecordValues,
	RecordWithValues,
	RecordFilter,
	RecordSort
} from '$lib/types/record.type';

export class RecordService {

	static async createRecord(tableId: string, values: RecordValues = {}) {
		const recordId = nanoid();
		const now = new Date();

		await db.insert(record).values({
			id: recordId,
			tableId,
			values: JSON.stringify(values),
			createdAt: now,
			updatedAt: now
		});

		return recordId;
	}

	static async updateRecord(recordId: string, values: RecordValues) {
		await db
			.update(record)
			.set({
				values: JSON.stringify(values),
				updatedAt: new Date()
			})
			.where(eq(record.id, recordId));
	}

	static async getRecord(recordId: string): Promise<RecordWithValues | null> {
		const records = await db
			.select()
			.from(record)
			.where(eq(record.id, recordId))
			.limit(1);

		if (!records[0]) return null;

		return {
			...records[0],
			values: typeof records[0].values === 'string'
				? JSON.parse(records[0].values)
				: (records[0].values as RecordValues || {})
		};
	}

	static async getRecord(recordId: string): Promise<RecordWithValues | null> {
		const records = await db
			.select()
			.from(record)
			.where(eq(record.id, recordId))
			.limit(1);

		if (!records[0]) return null;

		return {
			...records[0],
			values: typeof records[0].values === 'string'
				? JSON.parse(records[0].values)
				: (records[0].values as RecordValues || {})
		};
	}

	static async getTableRecords(tableId: string): Promise<RecordWithValues[]> {
		const records = await db
			.select()
			.from(record)
			.where(eq(record.tableId, tableId))
			.orderBy(desc(record.createdAt));

		return records.map(rec => ({
			...rec,
			values: typeof rec.values === 'string'
				? JSON.parse(rec.values)
				: (rec.values as RecordValues || {})
		}));
	}

	static async filterRecords(tableId: string, filters: RecordFilter[]) {
		let query = db
			.select()
			.from(record)
			.where(eq(record.tableId, tableId));

		for (const filter of filters) {
			const { columnId, operator, value } = filter;

			switch (operator) {
				case 'equals':
					query = query.where(
						sql`json_extract(${record.values}, ${`$.${columnId}`}) = ${value}`
					);
					break;
				case 'contains':
					query = query.where(
						sql`json_extract(${record.values}, ${`$.${columnId}`}) LIKE ${`%${value}%`}`
					);
					break;
				case 'startsWith':
					query = query.where(
						sql`json_extract(${record.values}, ${`$.${columnId}`}) LIKE ${`${value}%`}`
					);
					break;
				case 'greaterThan':
					query = query.where(
						sql`CAST(json_extract(${record.values}, ${`$.${columnId}`}) AS REAL) > ${value}`
					);
					break;
				case 'lessThan':
					query = query.where(
						sql`CAST(json_extract(${record.values}, ${`$.${columnId}`}) AS REAL) < ${value}`
					);
					break;
				case 'isEmpty':
					query = query.where(
						sql`json_extract(${record.values}, ${`$.${columnId}`}) IS NULL OR json_extract(${record.values}, ${`$.${columnId}`}) = ''`
					);
					break;
				case 'isNotEmpty':
					query = query.where(
						sql`json_extract(${record.values}, ${`$.${columnId}`}) IS NOT NULL AND json_extract(${record.values}, ${`$.${columnId}`}) != ''`
					);
					break;
			}
		}

		const results = await query.orderBy(desc(record.createdAt));

		return results.map(rec => ({
			...rec,
			values: typeof rec.values === 'string'
				? JSON.parse(rec.values)
				: (rec.values as RecordValues || {})
		}));
	}

	static async sortRecords(tableId: string, sorts: RecordSort[]) {
		let query = db
			.select()
			.from(record)
			.where(eq(record.tableId, tableId));

		const orderClauses = sorts.map(sort => {
			const direction = sort.direction === 'asc' ? asc : desc;
			return direction(sql`json_extract(${record.values}, ${`$.${sort.columnId}`})`);
		});

		if (orderClauses.length > 0) {
			query = query.orderBy(...orderClauses);
		}

		const results = await query;

		return results.map(rec => ({
			...rec,
			values: typeof rec.values === 'string'
				? JSON.parse(rec.values)
				: (rec.values as RecordValues || {})
		}));
	}

	static async searchInTable(tableId: string, searchTerm: string) {
		const results = await db
			.select()
			.from(record)
			.where(
				and(
					eq(record.tableId, tableId),
					sql`${record.values} LIKE ${`%${searchTerm}%`}`
				)
			)
			.orderBy(desc(record.createdAt));

		return results.map(rec => ({
			...rec,
			values: typeof rec.values === 'string'
				? JSON.parse(rec.values)
				: (rec.values as RecordValues || {})
		}));
	}

	static async deleteRecord(recordId: string) {
		await db
			.delete(record)
			.where(eq(record.id, recordId));
	}

	static async getTableStats(tableId: string) {
		const totalRecords = await db
			.select({ count: sql`count(*)` })
			.from(record)
			.where(eq(record.tableId, tableId));

		const recentRecords = await db
			.select({ count: sql`count(*)` })
			.from(record)
			.where(
				and(
					eq(record.tableId, tableId),
					sql`${record.createdAt} > NOW() - INTERVAL '7 days'`
				)
			);

		return {
			total: Number(totalRecords[0].count),
			thisWeek: Number(recentRecords[0].count)
		};
	}
}