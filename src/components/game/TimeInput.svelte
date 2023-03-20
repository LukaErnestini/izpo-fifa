<script lang="ts">
	export let time = 0;

	function changeTime(n: number) {
		if (time) time += n;
		else time = n;
		if (time < 0) time = 0;
		else if (time > 130) time = 130;
	}
</script>

<label class="label cursor-pointer">
	<span class="label-text">Time</span>
	<div>
		<button type="button" class="btn btn-xs" on:click={() => changeTime(-5)}>-5</button>
		<button type="button" class="btn btn-xs" on:click={() => changeTime(-1)}>-1</button>
		<input
			type="number"
			bind:value={time}
			name="time"
			class="input input-bordered input-sm w-24"
			max="130"
			min="0"
		/>
		<button type="button" class="btn btn-xs" on:click={() => changeTime(1)}>+1</button>
		<button type="button" class="btn btn-xs" on:click={() => changeTime(5)}>+5</button>
	</div>
</label>
