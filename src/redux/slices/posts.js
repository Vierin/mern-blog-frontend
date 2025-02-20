import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const { data } = await axios.get('/posts');
	return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const { data } = await axios.get('/posts/tags');
	return data;
});

export const fetchRemovePost = createAsyncThunk(
	'posts/fetchRemovePost',
	(id) => {
		axios.delete(`/posts/${id}`);
	}
);

const initialState = {
	posts: {
		items: [],
		status: 'loading',
	},
	tags: {
		items: [],
		status: 'loading',
	},
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducer: {},
	extraReducers: {
		// get all posts
		[fetchPosts.pending]: (state) => {
			state.posts.items = [];
			state.posts.status = 'loading';
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.status = 'success';
			state.posts.items = action.payload; // добавляем посты в стейт
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
		// get all tags
		[fetchTags.pending]: (state) => {
			state.tags.items = [];
			state.tags.status = 'loading';
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.status = 'success';
			state.tags.items = action.payload;
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = [];
			state.tags.status = 'error';
		},
		// delete post
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(
				(obj) => obj._id !== action.meta.arg
			);
		},
	},
});

export const postsReducer = postsSlice.reducer;
