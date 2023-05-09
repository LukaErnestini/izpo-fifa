<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { sineIn } from 'svelte/easing';

	export let time = 0;
	export let latestTime: number;

	let buttonHeld = false;

	const interval = tweened(200, { duration: 2000, easing: sineIn });

	async function changeNum(n: number) {
		interval.set(200, { duration: 0 });
		interval.set(50);
		buttonHeld = true;
		while (buttonHeld) {
			time += n;
			if (time < latestTime) {
				time = latestTime;
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
</script>

<div class="flex justify-between p-1">
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
			min={latestTime}
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
</div>
