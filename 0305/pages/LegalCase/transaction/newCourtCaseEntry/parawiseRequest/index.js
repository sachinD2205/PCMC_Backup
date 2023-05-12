import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../../containers/schema/LegalCaseSchema/newCourtCaseSchema";
import urls from "../../../../../URLS/urls";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [caseNumbers1, setCaseNumbers1] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [years, setYears] = useState([]);

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log("r.roles", r.roles);
        return r;
      }
    })?.roles;
    console.log("auth0000", auth);
    setAuthority(auth);
  }, []);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Case entry
  const getAllParawiseData = (_pageSize = 100, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    //user
    console.log("user", user);
    // Get department id from user
    let departmentId = user?.userDao?.department;

    console.log("departmentId", departmentId);

    axios
      .get(`${urls.LCMSURL}/parawiseRequest/getParawiseReportByDptId?dptId=${departmentId}`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("r", r);
        let result = r.data;
        console.log("result", result);

        // // filter result by department id
        // result = result.filter((r) => {
        //   if (r.departmentId == departmentId) {
        //     return r;
        //   }
        // });

        console.log("result_new", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            caseNumber: r.caseNumber,
            caseDate: r.caseDate,
            departmentId: r.departmentId,
            status: r.status,
            caseEntryId: r.trnNewCourtCaseEntryDaoKey,
          };
        });

        console.log("res1212", _res);
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

  // columns
  const columns = [
    // old
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      width: 90,
    },
    {
      field: "caseNumber",
      headerName: <FormattedLabel id="courtCaseNumber" />,
      width: 160,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "caseDate",
      headerName: <FormattedLabel id="caseDate" />,
      // flex: 1,
      width: 140,
      headerAlign: "center",
      align: "center",
    },
    ,
    ,
    // {
    //   field: "departmentId",
    //   headerName: "Department Name",
    //   // flex: 1,
    //   width: 200,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      // add colurs based on the status, default is black
      renderCell: (params) => {
        let status = params.row.status;
        console.log("status", status);
        return (
          <Box>
            {status === "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS" ? (
              <Typography style={{ color: "red" }}>{status}</Typography>
            ) : status === "PARAWISE_APPROVED_BY_HOD" ? (
              <Typography style={{ color: "purple" }}>{status}</Typography>
            ) : status === "PARAWISE_REPORT_SENT_TO_HOD" ? (
              <Typography style={{ color: "green" }}>{status}</Typography>
            ) : status === "PARAWISE_RPT_REASSIGNED_TO_CONCRND_DPT_CLERK" ? (
              <Typography style={{ color: "orange" }}>{status}</Typography>
            ) : (
              <Typography style={{ color: "black" }}>{status}</Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,
      align: "center",
      //   flex: 1,
      //   sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let status = params.row.status;
        let record = params.row;
        // console.log("status", status)
        return (
          <Box>
            {authority?.includes("CONCERN DEPARTMENT CLERK") &&
            status === "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS" ? (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // console.log(params.row)
                    router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  Clerk Remarks
                </Button>
              </IconButton>
            ) : (
              <></>
            )}

            {/* Reassign Button */}
            {authority?.includes("CONCERN DEPARTMENT CLERK") &&
            status === "PARAWISE_RPT_REASSIGNED_TO_CONCRND_DPT_CLERK" ? (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // console.log(params.row)
                    router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  Clerk Remarks
                </Button>
              </IconButton>
            ) : (
              <></>
            )}
            {authority?.includes("CONCERN DEPARTMENT HOD") && status === "PARAWISE_REPORT_SENT_TO_HOD" ? (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // console.log(params.row)
                    router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptHod",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  Hod Remarks
                </Button>
              </IconButton>
            ) : (
              <></>
            )}
            {status === "WRITTEN_STATEMENT_CREATED" ? (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // console.log(params.row)
                    router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptHod",
                      query: {
                        ...record,
                        pageMode: "View",
                      },
                    });
                  }}
                >
                  Hod WS Approve
                </Button>
              </IconButton>
            ) : (
              <></>
            )}
          </Box>
        );
      },
    },
  ];

  // -------------------- useEffect ---------

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAllParawiseData();
  }, [courtNames, advocateNames]);

  // View
  return (
    <>
      <Paper
        component={Box}
        elevation={5}
        sx={{
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: "10vh",
        }}
      >
        {/* new Header */}
        <Grid
          container
          style={{
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <IconButton>
            <ArrowBackIcon
              onClick={() => {
                router.back();
              }}
            />
          </IconButton>

          <Grid item xs={11}>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                //background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              {" "}
              <FormattedLabel id="parawiseReport" />
            </h2>
          </Grid>
        </Grid>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          ></div>

          {/* New Table */}
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
                printOptions: { disableToolbarButton: true },
                // disableExport: true,
                // disableToolbarButton: true,
                // csvOptions: { disableToolbarButton: true },
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
              // getCaseType(data.pageSize, _data);
              getAllParawiseData(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllParawiseData(_data, data.page);
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default Index;
