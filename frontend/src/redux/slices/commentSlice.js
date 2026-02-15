import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async Thunks
export const getComments = createAsyncThunk('comments/getForTask', async (taskId, thunkAPI) => {
    try {
        const response = await api.get(`/tasks/${taskId}/comments`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to fetch comments');
    }
});

export const addComment = createAsyncThunk('comments/add', async ({ taskId, text }, thunkAPI) => {
    try {
        const response = await api.post(`/tasks/${taskId}/comments`, { text });
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to add comment');
    }
});

export const deleteComment = createAsyncThunk('comments/delete', async (commentId, thunkAPI) => {
    try {
        await api.delete(`/comments/${commentId}`);
        return commentId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to delete comment');
    }
});

const initialState = {
    comments: [],
    loading: false,
    error: null
};

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments: (state) => {
            state.comments = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Comments
            .addCase(getComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Comment
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.unshift(action.payload); // Add new comment to top
            })
            // Delete Comment
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(c => c._id !== action.payload);
            });
    }
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
