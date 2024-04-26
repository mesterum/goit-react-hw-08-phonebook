/* eslint-disable react-refresh/only-export-components */
import './App.css'
import { useMemo, useState } from "react";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import Filter from './Filter';
import { PhoneBook } from '../PhoneBook';

export default function App() {

  const phoneBook = useMemo(() => new PhoneBook(), []);
  const [filter, setFilter] = useState("");

  return (
    <div>
      <h2>Phonebook</h2>
      {<ContactForm phoneBook={phoneBook} />}
      <h2>Contacts</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <ContactList filter={filter} phoneBook={phoneBook} />
    </div>
  )
}

