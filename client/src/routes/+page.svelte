<script lang="ts">
    import { tasks, socket } from "$lib/socket";

    let newTaskTitle = '';

    const columns = [
        { id: 'todo', title: 'Нужно сделать' },
        { id: 'in-progress', title: 'В работе' },
        { id: 'done', title: 'Готово' }
    ];

    const createTask = () => {
        if (newTaskTitle.trim() && socket) {
            socket.emit('task:create', { title: newTaskTitle });
            newTaskTitle = '';
        }
    };

    const moveTask = (id: string, status: string) => {
        if (socket) {
            socket.emit('task:move', { id, status });
        }
    };

    const deleteTask = (id: string) => {
        if (confirm('Удалить задачу?') && socket) {
            socket.emit('task:delete', { id });
        }
    };
</script>

<div class="header">
    <h1>Realtime Desk</h1>
    <div class="add-task">
        <input bind:value={newTaskTitle} placeholder="Название задачи..." on:keydown={(e) => e.key === 'Enter' && createTask()} />
        <button on:click={createTask}>Добавить</button>
    </div>
</div>

<div class="board">
    {#each columns as column}
        <div class="column">
            <h2>{column.title}</h2>
            
            {#each $tasks.filter(t => t.status === column.id) as task}
            <div class="card">
                <p>{task.title}</p>
                <div class="buttons">
                    {#if column.id === 'todo'}
                        <button on:click={() => moveTask(task.id, 'in-progress')}>→</button>
                    {:else if column.id === 'in-progress'}
                        <button on:click={() => moveTask(task.id, 'todo')}>←</button>
                        <button on:click={() => moveTask(task.id, 'done')}>→</button>
                    {:else if column.id === 'done'}
                        <button on:click={() => moveTask(task.id, 'in-progress')}>←</button>
                    {/if}
                    <button class="delete-btn" on:click={() => deleteTask(task.id)}>🗑️</button>
                </div>
            </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    .header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        padding: 20px; 
        background: white; 
    
    }

    .add-task { 
        display: flex; 
        gap: 10px; 
    }

    .add-task input { 
        padding: 8px; 
        border: 1px solid #ccc; 
        border-radius: 4px; 
        width: 200px; 
    }

    .buttons { 
        display: flex; 
        gap: 5px; 
        justify-content: flex-end; 
        margin-top: 10px;
    }

    .board {
        display: flex;
        gap: 20px;
        padding: 20px;
        align-items: flex-start;
        background-color: #f4f5f7;
        min-height: 100vh;
    }

    .column {
        background-color: #ebecf0;
        border-radius: 8px;
        width: 300px;
        padding: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }

    .column h2 {
        font-size: 1.1rem;
        margin-bottom: 15px;
        color: #172b4d;
        padding-left: 5px;
    }

    .card {
        background: white;
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 8px;
        box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
        cursor: grab;
        transition: background 0.2s;
    }

    .card:hover {
        background: #f4f5f7;
    }

    .card p {
        margin: 0 0 10px 0;
    }

    button {
        background: #0052cc;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.8rem;
    }

    button:hover {
        background: #0065ff;
    }

    .delete-btn {
        background: #ff4d4d;
        margin-left: auto;
    }
    .delete-btn:hover {
        background: #ff1a1a;
    }
</style>
