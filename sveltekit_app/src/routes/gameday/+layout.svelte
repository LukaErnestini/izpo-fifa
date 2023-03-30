<script lang="ts">
	import Navbar from '../../components/game/Navbar.svelte';

	export let data;
</script>

<Navbar
	gameIsActive={data.activeGame ? true : false}
	scoreTeamA={data.activeGame?.scoreTeamA}
	scoreTeamB={data.activeGame?.scoreTeamB}
	teamA={data.activeGame?.teams[0]}
	teamB={data.activeGame?.teams[1]}
/>

<slot><!-- optional fallback --></slot>
