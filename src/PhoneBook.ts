/* eslint-disable react-hooks/rules-of-hooks */

import { nanoid } from 'nanoid/non-secure'
import { db } from './db';
import { Form } from "./components/ContactForm";
import { createRef, useEffect, useReducer } from 'react';

export type Contact = {
  id: string,
  name: string,
  number: string
}
type Actions = {
  contacts: ['delete', Contact] | ["set", Contact[]] | ['add', Contact]
  form: ['update', Contact] | ['reset']
}
type States = {
  contacts: Contact[]
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
      if (contacts.length) this.contacts.dispatch(["set", contacts])
    });
    // db.contacts.on('add', (contact: Contact) => {
    //   contactsDispatch(['add', contact])
    // });
  }

  contacts: Part<'contacts'> = {
    dispatch(/* a */) { /* this.initState = this.reducer(this.initState, a) */ },
    reducer: reducers.contacts,
    initState: initStates.contacts,
    state: initStates.contacts
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
    this.contacts.dispatch(['delete', contact]);
  }
  addContact(name: string, number: string): boolean {
    const id = this.form.state.id;
    if (this.contacts.state.some(c => c.name === name && c.id !== id)) {
      return false;
    }
    this.contacts.dispatch(['add', { id, name, number }]);
    return true;
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
    if (!this.addContact(name, number)) {
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
  contacts(state, action) {
    switch (action[0]) {
      case 'delete': {
        const { id } = action[1];
        db.contacts.delete(id);
        return state.filter(c => c.id !== id)
      }
      case 'add': {
        const { id, name, number } = action[1];
        const newContacts = id
          ? state.map(c => c.id === id ? { ...c, name, number } : c)
          : state.concat({ id: nanoid(8), name, number });
        db.contacts.put(id ? { id, name, number } : newContacts.at(-1)!);
        return newContacts
      }
      case "set":
        return action[1]
      default:
        return state;
    }
  },
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
  contacts: [
    { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
    { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
    { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
  ],
  form: {
    name: '',
    number: '',
    id: ''
  }
}