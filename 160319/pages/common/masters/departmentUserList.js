import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import axios from "axios";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import styles from "../../../styles/[DepartmentUserList].module.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import swal from "sweetalert";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import { Typography } from "antd";

const DepartmentUserList = () => {
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
      headerName: "Sr No.",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    // { field: "id", headerName: "Number", width: 100 },
    // { field: "application", headerName: "Application", width: 200 },
    {
      field: "username",
      headerName: "User Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "department",
    //   headerName: "Department",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "designation",
    //   headerName: "designation",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
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
              <Tooltip title="Edit">
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
              </Tooltip>
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
                <LockIcon style={{ fontSize: "20px" }} />
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
  }, []);

  useEffect(() => {
    getDepartmentUsers();
  }, [departmentList, designationList]);

  const getDepartmentUsers = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          console.log("res", res.data.user);
          console.log("pageNo", _pageNo);
          let result = res.data.user;
          let _res = result.map((val, i) => {
            return {
              srNo: Number(_pageNo + "0") + i + 1,
              activeFlag: val.activeFlag,
              officeDepartmentDesignationUserDaoLst: val.officeDepartmentDesignationUserDaoLst,
              id: val.id,
              application: val.applications ? val.applications : "Not Available",
              email: val.email ? val.email : "Not Available",
              role: val.roles ? val.roles : "Not Available",
              username: val.firstNameEn
                ? val.firstNameEn + " " + val.middleNameEn + " " + val.lastNameEn
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
              employeeCode: val.empCode,
              isDepartmentUser: val.deptUser,
              isCfcUser: val.cFCUser,
              isOtherUser: val.otherUser,
              // useFeildArray
              locationName: val.locationName,
              departmentName: val.departmentName,
              designationName: val.designationName,
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
          //       username: val.firstNameEn
          //         ? val.firstNameEn + val.middleNameEn + val.lastNameEn
          //         : "Not Available",
          //       department: val.department,
          //       designation: val.designation,
          //       mobileNo: val.phoneNo,
          //       firstName: val.firstNameEn,
          //       middleName: val.middleNameEn,
          //       lastName: val.lastNameEn,
          //       employeeCode: val.empCode,
          //       isDepartmentUser: val.deptUser,
          //       isCfcUser: val.cfcuser,
          //       isOtherUser: val.otherUser,
          //     };
          //   })
          // );
        } else {
          message.error("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Failed ! Please Try Again !", {
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
      <div
        style={{
          height: "90%",
          width: "100%",
          paddingLeft: "50px",
          paddingRight: "50px",
          paddingBottom: "50px",
        }}
      >
        {/* <Box sx={{ width: "100%", backgroundColor: "#556CD6" }}>
            <Typography sx={{ color: "white" }}>Department User List</Typography>
          </Box> */}
        <Box sx={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              width: "100%",
              fontSize: 19,
              // marginTop: 30,
              // marginBottom: 30,
              padding: 8,
              margin: 8,
              // paddingLeft: 30,
              // marginLeft: "40px",
              // marginRight: "65px",
              borderRadius: 100,
              backgroundColor: "#556CD6",
            }}
          >
            Department User List
          </div>
          <Button
            variant="contained"
            onClick={() => {
              router.push("./departmentUserRegister");
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        {/* <Box p={1} spacing={2} style={{ display: "flex", justifyContent: "end" }}> */}

        {/* </Box> */}
        <Box style={{ overflowX: "scroll", display: "flex" }}>
          <DataGrid
            sx={{
              backgroundColor: "white",
              // overflowY: "scroll",

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
              getDepartmentUsers(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getDepartmentUsers(_data, data.page);
            }}
          />
        </Box>
        {/* <Box style={{ height:'100%'}}>
        <DataGrid
          rows={
            adminUsers.length > 0
              ? adminUsers.map((val) => {
                  return { ...val };
                })
              : []
          }
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          //   checkboxSelection
        />
      </Box> */}
      </div>
    </>
  );
};

export default DepartmentUserList;
