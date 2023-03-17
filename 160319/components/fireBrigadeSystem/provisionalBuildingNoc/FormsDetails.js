import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Slide,
  Paper,
  FormGroup,
  IconButton,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { GridToolbar } from "@mui/x-data-grid";
import {
  Controller,
  useFieldArray,
  useFormContext,
  FormProvider,
} from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../URLS/urls";

import { useSelector } from "react-redux";
import { Visibility } from "@mui/icons-material";
// { readOnly = false }
const FormsDetails = ({ view = false, readOnly = false }) => {
  // Exit button Routing
  const [valueDate, setValueDate] = React.useState(dayjs(""));
  const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));
  const [tank, setTank] = useState();
  const [fetchData, setFetchData] = useState(null);

  // Set Current Date and Time
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

  const language = useSelector((state) => state?.labels.language);

  const router = useRouter();

  // const {
  //   control,
  //   register,
  //   reset,
  //   getValues,
  //   handleSubmit,
  //   watch,
  //   setValue,
  //   methods,
  //   formState: { errors },
  // } = useFormContext();

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [btnSaveText, setBtnSaveText] = useState("Save");

  // const [isOpenProperty, setIsOpenProperty] = useState(false);
  // const [isOpenWaterTank, setIsOpenWaterTank] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [dataSourcee, setDataSourcee] = useState([]);
  const [currentFormId, setCurrentFormId] = useState(null);


  const [isOpenProperty, setIsOpenProperty] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputStates] = useState();

  const [isOpenWaterTank, setIsOpenWaterTank] = useState(false);
  const [slideCheckedT, setSlideCheckedT] = useState(false);
  const [buttonInputStateT, setButtonInputStateT] = useState();

  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);

  const [viewButtonInputStateT, setViewButtonInputStateT] = useState(false);

  const [businessTypes, setBusinessTypes] = useState([]);
  const [nocTypes, setNocTypes] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [btnValue, setButtonValue] = useState(false);
  const [roadWidth, setRoadWidth] = useState([]);
  let cnt = 0;

  useEffect(() => {
    // console.log("sachin1211212", getValues("sachin"));
    console.log("777777", getValues("nocId"), watch("nocId"));
  }, []);
  useEffect(() => {
    // getData();
    if (getValues("formDTLDao.underGroundWaterTankDao")?.length > 0) {
      setDataSource(getValues("formDTLDao.underGroundWaterTankDao"));
    }
    // getArea();
    getBuildingTypes();
    getRoadWidth();
  }, [fetchData]);

  useEffect(() => {
    // getData();
    if (getValues("formDTLDao.underGroundWaterTankDao")?.length > 0) {
      setDataSource(getValues("formDTLDao.underGroundWaterTankDao"));
    }
    // getArea();
    getBuildingTypes();
    getRoadWidth();
  }, [fetchData]);
  const onSubmitForms = (fromData) => {
    console.log("Form Data ", fromData);

    const tempData = axios
      .post(`${urls.FbsURL}/typeOfNOCMaster/saveTypeOfNOCMaster`, fromData)
      .then((res) => {
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputStates(false);
          setIsOpenProperty(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  useEffect(() => {}, [isOpenProperty]);

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      // headerName: <FormattedLabel id="nOCName" />,
      flex: 1,
    },
    {
      field: "length",
      headerName: "Length",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "height",
      headerName: "Height",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "breadth",
      headerName: "Breadth",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "capacity",
      headerName: "Capacity",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              // className={styles.delete}
              // disabled={deleteButtonInputState}
              disabled={viewButtonInputStateT}
              onClick={() => {
                setIsOpenCollapse(false),
                  // setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setViewButtonInputStateT(true);
                setDeleteButtonState(true);
                reset(params.row);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputState}
                onClick={() => {
                  setIsOpenWaterTank(false),
                    setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenWaterTank(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  reset(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputState}
                onClick={() => deleteById(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  const columnss = [
    {
      field: "srNo",
      headerName: "Sr No.",
      // headerName: <FormattedLabel id="nOCName" />,
      flex: 1,
    },
    {
      field: "propertyNo",
      headerName: "Property No.",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              // className={styles.delete}
              // disabled={deleteButtonInputState}
              disabled={viewButtonInputState}
              onClick={() => {
                setIsOpenProperty(false),
                  // setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setViewButtonInputState(true);
                setDeleteButtonState(true);
                reset(params.row);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputState}
                onClick={() => {
                  setIsOpenWaterTank(false),
                    setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenWaterTank(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  reset(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            )}

            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputState}
                onClick={() => deleteById(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton
              // className={styles.delete}
              // disabled={deleteButtonInputState}
              // onClick={() => deleteById(params.id)}
              >
                <Visibility />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  //key={field.id}

  const resetValuesOnSave = () => {
    reset({
      ...resetValues,
      id,
    });
  };

  const exitFunction = () => {
    // alert("Exit Function");
    setButtonInputStates(false);
    setIsOpenProperty(false);
    setSlideChecked(true);
  };
  const exitFunctionT = () => {
    setSlideCheckedT(true);
    // alert("Exit Function");
    setButtonInputStateT(false);
    setIsOpenWaterTank(false);
    // setFetchData(tempData);
    // setEditButtonInputState(false);
    // setDeleteButtonState(false);
    // setIsOpenWaterTank(!isOpenWaterTank);
  };

  // Reset Values
  const resetValues = {
    formName: "",
    ownerName: "",
    ownerNameMr: "",
    ownerMiddleNameMr: "",
  };

  const savePropertyDetails = () => {
    // console.log("Form Data ", fromData);
    console.log("nociddddd", getValues("nocId"), getValues("id"));
    console.log("formIdddddddd", getValues("nocId"), getValues("formId"));
    const propertyDTLDao = {
      propertyNo: getValues("propertyNo"),
    };
    // console.log("nocid==", getValues("nocId"));

    const formDTLDao = {
      id: currentFormId,
      // id: formId,
      propertyDTLDao: [...dataSource, propertyDTLDao],
    };
    console.log("2-res.data.formDTLDao.id", formId);
    // setDataSource([...dataSource, underGroundWaterTankDao]);

    const body = {
      ...getValues("prevData"),

      id: localStorage.getItem("pNocId"),

      // id: null,
      // id: getValues("nocId"),
      formDTLDao,
    };
    console.log("23", id);

    // console.log("NOC CHA ID", getValues("nocId"));

    // console.log("isPlanhaveUnderGroundWaterTank", body);

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
        // {
        body
        // ,
        // id: getValues("id"),
        // }
      )
      .then((res) => {
        if (res.status == 200) {
          console.log("2323", res);
          // console.log("ooooo", res.data);
          let appId = res?.data?.status?.split("$")[1];
          const tempData = axios
            .get(
              `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`
            )
            .then((res) => {
              console.log("getRespose", res);
              console.log("res", res.data);
              console.log("ooooo", res.data);
              console.log(
                "Property Details",
                res.data.formDTLDao.propertyDTLDao
              );
              console.log("231297", res?.data);
              // reset(res.data);

              setDataSourcee(
                res?.data?.formDTLDao?.propertyDTLDao.map((o, i) => {
                  return {
                    srNo: i + 1,
                    ...o,
                  };
                })
              );
              setValue("prevData", res.data);
              setValue("nocId", res.data.id);
              setCurrentFormId(res.data.formDTLDao.id);
              setValue("formId", res.data.formDTLDao.id);
              console.log("1-res.data.formDTLDao.id", res.data.formDTLDao.id);
              // setTank("formId", formDTLDao.isPlanhaveUnderGroundWaterTank);
              setValue("ownerDTLDao", res.data.ownerDTLDao);
              // setFormId("state111", res.data.formDTLDao.id);

              // setValue("formDTLDao", res.data.formDTLDao);
              // setValue(
              //   "formDTLDao.underGroundWaterTankDao",
              //   formDTLDao.underGroundWaterTankDao
              // );

              setValue("applicantDTLDao", res.data.applicantDTLDao);
              setValue("propertyDTLDao", res.data.propertyDTLDao);
              setValue("applicantDTLDao", res.data.applicantDTLDao);
              setValue("buildingDTLDao", res.data.buildingDTLDao);
              setValue("attachments", res.data.attachments);
            });
          // appId=res?.data?.message?.split("$")[1],
          // fromData.id
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          // : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setFetchData(tempData);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
          // resetValuesOnSave();

          // delete following states
          setButtonInputStates(false);
          setIsOpenProperty(false);
          // setIsOpenCollapse(false);
          // setFetchData(tempData);
        }
      });
  };

  const [formId, setFormId] = useState();

  const saveTankDetails = () => {
    cnt = cnt + 1;
    // console.log("Form Data ", fromData);
    const underGroundWaterTankDao = {
      srNo: cnt,
      length: getValues("length"),
      breadth: getValues("breadth"),
      height: getValues("height"),
      capacity: getValues("capacity"),
    };
    // console.log("nocid==", getValues("nocId"));
    const formDTLDao = {
      // id: getValues("id"),
      // id: getValues("formId"),
      id: currentFormId,
      // formId: getValues("formDtlId"),
      isPlanhaveUnderGroundWaterTank: tank,
      underGroundWaterTankDao: [...dataSource, underGroundWaterTankDao],
    };
    // setDataSource([...dataSource, underGroundWaterTankDao]);
    console.log("form dtl cha id", formId);

    const body = {
      ...getValues("prevData"),

      id: localStorage.getItem("pNocId"),

      // id: getValues("id"),
      formDTLDao,
    };

    console.log("NOC CHA ID", getValues("nocId"));

    console.log("isPlanhaveUnderGroundWaterTank", body);

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
        // {
        body
        // ,
        // id: getValues("id"),
        // }
      )
      .then((res) => {
        if (res.status == 200) {
          console.log("2323", res);
          // console.log("ooooo", res.data);
          let appId = res?.data?.status?.split("$")[1];
          const tempData = axios
            .get(
              `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`
            )
            .then((res) => {
              console.log("getRespose", res);
              console.log("res", res.data);
              console.log("ooooo", res.data);
              console.log(
                "Tank Details",
                res.data.formDTLDao.underGroundWaterTankDao
              );
              console.log("231297", res?.data);
              // reset(res.data);
              setDataSource(
                res?.data?.formDTLDao?.underGroundWaterTankDao.map((o, i) => {
                  return {
                    srNo: i + 1,
                    ...o,
                  };
                })
              );
              setCurrentFormId(res.data.formDTLDao.id);
              setValue("prevData", res.data);
              setValue("id", res.data.id);
              setValue("ownerDTLDao", res.data.ownerDTLDao);
              setValue("formDTLDao", res.data.formDTLDao);
              setValue("formId", res.data.formDTLDao.id);
              // setValue("formDtlId", res.data.formDTLDao.id);

              // setValue("formDTLDao", res.data.formDTLDao);
              // setValue(
              //   "formDTLDao.underGroundWaterTankDao",
              //   formDTLDao.underGroundWaterTankDao
              // );

              // setValue("applicantDTLDao", res.data.applicantDTLDao);
              setValue("applicantDTLDao", res.data.applicantDTLDao);
              setValue("buildingDTLDao", res.data.buildingDTLDao);
              setValue("attachments", res.data.attachments);
            });
          // appId=res?.data?.message?.split("$")[1],
          // fromData.id
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          // : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputStateT(false);
          setIsOpenWaterTank(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          resetValuesOnSave();
        }
      });
  };

  // get Road Width
  const getRoadWidth = () => {
    axios
      .get(`${urls.FbsURL}/master/accessRoadWidth/getAll`)
      .then((res) => {
        console.log("4444", res?.data?.accessRoadWidth);
        setRoadWidth(res?.data?.accessRoadWidth);
      })
      .catch((err) => console.log(err));
  };

  // get Building Type
  const getBuildingTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBuildingMaster/getTypeOfBuildingMaster`)
      .then((res) => {
        setBuildingTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  //   useEffect(() => {
  //     getBusinessTypes();
  //   }, []);

  //   useEffect(() => {
  //     getBusinesSubType();
  //   }, [businessTypes]);

    useEffect(() => {
      if(getValues("formDTLDao.id")){
        setCurrentFormId(getValues("formDTLDao.id"))
      }
    }, []);

  //   const getBusinessTypes = () => {
  //     axios.get(`${urls.FbsURL}/businessType/getBusinessTypeData`).then((r) => {
  //       setBusinessTypes(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           businessType: row.businessType,
  //         }))
  //       );
  //     });
  //   };

  // const editRecord = (rows) => {
  //   setBtnSaveText("Update"),
  //     setID(rows.id),
  //     setIsOpenWaterTank(true),
  //     setSlideChecked(true);
  //   reset(rows);
  // };

  // // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   const fromDate = new Date(fromData.fromDate).toISOString();
  //   const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
  //   // Update Form Data
  //   const finalBodyForApi = {
  //     ...fromData,
  //     fromDate,
  //     toDate,
  //   };
  //   if (btnSaveText === "Save") {
  //     axios
  //       .post(
  //         `${urls.FbsURL}/businessSubType/saveBusinessSubType`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           getBusinesSubType();
  //           setButtonInputState(false);
  //           setIsOpenWaterTank(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   } else if (btnSaveText === "Update") {
  //     axios
  //       .post(
  //         `${urls.FbsURL}/businessSubType/saveBusinessSubType`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");
  //           getBusinesSubType();
  //           setButtonInputState(false);
  //           setIsOpenWaterTank(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  // };

  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/businessSubType/discardBusinessSubType/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              //getcast();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  // Exit Button
  // const exitButton = () => {
  //   reset({
  //     ...resetValuesExit,
  //   });
  //   setButtonInputState(false);
  //   setSlideChecked(false);
  //   setSlideChecked(false);
  //   setIsOpenWaterTank(false);
  //   setEditButtonInputState(false);
  //   setDeleteButtonState(false);
  // };
  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`groupDetails.length`) >= 10) {
      setButtonValue(true);
    } else {
      appendFun();
      // reset();
      setButtonValue(false);
    }
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    appliedFor: "",
    architectName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    siteAddress: "",
    applicantContactNo: "",
    finalPlotNo: "",
    revenueSurveyNo: "",
    buildingLocation: "",
    townPlanningNo: "",
    blockNo: "",
    opNo: "",
    citySurveyNo: "",
    typeOfBuilding: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    appliedFor: "",
    architectName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    siteAddress: "",
    applicantContactNo: "",
    finalPlotNo: "",
    revenueSurveyNo: "",
    buildingLocation: "",
    townPlanningNo: "",
    blockNo: "",
    opNo: "",
    citySurveyNo: "",
    typeOfBuilding: "",
  };

  // View
  return (
    <>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="firmName" />}
            variant="standard"
            // key={groupDetails.id}
            {...register("formDTLDao.formName")}
            error={!!errors.formName}
            helperText={errors?.formName ? errors.formName.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="finalPlotNo" />}
            label="Final plot no"
            variant="standard"
            {...register("formDTLDao.finalPlotNo")}
            error={!!errors.finalPlotNo}
            helperText={errors?.finalPlotNo ? errors.finalPlotNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="finalPlotNo" />}
            label="Plot Area In Square Meter"
            variant="standard"
            {...register("formDTLDao.plotAreaSquareMeter")}
            error={!!errors.plotAreaSquareMeter}
            helperText={
              errors?.plotAreaSquareMeter
                ? errors.plotAreaSquareMeter.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="finalPlotNo" />}
            label="Construction Area In Square Meter"
            variant="standard"
            {...register("formDTLDao.constructionAreSqMeter")}
            error={!!errors.constructionAreSqMeter}
            helperText={
              errors?.constructionAreSqMeter
                ? errors.constructionAreSqMeter.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="finalPlotNo" />}
            label="No. of Approched Road"
            variant="standard"
            {...register("formDTLDao.noOfApprochedRoad")}
            error={!!errors.noOfApprochedRoad}
            helperText={
              errors?.noOfApprochedRoad
                ? errors.noOfApprochedRoad.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="highTensionLine" />}
            variant="standard"
            {...register("formDTLDao.highTensionLine")}
            error={!!errors.highTensionLine}
            helperText={
              errors?.highTensionLine ? errors.highTensionLine.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl sx={{ width: "80%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="previouslyAnyFireNocTaken" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  name="previouslyAnyFireNocTaken"
                  fullWidth
                  size="small"
                  variant="standard"
                >
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={2}>No</MenuItem>
                  <MenuItem value={3}>Revised</MenuItem>
                </Select>
              )}
              name="formDTLDao.previouslyAnyFireNocTaken"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={
              <FormattedLabel id="underTheGroundWaterTankCapacityLighter" />
            }
            variant="standard"
            {...register("formDTLDao.underTheGroundWaterTankCapacityLitre")}
            error={!!errors.underTheGroundWaterTankCapacityLitre}
            helperText={
              errors?.underTheGroundWaterTankCapacityLitre
                ? errors.underTheGroundWaterTankCapacityLitre.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            variant="standard"
            sx={{ width: "80%" }}
            error={!!errors.businessType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* {<FormattedLabel id="typeOfBuilding" />} */}
              Access road Width
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="List"
                  error={!!errors.typeOfBuilding}
                  helperText={
                    errors?.typeOfBuilding
                      ? errors.typeOfBuilding.message
                      : null
                  }
                >
                  {roadWidth &&
                    roadWidth.map((type, index) => (
                      <MenuItem key={index} value={type.id}>
                        {type.accessWidth}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="formDTLDao.accessRoadWidth"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.typeOfBuilding ? errors.typeOfBuilding.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="revenueSurveyNo" />}
            variant="standard"
            {...register("formDTLDao.revenueSurveyNo")}
            error={!!errors.revenueSurveyNo}
            helperText={
              errors?.revenueSurveyNo ? errors.revenueSurveyNo.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="blockNo" />}
            variant="standard"
            {...register("formDTLDao.blockNo")}
            error={!!errors.blockNo}
            helperText={errors?.blockNo ? errors.blockNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="opNo" />}
            label="dp op no"
            variant="standard"
            {...register("formDTLDao.dpOpNo")}
            error={!!errors.dpOpNo}
            helperText={errors?.dpOpNo ? errors.dpOpNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="citySurveyNo" />}
            label="Site Address"
            variant="standard"
            {...register("formDTLDao.siteAddress")}
            error={!!errors.siteAddress}
            helperText={errors?.siteAddress ? errors.siteAddress.message : null}
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>

      <Grid item xs={12} sx={{ margin: "6%" }}>
        <div>
          <form>
            <Box>
              {isOpenProperty && (
                <Slide
                  direction="down"
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  <div>
                    <>
                      <form>
                        <Box
                          style={{
                            margin: "4%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            // paddingBottom: "20%",
                          }}
                        >
                          <Paper
                            sx={{
                              margin: 1,
                              padding: 2,
                              backgroundColor: "#F5F5F5",
                            }}
                            elevation={5}
                          >
                            <Box className={styles.tableHead}>
                              <Box className={styles.feildHead}>
                                {btnSaveText == "Update"
                                  ? //   <FormattedLabel id="updateNocName" />
                                    "Update Property Details"
                                  : //   <FormattedLabel id="addNocName" />
                                    "Property Details"}
                              </Box>
                            </Box>
                            <br />
                            <Grid
                              container
                              columns={{ xs: 4, sm: 8, md: 12 }}
                              className={styles.feildres}
                            >
                              <Grid item xs={4} className={styles.feildres}>
                                <TextField
                                  // disabled={viewButtonInputState}
                                  // disabled={viewButtonInputState}
                                  disabled={readOnly}
                                  sx={{ width: "80%" }}
                                  id="standard-basic"
                                  label="Property No."
                                  variant="standard"
                                  {...register("propertyNo")}
                                  error={!!errors.volumeLBHIn}
                                  helperText={
                                    errors?.volumeLBHIn
                                      ? errors.volumeLBHIn.message
                                      : null
                                  }
                                />
                              </Grid>
                              {/* 
                            <Grid item xs={4} className={styles.feildres}>
                              <TextField
  disabled={readOnly}
                                sx={{ width: "80%" }}
                                id="standard-basic"
                                label="B"
                                variant="standard"
                                {...register("breadth")}
                                error={!!errors.volumeLBHIn}
                                helperText={
                                  errors?.volumeLBHIn
                                    ? errors.volumeLBHIn.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid item xs={4} className={styles.feildres}>
                              <TextField
  disabled={readOnly}
                                sx={{ width: "80%" }}
                                id="standard-basic"
                                label="height"
                                variant="standard"
                                {...register("height")}
                                error={!!errors.volumeLBHIn}
                                helperText={
                                  errors?.volumeLBHIn
                                    ? errors.volumeLBHIn.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid item xs={4} className={styles.feildres}>
                              <TextField
  disabled={readOnly}
                                sx={{ width: "80%" }}
                                id="standard-basic"
                                label="Capacity"
                                variant="standard"
                                {...register("capacity")}
                                error={!!errors.volumeLBHIn}
                                helperText={
                                  errors?.volumeLBHIn
                                    ? errors.volumeLBHIn.message
                                    : null
                                }
                              />
                            </Grid> */}
                              <Grid
                                item
                                xs={4}
                                className={styles.feildres}
                              ></Grid>
                              <Grid
                                item
                                xs={4}
                                className={styles.feildres}
                              ></Grid>

                              {/* <Grid item xs={4} className={styles.feildres}>
                                <TextField
  disabled={readOnly}
  sx={{width: "80%"}}
                                id="standard-basic"
                                label="Ventilation"
                                variant="standard"
                                {...register("volumeLBHIn")}
                                error={!!errors.volumeLBHIn}
                                helperText={
                                  errors?.volumeLBHIn
                                    ? errors.volumeLBHIn.message
                                    : null
                                }
                              />
                            </Grid> */}
                              {/* <Grid item xs={4} className={styles.feildres}>
                                <TextField
  disabled={readOnly}
  sx={{width: "80%"}}
                                id="standard-basic"
                                label="Occupancy Type"
                                variant="standard"
                                {...register("volumeLBHIn")}
                                error={!!errors.volumeLBHIn}
                                helperText={
                                  errors?.volumeLBHIn
                                    ? errors.volumeLBHIn.message
                                    : null
                                }
                              />
                            </Grid> */}
                            </Grid>
                            {/* <Grid item xs={4} className={styles.feildres}>
                              <TextField
  disabled={readOnly}
  sx={{width: "80%"}}
                              id="standard-basic"
                              label="Building Classification"
                              variant="standard"
                              {...register("volumeLBHIn")}
                              error={!!errors.volumeLBHIn}
                              helperText={
                                errors?.volumeLBHIn
                                  ? errors.volumeLBHIn.message
                                  : null
                              }
                            />
                          </Grid> */}
                            <br />
                            <br />

                            <div></div>

                            <Grid
                              container
                              className={styles.feildres}
                              spacing={2}
                            >
                              <Grid item>
                                {!viewButtonInputState && (
                                  <Button
                                    // type="submit"
                                    size="small"
                                    variant="outlined"
                                    className={styles.button}
                                    endIcon={<SaveIcon />}
                                    onClick={() => {
                                      // alert("gfcgfcgfc");

                                      savePropertyDetails();
                                      // saveTankDetails();
                                      // setButtonInputState(false);
                                      // setIsOpenWaterTank(false);
                                      // setFetchData(tempData);
                                      // setEditButtonInputState(false);
                                      // setDeleteButtonState(false);
                                      // setIsOpenWaterTank(isOpenWaterTank);
                                    }}
                                  >
                                    {btnSaveText == "Update" ? (
                                      <FormattedLabel id="update" />
                                    ) : (
                                      <FormattedLabel id="save" />
                                      // "SAVE Property No."
                                    )}
                                  </Button>
                                )}
                              </Grid>
                              <Grid item>
                                {!viewButtonInputState && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    className={styles.button}
                                    endIcon={<ClearIcon />}
                                    onClick={() => cancellButton()}
                                  >
                                    {<FormattedLabel id="clear" />}
                                  </Button>
                                )}
                              </Grid>
                              <Grid item>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  className={styles.button}
                                  endIcon={<ExitToAppIcon />}
                                  onClick={() => exitFunction()}
                                  // onClick={() =>
                                  //   router.push({
                                  //     pathname:
                                  //       "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
                                  //   })
                                  // }
                                >
                                  {<FormattedLabel id="exit" />}
                                </Button>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Box>
                      </form>
                    </>
                  </div>
                </Slide>
              )}

              <Box
                style={{
                  display: "flex",
                  // marginTop: "5%",
                }}
              >
                <Box className={styles.tableHead}>
                  <Box className={styles.h1Tag}>
                    {/* {<FormattedLabel id="typeOfNocTitle" />} */}
                    Property Details
                  </Box>
                </Box>
                {!view && (
                  <Box>
                    <Button
                      variant="contained"
                      type="primary"
                      disabled={buttonInputState}
                      onClick={() => {
                        reset({
                          ...resetValuesExit,
                        });
                        setEditButtonInputState(true);
                        setDeleteButtonState(true);
                        setBtnSaveText("Save");
                        setButtonInputStates(true);
                        setSlideChecked(true);
                        setIsOpenProperty(true);
                      }}
                      className={styles.adbtn}
                      sx={{
                        borderRadius: 100,

                        padding: 2,
                        marginLeft: 1,
                        textAlign: "center",
                        border: "2px solid #3498DB",
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                )}
              </Box>
              <Box>
                {/* /////// */}
                <DataGrid
                  getRowId={(row) => row.srNo}
                  disableColumnFilter
                  disableColumnSelector
                  disableExport
                  // disableToolbarButton
                  // disableDensitySelector
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      printOptions: { disableToolbarButton: true },
                      // disableExport: true,
                      // disableToolbarButton: true,
                      csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  autoHeight
                  density="compact"
                  sx={{
                    backgroundColor: "white",
                    paddingLeft: "2%",
                    paddingRight: "2%",
                    boxShadow: 2,
                    border: 1,
                    borderColor: "primary.light",
                    "& .MuiDataGrid-cell:hover": {
                      // transform: "scale(1.1)",
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "#E1FDFF",
                    },
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#87E9F7",
                    },
                  }}
                  rows={dataSourcee}
                  columns={columnss}
                  pageSize={7}
                  rowsPerPageOptions={[7]}
                />
              </Box>
            </Box>
          </form>
        </div>
      </Grid>

      <Grid item xs={4} sx={{ margin: "6%" }}>
        {/* <FormattedLabel id="buildingUse" /> */}

        {/* <FormGroup>
          <FormControlLabel
            value="on"
            // label={<FormattedLabel id="residentialUse" />}
            label="Is Plan have Common Underground Water Tank"
            control={<Checkbox />}
            onChange={(value) => {
              console.log("water tank value", value.target.value);
              // field.onChange(value);
              setTank(value.target.value);
            }}
          />
        </FormGroup> */}

        <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
          <FormLabel component="legend">
            Is Plan have Common Underground Water Tank
          </FormLabel>
          <Controller
            rules={{ required: true }}
            control={control}
            name="formDTLDao.isPlanhaveUnderGroundWaterTank"
            render={({ field }) => (
              <RadioGroup {...field}>
                <FormControlLabel
                  value="Y"
                  control={<Radio />}
                  label="Yes"
                  // setSlipHandedOverTo(value.target.value);
                  onChange={(value) => {
                    console.log("value", value.target.value);
                    // field.onChange(value);
                    setTank(value.target.value);
                  }}
                />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="No"
                  onChange={(value) => {
                    console.log("value", value.target.value);
                    // field.onChange(value);
                    setTank(value.target.value);
                  }}
                />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>

      {tank == "Y" && (
        <div>
          <form>
            <Box>
              {isOpenWaterTank && (
                <Slide
                  direction="down"
                  in={slideCheckedT}
                  mountOnEnter
                  unmountOnExit
                >
                  <div>
                    <>
                      <form>
                        <Box
                          style={{
                            margin: "4%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            // paddingBottom: "20%",
                          }}
                        >
                          <Paper
                            sx={{
                              margin: 1,
                              padding: 2,
                              backgroundColor: "#F5F5F5",
                            }}
                            elevation={5}
                          >
                            <Box className={styles.tableHead}>
                              <Box className={styles.feildHead}>
                                {btnSaveText == "Update"
                                  ? //   <FormattedLabel id="updateNocName" />
                                    "Update Floor Details"
                                  : //   <FormattedLabel id="addNocName" />
                                    " Tank Details"}
                              </Box>
                            </Box>
                            <br />
                            <Grid
                              container
                              columns={{ xs: 4, sm: 8, md: 12 }}
                              className={styles.feildres}
                            >
                              <Grid item xs={4} className={styles.feildres}>
                                <TextField
                                  disabled={(viewButtonInputStateT, readOnly)}
                                  // disabled={readOnly}
                                  sx={{ width: "80%" }}
                                  id="standard-basic"
                                  label="L"
                                  variant="standard"
                                  {...register("length")}
                                  error={!!errors.volumeLBHIn}
                                  helperText={
                                    errors?.volumeLBHIn
                                      ? errors.volumeLBHIn.message
                                      : null
                                  }
                                />
                              </Grid>

                              <Grid item xs={4} className={styles.feildres}>
                                <TextField
                                  disabled={(viewButtonInputStateT, readOnly)}
                                  // disabled={readOnly}
                                  sx={{ width: "80%" }}
                                  id="standard-basic"
                                  label="B"
                                  variant="standard"
                                  {...register("breadth")}
                                  error={!!errors.volumeLBHIn}
                                  helperText={
                                    errors?.volumeLBHIn
                                      ? errors.volumeLBHIn.message
                                      : null
                                  }
                                />
                              </Grid>
                              <Grid item xs={4} className={styles.feildres}>
                                <TextField
                                  disabled={(viewButtonInputStateT, readOnly)}
                                  // disabled={readOnly}
                                  sx={{ width: "80%" }}
                                  id="standard-basic"
                                  label="height"
                                  variant="standard"
                                  {...register("height")}
                                  error={!!errors.volumeLBHIn}
                                  helperText={
                                    errors?.volumeLBHIn
                                      ? errors.volumeLBHIn.message
                                      : null
                                  }
                                />
                              </Grid>
                              <Grid item xs={4} className={styles.feildres}>
                                <TextField
                                  disabled={(viewButtonInputStateT, readOnly)}
                                  // disabled={readOnly}

                                  sx={{ width: "80%" }}
                                  id="standard-basic"
                                  label="Capacity"
                                  variant="standard"
                                  {...register("capacity")}
                                  error={!!errors.volumeLBHIn}
                                  helperText={
                                    errors?.volumeLBHIn
                                      ? errors.volumeLBHIn.message
                                      : null
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                className={styles.feildres}
                              ></Grid>
                              <Grid
                                item
                                xs={4}
                                className={styles.feildres}
                              ></Grid>

                              {/* <Grid item xs={4} className={styles.feildres}>
                                <TextField
  disabled={readOnly}
  sx={{width: "80%"}}
                                id="standard-basic"
                                label="Ventilation"
                                variant="standard"
                                {...register("volumeLBHIn")}
                                error={!!errors.volumeLBHIn}
                                helperText={
                                  errors?.volumeLBHIn
                                    ? errors.volumeLBHIn.message
                                    : null
                                }
                              />
                            </Grid> */}
                              {/* <Grid item xs={4} className={styles.feildres}>
                                <TextField
  disabled={readOnly}
  sx={{width: "80%"}}
                                id="standard-basic"
                                label="Occupancy Type"
                                variant="standard"
                                {...register("volumeLBHIn")}
                                error={!!errors.volumeLBHIn}
                                helperText={
                                  errors?.volumeLBHIn
                                    ? errors.volumeLBHIn.message
                                    : null
                                }
                              />
                            </Grid> */}
                            </Grid>
                            {/* <Grid item xs={4} className={styles.feildres}>
                              <TextField
  disabled={readOnly}
  sx={{width: "80%"}}
                              id="standard-basic"
                              label="Building Classification"
                              variant="standard"
                              {...register("volumeLBHIn")}
                              error={!!errors.volumeLBHIn}
                              helperText={
                                errors?.volumeLBHIn
                                  ? errors.volumeLBHIn.message
                                  : null
                              }
                            />
                          </Grid> */}
                            <br />
                            <br />

                            <div></div>

                            <Grid
                              container
                              className={styles.feildres}
                              spacing={2}
                            >
                              <Grid item>
                                <Button
                                  // type="submit"
                                  size="small"
                                  variant="outlined"
                                  className={styles.button}
                                  endIcon={<SaveIcon />}
                                  onClick={() => {
                                    // alert("hgvhgfvhg");
                                    saveTankDetails();
                                    // setButtonInputState(false);
                                    // setIsOpenWaterTank(false);
                                    // setFetchData(tempData);
                                    // setEditButtonInputState(false);
                                    // setDeleteButtonState(false);
                                    // setIsOpenWaterTank(isOpenWaterTank);
                                  }}
                                >
                                  {btnSaveText == "Update" ? (
                                    <FormattedLabel id="update" />
                                  ) : (
                                    <FormattedLabel id="save" />
                                  )}
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  className={styles.button}
                                  endIcon={<ClearIcon />}
                                  onClick={() => cancellButton()}
                                >
                                  {<FormattedLabel id="clear" />}
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  className={styles.button}
                                  endIcon={<ExitToAppIcon />}
                                  onClick={() => exitFunctionT()}
                                  // onClick={() =>
                                  //   router.push({
                                  //     pathname:
                                  //       "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
                                  //   })
                                  // }
                                >
                                  {<FormattedLabel id="exit" />}
                                </Button>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Box>
                      </form>
                    </>
                  </div>
                </Slide>
              )}

              <Box style={{ display: "flex", marginTop: "5%" }}>
                <Box className={styles.tableHead}>
                  <Box className={styles.h1Tag}>
                    {/* {<FormattedLabel id="typeOfNocTitle" />} */}
                    Tank Details
                  </Box>
                </Box>
                {!view && (
                  <Box>
                    <Button
                      variant="contained"
                      type="primary"
                      disabled={buttonInputStateT}
                      onClick={() => {
                        reset({
                          ...resetValuesExit,
                        });
                        setEditButtonInputState(true);
                        setDeleteButtonState(true);
                        setBtnSaveText("Save");
                        setButtonInputStateT(true);
                        setSlideCheckedT(true);
                        setIsOpenWaterTank(true);
                        // setIsOpenProperty(!isOpenProperty);
                      }}
                      className={styles.adbtn}
                      sx={{
                        borderRadius: 100,

                        padding: 2,
                        marginLeft: 1,
                        textAlign: "center",
                        border: "2px solid #3498DB",
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                )}
              </Box>
              <Box>
                <DataGrid
                  getRowId={(row) => row.srNo}
                  disableColumnFilter
                  disableColumnSelector
                  disableExport
                  // disableToolbarButton
                  // disableDensitySelector
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      printOptions: { disableToolbarButton: true },
                      // disableExport: true,
                      // disableToolbarButton: true,
                      csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  autoHeight
                  density="compact"
                  sx={{
                    backgroundColor: "white",
                    paddingLeft: "2%",
                    paddingRight: "2%",
                    boxShadow: 2,
                    border: 1,
                    borderColor: "primary.light",
                    "& .MuiDataGrid-cell:hover": {
                      // transform: "scale(1.1)",
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "#E1FDFF",
                    },
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#87E9F7",
                    },
                  }}
                  rows={dataSource}
                  columns={columns}
                  pageSize={7}
                  rowsPerPageOptions={[7]}
                />
              </Box>
            </Box>
          </form>
        </div>
      )}

      <br />
      <br />
      <br />
    </>
  );
};

export default FormsDetails;
