import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import _ from 'lodash';

import StringUtil from '../util/StringUtil';
import {
  updateAppealIssue,
  startEditingAppealIssue,
  cancelEditingAppealIssue,
  saveEditedAppealIssue
} from './QueueActions';
import { highlightInvalidFormItems } from './uiReducer/uiActions';

import decisionViewBase from './components/DecisionViewBase';
import SearchableDropdown from '../components/SearchableDropdown';
import TextField from '../components/TextField';
import Button from '../components/Button';

import {
  fullWidth,
  ISSUE_INFO,
  ERROR_FIELD_REQUIRED
} from './constants';
const marginTop = css({ marginTop: '5rem' });
const dropdownMarginTop = css({ marginTop: '2rem' });
const smallBottomMargin = css({ marginBottom: '1rem' });
const noLeftPadding = css({ paddingLeft: 0 });

class AddEditIssueView extends React.Component {
  componentDidMount = () => {
    const {
      issueId,
      vacolsId
    } = this.props;

    this.props.startEditingAppealIssue(vacolsId, issueId);
  };

  getFooterButtons = () => [{
    displayText: '< Go back to Select Dispositions'
  }, {
    displayText: 'Save'
  }];

  updateIssue = (attributes) => {
    this.props.highlightInvalidFormItems(false);
    this.props.updateAppealIssue(
      this.props.vacolsId,
      this.props.issueId,
      attributes
    );
  };

  updateIssueCode = (codeIdx, code) => {
    const codes = _.clone(this.props.issue.codes);

    // remove more-specific issue levels on change
    // i.e. on change Issue, remove all Levels
    codes.splice(codeIdx, codes.length - codeIdx, code);

    this.updateIssue({ codes });
  };

  getIssueValue = (value) => _.get(this.props.issue, value, '');

  goToPrevStep = () => {
    this.props.cancelEditingAppealIssue();

    return true;
  };

  validateForm = () => {
    const {
      issue: {
        program,
        type,
        codes
      }
    } = this.props;

    const fieldsToCheck = _.clone(codes);

    const issues = _.get(ISSUE_INFO[program], 'issue', {});
    const issueLevels1 = _.get(issues, `${type}.levels`, {});
    const issueLevels2 = _.get(issueLevels1, `${_.get(codes, 2)}.levels`, {});
    const issueLevels3 = _.get(issueLevels2, `${_.get(codes, 3)}.levels`, {});

    _.each([issueLevels1, issueLevels2, issueLevels3], (level, idx) => {
      // if available options for level, confirm value is set in codes
      if (!_.isEmpty(level) && !(codes[idx + 2] in level)) {
        fieldsToCheck.push(codes[idx + 2]);
      }
    });

    return _.every(fieldsToCheck);
  };

  goToNextStep = () => {
    this.props.saveEditedAppealIssue(this.props.vacolsId, this.props.issueId);

    return true;
  };

  renderIssueAttrs = (attrs = {}) => _.map(attrs, (obj, value) => ({
    label: obj.description,
    value
  }));

  render = () => {
    const {
      issue: {
        program,
        type,
        codes
      },
      action,
      highlight
    } = this.props;

    const programs = ISSUE_INFO;
    const issues = _.get(programs[program], 'issue');
    const issueLevels1 = _.get(issues, `${type}.levels`);
    const issueLevels2 = _.get(issueLevels1, `${_.get(codes, 2)}.levels`);
    const issueLevels3 = _.get(issueLevels2, `${_.get(codes, 3)}.levels`);

    // only highlight invalid fields with options (i.e. not disabled)
    const errorHighlightConditions = {
      program: highlight && !program,
      type: highlight && !type,
      level1: highlight && !codes[2] && !_.isUndefined(issueLevels1),
      level2: highlight && !codes[3] && !_.isUndefined(issueLevels2),
      level3: highlight && !codes[4] && !_.isUndefined(issueLevels3)
    };

    return <React.Fragment>
      <h1 className="cf-push-left" {...css(fullWidth, smallBottomMargin)}>
        {StringUtil.titleCase(action)} Issue
      </h1>
      <Button
        willNeverBeLoading
        styling={noLeftPadding}
        classNames={['cf-btn-link']}
        onClick={_.noop}>
        Delete Issue
      </Button>
      <SearchableDropdown
        required
        name="Program:"
        styling={dropdownMarginTop}
        placeholder="Select program"
        options={this.renderIssueAttrs(programs)}
        onChange={({ value }) => this.updateIssue({ program: value })}
        errorMessage={errorHighlightConditions.program ? ERROR_FIELD_REQUIRED : ''}
        value={program} />
      <SearchableDropdown
        required
        name="Issue:"
        styling={dropdownMarginTop}
        placeholder="Select issue"
        options={this.renderIssueAttrs(issues)}
        onChange={({ value }) => this.updateIssue({
          type: value,
          // unset issue levels for validation
          codes: _.take(codes, 2)
        })}
        errorMessage={errorHighlightConditions.type ? ERROR_FIELD_REQUIRED : ''}
        value={type} />
      <SearchableDropdown
        name="Add Stay:"
        styling={dropdownMarginTop}
        placeholder="No current stays"
        readOnly
        onChange={({ value }) => this.updateIssue({ stay: value })}
        value={this.getIssueValue('stay')} />
      <h3 {...marginTop}>Subsidiary Questions or Other Tracking Identifier(s)</h3>
      <SearchableDropdown
        name="Level 1:"
        styling={dropdownMarginTop}
        placeholder="Select level 1"
        options={this.renderIssueAttrs(issueLevels1)}
        onChange={({ value }) => this.updateIssueCode(2, value)}
        readOnly={_.isUndefined(issueLevels1)}
        errorMessage={errorHighlightConditions.level1 ? ERROR_FIELD_REQUIRED : ''}
        value={this.getIssueValue('codes[2]')} />
      <SearchableDropdown
        name="Level 2:"
        styling={dropdownMarginTop}
        placeholder="Select level 2"
        options={this.renderIssueAttrs(issueLevels2)}
        onChange={({ value }) => this.updateIssueCode(3, value)}
        readOnly={_.isUndefined(issueLevels2)}
        errorMessage={errorHighlightConditions.level2 ? ERROR_FIELD_REQUIRED : ''}
        value={this.getIssueValue('codes[3]')} />
      <SearchableDropdown
        name="Level 3:"
        styling={dropdownMarginTop}
        placeholder="Select level 3"
        options={this.renderIssueAttrs(issueLevels3)}
        onChange={({ value }) => this.updateIssueCode(4, value)}
        readOnly={_.isUndefined(issueLevels3)}
        errorMessage={errorHighlightConditions.level3 ? ERROR_FIELD_REQUIRED : ''}
        value={this.getIssueValue('codes[4]')} />
      <TextField
        name="Notes:"
        value={this.getIssueValue('note')}
        onChange={(value) => this.updateIssue({ note: value })} />
    </React.Fragment>;
  };
}

AddEditIssueView.propTypes = {
  action: PropTypes.oneOf(['add', 'edit']).isRequired,
  vacolsId: PropTypes.string.isRequired,
  nextStep: PropTypes.string.isRequired,
  prevStep: PropTypes.string.isRequired,
  issueId: PropTypes.string.isRequired,
  appeal: PropTypes.object,
  issue: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
  highlight: state.ui.highlightFormItems,
  appeal: state.queue.pendingChanges.appeals[ownProps.vacolsId],
  issue: state.queue.pendingChanges.editingIssue
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateAppealIssue,
  startEditingAppealIssue,
  cancelEditingAppealIssue,
  saveEditedAppealIssue,
  highlightInvalidFormItems
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(decisionViewBase(AddEditIssueView));