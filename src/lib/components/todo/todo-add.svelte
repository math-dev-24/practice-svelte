<script lang="ts">
	import { enhance } from '$app/forms';
	import MInput from '$lib/components/base/MInput.svelte';
	import type { ActionData } from './$types';

	type Props = {
		form: ActionData;
		showForm: boolean;
	}

	let { form, showForm = $bindable() }: Props = $props();

	let formElement: HTMLFormElement;

	const resetForm = () => {
		formElement?.reset();
	};

	const closeForm = () => {
		showForm = false;
	};
</script>

{#if showForm}
	<div class="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-auto overflow-hidden">
		<!-- Header -->
		<div class="px-6 py-5 border-b border-gray-100">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold text-gray-900">Nouvelle tâche</h2>
					<p class="text-sm text-gray-500 mt-1">Ajoutez une nouvelle tâche à votre liste</p>
				</div>
				<button
					onclick={closeForm}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					aria-label="Fermer"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
						<path d="M18 6L6 18M6 6l12 12"/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Form -->
		<form
			bind:this={formElement}
			action="?/createTodo"
			method="post"
			class="p-6 space-y-5"
			use:enhance={() => {
        return async ({ result, update }) => {
          await update();
          if (result.type === 'success') {
            showForm = false;
          }
        };
      }}
		>
			<div class="space-y-4">
				<MInput
					type="text"
					label="Titre de la tâche"
					name="title"
					tabindex={1}
					autofocus={true}
					required={true}
				/>

				<MInput
					type="text"
					tabindex={2}
					label="Description (optionnel)"
					name="description"
					required={false}
				/>
			</div>

			<!-- Message d'erreur -->
			{#if form?.message}
				<div class="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500 mt-0.5 flex-shrink-0">
						<circle cx="12" cy="12" r="10"/>
						<path d="M15 9l-6 6M9 9l6 6"/>
					</svg>
					<span class="text-sm text-red-700">{form.message}</span>
				</div>
			{/if}

			<!-- Actions -->
			<div class="flex gap-3 pt-2">
				<button
					type="button"
					onclick={resetForm}
					tabindex="3"
					class="flex-1 px-4 py-2.5 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors font-medium"
				>
					Effacer
				</button>
				<button
					type="submit"
					tabindex="4"
					class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
				>
					Créer la tâche
				</button>
			</div>
		</form>
	</div>
{/if}