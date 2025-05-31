<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import {type ColumnWithConfig } from '$lib/types';
	import ColumnEdit from '$lib/components/column/column-edit.svelte';
	import ColumnCreate from '$lib/components/column/column-create.svelte';
	import ColumnCard from '$lib/components/column/column-card.svelte';

	export let data: PageData;
	export let form: ActionData;

	// États des modales
	let showAddModal = false;
	let showDeleteConfirm: string | null = null;
	let editingColumn: ColumnWithConfig | null = null;

	// Fermer les modales après succès
	$: if (form?.success) {
		showAddModal = false;
		showDeleteConfirm = null;
		editingColumn = null;
		invalidateAll();
	}

	function openEditModal(column: ColumnWithConfig) {
		// Créer une copie complète de la colonne pour l'édition
		editingColumn = {
			...column,
			config: column.config ? { ...column.config } : null
		};
	}

	function closeModals() {
		showAddModal = false;
		showDeleteConfirm = null;
		editingColumn = null;
	}

</script>

<svelte:head>
	<title>Colonnes - {data.table.name}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- En-tête avec bouton d'ajout -->
	<div class="flex justify-between items-center mb-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">{data.columns.length} Colonnes</h1>
			<p class="text-gray-600">Gérez les colonnes de la table "{data.table.name}"</p>
		</div>
		<button
			on:click={() => showAddModal = true}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
			</svg>
			Ajouter une colonne
		</button>
	</div>

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
				{#each data.columns as column (column.id)}
					<ColumnCard
						{column}
						onEdit={openEditModal}
						onDelete={(columnId) => showDeleteConfirm = columnId}
					/>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<!-- Modal Ajouter Colonne -->
{#if showAddModal}
	<ColumnCreate closeModals={closeModals} />
{/if}

<!-- Modal Modifier Colonne -->
{#if editingColumn}
	<ColumnEdit editingColumn={editingColumn} closeModals={closeModals} />
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