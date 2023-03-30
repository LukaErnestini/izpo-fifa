<script lang="ts">
	import type { Team } from '@prisma/client';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { hexToRGBA } from '$lib/util';

	export let gameIsActive: boolean;
	export let teamA: Team | undefined;
	export let teamB: Team | undefined;
	export let scoreTeamA: number | undefined;
	export let scoreTeamB: number | undefined;
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
		colorAhex = teamA?.color ? teamA.color : '';
		colorBhex = teamB?.color ? teamB.color : '';
		colorArgba = colorAhex ? hexToRGBA(colorAhex, 0.6) : '';
		colorBrgba = colorBhex ? hexToRGBA(colorBhex, 0.6) : '';
		scoreA = scoreTeamA ? scoreTeamA : 0;
		scoreB = scoreTeamB ? scoreTeamB : 0;
		scoreDifference = Math.min(scoreA - scoreB);
		percentage.set((scoreDifference / maxScoreDiff) * 50);
	}
</script>

<div
	class="navbar bg-base-100"
	style="background: linear-gradient(to right, {colorArgba}, rgba(255,255,255,0) {50 +
		$percentage}%, {colorBrgba} 100%;"
>
	{#if !gameIsActive}
		<span class="normal-case text-xl">
			<p>Game Day</p>
		</span>
	{:else}
		<div class="flex justify-between w-full relative">
			<a href="/settings/teams/{teamA?.id}" class="normal-case text-xl">{teamA?.name}</a>
			<div>
				<span class="normal-case text-2xl">{scoreTeamA}</span>
				<span class="normal-case text-2xl">:</span>
				<span class="normal-case text-2xl">{scoreTeamB}</span>
			</div>
			<a href="/settings/teams/{teamB?.id}" class="normal-case text-xl">{teamB?.name}</a>
		</div>
	{/if}
</div>

<style>
	p {
		display: inline;
	}

	div.flex {
		transition: background 1s ease-in-out;
	}
</style>
