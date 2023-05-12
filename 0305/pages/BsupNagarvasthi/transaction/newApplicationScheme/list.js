import {
    Box,
    Button,
    Grid,
    Paper,Tooltip 
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import DownloadIcon from '@mui/icons-material/Download';

const newApplicationSchemes = () => {
    const {
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm({});
    const [statusVal, setStatusVal] = useState(null)
    const router = useRouter();
    const [zoneNames, setZoneNames] = useState([]);
    const [wardNames, setWardNames] = useState([]);
    const [mainNames, setMainNames] = useState([]);
    const [pageSize, setPageSize] = useState();
    const [subSchemeNames, setSubSchemeNames] = useState([]);
    const language = useSelector((state) => state.labels.language);

    const [crAreaNames, setCRAreaName] = useState([]);
    const [bankMaster, setBankMasters] = useState([]);
    const [totalElements, setTotalElements] = useState();
    const [buttonInputState, setButtonInputState] = useState()

    const [pageNo, setPageNo] = useState()
    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    });
    //get logged in user
    const user = useSelector((state) => state.user.user)
    const loggedUser = localStorage.getItem("loggedInUser");

    useEffect(() => {
        getZoneName();
        getWardNames();
        getCRAreaName();
    }, []);

    useEffect(() => {
        getBachatGatCategoryNewScheme();
    }, [zoneNames, wardNames, crAreaNames]);

    let citizenUserData = useSelector((state) => {
        let citzUserNew = state?.user?.user?.id;
        return citzUserNew;
    });

    // Load zone
    const getZoneName = () => {
        axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
            setZoneNames(
                r.data.zone.map((row) => ({
                    id: row.id,
                    zoneName: row.zoneName,
                    zoneNameMr: row.zoneNameMr,

                })),
            );
        });
    };

    // load wards
    const getWardNames = () => {
        axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
            setWardNames(
                r.data.ward.map((row) => ({
                    id: row.id,
                    wardName: row.wardName,
                    wardNameMr: row.wardNameMr,

                })),
            );
        });
    };

    // getAreaName
    const getCRAreaName = () => {
        axios.get(`${urls.CfcURLMaster}/area/getAll`).then((r) => {
            setCRAreaName(
                r.data.area.map((row) => ({
                    id: row.id,
                    crAreaName: row.areaName,
                    crAreaNameMr: row.areaNameMr,

                })),
            );
        });
    };

    // load scheme details
    const getBachatGatCategoryNewScheme = (_pageSize = 10, _pageNo = 0) => {
        {
            loggedUser === "citizenUser"
                ? axios
                    .get(`${urls.BSUPURL}/trnSchemeApplicationNew/getAll`, {
                        headers: {
                            UserId: citizenUserData && citizenUserData,
                        },
                        params: {
                            pageSize: _pageSize,
                            pageNo: _pageNo,
                        },
                    })
                    .then((r) => {
                        setBachatGatCategoryNewSchemes(r, _pageSize, _pageNo)
                    })
                : axios
                    .get(`${urls.BSUPURL}/trnSchemeApplicationNew/getAll`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                        params: {
                            pageSize: _pageSize,
                            pageNo: _pageNo,
                        },
                    })
                    .then((r) => {
                        setBachatGatCategoryNewSchemes(r, _pageSize, _pageNo)
                    });
        }
    };

    // set details to list
    const setBachatGatCategoryNewSchemes = (r, _pageSize, _pageNo) => {
        let result = r.data.trnSchemeApplicationNewList;
        if (result.length != 0 && result != null) {
            if (wardNames && zoneNames && crAreaNames) {
                let _res = result?.map((r, i) => {
                    return {
                        activeFlag: r.activeFlag,
                        id: r.id,
                        srNo: (i + 1) + (_pageNo * _pageSize),
                        zoneKey: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                            ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                            : "-",
                        zoneKeyMr: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
                            ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
                            : "-",
                        wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                            ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                            : "-",
                        wardKeyMr: wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
                            ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
                            : "-",
                        areaKey: crAreaNames?.find((obj) => {
                            return obj.id == r.areaKey;
                        })?.crAreaName
                            ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaName
                            : "-",
                        areaKeyMr: crAreaNames?.find((obj) => {
                            return obj.id == r.areaKey;
                        })?.crAreaNameMr
                            ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaNameMr
                            : "-",
                        applicantAadharNo: r.applicantAadharNo,
                        applicationNo: r.applicationNo,
                        buildingName: r.buildingName,
                        roadName: r.roadName,
                        mobileNo: r.mobileNo,
                        emailId: r.emailId,
                        isBenifitedPreviously: r.isBenifitedPreviously,
                        pincode: r.pincode,
                        statusVal: r.status,
                        applicantName: r.applicantFirstName + " " + r.applicantMiddleName + " " + r.applicantLastName,
                        applicantFirstName: r.applicantFirstName,
                        applicantMiddleName: r.applicantMiddleName,
                        applicantLastName: r.applicantLastName,
                        trnSchemeApplicationDocumentsList: r.trnSchemeApplicationDocumentsList,
                        createdDate: moment(
                            r?.createDtTm,
                        ).format("DD-MM-YYYY"),
                        currStatus:
                            r.status === null
                                ? "pending"
                                : r.status === 0
                                    ? "Save As Draft"
                                    : r.status === 1
                                        ? "Send Back To Citizen"
                                        : r.status === 2
                                            ? "Send To Samuha Sanghatak"
                                            : r.status === 3
                                                ? "Send To Dept Clerk"
                                                : r.status === 4
                                                    ? "Send Back To Dept Clerk"
                                                    : r.status === 5
                                                        ? "Send To Asst Commissioner"
                                                        : r.status === 6
                                                            ? "Send Back To Asst Commissioner"
                                                            : r.status === 7
                                                                ? "Send To Dy Commissioner"
                                                                : r.status === 8
                                                                    ? "Send Back To Dy Commissioner"
                                                                    : r.status === 9
                                                                        ? "Send To Accountant"
                                                                        : r.status === 16
                                                                            ? "Send Back To Dept Clerk After Approval Dy Commissioner"
                                                                            : r.status === 10
                                                                                ? "Complete"
                                                                                : r.status === 11
                                                                                    ? "Close"
                                                                                    : r.status === 12
                                                                                        ? "Duplicate"
                                                                                        : r.status === 22
                                                                                            ? "Rejected"
                                                                                            : r.status === 23 ? "Send Back to Samuh Sanghtak"
                                                                                                : "Invalid",
                    };
                });
                setData({
                    rows: _res,
                    totalRows: r.data.totalElements,
                    rowsPerPageOptions: [10, 20, 50, 100],
                    pageSize: r.data.pageSize,
                    page: r.data.pageNo,
                });
            }
            setPageSize(r.data.pageSize)
            setPageNo(r.data.pageNo)
            setTotalElements(r.data.totalElements);
        }
    }

    // columns
    const columns = [
        {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "applicantName",
            headerName: <FormattedLabel id="applicantName" />,
            width: 250,
            align: "left",
            headerAlign: "center",
        },
        {
            field: language === "en" ? "areaKey" : "areaKeyMr",
            headerName: <FormattedLabel id="areaNm" />,
            width: 250,
            align: "left",
            headerAlign: "center",
        },
        {
            field: language === "en" ? "zoneKey" : "zoneKeyMr",
            headerName: <FormattedLabel id="zoneNames" />,
            width: 200,
            align: "left",
            headerAlign: "center",
        },
        {
            field: language === "en" ? "wardKey" : "wardKeyMr",
            headerName: <FormattedLabel id="wardname" />,
            width: 200,
            align: "left",
            headerAlign: "center",
        },

        {
            field: "applicationNo",
            headerName: <FormattedLabel id="applicationNo" />,
            width: 250,
            align: "center",
            headerAlign: "center",
        },

        {
            field: "applicantAadharNo",
            headerName: <FormattedLabel id="applicantAdharNo" />,
            width: 250,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "createdDate",
            headerName: <FormattedLabel id="schemeApplicationDate" />,
            width: 200,
            align: "left",
            headerAlign: "center",
        },
        {
            field: "currStatus",
            headerName: <FormattedLabel id="currentStatus" />,
            width: 250,
            align: "left",
            headerAlign: "center",
        },
        {
            field: "actions",
            headerName: <FormattedLabel id="actions" />,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton
                            onClick={() => {


                                // router.push({
                                //     pathname: "/BsupNagarvasthi/transaction/newApplicationScheme/edit",
                                //     query: {
                                //         id: params.row.id,
                                //     },
                                // });

                                ((loggedUser == "citizenUser" || loggedUser === "cfcUser") && params.row.statusVal == 1) ? router.push({
                                    pathname: "/BsupNagarvasthi/transaction/newApplicationScheme/edit",
                                    query: {
                                        id: params.row.id,
                                    },
                                }) :
                                    router.push({
                                        pathname: "/BsupNagarvasthi/transaction/newApplicationScheme/view",
                                        query: {
                                            id: params.row.id,
                                        },
                                    });
                            }}
                        >
                            <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                        </IconButton>

                        {((loggedUser == "citizenUser" || (loggedUser === "cfcUser")) && params.row.statusVal === 2) && (<IconButton
                            onClick={() => {
                                router.push({
                                    pathname:
                                        "/BsupNagarvasthi/transaction/acknowledgement",
                                    query: { id: params.row.applicationNo, trn: "N" },
                                })
                            }}
                        >
                            <Tooltip title={`DOWNLOAD ACKNOWLEDGEMENT`}>
                                <DownloadIcon style={{ color: "blue" }} />
                            </Tooltip>
                        </IconButton>)}
                    </Box>
                );
            },
        },
    ];

    // UI
    return (
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
                    background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
            >
                <h2>
                    <FormattedLabel id="titleNewApplicationSchemes" />
                </h2>
            </Box>

            <Grid container style={{ padding: "10px" }}>
                {(loggedUser === 'citizenUser' || loggedUser === 'cfcUser') &&
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
                        <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            type="primary"
                            disabled={buttonInputState}
                            onClick={() => {

                                router.push({
                                    pathname: "/BsupNagarvasthi/transaction/newApplicationScheme",
                                });
                            }}
                        >
                            <FormattedLabel id="add" />
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
                density="compact"
                pagination
                paginationMode="server"
                loading={data.loading}
                rowCount={totalElements}
                rowsPerPageOptions={[10, 20, 50, 100]}
                page={pageNo}
                pageSize={pageSize}
                rows={data.rows}
                columns={columns}
                onPageChange={(_data) => {
                    getBachatGatCategoryNewScheme(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                    getBachatGatCategoryNewScheme(_data, data.page);
                }}
            />
        </Paper>
    );
};

export default newApplicationSchemes;
