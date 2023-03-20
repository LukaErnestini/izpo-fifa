<script lang="ts">
	import PlayerAvatarSelect from './PlayerAvatarSelect.svelte';
	import type { Player } from '@prisma/client';

	export let players: Player[];
	export let inputName: string;
	export let label: string;
	let selected: number | null;

	function toggle(id: number) {
		if (id === selected) selected = null;
	}
</script>

<label class="label">
	<span class="label-text">{label}</span>
	<span class="flex">
		{#each players as { name, imageUri, id }}
			<label class="cursor-pointer">
				<PlayerAvatarSelect {imageUri} {name} selected={id === selected ? true : false} />
				<input
					type="radio"
					name={inputName}
					bind:group={selected}
					value={id}
					hidden
					on:click={() => toggle(id)}
				/>
			</label>
		{/each}
	</span>
</label>
