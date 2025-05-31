<script lang="ts">
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageServerData } = $props();

	const typeColors: Record<string, { bg: string; text: string; border: string }> = {
		normal: { bg: 'bg-gray-400', text: 'text-gray-800', border: 'border-gray-400' },
		fire: { bg: 'bg-red-500', text: 'text-red-800', border: 'border-red-500' },
		water: { bg: 'bg-blue-500', text: 'text-blue-800', border: 'border-blue-500' },
		electric: { bg: 'bg-yellow-400', text: 'text-yellow-800', border: 'border-yellow-400' },
		grass: { bg: 'bg-green-500', text: 'text-green-800', border: 'border-green-500' },
		ice: { bg: 'bg-blue-300', text: 'text-blue-800', border: 'border-blue-300' },
		fighting: { bg: 'bg-red-700', text: 'text-red-800', border: 'border-red-700' },
		poison: { bg: 'bg-purple-500', text: 'text-purple-800', border: 'border-purple-500' },
		ground: { bg: 'bg-yellow-600', text: 'text-yellow-800', border: 'border-yellow-600' },
		flying: { bg: 'bg-indigo-400', text: 'text-indigo-800', border: 'border-indigo-400' },
		psychic: { bg: 'bg-pink-500', text: 'text-pink-800', border: 'border-pink-500' },
		bug: { bg: 'bg-green-400', text: 'text-green-800', border: 'border-green-400' },
		rock: { bg: 'bg-yellow-800', text: 'text-yellow-800', border: 'border-yellow-800' },
		ghost: { bg: 'bg-purple-700', text: 'text-purple-800', border: 'border-purple-700' },
		dragon: { bg: 'bg-indigo-700', text: 'text-indigo-800', border: 'border-indigo-700' },
		dark: { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800' },
		steel: { bg: 'bg-gray-500', text: 'text-gray-800', border: 'border-gray-500' },
		fairy: { bg: 'bg-pink-300', text: 'text-pink-800', border: 'border-pink-300' }
	};

	function getPrimaryType() {
		return data.data?.types?.[0]?.type?.name || 'normal';
	}

	function formatId(id: number) {
		return `#${id.toString().padStart(3, '0')}`;
	}

	function formatHeight(height: number) {
		return `${(height / 10).toFixed(1)} m`;
	}

	function formatWeight(weight: number) {
		return `${(weight / 10).toFixed(1)} kg`;
	}

	function getStatColor(value: number) {
		if (value >= 100) return 'bg-green-500';
		if (value >= 70) return 'bg-yellow-500';
		if (value >= 40) return 'bg-orange-500';
		return 'bg-red-500';
	}

	// Format stat names
	function formatStatName(name: string) {
		const statNames: Record<string, string> = {
			'hp': 'HP',
			'attack': 'Attack',
			'defense': 'Defense',
			'special-attack': 'Sp. Attack',
			'special-defense': 'Sp. Defense',
			'speed': 'Speed'
		};
		return statNames[name] || name;
	}

	function goBack() {
		goto('/pokedex');
	}

	// Sprite selection state
	let selectedSprite = $state('official-artwork');

	function getSelectedSprite() {
		const sprites = data.data?.sprites;
		if (!sprites) return null;

		switch (selectedSprite) {
			case 'official-artwork':
				return sprites.other?.['official-artwork']?.front_default;
			case 'front_default':
				return sprites.front_default;
			case 'front_shiny':
				return sprites.front_shiny;
			case 'back_default':
				return sprites.back_default;
			case 'back_shiny':
				return sprites.back_shiny;
			default:
				return sprites.other?.['official-artwork']?.front_default || sprites.front_default;
		}
	}
</script>

{#if data.data}
	<div class="min-h-screen">
		<div class="bg-white">
			<div class="container mx-auto p-2">
				<a
					href="/pokedex"
					class="flex items-center space-x-2 text-gray-600 hover:underline hover:text-gray-800 transition-colors duration-200"
				>
					Retour au Pokédex
				</a>
			</div>
		</div>

		<div class="container mx-auto px-4 py-8">
			<!-- Main Pokemon Card -->
			<div class="bg-white rounded shadow-xl overflow-hidden mb-8">
				<!-- Header Section -->
				<div class="relative {typeColors[getPrimaryType()].bg} p-8 text-white">
					<div class="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>

					<div class="relative flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
						<!-- Pokemon Image -->
						<div class="flex-shrink-0">
							<div class="relative">
								<div class="w-48 h-48 md:w-56 md:h-56 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
									<img
										src={getSelectedSprite()}
										alt={data.data.name}
										class="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-2xl"
									/>
								</div>
							</div>
						</div>

						<!-- Pokemon Info -->
						<div class="flex-grow text-center md:text-left">
							<div class="mb-4">
								<span class="text-white/80 text-lg font-medium">{formatId(data.data.id)}</span>
							</div>

							<h1 class="text-4xl md:text-5xl font-bold capitalize mb-6">{data.data.name}</h1>

							<!-- Types -->
							<div class="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
								{#each data.data.types as type (type.type.name)}
                  <span class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold capitalize border border-white/30">
                    {type.type.name}
                  </span>
								{/each}
							</div>

							<!-- Basic Info -->
							<div class="grid grid-cols-2 gap-6 max-w-xs mx-auto md:mx-0">
								<div class="text-center md:text-left">
									<div class="text-2xl font-bold">{formatHeight(data.data.height)}</div>
									<div class="text-white/80">Height</div>
								</div>
								<div class="text-center md:text-left">
									<div class="text-2xl font-bold">{formatWeight(data.data.weight)}</div>
									<div class="text-white/80">Weight</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Sprite Selection -->
				<div class="px-8 py-6 bg-gray-50 border-b">
					<h3 class="text-lg font-semibold text-gray-800 mb-4">Sprites</h3>
					<div class="flex flex-wrap gap-2">
						<button
							onclick={() => selectedSprite = 'official-artwork'}
							class="px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 {selectedSprite === 'official-artwork' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}"
						>
							Artwork
						</button>
						<button
							onclick={() => selectedSprite = 'front_default'}
							class="px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 {selectedSprite === 'front_default' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}"
						>
							Front
						</button>
						{#if data.data.sprites.front_shiny}
							<button
								onclick={() => selectedSprite = 'front_shiny'}
								class="px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 {selectedSprite === 'front_shiny' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}"
							>
								Shiny
							</button>
						{/if}
						{#if data.data.sprites.back_default}
							<button
								onclick={() => selectedSprite = 'back_default'}
								class="px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-200 {selectedSprite === 'back_default' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}"
							>
								Back
							</button>
						{/if}
					</div>
				</div>

				<!-- Content Grid -->
				<div class="grid md:grid-cols-2 gap-8 p-8">
					<!-- Stats Section -->
					<div>
						<h3 class="text-xl font-bold text-gray-800 mb-6">Base Stats</h3>
						<div class="space-y-4">
							{#each data.data.stats as stat (stat.stat.name)}
								<div class="flex items-center space-x-4">
									<div class="w-24 text-sm font-medium text-gray-600 text-right">
										{formatStatName(stat.stat.name)}
									</div>
									<div class="w-12 text-sm font-bold text-gray-800 text-center">
										{stat.base_stat}
									</div>
									<div class="flex-grow">
										<div class="w-full bg-gray-200 rounded-full h-3">
											<div
												class="h-3 rounded-full {getStatColor(stat.base_stat)} transition-all duration-500"
												style="width: {Math.min((stat.base_stat / 200) * 100, 100)}%"
											></div>
										</div>
									</div>
								</div>
							{/each}

							<!-- Total Stats -->
							<div class="pt-4 border-t border-gray-200">
								<div class="flex items-center space-x-4">
									<div class="w-24 text-sm font-bold text-gray-800 text-right">Total</div>
									<div class="w-12 text-sm font-bold text-indigo-600 text-center">
										{data.data.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
									</div>
									<div class="flex-grow"></div>
								</div>
							</div>
						</div>
					</div>

					<!-- Abilities & Info Section -->
					<div class="space-y-8">
						<!-- Abilities -->
						<div>
							<h3 class="text-xl font-bold text-gray-800 mb-4">Abilities</h3>
							<div class="space-y-3">
								{#each data.data.abilities as ability (ability.ability.name)}
									<div class="flex items-center space-x-3">
										<div class="w-3 h-3 {typeColors[getPrimaryType()].bg} rounded-full"></div>
										<span class="text-gray-700 capitalize font-medium">
                      {ability.ability.name.replace('-', ' ')}
                    </span>
										{#if ability.is_hidden}
                      <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                        Hidden
                      </span>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<!-- Experience & Level Info -->
						<div>
							<h3 class="text-xl font-bold text-gray-800 mb-4">Experience</h3>
							<div class="grid grid-cols-2 gap-4">
								<div class="bg-gray-50 rounded-lg p-4">
									<div class="text-sm text-gray-600 mb-1">Base Experience</div>
									<div class="text-xl font-bold text-gray-800">{data.data.base_experience || 'N/A'}</div>
								</div>
								{#if data.data.game_indices && data.data.game_indices.length > 0}
									<div class="bg-gray-50 rounded-lg p-4">
										<div class="text-sm text-gray-600 mb-1">Game Index</div>
										<div class="text-xl font-bold text-gray-800">{data.data.game_indices[0].game_index}</div>
									</div>
								{/if}
							</div>
						</div>

						<!-- Additional Info -->
						{#if data.data.forms && data.data.forms.length > 1}
							<div>
								<h3 class="text-xl font-bold text-gray-800 mb-4">Forms</h3>
								<div class="flex flex-wrap gap-2">
									{#each data.data.forms as form (form.name)}
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                      {form.name.replace('-', ' ')}
                    </span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Moves Section (showing first 12) -->
				{#if data.data.moves && data.data.moves.length > 0}
					<div class="px-8 pb-8">
						<h3 class="text-xl font-bold text-gray-800 mb-6">Some Moves</h3>
						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
							{#each data.data.moves.slice(0, 12) as move (move.move.name)}
								<div class="bg-gray-50 rounded-lg px-3 py-2 text-center">
                  <span class="text-sm font-medium text-gray-700 capitalize">
                    {move.move.name.replace('-', ' ')}
                  </span>
								</div>
							{/each}
						</div>
						{#if data.data.moves.length > 12}
							<div class="text-center mt-4">
                <span class="text-sm text-gray-500">
                  et {data.data.moves.length - 12} autres mouvements...
                </span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-gray-800 mb-4">Pokémon introuvable</h1>
			<button
				onclick={goBack}
				class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
			>
				Retour au Pokédex
			</button>
		</div>
	</div>
{/if}