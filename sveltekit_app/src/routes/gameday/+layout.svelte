<script lang="ts">
	import { hexToRGBA } from '$lib/util';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	// $: console.log(`${data.activeGame?.scoreTeamA}:${data.activeGame?.scoreTeamB}`);
	let colorAhex = data.activeGame?.teams[0].color;
	let colorBhex = data.activeGame?.teams[1].color;
	let colorArgba = colorAhex ? hexToRGBA(colorAhex, 0.6) : '';
	let colorBrgba = colorBhex ? hexToRGBA(colorBhex, 0.6) : '';
</script>

<div class="navbar bg-base-100">
	{#if !data.activeGame}
		<span class="normal-case text-xl">
			<p>Game Day</p>
		</span>
	{:else}
		<div
			class="flex justify-between w-full relative"
			style="background: linear-gradient(to right, {colorArgba}, rgba(255,255,255,1), {colorBrgba});"
		>
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
