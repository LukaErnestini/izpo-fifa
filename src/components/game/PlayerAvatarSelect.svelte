<script lang="ts">
	export let name: string;
	export let selected: boolean = false;
	export let imageUri: string =
		'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg';
</script>

<div class="px-1 w-min">
	<div class="avatar block">
		<div
			class="w-12 rounded-full mx-auto 
            {selected ? 'ring ring-primary ring-offset-base-100 ring-offset-2' : ''}"
		>
			<img src={imageUri} alt="avatar" />
		</div>
	</div>

	<span class="uppercase text-xs flex justify-center">
		{name}
	</span>
</div>
