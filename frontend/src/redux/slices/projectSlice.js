import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// =============================
// Async Thunks
// =============================

export const getProjects = createAsyncThunk(
    'projects/getAll',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/projects');
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.error || 'Failed to fetch projects'
            );
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/create',
    async (projectData, thunkAPI) => {
        try {
            const response = await api.post('/projects', projectData);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.error || 'Failed to create project'
            );
        }
    }
);

export const getProject = createAsyncThunk(
    'projects/getOne',
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`/projects/${id}`);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.error || 'Failed to fetch project'
            );
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/delete',
    async (id, thunkAPI) => {
        try {
            await api.delete(`/projects/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.error || 'Failed to delete project'
            );
        }
    }
);

// ✅ ADD MEMBER THUNK
export const addMember = createAsyncThunk(
    'projects/addMember',
    async ({ projectId, email }, thunkAPI) => {
        try {
            const response = await api.put(`/projects/${projectId}/add-member`, { email });
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.error || 'Failed to add member'
            );
        }
    }
);

// =============================
// Slice
// =============================

const initialState = {
    projects: [],
    project: null,
    loading: false,
    error: null
};

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearProjectError: (state) => {
            state.error = null;
        },
        clearCurrentProject: (state) => {
            state.project = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Projects
            .addCase(getProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Project
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
            })

            // Get Single Project
            .addCase(getProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload;
            })
            .addCase(getProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Project
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(
                    project => project._id !== action.payload
                );
            })

            // ✅ Add Member
            .addCase(addMember.fulfilled, (state, action) => {
                state.project = action.payload;
            })
            .addCase(addMember.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { clearProjectError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
