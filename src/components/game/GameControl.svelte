<script lang="ts">
	import type { Game, Player } from '@prisma/client';
	import AttemptsForm from './AttemptsForm.svelte';
	import CreateGame from './CreateGame.svelte';

	export let games: Game[];
	export let activeGame: any;
	export let players: Player[];
</script>

{#if !activeGame}
	<CreateGame {players} />
{:else}
	<AttemptsForm {players} {activeGame} />
{/if}
