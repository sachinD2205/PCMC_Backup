import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./newDocketEntry.module.css";

import Paper from "@mui/material/Paper";
import {
  Button,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Tooltip,
  CircularProgress,
  Box,
  Checkbox,
  ListItemText,
} from "@mui/material";
// import Add from '@mui/icons-material/Add'
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Clear, Delete, Edit, ExitToApp, Save, Visibility, Watch } from "@mui/icons-material";
import Slide from "@mui/material/Slide";
import FormControl from "@mui/material/FormControl";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import URLs from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import UploadButton from "../../../../containers/reuseableComponents/UploadButton";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VishapatraUpload from "../../documentsUpload/VishapatraUpload";
import PrapatraUpload from "../../documentsUpload/PrapatraUpload";
import OtherDocumentsUpload from "../../documentsUpload/OtherDocumentsUpload";

const Index = () => {
  const [table, setTable] = useState([]);
  const [ID, setID] = useState();
  const [officeName, setOfficeName] = useState([{ id: 1, officeNameEn: "", officeNameMr: "" }]);

  //////////////////////////////////////Showing To the particular HOD of the dept/////////////////////////////
  const selecedHOD = useSelector((state) => {
    console.log("userDetails", state?.user?.usersDepartmentDashboardData?.userDao?.department);
    return state?.user?.usersDepartmentDashboardData?.userDao?.department;
  });
  console.log(":10", selecedHOD);

  //////////////////////////////////////Showing To the particular HOD of the dept/////////////////////////////

  const [departmentName, setDepartmentName] = useState([]);
  const [committeeName, setCommitteeName] = useState([]);
  const [financialYear, setFinancialYear] = useState([]);
  const [docketType, setDocketType] = useState([{ id: 1, docketTypeEn: "", docketTypeMr: "" }]);
  const [attachment, setAttachment] = useState("");
  const [attachment1, setAttachment1] = useState("");
  const [attachment2, setAttachment2] = useState("");
  const [attachment3, setAttachment3] = useState("");
  const [runAgain, setRunAgain] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [actions, setActions] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);

  //Area Details
  let areaDetailsSchema = yup.object().shape({
    action: yup.string().required("Please select an action"),
    hodRemark: yup.string().required("Please enter a remark"),
    // outwardNumber: yup.string().required('Please enter the outward number'),
  });

  const {
    register: register,
    handleSubmit: handleSubmit,
    // @ts-ignore
    methods: methods,
    reset: reset,
    control: control,
    watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(areaDetailsSchema),
  });

  useEffect(() => {
    //Get Office

    axios
      .get(`${URLs.MSURL}/mstElectoral/getAll`)
      .then((r) => {
        setOfficeName(
          r.data.electoral.map((row) => ({
            id: row.id,
            officeNameEn: row.electoralWardName,
            officeNameMr: row.electoralWardNameMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    // axios
    //   .get(`${URLs.MSURL}/mstDefineOfficeDetails/getAll`)
    //   .then((res) => {
    //     console.log("Office: ", res.data.defineOfficeDetails);
    //     setOfficeName(
    //       res.data.defineOfficeDetails.map((j) => ({
    //         id: j.id,
    //         officeNameEn: j.office,
    //         officeNameMr: j.officeMr,
    //       })),
    //     );
    //   })
    //   .catch((error) => {
    //     console.log("error: ", error);
    //     sweetAlert({
    //       title: "ERROR!",
    //       text: `${error}`,
    //       icon: "error",
    //       buttons: {
    //         confirm: {
    //           text: "OK",
    //           visible: true,
    //           closeModal: true,
    //         },
    //       },
    //       dangerMode: true,
    //     });
    //   });

    //Get Department
    axios
      .get(`${URLs.CFCURL}/master/department/getAll`)
      .then((res) => {
        console.log("Department: ", res.data.department);
        setDepartmentName(
          res.data.department.map((j) => ({
            id: j.id,
            departmentNameEn: j.department,
            departmentNameMr: j.departmentMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Committee
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
      .then((res) => {
        console.log("Committee: ", res.data.committees);
        setCommitteeName(
          res.data.committees.map((j) => ({
            id: j.id,
            committeeNameEn: j.committeeName,
            committeeNameMr: j.committeeNameMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Financial Year
    axios
      .get(`${URLs.CFCURL}/master/financialYearMaster/getAll`)
      .then((res) => {
        console.log("Financial Year: ", res.data.financialYear);
        setFinancialYear(
          res.data.financialYear.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Docket Type
    axios
      .get(`${URLs.MSURL}/mstDocketType/getAll`)
      .then((res) => {
        console.log("Docket Type: ", res.data.docketType);
        setDocketType(
          res.data.docketType.map((j) => ({
            id: j.id,
            docketTypeEn: j.docketType,
            docketTypeMr: j.docketTypeMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });
  }, []);

  useEffect(() => {
    setRunAgain(false);
    //Table
    setLoading(true);
    axios
      .get(`${URLs.MSURL}/trnNewDocketEntry/getAll`)
      .then((res) => {
        console.log("Table: ", res.data.newDocketEntry);
        setTable(
          // res.data.newDocketEntry.map((j, i) => ({
          res?.data?.newDocketEntry
            ?.filter((obj) => {
              return obj.status === "INITIATED" || obj.status === "SUBMITTED";
            })
            .filter((ob) => {
              console.log(":30", ob);
              return ob.departmentId === selecedHOD;
            })
            .map((j, i) => ({
              ...j,
              id: j.id,
              srNo: i + 1,
              attachment: j.uploadDocument,
              vishaypatra: j.vishaypatra,
              prapatra: j.prapatra,
              otherDocument: j.otherDocument,
              status: j.status,
              docketId: j.docketId,
              statusChanged:
                j.status === "INITIATED"
                  ? "INITIATED BY CLERK"
                  : "" || j.status === "SUBMITTED"
                  ? "SEND TO THE SECRETARY CLERK"
                  : "",
              subject: j.subject,
              subjectSummary: j.subjectSummary,
              subjectDetails: j.subjectDetails,
              subjectSerialNumber: j.subjectSerialNumber,
              subjectDate: j.subjectDate,
              subjectDateShow: j.subjectDate !== null ? moment(j.subjectDate).format("DD-MM-YYYY") : " --- ",
              approvedDate: j.approvedDate !== null ? moment(j.approvedDate).format("DD-MM-YYYY") : " --- ",
              hodRemark: j.hodRemark,
              inwardOutwardNumber: j.inwardOutwardNumber,
              financialYearEn: financialYear?.find((obj) => {
                return obj.id === j.financialYear;
              })?.financialYearEn,
              financialYearMr: financialYear?.find((obj) => {
                return obj.id === j.financialYear;
              })?.financialYearMr,
              committeeIdEn:
                typeof j.committeeId === "string"
                  ? j.committeeId
                      ?.split(",")
                      .slice(1, -1)
                      ?.map((val) => {
                        return committeeName?.find((obj) => {
                          return obj.id == val && obj;
                        })?.committeeNameEn;
                      })
                      .toString()
                  : "-----",
              committeeIdMr:
                typeof j.committeeId === "string"
                  ? j.committeeId
                      ?.split(",")
                      .slice(1, -1)
                      ?.map((val) => {
                        return committeeName?.find((obj) => {
                          return obj.id == val && obj;
                        })?.committeeNameMr;
                      })
                      .toString()
                  : "-----",
              outwardNumber: j.outwardNumber,
              reference: j.reference,
              departmentNameEn: departmentName?.find((obj) => obj.id === j.departmentId)?.departmentNameEn,
              departmentNameMr: departmentName?.find((obj) => obj.id === j.departmentId)?.departmentNameMr,

              budgetHead: j.budgetHead,

              nameOfApprover: j.nameOfApprover,
              toDepartment: j.toDepartment,
              toDesignation: j.toDesignation,
            })),
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
        setLoading(false);
      });
  }, [departmentName, financialYear, committeeName, runAgain]);

  const columns = [
    {
      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 90,
      renderCell: (params) => {
        return (
          <div
            // disabled={editButtonInputState}
            // onClick={() => {
            //   console.log("params.row: ", params?.row)
            //   // reset(params.row)
            // }} // IT IS POSSIBLE TO DO ONCLICK IN DIV
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            {params?.row?.srNo}
            {params?.row?.statusChanged === "SEND TO THE SECRETARY CLERK" ? (
              <div style={{ color: "green" }}>
                <Tooltip title="SEND TO THE SECRETARY CLERK">
                  <ArrowUpwardIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            ) : (
              <div style={{ color: "orange" }}>
                <Tooltip title="INITIATED BY CLERK">
                  <ArrowDownwardIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* <AssignmentIndIcon style={{ color: "green" }} /> */}
          </div>
        );
      },
    },
    // {
    //   field: "subjectSerialNumber",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="subjectSerialNumber" />,
    //   width: 200,
    // },
    {
      field: "docketId",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="docketId" />,
      width: 150,
    },
    {
      field: "subjectDateShow",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectDate" />,
      width: 150,
    },
    {
      field: "approvedDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="approvedDate" />,
      width: 150,
    },
    {
      field: language === "en" ? "financialYearEn" : "financialYearMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="financialYear" />,
      width: 150,
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="departmentName" />,
      width: 290,
    },
    {
      field: language === "en" ? "committeeIdEn" : "committeeIdMr",
      // align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeName" />,
      width: 400,
    },
    {
      field: "reference",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="reference" />,
      width: 210,
    },
    {
      field: "subject",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 200,
    },
    {
      field: "subjectSummary",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="description" />,
      width: 175,
    },
    // {
    //   field: "outwardNumber",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="outwardNumber" />,
    //   width: 210,
    // },
    /////////////////// REMOVING THIS FIELED AFETR GIVING THE MAIN DEMO AS DATED ON 13-04-2023 //////////////////
    // {
    //   field: "Attachment",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="attachment" />,
    //   width: 450,
    //   renderCell: (params) => {
    //     return (
    //       <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
    //         {params.row.vishaypatra && (
    //           <Button
    //             variant="contained"
    //             onClick={() => {
    //               window.open(`${URLs.CFCURL}/file/preview?filePath=${params.row.vishaypatra}`, "_blank");
    //             }}
    //           >
    //             {/* {<FormattedLabel id="preview" />} */}
    //             vishaypatra
    //           </Button>
    //         )}

    //         {/* /////////////////////////////////////////// */}

    //         {params.row.prapatra && (
    //           <Button
    //             variant="contained"
    //             onClick={() => {
    //               window.open(`${URLs.CFCURL}/file/preview?filePath=${params.row.prapatra}`, "_blank");
    //             }}
    //           >
    //             {/* {<FormattedLabel id="preview" />} */}
    //             prapatra
    //           </Button>
    //         )}

    //         {/* /////////////////////////////////////////// */}
    //         {params.row.otherDocument && (
    //           <Button
    //             variant="contained"
    //             onClick={() => {
    //               window.open(`${URLs.CFCURL}/file/preview?filePath=${params.row.otherDocument}`, "_blank");
    //             }}
    //           >
    //             {/* {<FormattedLabel id="preview" />} */}
    //             other_Document
    //           </Button>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      // field: 'subjectStatus',
      field: "statusChanged",
      // align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectStatus" />,
      width: 250,
      renderCell: (params) => {
        return (
          <div
          // disabled={editButtonInputState}
          // onClick={() => {
          //   console.log("params.row: ", params?.row)
          //   // reset(params.row)
          // }} // IT IS POSSIBLE TO DO ONCLICK IN DIV
          >
            {params?.row?.statusChanged === "SEND TO THE SECRETARY CLERK" ? (
              <div
                style={{
                  color: "green",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {params?.row?.statusChanged}
                {/* <ArrowUpwardIcon sx={{ fontSize: "15px" }} /> */}
              </div>
            ) : (
              <div
                style={{
                  color: "orange",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {params?.row?.statusChanged}
                {/* <ArrowDownwardIcon sx={{ fontSize: "15px" }} /> */}
              </div>
            )}
            {/* <AssignmentIndIcon style={{ color: "green" }} /> */}
          </div>
        );
      },
    },
    {
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: "#096dd9" }}
              onClick={() => {
                console.log(table[params.row.srNo - 1]);
                reset(table[params.row.srNo - 1]);
                // setAttachment(params.row.attachment);
                setAttachment1(params.row.vishaypatra);
                setAttachment2(params.row.prapatra);
                setAttachment3(params.row.otherDocument);
                setCollapse(!collapse);
                setSelectedValues(params?.row?.committeeId?.split(",").slice(1, -1).map(Number));
              }}
            >
              <Visibility />
            </IconButton>
            {/* <IconButton
              disabled={collapse}
              onClick={() => deleteById(params.id)}
            >
              <Delete />
            </IconButton> */}
          </>
        );
      },
    },
  ];

  const finalSubmit = (data) => {
    axios
      .post(`${URLs.MSURL}/trnNewDocketEntry/saveApplicationApprove`, {
        // activeFlag: 'Y',
        id: data.id,
        hodRemark: data.hodRemark,
        action: data.action,
        role: "HOD",
        nameOfApprover: data.nameOfApprover,
        toDepartment: data.toDepartment,
        toDesignation: data.toDesignation,
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setRunAgain(true);
          setCollapse(false);
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });
  };

  const handleSelect = (event) => {
    console.log(":lok3..event", event.target.value);
    setSelectedValues(event.target.value);
  };

  return (
    <>
      <Head>
        <title>New Docket (HOD)</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>New Docket Entry</div>
        <div style={{ marginTop: 40 }}>
          {/* <Button
            sx={{ width: 100 }}
            variant='contained'
            endIcon={<Add />}
            onClick={() => {
              setCollapse(!collapse)
            }}
          >
            <FormattedLabel id='add' />
          </Button> */}
          {collapse && (
            <Slide direction="down" in={collapse} mountOnEnter unmountOnExit>
              <form onSubmit={handleSubmit(finalSubmit)}>
                <div className={styles.main} style={{ marginTop: 3 }}>
                  <div className={styles.row}>
                    <FormControl error={!!error.subjectDate}>
                      <Controller
                        control={control}
                        name="subjectDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              inputFormat="dd/MM/yyyy"
                              label={
                                <span>
                                  <FormattedLabel id="subjectDate" required />
                                </span>
                              }
                              disabled
                              value={router.query.subjectDate ? router.query.subjectDate : field.value}
                              onChange={(date) =>
                                field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))
                              }
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "250px" }}
                                  {...params}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>{error?.subjectDate ? error.subjectDate.message : null}</FormHelperText>
                    </FormControl>

                    {/* <FormControl disabled variant="standard" error={!!error.officeName}>
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        //   disabled={isDisabled}
                      >
                        <FormattedLabel id="officeNameOrElectoralWard" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "250px" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="officeNameOrElectoralWard"
                          >
                            {officeName &&
                              officeName.map((value, index) => (
                                <MenuItem
                                  key={index}
                                  value={
                                    //@ts-ignore
                                    value.id
                                  }
                                >
                                  {language == "en"
                                    ? //@ts-ignore
                                      value.officeNameEn
                                    : // @ts-ignore
                                      value?.officeNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="officeName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{error?.officeName ? error.officeName.message : null}</FormHelperText>
                    </FormControl> */}

                    <FormControl disabled variant="standard" error={!!error.departmentId}>
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        //   disabled={isDisabled}
                      >
                        <FormattedLabel id="departmentName" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "400px" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="departmentName"
                          >
                            {departmentName &&
                              departmentName.map((value, index) => (
                                <MenuItem
                                  key={index}
                                  value={
                                    //@ts-ignore
                                    value.id
                                  }
                                >
                                  {language == "en"
                                    ? //@ts-ignore
                                      value.departmentNameEn
                                    : // @ts-ignore
                                      value?.departmentNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="departmentId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {error?.departmentId ? error.departmentId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </div>

                  <div className={styles.row}>
                    <span style={{ opacity: "0.5" }}>{<FormattedLabel id="reference" />}</span>
                    <TextareaAutosize
                      disabled
                      color="neutral"
                      // minRows={1}
                      // maxRows={3}
                      placeholder="Reference"
                      className={styles.bigText}
                      style={{ opacity: "0.5" }}
                      {...register("reference")}
                    />
                  </div>
                  <div className={styles.row}>
                    <span style={{ opacity: "0.5" }}>{<FormattedLabel id="subject" />}</span>
                    <TextareaAutosize
                      disabled
                      color="neutral"
                      minRows={1}
                      // maxRows={3}
                      placeholder="Subject"
                      className={styles.bigText}
                      style={{ opacity: "0.5" }}
                      {...register("subject")}
                    />
                  </div>

                  <div className={styles.row}>
                    <span style={{ opacity: "0.5" }}>{<FormattedLabel id="subjectSummary" />}</span>
                    <TextareaAutosize
                      disabled
                      color="neutral"
                      // minRows={5}
                      placeholder="Subject Summary"
                      className={styles.bigText}
                      style={{ opacity: "0.5" }}
                      {...register("subjectSummary")}
                    />
                  </div>

                  <div className={styles.row}>
                    <span style={{ opacity: "0.5" }}>{<FormattedLabel id="subjectDetails" required />}</span>
                    <TextareaAutosize
                      disabled
                      color="neutral"
                      // minRows={5}
                      placeholder={language == "en" ? "subject Details" : "विषय तपशील"}
                      style={{ opacity: "0.5" }}
                      className={styles.bigText}
                      {...register("subjectDetails")}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      gap: 20,
                      marginTop: "20px",
                    }}
                  >
                    {/* ////////////////// USING MULTISELECT OPTIONS /////////////// */}
                    <FormControl>
                      <InputLabel>
                        <FormattedLabel id="selectCommittees" required />
                      </InputLabel>
                      <Select
                        disabled
                        variant="standard"
                        sx={{ width: "400px" }}
                        multiple
                        value={selectedValues}
                        onChange={handleSelect}
                        renderValue={(selected) =>
                          committeeName
                            .filter((v) => selected.includes(v.id))
                            .map((v) => (language == "en" ? v.committeeNameEn : v.committeeNameMr))
                            .join(", ")
                        }
                      >
                        {committeeName &&
                          committeeName.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              <Checkbox checked={selectedValues?.indexOf(value.id) > -1} />
                              <ListItemText
                                primary={language == "en" ? value.committeeNameEn : value.committeeNameMr}
                              />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      gap: 20,
                      marginTop: "20px",
                    }}
                  >
                    {selectedValues?.length > 0
                      ? selectedValues.map((obj) => (
                          <TextField
                            disabled
                            sx={{ width: "320px" }}
                            value={
                              language == "en"
                                ? committeeName?.find((o) => o.id == Number(obj))?.committeeNameEn
                                : committeeName?.find((o) => o.id == Number(obj))?.committeeNameMr
                            }
                            variant="standard"
                          />
                        ))
                      : ""}
                  </div>

                  <div className={styles.row}>
                    <FormControl disabled variant="standard" error={!!error.financialYear}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="financialYear" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "230px" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="financialYear"
                          >
                            {financialYear &&
                              financialYear.map((value, index) => (
                                <MenuItem
                                  key={index}
                                  value={
                                    //@ts-ignore
                                    value.id
                                  }
                                >
                                  {language == "en"
                                    ? //@ts-ignore
                                      value.financialYearEn
                                    : // @ts-ignore
                                      value?.financialYearMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="financialYear"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {error?.financialYear ? error.financialYear.message : null}
                      </FormHelperText>
                    </FormControl>

                    <FormControl disabled variant="standard" error={!!error.docketType}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="docketType" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "230px" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="docketType"
                          >
                            {docketType &&
                              docketType.map((value, index) => (
                                <MenuItem
                                  key={index}
                                  value={
                                    //@ts-ignore
                                    value.id
                                  }
                                >
                                  {language == "en"
                                    ? //@ts-ignore
                                      value.docketTypeEn
                                    : // @ts-ignore
                                      value?.docketTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="docketType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{error?.docketType ? error.docketType.message : null}</FormHelperText>
                    </FormControl>

                    <TextField
                      disabled
                      id="standard-basic"
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="amount" required />}
                      variant="standard"
                      {...register("amount")}
                      error={!!error.amount}
                      helperText={error?.amount ? error.amount.message : null}
                      defaultValue={router.query.amount ? router.query.amount : ""}
                    />

                    {watch("docketType") && watch("docketType") == 2 ? (
                      <TextField
                        disabled
                        sx={{ width: "230px" }}
                        label={<FormattedLabel id="budgetHead" />}
                        variant="standard"
                        {...register("budgetHead")}
                      />
                    ) : (
                      ""
                    )}

                    <TextField
                      disabled
                      id="standard-basic"
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="outwardNo" required />}
                      variant="standard"
                      {...register("outwardNumber")}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      alignItems: "baseline",
                      marginTop: "50px",
                      gap: 50,
                    }}
                  >
                    <VishapatraUpload
                      appName="TP"
                      serviceName="PARTMAP"
                      label={language == "en" ? "VISHYAPATRA" : "विषय पत्र"}
                      filePath={attachment1}
                      fileUpdater={setAttachment1}
                    />
                    {/* ///////////////////////////////////// */}
                    <PrapatraUpload
                      appName="TP"
                      serviceName="PARTMAP"
                      label={language == "en" ? "PRAPATRA" : "प्रापत्र"}
                      filePath={attachment2}
                      fileUpdater={setAttachment2}
                    />
                    {/* ///////////////////////////////////// */}
                    <OtherDocumentsUpload
                      appName="TP"
                      serviceName="PARTMAP"
                      label={language == "en" ? "OTHER DOCUMENT" : "इतर दस्तऐवज"}
                      filePath={attachment3}
                      fileUpdater={setAttachment3}
                    />
                  </div>

                  <div className={styles.row}>
                    <TextField
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="approverName" />}
                      variant="standard"
                      {...register("nameOfApprover")}
                    />

                    <TextField
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="approverDepartment" />}
                      variant="standard"
                      {...register("toDepartment")}
                    />

                    <TextField
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="approverDesignation" />}
                      variant="standard"
                      {...register("toDesignation")}
                    />

                    <FormControl variant="standard" error={!!error.action}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="actions" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "230px" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            // value={field.value}
                            disabled={watch("status") === "SUBMITTED" ? true : false}
                            value={watch("status") === "SUBMITTED" ? "APPROVED" : field.value}
                            onChange={(e) => {
                              if (e.target.value) {
                                setActions(e.target.value);
                                field.onChange(e);
                              }
                            }}
                            label="action"
                          >
                            <MenuItem key={2} value="APPROVED">
                              {language === "en" ? "Action Approved" : "क्रिया मंजूर"}
                            </MenuItem>
                            <MenuItem key={3} value="REASSIGN">
                              {language === "en" ? "REASSIGN" : "पुन्हा नियुक्त करा"}
                            </MenuItem>
                          </Select>
                        )}
                        name="action"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{error?.action ? error.action.message : null}</FormHelperText>
                    </FormControl>
                  </div>

                  {/* <div className={styles.row}> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      gap: 35,
                      marginTop: 20,
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      sx={{ width: "700px" }}
                      label={<FormattedLabel id="remark" required />}
                      variant="standard"
                      {...register("hodRemark")}
                      error={!!error.hodRemark}
                      helperText={error?.hodRemark ? error.hodRemark.message : null}
                      defaultValue={watch("status") === "SUBMITTED" ? watch("hodRemark") : ""}
                      disabled={watch("status") === "SUBMITTED" ? true : false}
                    />
                  </div>

                  {/* {(actions === "APPROVED" || watch("status") === "SUBMITTED") && (
                    <div className={styles.row}>
                      <TextField
                        id="standard-basic"
                        sx={{ width: "230px" }}
                        label={<FormattedLabel id="outwardNumber" required />}
                        variant="standard"
                        {...register("inwardOutwardNumber")}
                        error={!!error.inwardOutwardNumber}
                        helperText={error?.inwardOutwardNumber ? error.inwardOutwardNumber.message : null}
                        defaultValue={watch("status") === "SUBMITTED" ? watch("inwardOutwardNumber") : ""}
                        disabled={watch("status") === "SUBMITTED" ? true : false}
                      />

                      {watch("status") !== "INITIATED" && (
                        <FormControl error={!!error.inwardOutwardDate}>
                          <Controller
                            control={control}
                            name="inwardOutwardDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  inputFormat="dd/MM/yyyy"
                                  label={
                                    <span>
                                      <FormattedLabel id="outwardDate" required />
                                    </span>
                                  }
                                  disabled
                                  value={
                                    router.query.inwardOutwardDate
                                      ? router.query.inwardOutwardDate
                                      : field.value
                                  }
                                  onChange={(date) =>
                                    field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{ width: "250px" }}
                                      {...params}
                                      size="small"
                                      fullWidth
                                      variant="standard"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {error?.inwardOutwardDate ? error.inwardOutwardDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </div>
                  )} */}
                  <div className={styles.buttons}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={attachment1 ? false : true}
                      endIcon={<Save />}
                    >
                      <FormattedLabel id="save" />
                    </Button>
                    {/* <Button
                      variant='outlined'
                      color='error'
                      endIcon={<Clear />}
                      onClick={clearButton}
                    >
                      <FormattedLabel id='clear' />
                    </Button> */}
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToApp />}
                      // onClick={onBack}
                      onClick={() => {
                        router.push("/municipalSecretariatManagement/dashboard");
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </div>
                </div>
              </form>
            </Slide>
          )}
          {loading ? (
            <Box
              sx={{
                width: "87vw",
                height: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // margin: "auto",
                // textAlign: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <div className={styles.table}>
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {
                    // backgroundColor:'red',
                    // height: '800px !important',
                    // display: "flex",
                    // flexDirection: "column-reverse",
                    // overflow:'auto !important'
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                    marginTop: "17px",
                  },
                }}
                // disableColumnFilter
                // disableColumnSelector
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 0 },
                    disableExport: true,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                //////////////////////////////////
                rows={table}
                //@ts-ignore
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </div>
          )}
        </div>
      </Paper>
    </>
  );
};

export default Index;
