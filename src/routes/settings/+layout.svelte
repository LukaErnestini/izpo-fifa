<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="navbar bg-base-100">
	<a href="/settings/players" class="btn btn-ghost normal-case text-xl">Players</a>
	<a href="/settings/teams" class="btn btn-ghost normal-case text-xl">Teams</a>
</div>

<slot />
