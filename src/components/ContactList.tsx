import PropTypes from "prop-types";
import { PhoneBook } from "../PhoneBook";
import styled from "styled-components";
import { db } from "../db";
import { useEffect } from "react";

type Props = {
  filter: string,
  phoneBook: PhoneBook
};
const Number = styled.span`
  font-size: 1.13em;
`
export default function ContactList({ filter, phoneBook }: Props) {
  const contacts = phoneBook.useStore('contacts')
  useEffect(() => {
    db.contacts.toArray(contacts => {
      if (contacts.length) phoneBook.contacts.dispatch(["set", contacts])
    });
    // db.contacts.on('add', (contact: Contact) => {
    //   contactsDispatch(['add', contact])
    // });
  }, [phoneBook.contacts]);

  const lowerCaseFilter = filter.toLowerCase()
  return (
    <ul>
      {contacts.map(contact => (contact.name.toLowerCase().includes(lowerCaseFilter) &&
        <li key={contact.id}>
          {contact.name}: <Number>{contact.number}</Number>
          <button onClick={() => phoneBook.deleteContact(contact)}>Delete</button>
          <button onClick={() => phoneBook.updateContact(contact)}>Update</button>
        </li>
      ))}
    </ul>
  )
}

ContactList.propTypes = {
  filter: PropTypes.string.isRequired,
  phoneBook: PropTypes.instanceOf(PhoneBook)
};