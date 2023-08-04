import PropTypes from "prop-types";
import React from "react";
import IconContainer from "./IconContainer";
export const colors = {
  white: "#fff",
};
export const container = IconContainer;
export default (class Arrow extends React.Component {
  static defaultProps = {
    color: "#000",
  };

  static propTypes = {
    color: PropTypes.string,
  };

  render() {
    return this.props;
  }
});