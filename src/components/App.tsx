import './App.css'
import { Component, createRef } from "react";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import Filter from './Filter';
import { nanoid } from 'nanoid/non-secure'
import { db } from '../db';

export type Contact = {
  id: string,
  name: string,
  number: string
}
type Props = Record<string, never>;
type State = {
  contacts: Contact[],
  filter: string
};

export default class App extends Component<Props, State> {
  // static defaultProps = {};
  // static propTypes = {};

  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: ''
  }

  contactForm = createRef<ContactForm>();

  deleteContact = (contact: Contact) => {
    if (this.contactForm.current?.state.id === contact.id)
      this.contactForm.current.setState({ id: '' });
    const newContacts = this.state.contacts.filter(c => c.id !== contact.id);
    db.contacts.delete(contact.id);
    this.setState({ contacts: newContacts });
  }
  addContact = (name: string, number: string, id?: string): boolean => {
    if (this.state.contacts.some(c => c.name === name && c.id !== id)) return false;
    const newContacts = id
      ? this.state.contacts.map(c => c.id === id ? { ...c, name, number } : c)
      : this.state.contacts.concat({ id: nanoid(8), name, number });
    db.contacts.put(id ? { id, name, number } : newContacts.at(-1)!);
    this.setState({ contacts: newContacts });
    return true;
  }
  setFilter = (filter: string) => this.setState({ filter });

  render() {
    return (
      <div>
        <h2>Phonebook</h2>
        {<ContactForm addContact={this.addContact} ref={this.contactForm} />}

        <h2>Contacts</h2>
        <Filter filter={this.state.filter} setFilter={this.setFilter} />
        <ContactList contacts={this.state.contacts} filter={this.state.filter}
          updateContact={this.updateContact} deleteContact={this.deleteContact} />
      </div>
    )
  }
  // For the contactForm reference to update
  updateContact = (c: Contact) => {
    if (this.contactForm.current) {
      this.updateContact = this.contactForm.current.updateContact
      this.updateContact(c)
      this.setState({})
    }
  }
  async componentDidMount() {
    const contacts = await db.contacts.toArray();
    if (contacts.length) this.setState({ contacts });
  }

}

