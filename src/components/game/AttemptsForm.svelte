<script lang="ts">
	import { enhance } from '$app/forms';
	import type { GamePopulated } from '$lib/types/types';
	import type { Player } from '@prisma/client';
	import PlayerAvatarSelect from './PlayerAvatarSelect.svelte';

	export let activeGame: GamePopulated;
	export let time: number | null | undefined;
	let gamePlayers: Player[] = [];
	let shooter: number | null;
	let assist: number | null;
	let goalie: number | null = null;
	let goal: boolean;
	if (activeGame) {
		gamePlayers = [...activeGame.teams[0].players, ...activeGame.teams[1].players];
	}
	function changeTime(n: number) {
		if (time) time += n;
		else time = n;
		if (time < 0) time = 0;
		else if (time > 130) time = 130;
	}
	function resetForm() {
		shooter = null;
		assist = null;
		goalie = null;
	}
	function toggleAssisted(id: number) {
		if (id === assist) assist = null;
	}
</script>

<form action="?/attempt" method="post" use:enhance on:submit={resetForm}>
	<div class="form-control m-4">
		<label class="label cursor-pointer">
			<span class="label-text">Goal</span>
			<input type="checkbox" class="toggle" name="goal" bind:checked={goal} />
		</label>
		<label class="label cursor-pointer">
			<span class="label-text">On Target</span>
			<input type="checkbox" class="toggle" name="onTarget" checked={goal} />
		</label>
		<label class="label cursor-pointer">
			<span class="label-text">Penalty</span>
			<input type="checkbox" class="toggle" name="penalty" />
		</label>
		<label class="label cursor-pointer">
			<span class="label-text">Time</span>
			<div>
				<button type="button" class="btn btn-xs" on:click={() => changeTime(-5)}>-5</button>
				<button type="button" class="btn btn-xs" on:click={() => changeTime(-1)}>-1</button>
				<input
					type="number"
					bind:value={time}
					name="time"
					class="input input-bordered input-sm w-24"
					max="130"
					min="0"
				/>
				<button type="button" class="btn btn-xs" on:click={() => changeTime(1)}>+1</button>
				<button type="button" class="btn btn-xs" on:click={() => changeTime(5)}>+5</button>
			</div>
		</label>
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
		<label class="label">
			<span class="label-text">Shooter</span>
			<span class="flex">
				{#each gamePlayers as { name, imageUri, id }}
					<label class="cursor-pointer">
						<PlayerAvatarSelect {imageUri} {name} selected={id === shooter ? true : false} />
						<input type="radio" name="shooter" bind:group={shooter} value={id} hidden />
					</label>
				{/each}
			</span>
		</label>
		<label class="label">
			<span class="label-text">Assisted By</span>
			<span class="flex">
				{#each gamePlayers as { name, imageUri, id }}
					<label class="cursor-pointer">
						<PlayerAvatarSelect {imageUri} {name} selected={id === assist ? true : false} />
						<input
							type="radio"
							name="assisted"
							bind:group={assist}
							value={id}
							hidden
							on:click={() => toggleAssisted(id)}
						/>
					</label>
				{/each}
			</span>
		</label>
		<label class="label">
			<span class="label-text">Goalie</span>
			<span class="flex">
				<label class="cursor-pointer">
					<PlayerAvatarSelect name="AI" selected={null === goalie ? true : false} />
					<input type="radio" name="goalie" bind:group={goalie} value={null} hidden />
				</label>
				{#each gamePlayers as { name, imageUri, id }}
					<label class="cursor-pointer">
						<PlayerAvatarSelect {imageUri} {name} selected={id === goalie ? true : false} />
						<input type="radio" name="goalie" bind:group={goalie} value={id} hidden />
					</label>
				{/each}
			</span>
		</label>
		<input type="hidden" name="gameId" value={activeGame?.id} />
		<div class="flex w-full justify-center">
			<button class="btn btn-wide m-4">Submit Attempt</button>
		</div>
	</div>
</form>
<form action="?/endGame" method="post">
	<div class="flex w-full justify-center">
		<button class="btn btn-error btn-sm m-4">End Game</button>
	</div>
</form>
