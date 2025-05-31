<script lang="ts">
	import TodoCard from "$lib/components/todo/todo-card.svelte";
	import TodoAdd from "$lib/components/todo/todo-add.svelte";
	import type { ActionData } from './$types';
	import type { PageServerData } from './$types';

	let { data, form }: { data: PageServerData, form: ActionData } = $props()

	let showForm = $state(false)

	const toggleForm = () => {
		showForm = !showForm
	}

	const completedTodos = $derived(data.todos.filter(todo => todo.completed).length);
	const pendingTodos = $derived(data.todos.length - completedTodos);

</script>

<div class="max-w-7xl mx-auto px-4 py-8">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Mes tâches</h1>
				<p class="text-gray-500">
					{data.todos.length} {data.todos.length === 1 ? 'tâche' : 'tâches'} au total
				</p>
			</div>

			<button
				class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
				onclick={toggleForm}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 5v14M5 12h14"/>
				</svg>
				Ajouter une tâche
			</button>
		</div>

		<!-- Stats -->
		{#if data.todos.length > 0}
			<div class="flex gap-4 p-4 bg-gray-50 rounded-xl">
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 bg-amber-400 rounded-full"></div>
					<span class="text-sm text-gray-600">
            <span class="font-medium text-gray-900">{pendingTodos}</span> en cours
          </span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 bg-emerald-400 rounded-full"></div>
					<span class="text-sm text-gray-600">
            <span class="font-medium text-gray-900">{completedTodos}</span> terminées
          </span>
				</div>
				{#if data.todos.length > 0}
					<div class="ml-auto text-sm text-gray-500">
						{Math.round((completedTodos / data.todos.length) * 100)}% complété
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Contenu principal -->
	{#if data.todos.length === 0}
		<div class="text-center py-16">
			<div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
					<path d="M9 11l3 3 8-8"/>
					<path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.5 0 4.77 1.02 6.41 2.67"/>
				</svg>
			</div>
			<h3 class="text-lg font-medium text-gray-900 mb-2">Aucune tâche</h3>
			<p class="text-gray-500 mb-6">Commencez par ajouter votre première tâche</p>
			<button
				class="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
				onclick={toggleForm}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 5v14M5 12h14"/>
				</svg>
				Créer une tâche
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.todos as todo (todo.id)}
				<TodoCard {todo} />
			{/each}
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showForm}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<!-- Overlay -->
		<button
			class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			onclick={toggleForm}
			aria-label="Fermer la modale"
		></button>

		<!-- Modal content -->
		<div class="relative z-10 w-full max-w-md">
			<TodoAdd {form} bind:showForm={showForm} />
		</div>
	</div>
{/if}