<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let name = data.team?.name;
</script>

<input
	type="text"
	placeholder="Set team name here"
	bind:value={name}
	class="input input-bordered w-full max-w-xs"
/>
