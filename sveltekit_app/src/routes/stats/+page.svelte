<script lang="ts">
	import GoalsAttemptsByTime from '../../components/stats/GoalsAttemptsByTime.svelte';
	import Top3GoalsPerGame from '../../components/stats/Top3GoalsPerGame.svelte';
	import Top3RedPerGame from '../../components/stats/Top3RedPerGame.svelte';
	import Top3YellowPerGame from '../../components/stats/Top3YellowPerGame.svelte';
</script>

<main class="container flex flex-wrap gap-8 justify-center">
	<div class="max-w-xl">
		<GoalsAttemptsByTime />
	</div>
	<Top3RedPerGame />
	<Top3YellowPerGame />
	<Top3GoalsPerGame />
</main>
