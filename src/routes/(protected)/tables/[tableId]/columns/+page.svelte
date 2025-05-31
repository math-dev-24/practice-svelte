<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import type { ColumnType } from '$lib/types/record.type';

	export let data: PageData;
	export let form: ActionData;

	let showAddModal = false;
	let editingColumn: any = null;
	let showDeleteConfirm: string | null = null;

	// Options pour les types de colonnes
	const columnTypes: { value: ColumnType; label: string; description: string }[] = [
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
		{ value: 'status', label: 'Statut', description: 'État du projet' }
	];

	let selectedType: ColumnType = 'text';
	let editSelectedType: ColumnType = 'text';

	// Fermer les modales après succès
	$: if (form?.success) {
		showAddModal = false;
		editingColumn = null;
		showDeleteConfirm = null;
		invalidateAll();
	}

	function openEditModal(column: any) {
		editingColumn = { ...column };
		editSelectedType = column.type;

		// Convertir les options en string pour le textarea
		if (column.config?.options && Array.isArray(column.config.options)) {
			editingColumn.optionsText = column.config.options.join('\n');
		}
	}

	function closeModals() {
		showAddModal = false;
		editingColumn = null;
		showDeleteConfirm = null;
		selectedType = 'text';
		editSelectedType = 'text';
	}

	function getColumnTypeLabel(type: ColumnType): string {
		return columnTypes.find(t => t.value === type)?.label || type;
	}

	function formatConfig(config: any): string {
		if (!config) return '';

		const parts = [];
		if (config.options) parts.push(`Options: ${config.options.length}`);
		if (config.maxRating) parts.push(`Max: ${config.maxRating}`);
		if (config.format) parts.push(`Format: ${config.format}`);

		return parts.join(', ');
	}
</script>

<svelte:head>
	<title>Colonnes - {data.table.name}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Messages -->
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
			{form.error}
		</div>
	{/if}

	<!-- Liste des colonnes -->
	{#if data.columns.length === 0}
		<div class="text-center py-12">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Aucune colonne</h3>
			<p class="mt-1 text-sm text-gray-500">Commencez par ajouter des colonnes à votre table.</p>
		</div>
	{:else}
		<div class="bg-white shadow overflow-hidden sm:rounded-md">
			<ul class="divide-y divide-gray-200">
				{#each data.columns as column, index (index)}
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
									on:click={() => openEditModal(column)}
									class="text-gray-400 hover:text-gray-600 p-2"
									title="Modifier"
									aria-label="Modifier"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
									</svg>
								</button>
								<button
									on:click={() => showDeleteConfirm = column.id}
									class="text-gray-400 hover:text-red-600 p-2"
									title="Supprimer"
									aria-label="Supprimer"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
									</svg>
								</button>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<!-- Modal Ajouter Colonne -->
{#if showAddModal}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
			<h2 class="text-lg font-semibold mb-4">Ajouter une colonne</h2>

			<form method="POST" action="?/addColumn" use:enhance>
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
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Nom de la colonne"
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
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Option 1&#10;Option 2&#10;Option 3"
						></textarea>
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
							value="5"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
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
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Standard</option>
							<option value="currency">Monnaie</option>
							<option value="percentage">Pourcentage</option>
							<option value="decimal">Décimal</option>
						</select>
					</div>
				{/if}

				<div class="mb-6">
					<label class="flex items-center">
						<input
							type="checkbox"
							name="isRequired"
							class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="ml-2 text-sm text-gray-700">Colonne obligatoire</span>
					</label>
				</div>

				<div class="flex justify-end gap-3">
					<button
						type="button"
						on:click={closeModals}
						class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
					>
						Ajouter
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal Modifier Colonne -->
{#if editingColumn}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
			<h2 class="text-lg font-semibold mb-4">Modifier la colonne</h2>

			<form method="POST" action="?/updateColumn" use:enhance>
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
							value={editingColumn.name}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							value={editingColumn.optionsText || ''}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						></textarea>
					</div>
				{/if}

				{#if editSelectedType === 'rating'}
					<div class="mb-4">
						<label for="edit-maxRating" class="block text-sm font-medium text-gray-700 mb-2">
							Note maximale
						</label>
						<input
							type="number"
							id="edit-maxRating"
							name="maxRating"
							min="1"
							max="10"
							value={editingColumn.config?.maxRating || 5}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							value={editingColumn.config?.format || ''}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Standard</option>
							<option value="currency">Monnaie</option>
							<option value="percentage">Pourcentage</option>
							<option value="decimal">Décimal</option>
						</select>
					</div>
				{/if}

				<div class="mb-6">
					<label class="flex items-center">
						<input
							type="checkbox"
							name="isRequired"
							checked={editingColumn.isRequired}
							class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="ml-2 text-sm text-gray-700">Colonne obligatoire</span>
					</label>
				</div>

				<div class="flex justify-end gap-3">
					<button
						type="button"
						on:click={closeModals}
						class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
					>
						Modifier
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal Confirmation Suppression -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-md w-full p-6">
			<h2 class="text-lg font-semibold mb-4 text-red-600">Confirmer la suppression</h2>
			<p class="text-gray-700 mb-6">
				Êtes-vous sûr de vouloir supprimer cette colonne ? Cette action supprimera également toutes les données de cette colonne dans tous les enregistrements.
			</p>

			<form method="POST" action="?/deleteColumn" use:enhance>
				<input type="hidden" name="columnId" value={showDeleteConfirm} />

				<div class="flex justify-end gap-3">
					<button
						type="button"
						on:click={closeModals}
						class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
					>
						Supprimer
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}