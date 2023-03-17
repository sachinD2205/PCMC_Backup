import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import urls from "../../URLS/urls";
import UploadButtonOP from "./DocumentUploadButtonGrievance";
import styles from "./view.module.css";
import Document from "../../pages/grievanceMonitoring/uploadDocuments/Documents";

const GrievanceDetails = () => {
  let appName = "MR",
    serviceName = "M-NMR";
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useFormContext({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const router = useRouter();
  const [selectDepartment, setSubDepartments] = useState(null);
  const [selectComplaintType, setSubComplaintType] = useState(null);

  const [activeStep, setActiveStep] = useState();
  //   const steps = getSteps();
  const dispach = useDispatch();
  const [eventTypes, setEventTypes] = useState([
    {
      id: 1,
      eventTypeEn: "",
      eventTypeMr: "",
    },
  ]);
  const [categories, setCategory] = useState([
    {
      id: 1,
      categoryEn: "",
      categoryMr: "",
    },
  ]);

  const [applicantTypes, setApplicantTypes] = useState([
    {
      id: 1,
      applicantTypeEn: "",
      applicantTypeMr: "",
    },
  ]);

  const [mediaTypes, setMediaTypes] = useState([
    {
      id: 1,
      mediaTypeEn: "",
      mediaTypeMr: "",
    },
  ]);

  const [complaintTypes, setcomplaintTypes] = useState([
    {
      id: 1,
      complaintTypeEn: "",
      complaintTypeMr: "",
    },
  ]);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      departmentEn: "",
      departmentMr: "",
    },
  ]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);

  const [wards, setWards] = useState([]);
  const [pageMode, setPageMode] = useState(null);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setPageMode(null);
      console.log("enabled", router.query.pageMode);
    } else {
      setPageMode(router.query.pageMode);
      console.log("disabled", router.query.pageMode);
    }
  }, []);

  const language = useSelector((state) => state?.labels.language);

  useEffect(() => {
    getCategory();
    getApplicantType();
    getMediaType();
  }, []);

  const getCategory = () => {
    axios.get(`${urls.GM}/categoryTypeMaster/getAll`).then((res) => {
      setCategory(
        res.data.categoryTypeMasterList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          categoryEn: r.categoryType,
          categoryMr: r.categoryTypeMr,
        })),
      );
    });
  };

  const getApplicantType = () => {
    axios.get(`${urls.GM}/master/applicantType/getAll`).then((res) => {
      console.log(":2", res);
      setApplicantTypes(
        res?.data?.applicantType?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          applicantTypeEn: r.applicantType,
          applicantTypeMr: r.applicantTypeMr,
        })),
      );
    });
  };

  ////////////////////NEWLY ADDED MEDIA TYPE////////////////
  const getMediaType = () => {
    axios.get(`${urls.GM}/mediaMaster/getAll`).then((res) => {
      console.log(":2", res);
      setMediaTypes(
        res?.data?.mediaMasterList?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          mediaTypeEn: r.mediaName,
          mediaTypeMr: r.mediaNameMr,
        })),
      );
    });
  };

  const getEventTypes = () => {
    axios.get(`${urls.GM}/eventTypeMaster/getAll`).then((res) => {
      setEventTypes(
        res.data.eventTypeMasterList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          eventTypeEn: r.eventType,
          eventTypeMr: r.eventTypeMr,
        })),
      );
    });
  };
  useEffect(() => {
    getDepartment();
    getComplaintTypes();
    getEventTypes();
  }, []);

  useEffect(() => {
    // if (watch("departmentName")) {
    // }
    getSubDepartmentDetails();
  }, [watch("departmentName")]);

  useEffect(() => {
    // if (selectComplaintType !== null) {
    // }
    getComplaintSubType();
  }, [watch("complaintTypeId")]);

  const getComplaintTypes = () => {
    axios.get(`${urls.GM}/complaintTypeMaster/getAll`).then((res) => {
      setcomplaintTypes(
        res.data.complaintTypeMasterList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          // complaintTypeId: r.id,
          complaintTypeEn: r.complaintType,
          complaintTypeMr: r.complaintTypeMr,
        })),
      );
    });
  };

  // Get Table - Data
  const getComplaintSubType = () => {
    if (watch("complaintTypeId")) {
      axios
        .get(`${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${watch("complaintTypeId")}`)
        .then((res) => {
          setComplaintSubTypes(
            res.data.complaintSubTypeMasterList.map((r, i) => ({
              id: r.id,
              complaintSubType: r.complaintSubType,
              complaintTypeId: r.complaintTypeId,
            })),
          );
        });
    }
  };

  const getDepartment = () => {
    axios.get(`${urls.CfcURLMaster}/department/getAll`).then((res) => {
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          departmentEn: r.department,
          departmentMr: r.departmentMr,
        })),
      );
    });
  };

  const getSubDepartmentDetails = () => {
    if (watch("departmentName")) {
      axios.get(`${urls.GM}/master/subDepartment/getAllByDeptWise/${watch("departmentName")}`).then((res) => {
        setSubDepartmentList(
          res?.data?.subDepartment?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartmentEn: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          })),
        );
      });
    }
  };

  useEffect(() => {
    getWard();
    getApplicationType();
  }, []);
  const getWard = () => {
    axios.get(`${urls.CfcURLMaster}/ward/getAll`).then((res) => {
      setWards(
        res.data.ward.map((r, i) => ({
          id: r.id,
          wardName: r.wardName,
        })),
      );
    });
  };
  const [ApplicationTypes, setApplicationTypes] = useState();

  const getApplicationType = () => {
    axios.get(`${urls.CfcURLMaster}/applicantType/getAll`).then((res) => {
      setApplicationTypes(
        res.data.applicantType.map((r, i) => ({
          id: r.id,
          applicantType: r.applicantType,
          applicantTypeMr: r.applicantTypeMr,
        })),
      );
    });
  };

  const editRecord = (rows) => {
    setBtnSaveText("Update"), setID(rows.id), setIsOpenCollapse(true), setSlideChecked(true);
    reset(rows);
  };

  const locateButton = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("ActiveSteps" + activeStep + "StepsLength" + steps.length);
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  };

  const handleNext = (data) => {
    dispach(addIsssuanceofHawkerLicense(data));
    console.log(data);
    if (activeStep == steps.length - 1) {
      fetch("https://jsonplaceholder.typicode.com/comments")
        .then((data) => data.json())
        .then((res) => {
          setActiveStep(activeStep + 1);
        });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  // View
  return (
    <>
      {/* <div> */}
      <Box>
        {/* <div className={styles.small}> */}
        {/* <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                Grievance Details
              </h3>
            </div>
          </div> */}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "99%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 15,
              fontWeight: 400,
              borderRadius: 100,
            }}
          >
            <strong>
              <FormattedLabel id="grievanceDetails" />
            </strong>
          </Box>
        </Box>

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
            sm={6}
            md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl style={{ minWidth: "230px" }} error={!!errors.departmentName}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="departmentName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    // sx={{ width: 250 }}
                    autoFocus
                    fullWidth
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value), setSubDepartments(value.target.value);
                    }}
                    label={<FormattedLabel id="departmentName" />}
                  >
                    {departments &&
                      departments.map((department, index) => (
                        <MenuItem key={index} value={department.id}>
                          {language == "en"
                            ? //@ts-ignore
                              department.departmentEn
                            : // @ts-ignore
                              department?.departmentMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="departmentName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.departmentName ? errors.departmentName.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          {/* {subDepartments.length !== 0 ? ( */}
          {subDepartments?.length !== 0 ? (
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
              <FormControl style={{ minWidth: "230px" }} error={!!errors.subDepartment}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="subDepartmentName" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 250 }}
                      fullWidth
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Sub Department Name"
                    >
                      {subDepartments &&
                        subDepartments?.map((subDepartment, index) => (
                          <MenuItem key={index} value={subDepartment.id}>
                            {language == "en"
                              ? //@ts-ignore
                                subDepartment.subDepartmentEn
                              : // @ts-ignore
                                subDepartment?.subDepartmentMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="subDepartment"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.subDepartment ? errors.subDepartment.message : null}</FormHelperText>
              </FormControl>
            </Grid>
          ) : (
            ""
          )}

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
            <FormControl style={{ minWidth: "230px" }} error={!!errors.applicantType}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="applicantTypes" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    fullWidth
                    variant="standard"
                    // sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="applicantType"
                  >
                    {applicantTypes &&
                      applicantTypes.map((applicantType, index) => (
                        <MenuItem key={index} value={applicantType.id}>
                          {language == "en"
                            ? //@ts-ignore
                              applicantType.applicantTypeEn
                            : // @ts-ignore
                              applicantType?.applicantTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="applicantType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.applicantType ? errors.applicantType.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          {/* ///////////////////////////////// ADDED MEDIA TYPE AS SPECIAL FIELD AS PER AMOL SIR SAID ///////////////////////// */}
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
            <FormControl style={{ minWidth: "230px" }} error={!!errors.mediaId}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="mediaTypes" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    fullWidth
                    variant="standard"
                    // sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Media Type"
                  >
                    {mediaTypes &&
                      mediaTypes?.map((media, index) => (
                        <MenuItem key={index} value={media.id}>
                          {language == "en"
                            ? //@ts-ignore
                              media.mediaTypeEn
                            : // @ts-ignore
                              media.mediaTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="mediaId"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.mediaId ? errors.mediaId.message : null}</FormHelperText>
            </FormControl>
          </Grid>
          {/* ///////////////////////////////// ADDED MEDIA TYPE AS SPECIAL FIELD AS PER AMOL SIR SAID ///////////////////////// */}
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
            <FormControl style={{ minWidth: "230px" }} error={!!errors.complaintTypeId}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="complaintTypes" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    fullWidth
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value), setSubComplaintType(value.target.value);
                    }}
                    label="Complaint Type"
                  >
                    {complaintTypes &&
                      complaintTypes.map((complaintType, index) => (
                        <MenuItem key={index} value={complaintType.id}>
                          {language == "en"
                            ? //@ts-ignore
                              complaintType.complaintTypeEn
                            : // @ts-ignore
                              complaintType?.complaintTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="complaintTypeId"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.complaintTypeId ? errors.complaintTypeId.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {complaintSubTypes?.length !== 0 ? (
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
              <FormControl style={{ minWidth: "230px" }} error={!!errors.complaintSubTypeId}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="complaintSubTypes" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      fullWidth
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Sub-Complaint Type"
                    >
                      {complaintSubTypes &&
                        complaintSubTypes.map((complaintSubType, index) => (
                          <MenuItem key={index} value={complaintSubType.id}>
                            {complaintSubType.complaintSubType}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="complaintSubTypeId"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.complaintSubTypeId ? errors.complaintSubTypeId.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          ) : (
            ""
          )}

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
            <FormControl style={{ minWidth: "230px" }} error={!!errors.category}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="categories" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    fullWidth
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Category"
                  >
                    {categories &&
                      categories.map((category, index) => (
                        <MenuItem key={index} value={category.id}>
                          {language == "en"
                            ? //@ts-ignore
                              category.categoryEn
                            : // @ts-ignore
                              category?.categoryMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="category"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.category ? errors.category.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          {/* ...............................HIDING THE EVENT TYPE AS PER BA SAID.................... */}
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
            <FormControl style={{ minWidth: "230px" }} error={!!errors.eventTypeId}>
              <InputLabel id="demo-simple-select-standard-label">Event</InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    fullWidth
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Event"
                  >
                    {eventTypes &&
                      eventTypes.map((eventType, index) => (
                        <MenuItem key={index} value={eventType.id}>
                          {language == "en"
                            ? //@ts-ignore
                              eventType.eventTypeEn
                            : // @ts-ignore
                              eventType?.eventTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="eventTypeId"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.eventTypeId ? errors.eventTypeId.message : null}</FormHelperText>
            </FormControl>
          </Grid>
          {/* ...............................HIDING THE EVENT TYPE AS PER BA SAID.................... */}

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              id="standard-basic"
              sx={{ width: "88%" }}
              multiline
              minRows={1}
              maxRows={6}
              label={<FormattedLabel id="subjects" />}
              variant="standard"
              {...register("subject")}
              error={!!errors.subject}
              helperText={errors?.subject ? errors.subject.message : null}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              label={<FormattedLabel id="complaintDescription" />}
              sx={{ width: "88%" }}
              multiline
              minRows={1}
              maxRows={6}
              // style={{ resize: "vertical", overflow: "auto" }}
              // sx={{ width: 250 }}
              // maxlength="50"
              id="standard-basic"
              // label="Complaint Description"
              variant="standard"
              {...register("complaintDescription")}
              error={!!errors.complaintDescription}
              helperText={errors?.complaintDescription ? errors.complaintDescription.message : null}
            />
          </Grid>

          {/* <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "2%",
              paddingBottom: "1%",
            }}
          >
            <div>
              <Typography> Upload Image/Document</Typography>
              <UploadButtonOP
                appName="RaiseGrivance"
                serviceName="PARTMAP"
                // fileDtl={getValues('gageProofDocument')}
                // fileKey={'gageProofDocument'}
                // showDel={pageMode ? false : true}
                label="Upload Image/Document"
                filePath={attachment}
                fileUpdater={setAttachment}
              />
            </div>
          </Grid> */}

          {/* ////////////////////////////////////////////temporary Committed///////////////////// */}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "88%" }}>
              <Document />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* <div className={styles.btn}>
        
          <Button
            sx={{ marginRight: 4 }}
            variant="contained"
            color="primary"
            endIcon={<ClearIcon />}
            onClick={() => cancellButton()}
          >
            Clear
          </Button>
          <Button
            sx={{ marginRight: 4 }}
            variant="contained"
            color="error"
            endIcon={<ExitToAppIcon />}
            onClick={() => {
              router.push({
                pathname:
                  '/grievanceMonitoring/transactions/newGrievanceRegistration/',
              })
            }}
          >
            Exit
          </Button>
        </div> */}
      {/* </div> */}
    </>
  );
};

export default GrievanceDetails;
