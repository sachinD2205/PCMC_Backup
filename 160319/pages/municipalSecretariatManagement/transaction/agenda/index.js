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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PrintIcon from "@mui/icons-material/Print";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import Schema from "../../../containers/schema/propertyTax/masters/amenitiesMaster"
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css";
import theme from "../../../../theme";
import { object } from "yup";
import { useRouter } from "next/router";
import {
  addPrepareAgendaDataToLocalStorage,
  getPrepareAgendaDataFromLocalStorage,
  removePrepareAgendaDataToLocalStorage,
} from "../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage";

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
  const [showDropDown, setShowDropDown] = useState(false);
  const [committeeId2, setCommitteeId2] = useState({});
  const [showSaveButton, setshowSaveButton] = useState(true);
  const [formDataOfPrepareAgenda] = useState(getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData"));
  const [docketDataOfPrepareAgenda] = useState(
    getPrepareAgendaDataFromLocalStorage("PrepareAgendaDocketData"),
  );

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const router = useRouter();

  const check1 = (newSelection) => {
    for (let i = 0; i < newSelection.length; i++) {
      const hit = rows1?.find((obj) => obj.id === 11)?.firstName;
      console.log("300", hit);
    }
  };

  const language = useSelector((store) => store.labels.language);

  // Get Modal Table - Data
  const getAllDocketEntry = (_pageSize = 10, _pageNo = 0) => {
    if (watch("committeeId")) {
      axios
        .get(
          `${urls.MSURL}/trnNewDocketEntry/getbystatus?status=FREEZED&committeeId=${watch("committeeId")}`,
          {
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
          },
        )
        .then((res) => {
          console.log(";res", res);

          let result = res.data?.newDocketEntry;
          let _res = result?.map((val, i) => {
            console.log("44");
            return {
              activeFlag: val.activeFlag,
              // id: val.id !== null ? val.id : i,
              id: val.id,
              srNo: i + 1,
              // committeeId: val.committeeId,
              // meetingDate: val.meetingDate,
              // karyakramPatrikaNo: val.karyakramPatrikaNo,
              // coveringLetterSubject: val.coveringLetterSubject,
              // coveringLetterSubjectMr: val.coveringLetterSubjectMr,
              // agendaSubject: val.agendaSubject,
              // committeeId: val.committeeId,
              // committeeId: val.committeeId,
              // committeeId: val.committeeId,
              departmentId: val.departmentId,
              officeName: val.officeName,
              subjectDate: moment(val.subjectDate).format("llll"),
              inwardOutWardDate: moment(val.inwardOutWardDate).format("llll"),
              toDate: val.toDate,
              subjectSerialNumber: val.subjectSerialNumber,
              subject: val.subject,
              subjectSummary: val.subjectSummary,
              status: val.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          setData({
            rows: _res ? _res : "",
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        })
        .catch((error) => {
          sweetAlert("No Dockets are Generated Against Your Selected Committe!");
          setData([]);
        });
    }
  };

  useEffect(() => {
    getAllDocketEntry();
  }, [watch("committeeId")]);

  // localhost:8099/ms/api/trnNewDocketEntry/getbystatus?status=FREEZED&committeeId=1

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Save - DB
    // alert("Clicked...");
    console.log("form Data", formData);

    const agendaOutwardDate = moment(formData.agendaOutwardDate).format("YYYY-MM-DD");
    const meetingDate = moment(formData.meetingDate).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...formData,
      agendaNo: formData.agendaNo,
      committeeId: Number(formData.committeeId),
      // agendaOutwardNo: Number(formData.agendaOutwardNo),
      // karyakramPatrikaNo: Number(formData.karyakramPatrikaNo),
      agendaOutwardDate,
      meetingDate,
      //   activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
      activeFlag: "Y",
      agendaSubjectDao: selectedRows,
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
                  removePrepareAgendaDataToLocalStorage("PrepareAgendaFormData");
                  removePrepareAgendaDataToLocalStorage("PrepareAgendaDocketData");
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

                // if (will) {
                //   getAllDocketEntry()
                //   setButtonInputState(false)
                //   setIsOpenCollapse(false)
                //   setEditButtonInputState(false)
                //   setDeleteButtonState(false)
                //   router.push({
                //     pathname:
                //       "/municipalSecretariatManagement/transaction/meetingScheduling",
                //   })
                // } else {
                //   getAllDocketEntry()
                //   setButtonInputState(false)
                //   setIsOpenCollapse(false)
                //   setEditButtonInputState(false)
                //   setDeleteButtonState(false)
                //   router.push({
                //     pathname:
                //       "/municipalSecretariatManagement/transaction/meetingScheduling",
                //   })
                // }
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
    axios.get(`${urls.MSURL}/mstDefineCommittees/getAll`).then((r) => {
      setcomittees1(
        r.data.committees.map((row) => ({
          id: row.id,
          comitteeEn: row.committeeName,
          comitteeMr: row.committeeNameMr,
        })),
      );
    });
  };

  useEffect(() => {
    getcomittees1();
  }, []);

  // USE  EFFECT

  useEffect(() => {
    if (
      watch("meetingDate") &&
      watch("agendaSubject") &&
      watch("agendaOutwardDate") &&
      watch("coveringLetterSubject") &&
      watch("coveringLetterNote") &&
      watch("agendaDescription") &&
      watch("tip") &&
      watch("sabhavruttant")
    ) {
      if (getRowsData.length > 0) {
        setshowSaveButton(false);
        addPrepareAgendaDataToLocalStorage("PrepareAgendaDocketData", getRowsData);
        addPrepareAgendaDataToLocalStorage("PrepareAgendaFormData", {
          committeeId: watch("committeeId"),
          committeeName: watch("committeeName"),
          meetingDate: moment(watch("meetingDate")).format("YYYY-MM-DD"),
          agendaSubject: watch("agendaSubject"),
          agendaOutwardDate: moment(watch("agendaOutwardDate")).format("YYYY-MM-DD"),
          coveringLetterSubject: watch("coveringLetterSubject"),
          coveringLetterNote: watch("coveringLetterNote"),
          agendaDescription: watch("agendaDescription"),
          tip: watch("tip"),
          sabhavruttant: watch("sabhavruttant"),
        });
      }
    } else {
      setshowSaveButton(true);
      // removePrepareAgendaDataToLocalStorage("PrepareAgendaDocketData");
      // removePrepareAgendaDataToLocalStorage("PrepareAgendaFormData");
    }
  }, [
    watch("meetingDate"),
    watch("agendaSubject"),
    watch("agendaOutwardDate"),
    watch("coveringLetterSubject"),
    watch("coveringLetterNote"),
    watch("agendaDescription"),
    watch("tip"),
    watch("sabhavruttant"),
    getRowsData,
  ]);

  useEffect(() => {
    if (formDataOfPrepareAgenda && docketDataOfPrepareAgenda) {
      setValue("committeeId", formDataOfPrepareAgenda.committeeId);
      setValue("meetingDate", formDataOfPrepareAgenda.meetingDate);
      setValue("agendaSubject", formDataOfPrepareAgenda.agendaSubject);
      setValue("agendaOutwardDate", formDataOfPrepareAgenda.agendaOutwardDate);
      setValue("coveringLetterSubject", formDataOfPrepareAgenda.coveringLetterSubject);
      setValue("coveringLetterNote", formDataOfPrepareAgenda.coveringLetterNote);
      setValue("agendaDescription", formDataOfPrepareAgenda.agendaDescription);
      setValue("tip", formDataOfPrepareAgenda.tip);
      setValue("sabhavruttant", formDataOfPrepareAgenda.sabhavruttant);
      setSelectedRows(docketDataOfPrepareAgenda);
      setshowSaveButton(false);
    }
  }, [formDataOfPrepareAgenda, docketDataOfPrepareAgenda]);

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("520", body);
        if (willDelete === true) {
          axios
            .post(`${urls.PTAXURL}/master/amenities/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAllDocketEntry();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllDocketEntry();
                setButtonInputState(false);
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                });
                getAllDocketEntry();
                setButtonInputState(false);
              }
              // console.log("error", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setButtonInputState(false);
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // console.log("inn", willDelete);
        console.log("620", body);

        if (willDelete === true) {
          axios
            .post(`${urls.PTAXURL}/master/amenities/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Recovered!", {
                  icon: "success",
                });
                getAllDocketEntry();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllDocketEntry();
                setButtonInputState(false);
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                });
                getAllDocketEntry();
                setButtonInputState(false);
              }
              // console.log("error", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setButtonInputState(false);
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    setShowDropDown(false);
  };

  // cancell Button
  const cancellButton = (prev) => {
    // reset({
    //   committeeName: "",
    //   meetingDate: null,
    //   karyakramPatrikaNo: "",
    //   agendaSubject: "",
    //   agendaOutwardDate: null,
    //   agendaOutwardNo: "",
    //   coveringLetterSubject: "",
    //   coveringLetterNote: "",
    //   agendaDescription: "",
    //   tip: "",
    //   sabhavruttant: "",
    // })
    setValue("committeeName", "");
    setValue("meetingDate", null);
    setValue("karyakramPatrikaNo", "");
    setValue("agendaSubject", "");
    setValue("agendaOutwardDate", "");
    setValue("coveringLetterSubject", "");
    setValue("coveringLetterNote", "");
    setValue("agendaDescription", "");
    setValue("tip", "");
    setValue("sabhavruttant", "");
  };

  //   Reset Values Cancell
  const resetValuesCancell = {
    committeeName: "",
    meetingDate: null,
    karyakramPatrikaNo: "",
    agendaSubject: "",
    agendaOutwardDate: null,

    coveringLetterSubject: "",
    coveringLetterNote: "",
    agendaDescription: "",
    tip: "",
    sabhavruttant: "",
  };

  // Reset Values Exit
  const resetValuesExit = {};

  // AFTER SUBMIT
  const submitSortedValues = () => {
    console.log("500", getRowsData);
    setSelectedRows(getRowsData);
    handleCancel();
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

  // .............................Get By Values..............................

  let handlePrintAndRoute = () => {
    // alert("handlePrintAndRoute");
    console.log(":415", watch("agendaDescription"));
    router.push({
      pathname: "/municipalSecretariatManagement/transaction/agenda/printAgenda",
    });
  };

  ////////////////////////////MODAL TABLE GRID////////////////////////////////

  //   const columns1 = [
  //     { field: "id", headerName: "ID", width: 90 },
  //     {
  //       field: "firstName",
  //       headerName: "First name",
  //       width: 150,
  //       editable: true,
  //     },
  //     {
  //       field: "lastName",
  //       headerName: "Last name",
  //       width: 150,
  //       editable: true,
  //     },
  //     {
  //       field: "age",
  //       headerName: "Age",
  //       type: "number",
  //       width: 110,
  //       editable: true,
  //     },
  //     {
  //       field: "fullName",
  //       headerName: "Full name",
  //       description: "This column has a value getter and is not sortable.",
  //       sortable: false,
  //       width: 160,
  //       valueGetter: (params) =>
  //         `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  //     },
  //   ]

  const rows1 = [
    { id: 11, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 22, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 33, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 44, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 55, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 66, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 77, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 88, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 99, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  const columns1 = [
    {
      field: "srNo",
      headerName: "Sr.No",
      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "departmentId",
      headerName: "Department Id",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subjectSerialNumber",
      headerName: "Subject Id",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subjectSummary",
      headerName: "Subject Summary",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inwardOutWardDate",
      headerName: "inwardOutWardDate",
      //   description: "This column has a value getter and is not sortable.",
      flex: 1,
      headerAlign: "center",
      align: "center",
      //   valueGetter: (params) =>
      //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];

  const columns = [
    {
      field: "departmentId",
      headerName: <FormattedLabel id="departmentId" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subjectSerialNumber",
      headerName: <FormattedLabel id="subjectId" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subject",
      headerName: <FormattedLabel id="subject" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subjectSummary",
      headerName: <FormattedLabel id="subjectSummary" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inwardOutWardDate",
      headerName: <FormattedLabel id="inwardOutWardDate" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "InwardDate",
    //   headerName: "Inward Date",
    //   minWidth: 180,
    // maxWidth: 250,
    // headerAlign: "center",
    // align: "center",
    //   alignItems: "center",
    // },
    // {
    //   field: "revert",
    //   headerName: "Revert",
    //   minWidth: 180,
    // maxWidth: 250,
    // headerAlign: "center",
    // align: "center",
    // },
    // { field: "toDate", headerName: <FormattedLabel id="toDate" /> },
    // { field: "status", headerName: <FormattedLabel id="status" /> },
    // {
    //   field: "Actions",
    //   //   headerName: <FormattedLabel id="actions" />,
    //   width: 120,
    //   alignItems: "center",
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setBtnSaveTextMr("अद्यतन"),
    //               setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true)
    //             setButtonInputState(true)
    //             console.log("params.row: ", params.row)
    //             reset(params.row)
    //           }}
    //         >
    //           <EditIcon style={{ color: "#556CD6" }} />
    //         </IconButton>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setBtnSaveTextMr("अद्यतन"),
    //               setID(params.row.id),
    //               //   setIsOpenCollapse(true),
    //               setSlideChecked(true)
    //             setButtonInputState(true)
    //             console.log("params.row: ", params.row)
    //             reset(params.row)
    //           }}
    //         >
    //           {params.row.activeFlag == "Y" ? (
    //             <ToggleOnIcon
    //               style={{ color: "green", fontSize: 30 }}
    //               onClick={() => deleteById(params.id, "N")}
    //             />
    //           ) : (
    //             <ToggleOffIcon
    //               style={{ color: "red", fontSize: 30 }}
    //               onClick={() => deleteById(params.id, "Y")}
    //             />
    //           )}
    //         </IconButton>
    //       </>
    //     )
    //   },
    // },
  ];

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
              width: "80%",
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

        <div>
          <form onSubmit={handleSubmit(onSubmitForm)}>
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
                        style={{ width: "40vw" }}
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

              <Grid
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
              </Grid>

              <Grid
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
                <FormControl style={{ backgroundColor: "white" }} error={!!errors.meetingDate}>
                  <Controller
                    control={control}
                    name="meetingDate"
                    defaultValue={null}
                    disabled={formDataOfPrepareAgenda ? true : false}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="agendaDate" />
                            </span>
                          }
                          value={field.value || null}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="outlined"
                              fullWidth
                              InputLabelProps={
                                {
                                  // style: {
                                  //   fontSize: 12,
                                  //   marginTop: 3,
                                  // },
                                }
                              }
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>{errors?.meetingDate ? errors.meetingDate.message : null}</FormHelperText>
                </FormControl>
              </Grid>

              {/* /////////////////////////AGENDA NO. FIELD IS COMMENTED, BECAUSE IT IS AUTOGENERATING AFTER SAVING THE AGENDA////////////////////// */}
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
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Agenda Number"
                    variant="outlined"
                    {...register("agendaNo")}
                    error={!!errors.agendaNo}
                    helperText={
                      errors?.agendaNo ? errors.agendaNo.message : null
                    }
                  />
                </Grid> */}
              {/* /////////////////////////AGENDA NO. FIELD IS COMMENTED, BECAUSE IT IS AUTOGENERATING AFTER SAVING THE AGENDA////////////////////// */}
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
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Karyakram Patrika No."
                    variant="outlined"
                    {...register("karyakramPatrikaNo")}
                    error={!!errors.karyakramPatrikaNo}
                    helperText={
                      errors?.karyakramPatrikaNo
                        ? errors.karyakramPatrikaNo.message
                        : null
                    }
                  />
                </Grid> */}

              <Grid
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
                  InputLabelProps={{
                    shrink: watch("agendaSubject") ? true : false,
                  }}
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label={<FormattedLabel id="agendaSubject" />}
                  variant="outlined"
                  {...register("agendaSubject")}
                  error={!!errors.agendaSubject}
                  helperText={errors?.agendaSubject ? errors.agendaSubject.message : null}
                />
              </Grid>

              <Grid
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
                <FormControl style={{ backgroundColor: "white" }} error={!!errors.agendaOutwardDate}>
                  <Controller
                    control={control}
                    name="agendaOutwardDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="agendaOutwardDate" />
                            </span>
                          }
                          value={field.value || null}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="outlined"
                              fullWidth
                              InputLabelProps={
                                {
                                  // style: {
                                  //   fontSize: 12,
                                  //   marginTop: 3,
                                  // },
                                }
                              }
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.agendaOutwardDate ? errors.agendaOutwardDate.message : null}
                  </FormHelperText>
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
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Agenda Outward No."
                  variant="outlined"
                  {...register("agendaOutwardNo")}
                  error={!!errors.agendaOutwardNo}
                  helperText={errors?.agendaOutwardNo ? errors.agendaOutwardNo.message : null}
                />
              </Grid> */}

              {/* .....................................Letter Subject................................... */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: watch("coveringLetterSubject") ? true : false,
                  }}
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label={<FormattedLabel id="coveringLetterSubject" />}
                  variant="outlined"
                  multiline
                  rows={3}
                  minRows={2}
                  {...register("coveringLetterSubject")}
                  error={!!errors.coveringLetterSubject}
                  helperText={errors?.coveringLetterSubject ? errors.coveringLetterSubject.message : null}
                />
              </Grid>

              {/* .....................................Letter Subject Note................................... */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: watch("coveringLetterNote") ? true : false,
                  }}
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="coveringLetterNote" />}
                  variant="outlined"
                  multiline
                  rows={3}
                  minRows={2}
                  {...register("coveringLetterNote")}
                  error={!!errors.coveringLetterNote}
                  helperText={errors?.coveringLetterNote ? errors.coveringLetterNote.message : null}
                />
              </Grid>

              {/* .....................................Agenda Description................................... */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: watch("agendaDescription") ? true : false,
                  }}
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label={<FormattedLabel id="agendaDescription" />}
                  variant="outlined"
                  multiline
                  rows={3}
                  minRows={2}
                  {...register("agendaDescription")}
                  error={!!errors.agendaDescription}
                  helperText={errors?.agendaDescription ? errors.agendaDescription.message : null}
                />
              </Grid>

              {/* .....................................Tip................................... */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: watch("tip") ? true : false,
                  }}
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label={<FormattedLabel id="tip" />}
                  variant="outlined"
                  multiline
                  rows={3}
                  minRows={2}
                  {...register("tip")}
                  error={!!errors.tip}
                  helperText={errors?.tip ? errors.tip.message : null}
                />
              </Grid>

              {/* .....................................Sabhavruttant................................... */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: watch("sabhavruttant") ? true : false,
                  }}
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label={<FormattedLabel id="sabhavruttant" />}
                  variant="outlined"
                  multiline
                  rows={3}
                  minRows={2}
                  {...register("sabhavruttant")}
                  error={!!errors.sabhavruttant}
                  helperText={errors?.sabhavruttant ? errors.sabhavruttant.message : null}
                />
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
                <Button
                  // sx={{ marginRight: 8 }}
                  disabled={showSaveButton}
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                  // style={{ borderRadius: "20px" }}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "green",
                    color: "white",
                  }}
                  size="small"
                >
                  {language === "en" ? btnSaveText : btnSaveTextMr}
                </Button>
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
                <Button
                  // sx={{ marginRight: 8 }}
                  // disabled={data.rows.length > 0 ? false : true}
                  disabled={data?.rows?.length > 0 ? false : true}
                  variant="contained"
                  endIcon={<InsertInvitationIcon />}
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "yellow",
                    color: "black",
                  }}
                  size="small"
                >
                  {<FormattedLabel id="selectDockets" />}
                </Button>
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
                <Button
                  // sx={{ marginRight: 8 }}
                  variant="contained"
                  color="primary"
                  endIcon={<ClearIcon />}
                  onClick={() => cancellButton()}
                  style={{ borderRadius: "20px" }}
                  size="small"
                >
                  {<FormattedLabel id="clear" />}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
        {/* ...........................................BUTTONS................................... */}

        <div
          style={{
            marginBottom: "10px",
          }}
        >
          <Box style={{ padding: "10px" }}>
            <DataGrid
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
              }}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
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
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              rows={selectedRows || []}
              columns={columns}
              // onPageChange={(_data) => {
              //   getAllDocketEntry(data?.pageSize, _data);
              // }}
              // onPageSizeChange={(_data) => {
              //   console.log("222", _data);
              //   // updateData("page", 1);
              //   getAllDocketEntry(_data, data?.page);
              // }}
            />
            {/* /////////////////////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                padding: "30px",
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
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<CalendarMonthIcon />}
                  onClick={() =>
                    router.push({
                      pathname: "/municipalSecretariatManagement/transaction/calender",
                    })
                  }
                  style={{ borderRadius: "20px" }}
                  size="small"
                >
                  {/* {<FormattedLabel id="exit" />} */}
                  Calender
                </Button>
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
                <Button
                  // sx={{ marginRight: 8 }}
                  disabled={showSaveButton}
                  variant="contained"
                  endIcon={<PrintIcon />}
                  onClick={handlePrintAndRoute}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "yellow",
                    color: "black",
                  }}
                  size="small"
                >
                  {/* {<FormattedLabel id="clear" />} */}
                  Print Preview
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/* //////////////////////////////// */}
        </div>
        <>
          <Modal
            title="Agenda Modal"
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
                height: 500,
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <DataGrid
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
                pagination
                paginationMode="server"
                // loading={data.loading}
                //   rowCount={data?.totalRows}
                //   rowsPerPageOptions={data?.rowsPerPageOptions}
                //   page={data?.page}
                //   pageSize={data?.pageSize}
                //////////////////////////////////////////////////////////
                rows={data.rows || []}
                columns={columns1}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection={true}
                disableSelectionOnClick
                // selectionModel={select}
                experimentalFeatures={{ newEditingApi: true }}
                onSelectionModelChange={(ids) => {
                  // alert("Hi")
                  //   setSelection(newSelection)
                  //   check1(newSelection)
                  //   console.log("100", check1(newSelection))
                  const selectedIDs = new Set(ids);
                  const selectedRows = data?.rows?.filter((row) => selectedIDs.has(row.id));
                  //   submitSortedValues(selectedRows)
                  setGetRowsData(selectedRows);
                }}
              />
              <div
                style={{
                  marginTop: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 90,
                }}
              >
                <Button
                  disabled={getRowsData.length > 0 ? false : true}
                  type="button"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={submitSortedValues}
                >
                  Submit Data
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleCancel}
                >
                  Close Modal
                </Button>
              </div>
            </Box>
          </Modal>
        </>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
