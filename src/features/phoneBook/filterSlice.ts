import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = ""

export const filterSlice = createSlice({
  name: 'filter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    set(_state, action: PayloadAction<string>) {
      return action.payload
    },
  },
})

export const { set: setFilterA } = filterSlice.actions

export const selectFilter = filterSlice.selectSlice

export default filterSlice.reducer
