import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Divider,
  IconButton,
  // Card,
  // Checkbox,
  // FormControl,
  // FormControlLabel,
  // FormHelperText,
  // FormLabel,
  // Grid,
  // InputLabel,
  // MenuItem,
  // Radio,
  // RadioGroup,
  // Select,
  // TextField,
  Paper,
  Tooltip,
} from "@mui/material";
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid, GridToolbar, GridViewStreamIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
import { EyeFilled } from "@ant-design/icons";
import urls from "../../../../URLS/urls";

const Index = () => {
  const token = useSelector((state) => state.user.user.token);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [editButtonInputState, setEditButtonInputState] = useState(false);

  //   let selectedMenuFromDrawer = Number(
  //     localStorage.getItem("selectedMenuFromDrawer")
  //   );

  // const authority = user?.menus?.find((r) => {
  //   return r.id == selectedMenuFromDrawer;
  // })?.roles;

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log("r.roles", r.roles);
        return r;
      }
    })?.roles;
    console.log("auth0000", auth);
    setAuthority(auth);
  }, []);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDeptName();
    getOfficeName();
  }, []);

  useEffect(() => {
    getAllOpinion();
  }, [concenDeptNames, officeName]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  const getAllOpinion = (_pageSize = 10, _pageNo = 0) => {
    console.log(
      "_pageSize,_pageNo",
      _pageSize,
      _pageNo,
      `${urls.LCMSURL}/transaction/opinion/getAll`
    );
    axios
      .get(`${urls.LCMSURL}/transaction/opinion/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("r765", r);
        let result = r.data.opinion;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44", r);
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            advPanel: r.advPanel,
            id: r.id,
            srNo: i + 1,
            opinionRequestDate: moment(r.opinionRequestDate).format(
              "DD-MM-YYYY"
            ),

            searchTitleRptDate: moment(r.searchTitleRptDate).format(
              "DD-MM-YYYY"
            ),

            finalDraftDeliveryDate: moment(r.finalDraftDeliveryDate).format(
              "DD-MM-YYYY"
            ),
            opinionSubject: r.opinionSubject,
            // concenDeptName: r.concenDeptName,
            concenDeptId: r.concenDeptId,
            concenDeptName: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.department,

            advPanel: r.advPanel,
            panelRemarks: r.panelRemarks,
            reportRemarks: r.reportRemarks,
            remarks: r.remarks,
            opinionSubmisionDate: moment(r.opinionSubmisionDate).format(
              "YYYY-MM-DD"
            ),
            opinion: r.opinion,
            officeLocation: r.officeLocation,
            officeLocationNameText: officeName?.find(
              (obj) => obj?.id === r.officeLocation
            )?.officeLocationName,
            officeLocationNameTextMr: officeName?.find(
              (obj) => obj?.id === r.officeLocation
            )?.officeLocationNameMr,

            department: r.department,
            department: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.department,
            departmentMr: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.departmentMr,

            opinionMr: r.opinionMr,

            panelRemarks: r.panelRemarks,
            panelRemarksMr: r.panelRemarksMr,
            reportRemarksMr: r.reportRemarksMr,

            courtCaseNumber: r.courtCaseNumber,

            filedBy: r.filedBy,
            filedByMr: r.filedByMr,
            caseDetails: r.caseDetails,
            caseDetailsMr: r.caseDetailsMr,
            caseNumber: r?.courtCaseEntry?.caseNumber,
            role: r.status,

            // advPanel: true,

            // status: r.activeFlag === "Y" ? "Active" : "Inactive",

            status: r.status,
            advPanelremark:r.advPanelremark,
            advRptRemark:r.advRptRemark,

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

  const getDeptName = () => {
    // alert("HEllo");
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setconcenDeptName(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
          departmentMr: r.departmentMr,
        }))
      );
    });
  };

  // get Location Name

  const getOfficeName = () => {
    axios.get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`).then((res) => {
      console.log("ghfgf", res);
      setOfficeName(
        res.data.officeLocation.map((r, i) => ({
          id: r.id,
          officeLocationName: r.officeLocationName,
          officeLocationNameMr: r.officeLocationNameMr,
        }))
      );
    });
  };

  //Delete By ID

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
      role: "OPINION_SAVE_AS_DRAFT",
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
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getAllOpinion();
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
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getAllOpinion();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Edit Record
  const actionOnRecord = (record, pageMode) => {
    console.log("Record : ---> ", record);
    router.push({
      pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
      query: {
        pageMode: pageMode,
        ...record,
      },
    });
  };

  // opinion Submission
  const opinionSubmission = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/opinion/opinionSubmission",
      query: {
        pageMode: "opinionSubmission",
        ...record,
        // caseEntry: record.id,
      },
    });
  };

  // opinion Submission
  const opinionApprove = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/opinion/approveOpinion",
      query: {
        pageMode: "opinionApprove",
        ...record,
        // caseEntry: record.id,
      },
    });
  };

  // Add OPinion

  const addOpinion = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/addOpinion/addOpinion",
      query: {
        pageMode: "addOpinion",
        ...record,
        // caseEntry: record.id,
      },
    });
  };

  // add Hearing
  const addHearing = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/opinion/approveOpinion",
      query: {
        pageMode: "addHearing",
        ...record,
        caseEntry: record.id,
      },
    });
  };

  const columns = [
    {
      // headerName: "Sr.No",
      headerName: <FormattedLabel id="srNo" />,

      field: "srNo",
      width: 130,
      // headerAlign: "center",
      // align: "center",

      // dataIndex: "name",
    },

    {
      // headerName: "Opinion Request date",
      headerName: <FormattedLabel id="opinionRequestDate" />,
      field: "opinionRequestDate",
      width: 210,
      // headerAlign: "center",
      // align: "center",
    },

    {
      headerName: <FormattedLabel id="locationName" />,

      field:
        language === "en"
          ? "officeLocationNameText"
          : "officeLocationNameTextMr",

      // field:"officeLocationName",
      width: 210,
      // headerAlign: "center",
      // align: "center",
    },

    {
      headerName: <FormattedLabel id="deptName" />,

      // field: "concenDeptName",

      field: language === "en" ? "department" : "departmentMr",

      width: 260,
      // headerAlign: "center",
      // align: "center",
    },

    {
      headerName: <FormattedLabel id="statuDetails" />,
      // headerName:"Status",

      // field: "concenDeptName",

      field: "status",

      width: 270,
      // headerAlign: "center",
      // align: "center",
    },

    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="action" />,
      width: 250,
      sortable: false,
      disableColumnMenu: true,
      // headerAlign: "center",
      // align: "center",
      renderCell: (params) => {
        return (
          <Box>
            {/* {console.log("22", params.row)} */}

            {/* For Opinion Submission */}
            {/* <IconButton>
              <Button
                variant="outlined"
                onClick={() => opinionSubmission(params.row)}
              >
              
                Opinion Submission
              </Button>
            </IconButton> */}

            {/* OPinion Submission Role wise */}

            {/* {console.log(
              "authority",
              authority,
              params.row.role,
              authority?.includes("ADD_OPINION") &&
                // params.row.role === "OPINION_CREATED"
            )} */}

            {/* {authority?.includes("OPINION_SUBMISSION") &&
              params.row.role === "ADD_OPINION_SUBMITTED" && (
                <IconButton>
                  <Button
                    variant="outlined"
                    onClick={() => opinionSubmission(params.row)}
                  >
                    Opinion Submission
                  </Button>
                </IconButton>
              )} */}

            {/* {authority?.includes("ADD_OPINION") &&
              // params.row.status==='OPINION_CREATED'
              // params.row.role === "OPINION_CREATED" && 
              (
                <IconButton>
                  <Button
                    variant="outlined"
                    onClick={() => addOpinion(params.row)}
                  >
                    Add Opinion
                  </Button>
                </IconButton>
              )} */}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname: "/LegalCase/transaction/opinion/createOpinion",
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

            {authority.includes("OPINION_SAVE_AS_DRAFT") &&
              params.row.status === "OPINION_SAVE_AS_DRAFT" && (
                <>
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      const record = params.row;

                      router.push({
                        pathname:
                          "/LegalCase/transaction/opinion/createOpinion",
                        query: {
                          pageMode: "Edit",
                          ...record,
                          role: "OPINION_SAVE_AS_DRAFT",
                        },
                      });
                      console.log("row", params.row);
                      ("");
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
                </>
              )}

            {authority?.includes("OPINION_SUBMISSION") &&
              params.row.status == "ADD_OPINION_SUBMITTED" && 
              (params.row.advPanelremark==true && params.row.advRptRemark==true) &&
              (
                // params.row.role === "ADD_OPINION_SUBMITTED" &&
                // old Button
                // <IconButton>
                //   <Button
                //     variant="outlined"
                //     onClick={() => opinionSubmission(params.row)}
                //   >
                //     Opinion Submission
                //   </Button>
                // </IconButton>

                // New Button

                <Tooltip title="Opinion Submission">
                  <IconButton
                  // sx={{
                  //   "&:hover": {
                  //     backgroundColor: "transparent",
                  //     cursor: "default"
                  //     }
                  // }}
                  >
                    <Button
                      variant="contained"
                      sx={{ width: "180px", height: "30px" }}
                      // disabled={editButtonInputState}
                      onClick={() => opinionSubmission(params.row)}
                    >
                      Opinion Submission
                    </Button>
                  </IconButton>
                </Tooltip>
              )}

            {authority?.includes("OPINION_APPROVAL") &&
              params.row.status == "OPINION_APPROVED" && (
                // params.row.role === "ADD_OPINION_SUBMITTED" &&
                <Tooltip title="Opinion Submission">
                  <IconButton>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ width: "180px", height: "30px" }}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/LegalCase/transaction/opinion/digitalSignature",
                          query: {
                            pageMode: "Final",
                            ...params.row,
                          },
                        })
                      }
                    >
                      DIGITAL SIGNATURE
                    </Button>
                  </IconButton>
                </Tooltip>
              )}

            {/* latest */}

            {authority?.includes("OPINION_APPROVAL") &&
              // &&  params.row.role === "OPINION_SUBMITTED"
              params.row.status == "OPINION_SUBMITTED" && (
                // <IconButton>
                //   <Button
                //     variant="outlined"
                //     onClick={() => opinionApprove(params.row)}
                //   >
                //     Opinion Approval
                //   </Button>
                // </IconButton>

                // New Button
                <Tooltip title="Opinion Submission">
                  <IconButton>
                    <Button
                      variant="contained"
                      sx={{ width: "180px", height: "30px" }}
                      // disabled={editButtonInputState}
                      onClick={() => opinionApprove(params.row)}
                    >
                      Opinion Approval
                    </Button>
                  </IconButton>
                </Tooltip>
              )}

            {/* Approve Button */}
            {/* {authority?.includes("OPINION_SUBMISSION") &&
              params.row.role === "OPINION_APPROVED" && (
                <IconButton>
                  <Button
                    variant="outlined"
                    // onClick={() => opinionSubmission(params.row)}
                  >
                    Approved
                  </Button>
                </IconButton>
            )} */}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          // marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="opinion" />
          </h2>
        </Box>

        <Divider />

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: 10,
              marginRight: "10px",
            }}
          >
            {console.log("authority77", authority)}

            {authority?.includes("CREATE_OPINION") ? (
              <Button
                // type="primary"
                variant="contained"
                onClick={() =>
                  router.push({
                    pathname: `/LegalCase/transaction/opinion/createOpinion`,
                    // query: {
                    //   pageMode: pageMode,
                    //   role:"OPINION_SAVE_AS_DRAFT"
                    // },
                  })
                }
                endIcon={<AddIcon />}
              >
                <FormattedLabel id="add" />
              </Button>
            ) : (
              ""
            )}

            {/* old */}

            {/* <Button
              // type="primary"
              variant="contained"
              onClick={() =>
                router.push(`/LegalCase/transaction/opinion/createOpinion`)
              }
            >
              <FormattedLabel id="add" />
            </Button>  */}
          </div>

          {/* </Paper> */}

          {/* New Table */}
          <Box
            sx={{
              // height: "100%",
              // width: 1000,
              // marginLeft: 10,
              // marginTop: "10px",
              border: 1,
              marginTop:"10px"

              // width: '100%',

              // overflowX: 'auto',
            }}
          >
            <DataGrid
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,
                // border:1,

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
                // getCaseType(data.pageSize, _data);
                getAllOpinion(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllOpinion(_data, data.page);
              }}
            />
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default Index;
