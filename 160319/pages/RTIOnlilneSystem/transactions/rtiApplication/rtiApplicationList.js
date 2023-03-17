import {
    Button,
    Grid,
    IconButton,
    Box,
    Paper,
} from "@mui/material";
import moment from "moment";

import VisibilityIcon from "@mui/icons-material/Visibility"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux"
const Index = () => {
    const {
        watch,
        formState: { errors },
    } = useForm({
        // resolver: yupResolver(transferMediumMasterSchema)
    });


    const router1 = useRouter()

    const [buttonInputState, setButtonInputState] = useState();
    const [dataSource, setDataSource] = useState([]);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [slideChecked, setSlideChecked] = useState(false);
    const [id, setID] = useState();
    const router = useRouter();
    const [pageSize, setPageSize] = useState();
    const [totalElements, setTotalElements] = useState();
    const [pageNo, setPageNo] = useState();
    const [departments, setDepartments] = useState([]);
    let user = useSelector((state) => state.user.user)
    // const [statusVal, setStatus]=useState(null)
    // const usersDepartmentDashboardData = useSelector((state) => {
    //     return state.user.usersDepartmentDashboardData.userDao.department;
    // });


    // const user = useSelector((state) => {
    //     console.log("userDetails", state?.user?.user?.userDao?.id)
    //     return state?.user?.user?.userDao?.id
    // })
    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")

    );
    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    console.log("authority", authority);

    const userCitizen = useSelector((state) => {
        console.log("userDetails", state?.user?.user?.userDao?.id)
        return state?.user?.user?.id
    })

    const userCFC = useSelector((state) => {
        console.log("userDetails", state?.user?.user?.userDao?.id)
        return state?.user?.user?.id
    })
    const logedInUser = localStorage.getItem("loggedInUser")

    const handelParams = (key) => {
        if (key === "departmentUser") {
            return user
        } else if (key === "citizenUser") {
            return userCitizen
        } else if (key === "cfcUser") {
            return userCFC
        }
    }


    useEffect(() => {
        getDepartments();

    }, []);
    useEffect(() => {
        if (logedInUser === 'departmentUser') {
            if (authority && authority.find((val) => val === "RTI_ADHIKARI")) {
                getApplicationListByDept()
            } else {
                getApplicationDetails();
            }
        } else {
            getApplicationDetails();
        }
    }, [window.location.reload]);

    useEffect(() => {
        if (logedInUser === 'departmentUser') {
            if (authority && authority.find((val) => val === "RTI_ADHIKARI")) {
                getApplicationListByDept()
            } else {
                getApplicationDetails();
            }
        } else {
            getApplicationDetails();
        }
    }, []);


    const getDepartments = () => {
        axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
            setDepartments(
                r.data.department.map((row) => ({
                    id: row.id,
                    department: row.department,
                }))
            );
        });
    };


    const getApplicationListByDept = (_pageSize = 10, _pageNo = 0) => {
        axios
            .get(`${urls.RTI}/trnRtiApplication/getAllByDepartmet`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                }, headers: {
                    Authorization: `Bearer ${user.token}`,
                    // UserId: user.id
                }
            })
            .then((res, j) => {
                let result = res.data.trnRtiApplicationList;
                const _res = result.map((res, i) => {
                    console.log("TTTTTTTTTTTTTTTT " + i + 1)
                    // setStatus(res.status)
                    return {
                        // srNo: i + 1,
                        srNo: (i + 1) + (_pageNo * _pageSize),

                        id: res.id,
                        applicationNo: res.applicationNo,
                        // departmentName: departments.find((obj) => { return obj.id == r.departmentKey }) ? departments.find((obj) => { return obj.id == r.departmentKey }).department : "-",
              
                        departmentName: departments?.find((obj) => { return obj.id == res.departmentKey }) ? departments.find((obj) => { return obj.id == res.departmentKey }).department : "-",
                        createdDate: res.createdDate,
                        description: res.description,
                        subject: res.subject,
                        applicationDate: moment(
                            res.applicationDate,

                        ).format("DD-MM-YYYY"),
                        statusVal: res.status,
                        status: res.status == 2 ? "Send For Payment"
                            : res.status == 3 ? "In Progress"
                                : res.status == 4 ? "LOI Generated"
                                    : res.status == 5 ? "Payment Received"
                                        : res.status == 6 ? "Send to Applete Officer"
                                            : res.status == 7 ? "Hearing Scheduled"
                                                : res.status == 8 ? "Hearing Rescheduled"
                                                    : res.status == 9 ? "Decision Done"
                                                        : res.status == 11 ? "Complete"
                                                            : res.status == 12 ? "Close" 
                                                            : res.status == 14 ? "Information Ready" : "",
                                                            
                        activeFlag: res.activeFlag,
                    };
                })
                console.log(_res)
                setDataSource([..._res]);
                setTotalElements(res.data.totalElements);
                setPageSize(res.data.pageSize);
                setPageNo(res.data.pageNo);
            });
    }


    const getApplicationDetails = (_pageSize = 10, _pageNo = 0) => {
        if (logedInUser === 'citizenUser') {

            axios
                .get(`${urls.RTI}/trnRtiApplication/getAll`, {
                    params: {
                        pageSize: _pageSize,
                        pageNo: _pageNo,
                    },
                    headers: {
                        // Authorization: `Bearer ${user.token}`,
                        UserId: user.id
                    },
                })
                .then((res, i) => {
                    let result = res.data.trnRtiApplicationList;
                    const _res = result.map((res, i) => {
                        return {
                            srNo: (i + 1) + (_pageNo * _pageSize),
                            id: res.id,
                            applicationNo: res.applicationNo,
                        departmentName: departments?.find((obj) => { return obj.id == res.departmentKey }) ? departments.find((obj) => { return obj.id == res.departmentKey }).department : "-",

                            // departmentName: departments?.find((obj) => { return obj.id == res.departmentKey }) ? departments.find((obj) => { return obj.id == res.departmentKey }).department : "-",
                            createdDate: res.createdDate,
                            description: res.description,
                            subject: res.subject,
                            applicationDate: moment(
                                res.applicationDate,

                            ).format("DD-MM-YYYY"),
                            statusVal: res.status,
                            status: res.status == 2 ? "Send For Payment"
                                : res.status == 3 ? "In Progress"
                                    : res.status == 4 ? "LOI Generated"
                                        : res.status == 5 ? "Payment Received"
                                            : res.status == 6 ? "Send to Applete Officer"
                                                : res.status == 7 ? "Hearing Scheduled"
                                                    : res.status == 8 ? "Hearing Rescheduled"
                                                        : res.status == 9 ? "Decision Done"
                                                            : res.status == 11 ? "Complete"
                                                                : res.status == 12 ? "Close"
                                                                    : res.status == 14 ? "Information Ready" : "",
                            activeFlag: res.activeFlag,
                        };
                    })
                    console.log(_res)
                    setDataSource([..._res]);
                    setTotalElements(res.data.totalElements);
                    setPageSize(res.data.pageSize);
                    setPageNo(res.data.pageNo);
                });
        } else {
            axios
                .get(`${urls.RTI}/trnRtiApplication/getAll`, {
                    params: {
                        pageSize: _pageSize,
                        pageNo: _pageNo,
                    },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        // UserId: user.id
                    },
                })
                .then((res, i) => {
                    let result = res.data.trnRtiApplicationList;
                    const _res = result.map((res, i) => {
                        return {
                            srNo: (i + 1) + (_pageNo * _pageSize),
                            id: res.id,
                            applicationNo: res.applicationNo,
                            departmentName: departments?.find((obj) => { return obj.id == res.departmentKey }) ? departments.find((obj) => { return obj.id == res.departmentKey }).department : "-",
                            createdDate: res.createdDate,
                            description: res.description,
                            subject: res.subject,
                            applicationDate: moment(
                                res.applicationDate,

                            ).format("DD-MM-YYYY"),
                            statusVal: res.status,

                            status: res.status == 2 ? "Send For Payment"
                                : res.status == 3 ? "In Progress"
                                    : res.status == 4 ? "LOI Generated"
                                        : res.status == 5 ? "Payment Received"
                                            : res.status == 6 ? "Send to Applete Officer"
                                                : res.status == 7 ? "Hearing Scheduled"
                                                    : res.status == 8 ? "Hearing Rescheduled"
                                                        : res.status == 9 ? "Decision Done"
                                                            : res.status == 11 ? "Complete"
                                                                : res.status == 12 ? "Close"
                                                                    : res.status == 14 ? "Information Ready" : "",
                            activeFlag: res.activeFlag,
                        };
                    })
                    console.log(_res)
                    setDataSource([..._res]);
                    setTotalElements(res.data.totalElements);
                    setPageSize(res.data.pageSize);
                    setPageNo(res.data.pageNo);
                });
        }
    };


    const columns = [
        {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
            // flex: 1,
        },
        {
            field: "applicationNo",
            headerName: <FormattedLabel id="applicationNo" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "applicationDate",
            headerName: <FormattedLabel id="rtiFileDate" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
        },

        {
            field: "departmentName",
            headerName: <FormattedLabel id="departmentKey" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "subject",
            headerName: <FormattedLabel id="informationSubject" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "description",
            headerName: <FormattedLabel id="description" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            // field: "status",
            headerName: <FormattedLabel id="status" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                return (
                    <>
                        {params?.row?.statusVal === 3 ? (
                            <div style={{ color: "blue" }}>
                                {params?.row?.status}
                            </div>
                        ) : (

                            params?.row?.statusVal === 2 ? (
                                <div style={{ color: "orange" }}>
                                    {params?.row?.status}
                                </div>
                            ) : (params?.row?.statusVal === 4 || params?.row?.statusVal === 5 ||params?.row?.statusVal === 14 ? (
                                <div style={{ color: "orange" }}>
                                    {params?.row?.status}
                                </div>
                            ) : (params?.row?.statusVal === 11 ? (
                                <div style={{ color: "green" }}>
                                    {params?.row?.status}
                                </div>
                            ) : (<div style={{ color: "black" }}>
                                {params?.row?.status}
                            </div>)))

                        )}
                    </>
                )
            },
        },
        {
            field: "actions",
            headerName: <FormattedLabel id="actions" />,
            // width: 120,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton

                            onClick={() => {
                                router1.push({
                                    pathname:
                                        "/RTIOnlilneSystem/transactions/rtiApplication/ViewRTIApplication",
                                    query: { id: params.row.applicationNo },
                                })

                            }}
                        >
                            <VisibilityIcon style={{ color: "#556CD6" }} />
                        </IconButton>
                        {/* {} */}
                        {(authority && authority?.find((val) => val === "RTI_ADHIKARI") && params.row.statusVal === 3) ? (<IconButton
                            // disabled={editButtonInputState}
                            onClick={() => {
                                // router1.push({
                                //     pathname:
                                //         "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                                //     query: { id: params.row.id },
                                // })
                                console.log("params.row: ", params?.row?.id)
                                // reset(params.row)
                            }}
                        >
                            <ArrowForwardIosIcon style={{ color: "green" }} />
                        </IconButton>) : (
                            ""
                        )}
                    </>
                );
            },
        },
    ];

    return (
        <>
            <Paper elevation={8}
                variant="outlined"
                sx={{
                    border: 1,
                    borderColor: "grey.500",
                    marginLeft: "10px",
                    marginRight: "10px",
                    marginTop: "10px",
                    marginBottom: "60px",
                    padding: 1,
                }}>
                <Box
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                    }}
                >
                    <h2> <FormattedLabel id='rtiApplicationList' /></h2>
                </Box>


                <Grid container style={{ padding: "10px" }}>
                    {((logedInUser === 'citizenUser') || ((logedInUser === 'departmentUser') && (authority && authority.find((val) => val !== "RTI_ADHIKARI")))) && <Grid
                        item
                        xs={12}
                        style={{ display: "flex", justifyContent: "end" }}
                    >
                        <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            type="primary"
                            disabled={buttonInputState}
                            onClick={() => {
                                router.push('/RTIOnlilneSystem/transactions/rtiApplication')
                            }}
                        >
                            <FormattedLabel id="add" />{" "}
                        </Button>
                    </Grid>}
                </Grid>
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
                    density="standard"
                    pagination
                    paginationMode="server"
                    rowCount={totalElements}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    rows={dataSource}
                    columns={columns}

                    onPageChange={(_data) => {
                        // getApplicationDetails(pageSize, _data);

                        if (logedInUser === 'departmentUser' && authority && authority.find((val) => val === "RTI_ADHIKARI")) {
                            getApplicationListByDept(pageSize, _data)
                        } else {
                            getApplicationDetails(pageSize, _data);
                        }
                    }}
                    onPageSizeChange={(_data) => {
                        // getApplicationDetails(pageSize, _data);
                        if (logedInUser === 'departmentUser' && authority && authority.find((val) => val === "RTI_ADHIKARI")) {
                            getApplicationListByDept(pageSize, _data)
                        } else {
                            getApplicationDetails(pageSize, _data);
                        }
                    }}
                //checkboxSelection
                />
            </Paper>
        </>
    );
};

export default Index;
