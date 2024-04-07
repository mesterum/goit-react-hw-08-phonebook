import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";
import styled from "styled-components";
import { Contact } from "./App";

const Form = styled.form`
  border: solid currentColor 1px;
  padding: 0.5em;
`
type Form = HTMLFormElement & {
  elements: Record<"name" | "number", HTMLInputElement>
}
const FormElement = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
`;

type Props = { addContact: (name: string, number: string, id?: string) => boolean }
type State = {
  name: string,
  number: string,
  id: string
};
export default class ContactForm extends PureComponent<Props, State> {
  // static defaultProps = {};
  static propTypes = {
    addContact: PropTypes.func.isRequired
  };

  static initState: State = {
    name: '',
    number: '',
    id: ''
  }
  state = ContactForm.initState;

  updateContact = (contact: Contact) => {
    this.setState(contact);
    this.form.current?.reset();
    this.form.current?.elements.number.focus();
  }
  form = createRef<Form>();

  handleSubmit = (evt: React.FormEvent<Form>) => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const name = form.elements.name.value;
    const number = form.elements.number.value;
    console.log(name, number);
    if (!this.props.addContact(name, number, this.state.id)) {
      alert(`${name} is already in contacts`);
      return;
    }
    if (this.state.id) {
      this.setState(ContactForm.initState);
    }
    form.reset();
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} ref={this.form}>
        <FormElement>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={this.state.name}
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
            defaultValue={this.state.number}
            pattern="\+?\d{1,4}?[\-.\s]?\(?\d{1,3}?\)?[\-.\s]?\d{1,4}[\-.\s]?\d{1,4}[\-.\s]?\d{1,9}"
            title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
            required
          />
        </FormElement>
        <div>
          <button type="submit">Add contact</button>
        </div>
      </Form>
    )
  }
}



