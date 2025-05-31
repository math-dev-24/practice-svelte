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
	| 'status'
	| 'relation';

export const columnTypes: { value: ColumnType; label: string; description: string }[] = [
	{ value: 'text', label: 'Texte', description: 'Texte simple' },
	{ value: 'number', label: 'Nombre', description: 'Valeurs numériques' },
	{ value: 'date', label: 'Date', description: 'Dates' },
	{ value: 'checkbox', label: 'Case à cocher', description: 'Vrai/Faux' },
	{ value: 'select', label: 'Sélection unique', description: 'Une option parmi plusieurs' },
	{ value: 'multiselect', label: 'Sélection multiple', description: 'Plusieurs options' },
	{ value: 'email', label: 'Email', description: 'Adresses email' },
	{ value: 'url', label: 'URL', description: 'Liens web' },
	{ value: 'phone', label: 'Téléphone', description: 'Numéros de téléphone' },
	{ value: 'rating', label: 'Note', description: 'Évaluation avec étoiles' },
	{ value: 'priority', label: 'Priorité', description: 'Haute/Moyenne/Basse' },
	{ value: 'status', label: 'Statut', description: 'État du projet' },
	{ value: 'relation', label: 'Relation', description: 'Lien vers une autre table' },
];

export interface ColumnConfig {
	// Pour select/multiselect
	options?: string[];
	// Pour number
	format?: 'integer' | 'decimal' | 'currency' | 'percentage';
	// Pour date
	includeTime?: boolean;
	// Pour rating
	minRating?: number;
	maxRating?: number;
	// Couleurs pour les options
	optionColors?: Record<string, string>;
	// Valeur par défaut
	defaultValue?: ValueType;
}

export type ValueType = string | number | boolean | Date | null;

export type RecordValues = Record<string, ValueType>;

// Interface principale pour les colonnes
export interface Column {
	id: string;
	tableId: string;
	name: string;
	type: ColumnType;
	order: number;
	isRequired?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Interface pour les colonnes avec configuration
export interface ColumnWithConfig extends Column {
	config: ColumnConfig | null;
}

// Interface pour les enregistrements avec leurs valeurs
export interface RecordWithValues {
	id: string;
	tableId: string;
	createdAt: Date;
	updatedAt: Date;
	values: RecordValues;
}

// Interface pour les filtres d'enregistrements
export interface RecordFilter {
	columnId: string;
	operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
	value: ValueType;
}

// Interface pour le tri des enregistrements
export interface RecordSort {
	columnId: string;
	direction: 'asc' | 'desc';
}

// Interface pour les tables
export interface Table {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
}

// Types pour les données de page
export interface PageData {
	table: Table;
	columns: ColumnWithConfig[];
}

// Types pour les données d'action
export interface ActionData {
	success?: boolean;
	error?: string;
	data?: any;
}