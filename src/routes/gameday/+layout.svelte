<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	// $: console.log(`${data.activeGame?.scoreTeamA}:${data.activeGame?.scoreTeamB}`);
</script>

<div class="navbar bg-base-100">
	{#if !data.activeGame}
		<span class="normal-case text-xl">
			<p>Game Day</p>
		</span>
	{:else}
		<div class="flex justify-between w-full relative">
			<a href="/settings/teams/{data.activeGame.teams[0].id}" class="normal-case text-xl"
				>{data.activeGame.teams[0].name}</a
			>
			<div>
				<span class="normal-case text-2xl">{data.activeGame.scoreTeamA}</span>
				<span class="normal-case text-2xl">:</span>
				<span class="normal-case text-2xl">{data.activeGame.scoreTeamB}</span>
			</div>
			<a href="/settings/teams/{data.activeGame.teams[1].id}" class="normal-case text-xl"
				>{data.activeGame.teams[1].name}</a
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
