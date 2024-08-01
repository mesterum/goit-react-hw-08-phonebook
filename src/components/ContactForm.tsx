/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { memo } from "react";
import styled from "styled-components";
import { PhoneBook } from "../PhoneBook";

const Form = styled.form`
  border: solid currentColor 1px;
  padding: 0.5em;
`
export type Form = HTMLFormElement & {
  elements: Record<"name" | "number", HTMLInputElement>
}
const FormElement = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
`;

type Props = { phoneBook: PhoneBook }

function ContactForm({ phoneBook }: Props) {
  const { formEl, handleSubmit } = phoneBook;
  const state = phoneBook.useStore('form')

  return (
    <Form onSubmit={handleSubmit} ref={formEl}>
      <FormElement>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={state.name}
          pattern="^[a-zA-Z]+(([' \-][a-zA-Z ])?[a-zA-Z]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          required
          autoComplete="off"
        />
      </FormElement>
      <FormElement>
        <label htmlFor="number">Number</label>
        <input
          type="tel"
          name="number"
          id="number"
          defaultValue={state.number}
          pattern="\+?\d{1,4}?[\-.\s]?\(?\d{1,3}?\)?[\-.\s]?\d{1,4}[\-.\s]?\d{1,4}[\-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          required
        />
      </FormElement>
      <div>
        <button type="submit">{state.id ? "Update" : "Add"} contact</button>
      </div>
    </Form>
  )
}

export default memo(ContactForm)

ContactForm.propTypes = {
  phoneBook: PropTypes.instanceOf(PhoneBook)
}
