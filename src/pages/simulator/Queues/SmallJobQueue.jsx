import React, { Component } from "react";
import { t } from "../../../language/i18n";
import "./Queues.css";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class SmallJobQueue extends Component {
  render() {
    const header1 = this.props.process ? t("th_process") : t("th_job");
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
            Header: t("th_memory"),
            id: "Memory",
            accessor: d => d.Memory,
            minWidth: 120,
            maxWidth: 120
          },
          {
            Header: t("th_runtime"),
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
      /* </div> */
    );
  }
}

export default SmallJobQueue;


// WEBPACK FOOTER //
// ./src/pages/simulator/Queues/SmallJobQueue.js