import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Paper, Slide, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../URLS/urls";
import { Visibility } from "@mui/icons-material";

const Index = ({ view = false }) => {
  const router = useRouter();

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // const [slideCheckeddd, setSlideCheckeddd] = useState(false);
  // const [deleteButtonStateee, setDeleteButtonStateee] = useState(false);
  // const [editButtonInputStateee, setEditButtonInputStateee] = useState(false);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [id, setID] = useState();

  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [slideCheckedF, setSlideCheckedF] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);

  const [viewButtonInputStateB, setViewButtonInputStateB] = useState(false);

  const [buildingTypes, setBuildingTypes] = useState([]);
  const [roadWidth, setRoadWidth] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  const [buildingDataSource, setBuildingDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [isOpenCollapses, setIsOpenCollapses] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [buttonInputStates, setButtonInputStates] = useState();

  useEffect(() => {
    // getData();
    if (getValues("buildingDTLDao")?.length > 0) {
      setBuildingDataSource(getValues("buildingDTLDao"));
    }
    getArea();
    getBuildingTypes();
    // getRoadWidth();
  }, [fetchData]);

  // Get Table - Data
  // const getData = () => {
  //   axios
  //     .get(`${urls.FbsURL}/typeOfNOCMaster/getTypeOfNOCMasterData`)
  //     .then((res) => {
  //       setDataSource(res.data);
  //       console.log("data", res.data);
  //     });
  // };
  // get Building Type
  // const getRoadWidth = () => {
  //   axios
  //     .get(`${urls.FbsURL}/master/accessRoadWidth/getAll`)
  //     .then((res) => {
  //       setRoadWidth(res?.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // get Building Type
  const saveBuildingDetails = () => {
    // cnt = cnt + 1;
    // console.log("Form Data ", fromData);

    const buildingDTLDao = [
      ...getValues("buildingDTLDao")?.filter((r, i) => i != 0),
      {
        ...getValues("buildingDTLDao")[0],
        buildingName: getValues("buildingName"),
        buildingHeightFromGroundFloorInMeter: getValues(
          "buildingHeightFromGroundFloorInMeter"
        ),
        noOfBasement: getValues("noOfBasement"),
        volumeLBHIn: getValues("volumeLBHIn"),
        noOfFloor: getValues("noOfFloor"),
        plotAreaSquareMeter: getValues("plotAreaSquareMeter"),
        constructionAreSqMeter: getValues("constructionAreSqMeter"),
        noOfApprochedRoad: getValues("noOfApprochedRoad"),
        mstZones: getValues("mstZones"),
        l: getValues("l"),
        b: getValues("b"),
        buildingHeightH1: getValues("buildingHeightH1"),
        buildingHeightH2: getValues("buildingHeightH2"),
        typeOfBuilding: getValues("typeOfBuilding"),
        buildingIsSpecial: getValues("buildingIsSpecial"),
        front: getValues("front"),
        rear: getValues("rear"),
        leftSide: getValues("leftSide"),
        rightSide: getValues("rightSide"),
        siteAddress: getValues("siteAddress"),
      },
    ];
    // const buildingDTLDao = {
    // srNo: cnt,
    // id: Number(getValues("buildingDTLDao.id")),

    // };

    // console.log("nocid==", getValues("nocId"));
    // const buildingDTLDao = {
    //   id: getValues("id"),
    //   id: getValues("buildingDTLId"),
    //   floorDTLDao: [...dataSource, floorDTLDao],
    // };
    // setDataSource([...dataSource, underGroundWaterTankDao]);

    const body = {
      ...getValues("prevData"),
      id: Number(localStorage.getItem("pNocId")),
      buildingDTLDao,
    };

    console.log("NOC CHA ID", getValues("nocId"));

    console.log("Building Details", body);

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
              // console.log("ooooo", res.data);
              // console.log("Floor Details", res.data.buildingDTLDao.floorDTLDao);
              // console.log("231297", res?.data);
              // reset(res.data);
              setBuildingDataSource(
                res?.data?.buildingDTLDao?.map((b, i) => {
                  return {
                    srNo: i + 1,
                    ...b,
                  };
                })
              );
              setValue("prevData", res.data);
              setValue("id", res.data.id);
              setValue("applicantDTLDao", res.data.applicantDTLDao);
              setValue("ownerDTLDao", res.data.ownerDTLDao);
              setValue("formDTLDao", res.data.formDTLDao);
              setValue("buildingDTLDao", res.data.buildingDTLDao);
              setValue("attachments", res.data.attachments);
              // setValue("formId", res.data.formDTLDao.id);
              // setValue("formDTLDao", res.data.formDTLDao);
              // setValue(
              //   "formDTLDao.underGroundWaterTankDao",
              //   formDTLDao.underGroundWaterTankDao
              // );
              // setValue("applicantDTLDao", res.data.applicantDTLDao);
            });
          // appId=res?.data?.message?.split("$")[1],
          // fromData.id
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          // : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);

          // setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          // resetValuesOnSave();
        }
      });
  };

  const saveFloorDetails = () => {
    // cnt = cnt + 1;
    // console.log("Form Data ", fromData);
    // console.log("nocid==", getValues("nocId"));
    // const buildingDTLDao = {
    // id: getValues("id"),
    // id: getValues("buildingDTLId"),
    // };
    // setDataSource([...dataSource, underGroundWaterTankDao]);

    const floorDTLDao = {
      floorHeight: getValues("floorHeight"),
      buildingClassification: getValues("buildingClassification"),
      occupancyTypes: getValues("occupancyTypes"),
      noOfVentilation: getValues("noOfVentilation"),
      grossBuiltUpArea: getValues("grossBuiltUpArea"),
      netBuiltUpArea: getValues("netBuiltUpArea"),
    };

    const buildingDTLDao = {
      ...getValues("buildingDTLDao"),
      floorDTLDao: [...dataSource, floorDTLDao],
    };

    const body = {
      ...getValues("prevData"),
      id: Number(localStorage.getItem("pNocId")),
      buildingDTLDao: [...buildingDataSource, buildingDTLDao],
    };

    console.log("NOC CHA ID", getValues("nocId"));
    console.log("6666", buildingDTLDao);

    console.log("Building Details123", body);

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
              // console.log("res", res.data);
              // console.log("ooooo", res.data);
              // console.log("Floor Details", res.data.buildingDTLDao.floorDTLDao);
              // console.log("231297", res?.data);

              // reset(res.data);
              setDataSource(
                res?.data?.buildingDTLDao[0]?.floorDTLDao?.map((f, i) => {
                  return {
                    srNo: i + 1,
                    ...f,
                  };
                })
              );
              setValue("prevData", res.data);
              setValue("id", res.data.id);
              setValue("ownerDTLDao", res.data.ownerDTLDao);
              setValue("formDTLDao", res.data.formDTLDao);
              setValue("formId", res.data.formDTLDao.id);
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
          setButtonInputStates(false);
          setIsOpenCollapses(false);
          // setIsOpenCollapse(false);
          setFetchData(tempData);
          // setEditButtonInputStates(false);
          // setDeleteButtonStates(false);
          // resetValuesOnSave();
        }
      });
  };
  const getBuildingTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBuildingMaster/getTypeOfBuildingMaster`)
      .then((res) => {
        setBuildingTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };

  const [area, setArea] = useState();

  const getArea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`)
      .then((res) => setArea(res?.data?.area))
      .catch((err) => console.log(err));
  };

  // const saveBuilding = () => {
  //   // console.log("Form Data ", fromData);
  //   const ownerDTLDao = {
  //     ownerName: getValues("ownerName"),
  //     ownerNameMr: getValues("ownerNameMr"),
  //     ownerMiddleName: getValues("ownerMiddleName"),
  //     ownerLastName: getValues("ownerLastName"),
  //     ownerMiddleNameMr: getValues("ownerMiddleNameMr"),
  //     ownerLastNameMr: getValues("ownerLastNameMr"),
  //     ownerMobileNo: getValues("ownerMobileNo"),
  //     ownerEmailId: getValues("ownerEmailId"),
  //   };
  // };

  // const onSubmitForm = (fromData) => {
  //   console.log("Form Data ", fromData);
  //   const tempData = axios
  //     .post(`${urls.BaseURL}/typeOfNOCMaster/saveTypeOfNOCMaster`, fromData)
  //     .then((res) => {
  //       if (res.status == 201) {
  //         fromData.id
  //           ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setFetchData(tempData);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };

  // const onSubmitForm = (fromData) => {
  //   console.log("Form Data ", fromData);
  //   const tempData = axios
  //     .post(`${urls.FbsURL}/typeOfNOCMaster/saveTypeOfNOCMaster`, fromData)
  //     .then((res) => {
  //       if (res.status == 201) {
  //         fromData.id
  //           ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setFetchData(tempData);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };

  // const onSubmitForms = (fromData) => {
  //   console.log("Form Data ", fromData);
  //   const tempData = axios
  //     .post(`${urls.FbsURL}/typeOfNOCMaster/saveTypeOfNOCMaster`, fromData)
  //     .then((res) => {
  //       if (res.status == 201) {
  //         fromData.id
  //           ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         setButtonInputStates(false);
  //         setIsOpenCollapses(false);
  //         setFetchData(tempData);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };

  const exitFunction = () => {
    setButtonInputState(false);
    setIsOpenCollapse(false);
    // setFetchData(tempData);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    // setIsOpenCollapse(!isOpenCollapse);
    setSlideChecked(true);
  };

  const exitFunctionForFloor = () => {
    // alert("hgvg");
    setButtonInputStates(false);
    setIsOpenCollapses(false);
    setSlideCheckedF(true);
    // setButtonInputStateee(false);
    // setIsOpenCollapseee(false);
    // // setFetchData(tempData);
    // setEditButtonInputStateee(false);
    // setDeleteButtonStateee(false);
    // // setIsOpenCollapse(!isOpenCollapse);
    // setSlideCheckeddd(true);
  };

  // Delete By ID
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios
          .delete(
            `${urls.BaseURL}/typeOfNOCMaster/discardTypeOfNOCMaster/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
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
    nOCName: "",
    nOCNameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    nOCName: "",
    nOCNameMr: "",
  };

  const columnsF = [
    {
      field: "srNo",
      headerName: "Sr No.",
      // headerName: <FormattedLabel id="nOCName" />,
      flex: 1,
    },
    {
      field: "floorHeight",
      headerName: "Floor Height",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "netBuiltUpArea",
      headerName: "net BuiltUp Area",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "grossBuiltUpArea",
      headerName: "Gross BuiltUp Area",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },

    {
      field: "noOfVentilation",
      headerName: "No. Of Ventilation",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "occupancyTypes",
      headerName: "Occupancy Types",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "buildingClassification",
      headerName: "Building Classification",
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
                setIsOpenCollapse(false),
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
                  setIsOpenCollapse(false),
                    setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
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

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      // headerName: <FormattedLabel id="nOCName" />,
      flex: 1,
    },
    {
      field: "buildingName",
      headerName: "Building Name",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "siteAddress",
      headerName: "Site Address",
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
              disabled={viewButtonInputStateB}
              onClick={() => {
                setIsOpenCollapse(false),
                  // setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setViewButtonInputStateB(true);
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
                  setIsOpenCollapse(false),
                    setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
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

  // Row

  return (
    <>
      <Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider>
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
                            ? // <FormattedLabel id="updateNocName" />
                              "Update Buliding Details"
                            : // <FormattedLabel id="addNocName" />
                              "Buliding Details"}
                        </Box>
                      </Box>

                      <Grid
                        container
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        className={styles.feildres}
                      >
                        {/* Building Fields */}
                        <Grid
                          container
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          className={styles.feildres}
                        >
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              //   label={<FormattedLabel id="b" />}
                              label="Building Name"
                              variant="standard"
                              {...register("buildingName")}
                              error={!!errors.b}
                              helperText={errors?.b ? errors.b.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="buildingHeightFromGroundFloorInMeter" />
                              }
                              variant="standard"
                              {...register(
                                "buildingHeightFromGroundFloorInMeter"
                              )}
                              error={
                                !!errors.buildingHeightFromGroundFloorInMeter
                              }
                              helperText={
                                errors?.buildingHeightFromGroundFloorInMeter
                                  ? errors.buildingHeightFromGroundFloorInMeter
                                      .message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="noOfBasement" />}
                              variant="standard"
                              {...register("noOfBasement")}
                              error={!!errors.noOfBasement}
                              helperText={
                                errors?.noOfBasement
                                  ? errors.noOfBasement.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="volumeLBHIn" />}
                              variant="standard"
                              {...register("volumeLBHIn")}
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
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="totalBuildingFloor" />}
                              variant="standard"
                              {...register("noOfFloor")}
                              error={!!errors.totalBuildingFloor}
                              helperText={
                                errors?.totalBuildingFloor
                                  ? errors.totalBuildingFloor.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="basementAreaInsquareMeter" />
                              }
                              variant="standard"
                              {...register("basementAreaInsquareMeter")}
                              error={!!errors.basementAreaInsquareMeter}
                              helperText={
                                errors?.basementAreaInsquareMeter
                                  ? errors.basementAreaInsquareMeter.message
                                  : null
                              }
                            />
                          </Grid>
                          {/* <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="noOfVentilation" />}
                              variant="standard"
                              {...register("noOfVentilation")}
                              error={!!errors.noOfVentilation}
                              helperText={
                                errors?.noOfVentilation
                                  ? errors.noOfVentilation.message
                                  : null
                              }
                            />
                          </Grid> */}
                        </Grid>
                        <Grid
                          container
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          className={styles.feildres}
                        >
                          {/* <Grid item xs={4} className={styles.feildres}>
                            <TextField
    sx={{width: "80%"}}                     id="standard-basic"
                              label={<FormattedLabel id="noOfTowers" />}
                              variant="standard"
                              {...register("noOfTowers")}
                              error={!!errors.noOfTowers}
                              helperText={
                                errors?.noOfTowers
                                  ? errors.noOfTowers.message
                                  : null
                              }
                            />
                          </Grid> */}
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="plotAreaSquareMeter" />
                              }
                              variant="standard"
                              {...register("plotAreaSquareMeter")}
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
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="constructionAreSqMeter" />
                              }
                              variant="standard"
                              {...register("constructionAreSqMeter")}
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
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="noOfApprochedRoad" />}
                              variant="standard"
                              {...register("noOfApprochedRoad")}
                              error={!!errors.noOfApprochedRoad}
                              helperText={
                                errors?.noOfApprochedRoad
                                  ? errors.noOfApprochedRoad.message
                                  : null
                              }
                            />
                          </Grid>
                          {/* <Grid item xs={4} className={styles.feildres}>
                            <FormControl sx={{ width: "80%" }}>
                              <InputLabel
                                variant="standard"
                                htmlFor="uncontrolled-native"
                              >
                                {<FormattedLabel id="drawingProvided" />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                  >
                                    <MenuItem value={10}>Yes</MenuItem>
                                    <MenuItem value={20}>No</MenuItem>
                                  </Select>
                                )}
                                name="drawingProvided"
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid> */}

                          {/* <Grid item xs={4} className={styles.feildres}>
                            <FormControl
                              fullWidth
                              size="small"
                              variant="standard"
                              sx={{ width: "80%" }}
                            >
                              <InputLabel
                                variant="standard"
                                htmlFor="uncontrolled-native"
                              >
                                {<FormattedLabel id="siteAddress" />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                  >
                                    <MenuItem value={10}>Yes</MenuItem>
                                    <MenuItem value={20}>No</MenuItem>
                                  </Select>
                                )}
                                name="siteAddress"
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid> */}
                          {/* <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="highTensionLine" />}
                              variant="standard"
                              {...register("highTensionLine")}
                              error={!!errors.highTensionLine}
                              helperText={
                                errors?.highTensionLine
                                  ? errors.highTensionLine.message
                                  : null
                              }
                            />
                          </Grid> */}
                        </Grid>
                        <Grid
                          container
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          className={styles.feildres}
                        >
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl
                              fullWidth
                              size="small"
                              variant="standard"
                              sx={{ width: "80%" }}
                              error={!!errors.areaZone}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {<FormattedLabel id="areaZone" />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    name="areaZone"
                                    label="Select-Service Name"
                                  >
                                    {area &&
                                      area.map((a, index) => (
                                        <MenuItem key={index} value={a.id}>
                                          {a.areaName}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="mstZones"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.areaZone
                                  ? errors.areaZone.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>

                          {/* <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="underTheGroundWaterTankCapacityLighter" />
                              }
                              variant="standard"
                              {...register(
                                "underTheGroundWaterTankCapacityLighter"
                              )}
                              error={
                                !!errors.underTheGroundWaterTankCapacityLighter
                              }
                              helperText={
                                errors?.underTheGroundWaterTankCapacityLighter
                                  ? errors
                                      .underTheGroundWaterTankCapacityLighter
                                      .message
                                  : null
                              }
                            />
                          </Grid> */}
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="l" />}
                              variant="standard"
                              {...register("l")}
                              error={!!errors.l}
                              helperText={errors?.l ? errors.l.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="b" />}
                              variant="standard"
                              {...register("b")}
                              error={!!errors.b}
                              helperText={errors?.b ? errors.b.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              //   label={<FormattedLabel id="h" />}
                              label="h1"
                              variant="standard"
                              {...register("buildingHeightH1")}
                              error={!!errors.h}
                              helperText={errors?.h ? errors.h.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              //   label={<FormattedLabel id="h" />}
                              label="h2"
                              variant="standard"
                              {...register("buildingHeightH2")}
                              error={!!errors.h}
                              helperText={errors?.h ? errors.h.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "80%" }}
                              error={!!errors.businessType}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {<FormattedLabel id="typeOfBuilding" />}
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
                                    {buildingTypes &&
                                      buildingTypes.map((type, index) => (
                                        <MenuItem key={index} value={type.id}>
                                          {type.typeOfBuilding}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="typeOfBuilding"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.typeOfBuilding
                                  ? errors.typeOfBuilding.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/* <Grid item xs={4} className={styles.feildres}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "80%" }}
                              error={!!errors.businessType}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
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
                                          {type.roadWidth}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="roadWidth"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.typeOfBuilding
                                  ? errors.typeOfBuilding.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid> */}
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl sx={{ width: "80%" }}>
                              <InputLabel
                                variant="standard"
                                htmlFor="uncontrolled-native"
                              >
                                {/* {<FormattedLabel id="drawingProvided" />} */}
                                Building is Special or Not
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                  >
                                    <MenuItem value={10}>Yes</MenuItem>
                                    <MenuItem value={20}>No</MenuItem>
                                  </Select>
                                )}
                                name="buildingIsSpecial"
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              //   label={<FormattedLabel id="b" />}
                              label="Margin(Front)"
                              variant="standard"
                              {...register("front")}
                              error={!!errors.b}
                              helperText={errors?.b ? errors.b.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              //   label={<FormattedLabel id="b" />}
                              label="Margin(Rear)"
                              variant="standard"
                              {...register("rear")}
                              error={!!errors.b}
                              helperText={errors?.b ? errors.b.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              //   label={<FormattedLabel id="b" />}
                              label="Margin(Left Side)"
                              variant="standard"
                              {...register("leftSide")}
                              error={!!errors.b}
                              helperText={errors?.b ? errors.b.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              //   label={<FormattedLabel id="b" />}
                              label="Margin(Right Side)"
                              variant="standard"
                              {...register("rightSide")}
                              error={!!errors.b}
                              helperText={errors?.b ? errors.b.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              // label={<FormattedLabel id="noOfApprochedRoad" />}
                              label="Site Address"
                              variant="standard"
                              {...register("siteAddress")}
                              error={!!errors.noOfApprochedRoad}
                              helperText={
                                errors?.noOfApprochedRoad
                                  ? errors.noOfApprochedRoad.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid item xs={4} className={styles.feildres}></Grid>
                          <Grid item xs={4} className={styles.feildres}></Grid>
                          <Grid item xs={4} sx={{ margin: "6%" }}>
                            {/* <FormattedLabel id="buildingUse" /> */}

                            <FormGroup>
                              <FormControlLabel
                                // label={<FormattedLabel id="residentialUse" />}
                                label="Building
                    is
                    Connected
                    Or
                    Not"
                                control={<Checkbox />}
                              />
                            </FormGroup>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* <br /> */}

                      <div>
                        <Box>
                          {isOpenCollapses && (
                            <Slide
                              direction="down"
                              in={slideCheckedF}
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
                                                "Floor Details"}
                                          </Box>
                                        </Box>
                                        <br />
                                        <Grid
                                          container
                                          columns={{ xs: 4, sm: 8, md: 12 }}
                                          className={styles.feildres}
                                        >
                                          {/* <Grid
                                            item
                                            xs={4}
                                            className={styles.feildres}
                                          ></Grid> */}

                                          <Grid
                                            item
                                            xs={4}
                                            className={styles.feildres}
                                          >
                                            <TextField
                                              sx={{ width: "80%" }}
                                              id="standard-basic"
                                              label="floor Height"
                                              variant="standard"
                                              {...register("floorHeight")}
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
                                          >
                                            <TextField
                                              sx={{ width: "80%" }}
                                              id="standard-basic"
                                              label="Net Build Up Area"
                                              variant="standard"
                                              {...register("netBuiltUpArea")}
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
                                          >
                                            <TextField
                                              sx={{ width: "80%" }}
                                              id="standard-basic"
                                              label="Gross Built Up Area"
                                              variant="standard"
                                              {...register("grossBuiltUpArea")}
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
                                          >
                                            <TextField
                                              sx={{ width: "80%" }}
                                              id="standard-basic"
                                              label="No. Of Ventilation"
                                              variant="standard"
                                              {...register("noOfVentilation")}
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
                                          >
                                            <TextField
                                              sx={{ width: "80%" }}
                                              id="standard-basic"
                                              label="Occupancy Type"
                                              variant="standard"
                                              {...register("occupancyTypes")}
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
                                          >
                                            <TextField
                                              sx={{ width: "80%" }}
                                              id="standard-basic"
                                              label="Building Classification"
                                              variant="standard"
                                              {...register(
                                                "buildingClassification"
                                              )}
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
                                        </Grid>

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
                                                saveFloorDetails();
                                                // setButtonInputState(false);
                                                // setIsOpenCollapse(false);
                                                // setFetchData(tempData);
                                                // setEditButtonInputState(false);
                                                // setDeleteButtonState(false);
                                                setIsOpenCollapse(
                                                  isOpenCollapse
                                                );
                                              }}
                                              // onClick={() => {
                                              //   saveBuilding();
                                              //   setIsOpenCollapse(
                                              //     isOpenCollapse
                                              //   );
                                              // }}
                                            >
                                              {btnSaveText == "Update" ? (
                                                <FormattedLabel id="update" />
                                              ) : (
                                                // <FormattedLabel id="save" />
                                                "Save Floor Details"
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
                                              onClick={() =>
                                                exitFunctionForFloor()
                                              }
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
                                Floor Details
                              </Box>
                            </Box>

                            <Box>
                              <Button
                                variant="contained"
                                type="primary"
                                disabled={buttonInputStates}
                                onClick={() => {
                                  reset({
                                    ...resetValuesExit,
                                  });
                                  setEditButtonInputState(true);
                                  setDeleteButtonState(true);
                                  setBtnSaveText("Save");
                                  setButtonInputStates(true);
                                  setSlideCheckedF(true);
                                  console.log(
                                    "floor tab colab",
                                    isOpenCollapse
                                  );
                                  setIsOpenCollapses(!isOpenCollapses);
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
                          </Box>
                          <Box>
                            <DataGrid
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
                              columns={columnsF}
                              pageSize={7}
                              rowsPerPageOptions={[7]}
                            />
                          </Box>
                        </Box>
                      </div>

                      <br />

                      <Grid container className={styles.feildres} spacing={2}>
                        <Grid item>
                          <Button
                            // type="submit"
                            onClick={() => {
                              // alert("hgvhgfvhg");
                              saveBuildingDetails();
                              // setButtonInputState(false);
                              // setIsOpenCollapse(false);
                              // setFetchData(tempData);
                              // setEditButtonInputState(false);
                              // setDeleteButtonState(false);
                              setIsOpenCollapse(isOpenCollapse);
                            }}
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText == "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              // <FormattedLabel id="save" />
                              "Ok"
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
                            onClick={() => exitFunction()}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}

        <Box style={{ display: "flex", marginTop: "5%" }}>
          <Box className={styles.tableHead}>
            <Box className={styles.h1Tag}>
              {/* {<FormattedLabel id="typeOfNocTitle" />} */}
              Building Details
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
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
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
            rows={buildingDataSource}
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7]}
          />
        </Box>
      </Box>
    </>
  );
};

export default Index;
