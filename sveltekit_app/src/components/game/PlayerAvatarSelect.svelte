<script lang="ts">
	export let name = 'unknown';
	export let width = '3rem';
	export let selected = false;
	export let color = '';
	export let imageUri: string | null | undefined =
		'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg';

	$: if (!imageUri) {
		imageUri = 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg';
	}

	$: width = selected ? '4rem' : '3rem';
</script>

<div class="px-2 w-min">
	<div class="avatar block">
		<div
			style={`width: ${width}; --tw-ring-color: ${color}`}
			class="rounded-full mx-auto
			{color ? 'ring ring-offset-1' : ''}"
		>
			<img src={imageUri} alt="avatar" />
		</div>
	</div>

	<span class="uppercase text-xs flex justify-center mt-2">
		{name}
	</span>
</div>
