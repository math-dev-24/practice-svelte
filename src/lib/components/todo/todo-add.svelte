<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let formElement: HTMLFormElement;

	const resetForm = () => {
		if (formElement) {
			formElement.reset();
		}
	}

</script>

<form
	bind:this={formElement}
	action="?/createTodo"
	class="space-y-4 max-w-md mx-auto border rounded bg-white py-8 px-4 border-slate-200 drop-shadow"
	method="post"
	use:enhance
>
	<div>
		<label class="block text-sm font-medium text-gray-700 mb-1" for="title">
			Titre
		</label>
		<input
			autofocus
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
			tabindex="1"
			id="title"
			name="title"
			placeholder="Entrez le titre de la tâche"
			required
			type="text"
		/>
	</div>

	<div>
		<label class="block text-sm font-medium text-gray-700 mb-1" for="description">
			Description
		</label>
		<textarea
			tabindex="2"
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
			id="description"
			name="description"
			placeholder="Décrivez votre tâche (optionnel)"
			rows="3"
		></textarea>
	</div>

	<!-- Boutons d'action -->
	<div class="flex gap-3 pt-4">
		<button
			tabindex="3"
			class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
			on:click={resetForm}
			type="button"
		>
			Reset
		</button>
		<button
			tabindex="4"
			class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Créer la tâche
		</button>
	</div>
</form>


{#if form?.message}
	<div class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
		{form.message}
	</div>
{/if}