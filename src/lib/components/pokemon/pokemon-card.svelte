<script lang="ts">

	import type { Pokemon } from '$lib/types/pokemonDetail';

	let { pokemon }: { pokemon: Pokemon } = $props();

	const typeColors: Record<string, string> = {
		normal: 'bg-gray-400',
		fire: 'bg-red-500',
		water: 'bg-blue-500',
		electric: 'bg-yellow-400',
		grass: 'bg-green-500',
		ice: 'bg-blue-300',
		fighting: 'bg-red-700',
		poison: 'bg-purple-500',
		ground: 'bg-yellow-600',
		flying: 'bg-indigo-400',
		psychic: 'bg-pink-500',
		bug: 'bg-green-400',
		rock: 'bg-yellow-800',
		ghost: 'bg-purple-700',
		dragon: 'bg-indigo-700',
		dark: 'bg-gray-800',
		steel: 'bg-gray-500',
		fairy: 'bg-pink-300'
	};

	function getPrimaryTypeColor(types: any[]) {
		return typeColors[types[0]?.type?.name] || 'bg-gray-400';
	}

	function formatId(id: number) {
		return `#${id.toString().padStart(3, '0')}`;
	}

</script>


<a
	href="/pokedex/{pokemon.name}"
	class="group block transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
>
	<div class="relative bg-white rounded-2xl shadow overflow-hidden border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
		<!-- Background gradient based on Pokemon type -->
		<div class="absolute inset-0 opacity-10 {getPrimaryTypeColor(pokemon.data?.types || [])}"></div>

		<!-- Pokemon ID -->
		<div class="absolute top-4 right-4 text-xs font-bold text-gray-500 bg-white/80 px-2 py-1 rounded-full">
			{formatId(pokemon.data?.id || 0)}
		</div>

		<!-- Pokemon Image -->
		<div class="relative pt-8 pb-4 flex justify-center">
			<div class="w-24 h-24 flex items-center justify-center">
				{#if pokemon.data?.sprites?.other?.['official-artwork']?.front_default}
					<img
						src={pokemon.data.sprites.other['official-artwork'].front_default}
						alt={pokemon.name}
						class="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
						loading="lazy"
					/>
				{:else if pokemon.data?.sprites?.front_default}
					<img
						src={pokemon.data.sprites.front_default}
						alt={pokemon.name}
						class="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
						loading="lazy"
					/>
				{:else}
					<div class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
						<span class="text-gray-400 text-xs">No Image</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Pokemon Info -->
		<div class="px-6 pb-6">
			<!-- Name -->
			<h3 class="text-lg font-bold text-gray-800 capitalize mb-3 text-center">
				{pokemon.name}
			</h3>

			<!-- Types -->
			<div class="flex justify-center space-x-2 mb-4">
				{#each pokemon.data?.types || [] as type (type.type.name)}
                  <span class="px-3 py-1 text-xs font-semibold text-white rounded-full capitalize {typeColors[type.type.name] || 'bg-gray-400'}">
                    {type.type.name}
                  </span>
				{/each}
			</div>

			<!-- Stats Preview -->
			{#if pokemon.data?.stats}
				<div class="space-y-2">
					{#each pokemon.data.stats.slice(0, 3) as stat (stat.stat.name)}
						<div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 capitalize font-medium">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
							<div class="flex items-center space-x-2">
								<div class="w-16 bg-gray-200 rounded-full h-1.5">
									<div
										class="h-1.5 rounded-full {getPrimaryTypeColor(pokemon.data?.types || [])}"
										style="width: {Math.min((stat.base_stat / 150) * 100, 100)}%"
									></div>
								</div>
								<span class="text-gray-700 font-semibold w-8 text-right">{stat.base_stat}</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Height & Weight -->
			{#if pokemon.data?.height && pokemon.data?.weight}
				<div class="flex justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
					<div class="text-center">
						<div class="font-semibold text-gray-800">{(pokemon.data.height / 10).toFixed(1)}m</div>
						<div>Height</div>
					</div>
					<div class="text-center">
						<div class="font-semibold text-gray-800">{(pokemon.data.weight / 10).toFixed(1)}kg</div>
						<div>Weight</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Hover effect overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
	</div>
</a>