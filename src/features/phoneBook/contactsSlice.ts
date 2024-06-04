import { Notify } from 'notiflix';
import type { Contact } from '../../PhoneBook'
import { createAppSlice } from '../../app/createAppSlice'
import { contactsAPI } from './contactsAPI'
import { ReducerCreators } from '@reduxjs/toolkit';

type ContactsState = {
  items: Contact[];
  status: 'idle' | 'fetching' | 'adding'// | ['updating'|'deleting', Contact['id']][] | ['error', message:string]
}
const rejected: NonNullable<NonNullable<Parameters<ReducerCreators<ContactsState>['asyncThunk']>[1]>['rejected']>
  = (state, action) => {
    state.status = 'idle'
    Notify.failure(action.error.message!)
    console.log(action.error);
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
    fetchContacts: create.asyncThunk(
      async () => {
        const response = await contactsAPI.get('/')
        return response.data as ResponseContact[]
      },
      {
        pending: state => {
          state.status = "fetching"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.items = action.payload
        },
        rejected
      },
    ),
    addContact: create.asyncThunk(
      async ({ name, phone }: Pick<Contact, 'name' | 'phone'>) => {
        const postResponse = (await contactsAPI.post('/')).data as ResponseContact
        const response = await contactsAPI.put(postResponse.id, { name, phone })
        return response.data as ResponseContact
      },
      {
        pending: state => {
          state.status = "adding"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.items.push(action.payload)
        },
        rejected
      },
    ),
    updateContact: create.asyncThunk(
      async ({ id, name, phone }: Contact) => {
        const response = await contactsAPI.put(id, { name, phone })
        return response.data as ResponseContact
      },
      {
        pending: (state, { meta: { arg: { id } } }) => {
          state.status = "idle"
          const contact = state.items.find(c => c.id === id)!
          contact.status = 'updating'
        },
        fulfilled: (state, { payload: { id, name, phone } }) => {
          const contact = state.items.find(c => c.id === id)!
          contact.name = name
          contact.phone = phone
          contact.status = undefined
        },
        rejected
      },
    ),
    deleteContact: create.asyncThunk(
      async ({ id }: Pick<Contact, 'id'>) => {
        try {
          const response = await contactsAPI.delete(id)
          return response.data as ResponseContact
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error.message === 'Failed to fetch') return { id, name: null }
          // console.log(error);
          throw error;
        }
      },
      {
        pending: (state, { meta: { arg: { id } } }) => {
          state.status = "idle"
          const contact = state.items.find(c => c.id === id)!
          contact.status = 'deleting'
        },
        fulfilled: (state, { payload: { id, name } }) => {
          const contact = state.items.findIndex(c => c.id === id)!
          if (name === null) state.items[contact].status = undefined
          else state.items.splice(contact, 1)
        },
        rejected
      },
    ),
  }),
  selectors: {
    selectContacts: contacts => contacts.items,
    selectStatus: contacts => contacts.status,
  },
})

export const { deleteContact: deleteContactA, updateContact: updateContactA, addContact: addContactA, fetchContacts: setContactsA } = contactsSlice.actions

export const { selectContacts, selectStatus } = contactsSlice.selectors

export default contactsSlice.reducer


/* 
fetchContacts - obținerea un array de contacte (metoda GET) prin cerere. Action type "contacts/fetchAll".
addContact - adăugarea unui contact (metoda POST). Action type "contacts/addContact".
deleteContact - ștergerea unui contact (metoda DELETE). Action type "contacts/deleteContact".
 */
type ResponseContact = {
  createdAt: number;
  name: string;
  phone: string;
  id: string;
}