import React, { Component } from "react";
import { t } from "../../../language/i18n";
import "./Queues.css";
 
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class IOQueue extends Component {
    render() {
      const header1 = this.props.process ? t("th_process") : t("th_job");
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
                  Header: t("th_burst"),
                  id: "IOBurst",
                  accessor: d => (d.NeededIOBurstTime - d.IOBurstTime),
                  minWidth: 100
                },
                {
                  Header: t("th_memory"),
                  id: "memory",
                  accessor: d => d.Memory,
                  minWidth: 120
                },
                {
                  Header: t("th_runtime"),
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

  export default IOQueue;


// WEBPACK FOOTER //
// ./src/pages/simulator/Queues/IOQueue.js