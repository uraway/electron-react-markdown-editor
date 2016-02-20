import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import { ipcRenderer } from 'electron';

import InputArea from '../components/InputArea';
import PreviewArea from '../components/PreviewArea';
import Footer from '../components/Footer';
import LeftNav from '../components/LeftNav';
import HatenaForm from '../components/HatenaForm';

class EditorPage extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      content: '# This is markdown',
      isShowLeftNav: false,
      isShowHatenaForm: false,
    });
  }

  componentDidMount() {
    ipcRenderer.on('fileContent', (event, fileData) => {
      this.setState({ content: fileData });
    });
    ipcRenderer.on('saveFile', () => {
      ipcRenderer.send('contentToSave', this.state.content);
    });
  }

  handleToggleLeftNav() {
    if (this.state.isShowLeftNav) {
      // hide all nav
      this.setState({
        isShowLeftNav: false,
        isShowHatenaForm: false,
      });
    } else {
      this.setState({ isShowLeftNav: true });
    }
  }

  handleUserInput(newContent) {
    this.setState({ content: newContent });
  }

  handleToggleHatenaForm() {
    if (this.state.isShowHatenaForm) {
      this.setState({ isShowHatenaForm: false });
    } else {
      this.setState({ isShowHatenaForm: true });
    }
  }

  render() {
    const { content, isShowLeftNav, isShowHatenaForm } = this.state;
    const { actions, categoryItems, entryCategory } = this.props;

    let leftNav;
    if (isShowLeftNav) {
      leftNav = (
          <LeftNav
            actions={actions}
            categoryItems={categoryItems}
            toggleHatenaForm={::this.handleToggleHatenaForm}
          />
      );
    } else {
      leftNav = null;
    }

    let hatenaForm;
    if (isShowHatenaForm) {
      hatenaForm = (
        <HatenaForm
          categoryItems={categoryItems}
          content={content}
          actions={actions}
          entryCategory={entryCategory}
        />
      );
    } else {
      hatenaForm = null;
    }

    return (
      <div className="window">

        <div className="window-content">
          <div className="pane-group">

            {leftNav}
            {hatenaForm}
            <div className="pane">
              <InputArea content={content} onUserInput={::this.handleUserInput} />
            </div>

            <div className="pane">
              <PreviewArea content={content}/>
            </div>

          </div>
        </div>

        <Footer className="toolbar toolbar-footer" toggleLeftNav={::this.handleToggleLeftNav}/>

      </div>
    );
  }
}

import * as EditorActions from '../actions';

EditorPage.propTypes = {
  actions: PropTypes.object.isRequired,
  categoryItems: PropTypes.array.isRequired,
  entryCategory: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    categoryItems: state.categoryItems,
    entryCategory: state.entryCategory,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(EditorActions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorPage);
