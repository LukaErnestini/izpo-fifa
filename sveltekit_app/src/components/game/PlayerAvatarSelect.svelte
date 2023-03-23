<script lang="ts">
	export let name = 'unknown';
	export let width = '3rem';
	export let selected = false;
	export let imageUri: string | null | undefined =
		'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg';
</script>

<div class="px-1 w-min">
	<div class="avatar block">
		<div
			style:width
			class="rounded-full mx-auto 
            {selected ? 'ring ring-primary ring-offset-base-100 ring-offset-2' : ''}"
		>
			<img src={imageUri} alt="avatar" />
		</div>
	</div>

	<span class="uppercase text-xs flex justify-center">
		{name}
	</span>
</div>
