import PropTypes from "prop-types";
import { State } from "./App";

type Props = {
  contacts: State["contacts"],
  updateContactForm: (name: string, number: string) => void
};

export default function ContactList(props: Props) {
  return (
    <ul>
      {props.contacts.map(contact => (
        <li key={contact.id} onClick={() => props.updateContactForm(contact.name, contact.number)}>
          {contact.name}: <span>{contact.number}</span>
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