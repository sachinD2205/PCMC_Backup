import {
    Button,
    Grid,
    IconButton,
    Box,
    Paper,
} from "@mui/material";
import moment from "moment";

import VisibilityIcon from "@mui/icons-material/Visibility"
import { useSelector } from "react-redux"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import { useRouter } from "next/router";

const Index = () => {
    const {
        register,
        control,
        handleSubmit,
        reset, watch,
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

    const logedInUser = localStorage.getItem("loggedInUser")
    let user = useSelector((state) => state.user.user)

  


    // const user = useSelector((state) => {
    //     console.log("usserDetails", state?.user?.user?.userDao?.id)
    //     return state?.user?.user?.userDao?.id
    // })
    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")

    );
    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    useEffect(() => {
        getDepartments();
        // getApplicationDetails();
    }, []);

    useEffect(() => {
        // getDepartments();
        if (logedInUser === 'departmentUser') {
            if (authority && authority.find((val) => val === "RTI_APPEAL_ADHIKARI")) {
                
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



    const getApplicationDetails =  (_pageSize = 10, _pageNo = 0) => {
        if (logedInUser === "citizenUser") {
            axios
                .get(`${urls.RTI}/trnRtiAppeal/getAll`, {params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
                    headers: {
                        // Authorization: `Bearer ${user.token}`,
                        UserId: user.id
                    },
                })
                .then((res, i) => {
                    let result = res.data.trnRtiAppealList;
                    const _res = result.map((res, i) => {
                        return {
                            srNo: (i + 1) + (_pageNo * _pageSize),
                            id: res.id,
                            appealNo: res.appealNo,
                            appealReason: res.appealReason,
                            departmentName: departments?.find((obj) => { return obj.id == res.departmentKey }) ? departments.find((obj) => { return obj.id == res.departmentKey }).department : "-",
                            createdDate: res.createdDate,
                            informationDescription: res.informationDescription,
                            subject: res.subject,
                        applicationNo:res.applicationNo,

                            applicationDate: moment(
                                res.applicationDate,

                            ).format("DD-MM-YYYY"),
                            activeFlag: res.activeFlag,
                        statusVal:res.status,

                            status: res.status == 2 ? "Send For Payment"
                                : res.status == 3 ? "In Progress"
                                    : res.status == 4 ? "LOI Generated"
                                        : res.status == 5 ? "LOI Receipt Generated"
                                            : res.status == 6 ? "In Progress"
                                                : res.status == 7 ? "Hearing Scheduled"
                                                    : res.status == 8 ? "Hearing Rescheduled"
                                                        : res.status == 9 ? "Decision Done"
                                                            : res.status == 11 ? "Complete"
                                                                : res.status == 12 ? "Close" 
                                                                :res.status == 14 ? "Information Ready" : "",

                            // status: res.activeFlag === "Y" ? "Active" : "InActive",
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
                .get(`${urls.RTI}/trnRtiAppeal/getAll`, {
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
                    let result = res.data.trnRtiAppealList;
                    const _res = result.map((res, i) => {
                        return {
                            srNo: (i + 1) + (_pageNo * _pageSize),
                            id: res.id,
                            appealNo: res.appealNo,
                            appealReason: res.appealReason,
                            departmentName: departments?.find((obj) => { return obj.id == res.departmentKey }) ? departments.find((obj) => { return obj.id == res.departmentKey }).department : "-",
                            createdDate: res.createdDate,
                            informationDescription: res.informationDescription,
                            subject: res.subject,
                        applicationNo:res.applicationNo,

                            applicationDate: moment(
                                res.applicationDate,

                            ).format("DD-MM-YYYY"),
                            activeFlag: res.activeFlag,
                        statusVal:res.status,
                            status: res.status == 2 ? "Send For Payment"
                                : res.status == 3 ? "In Progress"
                                    : res.status == 4 ? "LOI Generated"
                                        : res.status == 5 ? "LOI Receipt Generated"
                                            : res.status == 6 ? "In Progress"
                                                : res.status == 7 ? "Hearing Scheduled"
                                                    : res.status == 8 ? "Hearing Rescheduled"
                                                        : res.status == 9 ? "Decision Done"
                                                            : res.status == 11 ? "Complete"
                                                                : res.status == 12 ? "Close"
                                                                :res.status == 14 ? "Information Ready" : "",
                            // status: res.activeFlag === "Y" ? "Active" : "InActive",
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






    const getApplicationListByDept =  (_pageSize = 10, _pageNo = 0)=> {
        axios
            .get(`${urls.RTI}/trnRtiAppeal/getAllByDept`, {
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
                let result = res.data.trnRtiAppealList;
                const _res = result.map((res, i) => {
                    return {
                        srNo: (i + 1) + (_pageNo * _pageSize),
                        id: res.id,
                        appealNo: res.appealNo,
                        appealReason: res.appealReason,
                        departmentName: departments?.find((obj) => { return obj.id == res.departmentKey }) ? departments.find((obj) => { return obj.id == res.departmentKey }).department : "-",
                        createdDate: res.createdDate,
                        informationDescription: res.informationDescription,
                        subject: res.subject,
                        applicationNo:res.applicationNo,
                        applicationDate: moment(
                            res.applicationDate,

                        ).format("DD-MM-YYYY"),
                        activeFlag: res.activeFlag,
                        statusVal:res.status,
                        status: res.status == 2 ? "Send For Payment"
                            : res.status == 3 ? "In Progress"
                                : res.status == 4 ? "LOI Generated"
                                    : res.status == 5 ? "LOI Receipt Generated"
                                        : res.status == 6 ? "In Progress"
                                            : res.status == 7 ? "Hearing Scheduled"
                                                : res.status == 8 ? "Hearing Rescheduled"
                                                    : res.status == 9 ? "Decision Done"
                                                        : res.status == 11 ? "Complete"
                                                            : res.status == 12 ? "Close" 
                                                            :res.status == 14 ? "Information Ready" : "",
                        // status: res.activeFlag === "Y" ? "Active" : "InActive",
                    };
                })
                console.log(_res)
                setDataSource([..._res]);
                setTotalElements(res.data.totalElements);
                setPageSize(res.data.pageSize);
                setPageNo(res.data.pageNo);
            });
    };


    const columns = [
        {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
            // flex: 1,
        },
        {
            field: "applicationNo",
            headerName: <FormattedLabel id="appealApplicationNo" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "applicationDate",
            headerName: <FormattedLabel id="appealFileDate" />,
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
            field: "appealReason",
            headerName: <FormattedLabel id="reasonForAppeal" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "informationDescription",
            headerName: <FormattedLabel id="description" />,
            // type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "status",
            headerName: <FormattedLabel id="status" />,
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
                            params?.row?.statusVal === 6 ? (
                                <div style={{ color: "blue" }}>
                                    {params?.row?.status}
                                </div>
                            ) : (params?.row?.statusVal === 8 || params?.row?.statusVal === 7 ||params?.row?.statusVal === 14 ? (
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
                                        "/RTIOnlilneSystem/transactions/rtiAppeal/ViewRTIAppeal",
                                    query: { id: params.row.applicationNo },
                                })

                            }}
                        >
                            <VisibilityIcon style={{ color: "#556CD6" }} />
                        </IconButton>
                    </>
                );
            },
                
    }
    
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
                    <h2> <FormattedLabel id='rtiAppealList' /></h2>
                </Box>


                <Grid container style={{ padding: "10px" }}>
                    {((logedInUser === 'citizenUser') || ((logedInUser === 'departmentUser') && (authority && authority.find((val) => val !== "RTI_APPEAL_ADHIKARI")))) &&
                        <Grid
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
                                    router.push('/RTIOnlilneSystem/transactions/rtiAppeal')
                                }}
                            >
                                <FormattedLabel id="add" />{" "}
                            </Button>
                        </Grid>
                    }
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
                    rowsPerPageOptions={[5]}
                    pageSize={pageSize}
                    rows={dataSource}
                    columns={columns}
                    onPageChange={(_data) => {
                        getApplicationDetails(pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                        getApplicationDetails(pageSize, _data);
                    }}
                    // density="standard"
                    // rows={dataSource || []}
                    // pageSize={10}
                    // rowsPerPageOptions={[10]}
                    // columns={columns}
                    // disableSelectionOnClick
                //checkboxSelection
                />
            </Paper>
        </>
    );
};

export default Index;
