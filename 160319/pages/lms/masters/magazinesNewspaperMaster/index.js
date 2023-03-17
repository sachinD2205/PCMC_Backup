import {
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  Box,
  ThemeProvider,
} from "@mui/material";
import { Paper } from "@mui/material";
import { DataGrid, GridCell, GridRow } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import styles from "../libraryCompetativeMaster/view.module.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Slide } from "@mui/material";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { FormHelperText } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "../../../../containers/schema/libraryManagementSystem/magazinesNewspaperMaster";
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../theme"


const MagazinesNewspaperMaster = () => {
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [languages, setLanguages] = useState([{ id: 1, language: "English" }, { id: 2, language: "Marathi" }]);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    getLanguageTypes();
  }, []);

  useEffect(() => {
    getTableData();
  }, [languages]);

  const getLanguageTypes = () => {
    // axios.get(`${urls.BaseURL}/mstBookType/getBookTypeData`).then((r) => {
    //   setLanguages(
    //     r.data.map((row) => ({
    //       id: row.id,
    //       language: row.language,
    //     }))
    //   );
    // });
  };

  const getTableData = () => {
    axios
      .get(
        `${urls.LMSURL}/magazineNewspaperMaster/getAll`
      )
      .then((res) => {
        console.log(res);
        setDataSource(
          res.data.masterMagazineNewspaperList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            magazineName: r.magazineName,
            magazineSubCategory: r.magazineSubCategory,
            language: r.language,
            // languageName: languages?.find((obj) => obj?.id === r.language)
            //   ?.language,
            supplierName: r.supplierName,
            contactNumber: r.contactNumber,
            remark: r.remark,
          }))
        );
      });
  };

  const onSubmitForm = (formData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
    };

    console.log("formdata", finalBodyForApi)
    // Save - DB
    axios
      .post(
        `${urls.LMSURL}/magazineNewspaperMaster/save`,
        finalBodyForApi
      )
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getTableData();
          // setButtonInputState(false);
          // setIsOpenCollapse(true);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);

          setButtonInputState(false);
          setSlideChecked(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

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
            `${urls.LMSURL}/magazineNewspaperMaster/delete/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getTableData();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    magazineName: "",
    magazineSubCategory: "",
    language: "",
    supplierName: "",
    contactNumber: "",
    remark: "",
  };

  const resetValuesExit = {
    magazineName: "",
    magazineSubCategory: "",
    language: "",
    supplierName: "",
    contactNumber: "",
    remark: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "magazineName",
      headerName: "Magazines/Newspaper Name",
      flex: 3,
    },
    {
      field: "magazineSubCategory",
      headerName: "Magazines/Newspaper Sub Category Name",
      //type: "number",
      flex: 3,
    },
    {
      field: "language",
      headerName: "Language",
      //type: "number",
      flex: 3,
    },
    {
      field: "supplierName",
      headerName: "Supplier Name",
      //type: "number",
      flex: 3,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      //type: "number",
      flex: 3,
    },
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      flex: 3,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];
  return (
    <>
      <ThemeProvider theme={theme}>

        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              Magazine Newspaper Master
            </h2>
          </Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Magazines/Newspaper Name"
                          variant="standard"
                          {...register("magazineName")}
                          error={!!errors.magazineName}
                          helperText={
                            errors?.magazineName
                              ? errors.magazineName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Magazines/Newspaper Sub Category Name"
                          variant="standard"
                          {...register("magazineSubCategory")}
                          error={!!errors.magazineSubCategory}
                          helperText={
                            errors?.magazineSubCategory
                              ? errors.magazineSubCategory.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.language}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Language
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Language"
                              >
                                {languages &&
                                  languages.map((language, index) => (
                                    <MenuItem key={index} value={language.language}>
                                      {language.language}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="language"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.language ? errors.language.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Supplier Name"
                          variant="standard"
                          {...register("supplierName")}
                          error={!!errors.supplierName}
                          helperText={
                            errors?.supplierName
                              ? errors.supplierName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Contact Number"
                          variant="standard"
                          {...register("contactNumber")}
                          error={!!errors.contactNumber}
                          helperText={
                            errors?.contactNumber
                              ? errors.contactNumber.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Remark"
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </Grid>
                    </Grid>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                        </Button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}

          <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
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
            >
              Add{" "}
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
      </ThemeProvider>
    </>
  );
};
export default MagazinesNewspaperMaster;
