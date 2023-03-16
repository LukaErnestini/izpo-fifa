<script lang="ts">
	import type { Gameday } from '@prisma/client';
	import GameControl from '../../components/game/GameControl.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let gameday: Gameday = form?.gameday || data.gameday;
	let games = data.games;
	let activeGame = data.activeGame;
</script>

{#if gameday}
	<GameControl {games} {activeGame} />
{/if}
