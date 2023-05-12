import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Backdrop, Box, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import swal from "sweetalert";
import * as yup from "yup";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/cfc/cfc.module.css";

const DepartmentUserList = () => {
  const language = useSelector((state) => state.labels.language);

  let schema = yup.object().shape({
    // fromDate:yup.string().required("From Date is Required !!!"),
  });
  const [adminUsers, setAdminUsers] = useState([]);
  const router = useRouter();

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [_departmentList, _setDepartmentList] = useState([]);
  const [_designationList, _setDesignationList] = useState([]);

  const [load, setLoad] = useState(false);

  const exitBack = () => {
    router.back();
  };

  const handleLoad = () => {
    setLoad(false);
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
        if (willDelete === true) {
          axios.post(`${urls.CFCURL}/master/user/discard`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 226) {
              swal("Record is Successfully Inactivated!", {
                icon: "success",
              });
              getDepartmentUsers();
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
        if (willDelete === true) {
          axios.post(`${urls.CFCURL}/master/user/discard`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 226) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              getDepartmentUsers();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      width: 90,
      cellClassName: "super-app-theme--cell",

      // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },

    {
      field: language === "en" ? "userNameColEn" : "userNameColMr",
      headerName: <FormattedLabel id="userName" />,
      width: 260,
    },
    {
      field: "email",
      headerName: <FormattedLabel id="userEmail" />,
      width: 290,
    },

    {
      field: "mobileNo",
      headerName: <FormattedLabel id="mobileNo" />,
      width: 190,
    },
    {
      field: "userName",
      headerName: <FormattedLabel id="userN" />,
      width: 190,
    },
    // {
    //   field: "primaryOffice",
    //   headerName: <FormattedLabel id="userN" />,
    //   width: 190,
    // },
    // {
    //   field: "primaryDepartment",
    //   headerName: <FormattedLabel id="userN" />,
    //   width: 190,
    // },
    // {
    //   field: "primaryDesignation",
    //   headerName: <FormattedLabel id="userN" />,
    //   width: 190,
    // },
    // {
    //   field: language === "en" ? "primaryOfficeFeild" : "primaryOfficeFeildMr",
    //   headerName: <FormattedLabel id="primaryLocationName" />,
    //   width: 150,
    // },
    // {
    //   field: language === "en" ? "primaryDepartmentFeild" : "primaryDepartmentFeildMr",
    //   headerName: <FormattedLabel id="primaryDepartmentName" />,
    //   width: 190,
    // },
    // {
    //   field: language === "en" ? "primaryDesignationFeild" : "primaryDesignationFeildMr",
    //   headerName: <FormattedLabel id="primaryDesignationName" />,
    //   width: 140,
    // },

    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      width: 340,
      // flex: 1,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      headerAlign: "center",
      align: "center",
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
            <Box>
              <Tooltip title="View">
                <IconButton
                  onClick={(e) => {
                    console.log("e", e, "params", params.row);
                    router.push({
                      pathname: "./departmentUserRegister",
                      query: { ...params.row, mode: "view" },
                      pageMode: "Add",
                    });
                  }}
                >
                  <VisibilityIcon style={{ fontSize: "20px" }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              {/* <Tooltip title="Edit">
                <IconButton
                  onClick={() => {
                    console.log("params", params.row);
                    router.push({
                      pathname: "./departmentUserRegister",
                      query: { ...params.row, mode: "edit" },
                    });
                  }}
                >
                  <EditIcon style={{ fontSize: "20px" }} />
                </IconButton>
              </Tooltip> */}
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => {
                      console.log("EditIcon", params.row);
                      router.push({
                        pathname: "./departmentUserRegister",
                        query: { ...params.row, mode: "edit" },
                      });
                    }}
                  >
                    <Tooltip title="Edit">
                      <EditIcon style={{ color: "#556CD6" }} />
                    </Tooltip>
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip sx={{ margin: "8px" }}>
                  <EditIcon style={{ color: "gray" }} disabled={true} />
                </Tooltip>
              )}
            </Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  // setID(params.row.id),
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
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
            <Tooltip title="Give Access Control">
              <IconButton
                onClick={() => {
                  console.log("params.row.id", params.row);
                  router.push({
                    pathname: "./userRoleRight",
                    query: { ...params.row, mode: "edit" },
                    // pageMode: "Edit",
                  });
                }}
              >
                <Button
                  size="small"
                  // variant="contained"
                  // className={styles.click}
                  endIcon={<LockIcon />}
                  sx={{
                    border: "1px solid #5499C7",
                    backgroundColor: "#ecf0f1",
                    textTransform: "capitalize",
                  }}
                >
                  {<FormattedLabel id="menuAccessToUser" />}
                </Button>
                {/* User Role Rights */}
                {/* <LockIcon style={{ fontSize: "20px" }} /> */}
              </IconButton>
            </Tooltip>
          </Box>
        );
        // } else return null;
      },
    },
    // { field: "role", headerName: "Role", width: 300 },
  ];

  useEffect(() => {
    getDepartmentName();
    getDesignationName();
    getOfficeLocation();
  }, []);

  const [officeLocationList, setOfficeLocationList] = useState([]);

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(
            // r.data.officeLocation.map((val) => val.officeLocationName)
            r.data.officeLocation,
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getDepartmentUsers();
  }, [departmentList, designationList]);

  const [loading, setLoading] = useState(false);

  const getDepartmentUsers = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    setLoad(true);

    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setLoad(false);
          console.log("res888", res.data.user);
          console.log("pageNo", _pageNo);
          let result = res.data.user;
          let _res = result.map((val, i) => {
            return {
              srNo: i + 1 + _pageNo * _pageSize,
              activeFlag: val.activeFlag,
              officeDepartmentDesignationUserDaoLst: val.officeDepartmentDesignationUserDaoLst,
              id: val.id,
              application: val.applications ? val.applications : "Not Available",
              email: val.email ? val.email : "Not Available",
              role: val.roles ? val.roles : "Not Available",
              userName: val.userName,
              userNameColEn: val.firstNameEn
                ? val.firstNameEn + " " + val.middleNameEn + " " + val.lastNameEn
                : "Not Available",

              userNameColMr: val.firstNameMr
                ? val.firstNameMr + " " + val.middleNameMr + " " + val.lastNameMr
                : "Not Available",

              department: val.department,
              department: _departmentList[val.department] ? _departmentList[val.department] : "-",

              // department: departmentList?.find((d)=>d.id===val.department)?.department,

              dept: val.department,
              desig: val.designation,
              // designation: _designationList[val.designation] ? _designationList[val.designation] : "-",
              designation: val.designation,
              mobileNo: val.phoneNo,
              firstName: val.firstNameEn,
              middleName: val.middleNameEn,
              lastName: val.lastNameEn,
              firstNameMr: val.firstNameMr,
              middleNameMr: val.middleNameMr,
              lastNameMr: val.lastNameMr,
              empCode: val.empCode,
              isDepartmentUser: val.deptUser,
              isCfcUser: val.cFCUser,
              isOtherUser: val.otherUser,
              // useFeildArray
              locationName: val.locationName,
              departmentName: val.departmentName,
              designationName: val.designationName,

              // primaryDepartment: val.primaryDepartment,
              // primaryDesignation: val.primaryDesignation,
              // primaryOffice: val.primaryOffice,

              // primaryDepartmentFeild: departmentList.find((f) => f.id == val.primaryDepartment)?.department,
              // primaryDepartmentFeildMr: departmentList.find((f) => f.id == val.primaryDepartment)
              //   ?.departmentMr,
              // primaryDesignationFeild: _designationList.find((f) => f.id == val.primaryDesignation)
              //   ?.designation,
              // primaryDesignationFeildMr: _designationList.find((f) => f.id == val.primaryDesignation)
              //   ?.designationMr,
              // primaryOfficeFeild: officeLocationList.find((f) => f.id == val.primaryOffice)
              //   ?.officeLocationName,
              // primaryOfficeFeildMr: officeLocationList.find((f) => f.id == val.primaryOffice)
              //   ?.officeLocationNameMar,
            };
          });
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });

          // setAdminUsers(
          //   r.data.map((val) => {
          //     return {
          //       id: val.id,
          //       srNo: val.id,
          //       application: val.application
          //         ? val.application
          //         : "Not Available",
          //       email: val.email ? val.email : "Not Available",
          //       role: val.role ? val.role : "Not Available",
          //       userName: val.firstNameEn
          //         ? val.firstNameEn + val.middleNameEn + val.lastNameEn
          //         : "Not Available",
          //       department: val.department,
          //       designation: val.designation,
          //       mobileNo: val.phoneNo,
          //       firstName: val.firstNameEn,
          //       middleName: val.middleNameEn,
          //       lastName: val.lastNameEn,
          //       empCode: val.empCode,
          //       isDepartmentUser: val.deptUser,
          //       isCfcUser: val.cfcuser,
          //       isOtherUser: val.otherUser,
          //     };
          //   })
          // );
        } else {
          message.error("Data Loading... !");
        }
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
        toast("Data load", {
          type: "error",
        });
      });
  };

  const getDepartmentName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res department", r);
          let departments = {};
          r.data.department.map((r) => (departments[r.id] = r.department));
          console.log("departments", departments);
          _setDepartmentList(departments);
          setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const getDesignationName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/designation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res designation", r);
          let designations = {};
          r.data.designation.map((r) => (designations[r.id] = r.designation));
          _setDesignationList(designations);
          setDesignationList(r.data.designation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "33%" }}>
            {<FormattedLabel id="departmentUserList" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            onClick={() => {
              router.push("./departmentUserRegister");
            }}
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        style={{
          height: "auto",
          overflow: "auto",
          width: "100%",
        }}
      >
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => row.srNo}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            "& .super-app-theme--cell": {
              backgroundColor: "#E3EAEA",
              borderLeft: "10px solid white",
              borderRight: "10px solid white",
              borderTop: "4px solid white",
            },
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              // transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E3EAEA",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-column": {
              backgroundColor: "red",
            },
          }}
          pagination
          paginationMode="server"
          // loading={data.loading}
          rowCount={data.totalRows == undefined ? [] : data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getDepartmentUsers(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getDepartmentUsers(_data, data.page);
          }}
        />
      </Box>
    </>
  );
};

export default DepartmentUserList;
