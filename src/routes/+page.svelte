<script lang="ts">

	let { data }: { data: LayoutData } = $props();

</script>


{#if data.user}
	<h1 class="text-2xl">Bonjour {data.user.username} !</h1>
{:else}
	<h1 class="text-2xl">Hello world!</h1>
	<p>Vous n'êtes pas connecté veuillez <a href="/login" class="underline hover:text-emerald-600">vous connecter</a></p>
{/if}