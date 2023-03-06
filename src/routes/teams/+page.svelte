<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#each data.teams as team, i}
	<div><a href="/teams/{team.id}">Team {i}: {team.name}</a></div>
{/each}
