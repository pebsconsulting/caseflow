import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeGetActiveAppeal } from '../selectors';
import IssueDetail from '../components/IssueDetail';
import EventTable from '../components/EventTable';

class DetailContainer extends React.PureComponent {
  render() {
    return <div>
      <h1>JOE SNUFFY's {this.props.appeal.attributes.programArea} appeal</h1>
      <p><strong>id:</strong> {this.props.appeal.id}</p>
      <p><strong>updated:</strong> {this.props.appeal.attributes.updated}</p>
      <p><strong>active:</strong> {booleanToString(this.props.appeal.attributes.active)}</p>
      <p><strong>incompleteHistory:</strong> {booleanToString(this.props.appeal.attributes.incompleteHistory)}</p>
      <p><strong>aoj:</strong> {this.props.appeal.attributes.aoj}</p>
      <p><strong>programArea:</strong> {this.props.appeal.attributes.programArea}</p>
      <p><strong>description:</strong> {this.props.appeal.attributes.description}</p>
      <p><strong>type:</strong> {this.props.appeal.attributes.type}</p>
      <p><strong>aod:</strong> {booleanToString(this.props.appeal.attributes.aod)}</p>
      <p><strong>location:</strong> {this.props.appeal.attributes.location}</p>
      <div className="cf-help-divider"></div>
      <h2>Status</h2>
      <p>{this.props.appeal.attributes.status.type}</p>
      <div className="cf-help-divider"></div>
      <h2>Issues</h2>
      <IssueDetail issues={this.props.appeal.attributes.issues} />
      <div className="cf-help-divider"></div>
      <h2>Past Events</h2>
      <EventTable events={this.props.appeal.attributes.events} />
    </div>;
  }
}

const booleanToString = (bool) => (bool ? "true" : "false");

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
