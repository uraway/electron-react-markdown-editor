import React, { Component, PropTypes } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/markdown';
import 'brace/theme/terminal';

class InputArea extends Component {

  static propTypes = {
    content: PropTypes.string,
    onUserInput: PropTypes.func.isRequired,
  };

  handleChange(newContent) {
    this.props.onUserInput(newContent);
  }

  render() {
    const { content } = this.props;
    return (
        <AceEditor
          className="input-area"
          mode="markdown"
          theme="terminal"
          name="UNIQUE_ID_OF_DIV"
          value={content}
          onChange={::this.handleChange}
          maxLines={9999}
          minLines={100}
          showPrintMargin
          showGutter
          highlightActiveLine
          editorProps={{ $blockScrolling: Infinity }}
          width="100%"
          wrapEnabled
        />
    );
  }
}

export default InputArea;
