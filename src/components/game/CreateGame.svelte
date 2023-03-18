<script lang="ts">
	import type { Player } from '@prisma/client';

	export let gameDayId: number;
	export let players: Player[];
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
	<div class="flex w-full justify-center">
		<input type="hidden" name="id" value={gameDayId} />
		<button formaction="?/end" class="btn btn-wide btn-warning m-4">End Gameday</button>
	</div>
</form>
