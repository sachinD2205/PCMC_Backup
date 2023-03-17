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
  Box,
  CircularProgress,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Clear, Delete, Edit, ExitToApp, Save, Watch } from "@mui/icons-material";
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import DoneIcon from "@mui/icons-material/Done";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VishapatraUpload from "../../documentsUpload/VishapatraUpload";
import PrapatraUpload from "../../documentsUpload/PrapatraUpload";
import OtherDocumentsUpload from "../../documentsUpload/OtherDocumentsUpload";

const Index = () => {
  const [table, setTable] = useState([]);

  /////////////////////////////SHOW LESS/MORE//////////////////////////////
  const [show, setShow] = useState(false);

  //////////////////////////////////////Showing To the particular HOD of the dept/////////////////////////////
  const selecedHOD = useSelector((state) => {
    console.log("userDetails", state?.user?.usersDepartmentDashboardData?.userDao?.department);
    return state?.user?.usersDepartmentDashboardData?.userDao?.department;
  });
  console.log(":10", selecedHOD);

  //////////////////////////////////////Showing To the particular HOD of the dept/////////////////////////////

  const [officeName, setOfficeName] = useState([{ id: 1, officeNameEn: "", officeNameMr: "" }]);
  const [departmentName, setDepartmentName] = useState([
    {
      id: 1,
      departmentNameEn: "",
      departmentNameMr: "",
    },
  ]);
  const [committeeName, setCommitteeName] = useState([
    {
      id: 1,
      committeeNameEn: "",
      committeeNameMr: "",
    },
  ]);
  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: "",
      financialYearMr: "",
    },
  ]);
  const [docketType, setDocketType] = useState([{ id: 1, docketTypeEn: "", docketTypeMr: "" }]);
  const [docket, setDocket] = useState();
  const [attachment1, setAttachment1] = useState("");
  const [attachment2, setAttachment2] = useState("");
  const [attachment3, setAttachment3] = useState("");
  const [runAgain, setRunAgain] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);

  //Docket Details
  let docketSchema = yup.object().shape({
    subjectDate: yup.string().required("Please select Reservation"),
    subject: yup.string().required("Please select Reservation"),
    officeName: yup.number().required("Please select Reservation"),
    // departmentId: yup.number().required("Please select Reservation"),
    committeeId: yup.number().required("Please select Reservation"),
    financialYear: yup.number().required("Please select Reservation"),
    docketType: yup.number().required("Please select Reservation"),
    subjectSummary: yup.string().required("Please select Reservation"),
    amount: yup.number().required("Please select Reservation"),
  });

  const {
    register,
    // handleSubmit: handleSubmit,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(docketSchema),
  });

  useEffect(() => {
    //Get Office
    axios
      .get(`${URLs.MSURL}/mstDefineOfficeDetails/getAll`)
      .then((res) => {
        console.log("Office: ", res.data.defineOfficeDetails);
        setOfficeName(
          res.data.defineOfficeDetails.map((j) => ({
            id: j.id,
            officeNameEn: j.office,
            officeNameMr: j.officeMr,
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

    //Get Department
    axios
      .get(`${URLs.CFCURL}/master/department/getAll`)
      .then((res) => {
        console.log("Department: ", res.data.department);
        setDepartmentName(
          res?.data?.department?.map((j) => ({
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

  ////////////////////////////////////////////

  useEffect(() => {
    console.log(":12", departmentName);
    if (language == "en") {
      setValue(
        "departmentId",
        departmentName
          ?.filter((ob) => {
            console.log(":30", ob);
            return ob.id === selecedHOD;
          })
          .map((obj) => {
            return obj.departmentNameEn;
          }),
      );
    } else {
      setValue(
        "departmentId",
        departmentName
          ?.filter((ob) => {
            console.log(":30", ob);
            return ob.id === selecedHOD;
          })
          .map((obj) => {
            return obj?.departmentNameMr;
          }),
      );
    }
  });

  ////////////////////////////////////////

  // useEffect(() => {
  //   if (docket === 1) {
  //     setValue('amount', 0)
  //   }
  // }, [docket])

  useEffect(() => {
    setRunAgain(false);
    //Table
    setLoading(true);
    axios
      .get(`${URLs.MSURL}/trnNewDocketEntry/getAll`)
      .then((res) => {
        console.log("Table: ", res.data.newDocketEntry);

        setTable(
          res.data.newDocketEntry
            // .filter((obj) => {
            //   return (
            //     obj.status === "INITIATED" ||
            //     obj.status === "REASSIGN" ||
            //     obj.status === "IN PROCESS" ||
            //     obj.status === "FREEZED"
            //   );
            // })
            .filter((ob) => {
              console.log(":30", ob);
              return ob.departmentId === selecedHOD;
            })
            .map((j, i) => ({
              ...j,
              id: j.id,
              srNo: i + 1,
              vishaypatra: j.vishaypatra,
              prapatra: j.prapatra,
              otherDocument: j.otherDocument,
              subjectStatus: j.status,
              statusChanged:
                j.status === "INITIATED"
                  ? "SEND TO THE DEPARTMENT HOD"
                  : "" || j.status === "SUBMITTED"
                  ? "APPROVED BY THE DEPARTMENT HOD"
                  : "" || j.status === "IN PROCESS"
                  ? "APPROVED BY THE SECRETARY CLERK"
                  : "" || j.status === "FREEZED"
                  ? "APPROVED BY THE SECRETARY"
                  : "" || j.status === "REASSIGN"
                  ? "REVERTED BACK"
                  : "",
              subject: j.subject,
              description: j.subjectSummary,
              subjectSerialNumber: j.subjectSerialNumber,
              subjectDate: j.subjectDate,
              subjectDateShow: j.subjectDate !== null ? moment(j.subjectDate).format("DD-MM-YYYY") : " --- ",
              approvedDate:
                j.approvedDate === null
                  ? "Will Get After Approval"
                  : moment(j.approvedDate).format("DD-MM-YYYY, h:mm a"),
              financialYearEn: financialYear?.find((obj) => {
                return obj.id === j.financialYear;
              })?.financialYearEn,
              financialYearMr: financialYear?.find((obj) => {
                return obj.id === j.financialYear;
              })?.financialYearMr,
              committeeNameEn: committeeName?.find((obj) => {
                return obj.id === j.committeeId;
              })?.committeeNameEn,
              committeeNameMr: committeeName?.find((obj) => {
                return obj.id === j.committeeId;
              })?.committeeNameMr,
              outwardNumber: j.outwardNumber,
            })),
        );
        setLoading(false); // Stop loading
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
        setLoading(false); // Stop loading
      });
  }, [financialYear, committeeName, runAgain]);

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
            {/* {params?.row?.statusChanged === "APPROVED BY THE SECRETARY CLERK" ? (
              <div
                style={{
                  color: "green",
                }}
              >
                <Tooltip title="APPROVED BY THE SECRETARY CLERK">
                  <CheckCircleIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            ) : (
              <div
                style={{
                  color: "orange",
                }}
              >
                <Tooltip title="SEND TO THE DEPARTMENT HOD">
                  <ArrowUpwardIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )} */}
            {/* <AssignmentIndIcon style={{ color: "green" }} /> */}

            {params?.row?.statusChanged === "APPROVED BY THE SECRETARY" && (
              <div
                style={{
                  color: "green",
                }}
              >
                {/* {params?.row?.srNo} */}
                <Tooltip title="APPROVED BY THE SECRETARY">
                  <CheckCircleIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "APPROVED BY THE SECRETARY CLERK" && (
              <div
                style={{
                  color: "#a13eed",
                }}
              >
                {/* {params?.row?.srNo} */}
                <Tooltip title="APPROVED BY THE SECRETARY CLERK">
                  <CheckCircleOutlineIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "APPROVED BY THE DEPARTMENT HOD" && (
              <div
                style={{
                  color: "blue",
                }}
              >
                {/* {params?.row?.srNo} */}
                <Tooltip title="APPROVED BY THE DEPARTMENT HOD">
                  <DoneIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "SEND TO THE DEPARTMENT HOD" && (
              <div
                style={{
                  color: "orange",
                }}
              >
                {/* {params?.row?.srNo} */}
                <Tooltip title="SEND TO THE DEPARTMENT HOD">
                  <ArrowUpwardIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "REVERTED BACK" && (
              <div
                style={{
                  color: "red",
                }}
              >
                {/* {params?.row?.srNo} */}
                <Tooltip title="REASSIGN">
                  <ArrowDownwardIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
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
      field: "subjectDateShow",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectDate" />,
      width: 110,
    },
    {
      field: "approvedDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="approvedDate" />,
      width: 210,
    },
    {
      field: language === "en" ? "financialYearEn" : "financialYearMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="financialYear" />,
      width: 110,
    },
    {
      field: language === "en" ? "committeeNameEn" : "committeeNameMr",
      // align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeName" />,
      width: 290,
    },
    {
      field: "subject",
      // align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 200,
      renderCell: (params) => {
        return (
          <div onClick={() => console.log(":31", params.row)}>
            {/* {show
              ? params?.row?.subject
              : `${params?.row?.subject?.substring(0, 80)}`}
            <>
              <div onClick={() => setShow(!show)}>
                {show ? <ReadMoreIcon /> : "showLess"}
              </div>{" "}
            </> */}
            {params?.row?.subject?.length > 0 ? params?.row?.subject.substring(0, 20) : ""}
          </div>
        );
      },
    },
    {
      field: "description",
      // align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="description" />,
      width: 175,
      renderCell: (params) => {
        return (
          <div onClick={() => console.log(":31", params.row)}>
            {params?.row?.description?.length > 0 ? params?.row?.description.substring(0, 20) : ""}
          </div>
        );
      },
    },
    {
      field: "outwardNumber",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="outwardNumber" />,
      width: 210,
    },
    {
      field: "Attchment",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="attachment" />,
      width: 450,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
            {params.row.vishaypatra && (
              <Button
                variant="contained"
                onClick={() => {
                  window.open(`${URLs.CFCURL}/file/preview?filePath=${params.row.vishaypatra}`, "_blank");
                }}
              >
                {/* {<FormattedLabel id="preview" />} */}
                vishaypatra
              </Button>
            )}

            {/* /////////////////////////////////////////// */}

            {params.row.prapatra && (
              <Button
                variant="contained"
                onClick={() => {
                  window.open(`${URLs.CFCURL}/file/preview?filePath=${params.row.prapatra}`, "_blank");
                }}
              >
                {/* {<FormattedLabel id="preview" />} */}
                prapatra
              </Button>
            )}

            {/* /////////////////////////////////////////// */}
            {params.row.otherDocument && (
              <Button
                variant="contained"
                onClick={() => {
                  window.open(`${URLs.CFCURL}/file/preview?filePath=${params.row.otherDocument}`, "_blank");
                }}
              >
                {/* {<FormattedLabel id="preview" />} */}
                other_Document
              </Button>
            )}
          </div>
        );
      },
    },
    {
      field: "statusChanged",
      // align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectStatus" />,
      width: 300,
      renderCell: (params) => {
        return (
          <div
          // disabled={editButtonInputState}
          // onClick={() => {
          //   console.log("params.row: ", params?.row)
          //   // reset(params.row)
          // }} // IT IS POSSIBLE TO DO ONCLICK IN DIV
          >
            {/* {params?.row?.statusChanged === "APPROVED BY THE SECRETARY CLERK" ? (
              <div style={{ color: "green" }}>{params?.row?.statusChanged}</div>
            ) : (
              <div style={{ color: "orange" }}>{params?.row?.statusChanged}</div>
            )} */}
            {/* <AssignmentIndIcon style={{ color: "green" }} /> */}

            {/* //////////////////////////////////// */}
            {params?.row?.statusChanged === "APPROVED BY THE SECRETARY" && (
              <div
                style={{
                  color: "green",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "APPROVED BY THE SECRETARY CLERK" && (
              <div
                style={{
                  color: "#a13eed",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "APPROVED BY THE DEPARTMENT HOD" && (
              <div
                style={{
                  color: "blue",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "SEND TO THE DEPARTMENT HOD" && (
              <div
                style={{
                  color: "orange",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
            {/* ////////////////////////////////////// */}
            {params?.row?.statusChanged === "REVERTED BACK" && (
              <div
                style={{
                  color: "red",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
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
            {(params.row.status === "INITIATED" || params.row.status === "REASSIGN") && (
              <IconButton disabled={collapse} sx={{ color: "#096dd9" }} onClick={() => editById(params.row)}>
                <Edit />
              </IconButton>
            )}
            {/* <IconButton
              disabled={collapse}
              sx={{ color: 'red' }}
              onClick={() => deleteById(params.id)}
            >
              <Delete />
            </IconButton> */}
          </>
        );
      },
    },
  ];

  const [ID, setID] = useState();

  const editById = (values) => {
    console.log(":321", values);
    setID(values.id);
    reset({
      ...values,
    });
    setAttachment1(values.vishaypatra);
    setAttachment2(values.prapatra);
    setAttachment3(values.otherDocument);

    setCollapse(true);
  };

  const clearButton = () => {
    reset({
      id: ID,
      subjectDate: null,
      subject: "",
      officeName: "",
      departmentId: "",
      committeeId: "",
      financialYear: "",
      docketType: "",
      subjectSummary: "",
      amount: "",
    });
    setAttachment1("");
    setAttachment2("");
    setAttachment3("");
  };

  const deleteById = (id) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .post(`${URLs.MSURL}/trnNewDocketEntry/save`, { id, activeFlag: "N" })
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              sweetAlert("Deleted!", "Record successfully deleted!", "success");
            }
            setRunAgain(true);
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
      }
    });
  };

  const finalSubmit = (data) => {
    const bodyForAPI = {
      ...data,
      departmentId: selecedHOD,
      vishaypatra: attachment1,
      prapatra: attachment2,
      otherDocument: attachment3,
    };

    const bodyForAPIForUpdate = {
      // ...data,
      id: data.id,
      activeFlag: data.activeFlag,
      amount: data.amount,
      committeeId: data.committeeId,
      docketType: data.docketType,
      financialYear: data.financialYear,
      officeName: data.officeName,
      subject: data.subject,
      subjectDate: moment(data.subjectDate).format("YYYY-MM-DD"),
      subjectSummary: data.subjectSummary,
      ///////////////////////////////////
      departmentId: selecedHOD,
      vishaypatra: attachment1,
      prapatra: attachment2,
      otherDocument: attachment3,
    };
    console.log("Body: ", bodyForAPI);
    if (data.id) {
      axios
        .post(`${URLs.MSURL}/trnNewDocketEntry/save`, bodyForAPIForUpdate)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            // if (data.id) {
            //   sweetAlert("Updated!", "Record Updated successfully !", "success");
            // } else {
            //   sweetAlert("Saved!", "Record Saved successfully !", "success");
            // }
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            setRunAgain(true);
            setCollapse(false);
            clearButton();
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
    } else {
      axios
        .post(`${URLs.MSURL}/trnNewDocketEntry/save`, bodyForAPI)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            // if (data.id) {
            //   sweetAlert("Updated!", "Record Updated successfully !", "success");
            // } else {
            //   sweetAlert("Saved!", "Record Saved successfully !", "success");
            // }
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setRunAgain(true);
            setCollapse(false);
            clearButton();
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
    }
  };

  return (
    <>
      <Head>
        <title>New Docket Entry</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>New Docket Entry</div>
        <div style={{ marginTop: 40 }}>
          <Button
            sx={{ width: 100 }}
            variant="contained"
            endIcon={<Add />}
            onClick={() => {
              setCollapse(!collapse);
            }}
          >
            <FormattedLabel id="add" />
          </Button>
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
                              disabled={router.query.subjectDate ? true : false}
                              value={router.query.subjectDate ? router.query.subjectDate : field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                    <FormControl variant="standard" error={!!error.officeName}>
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
                    </FormControl>

                    {/* /////////////////////////// DROPDOWN REPLACED WITH TEXT FIELD ///////////// */}
                    {/* <FormControl
                      variant="standard"
                      error={!!error.departmentId}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        //   disabled={isDisabled}
                      >
                        <FormattedLabel id="departmentName" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "230px" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="departmentName"
                          >
                            {departmentName &&
                              departmentName
                                ?.filter((ob) => {
                                  console.log(":30", ob)
                                  return ob.id === selecedHOD
                                })
                                .map((value, index) => (
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
                        {error?.departmentId
                          ? error.departmentId.message
                          : null}
                      </FormHelperText>
                    </FormControl> */}
                    {/* /////////////////////////// DROPDOWN REPLACED WITH TEXT FIELD ///////////// */}

                    <TextField
                      disabled={true}
                      // InputLabelProps={{ shrink: user ? true : false }}
                      sx={{ width: "250px", fontSize: "bold" }}
                      id="standard-basic"
                      label="Department Name"
                      variant="standard"
                      {...register("departmentId")}
                    />

                    {/* .filter((ob) => {
              console.log(":30", ob)
              return ob.id === selecedHOD
            }) */}
                    {/* /////////////////////////// DROPDOWN REPLACED WITH TEXT FIELD ///////////// */}
                  </div>

                  <div className={styles.row}>
                    <span>Subject</span>
                    <TextareaAutosize
                      color="neutral"
                      disabled={false}
                      minRows={1}
                      maxRows={3}
                      placeholder="Subject"
                      className={styles.bigText}
                      {...register("subject")}
                    />
                  </div>
                  <div className={styles.row}>
                    <span>Subject Summary</span>
                    <TextareaAutosize
                      color="neutral"
                      disabled={false}
                      minRows={1}
                      style={{ overflow: "auto" }}
                      placeholder="Subject Summary"
                      className={styles.bigText}
                      {...register("subjectSummary")}
                    />
                  </div>
                  <div className={styles.row}>
                    <FormControl variant="standard" error={!!error.committeeId}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="committeeName" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "230px" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="committeeId"
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
                                  {language == "en"
                                    ? //@ts-ignore
                                      value.committeeNameEn
                                    : // @ts-ignore
                                      value?.committeeNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="committeeId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{error?.committeeId ? error.committeeId.message : null}</FormHelperText>
                    </FormControl>

                    <FormControl variant="standard" error={!!error.financialYear}>
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

                    <FormControl variant="standard" error={!!error.docketType}>
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
                            onChange={(value) => {
                              field.onChange(value);
                              setDocket(value.target.value);
                              if (value.target.value === 1) {
                                setValue("amount", 0);
                              }
                            }}
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
                      disabled={docket === 1 ? true : false}
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="amount" required />}
                      variant="standard"
                      {...register("amount")}
                      error={!!error.amount}
                      helperText={error?.amount ? error.amount.message : null}
                      InputLabelProps={{
                        shrink: watch("amount") >= -1 ? true : false,
                      }}
                    />
                  </div>
                  {/* <div className={styles.row}> */}
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
                      label="VISHYAPATRA"
                      filePath={attachment1}
                      fileUpdater={setAttachment1}
                    />
                    {/* ///////////////////////////////////// */}
                    <PrapatraUpload
                      appName="TP"
                      serviceName="PARTMAP"
                      label="PRAPATRA"
                      filePath={attachment2}
                      fileUpdater={setAttachment2}
                    />
                    {/* ///////////////////////////////////// */}
                    <OtherDocumentsUpload
                      appName="TP"
                      serviceName="PARTMAP"
                      label="OTHER DOCUMENT"
                      filePath={attachment3}
                      fileUpdater={setAttachment3}
                    />
                  </div>

                  <div className={styles.buttons}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={attachment1 ? false : true}
                      endIcon={<Save />}
                    >
                      <FormattedLabel id="save" />
                    </Button>
                    <Button variant="outlined" color="error" endIcon={<Clear />} onClick={clearButton}>
                      <FormattedLabel id="clear" />
                    </Button>
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
