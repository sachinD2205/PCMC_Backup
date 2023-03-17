import React from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setApprovalOfNews } from "../../../../features/userSlice"
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import { EyeFilled } from "@ant-design/icons";
import styles from "./view.module.css";
import UploadButton from "../../../../components/fileUpload/UploadButton";



import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../features/labelSlice";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
const EntryForm = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();
  const [remark, setRemark] = useState("")

  const [moduleName, setModuleName] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const [buttonInputState, setButtonInputState] = useState();
  const [ward, setWard] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [rotationSubGroup, setRotationSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [parameterName, setParameterName] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [id, setID] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const dispatch = useDispatch();
  const [selectedObject, setSelectedObject] = useState();
  const [dataSource, setDataSource] = useState();
  const [priority, setPriority] = useState();
  const [subject, setSubject] = useState();
  const [work, setWork] = useState();
  const [description, setDescription] = useState();
  const [group, setGroup] = useState();
  const [subGroup, setSubGroup] = useState();
  const [isdisabled, setIsDisabled] = useState();
  const [paperLevel, setPaperLevel] = useState();
  const [newsType, setNewsType] = useState();
  const [hodRemark, setHodRemark] = useState();
  const [date, setDate] = useState();
  const [size, setSize] = useState();
  const [from, setFrom] = useState();
  const [selectedfromDate, setSelectedFromDate] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [image, setImage] = useState();
  const [releaseOrder, setReleaseOrder] = useState();
  const [to, setTo] = useState();
  const [selectedtodDate, setSelectedToDate] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const[ data,setData]=useState([]);

  useEffect(() => {
    getNewsPublishDetails();
    getAllTableData();

  });

  console.log(
    "///////",
    authority &&
    authority[0] == "DEPT_USER" &&
    (dataSource.status == 1 || dataSource.status == 2)
  );

  const validate = () => {
    return (
      // (authority &&
      //   authority[0] == "RTI_APPEAL_ADHIKARI" &&
      //   selectedObject?.status == 0) ||

      (authority &&
        authority[0] == "DEPT_USER" &&
        (selectedObject?.status == 0 || selectedObject?.status == 1 || selectedObject?.status == 2)) ||
      (authority &&
        authority[0] == "ENTRY" &&
        (selectedObject?.status == 1 || selectedObject?.status == 3 || selectedObject?.status == 4)) ||
      (authority &&
        authority[0] == "APPROVAL" &&
        (selectedObject?.status == 3 || selectedObject?.status == 5 || selectedObject?.status == 6))


    );
  };

  useEffect(() => {
    const isdisabled = validate();
    setIsDisabled(isdisabled);
  }, [
    selectedObject?.status == 0,
    selectedObject?.status == 1 || selectedObject?.status == 2,

    selectedObject?.status == 3 || selectedObject?.status == 4,
    selectedObject?.status == 5 || selectedObject?.status == 6,
    // dataSource.status == 9,
  ]);

  // dataSource.status == 2,
  // dataSource.status == 3 || dataSource.status == 4 || dataSource.status == 16,
  // dataSource.status == 5 || dataSource.status == 6,
  // dataSource.status == 7 || dataSource.status == 8,

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

  let approvalId = router?.query?.id;
  console.log("idddddddd", router?.query?.id)
  const getAllTableData = () => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getAll`, {
        params: {

        }
      })
      .then((r) => {
        console.log(";rressss", r);
        let result = r.data.trnNewsPublishRequestList;
        console.log("getAllTableData", result);
        result && result.map((each) => {
          if (each.id == approvalId) {
            setSelectedObject(each)
          }
        }

        )

      });
  };
  console.log("selectedobject", selectedObject)
  const getNewsPublishDetails = () => {
    setWard(selectedObject?.wardName ? selectedObject?.wardName : "-");
    setDepartment(selectedObject?.departmentName ? selectedObject?.departmentName : "-");
    setPriority(selectedObject?.priority ? selectedObject?.priority : "-");
    setSubject(selectedObject?.newsAdvertisementSubject ? selectedObject?.newsAdvertisementSubject : "-");
    setWork(selectedObject?.workName ? selectedObject?.workName : "-");
    setDescription(selectedObject?.newsAdvertisementDescription ? selectedObject?.newsAdvertisementDescription : "-");
    setGroup(selectedObject?.rotationGroupName ? selectedObject?.rotationGroupName : "-");
    setSubGroup(selectedObject?.rotationSubGroupName ? selectedObject?.rotationSubGroupName : "-");
    setPaperLevel(selectedObject?.newsPaperLevel ? selectedObject?.newsPaperLevel : "-");
    setNewsType(selectedObject?.typeOfNews ? selectedObject?.typeOfNews : "-");
    setDate(selectedObject?.toDate ? selectedObject?.toDate : "-");
    setFrom(selectedObject?.fromDate ? selectedObject?.fromDate : "-");
    setTo(selectedObject?.toDate ? selectedObject?.toDate : "-");
    setImage(selectedObject?.attachement ? selectedObject?.attachement : "-");
    setSize(selectedObject?.standardFormatSize ? selectedObject?.standardFormatSize : "-");

    let str = date?.split("T")
    let val = str && str[0]
    setSelectedDate(val ? val : "-");

    let str1 = to?.split("T")
    let val1 = str1 && str1[0]
    setSelectedToDate(val1 ? val1 : "-");

    let str2 = from?.split("T")
    let val2 = str2 && str2[0]
    setSelectedFromDate(val2 ? val2 : "-");
  }


  // // temp.push(aOneForm,proofOfOwnership,identyProof,castCertificate,statuatoryAndRegulatoryPermission,industrialRegistration,loadProfileSheet)
  // console.log("temp", temp);
  // console.log("form data --->", formData)
  // console.log("fromData", formData);
  // let _formData = { ...formData };
  // dispatch(setApprovalOfNews(_formData))
  // // Save - DB
  // let _body = {
  //   ...formData,
  //   attachement: temp[0].attachement,
  const onSubmitForm = (btnType) => {

    let temp = [];
    const fileObj = {
    }

    temp = [{ ...fileObj, attachement: releaseOrder }]
    // temp.push(aOneForm,proofOfOwnership,identyProof,castCertificate,statuatoryAndRegulatoryPermission,industrialRegistration,loadProfileSheet)
    console.log("temp", temp);
    // console.log("form data --->", formData)
    // console.log("fromData", formData);

    let formData = {
      ...selectedObject,

      remarks: remark,
      isReject: false,
      isApproved: true,
      attachement: temp[0].attachement,

    };


    //   dispatch(setApprovalOfNews(_formData))
    //   // Save - DB
    //   let _body = {
    //     ...formData,
    //     attachement: temp[0].attachement,
    //     activeFlag: formData.activeFlag,
    //   };
    //   let formData = {
    //     ...selectedObject,
    //     remarks: remark,
    //     isReject: false,
    //     isApproved: true,
    // };

    console.log("form data --->", formData)
    dispatch(setApprovalOfNews(formData))
    // Save - DB


    if (btnType === "Save") {
      formData = {
        ...selectedObject,
        isApproved: true,
        isComplete: false,
      }
      console.log("Save New COnnection ............ 71", formData)
      const tempData = axios
        .post(`${urls.NRMS}/trnNewsPublishRequest/save`, formData)
        .then((res) => {
          if (res.status == 201 &&   authority && authority[0] === "APPROVAL") {
            sweetAlert("Approved!", "Record Approved successfully !", "success");
            getAllTableData();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
         
            router.push('/nrms/transaction/AdvertisementRotation//')
          }
          else if (res.status == 201 &&   authority && authority[0] === "ENTRY") {
            sweetAlert("Release Order Generate!", "Record Approved successfully !", "success");
            getAllTableData();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
         
            router.push('/nrms/transaction/AdvertisementRotation//')
          }
        });
    }
    // Update Data Based On ID
    else if (btnType === "Reject") {
      let _body = {

        ...formData,
        isApproved: false,
      };
      const tempData = axios
        .post(`${urls.NRMS}/trnNewsPublishRequest/save`, formData)
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            sweetAlert("Reject!", "Record Rejected successfully !", "success");
            getAllTableData();
            // setButtonInputState(false);
            // setEditButtonInputState(false);
            // setDeleteButtonState(false);
            setIsOpenCollapse(false);
            // router.push('/nrms/transaction/AdvertisementRotation/newsPublishRequest')
            router.push({
              pathname: "/nrms/transaction/AdvertisementRotation/",

            });
          }

        });
    }

  };

  // View
  return (
    <>
      {/* <BasicLayout> */}
      {/* <Box display="inkenline-block"> */}
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            // marginTop: "10px",
            marginBottom: "60px",
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


              Approval OF News

              {/* <FormattedLabel id="addHearing" /> */}
            </h2>
          </Box>

          <Divider />

          <Box
            sx={{
              marginLeft: 5,
              marginRight: 5,
              // marginTop: 2,
              marginBottom: 5,
              padding: 1,
              // border:1,
              // borderColor:'grey.500'
            }}
          >
            <Box p={4}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit
                  (onSubmitForm)
                }>
                  {/* Firts Row */}

                  <Grid container sx={{ padding: "10px" }}>

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
                        label="Publish Request Number"
                        value={approvalId}
                        sx={{ m: 1, minWidth: '50%' }}
                        multiline
                        variant="outlined"

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
                        id="standard-textarea"
                        label="Ward"
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={ward}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>

                    {/* Department Name */}

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
                        variant="outlined"
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
                        label="News Releasing Date"
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={selectedDate}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>


                    {/*  */}

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
                        variant="outlined"
                        value={priority}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>



                    {/* Second Row */}

                    {/* News/Advertisement Subject */}

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
                        label="News/Advertisement Subject"
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={subject}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>


                    {/*  */}

                    {/* Work Name */}

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
                        label="Work Name"
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={work}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>



                    {/* News Advertisement Description */}

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
                        label="News/Advertisement Description"
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={description}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>


                    {/* Rotation Group */}

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
                        variant="outlined"
                        value={group}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>

                    {/* Rotation Sub Group  */}

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
                        label="Rotation Sub Group"
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={subGroup}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>

                    {/* News Paper Level */}

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
                        label="News Paper Level "
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={paperLevel}
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
                        label="Standard Format Size "
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={size}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>

                    {/* Standard Format size */}

                    {/* Types Of News */}

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
                        label="Type Of News"
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={newsType}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>

                    {/* fro date */}
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
                        label="Publish News From Date"
                        sx={{ m: 1, minWidth: '50%' }}
                        variant="outlined"
                        value={selectedfromDate}

                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />
                    </Grid>

                    {/* toDate */}

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
                        label="Publish News To Date"
                        sx={{ m: 1, minWidth: '10%%' }}
                        variant="outlined"
                        value={selectedtodDate}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                      />


                    </Grid>

                    {/* <Grid item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      className={styles.viewButton} > {console.log("rrrrr", selectedObject?.attachement)}

                      <a
                        href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.attachement}`}
                        target="__blank"
                      >
                         
                        <Button variant="contained">
                          View
                        </Button>
                      </a>
                      
                    </Grid> */}

                    {
                      authority && authority[0] === "RTI_APPEAL_ADHIKARI" ?
                        (<></>) :

                        (<>

                          <Grid item
                            xl={6}
                            lg={6}
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
                              label="Remarks"
                              sx={{
                                width: '400px',
                                 marginLeft:'65px'
                              }}
                              multiline
                              disabled={!isdisabled}
                              {...register("remark")}
                              variant="outlined"
                              helperText={
                                errors?.remarks ? errors.remarks.message : null
                              }
                            />
                          </Grid>
                        </>
                        )
                    }

                    {
                      authority && authority[0] === "DEPT_USER" || "ENTRY" ? (<>

                        <Grid container rowSpacing={2} columnSpacing={1} className={styles.attachmentContainer}>



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
                            }}>

                            <Grid item xl={10}
                              lg={10}
                              md={10}
                              sm={10}
                              xs={10}>

                              <InputLabel>View Attachement</InputLabel>

                            </Grid>
                            <Grid item xl={2}
                              lg={2}
                              md={2}
                              sm={2}
                              xs={2}
                              className={styles.viewButton}  >
                              <a
                                href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.newsAttachement}`}
                                target="__blank"
                              >
                                <Button variant="contained"
                                  sx={{
                                    margin: "30px",

                                    // display: "flex",
                                    // justifyContent: "center",
                                    // alignItems: "center"
                                  }}>
                                  View
                                </Button>
                              </a>
                            </Grid>

                            

                          </Grid>


                        </Grid>
                      </>
                      ) :
                        (<>   {
                          authority && authority[0] === "APPROVAL" ? (<>
                            <Grid container rowSpacing={2} columnSpacing={1} className={styles.attachmentContainer}>

                             

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
                                }}>

                                <Grid item xl={10}
                                  lg={10}
                                  md={10}
                                  sm={10}
                                  xs={10}>

                                  <InputLabel>View Attachement</InputLabel>

                                </Grid>
                                <Grid item xl={2}
                                  lg={2}
                                  md={2}
                                  sm={2}
                                  xs={2}
                                  className={styles.viewButton}  >
                                  <a
                                    href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.newsAttachement}`}
                                    target="__blank"
                                  >
                                    <Button variant="contained"
                                      sx={{
                                        margin: "30px",

                                        // display: "flex",
                                        // justifyContent: "center",
                                        // alignItems: "center"
                                      }}>
                                      View
                                    </Button>
                                  </a>
                                </Grid>

                              </Grid>


                            </Grid>

                          </>) :
                            (<></>)}




                        </>)


                    }





                    {/* 
                          
   {/* Button Row */}


                    <Grid container
                      spacing={5}

                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        marginTop: "60px",

                      }}>


                      {
                        authority && authority[0] === "ENTRY" ? (
                          <>

                            {/* <label>Generate News Releasing Order</label> */}
                            <Button
                              sx={{ marginRight: 8 }}
                              disabled={!isdisabled}
                              onClick={() => {
                                { onSubmitForm("Save") }
                                const record = selectedObject;
                                router.push({
                                  pathname: "/nrms/transaction/releasingOrder/news",
                                  query: {
                                    pageMode: "View",
                                    ...record,
                                  },
                                });

                              }}

                              variant="contained"
                              color="success"
                            >
                              {/* <FormattedLabel id="clear" /> */}
                              Releasing Order
                            </Button>


                          </>
                        )
                          : (

                            <>

                              {/* Save ad Draft */}
                              {
                                authority && authority[0] === "RTI_APPEAL_ADHIKARI" ?
                                  <></> :
                                  (<> <div >
                                    <Button
                                      sx={{ marginRight: 8 }}
                                      variant="contained"
                                      color="primary"
                                      // endIcon={<ClearIcon />}
                                      onClick={() => { onSubmitForm("Save") }}
                                      disabled={!isdisabled}



                                    >
                                      {/* <FormattedLabel id="clear" /> */}
                                      Approve
                                    </Button>
                                  </div>

                                    <Button
                                      sx={{ marginRight: 8 }}

                                      variant="contained"
                                      color="primary"

                                      onClick={() => { onSubmitForm("Reject") }}
                                      disabled={!isdisabled}
                                    >
                                      {/* <FormattedLabel id="clear" /> */}
                                      Reject
                                    </Button>
                                  </>
                                  )
                              }
                            </>
                          )}


                      {/* {
                        authority && authority[0] === "ENTRY" ? */}


                      <Button
                        sx={{ marginRight: 8 }}
                        width
                        variant="contained"
                        onClick={() =>
                          router.push(
                            `/nrms/transaction/AdvertisementRotation/`
                          )
                        }
                      >
                        Exit
                        {/* {<FormattedLabel id="cancel" />} */}
                      </Button>

                      {/* :

                          <></>
                      } */}
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
      {/* </Box> */}

      {/* </BasicLayout> */}
    </>

  );



};

export default EntryForm;
