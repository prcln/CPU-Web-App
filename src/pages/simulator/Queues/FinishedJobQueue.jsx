import React, { Component } from "react";
import { t } from "../../../language/i18n";
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
                  Header: t("th_process"),
                  accessor: "JobNumber",
                  minWidth: 100
                },
                {
                  Header: t("th_memory"),
                  id: "memory",
                  accessor: "Memory",
                  minWidth: 120
                },
                {
                    Header: t("th_finished"),
                    id: "TimeFinished",
                    accessor: d => (d.FinishTime),
                    minWidth: 120
                },
                {
                  Header: t("th_runtime"),
                  id: "RunTime",
                  accessor: d => (d.NeededRunTime),
                  minWidth: 120
                },
                {
                  Header: t("th_wait"),
                  id: "WaitTime",
                  accessor: d => (d.FinishTime - d.ArrivalTime - d.NeededRunTime),
                  minWidth: 100
                },
                {
                  Header: t("th_arrival"),
                  id: "Arrival",
                  accessor: d => (d.ArrivalTime),
                  minWidth: 120
                },
                {
                  Header: t("th_burst"),
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
          previousText={t("table_prev")}
          nextText={t("table_next")}
          loadingText={t("table_loading")}
          noDataText={t("table_nodata")}
          pageText={t("table_page")}
          ofText={t("table_of")}
          rowsText={t("table_rows")}
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