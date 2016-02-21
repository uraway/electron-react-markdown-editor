import React, { Component, PropTypes } from 'react';

class EntryCategoryInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = ({ text: this.props.text || '' });
  }

  handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === 13) {
      this.props.onSave(text);
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  render() {
    const { text } = this.state;
    return (
      <input
        classNames="form-control nav-group-item"
        type="text"
        value={text}
        onChange={::this.handleChange}
        onKeyDown={::this.handleSubmit}
      />
    );
  }
}

EntryCategoryInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
};

export default EntryCategoryInput;
