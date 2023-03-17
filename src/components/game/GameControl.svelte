<script lang="ts">
	import type { Game, Player } from '@prisma/client';

	export let games: Game[];
	export let activeGame: any;
	export let players: Player[];
	const team1 = players.map((player) => {
		return { ...player, selected: false, hidden: false };
	});
	const team2 = players.map((player) => {
		return { ...player, selected: false, hidden: false };
	});
	// console.log(activeGame);
	let gamePlayers: Player[] = [];
	if (activeGame) {
		gamePlayers = [...activeGame.teams[0].players, ...activeGame.teams[1].players];
	}
	console.log(gamePlayers);
</script>

{#if !activeGame}
	<form action="?/createGame" method="post">
		<div class="flex w-full">
			<div class="grid py-4 flex-grow card bg-base-300 rounded-box place-items-center">
				{#each players as player, i}
					<div class="form-control">
						<label class="label cursor-pointer">
							<span
								class="label-text {team1[i].selected ? 'text-accent' : ''} {team2[i].selected
									? 'line-through'
									: ''}">{player.name}</span
							>
							<input
								type="checkbox"
								class="checkbox"
								bind:checked={team1[i].selected}
								value={player.id}
								name="team1"
								hidden
								disabled={team2[i].selected}
							/>
						</label>
					</div>
				{/each}
			</div>
			<div class="divider divider-horizontal">VS</div>
			<div class="grid py-4 flex-grow card bg-base-300 rounded-box place-items-center">
				{#each players as player, i}
					<div class="form-control">
						<label class="label cursor-pointer">
							<span
								class="label-text 
								{team2[i].selected ? 'text-accent' : ''}
								{team1[i].selected ? 'line-through' : ''}"
								>{player.name}
							</span>
							<input
								type="checkbox"
								class="checkbox"
								bind:checked={team2[i].selected}
								value={player.id}
								name="team2"
								hidden
								disabled={team1[i].selected}
							/>
						</label>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex w-full justify-center">
			<button class="btn btn-wide m-4">Create</button>
		</div>
	</form>
{:else}
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
			<input type="hidden" name="gameId" value={activeGame.id} />
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
{/if}
