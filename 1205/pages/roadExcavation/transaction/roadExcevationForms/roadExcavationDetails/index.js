import React, { useEffect, useState } from "react";
import router from "next/router";
// import styles from "../../renp.module.css";
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
import urls from "../../../../../URLS/urls";
import axios from "axios";
import { useSelector } from "react-redux";
// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


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

      let juniorEngineer = authority && authority.find((val) => val === "JUNIOR_ENGINEER")
 


    useEffect(() => {
        getAllRoadExcevationApplications();
      }, []);


  const getAllRoadExcevationApplications = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);

    // if (loggedInUser === "citizenUser") {
    // if (juniorEngineer) {
      axios.get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
      }).then((r) => {
        console.log("resultsdf", r.data);
        let result = r.data.trnExcavationRoadCpmpletionList;
        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            // activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            applicationNo: r.applicationNo,
            fullName: `${r.firstName} ${r.middleName} ${r.lastName}`,
            mobileNo: r.mobileNo,
            emailId: r.emailAddress,
            companyName: r.companyName,
            applicationDate: r.applicationDate,
            applicationStatus:r.applicationStatus

            // status:
            // r.applicationStatus === 0 ? "Application Created" : 
            // r.status === 1 ? "Rejected by Clerk" : 
            // r.status === 2 ? "Waiting for Site Visit" : 
            // r.status === 3 ? "Rejected by Head Clerk" : 
            // r.status === 4 ? "Photopass Waiting for Clerk" : 
            // r.status === 5 ? "Waiting For Head Clerk" : 
            // r.status === 6 ? "Rejected by Office-Superintendant" : 
            // r.status === 7 ? "Waiting for Office-Superintendant" : 
            // r.status === 8 ? "Rejected By Administrative-Officer" : 
            // r.status === 9 ? "Waiting for Administrative-Officer" : 
            // r.status === 10 ? "Rejected by Assistant-Commissioner" : 
            // r.status === 11 ? "Waiting for Assistant-Commissioner" : 
            // // r.status === 12 ? "send back to assistant commissioner" :     
            // r.status === 13 ? "LOI Generated" : 
            // r.status === 14 ? "Issue photopass after payment" : 
            // r.status === 15 ? "Site Visit Scheduled" : 
            // r.status === 16 ? "Site Visit Done" :
            // r.status === 17 ? "Photopass Issued" :
            // r.status === 18 ? "Close" :
            // r.status === 19 ? "Duplicate" :
            // "Pending",
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
    // } else {
    //   axios.get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getAll`, {
    //     params: {
    //       pageSize: _pageSize,
    //       pageNo: _pageNo,
    //     },
    //     headers: {
    //       Authorization: `Bearer ${user.token}`,
    //     }
    //   }).then((r) => {
    //     console.log("result", r.data);
    //     let result = r.data.trnExcavationRoadCpmpletionList;
    //     let _res = result.map((r, i) => {
    //       return {
    //         // r.data.map((r, i) => ({
    //         activeFlag: r.activeFlag,
    //         id: r.id,
    //         srNo: i + 1 + _pageNo * _pageSize,
    //         mobileNo: r.applicantMobileNo,
    //         fullName: `${r.applicantFirstName} ${r.applicantMiddleName} ${r.applicantLastName}`,
    //         emailId: r.applicantEmailId,
    //         aadharNo: r.applicantAadharNo,
    //         applicationDate: r.applicationDate,
    //         // status:
    //         // r.status === 0 ? "Saved as a draft" : 
    //         // r.status === 1 ? "Rejected by Clerk" : 
    //         // r.status === 2 ? "Waiting for Site Visit" : 
    //         // r.status === 3 ? "Rejected by Head Clerk" : 
    //         // r.status === 4 ? "Photopass Waiting for Clerk" : 
    //         // r.status === 5 ? "Waiting For Head Clerk" : 
    //         // r.status === 6 ? "Rejected by Office-Superintendant" : 
    //         // r.status === 7 ? "Waiting for Office-Superintendant" : 
    //         // r.status === 8 ? "Rejected By Administrative-Officer" : 
    //         // r.status === 9 ? "Waiting for Administrative-Officer" : 
    //         // r.status === 10 ? "Rejected by Assistant-Commissioner" : 
    //         // r.status === 11 ? "Waiting for Assistant-Commissioner" : 
    //         // // r.status === 12 ? "send back to assistant commissioner" :     
    //         // r.status === 13 ? "LOI Generated" : 
    //         // r.status === 14 ? "Issue photopass after payment" : 
    //         // r.status === 15 ? "Site Visit Scheduled" : 
    //         // r.status === 16 ? "Site Visit Done" :
    //         // r.status === 17 ? "Photopass Issued" :
    //         // r.status === 18 ? "Close" :
    //         // r.status === 19 ? "Duplicate" :
    //         // "Pending",
    //       };
    //     });
    //     setDataSource([..._res]);
    //     setData({
    //       rows: _res,
    //       totalRows: r.data.totalElements,
    //       rowsPerPageOptions: [10, 20, 50, 100],
    //       pageSize: r.data.pageSize,
    //       page: r.data.pageNo,
    //     });
    //   });
    // }
   
  };

  const handleViewActions = (paramsRow) => {
    // console.log("paramsRow", paramsRow);
    router.push({
            pathname: "/roadExcavation/transaction/roadExcevationForms/viewFormJE",
            query: {
              id: paramsRow.id,
            },
          });
    // if(paramsRow.status === "Photopass Issued"){
    //   router.push({
    //     pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/downloadPhotopass",
    //     query: {
    //       id: paramsRow.id,
    //     },
    //   });
    // }
    // else
    // if(paramsRow.status === "Waiting for Assistant-Commissioner")
    // {
    //   router.push({
    //     pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
    //     query: {
    //       id: paramsRow.id,
    //     },
    //   });
    // }else
    // if(paramsRow.status === "Site Visit Scheduled"){
    //   if(authority && authority.find((val) => val === "CLERK")){
    //     router.push({
    //       pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/completeScheduledSiteVisit",
    //       query: {
    //         id: paramsRow.id,
    //       },
    //     });
    //   }else{
    //     router.push({
    //       pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewScheduledSiteVisit",
    //       query: {
    //         id: paramsRow.id,
    //       },
    //     });
    //   }
    // }else
    // if(paramsRow.status === "Site Visit Done" || paramsRow.status === "Waiting For Clerk" || paramsRow.status === "Waiting For Head Clerk" || paramsRow.status === "Waiting for Administrative-Officer" || paramsRow.status === "Waiting for Office-Superintendant" || paramsRow.status === "Issue photopass after payment"){
    //   router.push({
    //     pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewPhotopassDetails",
    //     query: {
    //       id: paramsRow.id,
    //     },
    //   });
    // }else
    // {
    //   router.push({
    //     pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
    //     query: {
    //       id: paramsRow.id,
    //     },
    //   });
    // }
  }

  const handleSlotBook = (paramsRow) => {
    console.log("paramsRowwwww", paramsRow);
    router.push({
            pathname: "/roadExcavation/transaction/roadExcevationForms/siteVisitScedule",
            query: {
              id: paramsRow.id,
            },
          });
        }
  const handleSiteVisit = (paramsRow) => {
    // console.log("paramsRowwwww", paramsRow);
    router.push({
            pathname: "/roadExcavation/transaction/roadExcevationForms/siteVisitForm",
            query: {
              id: paramsRow.id,
            },
          });
        }
  const handleViewFormEE = (paramsRow) => {
    // console.log("paramsRowwwww", paramsRow);
    router.push({
            pathname: "/roadExcavation/transaction/roadExcevationForms/viewFormEE",
            query: {
              // applicationNo: paramsRow.applicationNo     
              id: paramsRow.id     
                   },
          });
        }
  const handlepaymentCollection = (paramsRow) => {
    // console.log("paramsRowwwww", paramsRow);
    router.push({
            pathname: "/roadExcavation/transaction/roadExcevationForms/Fees",
            query: {
              // applicationNo: paramsRow.applicationNo     
              id: paramsRow.id     
                   },
          });
        }

  const handleAddButton = () => {
    router.push('/roadExcavation/transaction/roadExcevationForms/roadExcavationNocPermission')
  }

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      headerAlign: "center",
      align: "center",
    //   headerName: <FormattedLabel id="srNo" />,
      headerName: "srNo",
      // headerName: labels["srNo"],
      width: 100,
    },
    {
      headerClassName: "cellColor",

      field: "applicationNo",
      headerAlign: "center",
      align: "center",
    //   headerName: <FormattedLabel id="applicationNo" />,
      headerName: "applicationNo",
      // headerName: labels["applicationNo"],
      width: 100,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "fullName",
      headerAlign: "center",
    //   headerName: <FormattedLabel id="fullName" />,
    //   headerName: labels["fullName"],
      headerName: "Fullname",
      
      flex: 1,
      width: 200,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "companyName",
      headerAlign: "center",
    //   headerName: <FormattedLabel id="companyName" />,
    //   headerName: labels["companyName"],
      headerName: "Company Name",
      flex: 1,

    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "mobileNo",
      headerAlign: "center",
    //   headerName: <FormattedLabel id="mobileNo" />,
      // headerName: labels["mobileNo"],
      headerName: "Mobile No.",
      width: 200,
    },
   
    {
      headerClassName: "cellColor",
      field: "emailId",
      headerAlign: "center",
      align: "center",
    //   headerName: <FormattedLabel id="emailId" />,
      // headerName: labels["emailId"],
      headerName: "Email",
      width: 200,
    },
    {
      headerClassName: "cellColor",
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
    //   headerName: <FormattedLabel id="applicationDate" />,
      // headerName: labels["applicationDate"],
      headerName: "Application Date",
      width: 200,
    },
    

      // status
      {
          // field: language === "en" ? "status" : "statusMr",
        field: "applicationStatus",
        width: 200,
        // headerName: <FormattedLabel id="status" />,
        headerName: <label>Application Status</label>,
        flex: 1,
        renderCell: (params) => {
          // console.log("statusss",params.row.applicationStatus);
        //   return (
            // <Box>
            //   {params.row.status === "APPLICATION_CREATED" ? (
            //     <p style={{ color: "#4BB543" }}>{params.row.status}</p>
            //   ) : params.row.status.includes("Rejected") ? (
            //     <p style={{ color: "red" }}>{params.row.status}</p>
            //   ) : params.row.status.includes("Waiting For Jr") &&
            //     authority &&
            //     authority.find((val) => val === "ENTRY") ? (
            //     <p style={{ color: "blue" }}>{params.row.status}</p>
            //   ) : params.row.status.includes("Waiting for Dy") &&
            //     authority &&
            //     authority.find((val) => val === "PROPOSAL APPROVAL") ? (
            //     <p style={{ color: "blue" }}>{params.row.status}</p>
            //   ) : params.row.status.includes("Waiting for Exe") &&
            //     authority &&
            //     authority.find((val) => val === "FINAL_APPROVAL") ? (
            //     <p style={{ color: "blue" }}>{params.row.status}</p>
            //   ) : params.row.status.includes("Accountant") &&
            //     authority &&
            //     authority.find((val) => val === "PAYMENT VERIFICATION") ? (
            //     <p style={{ color: "blue" }}>{params.row.status}</p>
            //   ) : (
            //     <p style={{ color: "orange" }}>{params.row.status}</p>
            //   )}
            // </Box>
        //   );
        },
      },

      //Actions 
    {
      headerClassName: "cellColor",
      align: "center",
      field: "action",
      align: "center",
      headerAlign: "center",
    //   headerName: <FormattedLabel id="action" />,
      headerName: "Action",

      // headerName: labels["action"],
      width: 150,
      renderCell: (params) => {
        return (
          <Grid container>

{/* {
  loggedInUser && loggedInUser==="citizenUser" && <>
        <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginRight: "20px",
                  }}
                >
                  
                    <Button
                      variant="contained"
                      size="small"
                      type="button"
                      onClick={router.push("/roadExcavation/transaction/roadExcavationNocPermission")}
                    >
                      {/* {<FormattedLabel id="addMore" />} */}
                      {/* Add 
                    </Button>
                 
                </div>

  </>
} */} 

              { authority && authority[0]=="JUNIOR_ENGINEER" && params.row.applicationStatus === "APPLICATION_CREATED" && <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
              <Tooltip title="View">
              <IconButton
                onClick={() => {
                  handleViewActions(params.row);
                }}
              >
                <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>
            </Grid>}
              { authority && authority[0]=="JUNIOR_ENGINEER" && params.row.applicationStatus === "APPROVE_BY_COMMISSIONER" && <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
              <Button  variant="contained" 
                  onClick={() => {
                    handleViewActions(params.row);
                  }}
                  >
                        Generate LOI
                  </Button>
            </Grid>}
       
                  {/* <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Tooltip title="LOI Payment">
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/loiPayment",
                        query: {
                          id: params.row.id,
                        },
                      });
                    }}
                  >
                    <ArrowForwardIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </Tooltip>
                </Grid> */}
                <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                {
                 authority && authority[0]=="JUNIOR_ENGINEER"&& params.row.applicationStatus=="APPROVE_BY_JUNIOR_ENGINEER" ?<>
                  <Button  variant="contained" 
                  onClick={() => {
                    handleSlotBook(params.row);
                  }}
                  >
                        Book Slot
                  </Button>
                  </>
                  :<></>                 
                  
                }
                {
                  authority && authority[0]=="JUNIOR_ENGINEER"&&params.row.applicationStatus=="APPOINTMENT_SCHEDULED" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    handleSiteVisit(params.row);
                  }}
                  >
                        Site Visit
                  </Button>
                  </>
                }
                {authority && authority[0]=="DEPUTY_ENGINEER" &&
                  params.row.applicationStatus=="SITE_VISITED" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    handleViewFormEE(params.row);
                  }}
                  >
                        View
                  </Button>
                  </>
                }
                {authority && authority[0]=="EXECUTIVE_ENGINEER" &&
                  params.row.applicationStatus=="APPROVE_BY_DEPUTY_ENGINEER" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    handleViewFormEE(params.row);
                  }}
                  >
                        View
                  </Button>
                  </>
                }
                {authority && authority[0]=="EXECUTIVE_ENGINEER" &&
                  params.row.applicationStatus=="PAYEMENT_SUCCESSFUL" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    router.push("/roadExcavation/transaction/documenstGeneration/NOC")

                  }}
                  >
                        Generate NOC
                  </Button>
                  </>
                }
                {authority && authority[0]=="ADDITIONAL_CITY_ENGINEER" &&
                  params.row.applicationStatus=="APPROVE_BY_EXECUTIVE_ENGINEER" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    handleViewFormEE(params.row);
                  }}
                  >
                        View
                  </Button>
                  </>
                }
                {authority && authority[0]=="ADDITIONAL_COMMISHIONER" &&
                  params.row.applicationStatus=="APPROVE_BY_ADDITIONAL_CITY_ENGINEER" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    handleViewFormEE(params.row)
                  }}
                  >
                        View
                  </Button>
                  </>
                }
                {authority && authority[0]=="COMMISHIONER" &&
                  params.row.applicationStatus=="APPROVE_BY_ADDITIONAL_COMMISSIONER" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    handleViewFormEE(params.row);
                  }}
                  >
                        View
                  </Button>
                  </>
                }
                {loggedInUser === "citizenUser" &&
                  params.row.applicationStatus=="LOI_GENERATED" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    // router.push("/roadExcavation/transaction/roadExcevationForms/Fees")
                    handlepaymentCollection(params.row);
                  }}
                  >
                        Pay
                  </Button>
                  </>
                }
                {loggedInUser === "citizenUser" &&
                  params.row.applicationStatus=="PAYEMENT_SUCCESSFUL" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    router.push("/roadExcavation/transaction/documenstGeneration/receipt")
                    // handlepaymentCollection(params.row);
                  }}
                  >
                        Receipt
                  </Button>
                  </>
                }

                </Grid>
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
          {/* <FormattedLabel id="insuranceOfPhotopass" /> */}
          Road Excavation Applications
        </h2>
      </Box>

      
        {loggedInUser === "citizenUser" ? 
        // <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<Add />}
          onClick={handleAddButton}
        >
          {/* <FormattedLabel id="add" /> */}
          Add
        </Button>
    //   </div>
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
              getAllRoadExcevationApplications(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllRoadExcevationApplications(_data, data.page);
            }}
          />
    </Paper>
  );
};

export default Index;
