import PropTypes from "prop-types";
import { PhoneBook } from "../PhoneBook";
import { selectContacts } from "../features/phoneBook/contactsSlice";
import { useAppSelector } from "../app/hooks";
import ContactItem from "./ContactItem";

type Props = {
  phoneBook: PhoneBook
};
export default function ContactList({ phoneBook }: Props) {
  const contacts = useAppSelector(selectContacts);
  return (
    <ul>
      {contacts.map(contact => <ContactItem key={contact.id} phoneBook={phoneBook} contact={contact} />)}
    </ul>
  )
}

ContactList.propTypes = {
  phoneBook: PropTypes.instanceOf(PhoneBook)
};