<script lang="ts">
	import type { Gameday } from '@prisma/client';
	import GameControl from '../../components/game/GameControl.svelte';
	import CreateGd from '../../components/gameday/CreateGD.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let gameday = form?.gameday || data.gameday;
</script>

{#if gameday}
	<GameControl
		time={form?.attempt?.time}
		attempts={data.activeGame?.attempts}
		gameDayId={gameday.id}
		activeGame={data.activeGame}
		players={data.gameday?.players}
	/>
{:else}
	<CreateGd players={data.players} />
{/if}
