<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../../../.svelte-kit/types/src/routes/todos/$types';

	let { form }: { form: ActionData } = $props();

	let show = $state<boolean>(false);

	// Fermer le modal automatiquement si pas d'erreur après soumission
	$effect(() => {
		if (form && !form.message && show) {
			hideModal();
		}
	});

	const showAddTodo = () => {
		show = true;
	}

	const hideModal = () => {
		show = false;
	}

	const handleBackdropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			hideModal();
		}
	}

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			hideModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Bouton pour ouvrir le modal -->
<button
	on:click={showAddTodo}
	class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
	<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
	</svg>
	Ajouter une tâche
</button>

<!-- Modal -->
{#if show}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- Modal Content -->
		<div class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4">
				<div
					class="relative w-full max-w-lg bg-white shadow-xl rounded-lg p-6 transform transition-all duration-200 scale-100"
				>
					<!-- Header avec bouton de fermeture -->
					<div class="flex items-center justify-between mb-6">
						<h2 id="modal-title" class="text-xl font-semibold text-gray-900">
							Nouvelle tâche
						</h2>
						<button
							on:click={hideModal}
							class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
							aria-label="Fermer le modal"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>

					<!-- Formulaire -->
					<form
						method="post"
						use:enhance={() => {
              return async ({ result, update }) => {
                if (result.type === 'success') {
                  hideModal();
                  // Reset le formulaire
                  const form = document.querySelector('form');
                  form?.reset();
                }
                await update();
              };
            }}
						action="?/createTodo"
						class="space-y-4"
					>
						<div>
							<label for="title" class="block text-sm font-medium text-gray-700 mb-1">
								Titre
							</label>
							<input
								type="text"
								id="title"
								name="title"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
								placeholder="Entrez le titre de la tâche"
								autofocus
							/>
						</div>

						<div>
							<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<textarea
								id="description"
								name="description"
								rows="3"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
								placeholder="Décrivez votre tâche (optionnel)"
							></textarea>
						</div>

						<!-- Boutons d'action -->
						<div class="flex gap-3 pt-4">
							<button
								type="button"
								on:click={hideModal}
								class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
							>
								Annuler
							</button>
							<button
								type="submit"
								class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								Créer la tâche
							</button>
						</div>
					</form>

					<!-- Message d'erreur -->
					{#if form?.message}
						<div class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
							{form.message}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}