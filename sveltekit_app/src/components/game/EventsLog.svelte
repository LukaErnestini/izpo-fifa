<script lang="ts">
	import { enhance } from '$app/forms';
	import type { AttemptsPlayers } from '$lib/types/types';
	import Icon from '@iconify/svelte';
	import type { Foul, Player } from '@prisma/client';

	export let attempts: AttemptsPlayers;
	export let fouls: (Foul & { player: Player })[];
</script>

{#if fouls.length}
	<div class="divider" />
	{#each fouls as foul}
		<div class="flex px-1">
			<span class="min-w-[2rem]">{foul.time}'</span>
			<span class="min-w-[2rem]">
				{#if foul.card === 'yellow'}
					<Icon icon="tabler:rectangle-vertical-filled" color="yellow" width="24" />
				{:else if foul.card === 'red'}
					<Icon icon="tabler:rectangle-vertical-filled" color="red" width="24" />
				{:else}
					no card
				{/if}
			</span>
			<span class="min-w-[4rem]">{foul.player.name}</span>
			<span class="min-w-[4rem]">
				<form action="?/removeFoul" method="post" use:enhance>
					<input type="hidden" name="foulId" value={foul.id} />
					<button>
						<Icon icon="system-uicons:cross-circle" class="text-error" width="24" />
					</button>
				</form>
			</span>
		</div>
	{/each}
	<div class="divider" />
{/if}

<div class="">
	<table class="table table-compact w-full">
		<thead>
			<tr>
				<th>T</th>
				<th>Goal</th>
				<th>OnT</th>
				<th>Pen</th>
				<th>Sho</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#if attempts}
				{#each attempts as a}
					<tr>
						<td>
							{a.time ? a.time + "'" : ''}
						</td>
						<td class={a.goal ? 'text-success' : ''}>
							{a.goal ? 'Yes' : 'No'}
						</td>
						<td>
							{a.onTarget ? 'Yes' : 'No'}
						</td>
						<td>
							{a.penalty ? 'Yes' : 'No'}
						</td>
						<td>
							{a.shooter.name}
						</td>
						<td>
							<form action="?/removeLog" method="post" use:enhance>
								<input type="hidden" name="id" value={a.id} />
								<button>
									<Icon icon="system-uicons:cross-circle" class="text-error" width="24" />
								</button>
							</form>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
