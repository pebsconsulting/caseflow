import React from 'react';
import Table from '../../components/Table';

const columns = [
  {
    header: 'Event',
    valueName: 'type'
  },
  {
    header: 'Date',
    valueName: 'date'
  }
];

class EventTable extends React.PureComponent {
  render() {
    return <Table
      columns={columns}
      rowObjects={this.props.events}
      slowReRendersAreOk
    />;
  }
}

export default EventTable;
