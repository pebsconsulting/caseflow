import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchBar from '../../components/SearchBar';
import Alert from '../../components/Alert';
import FileNumberSearchError from '../components/FileNumberSearchError';
import AppealHistoryTable from '../components/AppealHistoryTable';
import { doFileNumberSearch, setFileNumberSearch } from '../actions';
import { REQUEST_STATE } from '../constants';

class IndexContainer extends React.PureComponent {
  handleSearchSubmit = () => (
    this.props.doFileNumberSearch(this.props.fileNumberSearchInput)
  )

  clearSearch = () => this.props.setFileNumberSearch('')

  render() {
    console.log(this.props)
    return <div>
      <h1>
        Look up an appeal
      </h1>
      <p>
        Enter the Veteran’s file number into the search bar below.
      </p>
      <SearchBar
        size="small"
        onSubmit={this.handleSearchSubmit}
        onChange={this.props.setFileNumberSearch}
        onClearSearch={this.clearSearch}
        value={this.props.fileNumberSearchInput}
        loading={this.props.fileNumberSearchRequestStatus === REQUEST_STATE.IN_PROGRESS}
        submitUsingEnterKey
      />
      { this.props.fileNumberSearchRequestStatus === REQUEST_STATE.FAILED &&
        <FileNumberSearchError error={this.props.fileNumberSearchRequestError} />
      }
      { this.props.appealHistory &&
        <div>
          <div className="cf-help-divider"></div>
          <h2>[VETERAN NAME]</h2>
          <AppealHistoryTable appeals={this.props.appealHistory.data} />
        </div>
      }
    </div>;
  }
}

const mapStateToProps = (state) => ({
  appealHistory: state.appealHistory,
  fileNumberSearchInput: state.fileNumberSearch,
  fileNumberSearchRequestStatus: state.requests.fileNumberSearch.status,
  fileNumberSearchRequestError: state.requests.fileNumberSearch.error
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  doFileNumberSearch,
  setFileNumberSearch
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexContainer);
