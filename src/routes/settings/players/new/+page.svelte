<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;

	// console.log('form: ', form);
</script>

<form method="post">
	{#if form?.exists}
		<div class="alert alert-error shadow-lg">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>"{form.name}" exists</span>
			</div>
		</div>
	{/if}
	<label>
		Name:
		<input class="input input-bordered w-full max-w-xs" type="text" name="name" id="name" />
	</label>
	<button type="submit" class="btn">ADD</button>
</form>
