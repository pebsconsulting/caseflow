import React from 'react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import { BrowserRouter, Route } from 'react-router-dom';
import AppFrame from '../components/AppFrame';
import PrimaryAppContent from '../components/PrimaryAppContent';
import IndexContainer from './containers/IndexContainer';
import DetailContainer from './containers/DetailContainer';

class StatusFrame extends React.PureComponent {
  render() {
    const appName = 'Status';

    const topMessage = null;

    return <BrowserRouter basename="/status">
      <div>
        <NavigationBar
          appName={appName}
          userDisplayName={this.props.userDisplayName}
          dropdownUrls={this.props.dropdownUrls}
          topMessage={topMessage}
          defaultUrl="/">
          <AppFrame>
            <PrimaryAppContent>
              <Route exact path="/" component={IndexContainer} />
              <Route exact path="/:vacolsId" component={(props) => (
                <DetailContainer vacolsId={props.match.params.vacolsId} />
              )} />
            </PrimaryAppContent>
          </AppFrame>
        </NavigationBar>
        <Footer
          appName={appName}
          feedbackUrl={this.props.feedbackUrl}
          buildDate={this.props.buildDate}
        />
      </div>
    </BrowserRouter>;
  }
}

export default StatusFrame;
