<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import MInput from '$lib/components/base/MInput.svelte';

	let { data, form }: { data: PageServerData, form: any } = $props();

	let updatePassword = $state(false);
	
</script>

<h1 class="text-center text-2xl mb-6">Bonjour <span class="text-emerald-600">{data.user.username}</span>,</h1>

<form
	class="max-w-md mx-auto border rounded bg-white drop-shadow border-slate-300 py-6 px-4"
	method="POST"
	action="?/updateProfile"
	use:enhance
>
	<MInput
		label="Nom :"
		type="text"
		name="username"
		autofocus={true}
	/>

	<div class="flex items-center gap-2 my-2">
		<input
			type="checkbox"
			id="update_password"
			name="update_password"
			bind:checked={updatePassword}
		/>
		<label for="update_password">update password</label>
	</div>

	{#if updatePassword}

		<MInput
			label="Mot de passe actuel :"
			type="password"
			name="tmp_password"
			required={updatePassword}
		/>

		<div class="grid grid-cols-2 gap-2">
			<MInput
				label="Nouveau mot de passe :"
				type="password"
				name="new_password"
				required={updatePassword}
			/>

			<MInput
				label="Check :"
				type="password"
				name="new_password_check"
				required={updatePassword}
			/>
		</div>
	{/if}

	<button class="btn btn-success">
		Modifier
	</button>
	{#if form?.message}
		<div class={`callout-${form.type}`}>
			{form.message}
		</div>
	{/if}
</form>