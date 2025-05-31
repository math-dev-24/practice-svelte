<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { page } from '$app/state';

	let { children, data }: { children: any, data: LayoutData } = $props();

	function isCurrentPath(path: string): boolean {
		return page.url.pathname === path;
	}
</script>

<header class="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<a href="/" class="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
					Svelte Practice
				</a>
			</div>

			<!-- Navigation -->
			<nav class="hidden md:flex items-center space-x-1">
				<a
					href="/"
					class={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isCurrentPath('/')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
				>
					Accueil
				</a>

				<a
					href="/pokedex"
					class={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isCurrentPath('/pokedex')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
				>
					Pokédex
				</a>

				{#if data.user}
					<a
						href="/todos"
						class={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isCurrentPath('/todos')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
					>
						Tâches
						{#if data.todoCount > 0}
              <span class="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                {data.todoCount}
              </span>
						{/if}
					</a>

					<a
						href="/profil"
						class={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isCurrentPath('/profil')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
					>
						Profil
					</a>

					<!-- Separator -->
					<div class="w-px h-4 bg-gray-200 mx-2"></div>

					<!-- Logout -->
					<form method="post" action="/logout">
						<button
							class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
							type="submit"
						>
							Déconnexion
						</button>
					</form>
				{:else}
					<a
						href="/login"
						class={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isCurrentPath('/login')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
					>
						Connexion
					</a>

					<a
						href="/register"
						class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
					>
						Inscription
					</a>
				{/if}
			</nav>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
					aria-label="Menu"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 12h18M3 6h18M3 18h18"/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</header>

<main class="container mx-auto px-4 py-6">
	{@render children()}
</main>