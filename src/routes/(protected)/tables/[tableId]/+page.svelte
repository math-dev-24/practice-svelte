<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import RecordForm from '$lib/components/record/record-form.svelte';
	import RecordRow from '$lib/components/record/record-row.svelte';

	export let data: PageData;
	export let form: ActionData;

	// États des modales et sélections
	let showCreateModal = false;
	let showEditModal = false;
	let editingRecord: any = null;
	let selectedRecords: Set<string> = new Set();
	let showDeleteConfirm = false;
	let showBulkDeleteConfirm = false;

	// Recherche et filtres
	let searchTerm = data.currentSearch || '';

	// Fermer les modales après succès
	$: if (form?.success) {
		showCreateModal = false;
		showEditModal = false;
		editingRecord = null;
		showDeleteConfirm = false;
		showBulkDeleteConfirm = false;
		selectedRecords.clear();
		invalidateAll();
	}

	function openCreateModal() {
		showCreateModal = true;
	}

	function openEditModal(record: any) {
		editingRecord = { ...record };
		showEditModal = true;
	}

	function closeModals() {
		showCreateModal = false;
		showEditModal = false;
		editingRecord = null;
		showDeleteConfirm = false;
		showBulkDeleteConfirm = false;
	}

	function toggleRecordSelection(recordId: string) {
		if (selectedRecords.has(recordId)) {
			selectedRecords.delete(recordId);
		} else {
			selectedRecords.add(recordId);
		}
		selectedRecords = selectedRecords; // Trigger reactivity
	}

	function toggleSelectAll() {
		if (selectedRecords.size === data.records.length) {
			selectedRecords.clear();
		} else {
			selectedRecords = new Set(data.records.map(r => r.id));
		}
	}

	function handleSearch() {
		const url = new URL(window.location.href);
		if (searchTerm) {
			url.searchParams.set('search', searchTerm);
		} else {
			url.searchParams.delete('search');
		}
		window.location.href = url.toString();
	}

	function clearSearch() {
		searchTerm = '';
		const url = new URL(window.location.href);
		url.searchParams.delete('search');
		window.location.href = url.toString();
	}
</script>

<svelte:head>
	<title>Enregistrements - {data.table.name}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- En-tête -->
	<div class="flex justify-between items-start mb-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Enregistrements</h1>
			<p class="text-sm text-gray-500 mt-1">
				{data.records.length} enregistrement{data.records.length > 1 ? 's' : ''}
			</p>
		</div>

		<div class="flex items-center gap-3">
			<!-- Bouton d'export -->
			<form method="POST" action="?/exportData" use:enhance>
				<button
					type="submit"
					class="text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2"
					title="Exporter en CSV"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Exporter
				</button>
			</form>

			<!-- Bouton d'ajout -->
			<button
				on:click={openCreateModal}
				class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Ajouter un enregistrement
			</button>
		</div>
	</div>

	<!-- Messages -->
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
			{form.error}
		</div>
	{/if}

	{#if form?.success && form?.message}
		<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
			{form.message}
		</div>
	{/if}

	<!-- Barre de recherche et actions -->
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
		<div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
			<!-- Recherche -->
			<div class="flex-1 max-w-md">
				<div class="relative">
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Rechercher dans les enregistrements..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						on:keydown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
			</div>

			<!-- Boutons de recherche -->
			<div class="flex gap-2">
				<button
					on:click={handleSearch}
					class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
				>
					Rechercher
				</button>
				{#if data.currentSearch}
					<button
						on:click={clearSearch}
						class="text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
					>
						Effacer
					</button>
				{/if}
			</div>
		</div>

		<!-- Actions groupées -->
		{#if selectedRecords.size > 0}
			<div class="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-md">
				<span class="text-sm text-blue-800">
					{selectedRecords.size} enregistrement{selectedRecords.size > 1 ? 's' : ''} sélectionné{selectedRecords.size > 1 ? 's' : ''}
				</span>
				<button
					on:click={() => showBulkDeleteConfirm = true}
					class="text-red-600 hover:text-red-800 text-sm font-medium"
				>
					Supprimer la sélection
				</button>
			</div>
		{/if}
	</div>

	<!-- Tableau des enregistrements -->
	{#if data.records.length === 0}
		<div class="text-center py-12 bg-white rounded-lg shadow-sm">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Aucun enregistrement</h3>
			<p class="mt-1 text-sm text-gray-500">
				{#if data.currentSearch}
					Aucun résultat pour "{data.currentSearch}"
				{:else}
					Commencez par ajouter des enregistrements à votre table.
				{/if}
			</p>
			{#if !data.currentSearch}
				<button
					on:click={openCreateModal}
					class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
				>
					Ajouter le premier enregistrement
				</button>
			{/if}
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left">
							<input
								type="checkbox"
								checked={selectedRecords.size === data.records.length && data.records.length > 0}
								on:change={toggleSelectAll}
								class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							/>
						</th>
						{#each data.columns as column (column.id)}
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{column.name}
								{#if column.isRequired}
									<span class="text-red-500">*</span>
								{/if}
							</th>
						{/each}
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
					{#each data.records as record (record.id)}
						<RecordRow
							{record}
							columns={data.columns}
							isSelected={selectedRecords.has(record.id)}
							onToggleSelect={() => toggleRecordSelection(record.id)}
							onEdit={() => openEditModal(record)}
							onDelete={() => {
									editingRecord = record;
									showDeleteConfirm = true;
								}}
						/>
					{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<!-- Modal Créer Enregistrement -->
{#if showCreateModal}
	<RecordForm
		title="Ajouter un enregistrement"
		action="?/createRecord"
		columns={data.columns}
		values={{}}
		closeModal={closeModals}
	/>
{/if}

<!-- Modal Modifier Enregistrement -->
{#if showEditModal && editingRecord}
	<RecordForm
		title="Modifier l'enregistrement"
		action="?/updateRecord"
		columns={data.columns}
		values={editingRecord.values}
		recordId={editingRecord.id}
		tableId={data.table.id}
		closeModal={closeModals}
	/>
{/if}

<!-- Modal Confirmation Suppression -->
{#if showDeleteConfirm && editingRecord}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-md w-full p-6">
			<h2 class="text-lg font-semibold mb-4 text-red-600">Confirmer la suppression</h2>
			<p class="text-gray-700 mb-6">
				Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action est irréversible.
			</p>

			<form method="POST" action="?/deleteRecord" use:enhance>
				<input type="hidden" name="recordId" value={editingRecord.id} />
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
						class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
					>
						Supprimer
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal Confirmation Suppression Multiple -->
{#if showBulkDeleteConfirm}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-md w-full p-6">
			<h2 class="text-lg font-semibold mb-4 text-red-600">Confirmer la suppression</h2>
			<p class="text-gray-700 mb-6">
				Êtes-vous sûr de vouloir supprimer les {selectedRecords.size} enregistrements sélectionnés ? Cette action est irréversible.
			</p>

			<form method="POST" action="?/deleteMultiple" use:enhance>
				<input type="hidden" name="recordIds" value={JSON.stringify([...selectedRecords])} />
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
						class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
					>
						Supprimer tout
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}