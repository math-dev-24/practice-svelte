<script lang="ts">
	import type { ColumnWithConfig } from '$lib/types';

	export let record: any;
	export let columns: any[];
	export let isSelected: boolean;
	export let onToggleSelect: () => void;
	export let onEdit: () => void;
	export let onDelete: () => void;

	function formatValue(value: any, column: ColumnWithConfig): string {
		if (value === null || value === undefined || value === '') {
			return '-';
		}

		switch (column.type) {
			case 'checkbox':
				return value ? '✅' : '❌';

			case 'date':
				try {
					return new Date(value).toLocaleDateString('fr-FR');
				} catch {
					return String(value);
				}

			case 'number':
				const num = Number(value);
				if (isNaN(num)) return String(value);

				switch (column.config?.format) {
					case 'currency':
						return new Intl.NumberFormat('fr-FR', {
							style: 'currency',
							currency: 'EUR'
						}).format(num);
					case 'percentage':
						return `${num}%`;
					case 'decimal':
						return num.toFixed(2);
					default:
						return String(num);
				}

			case 'multiselect':
				if (Array.isArray(value)) {
					return value.join(', ');
				}
				return String(value);

			case 'rating':
				const rating = Number(value) || 0;
				const minRating = column.config?.minRating || 0;
				const maxRating = column.config?.maxRating || 100;
				const number = rating / (maxRating - minRating);
				const stars = Math.round(number * 5);

				return '⭐'.repeat(stars) + '☆'.repeat(5 - stars) + ` (${rating}/${maxRating})`;

			case 'priority':
				switch (value) {
					case 'haute': return '🔴 Haute';
					case 'moyenne': return '🟡 Moyenne';
					case 'basse': return '🟢 Basse';
					default: return String(value);
				}

			case 'status':
				switch (value) {
					case 'en_attente': return '⏳ En attente';
					case 'en_cours': return '🔄 En cours';
					case 'termine': return '✅ Terminé';
					case 'annule': return '❌ Annulé';
					default: return String(value);
				}

			case 'email':
				return value;

			case 'url':
				return value;

			case 'phone':
				return value;

			default:
				// Limiter la longueur du texte affiché
				const text = String(value);
				return text.length > 50 ? text.substring(0, 50) + '...' : text;
		}
	}

	function getCellClass(column: ColumnWithConfig): string {
		let baseClass = 'px-6 py-4 whitespace-nowrap text-sm';

		switch (column.type) {
			case 'number':
			case 'rating':
				return baseClass + ' text-right text-gray-900';
			case 'checkbox':
				return baseClass + ' text-center';
			case 'priority':
			case 'status':
				return baseClass + ' text-gray-900 font-medium';
			default:
				return baseClass + ' text-gray-900';
		}
	}
</script>

<tr class={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
	<!-- Checkbox de sélection -->
	<td class="px-6 py-4 whitespace-nowrap">
		<input
			type="checkbox"
			checked={isSelected}
			on:change={onToggleSelect}
			class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
		/>
	</td>

	<!-- Colonnes des données -->
	{#each columns as column (column.id)}
		<td class={getCellClass(column)}>
			{#if column.type === 'email' && record.values[column.id]}
				<a
					href="mailto:{record.values[column.id]}"
					class="text-blue-600 hover:text-blue-800 underline"
				>
					{formatValue(record.values[column.id], column)}
				</a>
			{:else if column.type === 'url' && record.values[column.id]}
				<a
					href={record.values[column.id]}
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-600 hover:text-blue-800 underline"
				>
					{formatValue(record.values[column.id], column)}
				</a>
			{:else if column.type === 'phone' && record.values[column.id]}
				<a
					href="tel:{record.values[column.id]}"
					class="text-blue-600 hover:text-blue-800 underline"
				>
					{formatValue(record.values[column.id], column)}
				</a>
			{:else}
				<span title={String(record.values[column.id] || '')}>
					{formatValue(record.values[column.id], column)}
				</span>
			{/if}
		</td>
	{/each}

	<!-- Actions -->
	<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
		<div class="flex items-center justify-end gap-2">
			<button
				type="button"
				on:click={onEdit}
				class="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
				title="Modifier"
				aria-label="Modifier l'enregistrement"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
				</svg>
			</button>
			<button
				type="button"
				on:click={onDelete}
				class="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
				title="Supprimer"
				aria-label="Supprimer l'enregistrement"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
				</svg>
			</button>
		</div>
	</td>
</tr>