<script lang="ts">
	import type { Todo } from '$lib/server/db/schema';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	let { todo }: { todo: Todo } = $props();
</script>

<div
	transition:fade={{duration: 200}}
	class="group relative bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
>
	<!-- Status indicator -->
	<div class="absolute top-5 right-5">
		<div class={`w-2 h-2 rounded-full ${todo.completed ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
	</div>

	<!-- Content -->
	<div class="pr-6">
		<h3 class={`text-lg font-semibold mb-2 transition-colors ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
			{todo.title}
		</h3>

		{#if todo.description}
			<p class="text-gray-500 text-sm mb-4 leading-relaxed">
				{todo.description}
			</p>
		{/if}
	</div>

	<!-- Actions -->
	<div class="flex items-center justify-between pt-4 border-t border-gray-50">
    <span class={`text-xs font-medium px-2 py-1 rounded-md ${
      todo.completed
        ? 'bg-emerald-50 text-emerald-600'
        : 'bg-amber-50 text-amber-600'
    }`}>
      {todo.completed ? 'Terminé' : 'En cours'}
    </span>

		<div class="flex gap-2">
			<!-- Toggle button -->
			<form method="post" use:enhance action="?/toggleTodo">
				<input type="hidden" name="id" value={todo.id} />
				<button
					class={`p-2 rounded-lg text-xs font-medium transition-colors ${
            todo.completed
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          }`}
				>
					{todo.completed ? 'Rouvrir' : 'Terminer'}
				</button>
			</form>

			<!-- Delete button -->
			<form method="post" use:enhance action="?/deleteTodo">
				<input type="hidden" name="id" value={todo.id} />
				<button
					class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
					aria-label="Supprimer la tâche"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14ZM10 11v6M14 11v6"/>
					</svg>
				</button>
			</form>
		</div>
	</div>
</div>