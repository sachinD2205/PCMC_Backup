import { Button, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";

const Index = () => {
  const router = useRouter();
  const [dataSource, setDataSource] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [pageMode, setPageMode] = useState("Add");
  const language = useSelector((state) => state.labels.language);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // demandedBillandPaymentToAdvocate
  const getDemandedBill = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/demandedBillAndPaymentToAdvocate/getAll`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        },
      )
      .then((r) => {
        let result = r.data.demandedBillAndPaymentToAdvocate;

        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,

            srNo: i + 1,

            // courtCaseNumber: r.courtCaseNumber,
            // caseMainType: r.caseMainType,

            // courtName: r.courtName,

            // court: r.court,

            // courtNameEn: courtNames?.find((obj) => obj.id === r.court)
            //   ?.courtName,

            // courtNameMr: courtNames?.find((obj) => obj.id === r.court)?.courtMr,

            // stampNo: r.stampNo,

            // fillingDate: moment(r.fillingDate).format("YYYY-MM-DD"),

            advocateNameEn:
              r?.advocate?.firstName +
              " " +
              r?.advocate?.middleName +
              " " +
              r?.advocate?.lastName,

            advocateNameMar:
              r?.advocate?.firstName +
              " " +
              r?.advocate?.middleName +
              " " +
              r?.advocate?.lastName,

            // advocateName1: advocateNames?.find(
            //   (obj) => obj.id === r.advocateName,
            // )?.advocateName,

            // advocateNameMr: advocateNames?.find(
            //   (obj) => obj.id === r.advocateName,
            // )?.advocateNameMr,

            // filedBy: r.filedBy,

            // filedByMr: r.filedByMr,

            // filedAgainst: r.filedAgainst,
            // caseDetails: r.caseDetails,
            // caseMainType: r.caseMainType,

            // caseMainTypeName: caseTypes?.find(
            //   (obj) => obj.id === r.caseMainType,
            // )?.caseMainType,

            // subType: r.subType,
            // year: r.year,
            // opponentAdvocate: r.opponentAdvocate,
            // concernPerson: r.concernPerson,
            // appearanceDate: moment(r.appearanceDate).format("YYYY-MM-DD"),

            // // fillingDate: moment(r.fillingDate).format("YYYY-MM-DD"),

            // department: r.department,
            // priviouseCourtName: r.priviouseCourtName,

            // courtCaseNumber: r.courtCaseNumber,

            // caseEntry: r.caseEntry,
            // filedAgainstMr: r.filedAgainstMr,

            // opponentAdvocateMr: r.opponentAdvocateMr,
            // concernPersonMr: r.concernPersonMr,

            // fixAmount: r.fixAmount,

            // paidAmountDate: moment(r.paidAmountDate).format("YYYY-MM-DD"),

            // pendingAmount: r.pendingAmount,
            // paidAmount: r.paidAmount,
            // caseNumber: r.caseNumber,
            // caseRefnceNo: r.caseRefnceNo,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  // colulmns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id='srNo' />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      headerName: "Advocate Name",
      field: "advocateName",
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      headerName: "Court Case Number",
      field: "courtCaseNumber",
      width: 190,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Case Type",
      field: "caseType",
      width: 170,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    ,
    {
      headerName: "Case-Sub Type",
      field: "advocateNcaseSubType",
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      headerName: "Payment",
      field: "payment",
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      headerName: "Paid Amount",
      field: "paidAmount",
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      headerName: "Bill Amount",
      field: "billAmount",
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  // ------------------- useEffect ---------------

  useEffect(() => {
    getDemandedBill();
  }, []);

  // view
  return (
    <>
      <Paper component={Box} elevation={5} padding='40px'>
        {/** Heading */}
        <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginBottom: 40,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "50px",
            marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <strong style={{ display: "flex", justifyContent: "center" }}>
            Advocate Bill
          </strong>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginRight: "3vh",
          }}
        >
          {/** AddButton */}
          <Button
            variant='contained'
            onClick={() => {
              localStorage.removeItem("pageMode");
              localStorage.removeItem("attachments");
              localStorage.removeItem("billDetail");
              localStorage.setItem("role", "BillCreate");
              localStorage.setItem("buttonInputStateNew", true);
              router.push({
                pathname: "/LegalCase/transaction/demandedBillToAdvocate/view",
                query: {
                  pageMode: "Add",
                },
              });
            }}
          >
            <FormattedLabel id='add' />
          </Button>
        </div>
        {/** Table */}
        <DataGrid
          // disableColumnFilter
          // disableColumnSelector
          // disableToolbarButton
          // disableDensitySelector
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              // printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              // csvOptions: { disableToolbarButton: true },
            },
          }}
          autoHeight
          sx={{
            margin: "20px",
            marginRight: "20px",
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
          density='compact'
          // autoHeight={true}
          // rowHeight={50}
          pagination
          paginationMode='server'
          // loading={data.loading}
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            // getCaseType(data.pageSize, _data);
            getDemandedBill(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            // updateData("page", 1);
            getDemandedBill(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
