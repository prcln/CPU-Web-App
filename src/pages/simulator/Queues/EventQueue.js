import React, { Component } from "react";
import "./Queues.css";
 
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class EventQueue extends Component {
  constructor() {
    super();
    this.render = this.render.bind(this);
    this.getTime = this.getTime.bind(this);
    this.state = {time: ''};
  }
  
  componentDidMount() {
      this._interval = setInterval(() => this.setState({time: this.getTime()}), 1000);
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  getTime(){
    let t = new Date();
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
  }
  componentDidUpdate() {
    //console.log("EventQueue Updated");
  }
  render() {
      return (
        // <div className="eventTable">
        //   <h2 className="fixed"><center>Incoming Event Queue</center></h2>
          <ReactTable 
            resizable={false}
            sortable={false}
            showPagination={true}
            showPageJump={false}
            showPageSizeOptions={false}
            data={this.props.data}
            columns={[
                {
                  Header: "Type",
                  accessor: "type",
                  minWidth: 60,
                  maxWidth: 60
                },
                {
                  Header: "Arrival",
                  id: "arrivalTime",
                  accessor: d => d.arrivalTime,
                  minWidth: 80,
                  maxWidth: 80
                },
                {
                    Header: "Details",
                    id: "details",
                    accessor: d => d.description,
                    minWidth: 220
                }
              ]
            }
          //   defaultSorted={[
          //   {
          //     id: "arrivalTime",
          //     desc: false
          //   }
          // ]}
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 20, 25, 50, 100]}
          style={{
            height: "420px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          className="-striped -highlight"
        />
      // </div>
      );
    }
  }

  export default EventQueue;


// WEBPACK FOOTER //
// ./src/pages/simulator/Queues/EventQueue.js