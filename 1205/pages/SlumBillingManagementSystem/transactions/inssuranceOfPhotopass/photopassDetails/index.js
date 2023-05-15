import React, { useEffect, useState } from "react";
import router from "next/router";
import styles from "../../sbms.module.css";
import {
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  IconButton,
  Box,
  Tooltip,
  Grid,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import PaymentIcon from '@mui/icons-material/Payment';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/slumManagementSchema/photopassDetailsSchema";
import Loader from "../../../../../containers/Layout/components/Loader";


const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [dataSource, setDataSource] = useState({});
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [loading, setLoading] = useState(false);

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  useEffect(() => {
    getAllPhotopassData();
  }, []);

  // get all photopass data

  const getAllPhotopassData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);

    if (loggedInUser === "citizenUser") {
      axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getAll`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: {
            UserId: user.id,
          },
        })
        .then((r) => {
          console.log("result", r.data);
          setLoading(false);
          let result = r.data.trnIssuePhotopassList;
          let _res = result.map((r, i) => {
            return {
              // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,
              applicationNo: r.applicationNo,
              mobileNo: r.applicantMobileNo,
              fullName: `${r.applicantFirstName} ${r.applicantMiddleName} ${r.applicantLastName}`,
              fullNameMr: `${r.applicantFirstNameMr} ${r.applicantMiddleNameMr} ${r.applicantLastNameMr}`,
              emailId: r.applicantEmailId,
              aadharNo: r.applicantAadharNo,
              status:
                r.status === 0
                  ? "Saved as a draft"
                  : r.status === 1
                  ? "Revert by Clerk"
                  : r.status === 2
                  ? "Waiting for Site Visit"
                  : r.status === 3
                  ? "Revert by Head Clerk"
                  : r.status === 4
                  ? "Photopass Waiting for Clerk"
                  : r.status === 5
                  ? "Waiting For Head Clerk"
                  : r.status === 6
                  ? "Revert by Office-Superintendant"
                  : r.status === 7
                  ? "Waiting for Office-Superintendant"
                  : r.status === 8
                  ? "Revert By Administrative-Officer"
                  : r.status === 9
                  ? "Waiting for Administrative-Officer"
                  : r.status === 10
                  ? "Revert by Assistant-Commissioner"
                  : r.status === 11
                  ? "Waiting for Assistant-Commissioner"
                  : // r.status === 12 ? "send back to assistant commissioner" :
                  r.status === 13
                  ? "LOI Generated"
                  : r.status === 14
                  ? "Payment Done"
                  : r.status === 15
                  ? "Site Visit Scheduled"
                  : r.status === 16
                  ? "Site Visit Done"
                  : r.status === 17
                  ? "Photopass Issued"
                  : r.status === 18
                  ? "Close"
                  : r.status === 19
                  ? "Duplicate"
                  : r.status === 20
                  ? "Rejected"
                  : "Pending",
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
    } else {
      axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getAll`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          setLoading(false);
          console.log("result", r.data);
          let result = r.data.trnIssuePhotopassList;
          let _res = result.map((r, i) => {
            return {
              // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,
              applicationNo: r.applicationNo,
              mobileNo: r.applicantMobileNo,
              fullName: `${r.applicantFirstName} ${r.applicantMiddleName} ${r.applicantLastName}`,
              fullNameMr: `${r.applicantFirstNameMr} ${r.applicantMiddleNameMr} ${r.applicantLastNameMr}`,
              emailId: r.applicantEmailId,
              aadharNo: r.applicantAadharNo,
              status:
                r.status === 0
                  ? "Saved as a draft"
                  : r.status === 1
                  ? "Revert by Clerk"
                  : r.status === 2
                  ? "Waiting for Site Visit"
                  : r.status === 3
                  ? "Revert by Head Clerk"
                  : r.status === 4
                  ? "Photopass Waiting for Clerk"
                  : r.status === 5
                  ? "Waiting For Head Clerk"
                  : r.status === 6
                  ? "Revert by Office-Superintendant"
                  : r.status === 7
                  ? "Waiting for Office-Superintendant"
                  : r.status === 8
                  ? "Revert By Administrative-Officer"
                  : r.status === 9
                  ? "Waiting for Administrative-Officer"
                  : r.status === 10
                  ? "Revert by Assistant-Commissioner"
                  : r.status === 11
                  ? "Waiting for Assistant-Commissioner"
                  : // r.status === 12 ? "send back to assistant commissioner" :
                  r.status === 13
                  ? "LOI Generated"
                  : r.status === 14
                  ? "Payment Done"
                  : r.status === 15
                  ? "Site Visit Scheduled"
                  : r.status === 16
                  ? "Site Visit Done"
                  : r.status === 17
                  ? "Photopass Issued"
                  : r.status === 18
                  ? "Close"
                  : r.status === 19
                  ? "Duplicate"
                  : r.status === 20
                  ? "Rejected"
                  : "Pending",
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
    }
  };

  const handleViewActions = (paramsRow) => {
    console.log("paramsRow", paramsRow);
    if (paramsRow.status === "Photopass Issued") {
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/downloadPhotopass",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (paramsRow.status === "Waiting for Assistant-Commissioner") {
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewPhotopassDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (paramsRow.status === "Site Visit Scheduled") {
      if (authority && authority.find((val) => val === "CLERK")) {
        router.push({
          pathname:
            "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/completeScheduledSiteVisit",
          query: {
            id: paramsRow.id,
          },
        });
      } else {
        router.push({
          pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewScheduledSiteVisit",
          query: {
            id: paramsRow.id,
          },
        });
      }
    } else if (
      paramsRow.status === "Site Visit Done" ||
      paramsRow.status === "Waiting For Clerk" ||
      paramsRow.status === "Waiting For Head Clerk" ||
      paramsRow.status === "Waiting for Administrative-Officer" ||
      paramsRow.status === "Waiting for Office-Superintendant" ||
      paramsRow.status === "Payment Done" ||
      paramsRow.status === "LOI Generated"
    ) {
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewPhotopassDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else {
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }
  };

  const handleAddButton = () => {
    router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/addApplicantDetails");
  };

  const columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      // headerName: labels["srNo"],
      width: 100,
    },
    {
      headerClassName: "cellColor",
      field: "applicationNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationNo" />,
      // headerName: labels["srNo"],
      width: 300,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "fullName" : "fullNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="fullName" />,
      // headerName: labels["fullName"],
      width: 300,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "mobileNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="mobileNo" />,
      // headerName: labels["mobileNo"],
      width: 200,
    },
    {
      headerClassName: "cellColor",
      field: "emailId",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="emailId" />,
      // headerName: labels["emailId"],
      width: 200,
    },
    {
      headerClassName: "cellColor",
      field: "aadharNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="aadharNo" />,
      // headerName: labels["aadharNo"],
      width: 200,
    },

    // status
    {
      field: language === "en" ? "status" : "statusMr",
      width: 300,
      // headerName: <FormattedLabel id="status" />,
      headerName: <label>Status</label>,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.status === "Photopass Issued" ? (
              <p style={{ color: "#4BB543" }}>{params.row.status}</p>
            ) : params.row.status.includes("Rejected") || params.row.status.includes("Revert") ? (
              <p style={{ color: "red" }}>{params.row.status}</p>
            ) : (params.row.status.includes("Waiting for Site Visit") ||
                params.row.status.includes("Photopass Waiting for Clerk") ||
                params.row.status.includes("Site Visit Scheduled") ||
                params.row.status.includes("Site Visit Done") ||
                params.row.status.includes("Payment Done")) &&
              authority &&
              authority.find((val) => val === "CLERK") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.status.includes("Waiting For Head Clerk") &&
              authority &&
              authority.find((val) => val === "HEAD_CLERK") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.status.includes("Waiting for Office-Superintendant") &&
              authority &&
              authority.find((val) => val === "SUPERVISOR") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.status.includes("Waiting for Administrative-Officer") &&
              authority &&
              authority.find((val) => val === "ADMIN_OFFICER") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.status.includes("Waiting for Assistant-Commissioner") &&
              authority &&
              authority.find((val) => val === "ASSISTANT_COMMISHIONER") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.status.includes("LOI Generated") && loggedInUser === "citizenUser" ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : (
              <p style={{ color: "orange" }}>{params.row.status}</p>
            )}
          </Box>
        );
      },
    },

    //Actions
    {
      headerClassName: "cellColor",
      align: "center",
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="action" />,
      // headerName: labels["action"],
      width: 130,
      renderCell: (params) => {
        return (
          <Grid container>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <Tooltip title="View">
                <IconButton
                  onClick={() => {
                    handleViewActions(params.row);
                  }}
                >
                  <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            </Grid>

            {params.row.status === "LOI Generated" && loggedInUser === "citizenUser" ? (
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForPhotopass",
                        query: {
                          id: params.row.applicationNo,
                        },
                      });
                    }}
                  >
                    <Tooltip title={`VIEW LOI RECEIPT`}>
                      <PaymentIcon style={{ color: "orange" }} />
                    </Tooltip>
                  </IconButton>
              </Grid>
            ) : (
              <></>
            )}

            {params.row.status === "Site Visit Scheduled" &&
            loggedInUser === "departmentUser" &&
            authority &&
            authority.find((val) => val === "CLERK") ? (
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <Tooltip title="Reschedule Site Visit">
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/scheduleSiteVisit",
                        query: {
                          id: params.row.id,
                        },
                      });
                    }}
                  >
                    <EventRepeatIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        );
      },
    },
  ];

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
       {loading ? (
        <Loader />
      ) : (
        <>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="insuranceOfPhotopass" />
        </h2>
      </Box>

      {loggedInUser === "citizenUser" ? (
        <div className={styles.addbtn}>
          <Button variant="contained" endIcon={<Add />} onClick={handleAddButton}>
            <FormattedLabel id="add" />
          </Button>
        </div>
      ) : (
        <></>
      )}

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
          // marginLeft: 5,
          // marginRight: 5,
          // marginTop: 5,
          // marginBottom: 5,

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
        // rows={dataSource}
        // columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        //checkboxSelection

        density="compact"
        // autoHeight={true}
        // rowHeight={50}
        pagination
        paginationMode="server"
        // loading={data.loading}
        rowCount={data.totalRows}
        rowsPerPageOptions={data.rowsPerPageOptions}
        page={data.page}
        pageSize={data.pageSize}
        rows={data.rows}
        columns={columns}
        onPageChange={(_data) => {
          getAllPhotopassData(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getAllPhotopassData(_data, data.page);
        }}
      />
      </>
      )}
    </Paper>
  );
};

export default Index;
