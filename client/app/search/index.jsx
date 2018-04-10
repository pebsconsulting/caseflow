import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Footer from '@department-of-veterans-affairs/caseflow-frontend-toolkit/components/Footer';
import Link from '@department-of-veterans-affairs/caseflow-frontend-toolkit/components/Link';
import { COLORS } from '@department-of-veterans-affairs/caseflow-frontend-toolkit/util/StyleConstants';

import AppFrame from '../components/AppFrame';
import NavigationBar from '../components/NavigationBar';
import SearchBar from '../components/SearchBar';
// import PageRoute from '../components/PageRoute';

export default class Search extends React.PureComponent {
  render() {
    // TODO: Do I still need BrowserRouter?
    // TODO: Can I use AppSegment instead of these divs?
    // TODO: Style the horizontal rule.
    // TODO: Add the actions after PR 5108 is merged.
    return <BrowserRouter>
      <div>
        <NavigationBar
          userDisplayName={this.props.userDisplayName}
          dropdownUrls={this.props.dropdownUrls}
          appName=""
          defaultUrl="/"
          logoProps={{
            accentColor: '#f90',
            overlapColor: COLORS.GREY_DARK
          }} />
        <AppFrame>
          <div className="cf-app-width cf-app-segment cf-app-segment--alt">
            <div className="cf-help-content">
              <h1>Veteran Case Search</h1>
              <p>Enter a 9-digit Veteran ID to search for all available cases for a Veteran.</p>
              <SearchBar
                id="searchBarWelcome"
                size="big"
                submitUsingEnterKey
              />
              <hr />
              <p><Link href="/help">Caseflow Help</Link></p>
            </div>
          </div>
        </AppFrame>
        <Footer
          appName=""
          feedbackUrl={this.props.feedbackUrl}
          buildDate={this.props.buildDate} />
      </div>
    </BrowserRouter>;
  }
}
