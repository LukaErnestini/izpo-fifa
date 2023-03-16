<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const player = data.player;
</script>

<p>{player?.name}</p>

<form action="?/delete" method="post">
	<input type="hidden" name="id" value={player?.id} />
	<button class="btn btn-warning">DELETE</button>
</form>
