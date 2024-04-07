import './App.css'
import { Component, createRef } from "react";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import Filter from './Filter';
import { nanoid } from 'nanoid/non-secure'

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
  updateContact = ({ name, number }: Contact) =>
    this.contactForm.current?.setState({ name, number });

  deleteContact = (contact: Contact) => {
    const newContacts = this.state.contacts.filter(c => c.id !== contact.id);
    this.setState({ contacts: newContacts });
  }
  addContact = (name: string, number: string) => {
    const newContacts = this.state.contacts.concat({ id: nanoid(8), name, number });
    this.setState({ contacts: newContacts });
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
}

