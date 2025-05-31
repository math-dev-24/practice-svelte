import type { PageServerLoad } from './$types';
import type { Pokemon } from '$lib/types/pokemonDetail';

export const load: PageServerLoad = async ({ url }) => {
	const limit: number = 24;
	const page: number = parseInt(url.searchParams.get('page') || '1');
	const offset: number = (page - 1) * limit;

	try {
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
		const data = await res.json();

		await Promise.all(data.results.map(async (pokemon: Pokemon) => {
			const res = await fetch(pokemon.url);
			pokemon.data = await res.json();
		}));

		return {
			pokemons: data.results,
			pagination: {
				currentPage: page,
				limit,
				offset,
				total: data.count,
				totalPages: Math.ceil(data.count / limit),
				hasNext: !!data.next,
				hasPrevious: !!data.previous
			}
		};
	} catch (error) {
		console.error('Erreur lors du chargement des pokémons:', error);
		return {
			pokemons: [],
			pagination: {
				currentPage: 1,
				limit,
				offset: 0,
				total: 0,
				totalPages: 0,
				hasNext: false,
				hasPrevious: false
			}
		};
	}
};