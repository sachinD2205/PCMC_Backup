import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/common/ServiceChecklist";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

const ServiceChecklist = () => {
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
  const [departmentList, setDepartmentList] = useState([]);
  const [_departmentList, _setDepartmentList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [_serviceList, _setServiceList] = useState([]);
  const [usageTypeList, setUsageTypeList] = useState([]);
  const [_usageTypeList, _setUsageTypeList] = useState([]);

  const [documentList, setDocumentList] = useState([]);
  const [_documentList, _setDocumentList] = useState([]);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);
  const lang = useSelector((state) => state.user.lang);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getDepartmentName();
    getServiceName();
    getServiceChecklist();
    getUsageType();
    getDocumentName()

  }, []);

  const getServiceChecklist = async (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    await axios
      .get(`${urls.BaseURL}/serviceWiseChecklist/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log(";res", res);

        let result = res.data.serviceWiseChecklist;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            activeFlag: val.activeFlag,
            srNo: val.id,
            // documentName: val.documentName,
            // usageType: val.usageType,
            id: val.id,
            // documentChecklistEn:val.documentChecklistEn,
            // documentChecklistMr:val.documentChecklistMr,
            //  service: val.service,
            service: _serviceList[val.service]
              ? _serviceList[val.service]
              : "-",
              usageType: _usageTypeList[val.usageType]
              ? _usageTypeList[val.usageType]
              : "-",

              document: documentList[val.document]
              ? documentList[val.document].documentChecklistMr
              : "-",

            // service:val.service ? val.service :"-",
          //   department: departmentList[val.department]
          // ? departmentList[val.department]:"-",
          department: departmentList[val.department]
              &&  departmentList[val.department].departmentMr,
            
            // department: val.department ? val.department :"-",

            isDocumentMandetory:
              val.isDocumentMandetory === true ? "true" : "false",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  const getDepartmentName = async () => {
    await axios
      .get(`${urls.BaseURL}/department/getAll`)

    
      .then((r) => {
        if (r.status == 200) {
          console.log("res department", r);
          let department = {};
          r.data.department.map((r) => (department[r.id] = r.departmentName));
          // _setDepartmentList(department);
          setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getServiceName = async () => {
    await axios
      .get(`${urls.BaseURL}/service/getAll`)

      .then((r) => {
        if (r.status == 200) {
          let services = {};
          r.data.service.map((r) => (services[r.id] = r.serviceName));
          _setServiceList(services);
          //   setServices(r.data.service);
          // setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getUsageType = async () => {
    await axios
      .get(`${urls.BaseURL}/usageType/getAll`)

    
      .then((r) => {
        if (r.status == 200) {
          console.log("res usageType", r);
          let usageType = {};
          r.data.usageType.map((r) => (usageType[r.id] = r.usageType));
          _setUsageTypeList(usageType);
          // setUsageTypeList(r.data.usageType);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDocumentName = async () => {
    await axios
      .get(`${urls.BaseURL}/documentMaster/getAll`)

    
      .then((r) => {
        if (r.status == 200) {
          console.log("res documentMaster", r);
          let documents = {};
          r.data.documentMaster.map((r) => (documents[r.id] = r.documentChecklistMr));
          // _setDocumentList(documents);
          setDocumentList(r.data.documentMaster);
        }
      })
      .catch((err) => {
        console.log("err", err);
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
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${urls.BaseURL}/serviceWiseChecklist/save`,body
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getServiceChecklist();
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
          axios
            .post(
              `${urls.BaseURL}/serviceWiseChecklist/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                getServiceChecklist();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    // departmentName: "",
    // serviceName: "",
    documentChecklist: "",
    service:"",
    department:"",
    documentChecklistMr:"",
    usageType:"",
    document:'',
    isDocumentMandetory:""
   
    // usageType:""
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
    const finalBodyForApi = {
      ...formData,
      // activeFlag: btnSaveText === "Update" ? null : null,
    };

  //   // console.log("finalBodyForApi", finalBodyForApi);

  //   axios
  //     .post(
  //       `${urls.BaseURL}/serviceWiseChecklist/save`,
  //       finalBodyForApi
  //     )
  //     .then((res) => {
  //       console.log("save data", res);
  //       if (res.status == 200) {
  //         formData.id
  //           ? sweetAlert("Updated!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         getServiceChecklist();
  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };
  

  // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----");
      axios
        .post(
          `${urls.BaseURL}/serviceWiseChecklist/save`,
          finalBodyForApi
        )
        .then((res) => {
          console.log("save res", res);
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            getServiceChecklist();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("Put -----");
      axios
        .post(
          `${urls.BaseURL}/serviceWiseChecklist/save`,
          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            // getServiceChecklist();
            // setButtonInputState(false);
            // setIsOpenCollapse(false);
            getServiceChecklist();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        });
    }

  }
  
  const resetValuesExit = {
    documentChecklist: "",
    service:"",
    department:"",
    documentChecklistMr:"",
    usageType:"",
    document:'',
    isDocumentMandetory:""
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      //   flex: 1,
      width: 60,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "department",
      headerName: <FormattedLabel id="department" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "service",
      headerName: <FormattedLabel id="service" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "usageType",
      headerName: <FormattedLabel id="usageType" />,
      // type: "number",
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "document",
      headerName: " Document Name",
      // type: "number",
      width: 160,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "isDocumentMandetory",
      headerName: <FormattedLabel id="isDocumentMandetory" />,
      width: 60,
      align: "center",
      headerAlign: "center",
    },
  
  
    // {
    //   field: "documentChecklistEn",
    //   headerName: <FormattedLabel id="documentChecklistEn" />,
    //   // type: "number",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "documentChecklistMr",
    //   headerName: <FormattedLabel id="documentChecklistMr" />,
    //   // type: "number",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },

  
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
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
              <EditIcon style={{ color: "#556CD6" }} />
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
     Service Checklist
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
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Department Name
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Department Name"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {departmentList.length > 0
                            ? departmentList.map((department, index) => {
                                return (
                                  <MenuItem key={index} value={department.id}>
                                    {lang === "en"
                                      ? department.department
                                      : department.departmentMr}
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="department"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.department
                        ? errors.department.message
                        : null}
                    </FormHelperText>
                  </FormControl>
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
                  <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Service Name
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Service Name"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleRoleNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {serviceList.length > 0
                            ? serviceList.map((service, index) => {
                                return (
                                  <MenuItem key={index} value={service.id}>
                                    {service.serviceName}
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="service"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.service ? errors.service.message : null}
                    </FormHelperText>
                  </FormControl>
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
                  <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                    Usage Type
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Usage Type"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleRoleNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {usageTypeList.length > 0
                            ? usageTypeList.map((usageType, index) => {
                                return (
                                  <MenuItem key={index} value={usageType.id}>
                                    {usageType.usageType}
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="usageType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.usageType ? errors.usageType.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
               


              </Grid>

              <Grid container style={{ padding: "10px" }}>

             


                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                    Document Name
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="document"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleRoleNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {documentList.length > 0
                            ? documentList.map((document, index) => {
                                return (
                                  <MenuItem key={index} value={document.id}>
                                    {/* {document.documentChecklistEn} */}

                                    {lang === "en"
                                      ? document.document
                                      : document.documentChecklistMr}
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="document"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.document ? errors.document.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>



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
                    label={<FormattedLabel id="documentChecklist" />}
                    variant="outlined"
                    {...register("documentChecklist")}
                    error={!!errors.documentChecklist}
                    helperText={
                      errors?.documentChecklist
                        ? errors.documentChecklist.message
                        : null
                    }
                  />
                </Grid> */}

                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >

<FormControlLabel
  sx={{ width: "150px", marginTop: "2%" }}
          value="start"
          control={<Checkbox />}
          label="isDocumentMandetory"
          labelPlacement="isDocumentMandetory"
        />

                  </Grid>
              
              </Grid>

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
                    label={<FormattedLabel id="documentChecklistMr" />}
                    variant="outlined"
                    {...register("documentChecklistMr")}
                    error={!!errors.documentChecklistMr}
                    helperText={
                      errors?.documentChecklistMr
                        ? errors.documentChecklistMr.message
                        : null
                    }
                  />
                </Grid> */}

              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={4}
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
                    <FormattedLabel id={btnSaveText} />
                  </Button>
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
          <Grid
            item
            xs={2}
            style={{ display: "flex", justifyContent: "center" }}
          >
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
              <FormattedLabel id="add" />
            </Button>
          </Grid>
        </Grid>

        <Box style={{ height: "auto", overflow: "auto" }}>
          <DataGrid
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
            autoHeight={true}
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
              getServiceChecklist(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getServiceChecklist(_data, data.page);
            }}
          />
        </Box>

        {/* <DataGrid
            autoHeight
            sx={{
              margin: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              getBillType(newPageSize);
              setPageSize(newPageSize);
            }}
            onPageChange={(e) => {
              console.log("event", e);
              setPageNo(e);
              setTotalElements(res.data.totalElements);
              console.log("dataSource->", dataSource);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            rowCount={totalElements}
          /> */}
      </Paper>
    </>
  );
};

export default ServiceChecklist;
