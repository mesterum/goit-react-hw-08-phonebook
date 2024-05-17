import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Contact } from '../../PhoneBook'
import { db } from '../../db'

const initialState: Contact[] = []

export const contactsSlice = createSlice({
  name: 'contacts',
  reducerPath: 'contacts',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    delete(state, action: PayloadAction<Contact>) {
      const { id } = action.payload;
      db.contacts.delete(id);
      return state.filter(c => c.id !== id)
    },
    add(state, action: PayloadAction<Contact>) {
      const { id, name, number } = action.payload;
      const newContacts = id
        ? state.map(c => c.id === id ? { ...c, name, number } : c)
        : state.concat({ id: nanoid(8), name, number });
      db.contacts.put(id ? { id, name, number } : newContacts.at(-1)!);
      return newContacts
    },
    set(_state, action: PayloadAction<Contact[]>) {
      return action.payload
    },
  },
})

export const { delete: deleteContactA, add: addContactA, set: setContactsA } = contactsSlice.actions

export const selectContacts = contactsSlice.selectSlice

export default contactsSlice.reducer
