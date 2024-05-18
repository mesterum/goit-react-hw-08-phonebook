import PropTypes from "prop-types";
import { PhoneBook } from "../PhoneBook";
import styled from "styled-components";
import { selectContacts } from "../features/phoneBook/contactsSlice";
import { selectFilter } from "../features/phoneBook/filterSlice";
import { useAppSelector } from "../app/hooks";

type Props = {
  phoneBook: PhoneBook
};
const Number = styled.span`
  font-size: 1.13em;
`
export default function ContactList({ phoneBook }: Props) {
  const contacts = useAppSelector(selectContacts);
  const filter = useAppSelector(selectFilter);
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
  phoneBook: PropTypes.instanceOf(PhoneBook)
};