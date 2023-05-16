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
	export let latestTime: number;

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
	let time = 1;
	let shooterTeammates: Player[] = [];
	let goaliePlayers: Player[] = [];
	let expanded = false;
	$: time = latestTime;

	if (activeGame) {
		gamePlayers = [...activeGame.teamA.players, ...activeGame.teamB.players];
	}

	$: shooterTeammates = getTeammates(activeGame?.teamA.players, activeGame?.teamB.players, shooter);

	$: goaliePlayers = getTeammates(
		activeGame?.teamA.players,
		activeGame?.teamB.players,
		shooter,
		true
	);

	$: if (goal) {
		onTarget = true;
	}

	$: if (autogoal) {
		goal = true;
	}

	$: if (shooter) {
		assist = null;
	}

	const addEvent: SubmitFunction = (input) => {
		// Before form submits
		loading = true;

		return async ({ update, result, form }) => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			if (result.type === 'failure') {
				loading = false;
				return await update();
			}
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
	<div class="form-control m-4 gap-6">
		<TimeInput {time} />
		<SelectPlayersInput inputName="shooter" players={gamePlayers} bind:selected={shooter} />
		<SelectPlayersInput inputName="assisted" players={shooterTeammates} bind:selected={assist} />
		<HalfSoccerPitchInput bind:x bind:y bind:distance />
		<ToggleInput bind:checked={goal} label="Goal" name="goal" />
		<ToggleInput bind:checked={onTarget} label="On Target" name="onTarget" disabled={goal} />
		<div hidden={!expanded} transition:slide={{ duration: 300, easing: quintOut }}>
			<div class="divider" />
			<ToggleInput bind:checked={penalty} label="Penalty" name="penalty" />
			{#if penalty}
				<SelectPlayersInput inputName="goalie" players={goaliePlayers} bind:selected={goalie} />
			{/if}
			<ToggleInput bind:checked={autogoal} label="Own Goal" name="autogoal" />
			<div class="divider" />
			<CardsSection />
		</div>
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
