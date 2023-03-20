<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { sineIn } from 'svelte/easing';

	export let time = 0;
	let buttonHeld = false;
	const interval = tweened(200, { duration: 2000, easing: sineIn });

	function changeTime(n: number) {
		if (time) time += n;
		else time = n;
		if (time < 0) time = 0;
		else if (time > 130) time = 130;
	}

	async function changeNum(n: number) {
		interval.set(200, { duration: 0 });
		interval.set(50);
		buttonHeld = true;
		while (buttonHeld) {
			time += n;
			if (time < 0) {
				time = 0;
				buttonHeld = false;
				break;
			} else if (time > 130) {
				time = 130;
				buttonHeld = false;
				break;
			}
			await new Promise((r) => setTimeout(r, $interval));
		}
	}

	// interval.set(50);
	$: console.log(buttonHeld);
</script>

<label class="label">
	<span class="label-text">Time</span>
	<div>
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<button
			type="button"
			class="btn btn-xs"
			on:mousedown={() => changeNum(-1)}
			on:mouseup={() => {
				buttonHeld = false;
			}}
			on:mouseout={() => {
				buttonHeld = false;
			}}>-</button
		>
		<input
			type="number"
			bind:value={time}
			name="time"
			class="input input-bordered input-sm w-24"
			max="130"
			min="0"
		/>
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<button
			type="button"
			class="btn btn-xs"
			on:mousedown={() => changeNum(1)}
			on:mouseup={() => {
				buttonHeld = false;
			}}
			on:mouseout={() => {
				buttonHeld = false;
			}}>+</button
		>
	</div>
</label>
