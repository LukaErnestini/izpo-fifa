<script lang="ts">
	export let label: string;
	export let name: string;
	export let checked: boolean;
</script>

<label class="label cursor-pointer">
	<span class="label-text">{label}</span>
	<input type="checkbox" class="toggle" {name} bind:checked />
</label>
