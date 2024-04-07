import PropTypes from "prop-types";
import { Contact } from "./App";
import styled from "styled-components";

type Props = {
  contacts: Contact[],
  filter: string,
  updateContact: (contact: Contact) => void
  deleteContact: (contact: Contact) => void
};
const Number = styled.span`
  font-size: 1.13em;
`
export default function ContactList(props: Props) {
  const lowerCaseFilter = props.filter.toLowerCase()
  return (
    <ul>
      {props.contacts.map(contact => (contact.name.toLowerCase().includes(lowerCaseFilter) &&
        <li key={contact.id} onClick={() => props.updateContact(contact)}>
          {contact.name}: <Number>{contact.number}</Number>
          <button onClick={() => props.deleteContact(contact)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    }),
  ).isRequired,
};