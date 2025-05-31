<script lang="ts">
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import PokemonCard from '$lib/components/pokemon/pokemon-card.svelte';

	let { data }: { data: PageServerData } = $props();

	function goToPage(pageNumber: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', pageNumber.toString());
		goto(url.toString());
	}

	function nextPage() {
		if (data.pagination.hasNext) {
			goToPage(data.pagination.currentPage + 1);
		}
	}

	function previousPage() {
		if (data.pagination.hasPrevious) {
			goToPage(data.pagination.currentPage - 1);
		}
	}

	// Générer les numéros de pages à afficher
	function getPageNumbers() {
		const current = data.pagination.currentPage;
		const total = data.pagination.totalPages;
		const pages: number[] = [];

		// Afficher 5 pages maximum autour de la page actuelle
		const start = Math.max(1, current - 2);
		const end = Math.min(total, current + 2);

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	}
</script>

<h1 class="text-2xl font-bold py-4 px-2">{data.pagination.total} | Pokédex</h1>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto my-8">
	{#each data.pokemons as pokemon (pokemon.name)}
		<PokemonCard {pokemon} />
	{/each}
</div>

<nav class="flex justify-center items-center space-x-2 my-8" aria-label="Pagination">
	<button
		onclick={previousPage}
		disabled={!data.pagination.hasPrevious}
		class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
	>
		Précédent
	</button>

	{#if getPageNumbers()[0] > 1}
		<button
			onclick={() => goToPage(1)}
			class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
		>
			1
		</button>
		{#if getPageNumbers()[0] > 2}
			<span class="px-3 py-2 text-sm font-medium text-gray-500">...</span>
		{/if}
	{/if}

	{#each getPageNumbers() as pageNum (pageNum)}
		<button
			onclick={() => goToPage(pageNum)}
			class="px-3 py-2 text-sm font-medium rounded-lg {pageNum === data.pagination.currentPage
        ? 'text-blue-600 bg-blue-50 border border-blue-300'
        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'}"
			aria-current={pageNum === data.pagination.currentPage ? 'page' : undefined}
		>
			{pageNum}
		</button>
	{/each}

	{#if getPageNumbers()[getPageNumbers().length - 1] < data.pagination.totalPages}
		{#if getPageNumbers()[getPageNumbers().length - 1] < data.pagination.totalPages - 1}
			<span class="px-3 py-2 text-sm font-medium text-gray-500">...</span>
		{/if}
		<button
			onclick={() => goToPage(data.pagination.totalPages)}
			class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
		>
			{data.pagination.totalPages}
		</button>
	{/if}

	<button
		onclick={nextPage}
		disabled={!data.pagination.hasNext}
		class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
	>
		Suivant
	</button>
</nav>

<div class="text-center text-sm text-gray-600 mb-8">
	Page {data.pagination.currentPage} sur {data.pagination.totalPages}
	({data.pagination.total} pokémons au total)
</div>