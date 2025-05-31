export type Pokemon = {
	name: string;
	url: string;
	data?: PokemonDetail;
}

export type PokemonDetail = {
	id: number;
	order: number;
	name: string;
	height: number;
	weight: number;
	base_experience: number | null;
	is_default: boolean;
	location_area_encounters: string;

	// Abilities
	abilities: Ability[];

	// Sprites (images)
	sprites: Sprites;

	// Cries (sounds)
	cries: {
		latest: string;
		legacy: string;
	};

	// Game information
	game_indices: GameIndice[];

	// Types
	types: Type[];

	// Stats
	stats: Stats[];

	// Forms
	forms: Form[];

	// Items held by this Pokemon
	held_items: HeldItem[];

	// Moves
	moves: Move[];

	// Species reference
	species: {
		name: string;
		url: string;
	};

	// Past abilities (for different generations)
	past_abilities: PastAbility[];

	// Past types (for different generations)
	past_types: PastType[];
}

export type Ability = {
	ability: {
		name: string;
		url: string;
		data?: object;
	};
	is_hidden: boolean;
	slot: number;
}

export type Sprites = {
	back_default: string | null;
	back_female: string | null;
	back_shiny: string | null;
	back_shiny_female: string | null;
	front_default: string | null;
	front_female: string | null;
	front_shiny: string | null;
	front_shiny_female: string | null;

	other: {
		dream_world?: {
			front_default: string | null;
			front_female: string | null;
		};
		home?: {
			front_default: string | null;
			front_female: string | null;
			front_shiny: string | null;
			front_shiny_female: string | null;
		};
		'official-artwork'?: {
			front_default: string | null;
			front_shiny: string | null;
		};
		showdown?: {
			back_default: string | null;
			back_female: string | null;
			back_shiny: string | null;
			back_shiny_female: string | null;
			front_default: string | null;
			front_female: string | null;
			front_shiny: string | null;
			front_shiny_female: string | null;
		};
	};

	versions: {
		[generationKey: string]: {
			[gameKey: string]: {
				animated?: {
					back_default?: string | null;
					back_female?: string | null;
					back_shiny?: string | null;
					back_shiny_female?: string | null;
					front_default?: string | null;
					front_female?: string | null;
					front_shiny?: string | null;
					front_shiny_female?: string | null;
				};
				back_default?: string | null;
				back_female?: string | null;
				back_shiny?: string | null;
				back_shiny_female?: string | null;
				front_default?: string | null;
				front_female?: string | null;
				front_shiny?: string | null;
				front_shiny_female?: string | null;
				back_gray?: string | null;
				front_gray?: string | null;
				back_transparent?: string | null;
				front_transparent?: string | null;
				back_shiny_transparent?: string | null;
				front_shiny_transparent?: string | null;
			};
		};
	};
}

export type GameIndice = {
	game_index: number;
	version: {
		name: string;
		url: string;
	};
}

export type Type = {
	slot: number;
	type: {
		name: string;
		url: string;
	};
}

export type Stats = {
	base_stat: number;
	effort: number;
	stat: {
		name: string;
		url: string;
	};
}

export type Form = {
	name: string;
	url: string;
}

export type HeldItem = {
	item: {
		name: string;
		url: string;
	};
	version_details: {
		rarity: number;
		version: {
			name: string;
			url: string;
		};
	}[];
}

export type Move = {
	move: {
		name: string;
		url: string;
	};
	version_group_details: {
		level_learned_at: number;
		move_learn_method: {
			name: string;
			url: string;
		};
		order: number | null;
		version_group: {
			name: string;
			url: string;
		};
	}[];
}

export type PastAbility = {
	abilities: {
		ability: {
			name: string;
			url: string;
		} | null;
		is_hidden: boolean;
		slot: number;
	}[];
	generation: {
		name: string;
		url: string;
	};
}

export type PastType = {
	types: Type[];
	generation: {
		name: string;
		url: string;
	};
}