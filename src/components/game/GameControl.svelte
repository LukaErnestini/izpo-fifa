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
	<CreateGame {gameDayId} {players} />
{:else}
	<AttemptsForm {activeGame} />
{/if}
