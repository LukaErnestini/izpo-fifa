<script lang="ts">
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let gameday = form?.gameday || data.gameday;
	// $: if (!gameday) console.log('no gd');

	// async function createGD() {
	// 	const response = await fetch('api/gameday');
	// 	if (response.status !== 200) {
	// 		return;
	// 	}
	// 	gameday = await response.json();
	// 	console.log(gameday);
	// }
</script>

{#if !gameday}
	<form action="?/create" method="post">
		{#each data.players as player}
			<label class="label cursor-pointer max-w-xs">
				<span class="text-lg uppercase">{player.name}</span>
				<input type="checkbox" class="checkbox checkbox-lg" value={player.id} name="players[]" />
			</label>
		{/each}
		<button class="btn">CREATE GAMEDAY</button>
	</form>
{:else}
	<form action="?/end" method="post">
		<input type="hidden" name="id" value={gameday.id} />
		<button class="btn btn-warning">FINISH GAMEDAY</button>
	</form>
{/if}
