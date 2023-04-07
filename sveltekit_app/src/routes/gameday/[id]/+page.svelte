<script lang="ts">
	import { PUBLIC_PYTHON_API } from '$env/static/public';
	import { onMount } from 'svelte';
	import Table from '../../../components/stats/Table.svelte';

	export let data;

	let games = data.gameday?.games;

	interface Data {
		players: any[];
		teams: any[];
		shots: any[];
	}
	let teamsData: any[] = [];
	let playersData: any[] = [];
	let shotsData: any[] = [];
	async function fetchTables() {
		const response = await fetch(
			`${PUBLIC_PYTHON_API}/overallTables?gameday_id=${data.gameday?.id}`
		);
		const { teams, players, shots }: Data = await response.json();
		teamsData = teams;
		playersData = players;
		shotsData = shots;
	}
	onMount(async () => {
		fetchTables();
	});
</script>

<div>
	{#if games}
		{#each games as game}
			<a href="/game/{game.id}" class="block">
				<span class={game.winnerId === game.teamA.id ? 'text-lg text-success' : ''}
					>{game.teamA.name}</span
				>
				<span>VS</span>
				<span class={game.winnerId === game.teamB.id ? 'text-lg text-success' : ''}
					>{game.teamB.name}</span
				>
			</a>
		{/each}
	{/if}
</div>

<div class="min-w-full p-2">
	<Table data={teamsData} />
</div>
<div class="min-w-full p-2">
	<Table data={playersData} />
</div>
<div class="min-w-full p-2">
	<Table data={shotsData} />
</div>
