import React from 'react';
import Alert from '../../components/Alert';

const titles = {
  404: 'File number not found',
  422: 'Invalid file number',
  500: 'Something went wrong'
};

const messages = {
  404: 'We could not find the file number. This could be because we have no record of an appeal by that Veteran.',
  422: 'Check whether the file number is formatted correctly. It should be a number without letters or spaces.',
  500: 'Caseflow could not look up the appeals for this file number right now. Try again later.'
}

class FileNumberSearchError extends React.PureComponent {
  render() {
    const title = titles[this.props.error] || titles[500];
    const message = messages[this.props.error] || messages[500];

    return <Alert
      title={title}
      type="error">
      {message}
    </Alert>
  }
}

export default FileNumberSearchError;
