import React, { Component, PropTypes } from 'react';
import marked from 'marked';

class PreviewArea extends Component {
  static propTypes = {
    content: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  rawMarkup() {
    const rawMarkup = marked(this.props.content,
      {
        sanitize: true,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        smartLists: true,
        smartypants: true,
      });
    return { __html: rawMarkup };
  }

  render() {
    return (
      <div
        className="preview-area markdown-body"
        dangerouslySetInnerHTML={this.rawMarkup()}
      />
    );
  }
}

export default PreviewArea;
