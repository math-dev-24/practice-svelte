<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import TableCard from '$lib/components/table/table-card.svelte';

	export let data: PageData;
	export let form: ActionData;

	let showCreateModal: boolean = false;
	let editingTable: any = null;
	let showDeleteConfirm: string | null = null;

	$: if (form?.success) {
		showCreateModal = false;
		editingTable = null;
		showDeleteConfirm = null;
		invalidateAll();
	}

	function openEditModal(table: any) {
		editingTable = { ...table };
	}

	function closeModals() {
		showCreateModal = false;
		editingTable = null;
		showDeleteConfirm = null;
	}
</script>

<svelte:head>
	<title>Mes Tables</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Mes Tables</h1>
			<p class="text-gray-600 mt-2">Gérez vos tables de données</p>
		</div>
		<button
			on:click={() => showCreateModal = true}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
			</svg>
			Nouvelle Table
		</button>
	</div>

	<!-- Messages d'erreur -->
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
			{form.error}
		</div>
	{/if}

	<!-- Liste des tables -->
	{#if data.tables.length === 0}
		<div class="text-center py-12">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Aucune table</h3>
			<p class="mt-1 text-sm text-gray-500">Commencez par créer votre première table de données.</p>
			<div class="mt-6">
				<button
					on:click={() => showCreateModal = true}
					class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
				>
					Créer une table
				</button>
			</div>
		</div>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.tables as table (table.id)}
				<TableCard
					table={table}
					openEditModal={(table) => openEditModal(table)}
					showDeleteConfirm={showDeleteConfirm}
				/>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal Créer Table -->
{#if showCreateModal}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-md w-full p-6">
			<h2 class="text-lg font-semibold mb-4">Créer une nouvelle table</h2>

			<form method="POST" action="?/create" use:enhance>
				<div class="mb-4">
					<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
						Nom de la table *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Ma nouvelle table"
					/>
				</div>

				<div class="mb-6">
					<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows="3"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Description de la table..."
					></textarea>
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
						Créer
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal Modifier Table -->
{#if editingTable}
	<div class="fixed inset-0 bg-gray-600/75 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg max-w-md w-full p-6">
			<h2 class="text-lg font-semibold mb-4">Modifier la table</h2>

			<form method="POST" action="?/update" use:enhance>
				<input type="hidden" name="id" value={editingTable.id} />

				<div class="mb-4">
					<label for="edit-name" class="block text-sm font-medium text-gray-700 mb-2">
						Nom de la table *
					</label>
					<input
						type="text"
						id="edit-name"
						name="name"
						required
						value={editingTable.name}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="mb-6">
					<label for="edit-description" class="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						id="edit-description"
						name="description"
						rows="3"
						value={editingTable.description || ''}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					></textarea>
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
				Êtes-vous sûr de vouloir supprimer cette table ? Cette action est irréversible et supprimera toutes les données associées.
			</p>

			<form method="POST" action="?/delete" use:enhance>
				<input type="hidden" name="id" value={showDeleteConfirm} />

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