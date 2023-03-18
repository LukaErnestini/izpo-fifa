<script lang="ts">
	import type { GamePopulated } from '$lib/types/types';
	import type { Game, Player } from '@prisma/client';

	export let activeGame: GamePopulated;
	let gamePlayers: Player[] = [];
	if (activeGame) {
		gamePlayers = [...activeGame.teams[0].players, ...activeGame.teams[1].players];
	}
</script>

<form action="?/attempt" method="post">
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
			<input type="number" name="time" class="input input-bordered input-sm w-24" />
		</label>
		<label class="label cursor-pointer">
			<span class="label-text">Distance</span>
			<input type="number" name="distance" class="input input-bordered input-sm w-24" />
		</label>
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
				<option value="">Noone</option>
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
