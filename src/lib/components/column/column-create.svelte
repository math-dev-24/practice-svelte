<script lang="ts">
	import { enhance } from '$app/forms';
	import { type ColumnType, columnTypes } from '$lib/types';

	export let closeModals: () => void;

	// États du formulaire
	let selectedType: ColumnType = 'text';
	let name = '';
	let optionsText = '';
	let maxRating = 5;
	let numberFormat = '';

	// Réinitialiser le formulaire
	function resetForm() {
		selectedType = 'text';
		name = '';
		optionsText = '';
		maxRating = 5;
		numberFormat = '';
	}

	// Fonction pour gérer la soumission du formulaire
	function handleSubmit(event: Event) {
		if ((selectedType === 'select' || selectedType === 'multiselect') && !optionsText.trim()) {
			event.preventDefault();
			alert('Veuillez saisir au moins une option.');
			return;
		}
	}
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
	<div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
		<h2 class="text-lg font-semibold mb-4">Ajouter une colonne</h2>

		<form method="POST" action="?/addColumn" use:enhance on:submit={handleSubmit}>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
						Nom de la colonne *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						bind:value={name}
						placeholder="Nom de la colonne"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label for="type" class="block text-sm font-medium text-gray-700 mb-2">
						Type de colonne *
					</label>
					<select
						id="type"
						name="type"
						bind:value={selectedType}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{#each columnTypes as type (type.value)}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Options spécifiques selon le type -->
			{#if selectedType === 'select' || selectedType === 'multiselect'}
				<div class="mb-4">
					<label for="options" class="block text-sm font-medium text-gray-700 mb-2">
						Options (une par ligne) *
					</label>
					<textarea
						id="options"
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

			{#if selectedType === 'rating'}
				<div class="mb-4">
					<label for="maxRating" class="block text-sm font-medium text-gray-700 mb-2">
						Note maximale
					</label>
					<input
						type="number"
						id="maxRating"
						name="maxRating"
						min="1"
						max="10"
						bind:value={maxRating}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
					<p class="text-xs text-gray-500 mt-1">Entre 1 et 10</p>
				</div>
			{/if}

			{#if selectedType === 'number'}
				<div class="mb-4">
					<label for="numberFormat" class="block text-sm font-medium text-gray-700 mb-2">
						Format
					</label>
					<select
						id="numberFormat"
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
					on:click={() => {
						resetForm();
						closeModals();
					}}
					class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
				>
					Annuler
				</button>
				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
				>
					Ajouter
				</button>
			</div>
		</form>
	</div>
</div>