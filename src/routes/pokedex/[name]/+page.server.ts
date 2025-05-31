import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { PokemonDetail } from '$lib/types/pokemonDetail';


export const load: PageServerLoad = async (event) => {

	const name = event.params.name;

	if (!name) {
		redirect(302, '/pokedex');
	}

	const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name);

	const pokemonDetail: PokemonDetail = await res.json();

	for (const ability of pokemonDetail.abilities) {
		const res = await fetch(ability.ability.url);
		ability.ability.data = await res.json();
	}

	return {
		data: pokemonDetail
	};
};