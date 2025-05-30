<script lang="ts">
	import type { Todo } from '$lib/server/db/schema';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	let { todo }: { todo: Todo } = $props();
</script>

<div
	transition:fade={{duration: 150}}
	class="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
>
	<div class="flex items-start justify-between gap-2">
		<div class="flex-1 min-w-0">
			<h3 class="text-lg font-medium text-gray-900 mb-2 leading-tight">
				{todo.title}
			</h3>
			{#if todo.description}
				<p class="text-gray-600 text-sm leading-relaxed">
					{todo.description}
				</p>
			{/if}
		</div>
	</div>

	<div class="flex gap-2">
		<form
			method="post"
			use:enhance
			action="?/toggleTodo"
			class="flex items-center gap-2"
		>
			<input
				type="hidden"
				name="id"
				value={todo.id}
			/>
			<button
				class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
				>
				{#if todo.completed}
					Démarrer
				{:else}
					Terminer
				{/if}
			</button>
		</form>
		<form
		method="post"
		use:enhance
		action="?/deleteTodo"
		class="flex items-center gap-2"
	>
		<input
			type="hidden"
			name="id"
			value={todo.id}
		/>
		<button
			class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
			>
			<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 14 14"><!-- Icon from Streamline by Streamline - https://creativecommons.org/licenses/by/4.0/ --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M1 3.5h12m-10.5 0h9v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-9h0Zm2 0V3a2.5 2.5 0 0 1 5 0v.5m-4 2V11m3-5.5V11"/></svg>		</button>
		</form>
	</div>

		<div class="mt-3 pt-3 border-t border-gray-100">
			{#if todo.completed}
				<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
					Terminé
				</span>
				{:else}
				<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
					Ouvert
				</span>
				{/if}
		</div>
</div>