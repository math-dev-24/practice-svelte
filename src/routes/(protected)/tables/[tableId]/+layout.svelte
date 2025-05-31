<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';


	const { children, data }: { children: any, data: PageData } = $props();

	const isCurrentPath = (path: string): string => {
		if (page.url.pathname === path) {
			return "border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm";
		} else {
			return "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm";
		}
	}

</script>

<svelte:head>
	<title>{data.table.name}</title>
</svelte:head>

<div class="container mx-auto px-4 py-2">
	<!-- Breadcrumb -->
	<nav class="flex mb-6" aria-label="Breadcrumb">
		<ol class="flex items-center space-x-4">
			<li>
				<a href="/tables" class="text-gray-400 hover:text-gray-500">Tables</a>
			</li>
			<li>
				<svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
				</svg>
			</li>
			<li class="text-gray-500">{data.table.name}</li>
		</ol>
	</nav>

	<!-- Header avec actions -->
	<div class="flex justify-between items-start mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">{data.table.name}</h1>
			{#if data.table.description}
				<p class="text-gray-600 mt-2">{data.table.description}</p>
			{/if}
		</div>
	</div>

	<!-- Navigation tabs -->
	<div class="border-b border-gray-200 mb-8">
		<nav class="-mb-px flex space-x-8">
			<a
				href="/tables/{data.table.id}"
				class={isCurrentPath('/tables/' + data.table.id)}
			>
				Données
			</a>
			<a
				href="/tables/{data.table.id}/columns"
				class={isCurrentPath('/tables/' + data.table.id + '/columns')}
			>
				Colonnes
			</a>
			<a
				href="/tables/{data.table.id}/settings"
				class={isCurrentPath('/tables/' + data.table.id + '/settings')}
			>
				Paramètres
			</a>
		</nav>
	</div>

	<!-- Contenu principal -->
	<div>
		{@render children()}
	</div>
</div>