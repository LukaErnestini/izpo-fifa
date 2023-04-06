<script lang="ts">
	import GoalsAttemptsByTime from '../../components/stats/GoalsAttemptsByTime.svelte';
	import Table from '../../components/stats/Table.svelte';
	import Top3GoalsPerGame from '../../components/stats/Top3GoalsPerGame.svelte';
	import Top3RedPerGame from '../../components/stats/Top3RedPerGame.svelte';
	import Top3YellowPerGame from '../../components/stats/Top3YellowPerGame.svelte';

	export let data;
	let teams = data.teams;
	let players = data.players;
	let shots = data.shots;
</script>

<main class="container flex flex-wrap gap-8 justify-center p-4">
	<div class="max-w-xl">
		<GoalsAttemptsByTime />
	</div>
	<Top3RedPerGame />
	<Top3YellowPerGame />
	<Top3GoalsPerGame />
	<div class="min-w-full p-2">
		<Table data={teams} />
	</div>
	<div class="min-w-full p-2">
		<Table data={players} />
	</div>
	<div class="min-w-full p-2">
		<Table data={shots} />
	</div>
</main>
