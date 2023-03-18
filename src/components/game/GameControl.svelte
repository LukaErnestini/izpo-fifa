<script lang="ts">
	import type { GamePopulated } from '$lib/types/types';
	import type { Game, Player, Team } from '@prisma/client';
	import AttemptsForm from './AttemptsForm.svelte';
	import CreateGame from './CreateGame.svelte';

	export let gameDayId: number;
	export let activeGame: GamePopulated;
	export let players: Player[] = [];
</script>

{#if !activeGame}
	<CreateGame {players} />
	<form action="?/end" method="post">
		<div class="flex w-full justify-center">
			<input type="hidden" name="id" value={gameDayId} />
			<button formaction="?/end" class="btn btn-wide btn-warning m-4">End Gameday</button>
		</div>
	</form>
{:else}
	<AttemptsForm {activeGame} />
{/if}
