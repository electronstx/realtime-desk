<script>
	import { onMount } from 'svelte';
	import { socket, initSocket } from '$lib/socket';
  
	onMount(() => {
		initSocket();

		return () => {
			socket?.disconnect();
		}
	});
</script>
<slot />
