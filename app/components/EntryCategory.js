import React, { Component, PropTypes } from 'react';
import EntryCategoryInput from './EntryCategoryInput';

class EntryCategory extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { editing: false };
  }

  handleEditClick() {
    this.setState({ editing: true });
  }

  handleSave(id, text) {
    if (text.length === 0) {
      this.props.deleteEntryCategory(id);
    } else {
      this.props.editEntryCategory(id, text);
    }

    this.setState({ editing: false });
  }

  render() {
    const { item } = this.props;
    const { editing } = this.state;

    let element;
    if (editing) {
      element = (
        <EntryCategoryInput
          text={item.text}
          editing={editing}
          onSave={(text) => this.handleSave(item.id, text)}
        />
      );
    } else {
      element = (
        <div>
          {item.text}
          <span onClick={::this.handleEditClick} className="icon icon-pencil pull-right"></span>
        </div>
      );
    }

    return (
      <span>
        {element}
      </span>
    );
  }
}

EntryCategory.propTypes = {
  item: PropTypes.object.isRequired,
  editEntryCategory: PropTypes.func.isRequired,
  deleteEntryCategory: PropTypes.func.isRequired,
};

export default EntryCategory;
