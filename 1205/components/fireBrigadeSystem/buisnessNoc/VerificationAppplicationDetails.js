import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { flexbox, Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import Form from "../../../pages/FireBrigadeSystem/transactions/businessNoc/citizen/form";
import urls from "../../../URLS/urls";
import UploadButton1 from "../../fileUpload/UploadButton1";

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

  // document upload
  const [letterToApplicant, setLetterToApplicant] = useState(null);
  const [locationMap, setLocationMap] = useState(null);
  const [permissionFromLandOwner, setPermissionFromLandOwner] = useState(null);
  const [refellingCertificate, setRefellingCertificate] = useState(null);
  const [trainFirePersonList, setTrainFirePersonList] = useState(null);
  const [structuralStabilityCertificate, setStructuralStabilityCertificate] =
    useState(null);
  const [electrialInspectorCertificate, setElectrialInspectorCertificate] =
    useState(null);

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

  // useEffect(() => {
  //   reset(props?.props);
  //   console.log("propssdflsdjf", props);
  // }, []);

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
                      label={
                        <span style={{ fontSize: 16 }}>
                          {<FormattedLabel id="applicationDate" />}
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
                {<FormattedLabel id="serviceName" />}
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
            <Form props={{ ...props?.props, docPriview: true }} />
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
                      <TableCell>1 </TableCell>
                      <TableCell>
                        {" "}
                        Letter to Applicant by Police inspector, Licence Branch,
                        Vadodra City
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="FBS"
                          serviceName="businessNoc"
                          filePath={setLetterToApplicant}
                          fileName={getValues("letterToApplicant")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2 </TableCell>
                      <TableCell>
                        Location Map / Internal Drawing with Entry or Exit with
                        measurement
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="FBS"
                          serviceName="businessNoc"
                          filePath={setLocationMap}
                          fileName={getValues("locationMap")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3</TableCell>
                      <TableCell> Permission From Land Owner</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="FBS"
                          serviceName="businessNoc"
                          filePath={setPermissionFromLandOwner}
                          fileName={getValues("permissionFromLandOwner")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>4</TableCell>
                      <TableCell>
                        Refelling Certificate of Fire Fightning equipments
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="FBS"
                          serviceName="businessNoc"
                          filePath={setRefellingCertificate}
                          fileName={getValues("refellingCertificate")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>5</TableCell>
                      <TableCell>
                        Train Fire Persion List with their Name & Mobile
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="FBS"
                          serviceName="businessNoc"
                          filePath={setTrainFirePersonList}
                          fileName={getValues("trainFirePersonList")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>6</TableCell>
                      <TableCell>
                        Structural Stability Certificate From PWD Department
                      </TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="FBS"
                          serviceName="businessNoc"
                          filePath={setStructuralStabilityCertificate}
                          fileName={getValues("structuralStabilityCertificate")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>7</TableCell>
                      <TableCell>Electrical Inspector Certificate</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>
                        <UploadButton1
                          appName="FBS"
                          serviceName="Business Noc"
                          filePath={setElectrialInspectorCertificate}
                          fileName={getValues("otherDocumentPhoto")}
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
