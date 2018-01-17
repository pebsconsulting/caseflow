import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeGetActiveAppeal } from '../selectors';
import EventTable from '../components/EventTable';

class DetailContainer extends React.PureComponent {
  render() {
    return <div>
      <h1>{this.props.appeal.id}</h1>
      <h2>Current Status: {this.props.appeal.attributes.status.type}</h2>
      <div className="cf-help-divider"></div>
      <h2>Past Events</h2>
      <EventTable events={this.props.appeal.attributes.events} />
    </div>;
  }
}

const makeMapStateToProps = () => {
  const getActiveAppeal = makeGetActiveAppeal();
  const mapStateToProps = (state, props) => ({
    appeal: getActiveAppeal(state, props)
  });
  return mapStateToProps;
}

export default connect(
  makeMapStateToProps
)(DetailContainer);
