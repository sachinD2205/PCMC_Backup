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
import UploadButton from "../../../../components/fileUpload/UploadButton";
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
  const [id, setID] = useState();
  const [selectedObject, setSelectedObject] = useState()
  const [allTabelData, setAllTabelData] = useState([]);
  const [ward, setWard] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [rotationSubGroup, setRotationSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const { pressData, setPressData } = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [priority, setPriority] = useState();
  const [date, setDate] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [pressNote, setPressNote] = useState();
  const dispatch = useDispatch();
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
    getNewsPaper();
  }, []);
  const getNewsPaper = () => {
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      setNewsPaper(
        r?.data?.newspaperMasterList?.map((r, i) => ({
          id: r.id,
          newspaperName: r.newspaperName,
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
    // getWard();
    getAllTableData();
  }, []);;

  useEffect(() => {
    getAllPressData();

  }, [fetchData]);

  useEffect(() => {

    geyBillApproval();
  }, [selectedObject]);
  let approvalId = router?.query?.id;


  const getAllTableData = () => {
    const id = getValues("id");
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getAll`)
      .then((r) => {
        console.log(";rressss", r);
        let result = r.data.trnNewsPublishRequestList;
        console.log("getAllTableData", result);
        let _res = result.map((r, i) => {
          console.log("4e4dsfgh", r);

        })
        result && result.map((each) => {
          if (each.id == approvalId) {
            setSelectedObject(each)

          }
        })

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
            return data;
          });
        }
      }
      )
  }

  console.log("selectedobject", selectedObject?.departmentName)

  const geyBillApproval = () => {

    setDepartment(selectedObject?.departmentName ? selectedObject?.departmentName : "-");
    setWard(selectedObject?.wardName ? selectedObject?.wardName : "-");
    setPriority(selectedObject?.priority ? selectedObject?.priority : "-");
    setDate(selectedObject?.createDtTm ? selectedObject?.createDtTm
      : "-");
    setRotationGroup(selectedObject?.rotationGroupName ? selectedObject?.rotationGroupName : "-");
    // setSelectedDate(val)
    let str = date?.split("T")
    let val = str && str[0]
    setSelectedDate(val ? val : "-")
  }
  const getAllPressData = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnPressNoteRequestApproval/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";rressss", r);
        let result1 = r.data.trnPressNoteRequestApprovalList;
        console.log("@@@@@@", result1.trnPressNoteRequestApprovalList);
        // let _res = result.map((r, i) => {
        let _res = result1.map((r, i) => {
          console.log("4e4", result1);
          // fields
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            devisionKey: r.divisionKey,
            srNo: i + 1,
            id: r.id,
            newspaperName: r.newspaperName,
            wardKey: r.wardKey,
            wardName: r.wardName,
            pressNoteDescription: r.pressNoteDescription,
            departmentKey: r.departmentKey,
            priority: r.priority,
            newsAdvertismentDescription: r.newsAdvertismentDescription,
            rotationGroupName: r.rotationGroupName,
            newsPaperLevel: r.newsPaperLevel,
            pressAttachment: r.pressAttachment,
            createDtTm: r.createDtTm,
            status: r.status === null ? "" :
              r.status === 5 ? "Pending" :
                r.status === 7 ? "Press Note Release Order" :
                  r.status === 8 ? "Reject By Concern Department HOD" :
                    r.status === 9 ? "Approved By Concern Department HOD" :
                      r.status === 10 ? "Reject By  Department Clerk" :
                        r.status === 11 ? "Verify Press Note" :
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
        })
      })
  }

  const onSubmitForm = (formData) => {
    let temp = [];
    const fileObj = {
    }
    temp = [{ ...fileObj, pressAttachment: pressNote }]
    console.log("fromData", selectedObject);
    let _formData = { ...formData, ...selectedObject, };
    dispatch(setApprovalOfNews(_formData))
    // Save - DB
    let _body = {
      ..._formData,
      pressAttachment: temp[0].pressAttachment,
      activeFlag: formData.activeFlag,

    };
    let val1 = {
      ..._body,
      id: null,
      fromDate: null,
      toDate: null,
    }
    if (btnSaveText === "Save") {
      console.log("_body", val1);
      const tempData = axios
        .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, val1)
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
      console.log("update_body", _body);
      const tempData = axios
        .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, val1)
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            console.log("updated called")
            formData.id
              ? sweetAlert(
                "Updated!",
                "Record Updated successfully !",
                "success"
              )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getAllPressData();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        });
    }
  };

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
            .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getAllPressData();
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
            .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getPaymentRate();
                getAllPressData();
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
    newsAdSubject: "",
  };
  const resetValuesExit = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    newsAdSubject: "",
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
      headerName: "Press Note Number",
      width: 50,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wardName",
      headerName: "Ward Name",
      minWidth: 100,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "priority",
      headerName: "Priority",
      minWidth: 100,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "newsAdSubject",
      headerName: "Press Note Subject",
      // width: 250,
      minWidth: 50,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rotationGroupName",
      headerName: "Rotation Group Name",
      // width: 250,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      // width: 250,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "center",
      // minWidth: 100,
      eaderAlign: "center",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (

          <Box>

            {authority && authority[0] === "RTI_APPEAL_ADHIKARI" ? (
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
            {authority && authority[0] === "ENTRY" && params.row.status == "Verify Press Note" ? (
              <>
                {/* News Publish */}
                {/* <IconButton>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const record = params.row;
                      router.push({
                        pathname: "/nrms/transaction/releasingOrder/press",
                        query: {
                          pageMode: "View",
                          ...record,
                        },
                      });

                    }}
                  >
                    Press Note Publish
                  </Button>
                </IconButton> */}

                <IconButton>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const record = selectedObject;
                      router.push({
                        pathname:
                          '/nrms/transaction/paperCuttingBook/approval',
                        query: {
                          pageMode: "View",
                          id: params.row.id

                        },
                      })
                      { console.log("Ddfdg", selectedObject) }
                    }
                    }
                  >
                    Paper Cutting
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
                        pathname: "/nrms/transaction/pressNoteRelease/approval/",
                        query: {
                          pageMode: "View",
                          id: params.row.id,
                        },
                      });
                      console.log("row", selectedObject);
                      ("");
                    }}
                  >
                    <EyeFilled style={{ color: "#556CD6" }} />
                  </IconButton>
                </>
              )}
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

            Press Note Release Request

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
                          alignItems: "start",
                        }}
                      >
                        {/* {console.log("approvalId",approvalId)} */}
                        <TextField
                          // disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Press Note Number"
                          value={approvalId}
                          sx={{ m: 1, minWidth: '50%' }}
                          multiline
                          variant="standard"
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
                        <TextField
                          id="standard-textarea"
                          label="Ward Name"
                          sx={{ m: 1, minWidth: '50%' }}
                          variant="standard"
                          value={ward}
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
                          id="standard-textarea"
                          label="Department Name"
                          sx={{ m: 1, minWidth: '50%' }}
                          variant="standard"
                          value={department}
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
                          id="standard-textarea"
                          label="Priority"
                          sx={{ m: 1, minWidth: '50%' }}
                          variant="standard"
                          value={priority}
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
                          id="standard-textarea"
                          label="Release date"
                          sx={{ m: 1, minWidth: '50%' }}
                          variant="standard"
                          value={selectedDate}
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
                          id="standard-textarea"
                          label="Rotation Group"
                          sx={{ m: 1, minWidth: '50%' }}
                          variant="standard"
                          value={rotationGroup}
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
                            Newspaper Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                // disabled={router?.query?.pageMode === "View"}
                                // sx={{ m: 1, minWidth: '50%' }}
                                sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}
                                {...register("newspaperName")}
                              //   label={<FormattedLabel id="locationName" />}
                              >
                                {newsPaper &&
                                  newsPaper.map((newsPaper, index) => (
                                    <MenuItem
                                      key={index}
                                      value={newsPaper.newspaperName}
                                    >
                                      {newsPaper.newspaperName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="newspaperName"
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
                        <TextField
                          // required
                          // disabled={router?.query?.pageMode === "View"}
                          sx={{ width: 200 }}
                          id="standard-textarea"
                          label="Press Note Description"
                          multiline
                          variant="standard"
                          {...register("pressNoteDescription")}
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
                          // disabled={router?.query?.pageMode === "View"}
                          sx={{ width: 200 }}
                          id="standard-textarea"
                          label="Press Note Subject"
                          multiline
                          variant="standard"
                          {...register("newsAdSubject")}
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


                      {/* <Grid
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

                          // disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          sx={{ width: 200 }}
                          label="Attachement"
                          type="file"
                          variant="standard"
                          // {...register("attachement")}
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
                      </Grid> */}
                      <Grid container sx={{ padding: "10px" }}>

                        <Grid
                          item
                          xl={4}
                          lg={2}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          style={{
                            marginLeft: "60px",
                            marginTop: "30px"
                          }}
                        >
                          {console.log("ppp", pressNote)}{" "}
                          <Typography>
                            Attach News
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
                            appName="News Rotation"
                            serviceName="NewsPublishRequest"
                            filePath={setPressNote}
                            fileName={pressNote}
                          // sx={{ width: 200 }}
                          />{" "}
                        </Grid>
                      </Grid>
                      {/* to date in marathi */}
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
                        {/* sdfgtjhdty */}
                        <Grid container ml={5}
                          border px={5}
                        >
                          {/* Save ad Draft */}

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

                        {/* dsghfjhyfjfhjkfhy */}

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
                getAllPressData(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllPressData(_data, data.page);
              }}
            />
          </Box>
        </div>


      </Paper>
    </>
  );
};

export default Index;





