// import { yupResolver } from "@hookforpostm/resolvers/yup";
import { EyeFilled } from '@ant-design/icons'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
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
import { yupResolver } from '@hookform/resolvers/yup'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import { GridToolbar } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
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
    criteriaMode: 'all',
    // resolver: yupResolver(schema),
    mode: "onChange",

  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [id, setID] = useState();
  const [date, setDate] = useState();
  const [result, setResult] = useState([]);
  const [allTabelData, setAllTabelData] = useState([]);
  const [ward, setWard] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [rotationSubGroup, setRotationSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [parameterName, setParameterName] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [number, setNumber] = useState('');
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const { inputData, setInputData } = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);




  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  let approvalId = router?.query?.id;
  useEffect(() => {

    getDepartment();

    getNewsPaper();
    getAllBillData();
  });
  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department)
      // console.log("res.data", r.data);
    })
  };
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
    })
  }
  // Get Table - Data
  const getAllBillData = (_pageSize = 100, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";rressss", r);
        let result = r.data.trnNewspaperAgencyBillSubmissionList;
        console.log("@@@@@@", result.newsAdvertismentPublishedDate);
        // console.log("tableData", tableData)
        // console.log("billingDivisionAndUnit", billingDivisionAndUnit)

        // let _res = result.map((r, i) => {
        let _res = result.map((r, i) => {
          console.log("4e4", r);

          let str = r.newsAdvertismentPublishedDate?.split("T")
          console.log("jj", str)
          let val = str && str[0]
          console.log("hh", val)

          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            devisionKey: r.divisionKey,

            srNo: i + 1,

            id: r.id,

            newspaperName: r.newspaperName,
            billAmount: r.billAmount,
            newsAdvertismentPublishedDate: val,
            wardKey: r.wardKey,
            wardName: r.wardName,
            departmentKey: r.departmentKey,
            departmentName: r.departmentName,
            priority: r.priority,
            newsAdvertisementSubject: r.newsAdvertisementSubject,
            workName: r.workName,
            workCost: r.workCost,
            newsAdvertismentDescription: r.newsAdvertismentDescription,
            attachement: r.attachement,
            createDtTm: r.createDtTm,
            newsPublishedInSqMeter: r.newsPublishedInSqMeter,
            newsRotationNumber: r.newsRotationNumber,
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
  const onSubmitForm = (billData) => {
    console.log('fromData', billData)
    let _billData = { ...billData }

    // Save - DB
    let _body = {
      ...billData,
      activeFlag: billData.activeFlag,
    }
    if (btnSaveText === 'Save') {
      console.log('_body', _body)
      const tempData = axios
        .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body)
        .then((res) => {
          console.log('res---', res)
          if (res.status == 201) {
            sweetAlert('Saved!', 'Record Saved successfully !', 'success')
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setFetchData(tempData)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === 'Update') {
      console.log('_body', _body)
      const tempData = axios
        .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body)
        .then((res) => {
          console.log('res', res)
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                'Updated!',
                'Record Updated successfully !',
                'success',
              )
              : sweetAlert('Saved!', 'Record Saved successfully !', 'success')
              getAllBillData()
            // setButtonInputState(false);
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            setIsOpenCollapse(false)
          }
        })
    }
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log('body', body)
    if (_activeFlag === 'N') {
      swal({
        title: "Activate?",
        text: "Are you sure you want to Activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, body)
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 201) {
                swal('Record is Successfully Deleted!', {
                  icon: 'success',
                })
                getAllBillData()
                setButtonInputState(false)
                // setButtonInputState(false);
              }
            })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    } else {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, body)
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 201) {
                swal('Record is Successfully Deleted!', {
                  icon: 'success',
                })
                // getPaymentRate();
                getAllBillData()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    }
  }

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
  }

  const resetValuesCancell = {
    wardName: '',
    departmentName: '',
    priority: '',
    newsAdvertisementSubject: '',
    newsAdvertisementDescription: '',
    rotationGroupName: '',
    rotationSubGroupName: '',
    newsPaperLevel: '',
    typeOfNews: '',
    workName: '',
  }

  const resetValuesExit = {
    wardName: '',
    departmentName: '',
    priority: '',
    newsAdvertisementSubject: '',
    newsAdvertisementDescription: '',
    rotationGroupName: '',
    rotationSubGroupName: '',
    newsPaperLevel: '',
    typeOfNews: '',
    workName: '',
    id: null,
  }

  const columns = [
    {
      field: 'srNo',
      headerName: 'Sr No',
      align: 'center',
      headerAlign: 'center',
      width: 50,

    },

    {
      field: "newspaperName",
      headerName: "Newspaper Name",
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      minWidth: 150,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },


    {
      field: "billAmount",
      headerName: "Bill Amount",
      width: 80,

      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "newsAdvertismentPublishedDate",
      headerName: "News Advertisement Publish Date",
      // width: 250,
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      // minWidth: 100,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("432", params.row.activeFlag);
        return (
          <Box>


            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);

                // setButtonInputState(true);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>





            {/* <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  // setEntryConnectionId(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              )}
            </IconButton> */}




            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText('Update'),
                  // setEntryConnectionId(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true)
                // setButtonInputState(true);
                console.log('params.row: ', params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == 'Y' ? (
                <ToggleOffIcon
                  style={{ color: 'red', fontSize: 30 }}
                  onClick={() => deleteById(params.id, 'N')}
                />
              ) : (
                <ToggleOnIcon
                  style={{ color: 'green', fontSize: 30 }}
                  onClick={() => deleteById(params.id, 'Y')}
                />
              )}
            </IconButton>


            {/* {
              authority && authority[0] === "APPROVAL" ?
                        :

                <></>
            } */}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row

                router.push({
                  pathname: "/nrms/transaction/newsPaperAgencybill/approval/",
                  query: {
                    pageMode: 'View',
                    ...record,
                  },
                })
                console.log('row', params.row)
                  ; ('')
              }}
            >
              <EyeFilled style={{ color: '#556CD6' }} />
            </IconButton>

            {/* <IconButton
                            // onClick={() =>   handleSaveAndNext()}
                            onClick={() => {
                                handleSubmit(params.row.id)
                                const record = params.row;
                                console.log("record345", record);
                                router.push({
                                    pathname: `/nrms/transaction/AdvertisementRotation/ApproveNews/`,
                                    query: {
                                        pageMode: "Edit",
                                        id: params.row.id
                                        // ...record,
                                    },
                                });
                                console.log("row", params.row);
                                ("");
                            }}
                        >
                            <Button>Approve</Button>
                        </IconButton> */}

            {/* <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(false);
                // setButtonInputState(true);
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
            </IconButton> */}
          </Box>
        )
      },
    },
  ]

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: 'grey.500',
          marginLeft: '10px',
          marginRight: '10px',
          // marginTop: "10px",
          // marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px',
            background:
              'linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)',
          }}
        >
          <h2>

            Bill Submission

            {/* <FormattedLabel id="addHearing" /> */}
          </h2>
        </Box>
        <Divider />
        <Box
          sx={{
            marginLeft: 5,
            marginRight: 5,

            padding: 1,

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
                    <Grid container sx={{ padding: '10px' }}>
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="News Rotation Number"
                          // value={approvalId}
                          sx={{ width: 300 }}
                          multiline
                          variant="standard"

                          {...register("newsRotationNumber")}
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
                            Newspaper Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // required
                                // disabled={router?.query?.pageMode === "View"}
                                // sx={{ m: 1, minWidth: '50%' }}
                                sx={{ width: 300 }}
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
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
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
                                disabled={router?.query?.pageMode === 'View'}
                                sx={{ width: 300 }}
                                value={field.value} // value={departmentName}
                                {...register('departmentName')}
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
                          alignItems: "start",
                        }}
                      >
                        {/* {console.log("approvalId",approvalId)} */}
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="News Advertisement Description"
                          // value={approvalId}
                          {...register("newsAdvertismentDescription")}
                          sx={{ width: 300 }}
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
                          error={!!errors.newsAdvertismentPublishedDate}
                        >
                          <Controller
                            control={control}
                            name="newsAdvertismentPublishedDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Publish News Date
                                    </span>
                                  }
                                  value={field.value}
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
                            {errors?.newsAdvertismentPublishedDate ? errors.newsAdvertismentPublishedDate.message : null}
                          </FormHelperText>
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
                          alignItems: "start",
                        }}
                      >
                        {/* {console.log("approvalId",approvalId)} */}
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"

                          label="News Published in Sq.Meter"
                          // value={approvalId}
                          sx={{ width: 300 }}
                          multiline
                          variant="standard"
                          {...register("newsPublishedInSqMeter")}

                          error={!!errors.newsPublishedInSqMeter}
                          helperText={
                            errors?.newsPublishedInSqMeter ? errors.newsPublishedInSqMeter.message : null
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
                          alignItems: "start",
                        }}
                      >
                        {/* {console.log("approvalId",approvalId)} */}
                        <TextField
                          disabled={router?.query?.pageMode === 'View'}
                          id="standard-textarea"
                          label="Bill Amount"
                          // value={approvalId}
                          {...register("billAmount")}
                          sx={{ width: 300 }}
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







                      {/* To  date */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          sx={{ width: 300 }}
                          label="Bill Attachement"
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
                      </Grid>



                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '10px',
                          marginTop: '50px',
                        }}
                      >
                        {/* sdfgtjhdty */}
                        <Grid container ml={5} border px={5}>
                          {/* Save ad Draft */}

                          <Grid item xs={2}></Grid>

                          <Grid item>
                            <Button
                              // sx={{ marginRight: 8 }}
                              type="submit"
                              variant="contained"
                              color="primary"
                              endIcon={<SaveIcon />}
                            >
                              {btnSaveText === 'Update'
                                ? // <FormattedLabel id="update" />
                                'Update'
                                : // <FormattedLabel id="save" />
                                'Save'}
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
            display: 'flex',
            justifyContent: 'right',
            marginTop: 10,
            marginRight: 40,
            marginBottom: 10,
          }}
        >

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


        </div>
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
                getAllBillData(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllBillData(_data, data.page);
              }}
            />
          </Box>
        </div>
      </Paper>
    </>
  )
}

export default Index
