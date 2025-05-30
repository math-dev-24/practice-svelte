<script lang="ts">
	import TodoCard from "$lib/components/todo/todo-card.svelte";
	import TodoAdd from "$lib/components/todo/todo-add.svelte";
	import type { ActionData } from './$types';
	import type { PageServerData } from './$types';

	let { data, form }: { data: PageServerData, form: ActionData } = $props()

</script>


<TodoAdd {form} />

<div class="grid grid-cols-3 gap-2 mx-auto my-8">
	{#each data.todos as todo (todo.id)}
		<TodoCard {todo} />
	{:else}
		<p>No todo</p>
	{/each}
</div>