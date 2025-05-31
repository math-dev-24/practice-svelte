import type { ColumnType, ColumnConfig } from '$lib/types/record.type';

export class ValidationService {

	static validateValue(columnType: ColumnType, value: any, config: ColumnConfig = {}): any {
		switch (columnType) {
			case 'number':
				const num = parseFloat(value);
				if (isNaN(num)) throw new Error('Valeur numérique invalide');
				return num;

			case 'checkbox':
				return Boolean(value);

			case 'date':
				if (!value) return null;
				const date = new Date(value);
				if (isNaN(date.getTime())) throw new Error('Date invalide');
				return date.toISOString();

			case 'select':
				if (config.options && !config.options.includes(value)) {
					throw new Error(`Valeur non autorisée. Options disponibles: ${config.options.join(', ')}`);
				}
				return value;

			case 'multiselect':
				const values = Array.isArray(value) ? value : [value];
				if (config.options) {
					const invalidValues = values.filter(v => !config.options!.includes(v));
					if (invalidValues.length > 0) {
						throw new Error(`Valeurs non autorisées: ${invalidValues.join(', ')}`);
					}
				}
				return values;

			case 'email':
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (value && !emailRegex.test(value)) {
					throw new Error('Email invalide');
				}
				return value;

			case 'url':
				if (value) {
					try {
						new URL(value);
					} catch {
						throw new Error('URL invalide');
					}
				}
				return value;

			case 'rating':
				const rating = parseInt(value);
				const maxRating = config.maxRating || 100;
				const minRating = config.minRating || 0;

				if (rating < minRating || rating > maxRating) {
					throw new Error(`Note doit être entre ${minRating} et ${maxRating}`);
				}
				return rating;

			default:
				return value;
		}
	}

	static getDefaultValue(columnType: ColumnType, config: ColumnConfig = {}): any {
		if (config.defaultValue !== undefined) {
			return config.defaultValue;
		}

		switch (columnType) {
			case 'text':
			case 'email':
			case 'url':
			case 'phone':
				return '';
			case 'number':
			case 'rating':
				return 0;
			case 'checkbox':
				return false;
			case 'date':
				return null;
			case 'select':
				return config.options?.[0] || '';
			case 'multiselect':
				return [];
			case 'relation':
				return '';
			default:
				return '';
		}
	}

	static validateColumnConfig(columnType: ColumnType, config: ColumnConfig): string[] {
		const errors: string[] = [];

		switch (columnType) {
			case 'select':
			case 'multiselect':
				if (!config.options || config.options.length === 0) {
					errors.push('Les options sont requises pour les colonnes select/multiselect');
				}
				break;

			case 'rating':
				if (config.maxRating && config.minRating && (config.maxRating < 1 || config.maxRating > 10)) {
					errors.push('La note maximale doit être entre 1 et 10');
				}
				break;
		}

		return errors;
	}
}