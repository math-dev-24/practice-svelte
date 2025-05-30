<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import MInput from '$lib/components/base/MInput.svelte';

	let { form }: { form: ActionData } = $props();
</script>


<form
	method="post"
	action="?/login"
	use:enhance
	class="border max-w-lg mx-auto border-slate-300 rounded bg-white drop-shadow py-6 px-8"
>
	<MInput
		label="Username :"
		type="text"
		name="username"
		autofocus={true}
	/>

	<MInput
		label="Mot de passe :"
		type="password"
		name="password"
	/>
	<button class="btn btn-success">
		Se connecter
	</button>
	<button class="btn btn-orange" formaction="?/register">
		S'inscrire
	</button>

	{#if form?.message}
		<div class={`callout-${form.type}`}>
			{form.message}
		</div>
	{/if}
</form>