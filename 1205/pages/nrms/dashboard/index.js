import PrintIcon from "@mui/icons-material/Print";
import { EyeFilled } from "@ant-design/icons";
import { ApprovalRounded } from "@mui/icons-material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EditIcon from "@mui/icons-material/Edit";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, Grid, Paper, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";

// Main Component - Clerk
const Index = () => {
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [authority, setAuthority] = useState([]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 5,
    page: 1,
  });

  const [dashboardType, setDashboardType] = useState({ endPoint: "trnNewsPublishRequest", serviceId: 435 });

  const getMyApplications = async (
    _endPoint = "trnNewsPublishRequest",
    _serviceId = 435,
    _pageSize = 5,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc",
  ) => {
    setAuthority(
      user?.menus?.find((r) => {
        return r.id == _serviceId;
      })?.roles,
    );

    axios
      .get(`${urls.NRMS}/${_endPoint}/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
          serviceId: _serviceId,
        },
      })
      .then((resp) => {
        let response = [];
        console.log("resp: ", resp);
        if (_endPoint == "trnNewsPublishRequest") {
          response = resp?.data?.trnNewsPublishRequestList?.map((item, i) => {
            return { ...item, srNo: i + 1 + _pageNo * _pageSize };
          });
        } else if (_endPoint == "trnNewspaperAgencyBillSubmission") {
          response = resp?.data?.trnNewspaperAgencyBillSubmissionList?.map((item, i) => {
            return {
              ...item,
              srNo: i + 1 + _pageNo * _pageSize,
              newsPublishDate: item?.newsPublishRequestDao?.newsPublishDate,
              departmentName: item?.newsPublishRequestDao?.departmentName,
              departmentNameMr: item?.newsPublishRequestDao?.departmentNameMr,
            };
          });
        } else if (_endPoint == "trnPressNoteRequestApproval") {
          response = resp?.data?.trnPressNoteRequestApprovalList?.map((item, i) => {
            return { ...item, srNo: i + 1 + _pageNo * _pageSize };
          });
        } else if (_endPoint == "trnPaperCuttingBook") {
          response = resp?.data?.trnPaperCuttingBookList?.map((item, i) => {
            return { ...item, srNo: i + 1 + _pageNo * _pageSize };
          });
        }
        setData({
          rows: response,
          totalRows: resp?.data?.totalElements,
          rowsPerPageOptions: [5, 10, 20, 50, 100],
          pageSize: resp?.data?.pageSize,
          page: resp?.data?.pageNo,
        });
      });
  };

  const [columns, setColumns] = useState([
    {
      field: "srNo",
      headerName: "Sr No",
      align: "left",
      headerAlign: "left",
      width: 50,
    },

    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: "Department Name",
      // minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "newsPublishRequestNo",
      headerName: "News Rotation Request Number",
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "newsPublishDate",
      headerName: "News Rotation Request Number",
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
    },

    {
      field: language == "en" ? "priorityName" : "priorityNameMr",
      headerName: "News Rotation Request Number",
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 50,
      // minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "left",
      headerAlign: "left",
      // minWidth: 100,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {authority?.includes("ENTRY") && (
              <>
                {params?.row?.status == "DRAFTED" && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: "/nrms/transaction/AdvertisementRotation/create",
                        query: {
                          pageMode: "Edit",
                          id: params.row.id,
                        },
                      });
                    }}
                  >
                    <EditIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                )}
              </>
            )}

            {params?.row?.status == "RELEASING_ORDER_GENERATED" && (
              <IconButton
                onClick={() => {
                  router.push({
                    pathname: "/nrms/transaction/releasingOrder/news/",
                    query: {
                      pageMode: "View",
                      id: params?.row?.id,
                    },
                  });
                }}
              >
                <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
              </IconButton>
            )}

            {(authority?.includes("RELEASING_ORDER_ENTRY") ||
              authority?.includes("APPROVAL") ||
              authority?.includes("FINAL_APPROVAL")) &&
              !["DRAFTED", "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT"].includes(params?.row?.status) && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: "/nrms/transaction/AdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: params?.row?.id,
                      },
                    });
                    console.log(":row", params?.row);
                    ("");
                  }}
                >
                  <Button variant="contained" endIcon={<EyeFilled />}>
                    Action
                  </Button>
                </IconButton>
              )}
          </Box>
        );
      },
    },
  ]);

  useEffect(() => {
    getMyApplications();
  }, []);

  useEffect(() => {
    if (dashboardType.endPoint == "trnNewsPublishRequest") {
      setColumns([
        {
          field: "srNo",
          headerName: "Sr No",
          align: "left",
          headerAlign: "left",
          width: 50,
        },

        {
          field: language == "en" ? "departmentName" : "departmentNameMr",
          headerName: "Department Name",
          // minWidth: 100,
          flex: 1,
          align: "left",
          headerAlign: "left",
        },

        {
          field: "newsPublishRequestNo",
          headerName: "News Rotation Request Number",
          flex: 1,
          minWidth: 100,
          align: "left",
          headerAlign: "left",
        },

        {
          field: "newsPublishDate",
          headerName: "News Rotation Request Number",
          flex: 1,
          minWidth: 100,
          align: "left",
          headerAlign: "left",
        },

        {
          field: language == "en" ? "priorityName" : "priorityNameMr",
          headerName: "News Rotation Request Number",
          flex: 1,
          minWidth: 100,
          align: "left",
          headerAlign: "left",
        },

        {
          field: "status",
          headerName: "Status",
          minWidth: 50,
          // minWidth: 100,
          flex: 1,
          align: "left",
          headerAlign: "left",
        },
        {
          field: "actions",
          headerName: "Actions",
          width: 200,
          align: "left",
          headerAlign: "left",
          // minWidth: 100,
          flex: 1,
          sortable: false,
          disableColumnMenu: true,
          renderCell: (params) => {
            return (
              <Box>
                {authority?.includes("ENTRY") && (
                  <>
                    {params?.row?.status == "DRAFTED" && (
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "/nrms/transaction/AdvertisementRotation/create",
                            query: {
                              pageMode: "Edit",
                              id: params.row.id,
                            },
                          });
                        }}
                      >
                        <EditIcon style={{ color: "#556CD6" }} />
                      </IconButton>
                    )}
                  </>
                )}

                {params?.row?.status == "RELEASING_ORDER_GENERATED" && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: "/nrms/transaction/releasingOrder/news/",
                        query: {
                          pageMode: "View",
                          id: params?.row?.id,
                        },
                      });
                    }}
                  >
                    <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                )}

                {(authority?.includes("RELEASING_ORDER_ENTRY") ||
                  authority?.includes("APPROVAL") ||
                  authority?.includes("FINAL_APPROVAL")) &&
                  !["DRAFTED", "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT"].includes(params?.row?.status) && (
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: "/nrms/transaction/AdvertisementRotation/create",
                          query: {
                            pageMode: "PROCESS",
                            id: params?.row?.id,
                          },
                        });
                        console.log(":row", params?.row);
                        ("");
                      }}
                    >
                      <Button variant="contained" endIcon={<EyeFilled />}>
                        Action
                      </Button>
                    </IconButton>
                  )}
              </Box>
            );
          },
        },
      ]);
    } else if (dashboardType.endPoint == "trnNewspaperAgencyBillSubmission") {
      setColumns([
        {
          field: "srNo",
          headerName: "Sr No",
          align: "center",
          headerAlign: "center",
          width: 50,
        },

        {
          field: "billNo",
          headerName: "Bill No",
          minWidth: 100,
          flex: 1,
          align: "center",
          headerAlign: "center",
        },
        {
          field: language == "en" ? `departmentName` : `departmentNameMr`,
          // field: "departmentName",
          headerName: "Department Name",
          minWidth: 150,
          flex: 1,
          align: "center",
          headerAlign: "center",
        },

        {
          field: "newsPublishDate",
          headerName: "News/Advertisement Publish Date",
          // width: 250,
          minWidth: 100,
          flex: 1,
          align: "center",
          headerAlign: "center",
        },

        {
          field: "billAmount",
          headerName: "Bill Amount",
          width: 80,
          flex: 1,
          align: "center",
          headerAlign: "center",
        },

        {
          field: "status",
          headerName: "Status",
          // width: 250,
          minWidth: 100,
          flex: 1,
          align: "center",
          headerAlign: "center",
        },

        {
          field: "actions",
          headerName: "Actions",
          width: 200,
          // minWidth: 100,
          flex: 1,
          sortable: false,
          disableColumnMenu: true,
          renderCell: (params) => {
            return (
              <Box>
                <IconButton
                  onClick={() => {
                    const record = params.row;

                    router.push({
                      pathname: "/nrms/transaction/newsPaperAgencybill/create/",
                      // pathname: "/nrms/transaction/newsPaperAgencybill/approval/",
                      query: {
                        pageMode: "View",
                        ...record,
                      },
                    });
                    console.log("row", params.row);
                    ("");
                  }}
                >
                  <EyeFilled style={{ color: "#556CD6" }} />
                </IconButton>

                {authority?.includes("ENTRY") && (
                  <>
                    {params.row.status == "DATA_PUSHED_TO_FICO_SAP" && (
                      <IconButton
                        onClick={() => {
                          localStorage.setItem("newspaperAgencyBillSubmissionId", params?.row?.id);
                          router.push("/nrms/transaction/releasingOrder/payment/");
                        }}
                      >
                        <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                      </IconButton>
                    )}
                    {["DRAFTED", "REVERT_BACK_TO_DEPT_USER"].includes(params.row.status) && (
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "/nrms/transaction/newsPaperAgencybill/create/",
                            query: {
                              pageMode: "Edit",
                              ...params.row,
                            },
                          });
                          // setBtnSaveText("Update"),
                          // setID(params.row.id)
                        }}
                      >
                        <EditIcon style={{ color: "#556CD6" }} />
                      </IconButton>
                    )}
                  </>
                )}

                {authority?.includes("FINAL_APPROVAL") && params.row.status != "DRAFTED" && (
                  <>
                    <Tooltip title="APPROVE">
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "/nrms/transaction/newsPaperAgencybill/create",
                            query: {
                              pageMode: "PROCESS",
                              id: params.row.id,
                            },
                          });
                        }}
                      >
                        <ApprovalRounded style={{ color: "#556CD6" }} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}

                {/* <IconButton 
                        onClick={() => {
    
                          const record = params.row
                          router.push({
                            pathname: "/nrms/transaction/newsPaperAgencybill/payment/",
                            query: {
                              pageMode: 'View',
                              ...record,
                            },
                          })
                          console.log('row', params.row)
                            ; ('')
                        }}
                      >
                        <ForwardIcon style={{ color: "#556CD6" }} />
                      </IconButton> */}
              </Box>
            );
          },
        },
      ]);
    } else if (dashboardType.endPoint == "trnPressNoteRequestApproval") {
      setColumns([
        {
          headerName: "Sr No",
          field: "srNo",
          minWidth: 50,
          align: "center",
          headerAlign: "left",
        },
        {
          headerName: "Press Note Request Number",
          field: "pressNoteRequestNo",
          minWidth: 200,
          align: "left",
          headerAlign: "left",
          renderCell: (params) => (
            <Tooltip title={params.row.pressNoteRequestNo}>
              <span className="csutable-cell-trucate">{params.row.pressNoteRequestNo}</span>
            </Tooltip>
          ),
        },
        {
          headerName: <FormattedLabel id="ward" />,
          field: language === "en" ? "wardName" : "wardNameMr",
          minWidth: 100,
          align: "left",
          headerAlign: "left",
        },
        {
          headerName: <FormattedLabel id="department" />,
          field: language === "en" ? "departmentName" : "departmentNameMr",
          width: 150,
          align: "left",
          headerAlign: "left",
          renderCell: (params) => (
            <Tooltip title={language === "en" ? params.row.departmentName : params.row.departmentNameMr}>
              <span className="csutable-cell-trucate">
                {language === "en" ? params.row.departmentName : params.row.departmentNameMr}
              </span>
            </Tooltip>
          ),
        },

        {
          headerName: <FormattedLabel id="newsPaperName" />,
          field: language === "en" ? "newsPaperName" : "newsPaperNameMr",
          minWidth: 200,
          align: "left",
          headerAlign: "left",
        },
        {
          headerName: <FormattedLabel id="priority" />,
          field: language === "en" ? "priorityName" : "priorityNameMr",
          minWidth: 100,
          align: "left",
          headerAlign: "left",
          renderCell: (params) => (
            <Tooltip title={language === "en" ? params.row.priorityName : params.row.priorityNameMr}>
              <span className="csutable-cell-trucate">
                {language === "en" ? params.row.priorityName : params.row.priorityNameMr}
              </span>
            </Tooltip>
          ),
        },
        {
          headerName: <FormattedLabel id="status" />,
          field: "status",
          minWidth: 200,
          align: "left",
          headerAlign: "left",
          renderCell: (params) => (
            <Tooltip title={language === "en" ? params.row.status : params.row.status}>
              <span className="csutable-cell-trucate">
                {language === "en" ? params.row.status : params.row.status}
              </span>
            </Tooltip>
          ),
        },
        {
          field: "actions",
          headerName: <FormattedLabel id="action" />,
          minWidth: 200,
          align: "center",
          headerAlign: "center",
          eaderAlign: "center",
          sortable: false,
          disableColumnMenu: true,
          renderCell: (params) => {
            return (
              <Box>
                {/* view button */}
                <Tooltip title="View">
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: "/nrms/transaction/pressNoteRelease/create",
                        query: {
                          pageMode: "View",
                          id: params.row.id,
                        },
                      });
                    }}
                  >
                    <EyeFilled style={{ color: "#556CD6" }} />
                  </IconButton>
                </Tooltip>

                {/* edit button */}
                {(authority?.includes("ENTRY") || authority?.includes("ADMIN")) &&
                  params.row.status == "DRAFTED" && (
                    <>
                      <Tooltip title="EDIT">
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname: "/nrms/transaction/pressNoteRelease/create",
                              query: {
                                pageMode: "Edit",
                                id: params.row.id,
                              },
                            });
                          }}
                        >
                          <EditIcon style={{ color: "#556CD6" }} />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                {/* process logic */}
                {(authority?.includes("APPROVAL") ||
                  authority?.includes("RELEASING_ORDER_ENTRY") ||
                  authority?.includes("FINAL_APPROVAL") ||
                  authority?.includes("ENTRY")) &&
                  params.row.status != "DRAFTED" && (
                    <>
                      <Tooltip title="APPROVE">
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname: "/nrms/transaction/pressNoteRelease/create",
                              query: {
                                pageMode: "PROCESS",
                                id: params.row.id,
                              },
                            });
                          }}
                        >
                          <ApprovalRounded style={{ color: "#556CD6" }} />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                {/* press note release order print */}
                {(authority?.includes("ENTRY") || authority?.includes("ADMIN")) &&
                  params.row.status == "RELEASING_ORDER_GENERATED" && (
                    <>
                      <IconButton
                        onClick={() => {
                          {
                            handlePrint;
                          }
                          router.push({
                            pathname: "/nrms/transaction/releasingOrder/press",
                            query: {
                              pageMode: "View",
                              id: params.row.id,
                            },
                          });
                        }}
                      >
                        <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                      </IconButton>

                      {/* <IconButton
                      onClick={() => {
                        { handlePrint }
                        const record = selectedObject;
                        router.push({
                          pathname:
                            '/nrms/report/PaperCuttingBook/pressCut',
                          query: {
                            pageMode: "View",
                            id: params.row.id
                          },
                        })
                      }}  >
                      <ForwardIcon style={{ color: "#556CD6" }} />
                    </IconButton> */}
                    </>
                  )}
              </Box>
            );
          },
        },
      ]);
    } else if (dashboardType.endPoint == "trnPaperCuttingBook") {
      setColumns([
        {
          field: "srNo",
          headerName: <FormattedLabel id="srNo" />,
          align: "left",
          headerAlign: "left",
          width: 50,
        },
        // {
        //   field: "newsPublishRequestNo",
        //   headerName: <FormattedLabel id="newsreqNumber" />,
        //   width: 50,
        //   flex: 1,
        //   align: "left",
        //   headerAlign: "left",
        // },
        {
          field: "departmentName",
          headerName: <FormattedLabel id="departmentName" />,
          minWidth: 100,
          flex: 1,
          align: "left",
          headerAlign: "left",
        },

        {
          field: "newspaperName",
          headerName: <FormattedLabel id="newsPaperName" />,
          minWidth: 100,
          flex: 1,
          align: "left",
          headerAlign: "left",
        },

        {
          field: "publishedDate",
          headerName: <FormattedLabel id="publishDate" />,
          // width: 250,
          minWidth: 150,
          flex: 1,
          align: "left",
          headerAlign: "left",
        },
        {
          field: "actions",
          headerName: <FormattedLabel id="action" />,
          headerAlign: "left",
          width: 200,
          align: "left",
          // minWidth: 100,
          eaderAlign: "left",
          flex: 1,
          sortable: false,
          disableColumnMenu: true,
          renderCell: (params) => {
            return (
              <Box>
                <IconButton
                  onClick={() => {
                    // swal("Record Send Successfully", "success");
                    router.push({
                      pathname: "/nrms/transaction/paperCuttingBook/newsCut",
                      query: {
                        pageMode: "View",
                        id: params.row.id,
                      },
                    });
                  }}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </IconButton>
                {authority && authority.includes("VIEW") ? (
                  <IconButton
                    onClick={() => {
                      const record = selectedObject;
                      router.push({
                        pathname: "/nrms/transaction/paperCuttingBook/paperCutingReport",
                        query: {
                          pageMode: "View",
                          id: params.row.id,
                        },
                      });
                    }}
                  >
                    <PrintIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                ) : (
                  <></>
                )}
              </Box>
            );
          },
        },
      ]);
    }
  }, [authority, dashboardType, language, router]);

  return (
    <>
      <div>
        <Paper component={Box} squar="true" elevation={5} m={1} pt={2} pb={2} pr={2} pl={4}>
          <Grid container>
            {/** Applications Tabs */}
            <Grid item xs={12}>
              <h3 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>
                  {language == "en"
                    ? "News Rotation Management System Dashboard"
                    : "वृत्तपत्र जाहिरात प्रणाली डॅशबोर्ड"}
                </b>
              </h3>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{ height: "160px" }}
                component={Box}
                p={2}
                m={2}
                squar="true"
                elevation={5}
                // sx={{ align: "center" }}
              >
                <div className={styles.test}>
                  {/** Advertisement Rotation */}
                  <div
                    className={styles.one}
                    // onClick={() => clerkTabClick('TotalApplications')}
                  >
                    <div className={styles.icono}>
                      <NewspaperIcon color="secondary" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <Button
                        onClick={() => {
                          setDashboardType({ endPoint: "trnNewsPublishRequest", serviceId: 435 }),
                            getMyApplications("trnNewsPublishRequest", 435);
                        }}
                      >
                        <strong align="center">
                          {language == "en" ? "Advertisement Rotation" : "बातमी/जाहिरातीचे रोटेशन"}
                        </strong>
                      </Button>
                    </div>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Press Note Release */}
                  <div className={styles.one}>
                    <div className={styles.icono}>
                      <NoteAltIcon color="error" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <Button
                        onClick={() => {
                          setDashboardType({ endPoint: "trnPressNoteRequestApproval", serviceId: 1103 }),
                            getMyApplications("trnPressNoteRequestApproval", 1103);
                        }}
                      >
                        <strong align="center">
                          {language == "en" ? "Press Note Release" : "प्रेस नोट रिलीझ"}
                        </strong>
                      </Button>
                    </div>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Paper Cutting Book */}
                  <div
                    className={styles.one}
                    // onClick={() => clerkTabClick('PENDING')}
                  >
                    <div className={styles.icono}>
                      <ContentCutIcon color="warning" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <Button
                        onClick={() => {
                          setDashboardType({ endPoint: "trnPaperCuttingBook", serviceId: 1102 }),
                            getMyApplications("trnPaperCuttingBook", 1102);
                        }}
                      >
                        <strong align="center">
                          {language == "en" ? "Paper Cutting Book" : "पेपर कटिंग बुक"}
                        </strong>
                      </Button>
                    </div>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** newsPaper Agency bill */}
                  <div className={styles.one}>
                    <div className={styles.icono}>
                      <CurrencyRupeeIcon color="success" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <Button
                        onClick={() => {
                          setDashboardType({ endPoint: "trnNewspaperAgencyBillSubmission", serviceId: 1101 }),
                            getMyApplications("trnNewspaperAgencyBillSubmission", 1101);
                        }}
                      >
                        <strong align="center">
                          {language == "en"
                            ? "News Paper Agency Bill Submission"
                            : "न्यूजपेपर एजन्सी बिल सबमिशन"}
                        </strong>
                      </Button>
                    </div>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </div>

      <Box
        style={{
          backgroundColor: "white",
          height: "auto",
          width: "auto",
          overflow: "auto",
        }}
      >
        <DataGrid
          rowHeight={70}
          getRowId={(row) => row.srNo}
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
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getMyApplications(dashboardType.endPoint, dashboardType.serviceId, data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getMyApplications(dashboardType.endPoint, dashboardType.serviceId, _data, data.page);
          }}
        />
      </Box>
    </>
  );
};

export default Index;
