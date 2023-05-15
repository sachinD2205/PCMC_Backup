import {
  Button,
  Grid,
  Tooltip,
  IconButton,
  Box,
  TextField,
  Paper,
  Modal,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentIcon from "@mui/icons-material/Payment";
import moment from "moment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useEffect, useState } from "react";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import sweetAlert from "sweetalert";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const router1 = useRouter();
  const language = useSelector((state) => state.labels.language);
  const [dataSource, setDataSource] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const router = useRouter();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  let user = useSelector((state) => state.user.user);
  const [isForwoardOpen, setIsForward] = useState(false);
  const [applicationID, selectedApplicationId] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [selectDepartment, setSubDepartments] = useState(null);
  const [isBplval, setIsBpl] = useState(null);
  const logedInUser = localStorage.getItem("loggedInUser");
  const [dataPageNo, setDataPage] = useState();
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [dependDeptId, setDependantDept] = useState(null);
  const [wards, setWards] = useState([]);
  const [zoneDetails, setZoneDetails] = useState();

  const handleCancel = () => {
    setIsForward(false);
  };

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  useEffect(() => {
    getCRAreaName();
    getZone();
    getWards();
    getDepartments();
    getAllSubDepartmentDetails();
  }, []);

  useEffect(() => {
    if (logedInUser === "departmentUser" && authority && authority.find((val) => val === "RTI_ADHIKARI")) {
      getApplicationListByDept();
    } else {
      getApplicationDetails();
    }
  }, [departments]);

  useEffect(() => {
    setDepartments(departments.filter((obj) => obj.id != dependDeptId));
  }, [dependDeptId]);

  const getCRAreaName = () => {
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((r) => {
      setCRAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          crAreaName: row.areaName,
          crAreaNameMr: row.areaNameMr,
        })),
      );
    });
  };

  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
          departmentNameMr: row.departmentMr,
        })),
      );
    });
  };

  // get sub department
  const getAllSubDepartmentDetails = () => {
    axios.get(`${urls.RTI}/master/subDepartment/getAll`).then((res) => {
      setSubDepartmentList(
        res.data.subDepartment.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          departmentId: r.department,
          subDepartment: r.subDepartment,
          subDepartmentMr: r.subDepartmentMr,
        })),
      );
    });
  };

  // get sub department by dept id
  const getSubDepartmentDetails = () => {
    if (watch("departmentKey")) {
      axios.get(`${urls.RTI}/master/subDepartment/getAllByDeptWise/${watch("departmentKey")}`).then((res) => {
        setSubDepartmentList(
          res.data.subDepartment.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartment: r.subDepartment,
          })),
        );
      });
    }
  };

  // get application by departmentwise
  const getApplicationListByDept = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.RTI}/trnRtiApplication/getAllByDepartmet`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          // UserId: user.id
        },
      })
      .then((res, j) => {
        let result = res.data.trnRtiApplicationList;
        setDataSourceDetails(result, _pageSize, _pageNo);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      });
  };

  // get self application
  const getApplicationDetails = (_pageSize = 10, _pageNo = 0) => {
    if (logedInUser === "citizenUser") {
      axios
        .get(`${urls.RTI}/trnRtiApplication/getAll`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: {
            UserId: user.id,
          },
        })
        .then((res, i) => {
          let result = res.data.trnRtiApplicationList;
          setDataSourceDetails(result, _pageSize, _pageNo);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        });
    } else {
      axios
        .get(`${urls.RTI}/trnRtiApplication/getAll`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res, i) => {
          let result = res.data.trnRtiApplicationList;
          setDataSourceDetails(result, _pageSize, _pageNo);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        });
    }
  };

  // get zone
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZoneDetails(
        res.data.zone.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          zoneName: r.zoneName,
          zoneNameMr: r.zoneNameMr,
          zone: r.zone,
          ward: r.ward,
          area: r.area,
          zooAddress: r.zooAddress,
          zooAddressAreaInAcres: r.zooAddressAreaInAcres,
          zooApproved: r.zooApproved,
          zooFamousFor: r.zooFamousFor,
        })),
      );
      setIsBpl(false);
    });
  };

  // get wards
  const getWards = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWards(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
          wardNo: row.wardNo,
          wardNoMr: row.wardNoMr,
        })),
      );
    });
  };

  // set datatable details
  const setDataSourceDetails = (result, _pageSize, _pageNo) => {
    const _res = result.map((res, i) => {
      return {
        srNo: i + 1 + _pageNo * _pageSize,
        id: res.id,
        applicationNo: res.applicationNo,
        deptId: res.departmentKey,
        applicantName: res.applicantFirstName + " " + res.applicantMiddleName + " " + res.applicantLastName,
        departmentName: departments?.find((obj) => {
          return obj.id == res.departmentKey;
        })
          ? departments.find((obj) => {
              return obj.id == res.departmentKey;
            }).department
          : "-",

        areaName: crAreaNames?.find((obj) => {
          return obj.id == res?.areaKey;
        })
          ? crAreaNames.find((obj) => {
              return obj.id == res?.areaKey;
            }).crAreaName
          : "-",

        areaNameMr: crAreaNames?.find((obj) => {
          return obj.id == res?.areaKey;
        })
          ? crAreaNames.find((obj) => {
              return obj.id == res?.areaKey;
            }).crAreaNameMr
          : "-",
        departmentNameMr: departments?.find((obj) => {
          return obj.id == res.departmentKey;
        })
          ? departments.find((obj) => {
              return obj.id == res.departmentKey;
            }).departmentNameMr
          : "-",
        wardName: wards?.find((obj) => {
          return obj.id == res.wardKey;
        })
          ? wards.find((obj) => {
              return obj.id == res.wardKey;
            }).wardName
          : "-",
        wardNameMr: wards?.find((obj) => {
          return obj.id == res.wardKey;
        })
          ? wards.find((obj) => {
              return obj.id == res.wardKey;
            }).wardNameMr
          : "-",
        zoneName: zoneDetails?.find((obj) => {
          return obj.id == res.zoneKey;
        })
          ? zoneDetails.find((obj) => {
              return obj.id == res.zoneKey;
            }).zoneName
          : "-",
        zoneNameMr: zoneDetails?.find((obj) => {
          return obj.id == res.zoneKey;
        })
          ? zoneDetails.find((obj) => {
              return obj.id == res.zoneKey;
            }).zoneNameMr
          : "-",
        createdDate: res.createdDate,
        isTransfer: res.isTransfer === false ? null : res.isTransfer,
        parentId: res.parentId,
        description: res.description,
        subject: res.subject,
        applicationDate: moment(res.applicationDate).format("DD-MM-YYYY"),
        slaDate: moment(res.slaDate).format("DD-MM-YYYY"),

        noOfDays: difference(res.slaDate),

        statusVal: res.status,
        status:
          res.status == 2
            ? "Send For Payment"
            : res.status == 3
            ? "In Progress"
            : res.status == 4
            ? "LOI Generated"
            : res.status == 5
            ? "Payment Received"
            : res.status == 6
            ? "Send to Applete Officer"
            : res.status == 7
            ? "Hearing Scheduled"
            : res.status == 8
            ? "Hearing Rescheduled"
            : res.status == 9
            ? "Decision Done"
            : res.status == 11
            ? "Complete"
            : res.status == 12
            ? "Close"
            : res.status == 14
            ? "Information Ready"
            : "",
        activeFlag: res.activeFlag,
      };
    });
    setDataSource([..._res]);
  };

  const difference = (date) => {
    // if (date != null) {
    // }
    var Difference_In_Time = new Date(date).getTime() - new Date().getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.round(Difference_In_Days);
  };

  // datatable columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "applicantName" : "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      flex: 1,
      minWidth: 280,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="rtiFileDate" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "areaName" : "areaNameMr",
      headerName: <FormattedLabel id="areaKey" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneKey" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="wardKey" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: <FormattedLabel id="departmentKey" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "slaDate",
      headerName: <FormattedLabel id="rtiDueDate" />,
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "noOfDays",
      headerName: <FormattedLabel id="totalNoOfDays" />,
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "left",
    },
    {
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.statusVal === 3 ? (
              <div style={{ color: params?.row?.noOfDays <= 5 ? "red" : "blue" }}>{params?.row?.status}</div>
            ) : params?.row?.statusVal === 2 ? (
              <div style={{ color: params?.row?.noOfDays <= 5 ? "red" : "orange" }}>
                {params?.row?.status}
              </div>
            ) : params?.row?.statusVal === 4 ||
              params?.row?.statusVal === 5 ||
              params?.row?.statusVal === 14 ? (
              <div style={{ color: params?.row?.noOfDays <= 5 ? "red" : "orange" }}>
                {params?.row?.status}
              </div>
            ) : params?.row?.statusVal === 11 ? (
              <div style={{ color: "green" }}>{params?.row?.status}</div>
            ) : (
              <div style={{ color: params?.row?.noOfDays <= 5 ? "red" : "black" }}>{params?.row?.status}</div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 220,
      sortable: false,
      headerAlign: "center",
      align: "left",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router1.push({
                  pathname: "/RTIOnlineSystem/transactions/rtiApplication/ViewRTIApplication",
                  query: { id: params.row.id },
                });
              }}
            >
              <Tooltip
                title={
                  language == "en"
                    ? `View Application against  ${params?.row?.applicationNo}`
                    : `${params?.row?.applicationNo} अर्ज पहा`
                }
              >
                <VisibilityIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>

            {authority &&
              authority?.find((val) => val === "RTI_ADHIKARI") &&
              params.row.statusVal === 3 &&
              !params.row.isTransfer &&
              !params.row.parentId && (
                <IconButton
                  onClick={() => {
                    sweetAlert({
                      title: language == "en" ? "Warning!" : "चेतावणी!",
                      text:
                        language == "en"
                          ? "Do you want to Transfer/Forward Application to another department?"
                          : "तुम्हाला अर्ज दुसऱ्या विभागात हस्तांतरित/फॉरवर्ड करायचा आहे का?",
                      dangerMode: false,
                      closeOnClickOutside: false,
                      buttons: [language == "en" ? "No" : "नाही", language == "en" ? "Yes" : "होय"],
                    }).then((will) => {
                      if (will) {
                        setIsForward(true);
                        setDependantDept(params.row.deptId);
                        getApplicationById(params.row.id);
                        selectedApplicationId(params?.row?.id);
                      } else {
                        if (
                          logedInUser === "departmentUser" &&
                          authority &&
                          authority.find((val) => val === "RTI_ADHIKARI")
                        ) {
                          getApplicationListByDept();
                        } else {
                          getApplicationDetails();
                        }
                      }
                    });
                  }}
                >
                  <ArrowForwardIosIcon style={{ color: "green" }} />
                </IconButton>
              )}

            {/* send for payment */}
            {(logedInUser == "citizenUser" ||
              (logedInUser === "departmentUser" &&
                authority &&
                authority?.find((val) => val !== "RTI_ADHIKARI"))) &&
              params.row.statusVal === 2 && (
                <IconButton
                  onClick={() => {
                    getApplicationById(params.row.id);
                    setIsOpenPayment(true);
                  }}
                >
                  <Tooltip title={language == "en" ? `Make Payment` : "पेमेंट करा"}>
                    <PaymentIcon style={{ color: "red" }} />
                  </Tooltip>
                </IconButton>
              )}

            {/* LOI RECEIPT */}
            {(logedInUser == "citizenUser" ||
              (logedInUser === "departmentUser" &&
                authority &&
                authority?.find((val) => val !== "RTI_ADHIKARI"))) &&
              params.row.statusVal === 4 && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: "/RTIOnlineSystem/transactions/acknowledgement/LoiGenerationRecipt",
                      query: { id: params.row.applicationNo },
                    });
                  }}
                >
                  <Tooltip title={language == "en" ? `View LOI Receipt` : "LOI पावती पहा"}>
                    <PaymentIcon style={{ color: "orange" }} />
                  </Tooltip>
                </IconButton>
              )}

            {(logedInUser == "citizenUser" ||
              (logedInUser === "departmentUser" &&
                authority &&
                authority?.find((val) => val !== "RTI_ADHIKARI"))) &&
              params.row.statusVal === 3 && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                      query: { id: params.row.applicationNo },
                    });
                  }}
                >
                  <Tooltip title={language == "en" ? `Download Acknowldgement` : "पावती डाउनलोड करा"}>
                    <DownloadIcon style={{ color: "blue" }} />
                  </Tooltip>
                </IconButton>
              )}

            {(logedInUser == "citizenUser" ||
              (logedInUser === "departmentUser" &&
                authority &&
                authority?.find((val) => val !== "RTI_ADHIKARI"))) &&
              params.row.statusVal === 11 && (
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{ margin: 2 }}
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => {
                      router.push({
                        pathname: "/RTIOnlineSystem/transactions/rtiAppeal",
                        query: { id: params.row.applicationNo },
                      });
                    }}
                  >
                    <FormattedLabel id="goToAppeal" />
                  </Button>
                </Grid>
              )}
          </>
        );
      },
    },
  ];

  // forward application
  const onForwardApplication = (formData) => {
    const body = {
      activeFlag: "Y",
      ...applicationDetails,
      departmentKey: formData.departmentKey,
      subDepartmentKey: formData.subDepartmentKey,
      forwardRemark: formData.remarks,
      isTransfer: true,
      forwardFlag: true,
    };
    const tempData = axios
      .post(`${urls.RTI}/trnRtiApplication/save`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          setIsForward(false);
          sweetAlert(
            language == "en" ? "Saved!" : "जतन केले!",
            language == "en"
              ? `RTI Application No ${
                  res.data.message.split("[")[1].split("]")[0]
                } is Transferred Succussfully!`
              : `आरटीआय अर्ज क्र  ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या हस्तांतरित केले आहे!`,
          );
          if (
            logedInUser === "departmentUser" &&
            authority &&
            authority.find((val) => val === "RTI_ADHIKARI")
          ) {
            getApplicationListByDept();
          } else {
            getApplicationDetails();
          }
        }
      });
  };

  // get application by id
  const getApplicationById = (applicationID) => {
    if (logedInUser === "citizenUser") {
      axios
        .get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationID}`, {
          headers: {
            UserId: user.id,
          },
        })
        .then((res, i) => {
          setApplicationDetails(res.data);
          setValue("rtiapplicationNo", res.data.applicationNo);
          setValue(
            "applicantName",
            res.data.applicantFirstName +
              " " +
              res.data.applicantMiddleName +
              " " +
              res.data.applicantLastName,
          );
          setValue("subject", res.data.description);
          setValue("currentdept", res.data.departmentKey),
            setValue("currentSubDept", res.data.subDepartmentKey);
        });
    } else {
      axios
        .get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationID}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res, i) => {
          setApplicationDetails(res.data);
          setValue("rtiapplicationNo", res.data.applicationNo);
          setValue(
            "applicantName",
            res.data.applicantFirstName +
              " " +
              res.data.applicantMiddleName +
              " " +
              res.data.applicantLastName,
          );
          setValue("subject", res.data.description);
          setValue(
            "currentdept",
            departments?.find((obj) => {
              return obj.id == res.data.departmentKey;
            })
              ? departments.find((obj) => {
                  return obj.id == res.data.departmentKey;
                }).department
              : "-",
          ),
            setValue(
              "currentSubDept",
              subDepartments?.find((obj) => {
                return obj.id == res.data.subDepartmentKey;
              })
                ? subDepartments.find((obj) => {
                    return obj.id == res.data.subDepartmentKey;
                  }).subDepartment
                : "-",
            );
        });
    }
  };

  const handleCancel3 = () => {
    setIsOpenPayment(false);
  };

  const changePaymentStatus = () => {
    const body = {
      activeFlag: "Y",
      ...applicationDetails,
    };
    if (logedInUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.RTI}/trnRtiApplication/save`, body, {
          headers: {
            UserId: user.id,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            getApplicationById();
            setIsOpenPayment(false);
            sweetAlert(
              language == "en" ? "Saved!" : "जतन केले!",
              language == "en" ? "Payment Done successful!" : "पेमेंट यशस्वी झाले!",
              "success",
            );
          } else {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी",
              language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
              "error",
            );
          }
        });
    } else {
      const tempData = axios
        .post(`${urls.RTI}/trnRtiApplication/save`, body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            getApplicationById();
            setIsOpenPayment(false);
            sweetAlert(
              language == "en" ? "Saved!" : "जतन केले!",
              language == "en" ? "Payment Done successfully !" : "पेमेंट यशस्वी झाले!",
              "success",
            );
          } else {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी",
              language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
              "error",
            );
          }
        });
    }
  };
  // ui
  return (
    <>
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
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="rtiApplicationList" />
          </h2>
        </Box>

        <Grid container style={{ padding: "10px" }}>
          {(logedInUser === "citizenUser" ||
            (logedInUser === "departmentUser" &&
              authority &&
              authority.find((val) => val !== "RTI_ADHIKARI"))) && (
            <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                onClick={() => {
                  router.push("/RTIOnlineSystem/transactions/rtiApplication/termsNdCondition");
                }}
              >
                <FormattedLabel id="add" />{" "}
              </Button>
            </Grid>
          )}
        </Grid>
        <DataGrid
          // components={{ Toolbar: GridToolbar }}
          // componentsProps={{
          //     toolbar: {
          //         showQuickFilter: true,
          //         quickFilterProps: { debounceMs: 500 },
          //     },
          // }}
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
          rowCount={totalElements}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 20, 50, 100]}
          rows={dataSource}
          columns={columns}
          page={pageNo}
          onPageChange={(_data) => {
            setDataPage(_data);
            if (
              logedInUser === "departmentUser" &&
              authority &&
              authority.find((val) => val === "RTI_ADHIKARI")
            ) {
              getApplicationListByDept(pageSize, _data);
            } else {
              getApplicationDetails(pageSize, _data);
            }
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            if (
              logedInUser === "departmentUser" &&
              authority &&
              authority.find((val) => val === "RTI_ADHIKARI")
            ) {
              getApplicationListByDept(_data, pageNo);
            } else {
              getApplicationDetails(_data, pageNo);
            }
          }}
        />
        <Modal
          title="Modal For Forward Application"
          open={isForwoardOpen}
          onClose={handleCancel}
          footer=""
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "90%",
              backgroundColor: "white",
              height: "78vh",
            }}
          >
            <Box style={{ height: "70vh" }}>
              <>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    background:
                      "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  }}
                >
                  <h2>
                    {" "}
                    <FormattedLabel id="forwardApplication" />
                  </h2>
                </Box>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onForwardApplication)}>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "justify-flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 240 }}
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          id="standard-textarea"
                          label={<FormattedLabel id="rtiApplicationNO" />}
                          multiline
                          variant="standard"
                          {...register("rtiapplicationNo")}
                          error={!!error.rtiapplicationNo}
                          helperText={error?.rtiapplicationNo ? error.rtiapplicationNo.message : null}
                        />
                      </Grid>

                      <Grid
                        item
                        xl={8}
                        lg={8}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          sx={{ width: 570 }}
                          id="standard-textarea"
                          label={<FormattedLabel id="applicantName" />}
                          multiline
                          variant="standard"
                          {...register("applicantName")}
                          error={!!error.applicantName}
                          helperText={error?.applicantName ? error.applicantName.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        <TextField
                          sx={{ width: 980 }}
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          id="standard-textarea"
                          label={<FormattedLabel id="subject" />}
                          multiline
                          variant="standard"
                          {...register("subject")}
                          error={!!error.subject}
                          helperText={error?.subject ? error.subject.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        <TextField
                          label={<FormattedLabel id="currentdept" />}
                          id="standard-textarea"
                          disabled={
                            authority &&
                            authority.find(
                              (val) =>
                                val == "RTI_APPEAL_ADHIKARI" &&
                                hearingDetails.status != 11 &&
                                hearingDetails.status != 9,
                            )
                              ? false
                              : true
                          }
                          InputLabelProps={{ shrink: true }}
                          sx={{ width: 230 }}
                          variant="standard"
                          {...register("currentdept")}
                          error={!!error.currentdept}
                          helperText={error?.currentdept ? error.currentdept.message : null}
                        />
                      </Grid>

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        <TextField
                          label={<FormattedLabel id="currentSubDept" />}
                          id="standard-textarea"
                          disabled={
                            authority &&
                            authority.find(
                              (val) =>
                                val == "RTI_APPEAL_ADHIKARI" &&
                                hearingDetails.status != 11 &&
                                hearingDetails.status != 9,
                            )
                              ? false
                              : true
                          }
                          InputLabelProps={{ shrink: true }}
                          sx={{ width: 230 }}
                          variant="standard"
                          {...register("currentSubDept")}
                          error={!!error.currentSubDept}
                          helperText={error?.currentSubDept ? error.currentSubDept.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={0}
                        sm={0}
                        xs={0}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      ></Grid>

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ width: 230, marginTop: "2%" }}
                          variant="standard"
                          error={!!error.departmentKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="forwardToDept" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                autoFocus
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value), setSubDepartments(value.target.value);
                                  getSubDepartmentDetails();
                                }}
                                label={<FormattedLabel id="forwardToDept" />}
                              >
                                {departments.filter((obj) => obj.id !== 2) &&
                                  departments.map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {language == "en" ? department.department : department.departmentNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="departmentKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.departmentKey ? error.departmentKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {subDepartments.length !== 0 && watch("departmentKey") && (
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            sx={{ width: 230, marginTop: "2%" }}
                            variant="standard"
                            error={!!error.subDepartmentKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="forwardTosubDept" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  fullWidth
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="subDepartmentKey" />}
                                >
                                  {subDepartments &&
                                    subDepartments?.map((subDepartment, index) => (
                                      <MenuItem key={index} value={subDepartment.id}>
                                        {language == "en"
                                          ? subDepartment.subDepartment
                                          : subDepartment.subDepartmentMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="subDepartmentKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {error?.subDepartmentKey ? error.subDepartmentKey.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      )}
                      <Grid
                        item
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        <TextField
                          label={<FormattedLabel id="remark" />}
                          id="standard-textarea"
                          sx={{ width: 990 }}
                          variant="standard"
                          {...register("remarks")}
                          error={!!error.remarks}
                          helperText={error?.remarks ? error.remarks.message : null}
                        />
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={6}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <Button
                            sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                          >
                            <FormattedLabel id="forwardApplication" />
                          </Button>
                        </Grid>

                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <Button
                            sx={{ marginRight: 8 }}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => handleCancel()}
                          >
                            <FormattedLabel id="closeModal" />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </FormProvider>
              </>
            </Box>
          </Box>
        </Modal>

        <Modal
          title="Modal For Payment"
          open={isOpenPayment}
          onOk={true}
          onClose={handleCancel3} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
          footer=""
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "90%",
              backgroundColor: "white",
              height: "40vh",
            }}
          >
            <Box style={{ height: "60vh" }}>
              <>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    spacing={3}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => changePaymentStatus()}
                    >
                      <FormattedLabel id="payment" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    spacing={3}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => handleCancel3()}
                    >
                      <FormattedLabel id="closeModal" />
                    </Button>
                  </Grid>
                </Grid>
              </>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </>
  );
};

export default Index;
