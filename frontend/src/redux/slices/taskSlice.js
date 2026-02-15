import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async Thunks
export const getTasks = createAsyncThunk('tasks/getFromProject', async (projectId, thunkAPI) => {
    try {
        const response = await api.get(`/projects/${projectId}/tasks`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
});

export const createTask = createAsyncThunk('tasks/create', async ({ projectId, taskData }, thunkAPI) => {
    try {
        const response = await api.post(`/projects/${projectId}/tasks`, taskData);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ taskId, taskData }, thunkAPI) => {
    try {
        const response = await api.put(`/tasks/${taskId}`, taskData);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId, thunkAPI) => {
    try {
        await api.delete(`/tasks/${taskId}`);
        return taskId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
});

const initialState = {
    tasks: [],
    loading: false,
    error: null
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearTaskError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Tasks
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Task
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            // Update Task
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            // Delete Task
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task._id !== action.payload);
            });
    }
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
