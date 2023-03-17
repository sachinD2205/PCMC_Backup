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
// import schema from "../../../../containers/schema/libraryManagementSystem/shelfCatlogMaster";
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../theme"

const ShelfCatlogMaster = () => {
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [libraryNameState, setLibraryNameState] = useState([]);

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
    getLibraryName();
  }, []);

  useEffect(() => {
    getTableData();
  }, [libraryNameState]);

  const getLibraryName = () => {
    axios
      .get(
        `${urls.LMSURL}/libraryMaster/getAll`
      )
      .then((r) => {
        // console.log("Library names: ", r.data);
        setLibraryNameState(
          r.data?.libraryMasterList
            .map((row) => ({
              id: row.id,
              libraryName: row.libraryName,
              libraryType: row.libraryType,
              studyCenter: row.studyCenterName,
            }))
        );
      });
  };

  const getTableData = () => {
    axios
      .get(`${urls.LMSURL}/ShelfCatlogMaster/getAll`)
      .then((res) => {
        console.log("Table: ", res.data);
        let temp = res.data?.shelfCatlogMasterList
          .map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            libraryName: libraryNameState?.find(
              (obj) => obj?.id == r.libraryKey
            )?.libraryName,
            shelfNo: r.shelfNo,
            shelfCatlogSection:r.shelfCatlogSection,
            // shelfCatlogName: r.shelfCatlogName,
            remark: r.remark,
          }))
        console.log("temp", temp);
        setDataSource(temp);
      });
  };

  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };
    // Save - DB

    console.log("FinalBody",finalBodyForApi)
    axios
      .post(
        `${urls.LMSURL}/ShelfCatlogMaster/save`,
        finalBodyForApi
      )
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getTableData();
          setButtonInputState(false);
          setIsOpenCollapse(true);
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
            `${urls.LMSURL}/ShelfCatlogMaster/delete/${value}`
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
    libraryKey: "",
    shelfNo: "",
    shelfCatlogSection: "",

    remark: "",
  };

  const resetValuesExit = {
    libraryKey: "",
    shelfNo: "",
    shelfCatlogSection: "",

    remark: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    // {
    //   field: "shelfCatlogCodeId",
    //   headerName: "Shelf Catlog Code Id",
    //   flex: 3,
    // },
    {
      field: "libraryName",
      headerName: "Library Name",
      //type: "number",
      flex: 3,
    },
    {
      field: "shelfNo",
      headerName: "Shelf No.",
      //type: "number",
      flex: 3,
    },
    {
      field: "shelfCatlogSection",
      headerName: "Shelf Catlog Section",
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
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
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
              Shelf Catlog Master
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
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.libraryKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Library Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => {
                                  console.log(value.target.value);
                                  field.onChange(value);
                                }}
                                label="Library Name"
                              >
                                {libraryNameState &&
                                  libraryNameState.map((libraryName, index) => (
                                    <MenuItem
                                      key={index}
                                      value={libraryName.id}
                                    >
                                      {libraryName.libraryName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="libraryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.libraryKey
                              ? errors.libraryKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Shelf No. *"
                          variant="standard"
                          {...register("shelfNo")}
                          error={!!errors.shelfNo}
                          helperText={
                            errors?.shelfNo ? errors.shelfNo.message : null
                          }
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Shelf Catlog Section *"
                          variant="standard"
                          {...register("shelfCatlogSection")}
                          error={!!errors.shelfCatlogSection}
                          helperText={
                            errors?.shelfCatlogSection
                              ? errors.shelfCatlogSection.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "96%" }}
                          id="standard-basic"
                          label="Remark *"
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
              // marginLeft: 5,
              // marginRight: 5,
              // marginTop: 5,
              // marginBottom: 5,

              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
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
export default ShelfCatlogMaster;
