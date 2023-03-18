<script lang="ts">
	import type { Gameday } from '@prisma/client';
	import GameControl from '../../components/game/GameControl.svelte';
	import CreateGd from '../../components/gameday/CreateGD.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let gameday = form?.gameday || data.gameday;
	let activeGame = data.activeGame;
</script>

{#if gameday}
	<GameControl gameDayId={gameday.id} {activeGame} players={data.gameday?.players} />
{:else}
	<CreateGd players={data.players} />
{/if}
