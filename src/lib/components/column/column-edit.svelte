<script lang="ts">
	import { enhance } from '$app/forms';
	import { type ColumnType, columnTypes, type ColumnWithConfig } from '$lib/types';

	export let closeModals: () => void;
	export let editingColumn: ColumnWithConfig;
	let editSelectedType: ColumnType = editingColumn.type;

	let optionsText = '';

	if (editingColumn.config?.options && Array.isArray(editingColumn.config.options)) {
		optionsText = editingColumn.config.options.join('\n');
	}

	let minRating = editingColumn.config?.minRating || 0;
	let maxRating = editingColumn.config?.maxRating || 100;
	let numberFormat = editingColumn.config?.format || '';

	// Fonction pour gérer la soumission du formulaire
	function handleSubmit(event: Event) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		// Ajouter les options formatées si nécessaire
		if (editSelectedType === 'select' || editSelectedType === 'multiselect') {
			formData.set('options', optionsText);
		}
	}
</script>

<div class="fixed inset-0 bg-gray-600/75 flex items-center justify-center p-4 z-50">
	<div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
		<h2 class="text-lg font-semibold mb-4">Modifier la colonne</h2>

		<form method="POST" action="?/updateColumn" use:enhance on:submit={handleSubmit}>
			<input type="hidden" name="columnId" value={editingColumn.id} />

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div>
					<label for="edit-name" class="block text-sm font-medium text-gray-700 mb-2">
						Nom de la colonne *
					</label>
					<input
						type="text"
						id="edit-name"
						name="name"
						required
						bind:value={editingColumn.name}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label for="edit-type" class="block text-sm font-medium text-gray-700 mb-2">
						Type de colonne *
					</label>
					<select
						id="edit-type"
						name="type"
						bind:value={editSelectedType}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{#each columnTypes as type (type.value)}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Options spécifiques selon le type -->
			{#if editSelectedType === 'select' || editSelectedType === 'multiselect'}
				<div class="mb-4">
					<label for="edit-options" class="block text-sm font-medium text-gray-700 mb-2">
						Options (une par ligne) *
					</label>
					<textarea
						id="edit-options"
						name="options"
						rows="4"
						required
						bind:value={optionsText}
						placeholder="Option 1&#10;Option 2&#10;Option 3"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					></textarea>
					<p class="text-xs text-gray-500 mt-1">Saisissez une option par ligne</p>
				</div>
			{/if}

			{#if editSelectedType === 'rating'}
				<div class="mb-4">
					<label for="edit-maxRating" class="block text-sm font-medium text-gray-700 mb-2">
						Note minimale
					</label>
					<input
						type="number"
						id="edit-minRating"
						name="minRating"
						max={minRating}
						bind:value={minRating}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div class="mb-4">
					<label for="edit-maxRating" class="block text-sm font-medium text-gray-700 mb-2">
						Note maximale
					</label>
					<input
						type="number"
						id="edit-maxRating"
						name="maxRating"
						min={minRating}
						bind:value={maxRating}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			{/if}

			{#if editSelectedType === 'number'}
				<div class="mb-4">
					<label for="edit-numberFormat" class="block text-sm font-medium text-gray-700 mb-2">
						Format
					</label>
					<select
						id="edit-numberFormat"
						name="numberFormat"
						bind:value={numberFormat}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Standard</option>
						<option value="integer">Entier</option>
						<option value="decimal">Décimal</option>
						<option value="currency">Monnaie</option>
						<option value="percentage">Pourcentage</option>
					</select>
				</div>
			{/if}

			<div class="flex justify-end gap-3">
				<button
					type="button"
					on:click={closeModals}
					class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
				>
					Annuler
				</button>
				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
				>
					Modifier
				</button>
			</div>
		</form>
	</div>
</div>