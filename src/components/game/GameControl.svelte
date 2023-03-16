<script lang="ts">
	import type { Game } from '@prisma/client';

	export let games: Game[];
	export let activeGame: Game;
</script>

<p>there are {games.length} games in this gameday</p>

{#if !activeGame}
	<form action="?/createGame" method="post">
		<button class="btn">Create</button>
	</form>
{:else}
	A game is active
{/if}
