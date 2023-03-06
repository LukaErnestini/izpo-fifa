<script lang="ts">
	import '../app.css';
	let title = 'Some Title';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="navbar bg-base-300">
	<a href="/" class="btn btn-ghost normal-case text-xl">Home</a>
	<a href="/questions" class="btn btn-ghost normal-case text-xl">Charts</a>
	<a href="/players" class="btn btn-ghost normal-case text-xl">Players</a>
</div>

<slot />
