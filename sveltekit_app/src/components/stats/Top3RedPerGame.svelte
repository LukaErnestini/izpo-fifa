<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_PYTHON_API } from '$env/static/public';
	import Podium from '../players/Podium.svelte';
	import type { Player } from '@prisma/client';

	interface Data {
		count: number;
		gamesPlayed: number;
		id: number;
		imageUri: string;
		name: string;
		playerId: number;
		red_cards_per_game: number;
	}

	let players: Partial<Player>[];
	let stats: string[];

	async function fetchData() {
		const response = await fetch(PUBLIC_PYTHON_API + '/redCardsPerGame?limit=3');
		const data: Data[] = await response.json();
		players = data.map((e) => {
			return { name: e.name, imageUri: e.imageUri };
		});
		stats = data.map((e) => {
			return `${e.red_cards_per_game.toFixed(2)}`;
		});
	}

	onMount(async () => {
		await fetchData();
	});
</script>

<Podium {players} {stats} />
