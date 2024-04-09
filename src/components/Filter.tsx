import PropTypes from "prop-types";
// import styled from "styled-components";

type Props = { filter: string, setFilter: (filter: string) => void }

export default function Filter(props: Props) {
  return (
    <label>
      Find contacts by name<br />
      <input value={props.filter} onChange={e => props.setFilter(e.target.value)} id="search" />
    </label>
  )
}

Filter.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};