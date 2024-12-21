console.clear();


import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Initial States
const initialTodoState = { todos: [] };
const initialUserState = { user: null, loading: false, error: null };

// 2. Async Thunks
const fetchUser = createAsyncThunk('user/fetchUser', async (userId, { rejectWithValue }) => {
  try {
    // Simulate API call
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve({ id: userId, name: 'John Doe' }), 3000)
    );
    return response;
  } catch (error) {
    return rejectWithValue('Failed to fetch user');
  }
});

// 3. Slices

// Simplifies creating a reducer and actions in one go, and
// Generates action creators (increment, decrement, incrementByAmount) and the reducer automatically.
const todoSlice = createSlice({
  name: 'todos',
  initialState: initialTodoState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push(action.payload); // Directly mutate the state (uses Immer internally)
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    }
  }
});


const userSlice = createSlice({ 
  name: 'user',
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 4. Store

const store = configureStore({  // Automatically combines reducers
  reducer: {
    todos: todoSlice.reducer,
    user: userSlice.reducer
  }
});

// 5. Action Creators
export const { addTodo, removeTodo } = todoSlice.actions;


// 6. Subscribe to Store
const unsubscribe = store.subscribe(() => {
  console.log('Subscriber1: State updated:', store.getState().todos);
});

// 7. Dispatch Actions
store.dispatch(addTodo({ id: 1, text: 'Learn Redux' }));
store.dispatch(addTodo({ id: 2, text: 'Build a project' }));
store.dispatch(removeTodo(1));


store.dispatch(fetchUser(101)).then(() => { // Fetch user with ID 101
  // 8. Unsubscribe the listener
  unsubscribe();
  console.log('Unsubscribed!')
});