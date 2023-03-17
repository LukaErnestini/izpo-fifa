<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	// console.log(data);
</script>

<a class="btn" href="players/new">NEW PLAYER</a>
{#each data.players as player}
	<div>
		<a href="/players/{player.id}">{player.name}</a>
	</div>
{/each}
