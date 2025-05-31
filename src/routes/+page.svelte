<script lang="ts">
	import type { LayoutData } from './$types';

	let { data }: { data: LayoutData } = $props();
</script>

<div class="max-w-4xl mx-auto py-8">
	{#if data.user}
		<div class="mb-12">
			<h1 class="text-3xl font-bold text-gray-900 mb-3">
				Bonjour {data.user.username} ! 👋
			</h1>
			<p class="text-lg text-gray-600">
				Que souhaitez-vous faire aujourd'hui ?
			</p>
		</div>

		<!-- Navigation cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Todos Card -->
			<a
				href="/tables"
				class="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
			>
				<div class="flex items-start gap-4">
					<div class="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600">
							<path d="M9 11l3 3 8-8"/>
							<path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.5 0 4.77 1.02 6.41 2.67"/>
						</svg>
					</div>
					<div class="flex-1">
						<h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
							Mes tables
						</h3>
						<p class="text-gray-600 text-sm leading-relaxed">
							Gestion de mes tables de données
						</p>
					</div>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
						<path d="M9 18l6-6-6-6"/>
					</svg>
				</div>
			</a>

			<!-- Pokedex Card -->
			<a
				href="/pokedex"
				class="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all duration-200"
			>
				<div class="flex items-start gap-4">
					<div class="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-600">
							<circle cx="12" cy="12" r="10"/>
							<path d="M8 12h8"/>
							<path d="M12 8v8"/>
						</svg>
					</div>
					<div class="flex-1">
						<h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
							Pokédex
						</h3>
						<p class="text-gray-600 text-sm leading-relaxed">
							Explorez le monde des Pokémon et découvrez leurs caractéristiques
						</p>
					</div>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
						<path d="M9 18l6-6-6-6"/>
					</svg>
				</div>
			</a>
		</div>
	{:else}
		<div class="text-center py-16">
			<div class="mb-8">
				<div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-white">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
						<circle cx="12" cy="7" r="4"/>
					</svg>
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-4">
					Bienvenue ! 🚀
				</h1>
				<p class="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
					Connectez-vous pour accéder à vos tâches et explorer toutes les fonctionnalités
				</p>
			</div>

			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a
					href="/login"
					class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M21 12H9"/>
					</svg>
					Se connecter
				</a>

				<a
					href="/login"
					class="inline-flex items-center gap-2 px-6 py-3 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
						<circle cx="9" cy="7" r="4"/>
						<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
					</svg>
					Créer un compte
				</a>
			</div>
		</div>
	{/if}
</div>