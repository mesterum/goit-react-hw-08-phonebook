import { nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Contact } from '../../PhoneBook'
import { db } from '../../db'
import { createAppSlice } from '../../app/createAppSlice'

type ContactsState = {
  items: Contact[];
  status: 'idle' | 'fetching' | 'adding'// | ['updating'|'deleting', Contact['id']][] | ['error', message:string]
}
const initialState: ContactsState = {
  items: [],
  status: 'idle'
}

export const contactsSlice = createAppSlice({
  name: 'contacts',
  reducerPath: 'contacts',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: create => ({
    delete: create.reducer(
      (state, action: PayloadAction<Contact>) => {
        const { id } = action.payload;
        db.contacts.delete(id);
        state.items = state.items.filter(c => c.id !== id);
      }),
    add(state, action: PayloadAction<Contact>) {
      const { id, name, number } = action.payload;
      const { items } = state;
      const newContacts = id
        ? items.map(c => c.id === id ? { ...c, name, number } : c)
        : items.concat({ id: nanoid(8), name, number });
      db.contacts.put(id ? { id, name, number } : newContacts.at(-1)!);
      state.items = newContacts
    },
    set(state, action: PayloadAction<Contact[]>) {
      state.items = action.payload;
    },
  }),
  selectors: {
    selectContacts: contacts => contacts.items,
    selectStatus: contacts => contacts.status,
  },
})

export const { delete: deleteContactA, add: addContactA, set: setContactsA } = contactsSlice.actions

export const { selectContacts, selectStatus } = contactsSlice.selectors

export default contactsSlice.reducer


/* 
fetchContacts - obținerea un array de contacte (metoda GET) prin cerere. Action type "contacts/fetchAll".
addContact - adăugarea unui contact (metoda POST). Action type "contacts/addContact".
deleteContact - ștergerea unui contact (metoda DELETE). Action type "contacts/deleteContact".
 */
