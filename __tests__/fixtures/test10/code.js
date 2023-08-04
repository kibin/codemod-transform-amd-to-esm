import PropTypes from 'prop-types';
import React from 'react';
import IconContainer from './IconContainer';

exports.colors = {
    white: '#fff',
};

module.exports.container = IconContainer;

module.exports = class Arrow extends React.Component {

  static defaultProps = {
    color: '#000',
  };

  static propTypes = {
    color: PropTypes.string,
  };

  render () {
    return this.props;
  }
};