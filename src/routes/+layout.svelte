<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { afterUpdate, onMount } from 'svelte';
	// import { page } from '$app/stores';
	// let pathname = $page.url.pathname;
	// console.log($page.route);
	// export let data: PageData;
	afterUpdate(() => {
		pathname = window.location.pathname.split('/')[1];
	});
	let pathname: string;
</script>

<svelte:head>
	<title>{pathname}</title>
</svelte:head>

<slot />

<div class="btm-nav">
	<a href="/gameday" class:active={pathname === 'gameday'}>
		<Icon icon="mdi:soccer-field" width="32" />
	</a>
	<a href="/stats" class:active={pathname === 'stats'}>
		<Icon icon="material-symbols:bar-chart" width="32" />
	</a>
	<a href="/settings" class:active={pathname === 'settings'}>
		<Icon icon="mdi:cog" width="32" />
	</a>
</div>
