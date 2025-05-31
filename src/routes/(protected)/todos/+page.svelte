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

</script>

<h1 class="text-3xl font-bold"> {data.todos.length} | Mes tâches :</h1>
<button class="btn btn-primary" onclick={toggleForm}>
	{showForm ? 'Masquer' : 'Ajouter'}
</button>
{#if showForm}
	<div
		class="z-40 fixed top-0 left-0 bg-black opacity-50 h-screen w-screen"
	onclick={toggleForm}
	></div>
	<TodoAdd {form} toggleForm={toggleForm} />
{/if}
<div class="grid grid-cols-3 gap-2 mx-auto my-8">
	{#each data.todos as todo (todo.id)}
		<TodoCard {todo} />
	{:else}
		<p>No todo</p>
	{/each}
</div>