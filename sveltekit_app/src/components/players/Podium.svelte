<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Player } from '@prisma/client';
	import PlayerAvatarSelect from '../game/PlayerAvatarSelect.svelte';

	export let players: Partial<Player>[] | undefined[] = [undefined, undefined, undefined];
	export let stats: string[];
</script>

<div class="flex items-end">
	<div>
		{#if players[1]}
			<div class="flex justify-center stat-value mb-4">
				{stats[1]}
			</div>
			<div class="flex justify-center pb-2">
				<PlayerAvatarSelect width="5rem" imageUri={players[1].imageUri} name={players[1].name} />
			</div>{/if}
		<div class="podium podium-second">
			<Icon icon="noto:2nd-place-medal" width="3rem" />
		</div>
	</div>
	<div>
		{#if players[0]}
			<div class="flex justify-center stat-value mb-4">
				{stats[0]}
			</div>
			<div class="flex justify-center pb-2">
				<PlayerAvatarSelect width="5rem" imageUri={players[0].imageUri} name={players[0].name} />
			</div>
		{/if}
		<div class="podium podium-first">
			<Icon icon="noto:1st-place-medal" width="3rem" />
		</div>
	</div>
	<div>
		{#if players[2]}
			<div class="flex justify-center stat-value mb-4">
				{stats[2]}
			</div>
			<div class="flex justify-center pb-2">
				<PlayerAvatarSelect width="5rem" imageUri={players[2].imageUri} name={players[2].name} />
			</div>
		{/if}
		<div class="podium podium-third">
			<Icon icon="noto:3rd-place-medal" width="3rem" />
		</div>
	</div>
</div>

<style>
	/* * {
		border-style: dashed;
		border-width: 2px;
		border-color: red;
	} */
	.podium {
		width: 150px;
		border-style: solid;
		border-color: #ccc;
		border-width: 8px;
		background-color: #ccc;
		display: flex;
		justify-content: center;
	}
	.podium-second {
		height: 120px;
	}
	.podium-first {
		height: 180px;
	}
	.podium-third {
		height: 90px;
	}
</style>
