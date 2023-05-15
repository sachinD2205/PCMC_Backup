import { Button, Grid, Paper, IconButton, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import VisibilityIcon from '@mui/icons-material/Visibility';
import sweetAlert from "sweetalert";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import FileTable from "../../../../../components/SlumBillingManagementSystem/FileUpload/FileTable";

const index = () => {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    getValues,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const [siteImages, setSiteImages] = useState();
  const [dataSource, setDataSource] = useState({});
  const [hutData, setHutData] = useState({});
  const [btnSaveText, setBtnSaveText] = useState("Save")

  // multiple files attach
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(true);
  const [payloadImages, setPayloadImages] = useState({});

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(()=>{
    finalFiles && finalFiles.map((each, i)=>{
      if(i<5){
        setPayloadImages({...payloadImages,[`siteImage${i+1}`] : each?.filePath})
      }
    })
  },[finalFiles])

  console.log("payloadImages", payloadImages)
  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  useEffect(() => {
    if(router.query.id){
      getHutTransferDataById(router.query.id);
    }
  }, [router.query.id]);

  useEffect(() => {
    getHutData();
  }, [dataSource]);

  const getHutData = () => {
    axios.get(`${urls.SLUMURL}/mstHut/getAll`).then((r) => {
      let result = r.data.mstHutList;
      let res = result && result.find((obj) => obj.id == dataSource?.hutKey);
      setHutData(res);
    });
  };

  const getHutTransferDataById = (id) => {
    if (loggedInUser === "citizenUser") {
        axios
        .get(`${urls.SLUMURL}/trnTransferHut/getById?id=${id}`, {
          headers: {
            UserId: user.id
          },
        })
        .then((r) => {
          let result = r.data;
            console.log("getHutTransferDataById", result);
          setDataSource(result);
        });
      } else {
        axios
        .get(`${urls.SLUMURL}/trnTransferHut/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          let result = r.data;
            console.log("getHutTransferDataById", result);
          setDataSource(result);
        });
      }
  
  };

    // handle search connections
    const handleSearchHut = () => {
      handleOpenEntryConnections();
      setHutDataLoader(true);
      console.log("hutNo", hutNo);
      axios
        .get(`${urls.SLUMURL}/mstHut/search/hutNo?hutNo=${watch("hutNo")}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          let result = r.data.mstHutList;
          setHutDataLoader(false);
          console.log("handleSearchHut", slumDropDown);
  
          let _res = result.map((r, i) => {
            console.log("r", r);
            return {
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1,
              hutNo: r.hutNo,
              slum: slumDropDown && slumDropDown.find((obj) => obj.id == r.slumKey)?.slumEn,
              slumMr: slumDropDown && slumDropDown.find((obj) => obj.id == r.slumKey)?.slumMr,
            };
          });
  
          setSearchedConnections({
            rows: _res,
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
        });
    };

  console.log("dataSource", dataSource)

  const handleOnSubmit = (formData) => {
    let siteVisitObj = dataSource?.trnVisitScheduleList[dataSource?.trnVisitScheduleList?.length - 1]
    console.log("siteVisitObj", siteVisitObj)
    console.log("formData", formData)
    console.log("hutData", hutData)

    let _body = {
            ...formData,
            ...payloadImages,
            referenceKey: router.query.id,
            "scheduledDate": siteVisitObj?.scheduledDate,
            "scheduledTime": siteVisitObj?.scheduledDate,
            "rescheduleDate": null,
            "rescheduleTime": null,
            "scheduleTokenNo": "123456",
            "slumKey": dataSource.slumKey,
            "hutNo": dataSource.hutNo,
            "length": hutData?.length,
            "id": siteVisitObj?.id,
            "trnType": siteVisitObj?.trnType,
            "breadth":  hutData?.breadth,
            "height": hutData?.height,
            "constructionTypeKey": hutData?.constructionTypeKey,
            "usageTypeKey": hutData?.usageTypeKey,
            "area": hutData?.areaKey,
            "employeeKey": "2",
            "inspectionReportDocumentPath": "terst",
            visitDate: formData.visitTime,
            visitTimeText: formData.visitTime,
            "status": dataSource?.status,
            "isDraft": "",
            "isComplete":true,
            "activeFlag":  dataSource?.activeFlag
    };
    console.log("formData", _body);

        const tempData = axios
        .post(`${urls.SLUMURL}/trnVisitSchedule/transferHut/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", `Site visit against ${dataSource.applicationNo} Completed successfully !`, "success");
            router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
          }
        });
  };

  // file attache column
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      // File: "originalFileName",
      width: 200,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      // flex: 1,
      width: 120,
    },
    language == "en"
      ? {
          headerName: "Uploaded By",
          field: "attachedNameEn",
          // flex: 2,
          width: 100,
        }
      : {
          headerName: "द्वारे अपलोड केले",
          field: "attachedNameMr",
          // flex: 2,
          width: 100,
        },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      // width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`, "_blank");
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "100px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="transferHutSiteDetails" />
          </h2>
        </Box>

        <Grid container sx={{ padding: "10px" }}>

           {/* Visit Date & Time */}
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
              marginBottom: "10px",
            }}
          >
            <Controller
              control={control}
              name="visitTime"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        size="small"
                        fullWidth
                        sx={{ width: "75%" }}
                        error={errors.visitTime}
                        helperText={errors?.visitTime ? errors.visitTime.message : null}
                      />
                    )}
                    label={<FormattedLabel id="visitDateTime" />}
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                    defaultValue={null}
                    inputFormat="DD-MM-YYYY hh:mm:ss"
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          {/* Lattitude */}
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="lattitude" />}
              // label={labels["lattitude"]}
              // @ts-ignore
              variant="standard"
              {...register("lattitude")}
              InputLabelProps={{
                shrink: router.query.id || watch("lattitude") ? true : false,
              }}
              error={!!errors.lattitude}
              helperText={errors?.lattitude ? errors.lattitude.message : null}
            />
          </Grid>

          {/* Longitude */}
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="longitude" />}
              // label={labels["longitude"]}
              // @ts-ignore
              variant="standard"
              {...register("longitude")}
              InputLabelProps={{
                shrink: router.query.id || watch("longitude") ? true : false,
              }}
              error={!!errors.longitude}
              helperText={errors?.longitude ? errors.longitude.message : null}
            />
          </Grid>

          {/* geoCode */}
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="geocode" />}
              // label={labels["geocode"]}
              // @ts-ignore
              variant="standard"
              {...register("geocode")}
              InputLabelProps={{
                shrink: router.query.id || watch("geocode") ? true : false,
              }}
              error={!!errors.geocode}
              helperText={errors?.geocode ? errors.geocode.message : null}
            />
          </Grid>

        </Grid>

        <Box
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="attachImages" />
          </h2>
        </Box>

        <Grid container sx={{padding: "10px"}}>
         {/* Attachement */}
         <Grid item  xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}>
            <FileTable
              appName="SLUM" //Module Name
              serviceName="SLUM-IssuancePhotopass" //Transaction Name
              fileName={attachedFile} //State to attach file
              filePath={setAttachedFile} // File state upadtion function
              newFilesFn={setAdditionalFiles} // File data function
              columns={_columns} //columns for the table
              rows={finalFiles} //state to be displayed in table
              uploading={setUploading}
              getValues={getValues}
              pageMode={router.query.pageMode}
              authorizedToUpload={authorizedToUpload}
              // showNoticeAttachment={router.query.showNoticeAttachment}
            />
          </Grid>
        </Grid>

        <Box
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="generateReports" />
          </h2>
        </Box>

        <Grid container sx={{ padding: "10px" }}>

          {/* Generate Inspection Report */}
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
              marginTop: "10px",
            }}
          >
            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}></Grid>
            <Grid item xl={9} lg={9} md={9} sm={9} xs={12}>
              <label>
                <b><FormattedLabel id="generateInspectionReport" /></b>
              </label>
            </Grid>

            <Grid item xl={2} lg={2} md={2} sm={2} xs={12}>
              <Button color="primary" variant="contained"><FormattedLabel id="generate" /></Button>
            </Grid>
          </Grid>

          <Grid container mt={5}>
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
                  }}
                >
                  {" "}
              
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ m: 1, minWidth: "81%" }}
              label={<FormattedLabel id="remarks" />}
              // label={labels["remarks"]}
              // @ts-ignore
              variant="outlined"
              {...register("remarks")}
              InputLabelProps={{
                shrink: router.query.id || watch("remarks") ? true : false,
              }}
              error={!!errors.remarks}
              helperText={errors?.remarks ? errors.remarks.message : null}
            />
                </Grid>
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
              marginTop: "20px",
            }}
          >
            <Button color="success" variant="contained" type="submit"  onClick={()=>{setBtnSaveText("Save")}} endIcon={<Save />}>
              <FormattedLabel id="completeSiteVisit" />
            </Button>
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
              marginTop: "20px",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={()=>{setBtnSaveText("Revert")}}
              endIcon={<Clear />}
            >
              <FormattedLabel id="clear" />
            </Button>
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
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToApp />}
              onClick={() => {
                router.push(
                  `/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails`,
                );
              }}
            >
              <FormattedLabel id="exit" />
              {/* {labels["exit"]} */}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default index;
