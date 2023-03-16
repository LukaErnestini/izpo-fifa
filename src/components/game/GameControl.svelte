<script lang="ts">
	import type { Game } from '@prisma/client';

	export let games: Game[];
</script>

<p>there are {games.length} games in this gameday</p>
