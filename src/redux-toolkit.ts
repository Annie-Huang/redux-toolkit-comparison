import {
  configureStore,
  createSlice,
  getDefaultMiddleware,
  PayloadAction,
} from '@reduxjs/toolkit';
import { v1 as uuid } from 'uuid';
import logger from 'redux-logger';

import { Todo } from './type';

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux-ToolKit',
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    // For create, use an object rather than function.
    // it will go through "prepare" first and output of "prepare" (payload) feeds into "reducer" as payload.
    create: {
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{ id: string; desc: string; isComplete: boolean }>
      ) => {
        state.push(payload);
      },
    },
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const todoToEdit = state.find((todo) => todo.id === payload.id);

      // !!!!Important. You can mutate your state with redux-toolkit
      if (todoToEdit) {
        todoToEdit.desc = payload.desc;
      }
    },
    toggle: (
      state,
      { payload }: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const todoToToggle = state.find((todo) => todo.id === payload.id);

      if (todoToToggle) {
        todoToToggle.isComplete = payload.isComplete;
      }
    },
    // Cannot use delete as delete a special keyword in javascript.
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === payload.id);

      if (index !== -1) {
        // splice is mutate the original array
        state.splice(index, 1);
      }
    },
  },
});

// Good example to show primitive mutation.
const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  // This is how to cast the primitive value to different type.
  initialState: null as string | null,
  reducers: {
    // // If your state is a primitive value, you cannot do it this way:
    // select: (state, { payload }: PayloadAction<{ id: string | null }>) => {
    //   state = payload.id;
    // },
    // The correct way of doing it is:
    select: (state, { payload }: PayloadAction<{ id: string | null }>) =>
      payload.id,
  },
});

// Shows how the reducers from slice 1 can change state in slice 2
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
};

// export default configureStore({ reducer });
const middleware = [...getDefaultMiddleware(), logger];
export default configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

/*// If you only have single reducer in your app, you can do it like this:
export default configureStore({ reducer: todoSlice.reducer });*/

/*// If no middleware key provided, applies getDefaultMiddleware()
// If wanting to remove default middleware, provide empty [];
export default configureStore({ reducer: todoSlice.reducer, middleware: [] });*/

/*// Most apps extend the functionality of their Redux store by adding middleware or store enhancers
// (note: middleware is common, enhancers are less common).
// Middleware adds extra functionality to Redux 'dispatch' function; enhancers add extra functionality to the Redux store.
import { reduxBatch } from '@manaflair/redux-batch'
const preloadedState = {
  todos: [
    {
      text: 'Eat food',
      completed: true,
    },
    {
      text: 'Exercise',
      completed: false,
    },
  ],
  visibilityFilter: 'SHOW_COMPLETED',
}
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
  enhancers: [reduxBatch],
})*/

/*
// You can customizing the included middleware as well:
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: myCustomApiService,
      },
      serializableCheck: false,
    }),
})*/

/*
// createSlice: A function that accepts an initial state, an object of reducer functions, and a "slice name", and automatically generates action creators and action types that correspond to the reducers and state.
function createSlice({
  // A name, used in action types
  name: string,
  // The initial state for the reducer
  initialState: any,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: Object<string, ReducerFunction | ReducerAndPrepareObject>
  // A "builder callback" function used to add more reducers, or
  // an additional object of "case reducers", where the keys should be other
  // action types
  extraReducers?:
  | Object<string, ReducerFunction>
  | ((builder: ActionReducerMapBuilder<State>) => void)
})
*/

/*// Reducers: how to use fall back value:
// https://redux-toolkit.js.org/api/createAction#using-prepare-callbacks-to-customize-action-contents
// Using Prepare Callbacks to Customize Action Contents
//
// By default, the generated action creators accept a single argument, which becomes action.payload.
// This requires the caller to construct the entire payload correctly and pass it in.
//
// In many cases, you may want to write additional logic to customize the creation of the payload value, such as
// - accepting multiple parameters for the action creator,
// - generating a random ID, or
// - getting the current timestamp.
// To do this, createAction accepts an optional second argument: a "prepare callback" that will be used to construct the payload value.
const counter = createSlice({
  name: 'counter',
  initialState: 0 as number,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    multiply: {
      reducer: (state, action: PayloadAction<number>) => state * action.payload,
      prepare: (value?: number) => ({ payload: value || 2 }), // fallback if the payload is a falsy value
    },
  },
});*/

/*// Direct State Mutation -> Potential Pitfall of using Immer
// https://redux-toolkit.js.org/api/createReducer#direct-state-mutation
// Writing "mutating" reducers simplifies the code. It's shorter, there's less indirection, and it eliminates common mistakes made while spreading nested state.
// However, the use of Immer does add some "magic", and Immer has its own nuances in behavior.
// You should read through pitfalls mentioned in the immer docs .
// Most importantly, you need to ensure that you either mutate the state argument or return a new state, but not both.
const todosReducer = createReducer([] as Todo[], (builder) => {
  builder.addCase(toggleTodo, (state, action) => {
    const index = action.payload;
    const todo = state[index];

    // This case reducer both mutates the passed-in state...
    todo.completed = !todo.completed;

    // ... and returns a new value. This will throw an
    // exception. In this example, the easiest fix is
    // to remove the `return` statement.
    return [...state.slice(0, index), todo, ...state.slice(index + 1)];
  });
});*/
