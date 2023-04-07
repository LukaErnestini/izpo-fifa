<script lang="ts">
	import type { AttemptsPlayers, GamePopulated, GamesTeams } from '$lib/types/types';
	import type { Attempt, Foul, Player } from '@prisma/client';
	import AttemptsForm from './AttemptsForm.svelte';
	import EventsLog from './EventsLog.svelte';
	import CreateGame from './CreateGame.svelte';
	import { PUBLIC_PYTHON_API } from '$env/static/public';
	import Table from '../stats/Table.svelte';
	import { onMount } from 'svelte';

	export let gameDayId: number;
	export let activeGame: GamePopulated;
	export let players: Player[] = [];
	export let attempts: AttemptsPlayers = [];
	export let fouls: (Foul & { player: Player })[] = [];
	export let games: GamesTeams;

	let latestTime = 0;

	$: if (attempts && attempts.length) {
		latestTime = attempts[0].time;
	} else {
		latestTime = 0;
	}

	interface Data {
		players: any[];
		teams: any[];
		shots: any[];
	}
	let teamsData: any[] = [];
	let playersData: any[] = [];
	let shotsData: any[] = [];
	async function fetchTables() {
		const response = await fetch(`${PUBLIC_PYTHON_API}/overallTables?gameday_id=${gameDayId}`);
		const { teams, players, shots }: Data = await response.json();
		teamsData = teams;
		playersData = players;
		shotsData = shots;
	}
	onMount(async () => {
		fetchTables();
	});
</script>

{#if !activeGame}
	<CreateGame {players} {games} />
	<div class="min-w-full p-2">
		<Table data={teamsData} />
	</div>
	<div class="min-w-full p-2">
		<Table data={playersData} />
	</div>
	<div class="min-w-full p-2">
		<Table data={shotsData} />
	</div>
	<form action="?/end" method="post">
		<div class="flex w-full justify-center">
			<input type="hidden" name="id" value={gameDayId} />
			<button formaction="?/end" class="btn btn-wide btn-warning m-4">End Gameday</button>
		</div>
	</form>
{:else}
	<AttemptsForm {activeGame} {latestTime} />
	<EventsLog {attempts} {fouls} />
	<form action="?/endGame" method="post">
		<div class="flex w-full justify-center">
			<button class="btn btn-wide btn-error btn-sm m-4">End Game</button>
		</div>
	</form>
{/if}
