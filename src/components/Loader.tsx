import PropTypes from "prop-types";

import { Blocks } from 'react-loader-spinner';
import { styled } from "styled-components";
type Props = {
  hidden: boolean
  className?: string
}

function Loader({ hidden, className }: Props) {
  return <Blocks
    height="80"
    width="80"
    color="#4fa94d"
    ariaLabel="blocks-loading"
    wrapperStyle={{}}
    wrapperClass={className}
    visible={!hidden}
  />
}

export default styled(Loader)`
  display: block;
  margin-inline: auto;
`

/* Loader.defaultProps = {
  hidden: false
} */
Loader.propTypes = {
  hidden: PropTypes.bool,
  className: PropTypes.string
};