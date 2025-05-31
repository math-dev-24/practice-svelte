<script lang="ts">
	import { type ColumnType, columnTypes, type ColumnWithConfig } from '$lib/types';

	export let column: ColumnWithConfig;
	export let onEdit: (column: ColumnWithConfig) => void;
	export let onDelete: (columnId: string) => void;

	function getColumnTypeLabel(type: ColumnType): string {
		return columnTypes.find(t => t.value === type)?.label || type;
	}

	function formatConfig(config: any): string {
		if (!config) return '';

		const parts: string[] = [];
		if (config.options && Array.isArray(config.options)) {
			parts.push(`Options: ${config.options.length}`);
		}
		if (config.minRating !== undefined) {
			parts.push(`Min: ${config.minRating}`);
		}
		if (config.maxRating !== undefined) {
			parts.push(`Max: ${config.maxRating}`);
		}
		if (config.format) {
			parts.push(`Format: ${config.format}`);
		}

		return parts.join(', ');
	}

	function handleEdit() {
		onEdit(column);
	}

	function handleDelete() {
		onDelete(column.id);
	}
</script>

<li class="px-6 py-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center flex-1">
			<div class="flex-1">
				<div class="flex items-center">
					<h3 class="text-lg font-medium text-gray-900">{column.name}</h3>
					{#if column.isRequired}
						<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
							Requis
						</span>
					{/if}
				</div>

				<div class="mt-1 flex items-center text-sm text-gray-500">
					<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						{getColumnTypeLabel(column.type)}
					</span>
					{#if formatConfig(column.config)}
						<span class="ml-2">{formatConfig(column.config)}</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2 ml-4">
			<button
				type="button"
				on:click={handleEdit}
				class="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
				title="Modifier"
				aria-label="Modifier la colonne {column.name}"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
				</svg>
			</button>
			<button
				type="button"
				on:click={handleDelete}
				class="text-gray-400 hover:text-red-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
				title="Supprimer"
				aria-label="Supprimer la colonne {column.name}"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
				</svg>
			</button>
		</div>
	</div>
</li>