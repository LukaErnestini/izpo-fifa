<script lang="ts">
	import { hexToRGBA } from '$lib/util';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	// $: console.log(`${data.activeGame?.scoreTeamA}:${data.activeGame?.scoreTeamB}`);
	const maxScoreDiff = 5;
	let colorAhex: string,
		colorBhex: string,
		colorArgba: string,
		colorBrgba: string,
		scoreA: number,
		scoreB: number,
		scoreDifference: number;
	const percentage = tweened(0, {
		duration: 2000,
		easing: cubicOut
	});
	$: {
		colorAhex = data.activeGame?.teams[0].color ? data.activeGame?.teams[0].color : '';
		colorBhex = data.activeGame?.teams[1].color ? data.activeGame?.teams[1].color : '';
		colorArgba = colorAhex ? hexToRGBA(colorAhex, 0.6) : '';
		colorBrgba = colorBhex ? hexToRGBA(colorBhex, 0.6) : '';
		scoreA = data.activeGame?.scoreTeamA ? data.activeGame?.scoreTeamA : 0;
		scoreB = data.activeGame?.scoreTeamB ? data.activeGame?.scoreTeamB : 0;
		scoreDifference = Math.min(scoreA - scoreB);
		percentage.set((scoreDifference / maxScoreDiff) * 50);
	}
</script>

<div
	class="navbar bg-base-100"
	style="background: linear-gradient(to right, {colorArgba}, rgba(255,255,255,0) {50 +
		$percentage}%, {colorBrgba} 100%;"
>
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

	div.flex {
		transition: background 1s ease-in-out;
	}
</style>
