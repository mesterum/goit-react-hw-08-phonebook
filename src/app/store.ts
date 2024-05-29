import { configureStore, createSelector } from '@reduxjs/toolkit'
import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { default as contacts } from '../features/phoneBook/contactsSlice'
import { default as filter } from '../features/phoneBook/filterSlice'

export const store = configureStore({
  reducer: {
    contacts,
    filter,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const createAppSelector = createSelector.withTypes<RootState>()
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>