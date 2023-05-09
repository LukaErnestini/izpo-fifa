<script lang="ts">
	let email = '';
	let password = '';
</script>

<form method="POST" class="form-control m-4">
	<label for="email" class="label"> Email: </label>
	<input
		class="input input-bordered"
		id="email"
		name="email"
		type="email"
		bind:value={email}
		required
	/>
	<label for="password" class="label"> Password: </label>
	<input
		class="input input-bordered"
		id="password"
		name="password"
		type="password"
		bind:value={password}
		required
	/>
	<button type="submit" class="btn m-4">Sign In</button>
</form>
