import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import { ipcRenderer } from 'electron';

import InputArea from '../components/InputArea';
import PreviewArea from '../components/PreviewArea';
import Footer from '../components/Footer';
import LeftNav from '../components/LeftNav';
import HatenaForm from '../components/HatenaForm';
import HatenaList from '../components/HatenaList';

class EditorPage extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      markdown: '# This is markdown editor powered by Electron and React-Redux',
      isShowLeftNav: false,
      isShowHatenaForm: false,
      isShowHatenaList: false,
    });
  }

  componentDidMount() {
    ipcRenderer.on('fileContent', (event, fileData) => {
      this.updateMarkdown(fileData);
    });
    ipcRenderer.on('saveFile', () => {
      ipcRenderer.send('contentToSave', this.state.markdown);
    });
  }

  updateMarkdown(md) {
    this.setState({ markdown: md });
  }

  handleToggleLeftNav() {
    if (this.state.isShowLeftNav) {
      // hide all nav
      this.setState({
        isShowLeftNav: false,
        isShowHatenaForm: false,
        isShowHatenaList: false,
      });
    } else {
      this.setState({
        isShowLeftNav: true,
        isShowHatenaForm: false,
        isShowHatenaList: false,
      });
    }
  }

  handleToggleHatenaForm() {
    if (this.state.isShowHatenaForm) {
      this.setState({
        isShowHatenaForm: false,
        isShowLeftNav: true,
        isShowHatenaList: false,
      });
    } else {
      this.setState({
        isShowHatenaForm: true,
        isShowLeftNav: false,
        isShowHatenaList: false,
      });
    }
  }

  handleToggleHatenaList() {
    if (this.state.isShowHatenaList) {
      this.setState({
        isShowLeftNav: false,
        isShowHatenaForm: true,
        isShowHatenaList: false,
      });
    } else {
      this.setState({
        isShowLeftNav: false,
        isShowHatenaForm: false,
        isShowHatenaList: true,
      });
    }
  }

  render() {
    const { isShowLeftNav, isShowHatenaForm, isShowHatenaList, markdown } = this.state;
    const { actions, categoryItems, entryCategory, hatenaEntry } = this.props;

    let leftNav;
    if (isShowLeftNav) {
      leftNav = (
          <LeftNav
            className="pane-group"
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
          newEntry
          markdown={markdown}
          categoryItems={categoryItems}
          actions={actions}
          entryCategory={entryCategory}
          toggleHatenaForm={::this.handleToggleHatenaForm}
          toggleHatenaList={::this.handleToggleHatenaList}
        />
      );
    } else {
      hatenaForm = null;
    }

    let hatenaList;
    if (isShowHatenaList) {
      hatenaList = (
        <HatenaList
          toggleHatenaList={::this.handleToggleHatenaList}
          hatenaEntry={hatenaEntry}
          {...actions}
          updateMarkdown={::this.updateMarkdown}
        />
      );
    } else {
      hatenaList = null;
    }

    return (
      <div className="window">

        <div className="window-content">
          <div className="pane-group">

            {leftNav}
            {hatenaForm}
            {hatenaList}

            <div className="pane">
              <InputArea
                {...actions}
                updateMarkdown={::this.updateMarkdown}
                markdown={markdown}
              />
            </div>

            <div className="pane">
              <PreviewArea
                markdown={markdown}
              />
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
  hatenaEntry: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    categoryItems: state.categoryItems,
    entryCategory: state.entryCategory,
    hatenaEntry: state.hatenaEntry,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(EditorActions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorPage);
