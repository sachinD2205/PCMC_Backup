// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useDispatch } from "react-redux";
import moment from "moment"
import { EyeFilled } from "@ant-design/icons";
import CheckIcon from '@mui/icons-material/Check'
import UploadButton from "../../../../containers/reuseableComponents/UploadButton";


import {
  Box,
  Divider,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "./index.module.css";
// import styles from "../../../../../styles/ElectricBillingPayment_Styles/subDivision.module.css";

// import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/subDivisionSchema";
import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { setApprovalOfNews } from "../../../../features/userSlice";
import { Label } from "@mui/icons-material";
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",

  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();

  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);
  const [caseEntry, setCaseEntry] = useState([]);
  const [allTabelData, setAllTabelData] = useState([]);
  const [ward, setWard] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [rotationSubGroup, setRotationSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [parameterName, setParameterName] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [number, setNumber] = useState('');
  const [aOneForm, setAOneForm] = useState()
  const [newsRequest, setNewsRequest] = useState("")
  const [image, setImage] = useState()


  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const { inputData, setInputData } = useState();

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);


  const dispatch = useDispatch();



  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getWard();
    getDepartment();
    getRotationGroup();
    getRotationSubGroup();
    getNewsPaper();

  }, []);

  const user = useSelector((state) => state.user.user);

  console.log("user", user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);



  // get Module Name

  // get Ward Name
  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      setWard(res.data.ward);
      console.log("res.data", res.data);
    });
  };

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department

      );
      // console.log("res.data", r.data);
    });
  };





  const getRotationGroup = () => {
    console.log("sdafvdaa");
    axios.get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`).then((r) => {
      console.log("reefsff", r);
      setRotationGroup(
        r?.data?.newspaperRotationGroupMasterList?.map((r, i) => ({
          id: r.id,
          groupName: r.groupName,
          // groupId: r.groupId,
        }))
      );
      console.log("res.data", r.data);
    });
  };

  // New Changes

  const getRotationSubGroup = () => {
    axios
      .get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getAll`)
      .then((r) => {
        console.log("iddddd", id)
        setRotationSubGroup(
          r?.data?.newspaperRotationSubGroupMasterList?.map((r, i) => ({
            id: r.id,
            subGroupName: r.subGroupName,
            subGroupId: r.subGroupId,
          }))
        );
      });
  };
  console.log("dfb", rotationGroup.subGroupName)


  //   const getRotationGroup = () => {
  //     console.log("sdafvdaa");
  //     axios.get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`).then((r) => {
  //       console.log("reefsff", r);
  //       setRotationGroup(
  //         r?.data?.newspaperRotationGroupMasterList?.map((r, i) => ({
  //           id: r.id,
  //           groupName: r.groupName,
  //           groupId: r.groupId,
  //         }))
  //       );
  //       console.log("res.data", r.data);
  //     });
  //   };

  //   const getRotationSubGroup = (id) => {
  //     console.log("id",id)
  //     axios
  //       .get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getByGroupId?groupId=${id}`)
  //       .then((r) => {
  //         setRotationSubGroup(
  //           r?.data?.newspaperRotationSubGroupMasterList?.map((r, id) => ({
  //             id: r.id,
  //             subGroupName: r.subGroupName,
  //             subGroupId: r.subGroupId,
  //           }))
  //         );
  //       });
  //   };

  //   const getRotationSubGroupName = (field, event) => {
  //     console.log("event.target.value",event.target.value)
  //     field.onChange(event.target.value.name);
  //     // console.log("getValues('rotationGroupName')",getValues('rotationGroupName'))
  //     getRotationSubGroup(event.target.value.id)

  //   };

  const getNewsPaper = () => {
    // console.log("wafeg", groupId, subGroupId)
    // getByGroupSubGroupId?groupId=1&subGroupId=1
    // const subUrl = groupId && subGroupId ? `newspaperMaster/getByGroupSubGroupId?groupId=${groupId}&subGroupId=${subGroupId}` : `newspaperMaster/getAll`;
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      setNewsPaper(
        r?.data?.newspaperMasterList?.map((r, i) => ({
          id: r.id,
          newspaperLevel: r.newspaperLevel,
        }))
      );
    });
  };



  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  useEffect(() => {

    getAllTableData();

  }, [fetchData]);



  // useEffect(() => {
  //   console.log("dataSource=>", dataSource);
  // }, [dataSource]);

  // Get Table - Data
  const getAllTableData = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";rressss", r);
        let result = r.data.trnNewsPublishRequestList;
        console.log("@@@@@@", result);

        // if (!r.data && r.data.length == 0) {
        //   return;
        // }
        // //Samuha sanghatak
        // if (authority && authority?.find((val) => val === "RTI_APPEAL_ADHIKARI")) {
        //   tableData1 = r?.data?.trnNewsPublishRequestList.filter(
        //     (data, index) => {
        //       return data.status === 0;
        //     }
        //   );
        // }
        // //Department Clerk
        // if (
        //   authority &&
        //   authority?.find((val) => val === "DEPT_USER")
        // ) {
        //   tableData2 = r?.data?.trnNewsPublishRequestList.filter(
        //     (data, index) => {
        //       return data.status === 1 || 2;
        //     }
        //   );
        // }

        // //Asst Commissioner
        // if (authority && authority?.find((val) => val === "ENTRY")) {
        //   tableData3 = r?.data?.trnNewsPublishRequestList.filter(
        //     (data, index) => {
        //       return data.status === 3 || 4;
        //     }
        //   );
        // }

        // if (authority && authority?.find((val) => val === "APPROVAL")) {
        //   tableData3 = r?.data?.trnNewsPublishRequestList.filter(
        //     (data, index) => {
        //       return data.status === 5 || 6;
        //     }
        //   );
        // }


        if (authority?.find((val) => val === "RTI_APPEAL_ADHIKARI")) {
          tableData1 = result?.filter((data, index) => {
            console.log("1234", data.status);
            return data;
          });
        }

        if (authority?.find((val) => val === "DEPT_USER")) {

          tableData2 = result?.filter((data, index) => {
            console.log("1234", data.status);
            return data;
          });
        }

        if (authority?.find((val) => val === "ENTRY")) {
          tableData3 = result?.filter((data, index) => {
            return data;
          });
        }

        if (authority?.find((val) => val === "APPROVAL")) {
          tableData4 = result?.filter((data, index) => {
            return data.status === 7;
          });
        }

        console.log("returned");

        tableData = [
          ...tableData1,
          ...tableData2,
          ...tableData3,
          ...tableData4,
        ];

        console.log("resultTTTTTTTT", result)
        // console.log("billingDivisionAndUnit", billingDivisionAndUnit)

        // let _res = result.map((r, i) => {
        let _res = result.map((r, i) => {

          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            srNo: i + 1,
            id: r.id,
            newsRotationRequestNumber: r.newsRotationRequestNumber,
            wardKey: r.wardKey,
            wardName: r.wardName,
            departmentKey: r.departmentKey,
            departmentName: r.departmentName,
            priority: r.priority,
            newsAdvertisementSubject: r.newsAdvertisementSubject,
            workName: r.workName,
            workCost: r.workCost,
            newsAdvertisementDescription: r.newsAdvertisementDescription,
            rotationGroupkey: r.rotationGroupkey,
            rotationGroupName: r.rotationGroupName,
            rotationSubGroupkey: r.rotationSubGroupkey,
            rotationSubGroupName: r.rotationSubGroupName,
            newsPaperLevel: r.newsPaperLevel,
            typeOfNews: r.typeOfNews,
            typeOfNewsId: r.typeOfNewsId,
            createDtTm: r.createDtTm,
            fromDate: r.fromDate,
            newsAttachement: r.newsAttachement,
            toDate: r.Date,
            // status: r.activeFlag === "Y" ? "Active" : "Inactive",
            status: r.status === null ? "Pending" :
              r.status === 0 ? "Save As Draft" :
                r.status === 1 ? "Approved By Concern Department HOD" :
                  r.status === 2 ? "Reject By Concern Department HOD" :
                    r.status === 3 ? "Releasing Order Generate" :
                      r.status === 4 ? "Reject By  Department Clerk" :
                        r.status === 5 ? "Approved By Department HOD" :
                          r.status === 6 ? "Rejected By Department HOD" :
                            r.status === 7 ? "Waiting for Accountant Approval" :
                              r.status === 8 ? "Completed" :
                                r.status === 9 ? "Closed" :
                                  r.status === 10 ? "Duplicate" : "Invalid",


          };
        });
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

  const onSubmitForm = (formData) => {
    let temp = [];
    const fileObj = {
    }

    temp = [{ ...fileObj, newsAttachement: newsRequest }]
    // temp.push(aOneForm,proofOfOwnership,identyProof,castCertificate,statuatoryAndRegulatoryPermission,industrialRegistration,loadProfileSheet)
    console.log("temp", temp);
    console.log("form data --->", formData)
    console.log("fromData", formData);
    let _formData = { ...formData };
    dispatch(setApprovalOfNews(_formData))
    // Save - DB
    let _body = {
      ...formData,
      newsAttachement: temp[0].newsAttachement,
      activeFlag: formData.activeFlag,
    };
    if (btnSaveText === "Save") {
      console.log("_body", _body);
      const tempData = axios
        .post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body)
        .then((res) => {
          console.log("res---", res);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });

    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("_body", _body);
      const tempData = axios
        .post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body)
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                "Updated!",
                "Record Updated successfully !",
                "success"
              )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getAllTableData();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        });
    }
  };
  // console.log("data.status === 6",data.status ==5)


  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewsPublishRequest/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAllTableData();
                setButtonInputState(false)
                // setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewsPublishRequest/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getPaymentRate();
                getAllTableData();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };
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
  };

  const resetValuesCancell = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",

  };

  const resetValuesExit = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    id: null,
  };
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      align: "center",
      headerAlign: "center",
      width: 50,
    },
    {
      field: "id",

      headerName: "News Rotation Request Number",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wardName",
      headerName: "Ward Name",
      minWidth: 50,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      minWidth: 10,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "priority",
      headerName: "Priority",
      minWidth: 10,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 50,
      // minWidth: 100,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "center",
      headerAlign: "center",
      // minWidth: 100,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>



            {authority && authority[0] === "RTI_APPEAL_ADHIKARI" && params.row.status == "Approved By Department HOD" ? (
              <>
                <IconButton>
                  <Button
                    variant="contained"
                    // endIcon={<CheckIcon />}
                    // style={{
                    //   height: '30px',
                    //   width: '250px',
                    // }}

                    onClick={() => {
                      const record = params.row;
                      router.push({
                        pathname:
                          '/nrms/transaction/pressNoteRelease',
                        query: {
                          pageMode: "View",
                          ...record,

                        },
                      })
                    }
                    }
                  >
                    Request For Press Note

                  </Button>
                </IconButton>

                {/* News Publish */}

              </>
            ) :
              (<> {authority && authority[0] === "RTI_APPEAL_ADHIKARI" ? (
                <>
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      setBtnSaveText("Update"),
                        setID(params.row.id),
                        setIsOpenCollapse(true),
                        setSlideChecked(true);

                      console.log("params.row: ", params.row);
                      reset(params.row);
                    }}
                  >
                    <EditIcon style={{ color: "#556CD6" }} />
                  </IconButton>

                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      setBtnSaveText("Update"),
                        setID(params.row.id),
                        setSlideChecked(true);

                      console.log("params.row: ", params.row);
                      reset(params.row);
                    }}
                  >
                    {params.row.activeFlag == "Y" ? (
                      <ToggleOnIcon
                        style={{ color: "green", fontSize: 30 }}
                        onClick={() => deleteById(params.id, "N")}
                      />
                    ) : (
                      <ToggleOffIcon
                        style={{ color: "red", fontSize: 30 }}
                        onClick={() => deleteById(params.id, "Y")}
                      />
                    )}
                  </IconButton>
                </>
              ) : (

                <></>
              )}

                {authority && authority[0] === "ENTRY" && params.row.status == "Approved By Department HOD" ? (
                  <>


                    {/* News Publish */}
                    <IconButton>
                      <Button
                        variant="contained"
                        onClick={() => {
                          const record = params.row;
                          router.push({
                            pathname: "/nrms/transaction/releasingOrder/news",
                            query: {
                              pageMode: "View",
                              ...record,
                            },
                          });

                        }}
                      >
                        News Publish

                      </Button>
                    </IconButton>
                  </>
                ) :
                  (
                    <>
                      <IconButton
                        disabled={editButtonInputState}
                        onClick={() => {
                          const record = params.row;

                          router.push({
                            pathname: "/nrms/transaction/AdvertisementRotation/view/",
                            query: {
                              pageMode: "View",
                              id:params?.row?.id
                            },
                          });
                          console.log("row", params.row);
                          ("");
                        }}
                      >
                        <EyeFilled style={{ color: "#556CD6" }} />
                      </IconButton>
                    </>
                  )}
              </>
              )}




            {/* 
             {data.status === 6 &&
                authority?.find(
                  authority[0] === "RTI_APPEAL_ADHIKARI",
                ) && (
                  <>  */}
            {console.log("ROWWWWWWWWW", params.row)}

            {/* </>
                )}  */}
          </Box>
        );
      },

    },
  ];

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
          // marginTop: "10px",
          // marginBottom: "60px",
          padding: 1,
        }}
      >
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
            News Publish Request
            {/* <FormattedLabel id="addHearing" /> */}
          </h2>
        </Box>
        <Divider />
        <Box
          sx={{
            marginLeft: 5,
            marginRight: 5,
            // marginTop: 2,
            // marginBottom: 5,
            padding: 1,
            // border:1,
            // borderColor:'grey.500'
          }}
        >
          <Box>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid container sx={{ padding: "10px" }}>
                      {/* Date Picker */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}

                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                        // sx={{ m: 1, minWidth: 120 }}
                        // error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {/* {<FormattedLabel id="NewsWardName" />} */}
                            Ward
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}
                                // required
                                {...register("wardName")}
                              //   label={<FormattedLabel id="ward" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                              >
                                {ward &&
                                  ward.map((wa, index) => (
                                    <MenuItem key={index} value={wa.wardName}>
                                      {wa.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="wardName"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      {/* from date in marathi */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          // size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {/* {<FormattedLabel id="de     partment" />} */}
                            Department Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}                              // value={departmentName}
                                {...register("departmentName")}
                              //   label={<FormattedLabel id="department" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                              >

                                {department &&
                                  department.map((department, index) => (
                                    <MenuItem
                                      key={index}
                                      value={department.department}
                                    >
                                      {department.department}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="departmentName"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {/* {<FormattedLabel id="locationName" />} */}
                            Priority
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("priority")}
                              //   label={<FormattedLabel id="Priority" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                              >
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="low">Low</MenuItem>
                              </Select>
                            )}
                            name="priority"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                        </FormControl>
                      </Grid>
                      {/* to date in marathi */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          // required
                          disabled={router?.query?.pageMode === "View"}
                          sx={{ width: 300 }}
                          id="standard-textarea"
                          value={inputData}
                          label="News/Advertisement Subject"
                          multiline
                          variant="standard"
                          {...register("newsAdvertisementSubject")}
                          error={!!errors.label2}
                          helperText={
                            errors?.label2 ? errors.label2.message : null
                          }
                        // InputLabelProps={{
                        //     //true
                        //     shrink:
                        //         (watch("label2") ? true : false) ||
                        //         (router.query.label2 ? true : false),
                        // }}
                        />
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          // required
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          sx={{ width: 300 }}
                          label="Work Name"
                          multiline
                          variant="standard"
                          {...register("workName")}
                          error={!!errors.label2}
                          helperText={
                            errors?.label2 ? errors.label2.message : null
                          }
                        // InputLabelProps={{
                        //     //true
                        //     shrink:
                        //         (watch("label2") ? true : false) ||
                        //         (router.query.label2 ? true : false),
                        // }}
                        />
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          // required
                          disabled={router?.query?.pageMode === "View"}
                          sx={{ width: 300 }}
                          id="standard-textarea"
                          label="News/Advertisement Description"
                          multiline
                          variant="standard"
                          {...register("newsAdvertisementDescription")}
                          error={!!errors.label2}
                          helperText={
                            errors?.label2 ? errors.label2.message : null
                          }
                        // InputLabelProps={{
                        //     //true
                        //     shrink:
                        //         (watch("label2") ? true : false) ||
                        //         (router.query.label2 ? true : false),
                        // }}
                        />
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {/* {<FormattedLabel id="locationName" />} */}
                            Rotation Group
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}
                                onChange={(value) => {
                                  field.onChange(value)
                                  getRotationSubGroup(field, value)
                                }
                                }
                              //   label={<FormattedLabel id="locationName" />}
                              >
                                {rotationGroup &&
                                  rotationGroup.map((rotationGroup, index) => (
                                    <MenuItem
                                      key={index}
                                      value={rotationGroup.groupName}
                                    >
                                      {rotationGroup.groupName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="rotationGroupName"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {/* {<FormattedLabel id="locationName" />} */}
                            Rotation Sub Group
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}


                                {...register("rotationSubGroupName")}
                              //   label={<FormattedLabel id="locationName" />}
                              >
                                {rotationSubGroup &&
                                  rotationSubGroup?.map((subGroupName, index) =>
                                    <MenuItem
                                      key={index}
                                      value={subGroupName.subGroupName}
                                    >
                                      {subGroupName.subGroupName}
                                    </MenuItem>

                                  )}
                              </Select>
                            )}
                            name="rotationSubGroupName"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {/* {<FormattedLabel id="locationName" />} */}
                            News Paper Level
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("newsPaperLevel")}

                              >
                                {newsPaper &&
                                  newsPaper.map((newspaperLevel, index) => (
                                    <MenuItem
                                      key={index}
                                      value={newspaperLevel.newspaperLevel}
                                    >
                                      {newspaperLevel.newspaperLevel}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="newsPaperLevel"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {/* {<FormattedLabel id="locationName" />} */}
                            Standard Format Size
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}
                                {...register("standardFormatSize")}
                              //   label={<FormattedLabel id="locationName" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                              >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                              </Select>
                            )}
                            name="standardFormatSize"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {/* {<FormattedLabel id="locationName" />} */}
                            Types Of News
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}
                                {...register("typeOfNews")}
                              //   label={<FormattedLabel id="locationName" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                              >
                                <MenuItem value="crime">Crime</MenuItem>
                              </Select>
                            )}
                            name="typeOfNews"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <FormControl
                          variant="standard"
                          style={{ marginTop: 10 }}
                          error={!!errors.fromDate}
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Publish News From Date
                                    </span>
                                  }
                                  value={field.value}
                                  minDate={new Date()}
                                  onChange={(date) =>
                                    field.onChange(moment(date).format("YYYY-MM-DD"))
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      variant="standard"
                                      sx={{ width: 300 }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* To  date */}
                      <Grid item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <FormControl
                          variant="standard"
                          style={{ marginTop: 10 }}
                          error={!!errors.Date}
                        >
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Publish News To Date
                                    </span>
                                  }
                                  value={field.value}
                                  minDate={new Date()}
                                  onChange={(date) =>
                                    field.onChange(moment(date).format("YYYY-MM-DD"))
                                  }
                                  // selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      variant="standard"
                                      sx={{ width: 300 }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.toDate ? errors.toDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Attachement */}
                      <Grid container sx={{ padding: "10px" }}>

                        <Grid
                          item
                          xl={4}
                          lg={2}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          style={{ margin: "25px" }}
                        >
                          {console.log("ppp", newsRequest)}{" "}
                          <Typography  >
                            <b>  Attach News</b>
                          </Typography>

                          {/* {console.log("Doc", docCertificate)} */}
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={2}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          style={{ margin: "20px" }}
                        >
                          <UploadButton
                            // appName="News Rotation"
                            // serviceName="NewsPublishRequest"
                            appName="TP"
                            serviceName="PARTMAP"
                         
                            fileUpdater={setNewsRequest}
                            filePath={newsRequest}
                          
                          />
                        </Grid>
                      </Grid>
                      {/* Buttons */}
                      <Grid
                        container
                        spacing={5}

                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          marginTop: "50px",
                        }}

                      >
                        <Grid container ml={5}
                          border px={5}
                        >
                          <Grid item xs={2}>
                          </Grid>
                          <Grid item>
                            <Button
                              // sx={{ marginRight: 8 }}
                              type="submit"
                              variant="contained"
                              color="primary"
                              endIcon={<SaveIcon />}
                            >
                              {btnSaveText === "Update"
                                ? // <FormattedLabel id="update" />
                                "Update"
                                : // <FormattedLabel id="save" />
                                "Save"}
                            </Button>
                          </Grid>
                          <Grid item xs={2}></Grid>

                          <Grid item>
                            <Button
                              // sx={{ marginRight: 8 }}
                              variant="contained"
                              color="primary"
                              endIcon={<ClearIcon />}
                              onClick={() => cancellButton()}
                            >
                              {/* <FormattedLabel id="clear" /> */}
                              Clear
                            </Button>
                          </Grid>
                          <Grid item xs={2}></Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              endIcon={<ExitToAppIcon />}
                              onClick={() => exitButton()}
                            >
                              {/* <FormattedLabel id="exit" /> */}
                              Exit
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>
          </Box>
        </Box>
        <div
          // className={styles.addbtn}
          style={{
            display: "flex",
            justifyContent: "right",
            // marginTop: 10,
            marginRight: 40,
            marginBottom: 10,
          }}
        >
          {
            authority && authority[0] === "RTI_APPEAL_ADHIKARI" ?
              <div >
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  // type='primary'
                  disabled={buttonInputState}
                  onClick={() => {
                    reset({
                      ...resetValuesExit,
                    });
                    setEditButtonInputState(true);
                    setDeleteButtonState(true);
                    setBtnSaveText("Save");
                    setButtonInputState(true);
                    setSlideChecked(true);
                    setIsOpenCollapse(!isOpenCollapse);
                  }}
                >
                  Add
                  {/* <FormattedLabel id="add" /> */}
                </Button>
              </div>

              :
              <></>
          }
        </div>










        {/* <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              // type='primary'
              disabled={buttonInputState}
              onClick={() => {
                handleSaveAndNext();

                setEditButtonInputState(true);
                setDeleteButtonState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
              Next
            </Button>
          </div> */}

        <div>
          {/* </Paper> */}

          {/* New Table */}
          <Box
            sx={{
              height: 500,
              // width: 1000,
              // marginLeft: 10,

              // width: '100%',

              overflowX: 'auto',
            }}
          >
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
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

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
              // rows={dataSource}
              // columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection

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
                getAllTableData(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllTableData(_data, data.page);
              }}
            />
          </Box>
        </div>


      </Paper>
    </>
  );
};

export default Index;