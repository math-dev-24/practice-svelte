<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>


<form
	method="post"
	action="?/login"
	use:enhance
>
	<div>
		<label for="username">Username :</label>
		<input type="text" name="username" id="username" />
	</div>
	<div>
		<label for="password">Mot de passe :</label>
		<input type="password" name="password" id="password"/>
	</div>
	<button>
		Se connecter
	</button>
	<button formaction="?/register">
		S'inscrire
	</button>

	{#if form?.message}
		<div>
			{form.message}
		</div>
	{/if}
</form>