<script lang="ts">

	export let table: any;
	export let openEditModal: (table: any) => void;
	export let showDeleteConfirm: string | null = null;

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

</script>

<div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
	<div class="flex justify-between items-start mb-4">
		<div class="flex-1">
			<h3 class="text-lg font-semibold text-gray-900 mb-1">
				<a href="/tables/{table.id}" class="hover:text-blue-600">
					{table.name}
				</a>
			</h3>
			{#if table.description}
				<p class="text-gray-600 text-sm">{table.description}</p>
			{/if}
		</div>

		<!-- Menu actions -->
		<div class="flex gap-2">
			<button
				on:click={() => openEditModal(table)}
				class="text-gray-400 hover:text-gray-600 p-1"
				title="Modifier"
				aria-label="Modifier"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
				</svg>
			</button>
			<button
				on:click={() => showDeleteConfirm = table.id}
				class="text-gray-400 hover:text-red-600 p-1"
				title="Supprimer"
				aria-label="Supprimer"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
				</svg>
			</button>
		</div>
	</div>

	<div class="text-xs text-gray-500">
		Créée le {formatDate(table.createdAt)}
	</div>
</div>