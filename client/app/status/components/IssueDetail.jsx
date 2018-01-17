import React from 'react';
import Table from '../../components/Table';
import _ from 'lodash';

const columns = [
  {
    header: 'Description',
    valueName: 'description'
  },
  {
    header: 'Last Action',
    valueName: 'lastAction'
  },
  {
    header: 'Date',
    valueName: 'date'
  }
];

class IssueDetail extends React.PureComponent {
  render() {
    const [open, closed] = _.partition(this.props.issues, (issue) => (issue.active));

    return <div>
      <h3>Open</h3>
        <Table
          columns={columns}
          rowObjects={open}
          slowReRendersAreOk
        />
      <h3>Closed</h3>
        <Table
          columns={columns}
          rowObjects={closed}
          slowReRendersAreOk
        />
    </div>;
  }
}

export default IssueDetail;
