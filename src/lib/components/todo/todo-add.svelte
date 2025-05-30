<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import MInput from '$lib/components/base/MInput.svelte';

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

	<MInput
		type="text"
		label="Nom de la todo :"
		name="title"
		autofocus={true}
		required={true}
	/>

	<MInput
		type="text"
		label="Description :"
		name="description"
		required={true}
	/>

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