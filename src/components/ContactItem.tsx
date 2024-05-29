import PropTypes from "prop-types";
import { Contact, PhoneBook } from "../PhoneBook";
import styled from "styled-components";
import { useAppSelector } from "../app/hooks";
import { useMemo } from "react";
import { createAppSelector, RootState } from "../app/store";
import { selectFilter } from "../features/phoneBook/filterSlice";

type Props = {
  className?: string
  phoneBook: PhoneBook
  contact: Contact
};

const selectLCFilter = createAppSelector([selectFilter], filter => filter.toLowerCase())
const selectContactItemVisibile = (contact: Contact) => (state: RootState) => createAppSelector([selectLCFilter,
  (_, contact: Contact) => contact.name.toLowerCase()
], (lowerCaseFilter, name) => name.includes(lowerCaseFilter))(state, contact)

function ContactItem({ className, phoneBook, contact }: Props) {
  const isVisible = useAppSelector(selectContactItemVisibile(contact));
  const { deleteContact, updateContact } = useMemo(() => ({
    deleteContact: phoneBook.deleteContact.bind(phoneBook, contact),
    updateContact: phoneBook.updateContact.bind(phoneBook, contact)
  }), [phoneBook, contact]);
  return (
    <li className={className + (contact.isDeleting ? " isDeleting" : "")} hidden={!isVisible}>
      {contact.name}: <span>{contact.number}</span>

      <button onClick={deleteContact} disabled={contact.isDeleting}>Delete</button>
      <button onClick={updateContact}>Update</button>
    </li>
  )
}


export default styled(ContactItem)`
&.isDeleting {
  // opacity: 0.5;
  text-decoration: line-through;
}
&>span {
  font-size: 1.13em;
}
&>button {
  margin-left: .5em;
}
`

ContactItem.propTypes = {
  phoneBook: PropTypes.instanceOf(PhoneBook)
};