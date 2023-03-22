<script lang="ts">
	import Icon from '@iconify/svelte';
	import GameControl from '../../components/game/GameControl.svelte';
	import CreateGd from '../../components/gameday/CreateGD.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let gameday = form?.gameday || data.gameday;
</script>

{#if form?.error}
	<div class="px-1">
		<div class="alert alert-error shadow-lg">
			<div>
				<Icon icon="material-symbols:error-outline-rounded" color="red" />
				<span>{form.error}</span>
			</div>
		</div>
	</div>
{/if}
{#if gameday}
	<GameControl
		fouls={data.activeGame?.fouls}
		attempts={data.activeGame?.attempts}
		gameDayId={gameday.id}
		activeGame={data.activeGame}
		players={data.gameday?.players}
	/>
{:else}
	<CreateGd players={data.players} />
{/if}
