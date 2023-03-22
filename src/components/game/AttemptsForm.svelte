<script lang="ts">
	import type { GamePopulated } from '$lib/types/types';
	import type { Player } from '@prisma/client';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { getTeammates } from './util';
	import SelectPlayersInput from './SelectPlayersInput.svelte';
	import TimeInput from './TimeInput.svelte';
	import ToggleInput from './ToggleInput.svelte';
	import CardsSection from './CardsSection.svelte';
	import HalfSoccerPitchInput from './HalfSoccerPitchInput.svelte';

	export let activeGame: GamePopulated;

	let gamePlayers: Player[] = [];
	let shooter: number | null;
	let assist: number | null;
	let goalie: number | null = null;
	let goal = false;
	let autogoal = false;
	let onTarget = false;
	let penalty = false;
	let loading = false;
	let x: number | null;
	let y: number | null;
	let distance: number | null;
	let time = 0;
	let shooterTeammates: Player[] = [];
	let goaliePlayers: Player[] = [];
	let expanded = false;

	if (activeGame) {
		gamePlayers = [...activeGame.teams[0].players, ...activeGame.teams[1].players];
	}

	$: shooterTeammates = getTeammates(
		activeGame?.teams[0].players,
		activeGame?.teams[1].players,
		shooter
	);

	$: goaliePlayers = getTeammates(
		activeGame?.teams[0].players,
		activeGame?.teams[1].players,
		shooter,
		true
	);

	$: if (goal) {
		onTarget = true;
	}

	const addEvent: SubmitFunction = (input) => {
		// Before form submits
		loading = true;

		return async ({ update, result }) => {
			// After form submits
			shooter = null;
			assist = null;
			goalie = null;
			penalty = false;
			onTarget = false;
			goal = false;
			autogoal = false;
			expanded = false;
			x = null;
			y = null;
			distance = null;
			await update({ reset: false });
			loading = false;
		};
	};
</script>

<form action="?/attempt" method="post" use:enhance={addEvent}>
	<div class="form-control m-4">
		<ToggleInput bind:checked={goal} label="Goal" name="goal" />
		<ToggleInput bind:checked={onTarget} label="On Target" name="onTarget" disabled={goal} />
		<TimeInput {time} />
		<!-- <label class="label cursor-pointer block">
			<span class="label-text">Distance</span>
			<div class="mr-4">
				<input
				name="distance"
				type="range"
					min="-4"
					max="31"
					value="-4"
					class="range range-xs"
					step="5"
					/>
			</div>
			<div class="w-full flex justify-between text-xs px-2">
				<span>null</span>
				<span>1m</span>
				<span>6m</span>
				<span>11m</span>
				<span>16m</span>
				<span>21m</span>
				<span>26m</span>
				<span>31m+</span>
			</div>
		</label> -->
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<SelectPlayersInput
			inputName="shooter"
			label="Shooter"
			players={gamePlayers}
			bind:selected={shooter}
		/>
		<SelectPlayersInput
			inputName="assisted"
			label="Assisted By"
			players={shooterTeammates}
			bind:selected={assist}
		/>
		<HalfSoccerPitchInput bind:x bind:y bind:distance />
		{#if expanded}
			<div transition:slide={{ duration: 300, easing: quintOut }}>
				<div class="divider" />
				<ToggleInput bind:checked={penalty} label="Penalty" name="penalty" />
				{#if penalty}
					<SelectPlayersInput
						inputName="goalie"
						label="Goalie"
						players={goaliePlayers}
						bind:selected={goalie}
					/>
				{/if}
				<ToggleInput bind:checked={autogoal} label="Auto Goal" name="autogoal" />
				<div class="divider" />
				<CardsSection />
			</div>
		{/if}
		<div class="flex w-full justify-center">
			<button type="button" class="btn btn-outline" on:click={() => (expanded = !expanded)}
				>{expanded ? 'HIDE' : 'EXPAND'}</button
			>
		</div>
		<input type="hidden" name="gameId" value={activeGame?.id} />
		<div class="flex w-full justify-center">
			<button class="btn btn-wide m-4" class:loading disabled={loading}>Submit Attempt</button>
		</div>
	</div>
</form>
