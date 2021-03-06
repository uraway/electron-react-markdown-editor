import React, { Component, PropTypes } from 'react';
import CategoryItemInput from './CategoryItemInput';

class CategoryItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { editing: false };
  }

  handleEditClick() {
    this.setState({ editing: true });
  }

  handleSave(id, text) {
    if (text.length === 0) {
      this.props.deleteCategoryItem(id);
    } else {
      this.props.editCategoryItem(id, text);
    }

    this.setState({ editing: false });
  }

  render() {
    const { item, addEntryCategory } = this.props;
    const { editing } = this.state;

    let element;
    if (editing) {
      element = (
        <CategoryItemInput
          text={item.text}
          editing={editing}
          onSave={(text) => this.handleSave(item.id, text)}
        />
      );
    } else {
      element = (
          <div>
            <button
              onClick={() => addEntryCategory(item.text)}
            >
            {item.text}
            </button>
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

CategoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  editCategoryItem: PropTypes.func.isRequired,
  deleteCategoryItem: PropTypes.func.isRequired,

  addEntryCategory: PropTypes.func.isRequired,
};

export default CategoryItem;
