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
    <li className={className + (
      contact.status == 'deleting' ? " isDeleting" :
        contact.status == 'updating' ? " isUpdating" :
          !isVisible ? " isHidden" : "")}
    > <div>
        {contact.name}: <span>{contact.phone}</span>
      </div>
      <div>
        <button onClick={deleteContact} disabled={contact.status == 'deleting'}>Delete</button>
        <button onClick={updateContact}>Update</button>
      </div>
    </li>
  )
}


export default styled(ContactItem)`
  display: flex;
  justify-content: space-between;
&.isHidden {
  display: none;
}
&.isDeleting {
  text-decoration: line-through;
}
&.isUpdating > div:first-child {
  opacity: 0.5;
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