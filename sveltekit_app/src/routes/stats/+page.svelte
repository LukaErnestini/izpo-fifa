<script lang="ts">
	import Podium from '../../components/players/Podium.svelte';
	import GoalsAttemptsByTime from '../../components/stats/GoalsAttemptsByTime.svelte';
	import Top3RedPerGame from '../../components/stats/Top3RedPerGame.svelte';
	import type { PageData } from './$types';
</script>

<main class="container flex flex-wrap gap-4 justify-center">
	<div class="max-w-xl">
		<GoalsAttemptsByTime />
	</div>
	<Top3RedPerGame />
</main>
