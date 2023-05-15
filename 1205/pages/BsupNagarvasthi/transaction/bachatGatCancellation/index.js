import {
  Box,
  Button,
  Grid,
  Paper,Tooltip
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import DownloadIcon from '@mui/icons-material/Download';

const BachatGatCategoryCancellation = () => {
  const router = useRouter();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
  }, []);

  useEffect(() => {
    getBachatgatCategoryCancellationTrn();
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
            zoneNameMr: row.zoneNameMr,
          })),
        );
      });
  };

  // load ward
  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
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
            crAreaNameMr: row.areaNameMr,
          })),
        );
      });
  };

  // load cancellation details
  const getBachatgatCategoryCancellationTrn = (_pageSize = 10, _pageNo = 0) => {
    {
      loggedUser === "citizenUser"
        ? axios.get(
          `${urls.BSUPURL}/trnBachatgatCancellation/getAll`,
          {
            headers: {
              UserId: user.id,
            },
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
          },
        )
          .then((r) => {
            let result = r.data.trnBachatgatCancellationList;
            setDataToTable(r.data, result)
          })
        : axios
          .get(
            `${urls.BSUPURL}/trnBachatgatCancellation/getAll`,
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
            let result = r.data.trnBachatgatCancellationList;
            setDataToTable(r.data, result)
          });
    }
  };

  // set data to table
  const setDataToTable = (data, result) => {
    if (wardNames && zoneNames && crAreaNames) {
      let _res = result?.map((r, i) => {
        return {
          activeFlag: r.activeFlag,
          id: r.id,
          srNo: i + 1,
          zoneKey: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
          ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
          : "-",
        zoneKeyMr: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
          ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
          : "-",
        wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
          ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
          : "-",
        wardKeyMr: wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
          ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
          : "-",
        areaKey: crAreaNames?.find((obj) => {
          return obj.id == r.areaKey;
        })?.crAreaName
          ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaName
          : "-",
        areaKeyMr: crAreaNames?.find((obj) => {
          return obj.id == r.areaKey;
        })?.crAreaNameMr
          ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaNameMr
          : "-",
          applicationNo: r.applicationNo,
          totalMembersCount: r.totalMembersCount,
          fullName: r.presidentFirstName + " " + r.presidentLastName,
          statusVal:r.status,
          cancelDate: moment(
            r.cancelDate
          ).format("DD-MM-YYYY HH:mm"),
          currStatus:
            r.status === null
              ? "pending"
              : r.status === 0
                ? "Save As Draft"
                : r.status === 1
                  ? "Send Back To Citizen For Cancel"
                  : r.status === 2
                    ? "Samuha Sanghatak For Cancel"
                    : r.status === 3
                      ? "Send To Dept. Clerk For Cancel"
                      : r.status === 4
                        ? "Send Back To Dept. Clerk For Cancel"
                        : r.status === 5
                          ? "Send To Asst. Commissioner For Cancel"
                          : r.status === 6
                            ? "Send Back To Asst. Commissioner For Cancel"
                            : r.status === 7
                              ? "Send To Dy. Commissioner For Cancel"
                              : r.status === 8
                                ? "Send Back To Dy. Commissioner For Cancel"
                                : r.status === 16
                                  ? "Dept. Clerk After Approval Dy. Commissioner For Cancel"
                                  : r.status === 10
                                    ? "Cancelled"
                                    : r.status === 11
                                      ? "Close"
                                      : r.status === 12
                                        ? "Duplicate": r.status === 22
                                        ? "Rejected" : r.status === 23 ? "Send Back to Samuh Sanghtak"
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
    }
  }

  // table columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "areaKey" : "areaKeyMr",
      headerName: <FormattedLabel id="areaNm" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "zoneKey" : "zoneKeyMr",
      headerName: <FormattedLabel id="zoneNames" />,
      width: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "wardKey" : "wardKeyMr",
      headerName: <FormattedLabel id="wardname" />,
      width: 200,
      align: "left",
      headerAlign: "center",
    },
  
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalMembersCount",
      headerName: <FormattedLabel id="totalMembersCount" />,
      align: "center",
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
      field: "cancelDate",
      headerName: <FormattedLabel id="cancelDate" />,
      width: 250,
      align: "center",
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
          <Box>
            <IconButton
              onClick={() => {
                router.push({
                  pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation/view",
                  query: {
                    id: params.row.id,
                    isEdit:((loggedUser == "citizenUser" || loggedUser === "cfcUser")&& params.row.statusVal==1)?"true":"false"
                  },
                });
              }}
            >
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
            </IconButton>

            {((loggedUser == "citizenUser" || (loggedUser === "cfcUser")) && params.row.statusVal === 2) && (<IconButton
              onClick={() => {
                router.push({
                  pathname:
                    "/BsupNagarvasthi/transaction/acknowledgement",
                  query: {  id: params.row.applicationNo, trn: "C" },
                })
              }}
            >
              <Tooltip title={`DOWNLOAD ACKNOWLEDGEMENT`}>
                <DownloadIcon style={{ color: "blue" }} />
              </Tooltip>
            </IconButton>)}
            
          </Box>
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
            <FormattedLabel id="bachatgatCancellation" />
          </h2>
        </Box>

        {loggedUser !== "departmentUser" && <Grid item xs={12} style={{ display: "flex", padding: "10px", justifyContent: "end" }}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            onClick={() => {
              router.push({
                pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation/form",
                isForceful:"false"
              });
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        </Grid>}

        <DataGrid
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
            padding: "10px" 
          }}
          density="compact"
          autoHeight={data.pageSize}
          rowHeight={50}
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getBachatgatCategoryCancellationTrn(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getBachatgatCategoryCancellationTrn(_data, data.page);
          }}
        />
      </Paper>
    </div>
  );
};

export default BachatGatCategoryCancellation;
