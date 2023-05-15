import {
  Box,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BachatGatCategory = () => {
  const router = useRouter();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);

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
  const loggedUser = localStorage.getItem("loggedInUser")

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
  }, []);


  useEffect(() => {
    getBachatgatCategoryTrn();
  }, [zoneNames&&wardNames&&crAreaNames]);

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
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)
      .then((r) => {
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

  // load registration details
  const getBachatgatCategoryTrn = (_pageSize = 10, _pageNo = 0) => {
    {
      loggedUser === "citizenUser"
        ? axios
          .get(`${urls.BSUPURL}/trnBachatgatCancellation/getBachatGatDeuForForcedCancellation`, {
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
            `${urls.BSUPURL}/trnBachatgatCancellation/getBachatGatDeuForForcedCancellation`,
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
    let result = data.trnBachatgatRegistrationList
    if (result.length != 0 && result != null) {
      if (wardNames && zoneNames && crAreaNames) {
        let _res = result?.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id:i+1,
            srNo: (i + 1) + (_pageNo * _pageSize),
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
            cfcApplicationNo: r.cfcApplicationNo,
            applicationNo: r.applicationNo,
            bachatgatName: r.bachatgatName,
            statusVal: r.status,
            totalMembersCount: r.totalMembersCount,
            fullName: r.presidentFirstName + " " + r.presidentLastName,
            createdDate: moment(
              r?.createDtTm,
            ).format("DD-MM-YYYY"),
            startDate: moment(
              r?.startDate,
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
      headerName: <FormattedLabel id="cancelDate" />,
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
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                router.push({
                  pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation/form",
                  query: {
                    id: params.row.applicationNo,
                    isForceful:"true"
                  },
                });
              }}
            >
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
            </IconButton>
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
            <FormattedLabel id="bachatgatForceFulCancellation" />
          </h2>
        </Box>
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
            padding:"10px"
          }}
          density="compact"
          autoHeight
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

export default BachatGatCategory;
