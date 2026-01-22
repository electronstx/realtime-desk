<script lang="ts">
    import { socket, tasks } from "$lib/socket";

    const moveTask = (id: string, status: string) => {
        socket.emit('task:move', {id, status});
    }
</script>

<h1>Desk</h1>

<div class="columns">
    {#each $tasks as task}
        <div class="card">
            <p>{task.title}</p>
            <button on:click={() => moveTask(task.id, 'done')}>Complete</button>
        </div>
    {/each}
</div>
