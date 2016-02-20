import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

class CategoryItemInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = ({ text: this.props.text || '' });
  }

  handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === 13) {
      this.props.onSave(text);
      if (this.props.newItem) {
        this.setState({ text: '' });
      }
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleBlur(e) {
    if (!this.props.newItem) {
      this.props.onSave(e.target.value);
    }
  }

  render() {
    const { text } = this.state;
    const { editing, newItem, placeholder } = this.props;
    return (
      <input
        classNames="form-control"
        type="text"
        placeholder={placeholder}
        autoFocus
        value={text}
        onBlur={::this.handleBlur}
        onChange={::this.handleChange}
        onKeyDown={::this.handleSubmit}
      />
    );
  }
}

CategoryItemInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
  newItem: PropTypes.bool,
};

export default CategoryItemInput;
