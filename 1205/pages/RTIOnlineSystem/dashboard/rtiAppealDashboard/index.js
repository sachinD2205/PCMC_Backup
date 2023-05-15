import {
    Button,
    Grid,Link,
    IconButton,
    Box,Typography,
    Paper,Tooltip ,
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

import moment from "moment";
import styles from "../rtiApplicationDashboard/dashboard.module.css"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useSelector } from "react-redux"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
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
    const ComponentWithIcon = ({ iconName }) => {
        const Icon = MuiIcons[iconName];
        return <Icon style={{ fontSize: "30px" }} />;
    };
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
    const [deptId, setDeptId] = useState()
    const logedInUser = localStorage.getItem("loggedInUser")
    let user = useSelector((state) => state.user.user)
    const [completeCount,setCompleteCount]=useState(null)
    const [inProgressCount,setInProgressCount]=useState(null)
    const [hearingCount,setHearingCount]=useState(null)
    const [totalCount,setTotoalCount]=useState(null)
    const [statusId,setStatusId]=useState(0)

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")

    );
    const language = useSelector((state) => state.labels.language);

    const user1 = useSelector((state) => {
        // console.log(":54",state?.user?.user?.firstNamemr);
        let userNamed = language === "en" ? state?.user?.user?.userDao.firstNameEn :state?.user?.user?.userDao.firstNameMr;

        return userNamed;
    });
    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    useEffect(() => {
        getDepartments();
        getDashboardRtiCount()
    }, []);

    useEffect(() => {
           getApplicationListByDept()
    }, [departments]);


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


    const getDashboardRtiCount = () => {
        const data = {
            "strFromDate": "2000-01-01 12:23:27.014",
            "strToDate": "2080-12-31 12:23:27.014"
        }
        axios.post(`${urls.RTI}/dashboard/getRtiCounts`, data, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }).then((r) => {
            for (var i = 0; i < r.data.length; i++) {
                if (r.data[i].trnType === "RAPL-Complete") {
                    setCompleteCount(r.data[i].count)
                } else if (r.data[i].trnType === "RAPL-Inprogress") {
                    setInProgressCount(r.data[i].count)
                } else if (r.data[i].trnType === "RAPL" && r.data[i].status===7) {
                    setHearingCount(r.data[i].count)
                } else if (r.data[i].trnType === "RAPL-Total") {
                    setTotoalCount(r.data[i].count)
                }
            }
        });
    }




    const getApplicationListByDept = (_pageSize = 10, _pageNo = 0) => {
        if (departments) {
            axios
                .get(`${urls.RTI}/trnRtiAppeal/getAllByDept`, {
                    params: {
                        pageSize: _pageSize,
                        pageNo: _pageNo,
                    },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res, i) => {
                    let result = res.data.trnRtiAppealList;
                    getDatatable(result, _pageSize, _pageNo)
                    setTotalElements(res.data.totalElements);
                    setPageSize(res.data.pageSize);
                    setPageNo(res.data.pageNo);
                });
        }
    };

const getDashboardCardWiseData= (status,_pageSize = 10, _pageNo = 0) => {
    if(status!=0){
        axios.post(`${urls.RTI}/trnRtiAppeal/getAllByStatus?status=${status}`,{}, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            params: {
                pageSize: _pageSize,
                pageNo: _pageNo,
            },
        })
        .then((res, j) => {
                let result = res.data.trnRtiAppealList;
                console.log("result ",result)
                getDatatable(result, _pageSize, _pageNo)
                setTotalElements(res.data.totalElements);
                setPageSize(res.data.pageSize);
                setPageNo(res.data.pageNo);
            });
        }else{
            getApplicationListByDept(_pageSize,_pageNo)
        }
};



    const getDatatable = (result, _pageSize, _pageNo,) => {
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
                applicationNo: res.applicationNo,
                applicationDate: moment(
                    res.applicationDate,

                ).format("DD-MM-YYYY"),
                activeFlag: res.activeFlag,
                statusVal: res.status,
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
                                                        : res.status == 14 ? "Information Ready" : "",
                // status: res.activeFlag === "Y" ? "Active" : "InActive",
            };
        })
        console.log(_res)
        setDataSource([..._res]);
    }

    const columns = [
        {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
            headerAlign: "center",
        },
        {
            field: "applicationNo",
            headerName: <FormattedLabel id="appealApplicationNo" />,
            flex: 1,
            minWidth: 350,
            headerAlign: "center",
        },
        {
            field: "applicationDate",
            headerName: <FormattedLabel id="appealFileDate" />,
            flex: 1,
            headerAlign: "center",
        },
        {
            field: "appealReason",
            headerName: <FormattedLabel id="reasonForAppeal" />,
            flex: 1,
            headerAlign: "center",
        },
        {
            field: "status",
            headerName: <FormattedLabel id="status" />,
            flex: 1,
            headerAlign: "center",
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
                            ) : (params?.row?.statusVal === 8 || params?.row?.statusVal === 7 || params?.row?.statusVal === 14  || params?.row?.statusVal==2? (
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
                                        "/RTIOnlineSystem/transactions/rtiAppeal/ViewRTIAppeal",
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


<Box>
                    <Box
                        sx={{
                            display: "flex",
                            padding: "30px",

                            flexDirection: "column",
                        }}
                    >
                        <Typography>
                            <p className={styles.fancy_link}>
                                <>
                                    <FormattedLabel id="welcomeToTheDashboard" /> <strong>{user1}</strong>{" "}
                                </>
                            </p>
                        </Typography>
                        {/* .......................CARDS............................ */}
                        <Grid container style={{ display: "flex", justifyContent: "center" }}>
                            {[  {
                                id:1,
                                    icon: "Menu",
                                    count:totalCount,
                                    name: <FormattedLabel id="dashboardTotalAppealCount" />,
                                    bg: "#FFC0CB",
                                },
                                // {
                                //     id:2,
                                //     icon: "Menu",
                                //     count:inProgressCount,
                                //     name: <FormattedLabel id="dashboardInProgress" />,
                                //     bg: "red",
                                // },
                                {
                                    id:3,
                                    icon: "Menu",
                                    count: hearingCount,
                                    name: <FormattedLabel id="dashboardHearingScheduled" />,
                                    bg: "#FFA500",
                                },
                                // {
                                //     id:4,
                                //     icon: "Menu",
                                //     count: 0,
                                //     name: <FormattedLabel id="dashboardInfoReady" />,
                                //     bg: "#7F00FF",
                                // },
                                {
                                    id:5,
                                    icon: "Menu",
                                    count:completeCount,
                                    name: <FormattedLabel id="dashboardCompletedAppeal" />,
                                    bg: "#00FF00",
                                },
                            ].map((val, id) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <Tooltip title={val.name}>
                                        <Grid
                                            key={id}
                                            item
                                            xs={3}
                                            style={{
                                                paddingTop: "10px",
                                                paddingLeft: "10px",
                                                paddingRight: "10px",
                                                paddingBottom: "0px",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Grid
                                                container
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: "10px",
                                                    borderRadius: "15px",
                                                    backgroundColor: "white",
                                                    height: "100%",
                                                }}
                                                sx={{
                                                    ":hover": {
                                                        boxShadow: "0px 5px #556CD6",
                                                    },
                                                }}
                                                boxShadow={3}
                                            >
                                                <Grid
                                                    item
                                                    xs={2}
                                                    style={{
                                                        padding: "5px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        backgroundColor: val.bg,
                                                        color: "white",
                                                        borderRadius: "7px",
                                                    }}
                                                    boxShadow={2}
                                                >
                                                    <ComponentWithIcon iconName={val.icon} />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={10}
                                                    style={{
                                                        padding: "10px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        style={{
                                                            fontWeight: "500",
                                                            fontSize: "25px",
                                                            color: "#556CD6",
                                                        }}
                                                    >
                                                        {val.count}
                                                    </Typography>
                                                       { val.id === 1 && (
                                                            <Link
                                                                style={{ fontWeight: "600" }}
                                                                onClick={() => {
                                                                    getDashboardCardWiseData(0)
                                                                    setStatusId(0)
                                                                }}
                                                                tabIndex={0}
                                                                component="button"
                                                            >
                                                                {val.name}
                                                            </Link>
                                                        )} 
                                                       {/* {val.id === 2 &&  (
                                                            <Link
                                                                style={{ fontWeight: "600" }}
                                                                onClick={() => {
                                                                    getDashboardCardWiseData(3)
                                                                }}
                                                                tabIndex={0}
                                                                component="button"
                                                            >
                                                                {val.name}
                                                            </Link>
                                                        )} */}
                                                        

                                                    {val.id === 3 &&(
                                                            <Link
                                                                style={{ fontWeight: "600" }}
                                                                onClick={() => {
                                                                    getDashboardCardWiseData(7)
                                                                    setStatusId(8)
                                                                }}
                                                                tabIndex={0}
                                                                component="button"
                                                            >
                                                                {val.name}
                                                            </Link>
                                                        )}
                                                       {/* {val.id === 4 &&(
                                                            <Link
                                                                style={{ fontWeight: "600" }}
                                                                onClick={() => {
                                                                    getDashboardCardWiseData(7)
                                                                }}
                                                                tabIndex={0}
                                                                component="button"
                                                            >
                                                                {val.name}
                                                            </Link>
                                                        )} */}
                                                        {val.id === 5 &&(
                                                            <Link
                                                                style={{ fontWeight: "600" }}
                                                                onClick={() => {
                                                                    getDashboardCardWiseData(11)
                                                                    setStatusId(11)
                                                                }}
                                                                tabIndex={0}
                                                                component="button"
                                                            >
                                                                {val.name}
                                                            </Link>
                                                        )}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Tooltip>
                                );
                            })}
                        </Grid>
                    </Box>
                </Box>
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


                {/* <Grid container style={{ padding: "10px" }}>
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
                                    router.push('/RTIOnlineSystem/transactions/rtiAppeal')
                                }}
                            >
                                <FormattedLabel id="add" />{" "}
                            </Button>
                        </Grid>
                    }
                </Grid> */}
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
                        getDashboardCardWiseData(statusId,pageSize, _data)
                    }}
                    onPageSizeChange={(_data) => {
                        getDashboardCardWiseData(statusId,pageSize, _data)
                    }}
              
                />



            </Paper>
        </>
    );
};

export default Index;
