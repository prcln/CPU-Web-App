import React, { Component } from "react";
import "./Queues.css";
 
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class IOQueue extends Component {
    render() {
      const header1 = this.props.process ? "Process #" : "Job #";
      return (
        <div className="">
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
                  minWidth: 100
                },
                {
                  Header: "Burst (B)",
                  id: "IOBurst",
                  accessor: d => (d.NeededIOBurstTime - d.IOBurstTime),
                  minWidth: 100
                },
                {
                  Header: "Memory (M)",
                  id: "memory",
                  accessor: d => d.Memory,
                  minWidth: 120
                },
                {
                  Header: "Run Time (R)",
                  id: "Runtime",
                  accessor: d => (d.NeededRunTime - d.RunTime),
                  minWidth: 120
                }
              ]
            }
          //   defaultSorted={[
          //   {
          //     id: "IOBurst",
          //     desc: false
          //   }
          // ]}
          defaultPageSize={this.props.Count}
          // style={this.props.style}
          className="-striped -highlight"
        />
      </div>
      );
    }
  }

  export default IOQueue;


// WEBPACK FOOTER //
// ./src/pages/simulator/Queues/IOQueue.js