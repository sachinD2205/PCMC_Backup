import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  LinearProgress,
  ThemeProvider,
  TextareaAutosize,
  Modal,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Input,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PrintIcon from "@mui/icons-material/Print";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
// import Schema from "../../../containers/schema/propertyTax/masters/amenitiesMaster"
import moment from "moment";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import styles from "../../../../../components/municipalSecretariatManagement/styles/view.module.css";
import theme from "../../../../../theme";
import { object } from "yup";
import { useRouter } from "next/router";

import { Visibility } from "@mui/icons-material";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [getRowsData, setGetRowsData] = React.useState([]);
  const [submitDataButton, setSubmitDataButton] = useState(true);
  const [committeeId2, setCommitteeId2] = useState({});
  const [showSaveButton, setshowSaveButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [showDocketModel, setShowDocketModel] = useState(false);

  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: "",
      financialYearMr: "",
    },
  ]);

  const [data, setData] = useState({
    rows: [],
    // totalRows: 0,
    // rowsPerPageOptions: [10, 20, 50, 100],
    // pageSize: 10,
    // page: 1,
  });

  const router = useRouter();

  const language = useSelector((store) => store.labels.language);

  // Get Modal Table - Data
  const getAllDocketEntry = (_pageSize = 10, _pageNo = 0) => {
    if (watch("committeeId")) {
      setSelectedRows([]);
      setLoading(true);
      axios
        .get(`${urls.MSURL}/trnNewDocketEntry/getbystatus?cmId=${watch("committeeId")}`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            let result = res?.data;
            if (result?.length > 0) {
              let _res = result?.map((j, i) => {
                console.log("44");
                return {
                  // id: val.id,
                  // srNo: i + 1,
                  // activeFlag: val.activeFlag,
                  // departmentId: val.departmentId,
                  // officeName: val.officeName,
                  // subjectDate: moment(val.subjectDate).format("MM-DD-YYYY , h:mm a"),
                  // inwardDate: moment(val.inwardOutWardDate).format("MM-DD-YYYY , h:mm a"),
                  // toDate: val.toDate,
                  // subjectSerialNumber: val.subjectSerialNumber,
                  // subject: val.subject,
                  // subjectSummary: val.subjectSummary,
                  // status: val.activeFlag === "Y" ? "Active" : "Inactive",

                  //////////////////////////////////////////////////////////////////////////////////////////////////
                  id: j.id,
                  srNo: i + 1,
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
                  subjectDateShow:
                    j.subjectDate !== null ? moment(j.subjectDate).format("DD-MM-YYYY") : " --- ",
                  approvedDate:
                    j.approvedDate !== null ? moment(j.approvedDate).format("DD-MM-YYYY") : " --- ",
                  inwardDate: moment(j.inwardOutWardDate).format("MM-DD-YYYY , h:mm a"),
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
                            return comittees1?.find((obj) => {
                              return obj.id == val && obj;
                            })?.comitteeEn;
                          })
                          .toString()
                      : "-----",
                  committeeIdMr:
                    typeof j.committeeId === "string"
                      ? j.committeeId
                          ?.split(",")
                          .slice(1, -1)
                          ?.map((val) => {
                            return comittees1?.find((obj) => {
                              return obj.id == val && obj;
                            })?.comitteeMr;
                          })
                          .toString()
                      : "-----",
                  outwardNumber: j.outwardNumber,
                  reference: j.reference,
                  departmentId: j.departmentId,

                  departmentNameEn: departments?.find((obj) => obj.id === j.departmentId)?.departmentEn,
                  departmentNameMr: departments?.find((obj) => obj.id === j.departmentId)?.departmentMr,

                  docketType: j.docketType,
                  budgetHead: j.budgetHead,

                  nameOfApprover: j.nameOfApprover,
                  toDepartment: j.toDepartment,
                  toDesignation: j.toDesignation,
                };
              });

              setData({
                rows: _res ? _res : "",
                // totalRows: res.data.totalElements,
                // rowsPerPageOptions: [10, 20, 50, 100],
                // pageSize: res.data.pageSize,
                // page: res.data.pageNo,
              });
              setLoading(false);
            } else {
              sweetAlert({
                title: "WARNING!",
                text: `No Dockets Are Generated Against Your Selected Committe!`,
                icon: "warning",
                buttons: {
                  confirm: {
                    text: "OK",
                    visible: true,
                    closeModal: true,
                  },
                },
                closeOnClickOutside: false,
                dangerMode: true,
              });
              setData([]);
              setSelectedRows([]);
              setLoading(false);
            }
          } else {
            sweetAlert({
              title: "ERROR!",
              text: `Something Went Wrong!`,
              icon: "error",
              buttons: {
                confirm: {
                  text: "OK",
                  visible: true,
                  closeModal: true,
                },
              },
              closeOnClickOutside: false,
              dangerMode: true,
            });
            setData([]);
            setSelectedRows([]);
            setLoading(false);
          }
        })
        .catch((error) => {
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
            closeOnClickOutside: false,
            dangerMode: true,
          });
          setData([]);
          setSelectedRows([]);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getAllDocketEntry();
  }, [watch("committeeId")]);

  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll`)
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
  }, []);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    console.log("form Data", formData);

    let agendaSubjectDao = selectedRows?.map((j) => ({
      // @ts-ignore
      docketId: j.id,
      // @ts-ignore
      departmentId: j.departmentId,
      // @ts-ignore
      inwardOutWardDate: j.inwardOutWardDate,
      agendaOutwardNo: j.agendaOutwardNo,
      // @ts-ignore
      officeName: j.officeName,
      // @ts-ignore
      status: j.status,
      // @ts-ignore
      subject: j.subject,
      // @ts-ignore
      subjectDate: j.subjectDate,
      // @ts-ignore
      subjectSerialNumber: j.subjectSerialNumber,
      // @ts-ignore
      subjectSummary: j.subjectSummary,
    }));

    const finalBodyForApi = {
      ...formData,
      agendaNo: formData.agendaNo,
      committeeId: Number(formData.committeeId),
      activeFlag: "Y",
      agendaSubjectDao,
    };

    console.log("420", finalBodyForApi);

    // ...................... ALERT .......................

    sweetAlert({
      title: "Are you sure?",
      text: "You want to save the agenda please select yes otherwise not!",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: false,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .post(`${urls.MSURL}/trnPrepareMeetingAgenda/save`, finalBodyForApi)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert("Saved!", "Agenda Saved successfully !", "success").then((will) => {
                if (will) {
                  axios
                    .get(`${urls.MSURL}/trnPrepareMeetingAgenda/getAgendaNo`)
                    .then((res) => {
                      if (res.status == 200 || res.status == 201) {
                        sweetAlert({
                          title: "Great, Please Note Your Agenda Number",
                          text: `Your Agenda Number is : ${res.data}`,
                          icon: "success",
                          // buttons: ["Cancel", "Yes"],
                          dangerMode: false,
                        }).then((will) => {
                          if (will) {
                            router.push({
                              pathname: "/municipalSecretariatManagement/transaction/meetingScheduling",
                            });
                          } else {
                            router.push({
                              pathname: "/municipalSecretariatManagement/transaction/meetingScheduling",
                            });
                          }
                        });
                      } else {
                        sweetAlert("Something Went Wrong");
                      }
                    })
                    .catch((error) => {
                      sweetAlert("Something Went Wrong!");
                    });
                } else {
                  axios
                    .get(`${urls.MSURL}/trnPrepareMeetingAgenda/getAgendaNo`)
                    .then((res) => {
                      if (res.status == 200 || res.status == 201) {
                        sweetAlert({
                          title: "Great, Please Note Your Agenda Number",
                          text: `Your Agenda Number is : ${res.data}`,
                          icon: "success",
                          // buttons: ["Cancel", "Yes"],
                          dangerMode: false,
                        }).then((will) => {
                          if (will) {
                            router.push({
                              pathname: "/municipalSecretariatManagement/transaction/meetingScheduling",
                            });
                          } else {
                            router.push({
                              pathname: "/municipalSecretariatManagement/transaction/meetingScheduling",
                            });
                          }
                        });
                      } else {
                        sweetAlert("Something Went Wrong");
                      }
                    })
                    .catch((error) => {
                      sweetAlert("Something Went Wrong!");
                    });
                }
              });
            } else {
              sweetAlert("Your Record is safe");
            }
          })
          .catch((error) => {
            if (error.request.status === 500) {
              swal(error.response.data.message, {
                icon: "error",
              });
              // getAllDocketEntry()
              setButtonInputState(false);
            } else {
              swal("Something went wrong!", {
                icon: "error",
              });
              // getAllDocketEntry()
              setButtonInputState(false);
            }
            // console.log("error", error);
          });
      } else {
        sweetAlert("Record Is Safe");
      }
    });

    // ........................SWEET....................
  };

  const [comittees1, setcomittees1] = useState([]);

  const getcomittees1 = () => {
    setLoading(true);
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAll`)
      .then((r) => {
        if (r.status == 200 || r.status == 201) {
          setcomittees1(
            r?.data?.committees?.map((row) => ({
              id: row.id,
              comitteeEn: row.committeeName,
              comitteeMr: row.committeeNameMr,
            })),
          );
          setLoading(false);
        } else {
          sweetAlert({
            title: "ERROR!",
            text: `Something Went Wrong!`,
            icon: "error",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            closeOnClickOutside: false,
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
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
          closeOnClickOutside: false,
          dangerMode: true,
        });
        setLoading(false);
      });
  };

  ////////////////////DEPARTMENT//////////////////////
  const [departments, setDepartments] = useState([]);

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartments(
        res?.data?.department?.map((r, i) => ({
          id: r.id,
          departmentEn: r.department,
          departmentMr: r.departmentMr,
        })),
      );
    });
  };

  useEffect(() => {
    getcomittees1();
    getDepartment();
  }, []);

  // USE  EFFECT

  useEffect(() => {
    if (selectedRows?.length > 0) {
      if (getRowsData.length > 0) {
        setshowSaveButton(false);
      }
    } else {
      setshowSaveButton(true);
    }
  }, [selectedRows]);

  // cancell Button
  const cancellButton = () => {
    setValue("coveringLetterSubject", "");
    setValue("coveringLetterNote", "");
    setValue("agendaDescription", "");
    setValue("tip", "");
  };

  // AFTER SUBMIT
  const submitSortedValues = () => {
    console.log("500", getRowsData);
    setSelectedRows(getRowsData);
    handleCancel();
    setSubmitDataButton(true);
  };

  //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   //
  const showModal = () => {
    setIsModalOpen(true);
    // alert("true")
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns1 = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerClassName: styles.header_cell,

      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "departmentId",
      headerName: <FormattedLabel id="departmentName" />,
      headerClassName: styles.header_cell,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {language === "en" ? (
              <strong style={{ color: "black" }}>
                {departments?.find((obj) => obj.id === params?.row?.departmentId)?.departmentEn}
              </strong>
            ) : (
              <strong style={{ color: "black" }}>
                {departments?.find((obj) => obj.id === params?.row?.departmentId)?.departmentMr}
              </strong>
            )}
          </>
        );
      },
    },

    {
      field: "subject",
      headerName: <FormattedLabel id="subject" />,
      headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subjectSummary",
      headerName: <FormattedLabel id="subjectSummary" />,
      headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inwardDate",
      headerName: <FormattedLabel id="inwardDate" />,
      headerClassName: styles.header_cell,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      headerClassName: styles.header_cell,
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: "#096dd9" }}
              onClick={() => {
                setShowDocketModel(true);
                setParticularRow(params?.row);
              }}
            >
              <Tooltip title={language == "en" ? "VIEW THIS DOCKET'S INFO" : "या डॉकेटची माहिती पहा"}>
                <Visibility />
              </Tooltip>
            </IconButton>
          </>
        );
      },
    },
  ];

  const columns = [
    // {
    //   field: "SrNo",
    //   headerName: <FormattedLabel id="srNo" />,
    //   minWidth: 90,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: () => {
    //     let srNo = 1;
    //     for (let i = 1; i < selectedRows?.length; i++) {
    //       srNo++;
    //     }
    //     return <div>{srNo}</div>;
    //   },
    // },
    {
      field: "departmentId",
      headerName: <FormattedLabel id="departmentName" />,
      headerClassName: styles.header_cell,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {language === "en" ? (
              <strong style={{ color: "black" }}>
                {departments?.find((obj) => obj.id === params?.row?.departmentId)?.departmentEn}
              </strong>
            ) : (
              <strong style={{ color: "black" }}>
                {departments?.find((obj) => obj.id === params?.row?.departmentId)?.departmentMr}
              </strong>
            )}
          </>
        );
      },
    },
    {
      field: "subject",
      headerName: <FormattedLabel id="subject" />,
      headerClassName: styles.header_cell,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subjectSummary",
      headerName: <FormattedLabel id="subjectSummary" />,
      headerClassName: styles.header_cell,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inwardDate",
      headerName: <FormattedLabel id="inwardDate" />,
      headerClassName: styles.header_cell,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      headerClassName: styles.header_cell,
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: "#096dd9" }}
              onClick={() => {
                setShowDocketModel(true);
                setParticularRow(params?.row);
              }}
            >
              <Tooltip title={language == "en" ? "VIEW THIS DOCKET'S INFO" : "या डॉकेटची माहिती पहा"}>
                <Visibility />
              </Tooltip>
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    // Load previously selected row IDs from another array
    const prevSelectedRowIds = loadSelectedRowIds();
    setSelectedRowIds(prevSelectedRowIds);
  }, [selectedRows]);

  const loadSelectedRowIds = () => {
    // Load selected row IDs from other array (e.g. localStorage)
    const savedRowIds = selectedRows.map((obj) => obj.id);
    return savedRowIds ? savedRowIds : [];
  };

  /////////////////////////////////////////////////////////
  const [particularRow, setParticularRow] = useState(null);
  // const renderFormFields = () => {
  //   if (!particularRow) return null;
  //   return Object.keys(particularRow).map((field) => (
  //     // <TextField key={field} label={field} value={particularRow[field]} disabled />
  //     <FormControl key={field} style={{ minWidth: 120, marginBottom: "5px" }}>
  //       <InputLabel htmlFor={field}>{field}</InputLabel>
  //       <Input id={field} value={particularRow[field]} disabled />
  //     </FormControl>
  //   ));
  // };

  // Row

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ margin: "30px" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "white",
              fontSize: 19,
              fontWeight: 500,
              borderRadius: 100,
            }}
          >
            <strong>
              <FormattedLabel id="prepareAgenda" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <CircularProgress color="success" />
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit(onSubmitForm)} autoComplete="off">
              {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}

              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl error={!!errors.committeeId}>
                    <InputLabel>{<FormattedLabel id="selectCommitteeName" />} </InputLabel>
                    <Controller
                      control={control}
                      render={({ field }) => (
                        <Select
                          fullWidth
                          autoFocus
                          value={field.value}
                          label={<FormattedLabel id="selectCommitteeName" />}
                          onChange={(value) => field.onChange(value)}
                          variant="standard"
                          style={{ width: "26vw" }}
                        >
                          {comittees1 &&
                            comittees1.map((comittee, index) => {
                              setCommitteeId2(comittee.id, comittee.comittee);
                              return (
                                <MenuItem key={index} value={comittee.id}>
                                  {language == "en"
                                    ? //@ts-ignore
                                      comittee.comitteeEn
                                    : // @ts-ignore
                                      comittee?.comitteeMr}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="committeeId"
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.committeeId ? errors.committeeId.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label={<FormattedLabel id="committeeName" />}
                  // value={
                  //   comittees1?.find(
                  //     (obj) => obj.id === Number(watch("committeeId"))
                  //   )?.committee
                  // }
                  InputLabelProps={{
                    shrink: watch("committeeId") ? true : false,
                  }}
                  value={
                    language == "en"
                      ? comittees1.find((c) => c.id == watch("committeeId"))?.comitteeEn
                      : comittees1.find((c) => c.id == watch("committeeId"))?.comitteeMr
                  }
                  variant="outlined"
                  {...register("committeeName")}
                  error={!!errors.committeeName}
                  helperText={errors?.committeeName ? errors.committeeName.message : null}
                />
              </Grid> */}

                {/* .....................................Letter Subject................................... */}

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "1% 7%",
                  }}
                >
                  <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                    <strong style={{ fontSize: "medium" }}>
                      {<FormattedLabel id="coveringLetterSubject" />}
                    </strong>
                    <TextareaAutosize
                      style={{ overflow: "auto" }}
                      placeholder={language == "en" ? "Covering Letter Subject" : "कव्हरिंग लेटर विषय"}
                      className={styles.bigText}
                      {...register("coveringLetterSubject")}
                    />
                  </Paper>
                </Grid>

                {/* .....................................Letter Subject Note................................... */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "1% 7%",
                  }}
                >
                  <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                    <strong style={{ fontSize: "medium" }}>
                      {<FormattedLabel id="coveringLetterNote" />}
                    </strong>
                    <TextareaAutosize
                      style={{ overflow: "auto" }}
                      placeholder={language == "en" ? "Covering Letter Note" : "कव्हरिंग लेटर नोट"}
                      className={styles.bigText}
                      {...register("coveringLetterNote")}
                    />
                  </Paper>
                </Grid>

                {/* .....................................Agenda Description................................... */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "1% 7%",
                  }}
                >
                  <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                    <strong style={{ fontSize: "medium" }}>
                      {<FormattedLabel id="agendaDescription" />}
                    </strong>
                    <TextareaAutosize
                      style={{ overflow: "auto" }}
                      placeholder={language == "en" ? "Agenda Description" : "अजेंडा वर्णन"}
                      className={styles.bigText}
                      {...register("agendaDescription")}
                    />
                  </Paper>
                </Grid>

                {/* .....................................Tip................................... */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "1% 7%",
                  }}
                >
                  <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                    <strong style={{ fontSize: "medium" }}>{<FormattedLabel id="tip" />}</strong>
                    <TextareaAutosize
                      style={{ overflow: "auto" }}
                      placeholder={language == "en" ? "Tip" : "टिप"}
                      className={styles.bigText}
                      {...register("tip")}
                    />
                  </Paper>
                </Grid>
              </Grid>

              {/* ////////////////////////////////////////Buttons Line//////////////////////////////////////////// */}

              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      // sx={{ marginRight: 8 }}
                      disabled={showSaveButton}
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                      // style={{ borderRadius: "20px" }}
                      size="small"
                    >
                      {language === "en" ? btnSaveText : btnSaveTextMr}
                    </Button>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      // sx={{ marginRight: 8 }}
                      // disabled={data.rows.length > 0 ? false : true}
                      disabled={data?.rows?.length > 0 ? false : true}
                      variant="contained"
                      endIcon={<InsertInvitationIcon />}
                      onClick={() => setIsModalOpen(true)}
                      color="primary"
                      size="small"
                    >
                      {<FormattedLabel id="selectDockets" />}
                    </Button>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      // sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                      size="small"
                    >
                      {<FormattedLabel id="clear" />}
                    </Button>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<CalendarMonthIcon />}
                      onClick={() =>
                        router.push({
                          pathname: "/municipalSecretariatManagement/transaction/calender",
                        })
                      }
                      size="small"
                    >
                      {<FormattedLabel id="calender" />}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </div>
        )}

        {/* ...........................................BUTTONS................................... */}
        {selectedRows?.length > 0 ? (
          <DataGrid
            autoHeight
            sx={{
              overflowY: "scroll",

              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
              "& .MuiSvgIcon-root": {
                color: "black", // change the color of the check mark here
              },
            }}
            disableColumnFilter
            disableColumnSelector
            // hideFooterPagination
            // disableDensitySelector
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                disableExport: true,
                disableToolbarButton: true,
                csvOptions: { disableToolbarButton: true },
                printOptions: { disableToolbarButton: true },
              },
            }}
            density="compact"
            rows={selectedRows || []}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
          />
        ) : (
          ""
        )}

        <>
          <Modal
            title="Select Dockets"
            open={isModalOpen}
            onOk={true}
            // onClose={handleCancel}
            footer=""
            // width="1800px"
            // height="auto"
            sx={{
              padding: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "90%",
              }}
            >
              <DataGrid
                sx={{
                  overflowY: "scroll",
                  backgroundColor: "white",
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
                  // "& .MuiDataGrid-checkboxInput.Mui-checke": {
                  //   color: "blue",
                  //   backgroundColor: "",
                  // },
                  "& .MuiSvgIcon-root": {
                    color: "black", // change the color of the check mark here
                  },
                  // ".MuiDataGrid-checkboxInput:checked + .MuiDataGrid-checkbox": {
                  //   color: "green",
                  // },
                }}
                // disableColumnFilter
                // disableColumnSelector
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    disableExport: true,
                    disableToolbarButton: true,
                    csvOptions: { disableToolbarButton: true },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                density="compact"
                autoHeight={true}
                // rowHeight={50}
                // pagination
                // paginationMode="server"
                // loading={data.loading}
                //   rowCount={data?.totalRows}
                //   rowsPerPageOptions={data?.rowsPerPageOptions}
                //   page={data?.page}
                //   pageSize={data?.pageSize}
                //////////////////////////////////////////////////////////
                rows={data?.rows || []}
                columns={columns1}
                pageSize={10}
                rowsPerPageOptions={[5]}
                checkboxSelection={true}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                selectionModel={selectedRowIds}
                onSelectionModelChange={(ids) => {
                  // alert("Hi");

                  const selectedIDs = new Set(ids);

                  setSelectedRowIds(ids);
                  const selectedRows = data?.rows?.filter((row) => selectedIDs.has(row.id));

                  setGetRowsData(selectedRows);
                  setSubmitDataButton(false);
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 90,
                }}
              >
                <Button
                  disabled={submitDataButton}
                  type="button"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={submitSortedValues}
                >
                  {<FormattedLabel id="submitData" />}
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleCancel}
                >
                  {<FormattedLabel id="closeModal" />}
                </Button>
              </div>
            </Box>
          </Modal>
        </>

        {/* ///////////////////////////////////////////NEW MODEL TO SHOW DOCTKET///////////////////////////////////////////// */}

        <>
          <Modal
            open={showDocketModel}
            sx={{
              padding: 5,
              display: "flex",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                width: "90%",
                bgcolor: "background.paper",
                // p: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                border: "2px solid black",
              }}
            >
              <Box
                className={styles.details}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "20%",
                  height: "auto",
                  overflow: "auto",
                  padding: "0.5%",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 500,
                  borderRadius: 100,
                  border: "1px solid black",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <strong>DOCKET PREVIEW</strong>
                </div>
              </Box>
              <form style={{ maxHeight: "calc(100vh - 170px)", overflowY: "auto" }}>
                {/* {renderFormFields()} */}
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "1% 7%",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "150px" }}
                      label={<FormattedLabel id="subjectDate" />}
                      variant="standard"
                      value={moment(particularRow?.subjectDate).format("DD-MM-YYYY")}
                    />

                    <TextField
                      disabled
                      sx={{ width: "400px" }}
                      label={<FormattedLabel id="departmentName" />}
                      variant="standard"
                      value={
                        language == "en" ? particularRow?.departmentNameEn : particularRow?.departmentNameMr
                      }
                    />
                  </Grid>
                  {/* <Grid
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="departmentName" />}
                      variant="standard"
                      value={
                        language == "en" ? particularRow?.departmentNameEn : particularRow?.departmentNameMr
                      }
                    />
                  </Grid> */}

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "1% 7%",
                    }}
                  >
                    <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                      <strong style={{ fontSize: "medium" }}>{<FormattedLabel id="reference" />}</strong>
                      <TextareaAutosize
                        disabled
                        style={{ overflow: "auto" }}
                        className={styles.bigText}
                        value={particularRow?.reference}
                      />
                    </Paper>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "1% 7%",
                    }}
                  >
                    <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                      <strong style={{ fontSize: "medium" }}>{<FormattedLabel id="subject" />}</strong>
                      <TextareaAutosize
                        disabled
                        style={{ overflow: "auto" }}
                        className={styles.bigText}
                        value={particularRow?.subject}
                      />
                    </Paper>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "1% 7%",
                    }}
                  >
                    <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                      <strong style={{ fontSize: "medium" }}>{<FormattedLabel id="subjectSummary" />}</strong>
                      <TextareaAutosize
                        disabled
                        style={{ overflow: "auto" }}
                        className={styles.bigText}
                        value={particularRow?.subjectSummary}
                      />
                    </Paper>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "1% 7%",
                    }}
                  >
                    <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                      <strong style={{ fontSize: "medium" }}>{<FormattedLabel id="subjectDetails" />}</strong>
                      <TextareaAutosize
                        disabled
                        style={{ overflow: "auto" }}
                        className={styles.bigText}
                        value={particularRow?.subjectDetails}
                      />
                    </Paper>
                  </Grid>

                  {language == "en" ? (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1% 7%",
                      }}
                    >
                      <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                        <strong style={{ fontSize: "medium" }}>
                          {<FormattedLabel id="selectedCommittees" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.committeeIdEn}
                        />
                      </Paper>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1% 7%",
                      }}
                    >
                      <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                        <strong style={{ fontSize: "medium" }}>
                          {<FormattedLabel id="selectedCommittees" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.committeeIdMr}
                        />
                      </Paper>
                    </Grid>
                  )}

                  {language == "en" ? (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ width: "230px" }}
                        label={<FormattedLabel id="financialYear" />}
                        variant="standard"
                        value={particularRow?.financialYearEn}
                      />
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ width: "230px" }}
                        label={<FormattedLabel id="financialYear" />}
                        variant="standard"
                        value={particularRow?.financialYearMr}
                      />
                    </Grid>
                  )}

                  {/* /////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="docketType" />}
                      variant="standard"
                      value={
                        particularRow?.docketType == 2
                          ? language == "en"
                            ? "Expenditure"
                            : "खर्च"
                          : language == "en"
                          ? "General"
                          : "सामान्य"
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="amount" />}
                      variant="standard"
                      value={particularRow?.amount}
                    />
                  </Grid>

                  {particularRow?.docketType == 2 && (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ width: "230px" }}
                        label={<FormattedLabel id="budgetHead" />}
                        variant="standard"
                        value={particularRow?.budgetHead}
                      />
                    </Grid>
                  )}

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="outwardNumber" />}
                      variant="standard"
                      value={particularRow?.outwardNumber}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="approverName" />}
                      variant="standard"
                      value={particularRow?.nameOfApprover}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="approverDepartment" />}
                      variant="standard"
                      value={particularRow?.toDepartment}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="approverDesignation" />}
                      variant="standard"
                      value={particularRow?.toDesignation}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        window.open(
                          `${urls.CFCURL}/file/preview?filePath=${particularRow?.vishaypatra}`,
                          "_blank",
                        );
                      }}
                    >
                      {language == "en" ? "VISHYAPATRA" : "विषय पत्र"}
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        window.open(
                          `${urls.CFCURL}/file/preview?filePath=${particularRow?.prapatra}`,
                          "_blank",
                        );
                      }}
                    >
                      {language == "en" ? "PRAPATRA" : "प्रापत्र"}
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        window.open(
                          `${urls.CFCURL}/file/preview?filePath=${particularRow?.otherDocument}`,
                          "_blank",
                        );
                      }}
                    >
                      {language == "en" ? "OTHER DOCUMENT" : "इतर दस्तऐवज"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => setShowDocketModel(false)}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
