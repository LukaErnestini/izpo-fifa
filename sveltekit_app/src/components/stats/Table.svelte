<script lang="ts">
	import Grid from 'gridjs-svelte';

	export let data: any[];
	let columns: any[] = [];
	$: columns = data.length > 0 ? Object.keys(data[0]).map((key) => ({ id: key, name: key })) : [];
</script>

<Grid {data} {columns} sort={true} />
