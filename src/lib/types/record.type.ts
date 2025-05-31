export type ColumnType =
	| 'text'
	| 'number'
	| 'date'
	| 'select'
	| 'multiselect'
	| 'checkbox'
	| 'url'
	| 'email'
	| 'phone'
	| 'rating'
	| 'priority'
	| 'status';

export interface ColumnConfig {
	// Pour select/multiselect
	options?: string[];
	// Pour number
	format?: 'integer' | 'decimal' | 'currency' | 'percentage';
	// Pour date
	includeTime?: boolean;
	// Pour rating
	maxRating?: number;
	// Couleurs pour les options
	optionColors?: Record<string, string>;
	// Valeur par défaut
	defaultValue?: any;
}

export type RecordValues = Record<string, any>; // columnId -> value

// Types pour l'usage dans le code
export interface ColumnWithConfig {
	id: string;
	tableId: string;
	name: string;
	type: ColumnType;
	order: number;
	isRequired: boolean | null;
	config: ColumnConfig | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface RecordWithValues {
	id: string;
	tableId: string;
	createdAt: Date;
	updatedAt: Date;
	values: RecordValues;
}

// Types pour les filtres
export interface RecordFilter {
	columnId: string;
	operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
	value: any;
}

export interface RecordSort {
	columnId: string;
	direction: 'asc' | 'desc';
}