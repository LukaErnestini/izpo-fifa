<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_PYTHON_API } from '$env/static/public';
	import Podium from '../players/Podium.svelte';
	import type { Player } from '@prisma/client';
	import Icon from '@iconify/svelte';

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
		const response = await fetch(PUBLIC_PYTHON_API + '/cardsPerGame?limit=3&color=yellow');
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

<div class="block max-w-min">
	<div class="text-2xl p-2">
		Most
		<span class="inline-block">
			<Icon icon="tabler:rectangle-vertical-filled" color="yellow" width="24" />
		</span>
		cards awarded per game played:
	</div>

	<Podium {players} {stats} />
</div>
