import { Visibility } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import { Failed } from "../../streetVendorManagementSystem/components/commonAlert";

/** Sachin Durge */
// OwnerDetail
const OwnerDetail = ({ view = false }) => {
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
  const [finalOwnerDetailsTableData, setFinalOwnerDetailsTableData] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [viewIconState, setViewIconState] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [firm, setFirm] = useState();

  // resetOwnerValuesWithId
  const resetOwnerValuesId = () => {
    setValue("id", null);
    setValue("OwnerDetailId", null);
    setValue("OwnerDetailActiveFlag", null);
    setValue("ownerDetail");
    setValue("srNoOwnerDTL", null);
    setValue("previouslyAnyFireNocTaken", null);
    setValue("firmName", "");
    setValue("firmRegistrationNo", "");
    setValue("jvName", "");
    setValue("jvRegistrationNo", "");
    setValue("ownerName", "");
    setValue("ownerNameMr", "");
    setValue("ownerMiddleName", "");
    setValue("ownerLastName", "");
    setValue("ownerMiddleNameMr", "");
    setValue("ownerLastNameMr", "");
    setValue("ownerMobileNo", "");
    setValue("ownerEmailId", "");
  };

  // setValues- onUpdate
  const SetOwnerValues = (props) => {
    console.log("setOwnerValues", props);
    setValue("OwnerDetailId", props?.id);
    setValue("OwnerDetailActiveFlag", props?.activeFlag);
    setValue("nocId", props?.nocId);
    setValue("srNoOwnerDTL", props?.srNo);
    setValue("previouslyAnyFireNocTaken", props?.previouslyAnyFireNocTaken);
    setValue("firmName", props?.firmName);
    setValue("firmRegistrationNo", props?.firmRegistrationNo);
    setValue("jvName", props?.jvName);
    setValue("jvRegistrationNo", props?.jvRegistrationNo);
    setValue("ownerName", props?.ownerName);
    setValue("ownerNameMr", props?.ownerNameMr);
    setValue("ownerMiddleName", props?.ownerMiddleName);
    setValue("ownerLastName", props?.ownerLastName);
    setValue("ownerMiddleNameMr", props?.ownerMiddleNameMr);
    setValue("ownerLastNameMr", props?.ownerLastNameMr);
    setValue("ownerMobileNo", props?.ownerMobileNo);
    setValue("ownerEmailId", props?.ownerEmailId);
  };

  // saveOwner
  const saveOwner = () => {
    // currentOwnerDTLDao
    const currentOwnerDTLDao = {
      id: getValues("OwnerDetailId"),
      activeFlag: getValues("OwnerDetailActiveFlag"),
      nocId: getValues("nocId"),
      previouslyAnyFireNocTaken: getValues("previouslyAnyFireNocTaken"),
      firmName: getValues("firmName"),
      firmRegistrationNo: getValues("firmRegistrationNo"),
      firmRegistrationNo: getValues("jvName"),
      firmRegistrationNo: getValues("jvRegistrationNo"),
      ownerName: getValues("ownerName"),
      ownerNameMr: getValues("ownerNameMr"),
      ownerMiddleName: getValues("ownerMiddleName"),
      ownerLastName: getValues("ownerLastName"),
      ownerMiddleNameMr: getValues("ownerMiddleNameMr"),
      ownerLastNameMr: getValues("ownerLastNameMr"),
      ownerMobileNo: getValues("ownerMobileNo"),
      ownerEmailId: getValues("ownerEmailId"),
    };

    console.log("currentOwnerDTLDao", currentOwnerDTLDao?.id);

    // getAlredyData
    let tempOwnerDTLDao = watch("ownerDTLDao");
    console.log("tempOwnerDTLDao", typeof tempOwnerDTLDao);

    // if( typeof tempOwnerDTLDao == )
    // const tempOwnerDTLDaoLength = Number(tempOwnerDTLDao.length);

    // OwnerTableList
    if (tempOwnerDTLDao != null && tempOwnerDTLDao != undefined) {
      // ifArrayIsNotEmpty - secondRecordUpdateInTable
      if (currentOwnerDTLDao?.id == null || currentOwnerDTLDao?.id == undefined) {
        // ifAlredyRecordNotExit - Save
        setValue("ownerDTLDao", [...tempOwnerDTLDao, currentOwnerDTLDao]);
      } else {
        // ifAlredyRecordExit - Update
        const tempData = tempOwnerDTLDao.filter((data, index) => {
          if (data?.id != currentOwnerDTLDao?.id) {
            return data;
          }
        });
        setValue("ownerDTLDao", [...tempData, currentOwnerDTLDao]);
      }
    } else {
      // ifArrayIsEmpty - firstRecordInTable
      setValue("ownerDTLDao", [currentOwnerDTLDao]);
    }

    // finalBodyForApi
    const finalBodyForApi = {
      id: getValues("provisionalBuildingNocId "),
      // applicantDTLDao
      applicantDTLDao: watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
      // ownerDTLDao
      ownerDTLDao: watch("ownerDTLDao") == undefined ? [] : [...watch("ownerDTLDao")],
      // formDTLDao
      formDTLDao: watch("formDTLDao") == undefined ? {} : watch("formDTLDao"),
      // buildingDTLDao
      buildingDTLDao: watch("buildingDTLDao") == undefined ? [] : [...watch("buildingDTLDao")],
      // attachments
      attachments: watch("attachments") == undefined ? [] : [...watch("attachments")],
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("res?.data", res?.data);
          // setId
          setValue("provisionalBuildingNocId", res?.data?.status?.split("$")[1]);
          // collpaseOpen/Close
          setIsOpenCollapse(false);
          // editButtonState
          setEditButtonInputState(false);
          // deleteButtonState
          setDeleteButtonState(false);
          // addButtonState
          setButtonInputState(false);
          // viewIconState
          setViewIconState(false);
          // resetOwnerValuesWithID
          resetOwnerValuesId();
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        } else {
          <Failed />;
        }
      })
      .catch((error) => {
        console.log("Error", error);
        <Failed />;
      });
  };

  // deleteById
  const deleteById = async (value) => {
    let ownerDetailDelteId = value;
    console.log("ownerDetailDelteId", value);

    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let tempOwnerDTLDao = watch("ownerDTLDao");

        if (tempOwnerDTLDao != null || tempOwnerDTLDao != undefined) {
          //activeFlagYRecords
          const tempDataY = tempOwnerDTLDao.filter((data, index) => {
            if (data?.id != ownerDetailDelteId) {
              return data;
            }
          });

          // wantToDeletRecord
          const tempData = tempOwnerDTLDao.filter((data, index) => {
            if (data?.id == ownerDetailDelteId) {
              return data;
            }
          });

          // activeFlagNRecord
          const tempDataN = tempData.map((data) => {
            return {
              ...data,
              activeFlag: "N",
            };
          });

          // updateRecord
          setValue("ownerDTLDao", [...tempDataY, ...tempDataN]);

          // states
          // editButtonState
          setEditButtonInputState(false);
          // deleteButtonState
          setDeleteButtonState(false);
          // addButtonState
          setButtonInputState(false);
          // viewIconState
          setViewIconState(false);
        }
      } else {
        // editButtonState
        setEditButtonInputState(false);
        // deleteButtonState
        setDeleteButtonState(false);
        // addButtonState
        setButtonInputState(false);
        // viewIconState
        setViewIconState(false);
      }
    });
  };

  // exitFunction
  const exitFunction = () => {
    // editButtonState
    setEditButtonInputState(false);
    // deleteButtonState
    setDeleteButtonState(false);
    // addButtonState
    setButtonInputState(false);
    // viewIconState
    setViewIconState(false);
    // save/updateButtonText
    setBtnSaveText("Save");
    // conditionalRendering
    setSlideChecked(true);
    // collpaseOpen/Close
    setIsOpenCollapse(false);
    // resetValuesWithId
    resetOwnerValuesId();
    // disabledInputState
    setViewButtonInputState(false);
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
    },
    {
      field: "ownerName",
      headerName: "Owner Name",
      flex: 1,
    },
    {
      field: "ownerMobileNo",
      headerName: "Mobile No.",
      flex: 1,
    },
    {
      field: "ownerEmailId",
      headerName: "Email ID",
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
              disabled={viewIconState}
              onClick={() => {
                SetOwnerValues(params?.row);
                // editButtonState
                setEditButtonInputState(true);
                // deleteButtonState
                setDeleteButtonState(true);
                // addButtonState
                setButtonInputState(true);
                // viewIconState
                setViewIconState(true);
                // conditionalRendering
                setSlideChecked(true);
                // collpaseOpen/Close
                setIsOpenCollapse(!isOpenCollapse);
                // disabledInputState
                setViewButtonInputState(true);
                // save/updateButtonText
                // setBtnSaveText("Save");
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputState}
                onClick={() => {
                  // setValues
                  SetOwnerValues(params?.row);

                  // editButtonState
                  setEditButtonInputState(true);
                  // deleteButtonState
                  setDeleteButtonState(true);
                  // addButtonState
                  setButtonInputState(true);
                  // viewIconState
                  setViewIconState(true);
                  // save/updateButtonText
                  setBtnSaveText("Update");
                  // conditionalRendering
                  setSlideChecked(true);
                  // collpaseOpen/Close
                  setIsOpenCollapse(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputState}
                onClick={() => {
                  deleteById(params?.row?.id);
                  // editButtonState
                  setEditButtonInputState(true);
                  // deleteButtonState
                  setDeleteButtonState(true);
                  // addButtonState
                  setButtonInputState(true);
                  // viewIconState
                  setViewIconState(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // =============================> useEffect ========================================>

  useEffect(() => {
    console.log("ownerDTLDaoqwe2e", watch("ownerDTLDao"));

    // filterTableData-ActiveFlag "Y"
    const tempTableDataWithFlagY = watch("ownerDTLDao")?.filter((data, index) => {
      if (data?.activeFlag == "Y") {
        return data;
      }
    });

    // mapRecordActiveFlagY
    const tempTableData = tempTableDataWithFlagY?.map((data, index) => {
      return {
        srNo: index + 1,
        ...data,
      };
    });

    console.log("tempTableData", tempTableData);

    // SetTableData
    setFinalOwnerDetailsTableData(tempTableData);
  }, [watch("ownerDTLDao")]);

  useEffect(() => {
    console.log("finalOwnerDetailsTableData", finalOwnerDetailsTableData);
  }, [finalOwnerDetailsTableData]);

  // view
  return (
    <>
      <Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <Box
                style={{
                  margin: "4%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
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
                      {btnSaveText == "Update" ? "Update Buliding Details" : "Owner Details"}
                    </Box>
                  </Box>
                  <br />

                  <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                    {/* Building Fields */}
                    <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}></Grid>
                    <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ width: "80%" }}>
                          <InputLabel variant="standard" htmlFor="uncontrolled-native">
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
                                name="previouslyAnyFireNocTaken"
                                fullWidth
                                size="small"
                                variant="standard"
                              >
                                <MenuItem value="Firm">Firm </MenuItem>
                                <MenuItem value="JV">JV</MenuItem>
                                <MenuItem value="Individual">Individual</MenuItem>
                              </Select>
                            )}
                            name="previouslyAnyFireNocTaken"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
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
                              disabled={viewButtonInputState}
                              label={<FormattedLabel id="firmName" />}
                              variant="standard"
                              {...register("firmName")}
                              error={!!errors.firmName}
                              helperText={errors?.firmName ? errors.firmName.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              disabled={viewButtonInputState}
                              id="standard-basic"
                              label="Firm Registration No."
                              variant="standard"
                              {...register("firmRegistrationNo")}
                              error={!!errors.firmRegistrationNo}
                              helperText={
                                errors?.firmRegistrationNo ? errors.firmRegistrationNo.message : null
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
                              disabled={viewButtonInputState}
                              id="standard-basic"
                              label="JV Name"
                              variant="standard"
                              {...register("jvName")}
                              error={!!errors.jvName}
                              helperText={errors?.jvName ? errors.jvName.message : null}
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              disabled={viewButtonInputState}
                              label="JV Registration No."
                              variant="standard"
                              {...register("jvRegistrationNo")}
                              error={!!errors.jvRegistrationNo}
                              helperText={errors?.jvRegistrationNo ? errors.jvRegistrationNo.message : null}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Owner First Name"
                          variant="standard"
                          {...register("ownerName")}
                          error={!!errors.ownerName}
                          helperText={errors?.ownerName ? errors.ownerName.message : null}
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Owner Middle Name"
                          variant="standard"
                          {...register("ownerMiddleName")}
                          error={!!errors.ownerMiddleName}
                          helperText={errors?.ownerMiddleName ? errors.ownerMiddleName.message : null}
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Owner Last Name"
                          variant="standard"
                          {...register("ownerLastName")}
                          error={!!errors.ownerLastName}
                          helperText={errors?.ownerLastName ? errors.ownerLastName.message : null}
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Owner First Name (In Marathi)"
                          variant="standard"
                          {...register("ownerNameMr")}
                          error={!!errors.ownerNameMr}
                          helperText={errors?.ownerNameMr ? errors.ownerNameMr.message : null}
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Owner Middle Name (In Marathi)"
                          variant="standard"
                          {...register("ownerMiddleNameMr")}
                          error={!!errors.ownerMiddleNameMr}
                          helperText={errors?.ownerMiddleNameMr ? errors.ownerMiddleNameMr.message : null}
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Owner Last Name (In Marathi)"
                          variant="standard"
                          {...register("ownerLastNameMr")}
                          error={!!errors.ownerLastNameMr}
                          helperText={errors?.ownerLastNameMr ? errors.ownerLastNameMr.message : null}
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
                          error={!!errors.mobileNo}
                          helperText={errors?.mobileNo ? errors.mobileNo.message : null}
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
                          helperText={errors?.emailId ? errors.emailId.message : null}
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
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                          onClick={() => {
                            saveOwner();
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
            </div>
          </Slide>
        )}

        <Box style={{ display: "flex" /* marginTop: "5%" */ }}>
          <Box className={styles.tableHead}>
            <Box className={styles.h1Tag}>Owner Details</Box>
          </Box>
          {!view && (
            <Box>
              <Button
                variant="contained"
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  // editButtonState
                  setEditButtonInputState(true);
                  // deleteButtonState
                  setDeleteButtonState(true);
                  // addButtonState
                  setButtonInputState(true);
                  // viewIconState
                  setViewIconState(true);
                  // save/updateButtonText
                  setBtnSaveText("Save");
                  // conditionalRendering
                  setSlideChecked(true);
                  // collpaseOpen/Close
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
            getRowId={(row) => row.srNo}
            disableColumnFilter
            disableColumnSelector
            disableExport
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOptions: { disableToolbarButton: true },
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
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E1FDFF",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#87E9F7",
              },
            }}
            rows={
              finalOwnerDetailsTableData == null || finalOwnerDetailsTableData == undefined
                ? []
                : finalOwnerDetailsTableData
            }
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
