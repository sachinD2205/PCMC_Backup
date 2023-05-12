import {
    Box,
    Button,
    Grid, Tooltip,
    Paper,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import moment from "moment";
  import EditIcon from '@mui/icons-material/Edit';
  import AddIcon from "@mui/icons-material/Add";
  import IconButton from "@mui/material/IconButton";
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  import axios from "axios";
  import { useRouter } from "next/router";
  import { useSelector } from "react-redux";
  import urls from "../../../../URLS/urls";
  import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
  import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
  import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
   
  const BachatgatRenwal = () => {
    const router = useRouter();
    const [zoneNames, setZoneNames] = useState([]);
    const [wardNames, setWardNames] = useState([]);
    const [crAreaNames, setCRAreaName] = useState([]);
    const [totalElements, setTotalElements] = useState();
  
    const [pageNo, setPageNo] = useState()
    const [data, setData] = useState({
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: 10,
      page: 1,
    });
  
  
    //get logged in user
    const user = useSelector((state) => state.user.user);
    const loggedUser = localStorage.getItem("loggedInUser")
    const [statusVal, setStatusVal] = useState(null)
    const [pageSize, setPageSize] = useState();
  
    useEffect(() => {
      getZoneName();
      getWardNames();
      getCRAreaName();
    }, []);
  
  
    useEffect(() => {
      getBachatgatCategoryTrn();
    }, [zoneNames, wardNames, crAreaNames]);
  
    // load zone
    const getZoneName = () => {
      axios
        .get(`${urls.CFCURL}/master/zone/getAll`)
        .then((r) => {
          setZoneNames(
            r.data.zone.map((row) => ({
              id: row.id,
              zoneName: row.zoneName,
            })),
          );
        });
    };
  
    // load ward
    const getWardNames = () => {
      axios
        .get(`${urls.CFCURL}/master/ward/getAll`)
        .then((r) => {
          setWardNames(
            r.data.ward.map((row) => ({
              id: row.id,
              wardName: row.wardName,
            })),
          );
        });
    };
  
    // getAreaName
    const getCRAreaName = () => {
      axios
        .get(`${urls.CfcURLMaster}/area/getAll`)
        .then((r) => {
          setCRAreaName(
            r.data.area.map((row) => ({
              id: row.id,
              crAreaName: row.areaName,
            })),
          );
        });
    };
  
    // load registration details
    const getBachatgatCategoryTrn = (_pageSize = 10, _pageNo = 0) => {
      {
        loggedUser === "citizenUser"
          ? axios
            .get(`${urls.BSUPURL}/trnBachatgatRenewal/getAll`, {
              headers: {
                UserId: user.id
              },
              params: {
                pageSize: _pageSize,
                pageNo: _pageNo,
              },
            },
            )
            .then((r) => {
              setToDataTable(r.data, _pageSize, _pageNo)
            })
          : axios
            .get(
              `${urls.BSUPURL}/trnBachatgatRenewal/getAll`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
                params: {
                  pageSize: _pageSize,
                  pageNo: _pageNo,
                },
              },
            )
            .then((r) => {
              setToDataTable(r.data, _pageSize, _pageNo)
            });
      }
    };
  
    //  set to table
    const setToDataTable = (data, _pageSize, _pageNo) => {
      let result = data.trnBachatgatRenewalList
      if (result != null && result.length != 0  ) {
        if (wardNames && zoneNames && crAreaNames) {
          let _res = result?.map((r, i) => {
            return {
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: (i + 1) + (_pageNo * _pageSize),
              zoneKey: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                : "-",
              wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                : "-",
              areaKey: crAreaNames?.find((obj) => {
                return obj.id == r.areaKey;
              })?.crAreaName
                ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaName
                : "-",
              cfcApplicationNo: r.cfcApplicationNo,
              applicationNo: r.applicationNo,
              bachatgatName: r.bachatgatName,
              statusVal: r.status,
              totalMembersCount: r.totalMembersCount,
              fullName: r.presidentFirstName + " " + r.presidentLastName,
              startDate: moment(
                r?.startDate,
              ).format("DD-MM-YYYY"),
              createdDate:moment(
                r?.createDtTm,
              ).format("DD-MM-YYYY"),
              currStatus:
                r.status === null
                  ? "pending"
                  : "" || r.status === 0
                    ? "Save As Draft"
                    : "" || r.status === 1
                      ? "Send Back To Citizen(Approval)"
                      : "" || r.status === 2
                        ? "Send to Samuha Sanghatak(Approval)"
                        : "" || r.status === 3
                          ? "Send To Dept. Clerk(Approval)"
                          : "" || r.status === 4
                            ? "Send Back To Dept. Clerk(Rejected)"
                            : "" || r.status === 5
                              ? "Send To Asst. Commissioner(Approval)"
                              : "" || r.status === 6
                                ? "Send Back To Asst. Commissioner(Rejected)"
                                : "" || r.status === 7
                                  ? "Send To Dy. Commissioner(Approval)"
                                  : "" || r.status === 8
                                    ? "Send Back To Dy. Commissioner(Rejected)"
                                    : "" || r.status === 16
                                      ? "Send Back To Dept Clerk After Approval Dy Commissioner"
                                      : "" || r.status === 10
                                        ? "Complete"
                                        : "" || r.status === 11
                                          ? "Close"
                                          : "" || r.status === 12
                                            ? "Duplicate" : r.status === 22
                                              ? "Rejected" : r.status === 23 ? "Send Back to Samuh Sanghtak" 
                                              : r.status === 17 ?
                                               "Modification In Progress "
                                                  : r.status === 18 ?
                                                    "Modified"
                                                    : "Invalid",
            };
          });
          setData({
            rows: _res,
            totalRows: data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: data.pageSize,
            page: data.pageNo,
          });
  
          setPageSize(data.pageSize)
          setPageNo(data.pageNo)
          setTotalElements(data.totalElements);
        }
      }
    }
  
    // columns
    const columns = [
      {
        field: "srNo",
        headerName: <FormattedLabel id="srNo" />,
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "bachatgatName",
        headerName: <FormattedLabel id="bachatgatName" />,
        width: 250,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "fullName",
        headerName: <FormattedLabel id="presidentName" />,
        width: 250,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "zoneKey",
        headerName: <FormattedLabel id="zoneNames" />,
        width: 200,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "wardKey",
        headerName: <FormattedLabel id="wardname" />,
        width: 200,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "areaKey",
        headerName: <FormattedLabel id="areaNm" />,
        width: 250,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "applicationNo",
        headerName: <FormattedLabel id="applicationNo" />,
        width: 350,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "totalMembersCount",
        headerName: <FormattedLabel id="totalMembersCount" />,
        width: 200,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "createdDate",
        headerName: <FormattedLabel id="bachatgatRenewalDate" />,
        width: 200,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "currStatus",
        headerName: <FormattedLabel id="currentStatus" />,
        width: 400,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "actions",
        headerName: <FormattedLabel id="actions" />,
        width: 150,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <>
              <IconButton
                onClick={() => {
                  // ((loggedUser == "citizenUser" || loggedUser === "cfcUser") && params.row.statusVal == 1) ? router.push({
                  //   pathname: "/BsupNagarvasthi/transaction/bachatgatRegistration/edit",
                  //   query: {
                  //     id: params.row.id,
                  //   },
                  // }) :
                    router.push({
                      pathname: "/BsupNagarvasthi/transaction/bachatgatRenewal/view",
                      query: {
                        id: params.row.id,
                      },
                    });
                }}
              >
                <Tooltip title={`View`}>
                  <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>

              {((loggedUser == "citizenUser" || (loggedUser === "cfcUser")) && params.row.statusVal === 2) && (<IconButton
              onClick={() => {
                router.push({
                  pathname:
                    "/BsupNagarvasthi/transaction/acknowledgement",
                  query: {  id: params.row.applicationNo, trn: "BRN" },
                })
              }}
            >
              <Tooltip title={`DOWNLOAD ACKNOWLEDGEMENT`}>
                <DownloadIcon style={{ color: "blue" }} />
              </Tooltip>
            </IconButton>)}
  
              {((loggedUser == "citizenUser" || loggedUser === "cfcUser") && (params.row.statusVal === 10)) ?
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation/form",
                      query: {
                        id: params.row.applicationNo,
                        isForceful: "false"
                      },
                    });
                  }}
                >
                  <Tooltip title={`Cancellation`}>
  
                    <ArrowForwardIcon style={{ color: "#556CD6" }} />
                  </Tooltip>
  
                </IconButton> : <></>}
  
              {((loggedUser == "citizenUser" || loggedUser === "cfcUser") && (params.row.statusVal === 10)) ?
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: "/BsupNagarvasthi/transaction/bachatgatModification/form",
                      query: {
                        id: params.row.applicationNo,
                      },
                    })
                  }}
                >
                  <Tooltip title={`Modification`}>
  
                    <EditIcon style={{ color: "#556CD6" }} />
                  </Tooltip>
                </IconButton> : <></>}
            </>
          );
        },
      },
    ];
  
    // UI
    return (
      <div>
        <Paper elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="bachatgatrenewal" />
            </h2>
          </Box>
           
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
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
            density="compact"
            pagination
            paginationMode="server"
            loading={data.loading}
            rowCount={totalElements}
            rowsPerPageOptions={[10, 20, 50, 100]}
            page={pageNo}
            pageSize={pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getBachatgatCategoryTrn(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getBachatgatCategoryTrn(_data, data.page);
            }}
          />
        </Paper>
      </div>
    );
  };
  
  export default BachatgatRenwal;
  