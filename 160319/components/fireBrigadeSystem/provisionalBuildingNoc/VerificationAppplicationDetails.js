import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import {
  useForm,
  useFormContext,
  Controller,
  FormProvider,
} from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import axios from "axios";
import { useSelector } from "react-redux";
import { flexbox, Stack } from "@mui/system";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UploadButton1 from "../../fileUpload/UploadButton1";
// import PropertyTax from "./PropertyTax";
import ApplicantDetails from "./ApplicantDetails";
import FormsDetails from "./FormsDetails";
import BuildingDetails from "./BuildingDetails";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import OwnerDetail from "./OwnerDetail";

//  Verification Application Details
const VerificationAppplicationDetails = (props) => {
  // const methods = useForm();
  const methods = useFormContext();
  const {
    control,
    getValues,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
  } = methods;
  const [serviceNames, setServiceNames] = useState([]);
  const language = useSelector((state) => state?.labes?.language);
  const [panCardPhoto, setPanCardPhoto] = useState();
  const [aadhaarCardPhoto, setAadhaarCardPhoto] = useState(null);
  const [rationCardPhoto, setRationCardPhoto] = useState(null);
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] =
    useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] =
    useState(null);
  const [overHearWaterTankCoApprovedMaps, setWaterTank] = useState(null);
  const [layoutPlan, setLayoutPlan] = useState(null);
  const [tank, setTank] = useState(null);
  const [permission, setPermission] = useState(null);
  const [stability, setStability] = useState(null);
  const [fireDrawing, setFireDrawing] = useState(null);
  const [elivation, setElivation] = useState(null);
  const [road, setRoad] = useState(null);
  const [explosive, setExplosive] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [lift, setLift] = useState(null);
  // Form Preview - ===================>
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  // getserviceNames
  const getserviceNames = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceName: row.serviceName,
          serviceNameMr: row.serviceNameMr,
        }))
      );
    });
  };

  useEffect(() => {
    getserviceNames();
  }, []);

  useEffect(() => {
    console.log("propssdflsdjf", props);
  }, [props]);

  return (
    <>
      <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="applicationNumber" />}
              disabled
              defaultValue="23848494848"
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <TextField
              id="standard-basic"
              // label={<FormattedLabel id="applicationNumber" />}
              label="Application Number"
              disabled
              // defaultValue="23848494848"
              {...register("applicationNo")}
              error={!!errors.applicationNo}
              helperText={
                errors?.applicationNo ? errors.applicationNo.message : null
              }
            />
          </Grid>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <FormControl
              error={!!errors.applicationDate}
              sx={{ marginTop: 0 }}
              // sx={{ border: "solid 1px yellow" }}
            >
              <Controller
                control={control}
                name="applicationDate"
                defaultValue={Date.now()}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled
                      inputFormat="DD/MM/YYYY"
                      // label={
                      //   <span style={{ fontSize: 16 }}>
                      //     {<FormattedLabel id="applicationDate" />}
                      //   </span>
                      // }
                      label="Application Date"
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
                          fullWidth
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.applicationDate
                  ? errors.applicationDate.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={12} md={4} lg={4} xl={4}>
            <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* {<FormattedLabel id="serviceName" />} */}
                Service Name
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "50vh" }}
                    // disabled={inputState}
                    autoFocus
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Service Name *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {serviceNames &&
                      serviceNames.map((serviceName, index) => (
                        <MenuItem key={index} value={serviceName.id}>
                          {language == "en"
                            ? serviceName?.serviceName
                            : serviceName?.serviceNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="serviceName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.serviceName ? errors.serviceName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
            <Stack
              style={{ display: flexbox, justifyContent: "center" }}
              spacing={3}
              direction={"row"}
            >
              {/** Form Preview Button */}

              <IconButton
                onClick={() => {
                  console.log("viewFormProps", props?.props);
                  reset(props?.props);
                  setValue("serviceName", props.serviceId);
                  formPreviewDailogOpen();
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  size="small"
                >
                  View Form
                </Button>
              </IconButton>

              {/** View Document Button */}

              <IconButton>
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  size="small"
                  onClick={() => {
                    reset(props?.props);
                    setValue("serviceName", props.serviceId);
                    documentPreviewDailogOpen();
                  }}
                >
                  View Document
                </Button>
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        {/** Form Preview Dailog  - OK */}
        <Dialog
          fullWidth
          maxWidth={"lg"}
          open={formPreviewDailog}
          onClose={() => formPreviewDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                Preview
              </Grid>
              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  aria-label="delete"
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                    onClick={() => {
                      formPreviewDailogClose();
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            {/* <PropertyTax /> */}
            <ApplicantDetails readOnly />
            <OwnerDetail view />
            <FormsDetails readOnly view />
            <BuildingDetails view />
            {/* <BuildingUse view /> */}
          </DialogContent>
          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button onClick={formPreviewDailogClose}>Exit</Button>
            </Grid>
          </DialogTitle>
        </Dialog>

        {/** Document Preview Dailog - OK */}
        <Dialog
          fullWidth
          maxWidth={"md"}
          open={documentPreviewDialog}
          onClose={() => documentPreviewDailogClose()}
        >
          <Paper sx={{ p: 2 }}>
            <CssBaseline />
            <DialogTitle>
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sm={6}
                  lg={6}
                  xl={6}
                  md={6}
                  sx={{
                    display: "flex",
                    alignItem: "left",
                    justifyContent: "left",
                  }}
                >
                  Document Preview
                </Grid>
                <Grid
                  item
                  xs={1}
                  sm={2}
                  md={4}
                  lg={6}
                  xl={6}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <IconButton
                    aria-label="delete"
                    sx={{
                      marginLeft: "530px",
                      backgroundColor: "primary",
                      ":hover": {
                        bgcolor: "red", // theme.palette.primary.main
                        color: "white",
                      },
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: "black",
                      }}
                      onClick={() => {
                        documentPreviewDailogClose();
                      }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/** <FormProvider {...methods}>*/}
              <TableContainer style={{ border: "2px soiid black" }}>
                <Table style={{ border: "2px soiid red" }}>
                  <TableHead
                    stickyHeader={true}
                    sx={{
                      // textDecorationColor: "white",
                      backgroundColor: "#1890ff",
                    }}
                  >
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>Sr.No</h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>Document Name</h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>Mandatory</h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>View Document</h3>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        1{" "}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Over Hear Water Tank Coapproved Maps
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setWaterTank}
                          fileName={getValues(
                            "overHearWaterTankCoApprovedMaps"
                          )}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        2{" "}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Approved Layout Plan PCMC
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setLayoutPlan}
                          fileName={getValues("layoutPlan")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        3
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Set Tank
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setTank}
                          fileName={getValues("tank")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        4
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Permission letter Of PCMC
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={disablityCertificatePhoto}
                          fileName={getValues("disablityCertificatePhoto")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        5
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Structural Stability Certificate
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setPermission}
                          fileName={getValues("permission")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        6
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Fire Drawing Floor wise i.e. also approved by Compliance
                        authority
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setStability}
                          fileName={getValues("stability")}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        7
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Approved Key Plan, Site Plan , Elivation Section PCMC
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setStability}
                          fileName={getValues("stability")}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        8
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Approved Approach Road PCMC
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setRoad}
                          fileName={getValues("road")}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        9
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Explosive License (for LGP, CNG , Petrol Pump ,Gas
                        Station , Gas Storage)
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setExplosive}
                          fileName={getValues("explosive")}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        10
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Completion Certificate
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setCompletion}
                          fileName={getValues("completion")}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        11
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Escalator / Lift Approved by Govt Certificate
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        Required
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="FBS"
                          serviceName="ProvisionalBuildingFire"
                          filePath={setLift}
                          fileName={getValues("lift")}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {/**   </FormProvider>*/}
            </DialogContent>
            {/**
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Stack
                direction='row'
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant='contained' onClick={approveButton}>
                  Approve
                </Button>
                <Button variant='contained' onClick={revertButton}>
                  Revert
                </Button>
              </Stack>
            </Grid>
          </Grid>
           */}
            <DialogTitle>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  onClick={documentPreviewDailogClose}
                >
                  Exit
                </Button>
              </Grid>
            </DialogTitle>
          </Paper>
        </Dialog>
      </FormProvider>
    </>
  );
};

export default VerificationAppplicationDetails;
