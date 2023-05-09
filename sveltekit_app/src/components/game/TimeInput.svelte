<script lang="ts">
	export let time = 0;

	async function changeNum(n: number) {
		time += n;
		if (time > 130) {
			time = 130;
		} else if (time < 1) {
			time = 1;
		}
	}
</script>

<div class="time-input">
	<span class="label-text">Time</span>
	<div class="controls">
		<button type="button" class="mybutton" on:mousedown={() => changeNum(-5)}>-5</button>
		<button type="button" class="mybutton" on:mousedown={() => changeNum(-1)}>-</button>
		<span class="time">{time}'</span>
		<input type="hidden" bind:value={time} name="time" class="" max="130" min="1" />
		<button type="button" class="mybutton" on:mousedown={() => changeNum(1)}>+</button>
		<button type="button" class="mybutton" on:mousedown={() => changeNum(5)}>+5</button>
	</div>
</div>

<style>
	.time-input {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.time {
		font-size: 24px;
		margin: 0 20px;
	}

	.mybutton {
		margin: 4px 4px;
		border: 2px solid #000;
		border-radius: 5px;
		background-color: transparent;
		padding: 5px 10px;
		font-size: 16px;
		width: 50px;
	}

	.mybutton:hover {
		background-color: #000;
		color: #fff;
	}

	.mybutton:focus {
		outline: none;
		box-shadow: 0 0 5px #000;
	}
</style>
