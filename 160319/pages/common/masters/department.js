import {
  Button,
  Divider,
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
import schema from "../../../containers/schema/common/Department";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import styles from "../../../styles/[department].module.css";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

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
  const [zones, setZones] = useState([]);

  useEffect(() => {
    getDepartment();
  }, [zones]);

  useEffect(() => {
    // getZone();
  }, []);

  const getDepartment = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        console.log(";res", res);

        let result = res.data.department;
        setDataSource(
          result.map((res, i) => {
            return {
              activeFlag: res.activeFlag,
              srNo: i + 1,
              id: res.id,
              department: res.department,
              departmentMr: res.departmentMr,
              description: res.description,
              // descriptionMr: res.descriptionMr,
              // zoneId: res.zoneId,
              // status: res.status,
              // zoneName: zones?.find((obj) => {
              //   return obj?.id === res.zoneId;
              // })?.zoneName,
              status: res.activeFlag === "Y" ? "Active" : "InActive",
            };
          }),
        );

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

  // const getZone = () => {
  //   axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
  //     setZones(
  //       res.data.zone.map((r, i) => ({
  //         id: r.id,
  //         zoneName: r.zoneName,
  //         zoneNameMr: r.zoneNameMr,
  //       }))
  //     );
  //   });
  // };

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
          axios.post(`${urls.CFCURL}/master/department/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });
              getDepartment();
              // getZone();
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
          axios.post(`${urls.CFCURL}/master/department/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getDepartment();
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
    // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      // fromDate,
      // toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.CFCURL}/master/department/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 200) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getDepartment();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  const resetValuesExit = {
    zoneId: null,
    department: "",
    departmentMr: "",
    description: "",
    descriptionMr: "",
    status: "",
    activeFlag: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    zoneId: null,
    department: "",
    departmentMr: "",
    description: "",
    descriptionMr: "",
    status: "",
    activeFlag: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    {
      field: "department",
      headerName: <FormattedLabel id="department" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },

    {
      field: "departmentMr",
      headerName: <FormattedLabel id="departmentMr" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    // {
    //   field: "zoneName",
    //   headerName: <FormattedLabel id="zoneId" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 100,
    // },

    {
      field: "description",
      headerName: <FormattedLabel id="description" />,
      // type: "number",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 1,
      minWidth: 100,
    },
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
                // const { zoneName, ...rest } = params.row;
                // reset({ ...rest });

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
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        Department
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper style={{ margin: "50px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={4}
                  // sx={{ marginTop: 5 }}
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
                    label={<FormattedLabel id="department" />}
                    // label="Recharge Amount"
                    variant="standard"
                    {...register("department")}
                    error={!!errors.department}
                    helperText={errors?.department ? errors.department.message : null}
                  />
                </Grid>

                <Grid
                  item
                  xs={4}
                  // sx={{ marginTop: 5 }}
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
                    label={<FormattedLabel id="departmentMr" />}
                    // label="Recharge Amount"
                    variant="standard"
                    {...register("departmentMr")}
                    error={!!errors.departmentMr}
                    helperText={errors?.departmentMr ? errors.departmentMr.message : null}
                  />
                </Grid>

                {/* <Grid
                  Zone
                  Name
                  xs={4}
                  // sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    // fullWidth
                    sx={{ width: "35%" }}
                    error={!!errors.zoneId}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="zoneId" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          variant="standard"
                          onChange={(value) => field.onChange(value)}
                          // label="Payment Mode"
                        >
                          {zones &&
                            zones.map((zoneId, index) => {
                              return (
                                <MenuItem key={index} value={zoneId.id}>
                                  {zoneId.zoneName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="zoneId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.zoneId ? errors.zoneId.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}

                <Grid
                  item
                  xs={4}
                  // sx={{ marginTop: 5, marginLeft: 20 }}
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
                    // label="CFC User Remark"
                    label={<FormattedLabel id="description" />}
                    variant="standard"
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors?.description ? errors.description.message : null}
                  />
                </Grid>
              </Grid>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    {<FormattedLabel id={btnSaveText} />}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
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
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={9}></Grid>
          <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
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
        {console.log("11111", dataSource)}
        <DataGrid
          autoHeight
          sx={{
            margin: 5,
          }}
          rows={dataSource}
          // rows={abc}
          // rows={jugaad}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => {
            getDepartment(newPageSize);
            setPageSize(newPageSize);
          }}
          onPageChange={(e) => {
            console.log("event", e);
            getDepartment(pageSize, e);
            console.log("dataSource->", dataSource);
          }}
          // {...dataSource}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          rowCount={totalElements}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
