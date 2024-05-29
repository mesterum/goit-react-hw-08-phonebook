import './App.css'
import { useMemo } from "react";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import Filter from './Filter';
import { PhoneBook } from '../PhoneBook';

export default function App() {

  const phoneBook = useMemo(() => new PhoneBook(), []);

  return (
    <div>
      <h2>Phonebook</h2>
      <ContactForm phoneBook={phoneBook} />
      <h2>Contacts</h2>
      <Filter />
      <ContactList phoneBook={phoneBook} />
    </div>
  )
}

