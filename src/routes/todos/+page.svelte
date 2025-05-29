<script lang="ts">
	import type { PageServerData } from './$types';
	import type { ActionData } from './$types'
	import TodoCard from "$lib/components/todo/todo-card.svelte";
	import TodoAdd from "$lib/components/todo/todo-add.svelte";

	let { data, form }: { data: PageServerData, form: ActionData } = $props()

</script>

<h1>TODO</h1>

<TodoAdd {form} />

<div class="grid grid-cols-3 gap-2 w-2/3 mx-auto my-8">
	{#each data.todos as todo}
		<TodoCard {todo} />
	{:else}
		<p>No todo</p>
	{/each}
</div>