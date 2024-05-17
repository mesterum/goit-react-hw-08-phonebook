/* eslint-disable react-hooks/rules-of-hooks */

import { db } from './db';
import { Form } from "./components/ContactForm";
import { createRef, useEffect, useReducer } from 'react';
import { type AppThunk, store } from './app/store';
import { addContactA, deleteContactA, selectContacts, setContactsA } from './features/phoneBook/contactsSlice';

export type Contact = {
  id: string,
  name: string,
  number: string
}
type Actions = {
  form: ['update', Contact] | ['reset']
}
type States = {
  form: Contact
}
type Reducers = { [K in keyof Actions]: React.Reducer<States[K], Actions[K]> }

type Part<K extends keyof Actions> = {
  dispatch: React.Dispatch<Actions[K]>
  state: States[K]
  reducer: Reducers[K]
  initState: States[K]
}

export class PhoneBook {
  constructor() {
    this.handleSubmit = this.handleSubmit.bind(this);

    db.contacts.toArray(contacts => {
      store.dispatch(setContactsA(contacts.length ? contacts : defaultContacts))
    });
  }

  form: Part<'form'> = {
    dispatch: () => { },
    reducer: reducers.form,
    initState: initStates.form,
    state: initStates.form
  }
  deleteContact(contact: Contact) {
    if (this.form.state === contact)
      this.form.dispatch(['update', { ...contact, id: '' }]);
    store.dispatch(deleteContactA(contact));
  }
  addContact(name: string, number: string): AppThunk<boolean> {
    return (dispatch, getState) => {
      const contacts = selectContacts(getState())
      const id = this.form.state.id;
      if (contacts.some(c => c.name === name && c.id !== id)) {
        return false;
      }
      dispatch(addContactA({ id, name, number }));
      return true;
    }
  }
  updateContact(contact: Contact) {
    this.form.dispatch(['update', contact]);
    this.formEl.current?.elements.number.focus();
  }
  formEl = createRef<Form>();
  handleSubmit(evt: React.FormEvent<Form>) {
    evt.preventDefault();
    const formEl = evt.currentTarget;
    const name = formEl.elements.name.value;
    const number = formEl.elements.number.value;
    if (!store.dispatch(this.addContact(name, number))) {
      alert(`${name} is already in contacts`);
      return;
    }
    this.form.dispatch(['reset']);
    formEl.reset();
  }
  useStore<K extends keyof States>(key: K): PhoneBook[K]["state"] {
    const part = this[key];
    const [state, dispatch] = useReducer(part.reducer, part.initState);
    useEffect(() => {
      part.dispatch = dispatch;
    }, [part])
    part.state = state;
    return state;
  }
}

const reducers: Reducers = {
  form(state, action) {
    switch (action[0]) {
      case 'update':
        return state === action[1] ? initStates.form : action[1];
      case 'reset':
        return initStates.form;
      default:
        return state;
    }
  }
}
const initStates: States = {
  form: {
    name: '',
    number: '',
    id: ''
  }
}

const defaultContacts: Contact[] = [
  { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
  { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
  { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
]