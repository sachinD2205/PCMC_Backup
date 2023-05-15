import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./dashboard.module.css";

import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../URLS/urls";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Index = () => {
  const [dashboardType, setDashboardType] = useState({
    title: "News/Advertisement Status",
    value: "newsOrAdvertisementStatusDashboard",
  });
  const [dashboardTiles, setDashboardTiles] = useState([{ icon: <></>, label: "", status: "" }]);
  const [completeAPI, setCompleteAPI] = useState({ endPoint: "", resDataVariable: "" });
  const [table, setTable] = useState([]);
  const [columns, setColumns] = useState([
    {
      headerClassName: "cellColor",

      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 80,
    },
    {
      headerClassName: "cellColor",

      field: "newsOrAdvertisementRotationNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="newsOrAdvertisementRotationNo" />,
      width: 250,
    },
    {
      headerClassName: "cellColor",

      field: "department",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="department" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "newsReleasingDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="newsReleasingDate" />,
      width: 180,
    },

    {
      headerClassName: "cellColor",

      field: "newsOrAdvertisementPublishedDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="newsOrAdvertisementPublishedDate" />,
      width: 270,
    },
    {
      headerClassName: "cellColor",

      field: "subject",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",

      field: "description",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="description" />,
      width: 400,
    },
    {
      headerClassName: "cellColor",

      field: "standardFormatSize",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="standardFormatSize" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "publishStatus",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="publishStatus" />,
      width: 200,
    },
  ]);

  const {
    // register,
    // reset,
    watch,
    // handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
  });

  useEffect(() => {
    if (dashboardType.value == "newsOrAdvertisementStatusDashboard") {
      setColumns([
        // {
        //   headerClassName: "cellColor",

        //   field: "srNo",
        //   align: "center",
        //   headerAlign: "center",
        //   headerName: <FormattedLabel id="srNo" />,
        //   width: 80,
        // },
        {
          headerClassName: "cellColor",

          // field: "newsOrAdvertisementRotationNo",
          field: "newsRotationRequestNumber",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsOrAdvertisementRotationNo" />,
          width: 250,
        },
        {
          headerClassName: "cellColor",

          field: "departmentKey",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="department" />,
          width: 200,
        },
        {
          headerClassName: "cellColor",

          field: "releaseDate",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsReleasingDate" />,
          width: 180,
        },
        {
          headerClassName: "cellColor",

          field: "newsAdvertisementSubject",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="subject" />,
          width: 300,
        },
        {
          headerClassName: "cellColor",

          field: "newsAdvertisementDescription",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="description" />,
          width: 400,
        },
        {
          headerClassName: "cellColor",

          field: "standardFormatSize",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="standardFormatSize" />,
          width: 200,
        },
        {
          headerClassName: "cellColor",

          field: "status",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="publishStatus" />,
          width: 200,
        },
      ]);
    } else if (dashboardType.value == "newsOrAdvertisementBillingStatusDashboard") {
      setColumns([
        // {
        //   headerClassName: "cellColor",

        //   field: "srNo",
        //   align: "center",
        //   headerAlign: "center",
        //   headerName: <FormattedLabel id="srNo" />,
        //   width: 80,
        // },
        {
          headerClassName: "cellColor",

          field: "newsRotationNumber",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsOrAdvertisementRotationNo" />,
          width: 250,
        },
        {
          headerClassName: "cellColor",

          field: "wardName",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="ward" />,
          width: 150,
        },
        {
          headerClassName: "cellColor",

          field: "departmentName",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="department" />,
          width: 150,
        },
        {
          headerClassName: "cellColor",

          field: "newsReleasingDate",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsReleasingDate" />,
          width: 180,
        },

        {
          headerClassName: "cellColor",

          field: "newsAdvertismentSubject",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="subject" />,
          width: 200,
        },
        {
          headerClassName: "cellColor",

          field: "newsAdvertismentPublishedDate",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsOrAdvertisementPublishedDate" />,
          width: 270,
        },
        {
          headerClassName: "cellColor",

          field: "newsPublishedInSqMeter",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsOrAdvertisementSqMeter" />,
          width: 180,
        },
        {
          headerClassName: "cellColor",

          field: "billAmount",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="billAmount" />,
          width: 200,
        },
        {
          headerClassName: "cellColor",

          field: "remark",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="billApprovalRemark" />,
          width: 200,
        },
        {
          headerClassName: "cellColor",

          field: "attachment",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="attachment" />,
          width: 200,
        },
      ]);
    } else if (dashboardType.value == "pressNote") {
      setColumns([
        // {
        //   headerClassName: "cellColor",

        //   field: "srNo",
        //   align: "center",
        //   headerAlign: "center",
        //   headerName: <FormattedLabel id="srNo" />,
        //   width: 80,
        // },
        {
          headerClassName: "cellColor",

          field: "pressNoteNo",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="pressNoteNo" />,
          width: 250,
        },
        {
          headerClassName: "cellColor",

          field: "departmentName",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="department" />,
          width: 150,
        },
        {
          headerClassName: "cellColor",

          field: "pressNoteReleasingDate",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="pressNoteReleasingDate" />,
          width: 180,
        },
        {
          headerClassName: "cellColor",

          field: "newsAdSubject",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="subject" />,
          width: 250,
        },
        {
          headerClassName: "cellColor",

          field: "pressNoteDescription",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="description" />,
          width: 550,
        },
        {
          headerClassName: "cellColor",

          field: "status",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="publishStatus" />,
          width: 220,
        },
      ]);
    } else if (dashboardType.value == "paperCutting") {
      setColumns([
        // {
        //   headerClassName: "cellColor",

        //   field: "srNo",
        //   align: "center",
        //   headerAlign: "center",
        //   headerName: <FormattedLabel id="srNo" />,
        //   width: 80,
        // },
        {
          headerClassName: "cellColor",

          field: "newsReleasingOrderNumber",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsOrAdvertisementRotationNo" />,
          width: 250,
        },
        {
          headerClassName: "cellColor",

          field: "ward",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="ward" />,
          width: 150,
        },
        {
          headerClassName: "cellColor",

          field: "departmentName",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="department" />,
          width: 150,
        },
        {
          headerClassName: "cellColor",

          field: "subject",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="subject" />,
          width: 200,
        },
        {
          headerClassName: "cellColor",

          field: "publishedDate",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsOrAdvertisementPublishedDate" />,
          width: 270,
        },
        {
          headerClassName: "cellColor",

          field: "newsOrAdvertisementSqMeter",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="newsOrAdvertisementSqMeter" />,
          width: 180,
        },
        {
          headerClassName: "cellColor",

          field: "billAmount",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="billAmount" />,
          width: 200,
        },
        {
          headerClassName: "cellColor",

          field: "remark",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="billApprovalRemark" />,
          width: 200,
        },
        {
          headerClassName: "cellColor",

          field: "attachement",
          align: "center",
          headerAlign: "center",
          headerName: <FormattedLabel id="attachment" />,
          width: 200,
          renderCell: (params) => {
            return (
              <>
                {params.row.attachement && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      window.open(`${urls.CFCURL}/file/preview?filePath=${params.row.attachement}`, "_blank");
                    }}
                  >
                    <FormattedLabel id="preview" />
                  </Button>
                )}
                {/* <IconButton
                  style={{ color: "#1976d2" }}
                  onClick={() => {
                    reset({
                      id: params.row.id,
                      nameEn: params.row.nameEn,
                      nameMr: params.row.nameMr,
                    });
                    setCollapse(true);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  style={{ color: "red" }}
                  onClick={() => {
                    deleteAnimal(params.row.id);
                  }}
                >
                  <Delete />
                </IconButton> */}
              </>
            );
          },
          // renderCell: (params) => {
          //   params.row.attachment && (
          //     <Button
          //       variant="contained"
          //       onClick={() => {
          //         window.open(`${urls.CFCURL}/file/preview?filePath=${params.row.attachment}`, "_blank");
          //       }}
          //     >
          //       <FormattedLabel id="preview" />
          //     </Button>
          //   );
          // },
        },
      ]);
    }

    var api = "";
    var resDataVariable = "";

    if (dashboardType.value == "newsOrAdvertisementStatusDashboard") {
      api = `/trnNewsPublishRequest/getAllByFromDateAndToDate`;
      resDataVariable = "trnNewsPublishRequestList";
    } else if (dashboardType.value == "newsOrAdvertisementBillingStatusDashboard") {
      api = `/trnNewspaperAgencyBillSubmission/getAllByFromDateAndToDate`;
      resDataVariable = "trnNewspaperAgencyBillSubmissionList";
    } else if (dashboardType.value == "pressNote") {
      api = `/trnPressNoteRequestApproval/getAllByFromDateAndToDate`;
      resDataVariable = "trnPressNoteRequestApprovalList";
    } else if (dashboardType.value == "paperCutting") {
      api = `/trnPaperCuttingBook/getAllByFromDateAndToDate`;
      resDataVariable = "trnPaperCuttingBookList";
    }

    setCompleteAPI({
      endPoint: api,
      resDataVariable,
    });
  }, [dashboardType]);

  useEffect(() => {
    if (watch("fromDate") != null && watch("toDate") != null) {
      axios
        .get(`${urls.NRMS + completeAPI.endPoint}?fromDate=${watch("fromDate")}&toDate=${watch("toDate")}`)
        .then((res) => {
          console.log("Data: ", res.data[completeAPI.resDataVariable]);
          // setTable(res.data[completeAPI.resDataVariable]);
          setTable(
            res.data[completeAPI.resDataVariable].map((j) => ({
              ...j,
              status:
                j.status === null
                  ? "Pending"
                  : j.status === 0
                  ? "Save As Draft"
                  : j.status === 1
                  ? "Approved By HOD"
                  : j.status === 2
                  ? "Reject By Concern Department HOD"
                  : j.status === 3
                  ? "Releasing Order Generated"
                  : j.status === 4
                  ? "Reject By  Department Clerk"
                  : j.status === 5
                  ? "Approved By NR HOD"
                  : j.status === 6
                  ? "Rejected By Department HOD"
                  : j.status === 7
                  ? "Approved By Assistant Commissioner"
                  : j.status === 8
                  ? "Completed"
                  : j.status === 9
                  ? "Closed"
                  : j.status === 10
                  ? "Duplicate"
                  : "Invalid",
            })),
          );
        });
    }
  }, [completeAPI]);

  const getTableData = () => {
    axios
      .get(`${urls.NRMS + completeAPI.endPoint}?fromDate=${watch("fromDate")}&toDate=${watch("toDate")}`)
      .then((res) => {
        console.log("Data: ", res.data[completeAPI.resDataVariable]);
        // setTable(res.data[completeAPI.resDataVariable]);
        setTable(
          res.data[completeAPI.resDataVariable].map((j) => ({
            ...j,
            status:
              j.status === null
                ? "Pending"
                : j.status === 0
                ? "Save As Draft"
                : j.status === 1
                ? "Approved By HOD"
                : j.status === 2
                ? "Reject By Concern Department HOD"
                : j.status === 3
                ? "Releasing Order Generated"
                : j.status === 4
                ? "Reject By  Department Clerk"
                : j.status === 5
                ? "Approved By NR HOD"
                : j.status === 6
                ? "Rejected By Department HOD"
                : j.status === 7
                ? "Approved By Assistant Commissioner"
                : j.status === 8
                ? "Completed"
                : j.status === 9
                ? "Closed"
                : j.status === 10
                ? "Duplicate"
                : "Invalid",
          })),
        );
      });
  };

  return (
    <>
      <Head>
        <title>NRMS - Dashboard</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>News Rotation Management System</div>
        <div className={styles.row}>
          <FormControl>
            <RadioGroup
              name="dashboard"
              defaultValue="newsOrAdvertisementStatusDashboard"
              sx={{ gap: 8 }}
              onChange={(e) => {
                setDashboardType({ title: e.target.name, value: e.target.value });
              }}
              row
            >
              <FormControlLabel
                value="newsOrAdvertisementStatusDashboard"
                control={<Radio />}
                label="News/Advertisement Status"
                name="News/Advertisement Status"
              />
              <FormControlLabel
                value="newsOrAdvertisementBillingStatusDashboard"
                control={<Radio />}
                label="News/Advertisement Billing Status"
                name="News/Advertisement Billing Status"
              />
              <FormControlLabel value="pressNote" control={<Radio />} label="Press Note" name="Press Note" />
              <FormControlLabel
                value="paperCutting"
                control={<Radio />}
                label="Paper Cutting"
                name="Paper Cutting"
              />
            </RadioGroup>
          </FormControl>
        </div>
        {/* {dashboardType === "newsOrAdvertisementStatusDashboard" && (
          
        )} */}
        <div className={styles.row}>
          <div className={styles.subTitle}>{dashboardType.title}</div>
        </div>

        {/* {dashboardTiles.length > 1 && (
          <div className={styles.tilesWrapper}>
            {dashboardTiles &&
              dashboardTiles.map((obj, i) => {
                return (
                  <div className={styles.tile} key={i}>
                    <div className={styles.icon}>{obj.icon}</div>
                    <div className={styles.tileContent}>
                      <span style={{ textTransform: "uppercase" }}>{obj.label}</span>
                      <div className={styles.container}>
                        <div className={styles.slider}>
                          <span>{obj.count}</span>
                          <Button
                            variant="contained"
                            onClick={() => {
                              obj.status == "all"
                                ? setTable(table) // @ts-ignore
                                : setTable(table.filter((j) => j.status == obj.status));
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                      {dashboardTiles.length - 1 != i && <div className={styles.divider}></div>}
                    </div>
                  </div>
                );
              })}
          </div>
        )} */}

        <div className={styles.row} style={{ alignItems: "center" }}>
          <FormControl sx={{ width: 250 }} error={!!error.fromDate}>
            <Controller
              control={control}
              name="fromDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    // disabled={router.query.pageMode == "view" ? true : false}
                    inputFormat="dd/MM/yyyy"
                    label={<FormattedLabel id="fromDate" />}
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY/MM/DD"));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} size="small" fullWidth variant="standard" />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>{error?.fromDate ? error.fromDate.message : null}</FormHelperText>
          </FormControl>

          <FormControl sx={{ width: 250 }} error={!!error.toDate}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    // disabled={router.query.pageMode == "view" ? true : false}
                    inputFormat="dd/MM/yyyy"
                    label={<FormattedLabel id="toDate" />}
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY/MM/DD"));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} size="small" fullWidth variant="standard" />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>{error?.toDate ? error.toDate.message : null}</FormHelperText>
          </FormControl>

          <Button variant="contained" sx={{ height: "max-content" }} onClick={getTableData}>
            <FormattedLabel id="search" />
          </Button>
        </div>

        <DataGrid
          autoHeight
          sx={{
            marginTop: 8,
            width: "100%",

            "& .cellColor": {
              backgroundColor: "#1976d2",
              color: "white",
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Paper>
    </>
  );
};

export default Index;
