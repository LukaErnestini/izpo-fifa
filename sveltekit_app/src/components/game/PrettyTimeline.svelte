<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Attempt, Player, Team } from '@prisma/client';
	import PlayerAvatarSelect from './PlayerAvatarSelect.svelte';

	export let attempts: (Attempt & {
		shooter: Player;
		assisted: Player | null;
	})[];
	export let teams: (Team & {
		players: Player[];
	})[];

	// Determine to which team the attempt belongs
	let attemptsTeam = attempts.map((att) => {
		if (teams[0].players.find((p) => p.id === att.shooterId)) {
			return 0;
		} else {
			return 1;
		}
	});
</script>

{#each attempts as { time, goal, assisted, shooter }, i}
	<div>
		<span id="attempt" class="flex {attemptsTeam[i] ? 'flex-row-reverse' : ''}">
			<p class="text-sm">{time}'</p>
			{#if goal}
				<span> <Icon icon="game-icons:soccer-ball" /></span>
			{/if}

			<p>
				{shooter.name}
			</p>

			{#if assisted}
				<!-- <PlayerAvatarSelect name={assisted.name} imageUri={assisted.imageUri} width="2rem" /> -->
				<p class="text-sm">assisted by: {assisted.name}</p>
			{/if}
		</span>
	</div>
{/each}

<style>
	#attempt > * {
		padding-left: 4px;
		padding-right: 4px;
	}
</style>
