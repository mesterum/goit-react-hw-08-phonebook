import { Component, createRef } from "react";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";

type Props = Record<string, never>;
export type State = {
  contacts: {
    id: string,
    name: string,
    number: string
  }[],
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
  updateContactForm = (name: string, number: string) =>
    this.contactForm.current?.setState({ name, number });

  addContact = (name: string, number: string) => {
    const newContacts = this.state.contacts.concat({ id: "TODO", name, number });
    this.setState({ contacts: newContacts });
  }

  render() {
    //   const filteredContacts = this.state.contacts.filter(contact => contact.name.toLowerCase().includes(this.state.filter.toLowerCase()))
    return (
      <div>
        <h2>Phonebook</h2>
        {<ContactForm addContact={this.addContact} ref={this.contactForm} />}

        <h2>Contacts</h2>
        {/* <Filter ... /> */}
        <ContactList contacts={this.state.contacts} updateContactForm={this.updateContactForm} />
      </div>
    )
  }
}

