import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

const BillDetails = () => {
  const language = useSelector((state) => state.labels.language);
  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  // columns
  const columns = [
    {
      field: "srNo",
      id: 1,
      headerName: <FormattedLabel id='srNo' />,
      flex: 1,
    },
    {
      field: "caseNumberName",
      headerName: <FormattedLabel id='courtCaseNo' />,
      flex: 1,
      id: 2,
    },
    {
      field: language == "en" ? "caseMainTypeEng" : "caseMainTypeMar",
      id: 3,
      headerName: <FormattedLabel id='caseType' />,
      //type: "number",
      flex: 1,
    },

    {
      field: language === "en" ? "caseSubTypeEng" : "caseSubTypeMar",
      id: 4,
      headerName: <FormattedLabel id='caseSubType' />,
      flex: 1,
    },
    {
      field: "caseFees" !== null ? "caseFees" : "",
      id: 5,
      headerName: <FormattedLabel id='caseFees' />,
      flex: 1,
    },
    {
      field: "feesAmount" !== null ? "feesAmount" : "",
      id: 6,
      headerName: <FormattedLabel id='feesAmount' />,
      flex: 1,
    },

    {
      field: "approvalAmount" !== null ? "approvalAmount" : "",
      id: 7,
      headerName: <FormattedLabel id='approvalFeesAmount' />,
      // hide: approvalAmountTableState,
      flex: 1,
    },
    {
      headerName: <FormattedLabel id='paidFees' />,
      field: "paidFees" !== null ? "paidFees" : "",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  // // useEffect - Testin
  useEffect(() => {
    if (dataSource1.length == 0) {
      setDataSource([]);
    } else {
      setDataSource(
        dataSource1?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
          };
        }),
      );
    }
  }, [dataSource1]);

  useEffect(() => {
    if (dataSource.length !== 0) {
      localStorage.setItem("billDetail", JSON.stringify(dataSource));
    }
  }, [dataSource]);

  useEffect(() => {
    if (localStorage.getItem("billDetail") !== "null") {
      setDataSource(JSON.parse(localStorage.getItem("billDetail")));
    }
  }, []);

  // View
  return (
    <>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 20,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "50px",
          marginRight: "75px",
          borderRadius: 100,
        }}
      >
        <strong style={{ display: "flex", justifyContent: "center" }}>
          <FormattedLabel id='paymentDetails' />
        </strong>
      </div>
      <div style={{ margin: "30px" }}>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          // disableToolbarButton
          disableDensitySelector
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              csvOptions: { disableToolbarButton: true },
            },
          }}
          autoHeight
          sx={{
            overflowY: "scroll",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          columns={columns}
          rows={dataSource}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          getRowId={(row) => row.srNo}
        />
      </div>
    </>
  );
};

export default BillDetails;
