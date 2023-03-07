<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import ColorPicker from 'svelte-awesome-color-picker';

	export let data: PageData;
	export let form: ActionData;

	let name = form?.team.name || data.team?.name;
	let hex: string;
	let id = data.id;
	if (form?.team.color) {
		hex = form.team.color;
	} else if (data.team?.color) {
		hex = data.team.color;
	}
</script>

<form action="?/save" method="post">
	<input
		name="name"
		type="text"
		placeholder="Set team name here"
		bind:value={name}
		class="input input-bordered w-full max-w-xs"
	/>

	<ColorPicker bind:hex />

	<input type="hidden" name="color" value={hex} />
	<input type="hidden" name="id" value={id} />

	<button class="btn btn-outline" type="submit">SAVE</button>
</form>
