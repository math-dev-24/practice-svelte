<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import MInput from '$lib/components/base/MInput.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="min-h-[80vh] flex items-center justify-center py-12">
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="text-center mb-8">
			<div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-white">
					<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M21 12H9"/>
				</svg>
			</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
			<p class="text-gray-600">Connectez-vous à votre compte</p>
		</div>

		<!-- Form -->
		<div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
			<form
				method="post"
				action="?/login"
				use:enhance
				class="space-y-5"
			>
				<MInput
					label="Nom d'utilisateur"
					type="text"
					name="username"
					autofocus={true}
					required={true}
				/>

				<MInput
					label="Mot de passe"
					type="password"
					name="password"
					required={true}
				/>

				<!-- Message d'erreur/succès -->
				{#if form?.message}
					<div class={`flex items-start gap-3 p-4 rounded-lg ${
            form.type === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-green-50 border border-green-200'
          }`}>
						{#if form.type === 'error'}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500 mt-0.5 flex-shrink-0">
								<circle cx="12" cy="12" r="10"/>
								<path d="M15 9l-6 6M9 9l6 6"/>
							</svg>
						{:else}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500 mt-0.5 flex-shrink-0">
								<path d="M9 11l3 3 8-8"/>
								<path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.5 0 4.77 1.02 6.41 2.67"/>
							</svg>
						{/if}
						<span class={`text-sm ${form.type === 'error' ? 'text-red-700' : 'text-green-700'}`}>
              {form.message}
            </span>
					</div>
				{/if}

				<!-- Actions -->
				<div class="space-y-3 pt-2">
					<button
						type="submit"
						class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
					>
						Se connecter
					</button>

					<button
						type="submit"
						formaction="?/register"
						class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
					>
						Créer un compte
					</button>
				</div>
			</form>
		</div>

		<!-- Footer -->
		<div class="text-center mt-6">
			<p class="text-sm text-gray-500">
				En vous connectant, vous acceptez nos
				<a href="/terms" class="text-blue-600 hover:text-blue-700 hover:underline">conditions d'utilisation</a>
			</p>
		</div>
	</div>
</div>