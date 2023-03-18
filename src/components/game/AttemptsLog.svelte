<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import type { Attempt } from '@prisma/client';

	export let attempts: Attempt[];
</script>

<div class="">
	<table class="table table-compact w-full">
		<thead>
			<tr>
				<th>Time</th>
				<th>Goal</th>
				<th>On Target</th>
				<th>Penalty</th>
				<th>Distance</th>
				<th />
			</tr>
		</thead>
		<tbody>
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
						{a.distance ? a.distance : 'not set'}
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
		</tbody>
	</table>
</div>
