import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';

const columns = [
  {
    header: 'Program Area',
    valueFunction: (appeal) => appeal.attributes.programArea
  },
  {
    header: 'Status',
    valueFunction: (appeal) => appeal.attributes.status.type
  },
  {
    header: 'Last Event Date',
    valueFunction: (appeal) => _(appeal.attributes.events).map('date').max()
  },
  {
    header: 'More Information',
    align: 'right',
    valueFunction: (appeal) => <Link to={`/${appeal.id}`}>View Appeal»</Link>
  }
];

const rowClassNames = (appeal) => (appeal.active ? '' : 'cf-gray');

class AppealHistoryTable extends React.PureComponent {
  render() {
    return <Table
      columns={columns}
      rowObjects={this.props.appeals}
      rowClassNames={rowClassNames}
      slowReRendersAreOk
    />;
  }
}

export default AppealHistoryTable;
