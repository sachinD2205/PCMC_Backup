import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
// import styles from "../court/view.module.css
import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
// import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import divisionSchema from "../../../../containers/schema/school/masters/divisionSchema";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(divisionSchema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const router = useRouter();
  const [schoolName, setSchoolName] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [classList, setClassList] = useState([]);
  const schoolId = watch("schoolKey");
  const classId = watch("classKey");
  // const classKey = watch ("classKey");

  // console.log(className, "className")

  // console.log(schoolName,"schoolName")

  const language = useSelector((state) => state.labels.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDivisionMaster();
  }, [fetchData, schoolName]);

  useEffect(() => {
    getSchoolName();
  }, []);

  //get school Name

  const getSchoolName = () => {
    axios.get(`${urls.SCHOOL}/mstSchool/getAll`).then((r) => {
      setSchoolName(
        r.data.mstSchoolList.map((row) => ({
          id: row.id,
          schoolName: row.schoolName,
          schoolNameMr: row.schoolNameMr,
        })),
      );
      // console.log("res.data", r.data);
    });
  };

  useEffect(() => {
    const getClassList = async () => {
      // setValue("classKey", "");
      if (schoolId == null || schoolId === "") {
        setClassList([]);
        return;
      }
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`);
        const classes = data.mstClassList.map(({ id, className }) => ({ id, className }));
        setClassList(classes);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };
    getClassList();
  }, [schoolId, setValue, setError, setIsOpen]);

  // Get Table - Data
  const getDivisionMaster = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.SCHOOL}/mstDivision/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((r) => {
        // console.log(";r", r);
        let result = r.data.mstDivisionList;
        console.log("mstDivisionList", result);

        let _res = result.map((r, i) => {
          // console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            schoolName: r.schoolName,
            schoolNameMr: schoolName?.find((item) => item?.id === r.schoolKey)?.schoolNameMr,
            className: r.className,
            schoolKey: r.schoolKey,
            classKey: r.classKey,
            divisionName: r.divisionName,
            divisionPrefix: r.divisionPrefix,
            intake: r.intake,
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
      schoolName: schoolName?.find((item) => item?.id === schoolId)?.schoolName,
      className: classList?.find((item) => item?.id === classId)?.className,
    };
    if (btnSaveText === "Save") {
      const tempData = axios.post(`${urls.SCHOOL}/mstDivision/save`, _body).then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");

          setButtonInputState(false);
          setIsOpenCollapse(false);
          setShowTable(true);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      const tempData = axios.post(`${urls.SCHOOL}/mstDivision/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getDivisionMaster();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
          setShowTable(true);
        }
      });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.SCHOOL}/mstDivision/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getDivisionMaster();
              // setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.SCHOOL}/mstDivision/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              // getPaymentRate();
              getDivisionMaster();
              // setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setShowTable(true);
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

  // Reset Values Cancell
  const resetValuesCancell = {
    schoolName: "",
    schoolKey: "",
    className: "",
    classKey: "",
    divisionName: "",
    divisionPrefix: "",
    intake: "",
    // academicYear: "",
    // academicYearFrom: "",
    // academicYearTo: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    // academicYear: "",
    // academicYearFrom: "",
    // academicYearTo: "",
    id: null,
    schoolName: "",
    schoolKey: "",
    className: "",
    classKey: "",
    divisionName: "",
    divisionPrefix: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: language == "en" ? "schoolName" : "schoolNameMr",
      headerName: labels.schoolName,
      flex: 1,
    },
    {
      field: "className",
      headerName: labels.className,
      flex: 1,
    },
    {
      field: "divisionName",
      headerName: labels.divisionName,
      flex: 1,
    },

    {
      field: "actions",
      headerName: labels.actions,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), setIsOpenCollapse(true), setShowTable(false);
                setSlideChecked(true);
                setButtonInputState(true);
                // console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                // console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Row

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        // marginTop: "50px",
        // marginBottom: "60px",
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
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>{labels.schoolDiv}</h2>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: 5,
          marginRight: 5,
          // marginTop: 2,
          // marginBottom: 3,
          padding: 2,
          // border:1,
          // borderColor:'grey.500'
        }}
      >
        <Box p={1}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {isOpenCollapse && (
                <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                  <Grid container>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="small"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.schoolKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">{labels.selectSchool}</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 230 }}
                              value={field.value}
                              {...register("schoolKey")}
                            >
                              {schoolName &&
                                schoolName.map((schoolName, index) => (
                                  <MenuItem key={index} value={schoolName.id}>
                                    {language == "en" ? schoolName.schoolName : schoolName.schoolNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="schoolKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.schoolKey ? errors.schoolKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="small"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.classKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">{labels.selectClass}</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 230 }}
                              value={field.value}
                              {...register("classKey")}
                            >
                              {classList &&
                                classList.map((className, index) => (
                                  <MenuItem key={index} value={className.id}>
                                    {className.className}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="classKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.classKey ? errors.classKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label={labels.divisionName}
                        {...register("divisionName")}
                        error={!!errors.divisionName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("divisionName") ? true : false) ||
                            (router.query.divisionName ? true : false),
                        }}
                        helperText={errors?.divisionName ? errors.divisionName.message : null}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label={labels.divisionPrefix}
                        {...register("divisionPrefix")}
                        error={!!errors.divisionPrefix}
                        // sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("divisionPrefix") ? true : false) ||
                            (router.query.divisionPrefix ? true : false),
                        }}
                        helperText={errors?.divisionPrefix ? errors.divisionPrefix.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label={labels.intake}
                        {...register("intake")}
                        error={!!errors.intake}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: (watch("intake") ? true : false) || (router.query.intake ? true : false),
                        }}
                        helperText={errors?.intake ? errors.intake.message : null}
                      />
                    </Grid>

                    <Grid
                      container
                      spacing={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        marginTop: "20px",
                      }}
                    >
                      <Grid item>
                        <Button
                          sx={{ marginRight: 8 }}
                          type="submit"
                          variant="contained"
                          color="primary"
                          endIcon={<SaveIcon />}
                        >
                          {labels.save}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          sx={{ marginRight: 8 }}
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {labels.clear}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {labels.exit}
                        </Button>
                      </Grid>
                    </Grid>
                    {/* </div> */}
                  </Grid>
                </Slide>
              )}
            </form>
          </FormProvider>
        </Box>
      </Box>

      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          // type='primary'
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
            setShowTable(false);
            setIsOpenCollapse(!isOpenCollapse);
          }}
        >
          {labels.add}
        </Button>
      </div>

      {showTable && (
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight
          sx={{
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
          density="compact"
          // autoHeight={true}
          // rowHeight={50}
          pagination
          paginationMode="server"
          // loading={data.loading}
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getDivisionMaster(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getDivisionMaster(_data, data.page);
          }}
        />
      )}
    </Paper>
  );
};

export default Index;
