<script lang="ts">
	import type { AttemptsPlayers, GamePopulated, GamesTeams } from '$lib/types/types';
	import type { Attempt, Foul, Player } from '@prisma/client';
	import AttemptsForm from './AttemptsForm.svelte';
	import EventsLog from './EventsLog.svelte';
	import CreateGame from './CreateGame.svelte';

	export let gameDayId: number;
	export let activeGame: GamePopulated;
	export let players: Player[] = [];
	export let attempts: AttemptsPlayers = [];
	export let fouls: (Foul & { player: Player })[] = [];
	export let games: GamesTeams;
</script>

{#if !activeGame}
	<CreateGame {players} {games} />
	<form action="?/end" method="post">
		<div class="flex w-full justify-center">
			<input type="hidden" name="id" value={gameDayId} />
			<button formaction="?/end" class="btn btn-wide btn-warning m-4">End Gameday</button>
		</div>
	</form>
{:else}
	<AttemptsForm {activeGame} />
	<EventsLog {attempts} {fouls} />
	<form action="?/endGame" method="post">
		<div class="flex w-full justify-center">
			<button class="btn btn-wide btn-error btn-sm m-4">End Game</button>
		</div>
	</form>
{/if}
