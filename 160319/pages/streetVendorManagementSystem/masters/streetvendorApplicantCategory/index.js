import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schema from "../../../../components/streetVendorManagementSystem/schema/StreetvendorApplicantCategorySchema";
import styles from "../../../../components/streetVendorManagementSystem/styles/streetvendorApplicantCategory.module.css";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
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

  // Delete By ID
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
            `${urls.HMSURL}/mstStreetVendorApplicantCategory/discard/${value}`,
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getApplicantTypeDetails();
              setButtonInputState(false);
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    alert("hello");
    const finalBody = {
      ...fromData,
      activeFlag: btnSaveText === "Update" ? fromData.activeFlag : null,
    };

    axios
      .post(`${urls.HMSURL}/mstStreetVendorApplicantCategory/save`, finalBody)
      .then((res) => {
        finalBody.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getApplicantTypeDetails();
        setButtonInputState(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
        setIsOpenCollapse(false);
      });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
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
    type: "",
    typeMr: "",
    applicantPrefixMr: "",
    applicantPrefix: "",
    subtype: "",
    subtypeMr: "",
    remarkMr: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    type: "",
    typeMr: "",
    applicantPrefixMr: "",
    applicantPrefix: "",
    subtype: "",
    subtypeMr: "",
    remarkMr: "",
    remark: "",
    id: "",
  };

  // Get Table - Data
  const getApplicantTypeDetails = () => {
    console.log("applicant Data ----");
    axios
      .get(`${urls.HMSURL}/mstStreetVendorApplicantCategory/getAll`)
      .then((res) => {
        setDataSource(
          res.data.streetVendorApplicantCategory.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            type: r.type,
            typeMr: r.typeMr,
            applicantPrefixMr: r.applicantPrefixMr,
            applicantPrefix: r.applicantPrefix,
            subtype: r.subtype,
            subtypeMr: r.subtypeMr,
            remarkMr: r.remarkMr,
            remark: r.remark,
          })),
        );
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getApplicantTypeDetails();
  }, []);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },

    {
      field: "typeMr",
      headerName: "Type Mr",
      // type: "number",
      flex: 1,
    },

    {
      field: "applicantPrefixMr",
      headerName: "Applicant Prefix Mr",
      // type: "number",
      flex: 1,
    },
    {
      field: "applicantPrefix",
      headerName: "Applicant Prefix",
      // type: "number",
      flex: 1,
    },
    {
      field: "subtype",
      headerName: "Sub Type",
      //type: "number",
      flex: 1,
    },
    {
      field: "subtypeMr",
      headerName: "Sub Type Mr",
      //type: "number",
      flex: 1,
    },
    {
      field: "remarkMr",
      headerName: "Remark Mr",
      //type: "number",
      flex: 1,
    },
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                console.log(`Id Send to Edit ${params.id}`);
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // View
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id='standard-basic'
                      label='Applicant Prefix*'
                      variant='standard'
                      {...register("applicantPrefix")}
                      error={!!errors.applicantPrefix}
                      helperText={
                        errors?.applicantPrefix
                          ? errors.applicantPrefix.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id='standard-basic'
                      label='Applicant Prefix Mr*'
                      variant='standard'
                      {...register("applicantPrefixMr")}
                      error={!!errors.applicantPrefixMr}
                      helperText={
                        errors?.applicantPrefixMr
                          ? errors.applicantPrefixMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id='standard-basic'
                      label='Type*'
                      variant='standard'
                      {...register("type")}
                      error={!!errors.type}
                      helperText={errors?.type ? errors.type.message : null}
                    />
                  </Grid>
                </Grid>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id='standard-basic'
                      label='Type Mr*'
                      variant='standard'
                      {...register("typeMr")}
                      error={!!errors.typeMr}
                      helperText={errors?.typeMr ? errors.typeMr.message : null}
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id='standard-basic'
                      label='Sub Type*'
                      variant='standard'
                      {...register("subtype")}
                      error={!!errors.subtype}
                      helperText={
                        errors?.subtype ? errors.subtype.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id='standard-basic'
                      label='Sub Type Mr*'
                      variant='standard'
                      {...register("subtypeMr")}
                      error={!!errors.subtypeMr}
                      helperText={
                        errors?.subtypeMr ? errors.subtypeMr.message : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id='standard-basic'
                      label='Remark*'
                      variant='standard'
                      {...register("remark")}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id='standard-basic'
                      label='Remark Mr*'
                      variant='standard'
                      {...register("remarkMr")}
                      error={!!errors.remarkMr}
                      helperText={
                        errors?.remarkMr ? errors.remarkMr.message : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  style={{
                    padding: "10px",
                    marginLeft: "300px",
                    marginTop: "50px",
                  }}
                >
                  <Grid item xl={4}>
                    <Button
                      sx={{ marginLeft: 8 }}
                      type='submit'
                      variant='contained'
                      color='success'
                      endIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
                  </Grid>

                  <Grid item xl={4}>
                    <Button
                      sx={{ marginLeft: 8 }}
                      variant='contained'
                      color='primary'
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      Clear
                    </Button>
                  </Grid>

                  <Grid item xl={4}>
                    <Button
                      sx={{ marginLeft: 8 }}
                      variant='contained'
                      color='error'
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </div>
        )}
        <div className={styles.addbtn}>
          <Button
            variant='contained'
            endIcon={<AddIcon />}
            type='primary'
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setBtnSaveText("Save");
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            Add
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
