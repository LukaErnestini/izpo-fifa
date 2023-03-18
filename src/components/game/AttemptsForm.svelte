<script lang="ts">
	import { enhance } from '$app/forms';
	import type { GamePopulated } from '$lib/types/types';
	import type { Player } from '@prisma/client';

	export let activeGame: GamePopulated;
	export let time: number | null | undefined;
	let gamePlayers: Player[] = [];
	if (activeGame) {
		gamePlayers = [...activeGame.teams[0].players, ...activeGame.teams[1].players];
	}
	function changeTime(n: number) {
		if (time) time += n;
		else time = n;
		if (time < 0) time = 0;
		else if (time > 130) time = 130;
	}
</script>

<form action="?/attempt" method="post" use:enhance>
	<div class="form-control m-4">
		<label class="label cursor-pointer">
			<span class="label-text">Goal</span>
			<input type="checkbox" class="toggle" name="goal" />
		</label>
		<label class="label cursor-pointer">
			<span class="label-text">On Target</span>
			<input type="checkbox" class="toggle" name="onTarget" />
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
		<label class="label">
			<span class="label-text">Shooter</span>
			<select class="select" name="shooter">
				{#each gamePlayers as player}
					<option value={player.id}>{player.name}</option>
				{/each}
			</select>
		</label>
		<label class="label">
			<span class="label-text">Assisted By</span>
			<select class="select" name="assisted">
				<option value="">Noone</option>
				{#each gamePlayers as player}
					<option value={player.id}>{player.name}</option>
				{/each}
			</select>
		</label>
		<label class="label">
			<span class="label-text">Goalie</span>
			<select class="select">
				<option value="">AI</option>
				{#each gamePlayers as player}
					<option value={player.id}>{player.name}</option>
				{/each}
			</select>
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
