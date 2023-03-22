<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let activeGame = data.activeGame;

	$: activeGame = data.activeGame;
</script>

<div class="navbar bg-base-100">
	{#if !activeGame}
		<span class="normal-case text-xl">
			<p>Game Day</p>
		</span>
	{:else}
		<div class="flex justify-between w-full">
			<span class="normal-case text-xl">{activeGame.teams[0].name}</span>
			<div>
				<span class="normal-case text-xl">{activeGame.scoreTeamA}</span>
				<span class="normal-case text-xl">:</span>
				<span class="normal-case text-xl">{activeGame.scoreTeamB}</span>
			</div>
			<span class="normal-case text-xl">{activeGame.teams[1].name}</span>
		</div>
	{/if}
</div>

<slot><!-- optional fallback --></slot>

<style>
	p {
		display: inline;
	}
</style>
