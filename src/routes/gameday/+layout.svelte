<script lang="ts">
	import type { ActionData, LayoutData } from './$types';
	import type { Gameday } from '@prisma/client';
	import Icon from '@iconify/svelte';

	export let data: LayoutData;
	export let form: ActionData;
	let gameday: Gameday = form?.gameday || data.gameday;
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<p class="btn btn-ghost normal-case text-xl">Game Day</p>
	</div>
	<div class="flex-none">
		<div class="dropdown dropdown-end">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0">
				<Icon icon="material-symbols:menu" width="32" />
			</label>

			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul tabindex="0" class="dropdown-content menu shadow bg-base-100 rounded-box w-52">
				{#if !gameday}
					<li>
						<form action="?/create" method="post">
							<button class="font-semibold text-success">CREATE GAMEDAY</button>
						</form>
					</li>
				{:else}
					<li>
						<form action="?/end" method="post">
							<input type="hidden" name="id" value={gameday.id} />
							<button class="font-semibold text-error">FINISH GAMEDAY</button>
						</form>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</div>

<slot><!-- optional fallback --></slot>
