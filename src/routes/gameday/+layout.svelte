<script lang="ts">
	import type { ActionData, LayoutData } from './$types';
	import type { Gameday } from '@prisma/client';
	import Icon from '@iconify/svelte';

	export let data: LayoutData;
	export let form: ActionData;
	let games = data.gameday?.games;
	let activeGame = data.activeGame;
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<span class="btn btn-ghost normal-case text-xl">
			<p>Game Day</p>
			{#if activeGame}
				<p class="ml-2">-</p>
				<p class="ml-2">Game {games?.length}</p>
			{/if}
		</span>
	</div>
</div>

<slot><!-- optional fallback --></slot>

<style>
	p {
		display: inline;
	}
</style>
