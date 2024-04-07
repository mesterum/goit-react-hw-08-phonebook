import PropTypes from "prop-types";
import { PureComponent } from "react";
import styled from "styled-components";

const Form = styled.form`
  border: solid currentColor 1px;
  padding: 0.5em;
`
const FormElement = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
`;

type Props = { addContact: (name: string, number: string) => void }
type State = {
  name: string,
  number: string
};
export default class ContactForm extends PureComponent<Props, State> {
  // static defaultProps = {};
  static propTypes = {
    addContact: PropTypes.func.isRequired
  };

  state = {
    name: '',
    number: ''
  }

  handleSubmit = (evt: React.FormEvent<HTMLFormElement &
  {
    elements: Record<"name" | "number", HTMLInputElement>
  }>) => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const name = form.elements.name.value;
    const number = form.elements.number.value;
    console.log(name, number);
    this.props.addContact(name, number);
    form.reset();
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
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



