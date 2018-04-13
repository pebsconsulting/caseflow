import { css } from 'glamor';
import React from 'react';

import Link from '@department-of-veterans-affairs/caseflow-frontend-toolkit/components/Link';
import { COLORS } from '@department-of-veterans-affairs/caseflow-frontend-toolkit/util/StyleConstants';

import SearchBar from '../components/SearchBar';

const horizontalRuleStyling = css({
  border: 0,
  borderTop: `1px solid ${COLORS.GREY_LIGHT}`,
  margin: '4rem 0'
});

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
      <hr {...horizontalRuleStyling} />
      <p><Link to="/help">Caseflow Help</Link></p>
    </div>;
  }
}
