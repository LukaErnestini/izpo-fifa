<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import type { GamePopulated } from '$lib/types/types';
	import type { Player } from '@prisma/client';
	import SelectPlayersInput from './SelectPlayersInput.svelte';
	import TimeInput from './TimeInput.svelte';
	import ToggleInput from './ToggleInput.svelte';
	import { getTeammates } from './util';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';

	export let activeGame: GamePopulated;
	// export let time: number | null | undefined;
	let gamePlayers: Player[] = [];
	let shooter: number | null;
	let assist: number | null;
	let goalie: number | null = null;
	let goal = false;
	let penalty = false;
	let loading = false;
	let time = 0;
	let shooterTeammates: Player[] = [];
	let goaliePlayers: Player[] = [];
	let expanded = true;

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

	if (activeGame) {
		gamePlayers = [...activeGame.teams[0].players, ...activeGame.teams[1].players];
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
			goal = !goal; // Do this because if goal is false and onTarget toggled ON, onTarget will not switch.
			goal = false;
			await update({ reset: false });
			loading = false;
		};
	};
</script>

<form action="?/attempt" method="post" use:enhance={addEvent}>
	<div class="form-control m-4">
		<ToggleInput bind:checked={goal} label="Goal" name="goal" />
		<ToggleInput checked={goal} label="On Target" name="onTarget" />
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
				<div class="divider" />
				<div class="flex items-center justify-between h-16 px-1">
					<span class="label-text">Cards</span>
					<span class="flex">
						<button formaction="?/yellow">
							<Icon icon="tabler:rectangle-vertical-filled" color="yellow" width="48" />
						</button>
						<button formaction="?/red">
							<Icon icon="tabler:rectangle-vertical-filled" color="red" width="48" />
						</button>
					</span>
				</div>
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
<form action="?/endGame" method="post">
	<div class="flex w-full justify-center">
		<button class="btn btn-error btn-sm m-4">End Game</button>
	</div>
</form>
