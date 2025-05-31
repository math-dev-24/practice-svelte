<script lang="ts">
	import type { LayoutData } from './$types';

	let { data }: { data: LayoutData } = $props();

</script>


{#if data.user}
	<h1 class="text-2xl mb-14">Bonjour {data.user.username} !</h1>
	<ul class="list-disc ml-10">
		<li><a href="/todos" class="hover:underline">Mes todos</a></li>
		<li><a href="/pokedex" class="hover:underline">Pokedex</a></li>
	</ul>
{:else}
	<h1 class="text-2xl">Hello world!</h1>
	<p>Vous n'êtes pas connecté veuillez <a href="/login" class="underline hover:text-emerald-600">vous connecter</a></p>
{/if}