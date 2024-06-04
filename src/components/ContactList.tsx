import PropTypes from "prop-types";
import { PhoneBook } from "../PhoneBook";
import { selectContacts, selectStatus } from "../features/phoneBook/contactsSlice";
import { useAppSelector } from "../app/hooks";
import ContactItem from "./ContactItem";
import Loader from "./Loader";

type Props = {
  phoneBook: PhoneBook
};
export default function ContactList({ phoneBook }: Props) {
  const contacts = useAppSelector(selectContacts);
  const status = useAppSelector(selectStatus);

  return status == 'fetching' ? <Loader /> :
    <ul>
      {contacts.map(contact => <ContactItem key={contact.id} phoneBook={phoneBook} contact={contact} />)}
      <li><Loader hidden={status != 'adding'} /></li>
    </ul>
}

ContactList.propTypes = {
  phoneBook: PropTypes.instanceOf(PhoneBook)
};