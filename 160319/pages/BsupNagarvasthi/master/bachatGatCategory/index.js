// import { yupResolver } from "@hookforpostm/resolvers/yup";
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
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
import styles from "../../../../styles/BsupNagarvasthi/masters/[bachatGatCategory].module.css";
import schema from "../../../../containers/schema/BsupNagarvasthiSchema/bachatGatCategorySchema";
import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
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
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getBachatgatCategory();
  }, [fetchData]);

  // Get Table - Data
  const getBachatgatCategory = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.mstBachatGatCategoryList;
        console.log("result", result);

        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            // devisionKey: r.divisionKey,
            id: r.id,
            srNo: i + 1,
            bgCategoryPrefix: r.bgCategoryPrefix,
            bgCategoryPrefixMr: r.bgCategoryPrefixMr,
            bgCategoryNo: r.bgCategoryNo,
            bgCategoryNoMr: r.bgCategoryNoMr,
            bgCategoryName: r.bgCategoryName,
            bgCategoryNameMr: r.bgCategoryNameMr,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
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
    };
    if (btnSaveText === "Save") {
      console.log("_body", _body);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstBachatGatCategory/save`, _body)
        .then((res) => {
          console.log("res---", res);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("_body", _body);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstBachatGatCategory/save`, _body)
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getBachatgatCategory();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
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
          axios
            .post(`${urls.BSUPURL}/mstBachatGatCategory/delete/`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBachatgatCategory();
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
          axios
            .post(`${urls.BSUPURL}/mstBachatGatCategory/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getBachatgatCategory();
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
    bgCategoryPrefix: "",
    bgCategoryPrefixMr: "",
    bgCategoryNo: "",
    bgCategoryNoMr: "",
    bgCategoryName: "",
    bgCategoryNameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    bgCategoryPrefix: "",
    bgCategoryPrefixMr: "",
    bgCategoryNo: "",
    bgCategoryNoMr: "",
    bgCategoryName: "",
    bgCategoryNameMr: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",

      flex: 1,
    },
    // { field: "courtNo", headerName: "Court No", flex: 1 },
    // {
    //   // field: "subDivision",
    //   field:
    //   language === "en" ? "subDivision" : "subDivisionMr",
    //   headerName:
    //    <FormattedLabel id="subDivision" />,
    //   flex: 1,
    // },

    {
      field: "bgCategoryPrefix",
      headerName: "Category Prefix",

      flex: 1,
    },

    // {
    //   // field: "subDivision",
    //   field: language === "en" ? "division" : "divisionMr",
    //   headerName: <FormattedLabel id="division" />,
    //   flex: 1,
    // },

    {
      field: "bgCategoryNo",
      headerName: "Category No",

      flex: 1,
    },

    {
      field: "bgCategoryName",
      headerName: "Category Name",

      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      // <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
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
                console.log("params.row: ", params.row);
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
          {/* <FormattedLabel id="bachatgatCategory" /> */}
          BachatGat Category
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Grid container style={{ marginLeft: "50px" }}>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryPrefixEn" />}
                    label="Category Prefix (in English)"
                    id="standard-basic"
                    variant="standard"
                    {...register("bgCategoryPrefix")}
                    error={!!errors.bgCategoryPrefix}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("bgCategoryPrefix") ? true : false) ||
                        (router.query.bgCategoryPrefix ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.bgCategoryPrefix
                        ? "Category Prefix is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryPrefixMr" />}
                    label="category Prefix (in Marathi)"
                    id="standard-basic"
                    variant="standard"
                    {...register("bgCategoryPrefixMr")}
                    error={!!errors.bgCategoryPrefix}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("bgCategoryPrefixMr") ? true : false) ||
                        (router.query.bgCategoryPrefixMr ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.bgCategoryPrefix
                        ? "Category prefix is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNoEn" />}
                    label="categoryNo(in English)"
                    id="standard-basic"
                    variant="standard"
                    {...register("bgCategoryNo")}
                    error={!!errors.bgCategoryPrefix}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("bgCategoryNo") ? true : false) ||
                        (router.query.bgCategoryNo ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.bgCategoryNo
                        ? "Category No is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNoMr" />}
                    label="CategoryNo (in Marathi)"
                    id="standard-basic"
                    variant="standard"
                    {...register("bgCategoryNoMr")}
                    error={!!errors.bgcategoryNo}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("bgCategoryNoMr") ? true : false) ||
                        (router.query.categoryNoMr ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.bgCategoryNo
                        ? "Category No is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNameEn" />}
                    label="categoryName (in English)"
                    id="standard-basic"
                    variant="standard"
                    {...register("bgCategoryName")}
                    error={!!errors.bgCategoryName}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("bgCategoryName") ? true : false) ||
                        (router.query.bgCategoryName ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.bgCategoryName
                        ? "Category Name is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNameMr" />}
                    label="categoryName (in Marathi)"
                    id="standard-basic"
                    variant="standard"
                    {...register("bgCategoryNameMr")}
                    error={!!errors.categoryName}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("bgCategoryNameMr") ? true : false) ||
                        (router.query.bgCategoryNameMr ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.bgCategoryName
                        ? "Category Name is Required !!!"
                        : null
                    }
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
                      {btnSaveText === "Update"
                        ? // <FormattedLabel id="update" />
                          "Update"
                        : // <FormattedLabel id="save" />
                          "Save"}
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
                      {/* <FormattedLabel id="clear" /> */}
                      Clear
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {/* <FormattedLabel id="exit" /> */}
                      Exit
                    </Button>
                  </Grid>
                </Grid>
                {/* </div> */}
              </Grid>
            </Slide>
          )}
        </form>
      </FormProvider>

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
            setIsOpenCollapse(!isOpenCollapse);
          }}
        >
          {/* <FormattedLabel id="add" /> */}
          Add
        </Button>
      </div>

      <DataGrid
        // disableColumnFilter
        // disableColumnSelector
        // disableToolbarButton
        // disableDensitySelector
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            // printOptions: { disableToolbarButton: true },
            // disableExport: true,
            // disableToolbarButton: true,
            // csvOptions: { disableToolbarButton: true },
          },
        }}
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
        // rows={dataSource}
        // columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        //checkboxSelection

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
          getBachatgatCategory(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getBachatgatCategory(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
