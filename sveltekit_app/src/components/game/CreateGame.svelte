<script lang="ts">
	import type { GamesTeams } from '$lib/types/types';
	import type { Player } from '@prisma/client';

	export let players: Player[];
	export let games: GamesTeams;
	const team1 = players.map((player) => {
		return { ...player, selected: false, hidden: false };
	});
	const team2 = players.map((player) => {
		return { ...player, selected: false, hidden: false };
	});
</script>

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
		<button class="btn btn-wide m-4">Start Game</button>
	</div>
</form>
<div>
	{#if games}
		{#each games as game}
			<a href="/game/{game.id}" class="block">
				<span class={game.winnerId === game.teamA.id ? 'text-lg text-success' : ''}
					>{game.teamA.name}</span
				>
				<span>VS</span>
				<span class={game.winnerId === game.teamB.id ? 'text-lg text-success' : ''}
					>{game.teamB.name}</span
				>
			</a>
		{/each}
	{/if}
</div>
