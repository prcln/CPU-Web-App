import React, { Component } from "react";
import "./Queues.css";
 
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class SmallJobQueue extends Component {
    render() {
      const header1 = this.props.process ? "Process #" : "Job #";
      return (
        // <div className="">
          <ReactTable 
            resizable={false}
            sortable={false}
            showPagination={true}
            showPageJump={false}
            showPageSizeOptions={false}
            data={this.props.data}
            columns={[
                {
                  Header: header1,
                  accessor: "JobNumber",
                  minWidth: 100,
                  maxWidth: 100
                },
                {
                  Header: "Memory (M)",
                  id: "Memory",
                  accessor: d => d.Memory,
                  minWidth: 120,
                  maxWidth: 120
                },
                {
                    Header: "Run Time (R)",
                    id: "Runtime",
                    accessor: d => (d.NeededRunTime - d.RunTime),
                    minWidth: 120
                }
              ]
            }
        //     defaultSorted={[
        //     {
        //       id: "arrivalTime",
        //       desc: false
        //     }
        //   ]}
          defaultPageSize={3}
          // style={{
          //    height: "175px" // This will force the table body to overflow and scroll, since there is not enough room
          // }}
          className="-striped -highlight"
        />
      /* </div> */
      );
    }
  }

  export default SmallJobQueue;


// WEBPACK FOOTER //
// ./src/pages/simulator/Queues/SmallJobQueue.js