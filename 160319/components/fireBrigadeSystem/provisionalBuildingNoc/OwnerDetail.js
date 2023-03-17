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
import { Controller, useFormContext } from "react-hook-form";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
import {
  Box,
  FormControl,
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

const OwnerDetail = ({ view = false }) => {
  const router = useRouter();

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   getValues,
  //   setValue,
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

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [buttonInputStates, setButtonInputStates] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [isOpenCollapses, setIsOpenCollapses] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [roadWidth, setRoadWidth] = useState([]);
  const [firm, setFirm] = useState();
  // const [editButtonInputState, setEditButtonInputState] = useState(false);
  // const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  // const [buttonInputState, setButtonInputState] = useState();
  // const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  // const [fetchData, setFetchData] = useState(null);

  // Get Table - Data
  // const getData = () => {
  //   axios
  //     .get(`${urls.FbsURL}/typeOfNOCMaster/getTypeOfNOCMasterData`)
  //     // .get(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById`)
  //     .then((res) => {
  //       setDataSource(res.data);
  //       console.log("data", res.data);
  //     });
  // };
  // get Building Type
  const getRoadWidth = () => {
    axios
      .get(`${urls.FbsURL}/master/accessRoadWidth/getAll`)
      .then((res) => {
        setRoadWidth(res?.data);
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

  const [area, setArea] = useState();

  const getArea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`)
      .then((res) => setArea(res?.data?.area))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log("dataSource", dataSource);
  }, [dataSource]);

  const saveOwner = () => {
    // console.log("Form Data ", fromData);
    const ownerDTLDao = {
      ownerName: getValues("ownerName"),
      ownerNameMr: getValues("ownerNameMr"),
      ownerMiddleName: getValues("ownerMiddleName"),
      ownerLastName: getValues("ownerLastName"),
      ownerMiddleNameMr: getValues("ownerMiddleNameMr"),
      ownerLastNameMr: getValues("ownerLastNameMr"),
      ownerMobileNo: getValues("ownerMobileNo"),
      ownerEmailId: getValues("ownerEmailId"),
    };

    // console.log("nocid==", getValues("nocId"));

    const body = {
      ...getValues("prevData"),
      id: getValues("id"),
      ownerDTLDao: [...dataSource, ownerDTLDao],
    };
    // console.log("nocID39439121", body);
    console.log("666666", body);
    console.table(getValues("prevData"));
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
          console.log("res", res.data);
          let appId = res?.data?.status?.split("$")[1];
          const tempData = axios
            .get(
              `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`
            )
            .then((res) => {
              console.log("res", res.data);
              // reset(res.data);
              setDataSource(
                res.data.ownerDTLDao.map((o, i) => {
                  return {
                    srNo: i + 1,
                    ...o,
                  };
                })
              );
              setValue("prevData", res.data);
              setValue("id", res.data.id);
              setValue("ownerDTLDao", res.data.ownerDTLDao);
              setValue("formDTLDao", null);
              setValue("applicantDTLDao", res.data.applicantDTLDao);
              setValue("buildingDTLDao", res.data.buildingDTLDao);
              setValue("attachments", res.data.attachments);
            });
          // appId=res?.data?.message?.split("$")[1],
          // fromData.id
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          // : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          resetValuesOnSave();
        }
      });
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

  const exitFunction = () => {
    setButtonInputState(false);
    setIsOpenCollapse(false);
    setViewButtonInputState(false);
    // setFetchData(tempData);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    // setIsOpenCollapse(!isOpenCollapse);
    setSlideChecked(true);
  };

  const resetValuesOnSave = () => {
    reset({
      ...resetValues,
      id,
    });
  };

  // Reset Values
  const resetValues = {
    formName: "",
    ownerName: "",
    ownerNameMr: "",
    ownerMiddleNameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    nOCName: "",
    nOCNameMr: "",
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    // nOCName: "",
    // nOCNameMr: "",
    formName: "",
    firmRegistrationNo: "",
    jvName: "",
    jvRegistrationNo: "",
    ownerName: "",
    ownerMiddleName: "",
    ownerEmailId: "",
    ownerMobileNo: "",
    ownerLastNameMr: "",
    ownerMiddleNameMr: "",
    ownerNameMr: "",
    ownerLastName: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      // headerName: <FormattedLabel id="nOCName" />,
      flex: 1,
    },
    {
      field: "ownerName",
      headerName: "Owner Name",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "ownerMobileNo",
      headerName: "Mobile No.",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "ownerEmailId",
      headerName: "Email ID",
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

  // Row

  useEffect(() => {
    // console.log("sachin1211212", getValues("sachin"));
    console.log("ashish343445345", getValues("nocId"), watch("nocId"));
  }, []);

  useEffect(() => {
    console.log("sach345345", getValues("nocId"));
    // console.log("sachin1211212", getValues("sachin"));
  }, [watch("nocId")]);

  useEffect(() => {
    // getData();
    if (getValues("ownerDTLDao")?.length > 0) {
      setDataSource(getValues("ownerDTLDao"));
    }
    getArea();
    getBuildingTypes();
    getRoadWidth();
  }, [fetchData]);

  return (
    <>
      <Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              {/* onSubmit={handleSubmit(onSubmitForm)} */}
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
                          "Owner Details"}
                    </Box>
                  </Box>
                  <br />

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
                    ></Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ width: "80%" }}>
                          <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                          >
                            OwnerShip Type
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={viewButtonInputState}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setFirm(value.target.value);
                                }}
                                // field.onChange(value);
                                // }}
                                // onChange={(value) => field.onChange(value)}
                                name="previouslyAnyFireNocTaken"
                                fullWidth
                                size="small"
                                variant="standard"
                              >
                                <MenuItem value="Firm">Firm </MenuItem>
                                <MenuItem value="JV">JV</MenuItem>
                                <MenuItem value="Individual">
                                  Individual
                                </MenuItem>
                              </Select>
                            )}
                            name="previouslyAnyFireNocTaken"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                        {/* <FormControl sx={{ width: "80%" }}>
                          <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                          >
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
                            name="previouslyAnyFireNocTaken"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl> */}
                      </Grid>

                      {firm === "Individual" && (
                        <>
                          <Grid item xs={4} className={styles.feildres}></Grid>
                          <Grid item xs={4} className={styles.feildres}></Grid>
                        </>
                      )}
                      {firm === "Firm" && (
                        <>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="firmName" />}
                              variant="standard"
                              // key={groupDetails.id}
                              {...register("firmName")}
                              error={!!errors.firmName}
                              helperText={
                                errors?.firmName
                                  ? errors.firmName.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label="Firm Registration No."
                              // label={<FormattedLabel id="firmName" />}
                              variant="standard"
                              // key={groupDetails.id}
                              {...register("firmRegistrationNo")}
                              error={!!errors.firmRegistrationNo}
                              helperText={
                                errors?.firmRegistrationNo
                                  ? errors.firmRegistrationNo.message
                                  : null
                              }
                            />
                          </Grid>
                        </>
                      )}

                      {firm === "JV" && (
                        <>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              // label={<FormattedLabel id="firmName" />}
                              label="JV Name"
                              variant="standard"
                              // key={groupDetails.id}
                              {...register("jvName")}
                              error={!!errors.jvName}
                              helperText={
                                errors?.jvName ? errors.jvName.message : null
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label="JV Registration No."
                              // label={<FormattedLabel id="firmName" />}
                              variant="standard"
                              // key={groupDetails.id}
                              {...register("jvRegistrationNo")}
                              error={!!errors.jvRegistrationNo}
                              helperText={
                                errors?.jvRegistrationNo
                                  ? errors.jvRegistrationNo.message
                                  : null
                              }
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>

                    {/* ///////////////// */}

                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerName" />}
                          label="Owner First Name"
                          variant="standard"
                          {...register("ownerName")}
                          error={!!errors.ownerName}
                          helperText={
                            errors?.ownerName ? errors.ownerName.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerMiddleName" />}
                          label="Owner Middle Name"
                          variant="standard"
                          {...register("ownerMiddleName")}
                          error={!!errors.ownerMiddleName}
                          helperText={
                            errors?.ownerMiddleName
                              ? errors.ownerMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerLastName" />}
                          label="Owner Last Name"
                          variant="standard"
                          {...register("ownerLastName")}
                          error={!!errors.ownerLastName}
                          helperText={
                            errors?.ownerLastName
                              ? errors.ownerLastName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerNameMr" />}
                          label="Owner First Name (In Marathi)"
                          variant="standard"
                          {...register("ownerNameMr")}
                          error={!!errors.ownerNameMr}
                          helperText={
                            errors?.ownerNameMr
                              ? errors.ownerNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerMiddleNameMr" />}
                          label="Owner Middle Name (In Marathi)"
                          variant="standard"
                          {...register("ownerMiddleNameMr")}
                          error={!!errors.ownerMiddleNameMr}
                          helperText={
                            errors?.ownerMiddleNameMr
                              ? errors.ownerMiddleNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerLastNameMr" />}
                          label="Owner Last Name (In Marathi)"
                          variant="standard"
                          {...register("ownerLastNameMr")}
                          error={!!errors.ownerLastNameMr}
                          helperText={
                            errors?.ownerLastNameMr
                              ? errors.ownerLastNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="mobileNo" />}
                          variant="standard"
                          {...register("ownerMobileNo")}
                          // type="number"
                          error={!!errors.mobileNo}
                          helperText={
                            errors?.mobileNo ? errors.mobileNo.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="emailId" />}
                          variant="standard"
                          {...register("ownerEmailId")}
                          error={!!errors.emailId}
                          helperText={
                            errors?.emailId ? errors.emailId.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </Grid>
                  <br />

                  <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      {!viewButtonInputState && (
                        <Button
                          // type="submit"
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                          onClick={() => {
                            saveOwner();
                            // setButtonInputState(false);
                            // setIsOpenCollapse(false);
                            // setFetchData(tempData);
                            // setEditButtonInputState(false);
                            // setDeleteButtonState(false);
                            setIsOpenCollapse(isOpenCollapse);
                          }}
                        >
                          {btnSaveText == "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
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
                        // onClick={() =>
                        //   router.push({
                        //     pathname:
                        //       "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
                        //   })
                        // }
                        onClick={() => exitFunction()}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </div>
          </Slide>
        )}

        <Box style={{ display: "flex" /* marginTop: "5%" */ }}>
          <Box className={styles.tableHead}>
            <Box className={styles.h1Tag}>
              {/* {<FormattedLabel id="typeOfNocTitle" />} */}
              Owner Details
            </Box>
          </Box>
          {!view && (
            <Box>
              <Button
                variant="contained"
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  // reset({
                  //   ...resetValuesExit,
                  // });
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
        <Box style={{ marginBottom: "10px" }}>
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
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7]}
          />
        </Box>
      </Box>
    </>
  );
};

export default OwnerDetail;
