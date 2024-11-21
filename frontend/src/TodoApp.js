import React, { useEffect, useState } from "react";
import axios from "axios";

const TodoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/tasks`);
            setTasks(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message());
        } finally {
            setLoading(false);
        }
    };

    const addTask = async () => {
        if (!taskName.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await axios.post(`/api/tasks`, {
                name: taskName,
                completed: false
            });
            setTaskName('');
            fetchTasks();
        } catch (err) {
            console.error("Error while adding task:", err);
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`/api/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Todo List</h1>
            {/*<h1>Update</h1>*/}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Add a new task"
                />
            <button onClick={addTask} disabled={loading}>
                {loading ? 'Adding...' : 'Add'}
            </button>
            {loading && <p>Loading tasks...</p>}
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.name}
                        <button onClick={() => deleteTask(task.id)}
                        disabled={loading}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;