import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v1 as uuid } from 'uuid';

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
