import {
  Button,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import applicantTypeMasterSchema from "../../../../containers/schema/grievanceMonitoring/applicantTypeMasterSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../../URLS/urls";
import { GridToolbar } from "@mui/x-data-grid";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(applicantTypeMasterSchema) });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();

  useEffect(() => {
    getOwnershipType();
  }, []);

  const getOwnershipType = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.GM}/master/applicantType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        console.log(";res", res.data.applicantType);

        let result = res.data.applicantType;
        const _res = result.map((res, i) => {
          console.log("@@@", res);
          return {
            srNo: i + 1,
            id: res.id,

            applicantTypeMr: res.applicantTypeMr,
            applicantType: res.applicantType,
            templateData: res.templateData,
            templateDataMr: res.templateDataMr,
            remark: res.remark,
            remarkMr: res.remarkMr,
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
        });
        console.log("RRRRRRr " + _res);
        setDataSource([..._res]);

        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.GM}/master/applicantType/save`, body).then((res) => {
            console.log("delet res", res.status);
            if (res.status == 200) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });
              getOwnershipType();
              setButtonInputState(false);
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
          axios.post(`${urls.GM}/master/applicantType/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getOwnershipType();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

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

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.GM}/master/applicantType/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 200) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getOwnershipType();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  const resetValuesExit = {
    applicantTypeMr: "",
    applicantType: "",
    templateData: "",
    templateDataMr: "",
    remark: "",
    remarkMr: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    applicantTypeMr: "",
    applicantType: "",
    templateData: "",
    templateDataMr: "",
    remark: "",
    remarkMr: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    {
      field: "applicantType",
      headerName: <FormattedLabel id="applicantType" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    // {
    //   field: "templateData",
    //   headerName: <FormattedLabel id="templateData" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 150,
    // },
    // {
    //   field: "remark",
    //   headerName: <FormattedLabel id="remark" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 250,
    // },
    // {
    //   field: "toDate",
    //   headerName: <FormattedLabel id="toDate" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 250,
    // },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
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
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <>
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
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            {/* Ownership Type */}
            <h2>
              {" "}
              <FormattedLabel id="applicantType" />
            </h2>
          </Box>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container>
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <TextField
                      // size="small"
                      sx={{ width: "250px" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="applicantType" />}
                      variant="standard"
                      {...register("applicantType")}
                      error={!!errors.applicantType}
                      helperText={errors?.applicantType ? errors.applicantType.message : null}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <TextField
                      sx={{ width: "250px" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="applicantTypeMr" />}
                      variant="standard"
                      {...register("applicantTypeMr")}
                      error={!!errors.applicantTypeMr}
                      helperText={errors?.applicantTypeMr ? errors.applicantTypeMr.message : null}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3} style={{ padding: "10px" }}></Grid>

                  {/* <Grid
                    item xs={12} sm={6} md={4} lg={4} xl={4} sx={{ marginTop: 5 }}>
                    <TextField
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="templateData" />}
                      variant="standard"
                      {...register("templateData")}
                      error={!!errors.templateData}
                      helperText={
                        errors?.templateData ? errors.templateData.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4} sx={{ marginTop: 5 }}>
                    <TextField
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="templateDataMr" />}
                      variant="standard"
                      {...register("templateDataMr")}
                      error={!!errors.templateDataMr}
                      helperText={
                        errors?.templateDataMr ? errors.templateDataMr.message : null
                      }
                    />
                  </Grid> */}

                  {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="remark" />}
                    variant="standard"
                    {...register("remark")}
                    error={!!errors.remark}
                    helperText={
                      errors?.remark ? errors.remark.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="remarkMr" />}
                    variant="standard"
                    {...register("remarkMr")}
                    error={!!errors.remarkMr}
                    helperText={
                      errors?.remarkMr ? errors.remarkMr.message : null
                    }
                  />
                </Grid> */}

                  {/* </Grid> */}

                  {/* <Grid container style={{ padding: "10px" }}> */}
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
                        {btnSaveText === "Update" ? (
                          <FormattedLabel id="update" />
                        ) : (
                          <FormattedLabel id="save" />
                        )}
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
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Divider /> */}
              </form>
            </Slide>
          )}

          <Grid container style={{ padding: "10px" }}>
            {/* <Grid item xs={10}></Grid> */}
            <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
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
                <FormattedLabel id="add" />{" "}
              </Button>
            </Grid>
          </Grid>
          <DataGrid
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
            density="compact"
            pagination
            paginationMode="server"
            rowCount={totalElements}
            rowsPerPageOptions={[5]}
            pageSize={pageSize}
            rows={dataSource}
            columns={columns}
            onPageChange={(_data) => {
              getOwnershipType(pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getOwnershipType(pageSize, _data);
            }}
            //checkboxSelection
          />
        </Paper>
      </>
    </>
  );
};

export default Index;
