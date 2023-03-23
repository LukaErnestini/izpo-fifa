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
		<div class="flex justify-between w-full relative">
			<a href="/settings/teams/{activeGame.teams[0].id}" class="normal-case text-xl"
				>{activeGame.teams[0].name}</a
			>
			<div>
				<span class="normal-case text-2xl">{activeGame.scoreTeamA}</span>
				<span class="normal-case text-2xl">:</span>
				<span class="normal-case text-2xl">{activeGame.scoreTeamB}</span>
			</div>
			<a href="/settings/teams/{activeGame.teams[1].id}" class="normal-case text-xl"
				>{activeGame.teams[1].name}</a
			>
		</div>
	{/if}
</div>

<slot><!-- optional fallback --></slot>

<style>
	p {
		display: inline;
	}
</style>
