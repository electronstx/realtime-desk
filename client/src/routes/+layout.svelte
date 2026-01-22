<script>
	import { onMount } from 'svelte';
	import { socket, initSocket } from '$lib/socket';
  
	onMount(() => {
		initSocket();

		return () => {
			socket?.removeAllListeners(); 
			socket?.disconnect();
		}
	});
</script>
<slot />
