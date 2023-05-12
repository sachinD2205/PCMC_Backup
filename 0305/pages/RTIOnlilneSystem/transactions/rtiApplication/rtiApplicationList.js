import {
    Button, Link,
    Grid, Tooltip,
    IconButton, Typography,
    Box, TextField,
    Paper, Modal, FormControl,
    FormHelperText, InputLabel, Select, MenuItem
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';
import moment from "moment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import React, { useEffect, useState } from "react";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux"
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import sweetAlert from "sweetalert";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Index = () => {

    const {
        register,
        control,
        handleSubmit,
        methods,
        setValue,
        getValues,
        watch,
        reset,
        formState: { errors: error },
    } = useForm({
        criteriaMode: "all",
        // resolver: yupResolver(trnRtiAppealSchema),
        mode: "onChange",
    });

    const router1 = useRouter()
    const language = useSelector((state) => state.labels.language);

    const [buttonInputState, setButtonInputState] = useState();
    const [dataSource, setDataSource] = useState([]);
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [slideChecked, setSlideChecked] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [subDepartments, setSubDepartmentList] = useState([])
    const router = useRouter();
    const [pageSize, setPageSize] = useState();
    const [totalElements, setTotalElements] = useState();
    const [pageNo, setPageNo] = useState();
    let user = useSelector((state) => state.user.user)
    const [isForwoardOpen, setIsForward] = useState(false)
    const [applicationID, selectedApplicationId] = useState(null)
    const [applicationDetails, setApplicationDetails] = useState([])
    const [selectDepartment, setSubDepartments] = useState(null)
    const [isBplval, setIsBpl] = useState(null)
    const logedInUser = localStorage.getItem("loggedInUser")

    const [isOpenPayment, setIsOpenPayment] = useState(false)

    // const user1 = useSelector((state) => {
        // console.log(":54",state?.user?.user?.firstNamemr);
        // let userNamed = language === "en" ? logedInUser == "citizenUser" ? state?.user?.user?.firstName : state?.user?.user?.userDao.firstNameEn : logedInUser == "citizenUser" ? state?.user?.user?.firstNamemr : state?.user?.user?.userDao.firstNameMr;

        // return userNamed;
     // });

   

    const [wards, setWards] = useState([]);
    const [zoneDetails, setZoneDetails] = useState();
    const handleCancel = () => {
        setIsForward(false)
    }

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

  


    useEffect(() => {
        getZone()
        getWards()
        getDepartments();
        getAllSubDepartmentDetails()
    }, []);

    useEffect(() => {
        if (logedInUser === 'departmentUser' && authority && authority.find((val) => val === "RTI_ADHIKARI")) {
            getApplicationListByDept()
        } else {
            getApplicationDetails();
        }
    }, [departments]);


    const getDepartments = () => {
        axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
            setDepartments(
                r.data.department.map((row) => ({
                    id: row.id,
                    department: row.department,
                    departmentNameMr:row.departmentMr
                }))
            );
        });
    };

    // get sub department
    const getAllSubDepartmentDetails = () => {
        axios
            .get(
                `${urls.RTI}/master/subDepartment/getAll`
            )
            .then((res) => {
                setSubDepartmentList(
                    res.data.subDepartment.map((r, i) => ({
                        id: r.id,
                        srNo: i + 1,
                        departmentId: r.department,
                        subDepartment: r.subDepartment,
                    }))
                )
            })
    }

    // get sub department by dept id
    const getSubDepartmentDetails = () => {
        if (watch("departmentKey")) {
            axios
                .get(
                    `${urls.RTI}/master/subDepartment/getAllByDeptWise/${watch(
                        "departmentKey"
                    )}`,
                )
                .then((res) => {
                    setSubDepartmentList(
                        res.data.subDepartment.map((r, i) => ({
                            id: r.id,
                            srNo: i + 1,
                            departmentId: r.department,
                            subDepartment: r.subDepartment,
                        }))
                    )
                })
        }
    }

    // get application by departmentwise
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
                setDataSourceDetails(result, _pageSize, _pageNo)
                setTotalElements(res.data.totalElements);
                setPageSize(res.data.pageSize);
                setPageNo(res.data.pageNo);
            });
    }

    // get self application
    const getApplicationDetails = (_pageSize = 10, _pageNo = 0) => {
        if (logedInUser === 'citizenUser') {
            axios
                .get(`${urls.RTI}/trnRtiApplication/getAll`, {
                    params: {
                        pageSize: _pageSize,
                        pageNo: _pageNo,
                    },
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res, i) => {
                    let result = res.data.trnRtiApplicationList;
                    setDataSourceDetails(result, _pageSize, _pageNo)
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
                    },
                })
                .then((res, i) => {
                    let result = res.data.trnRtiApplicationList;
                    setDataSourceDetails(result, _pageSize, _pageNo)
                    setTotalElements(res.data.totalElements);
                    setPageSize(res.data.pageSize);
                    setPageNo(res.data.pageNo);
                });
        }
    };

    // get zone
    const getZone = () => {
        axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
            setZoneDetails(
                res.data.zone.map((r, i) => ({
                    id: r.id,
                    srNo: i + 1,
                    zoneName: r.zoneName,
                    zoneNameMr: r.zoneNameMr,
                    zone: r.zone,
                    ward: r.ward,
                    area: r.area,
                    zooAddress: r.zooAddress,
                    zooAddressAreaInAcres: r.zooAddressAreaInAcres,
                    zooApproved: r.zooApproved,
                    zooFamousFor: r.zooFamousFor,
                }))
            )
            setIsBpl(false)
        })
    }

    // get wards
    const getWards = () => {
        axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
            setWards(
                r.data.ward.map((row) => ({
                    id: row.id,
                    wardName: row.wardName,
                    wardNameMr: row.wardNameMr,
                    wardNo: row.wardNo,
                    wardNoMr: row.wardNoMr,
                })),
            );
        });
    };

    // set datatable details
    const setDataSourceDetails = (result, _pageSize, _pageNo) => {
        const _res = result.map((res, i) => {
            return {
                srNo: (i + 1) + (_pageNo * _pageSize),
                id: res.id,
                applicationNo: res.applicationNo,
                applicantName: res.applicantFirstName + " " + res.applicantMiddleName + " " + res.applicantLastName,
                // applicantNameMr: res.applicantFirstNameMr + " " + res.applicantMiddleNameMr + " " + res.applicantLastNameMr,
                departmentName: departments?.find((obj) => {
                    return obj.id == res.departmentKey
                }) ? departments.find((obj) => {
                    return obj.id == res.departmentKey
                }).department : "-",

                departmentNameMr: departments?.find((obj) => {
                    return obj.id == res.departmentKey
                }) ? departments.find((obj) => {
                    return obj.id == res.departmentKey
                }).departmentNameMr : "-",
                wardName: wards?.find((obj) => {
                    return obj.id == res.wardKey
                }) ? wards.find((obj) => {
                    return obj.id == res.wardKey
                }).wardName : "-",
                wardNameMr: wards?.find((obj) => {
                    return obj.id == res.wardKey
                }) ? wards.find((obj) => {
                    return obj.id == res.wardKey
                }).wardNameMr : "-",
                zoneName: zoneDetails?.find((obj) => {
                    return obj.id == res.zoneKey
                }) ? zoneDetails.find((obj) => {
                    return obj.id == res.zoneKey
                }).zoneName : "-",
                zoneNameMr:zoneDetails?.find((obj) => {
                    return obj.id == res.zoneKey
                }) ? zoneDetails.find((obj) => {
                    return obj.id == res.zoneKey
                }).zoneNameMr : "-",
                createdDate: res.createdDate,
                isTransfer: res.isTransfer === false ? null : res.isTransfer,
                parentId: res.parentId,
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
        setDataSource([..._res]);
        // }
        // console.log(_res)
    }

    // datatable columns
    const columns = [
        {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
            headerAlign: "center",
            align: "left",
        },
        {

            field: language == "en" ? "applicantName" : "applicantName",
            headerName: <FormattedLabel id="applicantName" />,
            flex: 1,
            minWidth: 200,
            headerAlign: "center",
            align: "left",
        },
        {
            field: "applicationNo",
            headerName: <FormattedLabel id="applicationNo" />,
            flex: 1,
            minWidth: 280,
            headerAlign: "center",
            align: "left",
        },
        {
            field: "applicationDate",
            headerName: <FormattedLabel id="rtiFileDate" />,
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
        },


        {
            field: language == "en" ? "zoneName" : "zoneNameMr",
            headerName: <FormattedLabel id="zoneKey" />,
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "left",
        },
        {
            field:language == "en" ? "wardName" : "wardNameMr",
            headerName: <FormattedLabel id="wardKey" />,
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "left",
        },
        {
            field:language == "en" ? "departmentName" : "departmentNameMr",
            headerName: <FormattedLabel id="departmentKey" />,
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "left",
        },
        // {
        //     field: "subject",
        //     headerName: <FormattedLabel id="informationSubject" />,
        //     flex: 1,
        //     minWidth: 250,
        //     headerAlign: "center",
        //     align: "left",
        // },
        {
            headerName: <FormattedLabel id="status" />,
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
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
                            ) : (params?.row?.statusVal === 4 || params?.row?.statusVal === 5 || params?.row?.statusVal === 14 ? (
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
            width: 200,
            sortable: false,
            headerAlign: "center",
            align: "left",
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton
                            onClick={() => {
                                router1.push({
                                    pathname:
                                        "/RTIOnlilneSystem/transactions/rtiApplication/ViewRTIApplication",
                                    query: { id: params.row.id },
                                })
                            }}
                        >
                            <Tooltip title={`VIEW APPLICATION AGAINST  ${params?.row?.applicationNo}`}>
                                <VisibilityIcon style={{ color: "#556CD6" }} />

                            </Tooltip>
                        </IconButton>
                        {/* {} */}
                        {(authority && authority?.find((val) => val === "RTI_ADHIKARI") && params.row.statusVal === 3 && !params.row.isTransfer && !params.row.parentId) && (<IconButton
                            onClick={() => {
                                sweetAlert({
                                    title: "Warning!",
                                    text: "Do you want to Transfer/Forward Application to another department?",
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                    buttons: ["No", "Yes"],
                                }).then((will) => {
                                    if (will) {
                                        setIsForward(true)
                                        getApplicationById(params.row.id)
                                        selectedApplicationId(params?.row?.id)
                                        console.log("params.row: ", params?.row?.id)
                                    } else {
                                        if (logedInUser === 'departmentUser' && authority && authority.find((val) => val === "RTI_ADHIKARI")) {
                                            getApplicationListByDept()
                                        } else {
                                            getApplicationDetails();
                                        }
                                    }
                                })

                                // reset(params.row)
                            }}
                        >
                            <ArrowForwardIosIcon style={{ color: "green" }} />
                        </IconButton>)}


                        {/* send for payment */}
                        {((logedInUser == "citizenUser" || (logedInUser === "departmentUser" && (authority && authority?.find((val) => val !== "RTI_ADHIKARI")))) && params.row.statusVal === 2) && (<IconButton
                            onClick={() => {
                                getApplicationById(params.row.id)
                                setIsOpenPayment(true)
                            }}
                        >
                            <Tooltip title={`MAKE PAYMENT`}>

                                <PaymentIcon style={{ color: "red" }} />
                            </Tooltip>
                        </IconButton>)}


                        {/* LOI RECEIPT */}
                        {((logedInUser == "citizenUser" || (logedInUser === "departmentUser" && (authority && authority?.find((val) => val !== "RTI_ADHIKARI")))) && params.row.statusVal === 4) && (<IconButton
                            onClick={() => {
                                router.push({
                                    pathname: "/RTIOnlilneSystem/transactions/acknowledgement/LoiGenerationRecipt",
                                    query: { id: params.row.applicationNo },
                                })
                            }}
                        >
                            <Tooltip title={`VIEW LOI RECEIPT`}>

                                <PaymentIcon style={{ color: "orange" }} />
                            </Tooltip>
                        </IconButton>)}



                        {((logedInUser == "citizenUser" || (logedInUser === "departmentUser" && (authority && authority?.find((val) => val !== "RTI_ADHIKARI")))) && params.row.statusVal === 3) && (<IconButton
                            onClick={() => {
                                router.push({
                                    pathname: "/RTIOnlilneSystem/transactions/acknowledgement/rtiApplication",
                                    query: { id: params.row.applicationNo },
                                })
                            }}
                        >
                            <Tooltip title={`DOWNLOAD ACKNOWLEDGEMENT`}>
                                <DownloadIcon style={{ color: "blue" }} />
                            </Tooltip>
                        </IconButton>)}

                      {((logedInUser == "citizenUser" || (logedInUser === "departmentUser" && (authority && authority?.find((val) => val !== "RTI_ADHIKARI")))) && params.row.statusVal === 11) &&  <Grid
                            item
                            xl={4}
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                sx={{ margin: 2, }}
                                variant="contained"
                                color="primary"
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => {
                                    
                                    router.push({
                                        pathname: "/RTIOnlilneSystem/transactions/rtiAppeal",
                                        query: { id: params.row.applicationNo },
                                    })
                                }}
                            >
                                <FormattedLabel id="goToAppeal" />
                            </Button>
                        </Grid>}
                    </>
                );
            },
        },
    ];

    // forward application
    const onForwardApplication = (formData) => {
        const body = {
            activeFlag: "Y",
            ...applicationDetails,
            departmentKey: formData.departmentKey,
            subDepartmentKey: formData.subDepartmentKey,
            forwardRemark: formData.remarks,
            isTransfer: true,

            forwardFlag: true,
        }
        const tempData = axios
            .post(`${urls.RTI}/trnRtiApplication/save`, body, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            },)
            .then((res) => {
                console.log("res", res);
                if (res.status == 201) {

                    setIsForward(false)
                    sweetAlert("Saved!", `RTI Application No ${res.data.message.split('[')[1].split(']')[0]} is Transferred Succussfully!`);
                    if (logedInUser === 'departmentUser' && authority && authority.find((val) => val === "RTI_ADHIKARI")) {
                        getApplicationListByDept()
                    } else {
                        getApplicationDetails();
                    }
                }
            })
    }

    // get application by id
    const getApplicationById = (applicationID) => {
        if (logedInUser === "citizenUser") {
            axios
                .get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationID}`, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res, i) => {
                    setApplicationDetails(res.data)
                    setValue("rtiapplicationNo", res.data.applicationNo)
                    setValue("applicantName", res.data.applicantFirstName + " " + res.data.applicantMiddleName + " " + res.data.applicantLastName)
                    setValue("subject", res.data.description)
                    setValue("currentdept", departments?.find((obj) => {
                        return obj.id == res.data.departmentKey
                    }) ? departments.find((obj) => {
                        return obj.id == res.data.departmentKey
                    }).department : "-"),

                        setValue("currentSubDept", subDepartments?.find((obj) => {
                            return obj.id == res.data.subDepartmentKey
                        }) ? subDepartments.find((obj) => {
                            return obj.id == res.data.subDepartmentKey
                        }).subDepartment : "-")
                })
        } else {
            axios
                .get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationID}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res, i) => {
                    setApplicationDetails(res.data)
                    setValue("rtiapplicationNo", res.data.applicationNo)
                    setValue("applicantName", res.data.applicantFirstName + " " + res.data.applicantMiddleName + " " + res.data.applicantLastName)
                    setValue("subject", res.data.description)
                    setValue("currentdept", departments?.find((obj) => {
                        return obj.id == res.data.departmentKey
                    }) ? departments.find((obj) => {
                        return obj.id == res.data.departmentKey
                    }).department : "-"),

                        setValue("currentSubDept", subDepartments?.find((obj) => {
                            return obj.id == res.data.subDepartmentKey
                        }) ? subDepartments.find((obj) => {
                            return obj.id == res.data.subDepartmentKey
                        }).subDepartment : "-")
                })
        }
    }


    const handleCancel3 = () => {
        setIsOpenPayment(false)
    }


    const changePaymentStatus = () => {
        const body = {
            activeFlag: "Y",
            ...applicationDetails,
        }
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`,
                    body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        getApplicationById()
                        setIsOpenPayment(false)
                        sweetAlert("Saved!", "Payment Done successful!", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`,
                    body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        getApplicationById()
                        setIsOpenPayment(false)
                        sweetAlert("Saved!", "Payment Done successfully !", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }
    // ui
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
                        // flexDirection:"row",
                        // overflowX: "scroll",
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


                <Modal
                    title="Modal For Forward Application"
                    open={isForwoardOpen}
                    onClose={handleCancel}
                    footer=""
                    sx={{
                        padding: 5,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "90%",
                            backgroundColor: "white",
                            height: "78vh",
                        }}
                    >
                        <Box style={{ height: "70vh" }}>
                            <>
                                <Box
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        paddingTop: "10px",
                                        background:
                                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                                    }}
                                >
                                    <h2> <FormattedLabel id="forwardApplication" /></h2>
                                </Box>
                                <FormProvider {...methods}>
                                    <form onSubmit={handleSubmit(onForwardApplication)}>
                                        <Grid container sx={{ padding: "10px" }}>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                sx={{
                                                    display: "justify-flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <TextField
                                                    sx={{ width: 240 }}
                                                    disabled={true}
                                                    InputLabelProps={{ shrink: true }}
                                                    id="standard-textarea"
                                                    label={<FormattedLabel id="rtiApplicationNO" />}
                                                    multiline
                                                    variant="standard"
                                                    {...register("rtiapplicationNo")}
                                                    error={!!error.rtiapplicationNo}
                                                    helperText={
                                                        error?.rtiapplicationNo ? error.rtiapplicationNo.message : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                xl={8}
                                                lg={8}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <TextField
                                                    disabled={true}
                                                    InputLabelProps={{ shrink: true }}

                                                    sx={{ width: 570 }}
                                                    id="standard-textarea"
                                                    label={<FormattedLabel id="applicantName" />}
                                                    multiline
                                                    variant="standard"
                                                    {...register("applicantName")}
                                                    error={!!error.applicantName}
                                                    helperText={
                                                        error?.applicantName ? error.applicantName.message : null
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xl={12}
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 2
                                                }}
                                            >
                                                <TextField
                                                    sx={{ width: 980 }}
                                                    disabled={true}
                                                    InputLabelProps={{ shrink: true }}
                                                    id="standard-textarea"
                                                    label={<FormattedLabel id="subject" />}
                                                    multiline
                                                    variant="standard"
                                                    {...register("subject")}
                                                    error={!!error.subject}
                                                    helperText={
                                                        error?.subject ? error.subject.message : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid item
                                                xl={4}
                                                lg={4}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 2
                                                }}>
                                                <TextField
                                                    label={<FormattedLabel id="currentdept" />}
                                                    id="standard-textarea"
                                                    // disabled={showDisabled ? true : false}
                                                    disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI" && (hearingDetails.status != 11 && hearingDetails.status != 9)) ? false : true}

                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ width: 230 }}
                                                    variant="standard"
                                                    {...register("currentdept")}
                                                    error={!!error.currentdept}
                                                    helperText={
                                                        error?.currentdept ? error.currentdept.message : null
                                                    }
                                                />
                                            </Grid>

                                            <Grid item
                                                xl={4}
                                                lg={4}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 2
                                                }}>
                                                <TextField
                                                    label={<FormattedLabel id="currentSubDept" />}
                                                    id="standard-textarea"
                                                    // disabled={showDisabled ? true : false}
                                                    disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI" && (hearingDetails.status != 11 && hearingDetails.status != 9)) ? false : true}

                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ width: 230 }}
                                                    variant="standard"
                                                    {...register("currentSubDept")}
                                                    error={!!error.currentSubDept}
                                                    helperText={
                                                        error?.currentSubDept ? error.currentSubDept.message : null
                                                    }
                                                />
                                            </Grid>
                                            <Grid item
                                                xl={4}
                                                lg={4}
                                                md={0}
                                                sm={0}
                                                xs={0}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 2
                                                }}></Grid>

                                            <Grid item
                                                xl={4}
                                                lg={4}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>
                                                <FormControl
                                                    sx={{ width: 230, marginTop: "2%" }}
                                                    variant="standard"
                                                    error={!!error.departmentKey}
                                                >
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="forwardToDept" />
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                // sx={{ width: 250 }}
                                                                autoFocus
                                                                fullWidth
                                                                value={field.value}
                                                                onChange={(value) => {
                                                                    field.onChange(value),
                                                                        setSubDepartments(value.target.value)
                                                                    getSubDepartmentDetails()
                                                                }}
                                                                label={<FormattedLabel id="forwardToDept" />}
                                                            >
                                                                {departments &&
                                                                    departments.map((department, index) => (
                                                                        <MenuItem key={index} value={department.id}>
                                                                            {department.department}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        )}
                                                        name="departmentKey"
                                                        control={control}
                                                        defaultValue=""
                                                    />
                                                    <FormHelperText>
                                                        {error?.departmentKey ? error.departmentKey.message : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>

                                            {(subDepartments.length !== 0 && watch("departmentKey")) && (
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <FormControl
                                                    sx={{ width: 230, marginTop: "2%" }}
                                                    variant="standard"
                                                    error={!!error.subDepartmentKey}
                                                >
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="forwardTosubDept" />
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                fullWidth
                                                                value={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                                label={<FormattedLabel id="subDepartmentKey" />
                                                                }
                                                            >
                                                                {subDepartments &&
                                                                    subDepartments?.map((subDepartment, index) => (
                                                                        <MenuItem key={index} value={subDepartment.id}>
                                                                            {subDepartment.subDepartment}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        )}
                                                        name="subDepartmentKey"
                                                        control={control}
                                                        defaultValue=""
                                                    />
                                                    <FormHelperText>
                                                        {error?.subDepartmentKey ? error.subDepartmentKey.message : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>)}
                                            <Grid item
                                                xl={12}
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center", marginTop: 2
                                                }}>
                                                <TextField
                                                    label={<FormattedLabel id="remark" />}
                                                    id="standard-textarea"
                                                    sx={{ width: 990 }}
                                                    variant="standard"

                                                    {...register("remarks")}
                                                    error={!!error.remarks}
                                                    helperText={
                                                        error?.remarks ? error.remarks.message : null
                                                    }
                                                />
                                            </Grid>


                                            <Grid container sx={{ padding: "10px" }}>
                                                <Grid item
                                                    xl={6}
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    xs={6} sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 5
                                                    }}>
                                                    <Button
                                                        sx={{ marginRight: 8 }}
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<SaveIcon />}
                                                    >
                                                        <FormattedLabel id="forwardApplication" />
                                                    </Button>
                                                </Grid>

                                                <Grid item
                                                    xl={6}
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 5
                                                    }}>
                                                    <Button
                                                        sx={{ marginRight: 8 }}
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ClearIcon />}
                                                        onClick={() => handleCancel()}
                                                    >
                                                        <FormattedLabel id="closeModal" />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </FormProvider>
                            </>
                        </Box>
                    </Box>
                </Modal>


                <Modal
                    title="Modal For Payment"
                    open={isOpenPayment}
                    onOk={true}
                    onClose={handleCancel3} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
                    footer=""
                    sx={{
                        padding: 5,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "90%",
                            backgroundColor: "white",
                            height: "40vh",
                        }}
                    >
                        <Box style={{ height: "60vh" }}>
                            <>
                                {/* <form onSubmit={handleSubmit(onSubmitForm)}> */}
                                <Grid container sx={{ padding: "10px" }}>
                                    <Grid item
                                        spacing={3}
                                        xl={6}
                                        lg={6}
                                        md={6}

                                        sm={12}
                                        xs={12} sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: 20
                                        }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<ExitToAppIcon />}
                                            onClick={() => changePaymentStatus()}
                                        >
                                            <FormattedLabel id="payment" />
                                        </Button>
                                    </Grid>
                                    <Grid item
                                        spacing={3}
                                        xl={6}
                                        lg={6}
                                        md={6}

                                        sm={12}
                                        xs={12} sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: 20
                                        }}>
                                        <Button
                                            sx={{ marginRight: 8 }}
                                            variant="contained"
                                            color="primary"
                                            endIcon={<ClearIcon />}
                                            onClick={() => handleCancel3()}
                                        >
                                            <FormattedLabel id="closeModal" />
                                        </Button>
                                    </Grid>
                                </Grid>
                                {/* </form> */}
                            </>
                        </Box>
                    </Box>
                </Modal>
            </Paper>
        </>
    );
};

export default Index;
