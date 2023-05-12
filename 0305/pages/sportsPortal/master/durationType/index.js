import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
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
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/sportsPortalSchema/facilityTypeSchema";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import URLS from "../../../../URLS/urls";

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
  useLayoutEffect(() => {
    console.log("btnSaveText", btnSaveText);
  }, [btnSaveText]);

  const [btnSaveText, setBtnSaveText] = useState("save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getCaseType();
  }, [zoneNames, wardNames, fetchData]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    // getDepartments();
    // getSubDepartments();
  }, []);

  const onSubmitForm = (fromData) => {
    // alert("hi");

    console.log("clicked");
    // console.log('submitted form:', fromData);
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    if (btnSaveText === "save") {
      const tempData = axios.post(`${URLS.SPURL}/master/durationType/save`, _body).then((res) => {
        if (res.status == 200) {
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
    else if (btnSaveText === "update") {
      console.log("update data", _body);
      // const tempData = axios
      axios.post(`${URLS.SPURL}/durationType/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getCaseType();

          setIsOpenCollapse(false);
        }
      });
    }
  };

  const getAllTypes = () => {
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };
  const getWardNames = () => {
    axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };
  // const getDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/department/getAll`).then((r) => {
  //     setDepartments(
  //       r.data.department.map((row) => ({
  //         id: row.id,
  //         department: row.department,
  //       })),
  //     );
  //   });
  // };
  //git
  //test

  // const getSubDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/subDepartment/getAll`).then((r) => {
  //     setSubDepartments(
  //       r.data.subDepartment.map((row) => ({
  //         id: row.id,
  //         subDepartmentName: row.subDepartment,
  //       })),
  //     );
  //   });
  // };

  // Get Data By ID
  // const getDataById = (value) => {
  //   console.log("clicked");
  //   setIsOpenCollapse(false);
  //   setID(value);
  //   const tempData = axios
  //     .get(`${urls.BaseURL}/facilityMaster/getFacilityMasterData/?id=${value}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       reset(res.data);
  //       setButtonInputState(true);
  //       setIsOpenCollapse(true);
  //       setBtnSaveText("Edit");
  //     });
  // };

  // Delete By ID
  // const deleteById = async (value) => {
  //   await axios

  //     .delete(`${urls.BaseURL}/facilityType/discardFacilityType/${value}`)
  //     .then((res) => {
  //       if (res.status == 226) {
  //         message.success("Record Deleted !!!");
  //         getAllDetails();
  //         setButtonInputState(false);
  //       }
  //     });
  // };

  //Delete by ID(SweetAlert)
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
          axios.post(`${URLS.SPURL}/applicantType/saveFacilityName`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getCaseType();
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
          axios.post(`${URLS.SPURL}/applicantType/saveFacilityName`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getPaymentRate();
              getCaseType();
              // setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };
  // Get Table - Data
  const getCaseType = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${URLS.SPURL}/master/durationType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.durationType;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,

            typeName: r.typeName,
            typeNameMr: r.typeNameMr,

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

  // add like department onSubmit form
  // const onSubmitForm = (formData) => {
  //   console.log('submitted formData', formData);
  //   // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
  //   // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
  //   const finalBodyForApi = {
  //     ...formData,
  //     // fromDate,
  //     // toDate,
  //   };

  //   console.log('finalBodyForApi', finalBodyForApi);

  //   axios
  //     .post(
  //       `${URLS.SPURL}/facilityType/saveFacilityType`,
  //       finalBodyForApi
  //     )
  //     .then((res) => {
  //       console.log('save data', res);
  //       if (res.status == 200) {
  //         formData.id
  //           ? sweetAlert('Updated!', 'Record Updated successfully !', 'success')
  //           : sweetAlert('Saved!', 'Record Saved successfully !', 'success');
  //         // getDepartment();
  //         getCaseType();
  //         // setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };
  // OnSubmit Form

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
    setDeleteButtonState(false);
    setEditButtonInputState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    typeNameMr: "",
    typeName: "",
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    typeNameMr: "",
    typeName: "",
    id: "",
  };

  // Get Table - Data
  // const getAllDetails = () => {
  //   axios
  //     .get(`${URLS.SPURL}/facilityType/getAll`)
  //     .then((res) => {
  //       setDataSource(
  //         res.data.facilityType.map((r, i) => ({
  //           id: r.id,
  //           srNo: i + 1,
  //           facilityTypeId: r.facilityTypeId,
  //           geoCode: r.geoCode,
  //           zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
  //             ?.zoneName,
  //           wardName: wardNames?.find((obj) => obj?.id === r.wardName)
  //             ?.wardName,
  //           department: departments?.find((obj) => obj?.id === r.department)
  //             ?.department,
  //           subDepartment: subDepartments?.find(
  //             (obj) => obj?.id === r.subDepartment
  //           )?.subDepartment,

  //           facilityType: r.facilityType,
  //           facilityPrefix: r.facilityPrefix,
  //           facilityId: r.facilityId,
  //           remark: r.remark,
  //         }))
  //       );
  //     });
  // };

  // define colums table
  // const columns = [
  //   {
  //     field: "srNo",
  //     headerName: <FormattedLabel id="srNo" />,
  //     flex: 1,
  //   },
  //   // {
  //   //   field: "facilityTypeId",
  //   //   headerName: <FormattedLabel id=" Facility Type Id" />,
  //   //   //type: "number",
  //   //   flex: 1,
  //   // },

  //   {
  //     field: "zoneName",
  //     headerName: <FormattedLabel id="zone" />,
  //     //type: "number",
  //     flex: 1,
  //   },

  //   {
  //     field: "wardName",
  //     headerName: <FormattedLabel id="ward" />,
  //     //type: "number",
  //     flex: 1,
  //   },

  //   {
  //     field: "department",
  //     headerName: <FormattedLabel id="department" />,
  //     //type: "number",
  //     flex: 1,
  //   },
  //   {
  //     field: "facilityType",
  //     headerName: <FormattedLabel id="facilityType" />,
  //     //type: "number",
  //     flex: 1,
  //   },

  //   {
  //     field: "geoCode",
  //     headerName: <FormattedLabel id="gisCode" />,
  //     //type: "number",
  //     flex: 1,
  //   },

  //   {
  //     field: "remark",
  //     headerName: <FormattedLabel id="remark" />,
  //     flex: 1,
  //   },

  //   {
  //     field: "actions",
  //     headerName: <FormattedLabel id="actions" />,
  //     width: 120,
  //     sortable: false,
  //     disableColumnMenu: true,
  //     renderCell: (params) => {
  //       return (
  //         <Box
  //           sx={{
  //             // backgroundColor: "whitesmoke",
  //             width: "100%",
  //             height: "100%",
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //           }}
  //         >
  //           <IconButton
  //             disabled={editButtonInputState}
  //             onClick={() => {
  //               setBtnSaveText("Edit"),
  //                 // console.log(
  //                 //   "Hey ward name la pathvtiye: ",
  //                 //   params.row.wardName
  //                 // );

  //                 setID(params.row.id),
  //                 setIsOpenCollapse(true),
  //                 setSlideChecked(true);

  //               const wardId = wardNames.find(
  //                 (obj) => obj?.wardName === params.row.wardName
  //               )?.id;

  //               const zoneId = zoneNames.find(
  //                 (obj) => obj?.zoneName === params.row.zoneName
  //               )?.id;

  //               const departmentId = departments.find(
  //                 (obj) => obj?.department === params.row.department
  //               )?.id;

  //               const subDepartmentId = subDepartments.find(
  //                 (obj) => obj?.subDepartment === params.row.subDepartment
  //               )?.id;

  //               reset({
  //                 ...params.row,
  //                 wardName: wardId,
  //                 zoneName: zoneId,
  //                 department: departmentId,
  //                 subDepartment: subDepartmentId,
  //               });
  //             }}
  //           >
  //             <EditIcon />
  //           </IconButton>
  //           <IconButton
  //             disabled={deleteButtonInputState}
  //             onClick={() => deleteById(params.id)}
  //           >
  //             <DeleteIcon />
  //           </IconButton>
  //         </Box>
  //       );
  //     },
  //   },
  // ];

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    // {
    //   field: "facilityTypeId",
    //   headerName: <FormattedLabel id=" Facility Type Id" />,
    //   //type: "number",
    //   flex: 1,
    // },

    {
      field: "typeName",
      headerName: "Duration Type",
      // headerName: <FormattedLabel id=" durationTypeEn" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "typeNameMr",
      headerName: "Duration Type(MR)",
      // headerName: <FormattedLabel id=" durationTypeMr " />,
      //type: "number",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                //Facility Id Zone Ward department sub department
                // const facilityTypeIdd = facilityNames.find(
                //   (obj) => obj?.facilityName === params.row.facilityName
                // )?.id;
                const zoneId = zoneNames.find((obj) => obj?.zoneName === params.row.zoneName)?.id;
                // const departmentId = departments.find((obj) => obj?.department === params.row.department)?.id;
                // const subDepartmentId = subDepartments.find(
                //   (obj) => obj?.subDepartment === params.row.subDepartment,
                // )?.id;
                const wardId = wardNames.find((obj) => obj?.wardName === params.row.wardName)?.id;
                const facilityTypeIdd = params.row.id;
                reset({
                  ...params.row,
                  wardName: wardId,
                  // subDepartment: subDepartmentId,
                  // department: departmentId,
                  zoneName: zoneId,
                  facilityTypeId: facilityTypeIdd,
                });

                // console.log('params.row: ', params.row);
                // reset(params.row);
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

  // View
  return (
    <>
      <Paper sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.main}>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="durationTypeEn" />}
                          // label="Duration Type"
                          variant="standard"
                          sx={{ width: 220 }}
                          {...register("typeName")}
                          error={!!errors.facilityTypeId}
                          helperText={errors?.facilityTypeId ? "Facility Type Id  is Required !!!" : null}
                        />
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="durationTypeMr" />}
                          // label="Duration Type (MR)"
                          variant="standard"
                          sx={{ width: 220 }}
                          {...register("typeNameMr")}
                          error={!!errors.facilityTypeId}
                          helperText={errors?.facilityTypeId ? "Facility Type Id  is Required !!!" : null}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.btn}>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText}
                      {/* <FormattedLabel id="save" /> */}
                    </Button>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
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
              setBtnSaveText("save");
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
          disableColumnFilter
          disableColumnSelector
          // disableToolbarButton
          disableDensitySelector
          components={{ Toolbar: GridToolbar }}
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
            getCaseType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getCaseType(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
