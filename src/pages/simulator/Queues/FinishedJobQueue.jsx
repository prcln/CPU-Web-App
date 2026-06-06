import React, { Component } from "react";
import "./Queues.css";
 
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class FinishedJobQueue extends Component {
    render() {
      // const header1 = this.props.process ? "Process #" : "Job #";
      return (
        <div className="">
          <ReactTable 
            resizable={false}
            // sortable={false}
            showPagination={true}
            showPageJump={false}
            showPageSizeOptions={false}
            data={this.props.data}
            columns={[
                {
                  Header: "Process #",
                  accessor: "JobNumber",
                  minWidth: 100
                },
                {
                  Header: "Memory (M)",
                  id: "memory",
                  accessor: "Memory",
                  minWidth: 120
                },
                {
                    Header: "Finished (F)",
                    id: "TimeFinished",
                    accessor: d => (d.FinishTime),
                    minWidth: 120
                },
                {
                  Header: "Run Time (R)",
                  id: "RunTime",
                  accessor: d => (d.NeededRunTime),
                  minWidth: 120
                },
                {
                  Header: "Wait (W)",
                  id: "WaitTime",
                  accessor: d => (d.FinishTime - d.ArrivalTime - d.NeededRunTime),
                  minWidth: 100
                },
                {
                  Header: "Arrival (A)",
                  id: "Arrival",
                  accessor: d => (d.ArrivalTime),
                  minWidth: 120
                },
                {
                  Header: "Burst (B)",
                  id: "BurstIO",
                  accessor: d => (d.NeededIOBurstTime),
                  minWidth: 100
                }
              ]
            }
        //     defaultSorted={[
        //     {
        //       id: "arrivalTime",
        //       desc: false
        //     }
        //   ]}
          defaultPageSize={10}
          style={{
            height: "420px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          className="-striped -highlight"
          getTrProps={(state, rowInfo, column) => {
            if (rowInfo && rowInfo.original) {
              return {
                className: 'has-smart-tooltip',
                'data-tooltip': rowInfo.original.stateReason || ""
              };
            }
            return {};
          }}
        />
      </div>
      );
    }
  }

  export default FinishedJobQueue;


// WEBPACK FOOTER //
// ./src/pages/simulator/Queues/FinishedJobQueue.js