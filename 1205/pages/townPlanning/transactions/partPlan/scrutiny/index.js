// /marriageRegistration/transactions/newMarriageRegistration/scrutiny/index.js
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
// Table _ MR
const Index = () => {
  let created = [];
  let checklist = [];
  let apptScheduled = [];
  let clkVerified = [];
  let cmolaKonte = [];
  let cmoVerified = [];
  let loiGenerated = [];
  let cashier = [];
  let paymentCollected = [];
  let certificateGenerated = [];
  let certificateIssued = [];
  let merged = [];

  const router = useRouter();
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [loadderState, setLoadderState] = useState(true);
  const [serviceId, setServiceId] = useState(null);
  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.serviceId;
    console.log("serviceId-<>", service);
    console.log("auth0000", auth);
    setAuthority(auth);
    setServiceId(service);
  }, [selectedMenuFromDrawer, user?.menus]);

  // Get Table - Data
  // const getNewMarriageRegistractionDetails = () => {
  //   console.log("loader", loadderState);
  //   // setLoadderState(true);
  //   console.log("userToken", user.token);
  //   axios
  //     .get(`${urls.MR}/transaction/applicant/getapplicantDetails?serviceId=${serviceId}`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //     .then((resp) => {
  //       // setLoadderState(false);
  //       if (authority.includes("DOCUMENT_CHECKLIST") || authority.includes("ADMIN")) {
  //         console.log("APPLICATION_CREATED");
  //         created = resp.data.filter((data) =>
  //           ["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(data.applicationStatus),
  //         );
  //       }
  //     });
  // };

  // useEffect(() => {
  //   console.log("authority", authority);
  //   if (authority) {
  //     getNewMarriageRegistractionDetails();
  //   }
  // }, [authority]);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 260,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 130,
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: "applicantName",
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 240,
      headerAlign: "center",
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 280,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return <></>;
      },
    },
  ];
  // useEffect(() => {}, [loadderState]);
  return (
    <>
      {/* {loadderState ? (
        <Loader />
      ) : ( */}
      <Paper
        sx={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 10,
          padding: 1,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <br />
        <div className={styles.detailsTABLE}>
          <div className={styles.h1TagTABLE}>
            <h2
              style={{
                fontSize: "20",
                color: "white",
                marginTop: "7px",
              }}
            >
              Part Map
              {/* {<FormattedLabel id="newMRtable" />} */}
            </h2>
          </div>
        </div>
        {/* <div className={styles.titleM}>
          <Typography variant="h4" display="block" gutterBottom>
            {<FormattedLabel id="newMRtable" />}
          </Typography>
        </div> */}
        <br />

        <DataGrid
          rowHeight={70}
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
      </Paper>
      {/* )} */}
    </>
  );
};
export default Index;
