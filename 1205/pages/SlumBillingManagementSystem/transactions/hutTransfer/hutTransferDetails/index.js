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
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import PaymentIcon from '@mui/icons-material/Payment';


const Index = () => {
    const [dataSource, setDataSource] = useState({});
    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
      });

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
        getAllHutTransferData();
      }, []);

     // get all photopass data

  const getAllHutTransferData = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);

    if (loggedInUser === "citizenUser") {
      axios.get(`${urls.SLUMURL}/trnTransferHut/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          UserId: user.id
        }
      }).then((r) => {
        console.log("result", r.data);
        let result = r.data.trnTransferHutList;
        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            applicationNo: r.applicationNo,
            proposedOwner: `${r.proposedOwnerFirstName} ${r.proposedOwnerMiddleName} ${r.proposedOwnerLastName}`,
            currentOwner: `${r.currentOwnerFirstName} ${r.currentOwnerMiddleName} ${r.currentOwnerLastName}`,
            hutNo: r.hutNo,
            transferDate: r.transferDate,
            transferType: r.transferType,
            marketValue: r.marketValue,
            saleValue: r.saleValue,
            status:
            r.status === 0 ? "Saved as a draft" : 
            r.status === 1 ? "Revert by Clerk" : 
            r.status === 2 ? "Waiting for Site Visit" : 
            r.status === 22 ? "Revert by Head Clerk" : 
            r.status === 21 ? "Waiting for Clerk for Completion" : 
            r.status === 5 ? "Waiting For Head Clerk" : 
            r.status === 6 ? "Revert by Office-Superintendant" : 
            r.status === 7 ? "Waiting for Office-Superintendant" : 
            r.status === 8 ? "Revert By Administrative-Officer" : 
            r.status === 9 ? "Waiting for Administrative-Officer" : 
            r.status === 10 ? "Revert by Assistant-Commissioner" : 
            r.status === 11 ? "Waiting for Assistant-Commissioner" : 
            // r.status === 12 ? "send back to assistant commissioner" :     
            r.status === 13 ? "LOI Generated" : 
            r.status === 14 ? "Payment Done" : 
            r.status === 15 ? "Site Visit Scheduled" : 
            r.status === 16 ? "Site Visit Done" :
            r.status === 17 ? "Hut Transfered" :
            r.status === 18 ? "Close" :
            r.status === 19 ? "Duplicate" :
            r.status === 20 ? "Rejected" :
            "Pending",
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
      axios.get(`${urls.SLUMURL}/trnTransferHut/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }).then((r) => {
        console.log("result", r.data);
        let result = r.data.trnTransferHutList;
        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,
              applicationNo: r.applicationNo,
              proposedOwner: `${r.proposedOwnerFirstName} ${r.proposedOwnerMiddleName} ${r.proposedOwnerLastName}`,
              currentOwner: `${r.currentOwnerFirstName} ${r.currentOwnerMiddleName} ${r.currentOwnerLastName}`,
              hutNo: r.hutNo,
              transferDate: r.transferDate,
              transferType: r.transferTypeKey,
              marketValue: r.marketValue,
              saleValue: r.saleValue,
              status:
            r.status === 0 ? "Saved as a draft" : 
            r.status === 1 ? "Revert by Clerk" : 
            r.status === 2 ? "Waiting for Site Visit" : 
            r.status === 22 ? "Revert by Head Clerk" : 
            r.status === 21 ? "Waiting for Clerk for Completion" : 
            r.status === 5 ? "Waiting For Head Clerk" : 
            r.status === 6 ? "Revert by Office-Superintendant" : 
            r.status === 7 ? "Waiting for Office-Superintendant" : 
            r.status === 8 ? "Revert By Administrative-Officer" : 
            r.status === 9 ? "Waiting for Administrative-Officer" : 
            r.status === 10 ? "Revert by Assistant-Commissioner" : 
            r.status === 11 ? "Waiting for Assistant-Commissioner" : 
            // r.status === 12 ? "send back to assistant commissioner" :     
            r.status === 13 ? "LOI Generated" : 
            r.status === 14 ? "Payment Done" : 
            r.status === 15 ? "Site Visit Scheduled" : 
            r.status === 16 ? "Site Visit Done" :
            r.status === 17 ? "Hut Transfered" :
            r.status === 18 ? "Close" :
            r.status === 19 ? "Duplicate" :
            r.status === 20 ? "Rejected" :
            "Pending",
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
    if(paramsRow.status === "Site Visit Done"){
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/hutTransfer/viewAddHutDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }
    else if(paramsRow.status === "Hut Transfered"){
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/hutTransfer/downloadHutTransfer",
        query: {
          id: paramsRow.id,
        },
      });
    }
    else
    if(paramsRow.status === "Waiting for Assistant-Commissioner" || paramsRow.status === "Waiting for Clerk for Completion" || paramsRow.status === "Rejected by Head Clerk" || paramsRow.status === "LOI Generated")
    {
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/hutTransfer/viewHutDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }else
    if(paramsRow.status === "Site Visit Scheduled"){
      if(authority && authority.find((val) => val === "CLERK")){
        router.push({
          pathname: "/SlumBillingManagementSystem/transactions/hutTransfer/completeScheduledSiteVisit",
          query: {
            id: paramsRow.id,
          },
        });
      }else{
        router.push({
          pathname: "/SlumBillingManagementSystem/transactions/hutTransfer/viewScheduledSiteVisit",
          query: {
            id: paramsRow.id,
          },
        });
      }
    }else
    if(paramsRow.status === "Payment Done" || paramsRow.status === "Waiting For Head Clerk" || paramsRow.status === "Waiting for Administrative-Officer" || paramsRow.status === "Waiting for Office-Superintendant" || paramsRow.status === "Issue photopass after payment"){
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/hutTransfer/viewHutDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }else
    {
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/hutTransfer/viewAddHutDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }
  }

  const handleAddButton = () => {
    router.push('/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails')
  }

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
      width: 300,
    },
    {
      headerClassName: "cellColor",
      field: "proposedOwner",
      headerName: <FormattedLabel id="proposedOwner" />,
      // headerName: labels["fullName"],
      width: 300,
    },
    {
      headerClassName: "cellColor",
      field: "currentOwner",
      headerName: <FormattedLabel id="currentOwner" />,
      // headerName: labels["mobileNo"],
      width: 300,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "hutNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="hutNo" />,
      // headerName: labels["mobileNo"],
      width: 200,

    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "transferDate",
      headerAlign: "center",
      headerName: <FormattedLabel id="transferDate" />,
      // headerName: labels["mobileNo"],
      width: 200,

    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "transferType",
      headerAlign: "center",
      headerName: <FormattedLabel id="transferType" />,
      // headerName: labels["mobileNo"],
      width: 200,

    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "marketValue",
      headerAlign: "center",
      headerName: <FormattedLabel id="marketValue" />,
      // headerName: labels["mobileNo"],
      width: 200,

    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "saleValue",
      headerAlign: "center",
      headerName: <FormattedLabel id="saleValue" />,
      // headerName: labels["mobileNo"],
      width: 200,
    },


   
      // status
      {
        field: language === "en" ? "status" : "statusMr",
        width: 200,
        // headerName: <FormattedLabel id="status" />,
        headerName: <label>Status</label>,
        renderCell: (params) => {
          return (
            <Box>
            {params.row.status === "Hut Transfered" ? (
              <p style={{ color: "#4BB543" }}>{params.row.status}</p>
            ) : params.row.status.includes("Rejected") || params.row.status.includes("Revert") ? (
              <p style={{ color: "red" }}>{params.row.status}</p>
            ) : (params.row.status.includes("Waiting for Site Visit") || params.row.status.includes("Payment Done") || params.row.status.includes("Site Visit Scheduled")|| params.row.status.includes("Site Visit Done") || params.row.status.includes("Waiting for Clerk for Completion") ) &&
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
            ) :( params.row.status.includes("Waiting for Assistant-Commissioner") || params.row.status.includes("Issue photopass after payment")) &&
              authority &&
              authority.find((val) => val === "ASSISTANT_COMMISHIONER") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            )
            :
             params.row.status.includes("LOI Generated") &&
              loggedInUser === "citizenUser" ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            )
            : (
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
      headerAlign: "center",
      headerName: <FormattedLabel id="action" />,
      // headerName: labels["action"],
      width: 150,
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
                          "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
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

{
              params.row.status === "Site Visit Scheduled" && loggedInUser === "departmentUser" && authority &&
              authority.find((val) => val === "CLERK") ?
                (
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                  <Tooltip title="Reschedule Site Visit">
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: "/SlumBillingManagementSystem/transactions/hutTransfer/scheduleSiteVisit",
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
                )
                : <></>
            }
          
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
          <FormattedLabel id="hutTransfer" />
        </h2>
      </Box>

      {
        loggedInUser === "citizenUser" ? 
        <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<Add />}
          onClick={handleAddButton}
        >
          <FormattedLabel id="add" />
        </Button>
      </div>
      :
      <></>
      }

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
              getAllHutTransferData(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllHutTransferData(_data, data.page);
            }}
          />
    </Paper>
  );
};

export default Index;
