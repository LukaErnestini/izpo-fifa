<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#each data.teams as team, i}
	<div style="background-color: {team.color};">
		<a class="bg-primary-content" href="teams/{team.id}"
			>Team {i + 1}: {team.name} (
			{#each team.players as player, j}
				{j ? ', ' : ''}
				{player.name}
			{/each}
			)</a
		>
	</div>
{/each}
