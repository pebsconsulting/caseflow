import React from 'react';

import Link from '@department-of-veterans-affairs/caseflow-frontend-toolkit/components/Link';

import SearchBar from '../components/SearchBar';

export default class SearchRootView extends React.Component {
  render() {
    return <div className="cf-help-content">
      <h1>Veteran Case Search</h1>
      <p>Enter a 9-digit Veteran ID to search for all available cases for a Veteran.</p>
      <SearchBar
        id="searchBarWelcome"
        size="big"
        submitUsingEnterKey
      />
      <hr />
      <p><Link to="/help">Caseflow Help</Link></p>
    </div>;
  }
}
