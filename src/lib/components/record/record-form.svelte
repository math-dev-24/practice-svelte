<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ColumnWithConfig, RecordValues } from '$lib/types';

	export let title: string;
	export let action: string;
	export let columns: any[];
	export let values: RecordValues;
	export let recordId: string | undefined = undefined;
	export let tableId: string | undefined = undefined;
	export let closeModal: () => void;

	// États du formulaire
	let formValues: Record<string, any> = {};

	// Initialiser les valeurs du formulaire
	$: {
		formValues = {};

		// S'assurer que toutes les colonnes ont une valeur
		columns.forEach(column => {
			if (values && column.id in values && values[column.id] !== undefined) {
				// Traitement spécial pour les dates
				if (column.type === 'date' && values[column.id]) {
					formValues[column.id] = formatDateForInput(values[column.id]);
				} else {
					formValues[column.id] = values[column.id];
				}
			} else {
				formValues[column.id] = getDefaultValue(column);
			}
		});
	}

	function getDefaultValue(column: ColumnWithConfig) {
		// Vérifier d'abord s'il y a une valeur par défaut dans la config
		if (column.config?.defaultValue !== undefined) {
			return column.config.defaultValue;
		}

		switch (column.type) {
			case 'checkbox':
				return false;
			case 'number':
			case 'rating':
				return '';
			case 'multiselect':
				return [];
			case 'date':
				return '';
			default:
				return '';
		}
	}

	function formatDateForInput(value: any): string {
		if (!value) return '';
		try {
			const date = new Date(value);
			return date.toISOString().split('T')[0];
		} catch {
			return '';
		}
	}

	function handleMultiselectChange(columnId: string, optionValue: string, checked: boolean) {
		if (!Array.isArray(formValues[columnId])) {
			formValues[columnId] = [];
		}

		if (checked) {
			formValues[columnId] = [...formValues[columnId], optionValue];
		} else {
			formValues[columnId] = formValues[columnId].filter((v: string) => v !== optionValue);
		}
	}
</script>

<div class="fixed inset-0 bg-gray-600/75 flex items-center justify-center p-4 z-50">
	<div class="bg-white rounded-lg max-w-4xl w-full p-6 max-h-screen overflow-y-auto">
		<h2 class="text-lg font-semibold mb-6">{title}</h2>

		<form method="POST" {action} use:enhance class="space-y-6">
			{#if recordId}
				<input type="hidden" name="recordId" value={recordId} />
			{/if}
			{#if tableId}
				<input type="hidden" name="tableId" value={tableId} />
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each columns as column (column.id)}
					<div class="space-y-2">
						<label for={column.id} class="block text-sm font-medium text-gray-700">
							{column.name}
							{#if column.isRequired}
								<span class="text-red-500">*</span>
							{/if}
						</label>

						{#if column.type === 'text' || column.type === 'email' || column.type === 'phone' || column.type === 'url'}
							<input
								type={column.type === 'email' ? 'email' : column.type === 'url' ? 'url' : column.type === 'phone' ? 'tel' : 'text'}
								id={column.id}
								name={column.id}
								bind:value={formValues[column.id]}
								required={column.isRequired}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder={`Saisir ${column.name.toLowerCase()}`}
							/>

						{:else if column.type === 'number'}
							<input
								type="number"
								id={column.id}
								name={column.id}
								bind:value={formValues[column.id]}
								required={column.isRequired}
								step={column.config?.format === 'decimal' ? '0.01' : '1'}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>

						{:else if column.type === 'date'}
							<input
								type="date"
								id={column.id}
								name={column.id}
								bind:value={formValues[column.id]}
								required={column.isRequired}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>

						{:else if column.type === 'checkbox'}
							<div class="flex items-center">
								<input
									type="checkbox"
									id={column.id}
									name={column.id}
									bind:checked={formValues[column.id]}
									class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<label for={column.id} class="ml-2 text-sm text-gray-700">
									Coché si vrai
								</label>
							</div>

						{:else if column.type === 'select'}
							<select
								id={column.id}
								name={column.id}
								bind:value={formValues[column.id]}
								required={column.isRequired}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Sélectionner une option</option>
								{#if column.config?.options}
									{#each column.config.options as option}
										<option value={option}>{option}</option>
									{/each}
								{/if}
							</select>

						{:else if column.type === 'multiselect' && column.config?.options}
							<div class="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
								{#each column.config.options as option}
									<label class="flex items-center">
										<input
											type="checkbox"
											checked={Array.isArray(formValues[column.id]) && formValues[column.id].includes(option)}
											on:change={(e) => handleMultiselectChange(column.id, option, e.target.checked)}
											class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										/>
										<span class="ml-2 text-sm text-gray-700">{option}</span>
									</label>
								{/each}
							</div>
							<input type="hidden" name={column.id} value={JSON.stringify(formValues[column.id] || [])} />

						{:else if column.type === 'rating'}
							<div class="flex items-center space-x-2">
								{#each Array(column.config?.maxRating || 5) as _, i (i)}
									<button
										type="button"
										on:click={() => formValues[column.id] = i + 1}
										class="w-8 h-8 {formValues[column.id] > i ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors"
										aria-label="Ajouter une note"
									>
										<svg fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									</button>
								{/each}
								<span class="text-sm text-gray-600">
									{formValues[column.id] || 0}/{column.config?.maxRating || 5}
								</span>
							</div>
							<input type="hidden" name={column.id} value={formValues[column.id] || 0} />

						{:else if column.type === 'priority'}
							<select
								id={column.id}
								name={column.id}
								bind:value={formValues[column.id]}
								required={column.isRequired}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Sélectionner une priorité</option>
								<option value="haute">🔴 Haute</option>
								<option value="moyenne">🟡 Moyenne</option>
								<option value="basse">🟢 Basse</option>
							</select>

						{:else if column.type === 'status'}
							<select
								id={column.id}
								name={column.id}
								bind:value={formValues[column.id]}
								required={column.isRequired}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Sélectionner un statut</option>
								<option value="en_attente">⏳ En attente</option>
								<option value="en_cours">🔄 En cours</option>
								<option value="termine">✅ Terminé</option>
								<option value="annule">❌ Annulé</option>
							</select>

						{:else}
							<!-- Fallback pour les types non gérés -->
							<input
								type="text"
								id={column.id}
								name={column.id}
								bind:value={formValues[column.id]}
								required={column.isRequired}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder={`Saisir ${column.name.toLowerCase()}`}
							/>
						{/if}

						{#if column.config?.format}
							<p class="text-xs text-gray-500">
								Format: {column.config.format}
							</p>
						{/if}
					</div>
				{/each}
			</div>

			<div class="flex justify-end gap-3 pt-4 border-t">
				<button
					type="button"
					on:click={closeModal}
					class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
				>
					Annuler
				</button>
				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
				>
					{recordId ? 'Modifier' : 'Créer'}
				</button>
			</div>
		</form>
	</div>
</div>