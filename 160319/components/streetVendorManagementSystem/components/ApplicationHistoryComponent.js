import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../streetVendorManagementSystem/styles/appplicationHistoryComponent.module.css";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// Table _ MR
const ApplicationHistoryComponent = (props) => {
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    console.log("authority", authority);
    if (props.serviceId && props.applicationId) {
      getNewMarriageRegistractionHistoryDetails();
    }
  }, []);

  const getNewMarriageRegistractionHistoryDetails = () => {
    axios
      .get(
        `${urls.MR}/transaction/prime/getApplicationByServiceIdApplicationId?serviceId=${props.serviceId}&applicationId=${props.applicationId}`,
      )
      .then((resp) => {
        setTableData(
          resp?.data?.applicantHistoryLst?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          }),
        );
      });
  };
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      //minWidth: 70,
    },
    {
      field: "senderName",
      // headerName: <FormattedLabel id="applicationNo" />,
      headerName: "Sent By User",
      flex: 1,
      // minWidth: 260,
    },
    {
      field: "remark",
      // headerName: <FormattedLabel id="applicationDate" />,
      headerName: "Remark",
      flex: 1,
      // minWwidth: 230,
    },

    {
      field: "sentDate",
      // headerName: <FormattedLabel id="ApplicantName" />,
      headerName: "Date",
      flex: 1,
      // minWidth: 240,
    },

    {
      field: "sentTime",
      // headerName: <FormattedLabel id="statusDetails" />,
      headerName: "Time",
      flex: 1,
      // minWidth: 280,
    },
  ];

  return (
    <>
      <DataGrid
        sx={{
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 15,
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
        density="compact"
        autoHeight
        scrollbarSize={17}
        rows={tableData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </>
  );
};
export default ApplicationHistoryComponent;
