import { EyeFilled } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Button, Grid, IconButton, Paper, Typography, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/LegalCaseSchema/newCourtCaseSchema";
// import writtenStatementToPrint from "../../../../pages/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/printWrittenStatement";
import PRINTWRITTENSTATEMENT from "./parawiseRequest/printWrittenStatement";
import urls from "../../../../URLS/urls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
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
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [caseNumbers1, setCaseNumbers1] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [isReady, setIsReady] = useState("none");
  const [printData, setPrintData] = useState("none");

  const [caseEntry, setCaseEntry] = useState([]);

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
    pageSize: 20,
    page: 1,
  });

  /* Case Type  - Case Main Type*/
  const getCaseNumberAll = () => {
    axios.get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`).then((res) => {
      setCaseNumbers1(
        res.data.newCourtCaseEntry.map((r, i) => ({
          id: r.id,
          caseNumber: r.caseNumber,
        })),
      );
    });
  };

  // Case Types
  const getCaseTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      setCaseTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          caseMainType: r.caseMainType,
        })),
      );
    });
  };

  // Case Sub Types
  const getCaseSubType = () => {
    axios.get(`${urls.LCMSURL}/master/caseSubType/getAll`).then((res) => {
      setCaseSubTypes(
        res.data.caseSubType.map((r, i) => ({
          id: r.id,
          subType: r.subType,
        })),
      );
    });
  };

  // Gete Years
  const getYears = () => {
    axios.get(`${urls.CFCURL}/master/year/getAll`).then((res) => {
      setYears(
        res.data.year.map((r, i) => ({
          id: r.id,
          year: r.year,
        })),
      );
    });
  };

  // Court Names
  const getCourtName = () => {
    axios.get(`${urls.LCMSURL}/master/court/getAll`).then((res) => {
      setCourtNames(
        res.data.court.map((r, i) => ({
          id: r.id,
          // caseMainType: r.caseMainType,
          courtNameEn: r.courtName,
          courtNameMr: r.courtMr,
        })),
      );
    });
  };

  // Advocate Name
  const getAdvocateName = () => {
    axios.get(`${urls.LCMSURL}/master/advocate/getAll`).then((res) => {
      setAdvocateNames(
        res.data.advocate.map((r, i) => ({
          id: r.id,
          advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
          advocateNameMr: r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
        })),
      );
    });
  };

  // DepartmentName
  const getDepartmentName = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartmentNames(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
    });
  };

  // mark as completed

  const approveWrittenStatementByHod = (Data) => {
    console.log("dataSagar", Data);
    let body = {
      id: Data.id,
    };
    console.log("body", body);
    axios
      .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/printWrittenStatementByLawyer`, body, {})
      .then((res) => {
        console.log("createWrittenStatementByLawyer", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        } else if (res.status == 200) {
          sweetAlert("Updated!", "Record Updated successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      });
  };

  // Case entry
  const getAllCaseEntry = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    //user
    console.log("user", user);
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("r", r);
        let neww = [];
        let result = r.data.newCourtCaseEntry;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,

            // Generate Sr No based on the page size and page no
            srNo: _pageSize * _pageNo + i + 1,

            caseNumber: r.caseNumber,
            courtCaseNumber: r.courtCaseNumber,
            caseReference: r.caseReference,
            caseMainType: r.caseMainType,
            courtName: r.courtName,
            court: r.court,
            stampNo: r.stampNo,
            fillingDate: r.fillingDate,
            fillingDateT: moment(r.fillingDate).format("DD-MM-YYYY"),
            advocateName: r.advocateName,
            advocateName1: advocateNames?.find((obj) => obj.id === r.advocateName)?.advocateName,
            advocateNameMr: advocateNames?.find((obj) => obj.id === r.advocateName)?.advocateNameMr,
            filedBy: r.filedBy,
            filedByMr: r.filedByMr,
            filedAgainst: r.filedAgainst,
            caseDetails: r.caseDetails,
            caseMainType: r.caseMainType,
            caseMainTypeName: caseTypes?.find((obj) => obj.id === r.caseMainType)?.caseMainType,
            subType: r.subType,
            year: r.year,
            opponentAdvocate: r.opponentAdvocate,
            concernPerson: r.concernPerson,
            appearanceDate: moment(r.appearanceDate).format("DD-MM-YYYY"),
            department: r.department,
            priviouseCourtName: r.priviouseCourtName,
            courtCaseNumber: r.courtCaseNumber,
            caseEntry: r.caseEntry,
            filedAgainstMr: r.filedAgainstMr,
            opponentAdvocateMr: r.opponentAdvocateMr,
            concernPersonMr: r.concernPersonMr,
            fixAmount: r.fixAmount,
            paidAmountDate: moment(r.paidAmountDate).format("YYYY-MM-DD"),
            pendingAmount: r.pendingAmount,
            paidAmount: r.paidAmount,
            caseNumber: r.caseNumber,
            caseStatus: r.caseStatus,
            caseRefnceNo: r.caseRefnceNo,
            parawiseDepartmentAssignedCount: r.parawiseDepartmentAssignedCount,
            parawiseDepartmentCompletedCount: r.parawiseDepartmentCompletedCount,
            lawyerRemarkEn: r.lawyerRemarkEn,
            lawyerRemarkMr: r.lawyerRemarkMr,

            advocateName2: r.advocateName2,
            advocateNameMr2: r.advocateNameMr2,

            // If case status is PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS then append count to case status
            caseStatus:
              r.caseStatus === "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS"
                ? `${r.caseStatus} (${r.parawiseDepartmentCompletedCount} / ${r.parawiseDepartmentAssignedCount})`
                : r.caseStatus,

            //CONCRND_DPT_HOD_APPROVED
            caseStatus:
              r.caseStatus === "CONCRND_DPT_HOD_APPROVED"
                ? `${r.caseStatus} (${r.parawiseDepartmentCompletedCount} / ${r.parawiseDepartmentAssignedCount})`
                : r.caseStatus,

            NewCourtCaseEntryAttachmentList: JSON.stringify(
              r.NewCourtCaseEntryAttachmentList.map((r, i) => {
                return { ...r, srNo: i + 1 };
              }),
            ),

            billDetails: r?.billDtls,

            // billDetails: JSON.stringify(
            //   r?.billDtls?.map((r, i) => {
            //     return { ...r, srNO: i + 1 };
            //   }),
            // ),
            courtNameMr: courtNames?.find((obj) => obj.id === r.court)?.courtNameMr,
            courtNameEn: courtNames?.find((obj) => obj.id === r.court)?.courtNameEn,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        console.log("res1212", _res);
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
  // useEffect(() => {
  //   setData((prevData) => prevData.sort((a, b) => b.id - a.id));
  // }, [data]);

  // Delete By ID
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
          axios.post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getSubType()
              getAllCaseEntry();
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
          axios.post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getSubType()
              getAllCaseEntry();
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // add Hearing
  const addHearing = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/addHearing/view",
      query: {
        pageMode: "addHearing",
        ...record,
        caseNumber: record.id,
        caseEntry: record.id,
      },
    });
  };

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  // columns
  const columns = [
    // old
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    //courtCaseNumber
    {
      field: "caseNumber",
      headerName: <FormattedLabel id="courtCaseNumber" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      field: language === "en" ? "courtNameEn" : "courtNameMr",
      headerName: <FormattedLabel id="courtName" />,
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "fillingDateT",
      headerName: <FormattedLabel id="fillingDate" />,
      // flex: 1,
      width: 190,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "stampNo",
    //   headerName: <FormattedLabel id="stampNo" />,
    //   width: 170,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: language === "en" ? "advocateName1" : "advocateNameMr",
      headerName: <FormattedLabel id="advocateName" />,
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      //
      field: language === "en" ? "caseStatus" : "caseStatus",
      headerName: <FormattedLabel id="caseStatus" />,
      width: 460,
      // flex: 1,
      headerAlign: "center",
      align: "center",

      // add colours depending on the status of the case and default colour as black
      renderCell: (params) => {
        let data = params.row;
        console.log("data", data);
        return (
          <Box>
            {data.caseStatus === "CASE CREATED" ? (
              <Typography style={{ color: "blue" }}>{data.caseStatus}</Typography>
            ) : data.caseStatus === "WRITTEN_STATEMENT_APPROVED_BY_HOD" ? (
              <Typography style={{ color: "green" }}>{data.caseStatus}</Typography>
            ) : data.caseStatus === "DIGITILY_SIGNED_BY_CONCERNED_HOD" ? (
              <Typography style={{ color: "purple" }}>{data.caseStatus}</Typography>
            ) : data.caseStatus === "WS_PROCESS_COMPLETED" ? (
              <Typography style={{ color: "darkgreen" }}>{data.caseStatus}</Typography>
            ) : data.caseStatus === "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS" ? (
              <Typography style={{ color: "orange" }}>{data.caseStatus}</Typography>
            ) : data.caseStatus === "PARAWISE_REPORT_DEPARTMENT_ASSIGNED_AND_SENT_TO_HOD" ? (
              <Typography style={{ color: "brown" }}>{data.caseStatus}</Typography>
            ) : (
              <Typography style={{ color: "black" }}>{data.caseStatus}</Typography>
            )}
          </Box>
        );
      },

      // renderCell: (params) => (
      //   <Tooltip title={params.row.caseStatus} placement="top">
      //     <span>{params.row.caseStatus}</span>
      //   </Tooltip>
      // ),
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      // align: "center",
      width: "900",
      // width:
      //   authority == "WRITTEN_STATEMENT" &&  authority == "CLERK"
      //     ? 200
      //     : authority?.includes("ENTRY") && authority?.includes("ADD_HEARING")
      //     ? 500
      //     : 700,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let data = params.row;
        // console.log("data", data);
        return (
          <Box>
            {/**View Button */}
            {((authority?.includes("ENTRY") && authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && (
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  const tempBillDetail = params?.row?.billDetails;

                  console.log("tempBillDetail", params?.row?.billDetails);

                  const billDetail = tempBillDetail.map((data, index) => {
                    return {
                      ...data,
                      srNo: index + 1,

                      caseNumberName: caseNumbers1.find((data1) => {
                        return data?.caseNumber == data1?.id;
                      })?.caseNumber,

                      caseMainTypeEng: caseMainTypes.find((data1) => {
                        return data?.caseMainType == data1?.id;
                      })?.caseMainType,

                      caseMainTypeMar: caseMainTypes.find((data1) => {
                        return data?.caseMainType == data1?.id;
                      })?.caseMainTypeMr,

                      caseSubTypeEng: caseSubTypes.find((data1) => {
                        return data?.caseSubType == data1?.id;
                      })?.subType,

                      caseSubTypeMar: caseSubTypes.find((data1) => {
                        return data?.caseSubType == data1?.id;
                      })?.caseSubTypeMr,
                    };
                  });
                  localStorage.setItem("billDetail", JSON.stringify(billDetail));

                  // localStorage.setItem("billDetail", params?.row?.billDetails);
                  localStorage.setItem("pageMode", "View");
                  localStorage.setItem("buttonInputStateNew", false);
                  localStorage.setItem("deleteButtonInputState", false);
                  localStorage.setItem("btnInputStateDemandBill", false);
                  localStorage.setItem("addButtonInputState", false);
                  localStorage.setItem("buttonInputState", true);
                  localStorage.setItem("disabledButtonInputState", true);
                  localStorage.setItem("newCourtCaseEntry", JSON.stringify(params?.row));
                  localStorage.setItem(
                    "NewCourtCaseEntryAttachmentList",
                    params?.row?.NewCourtCaseEntryAttachmentList,
                  );

                  router.push({
                    pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                  });
                }}
              >
                <EyeFilled style={{ color: "#556CD6" }} />
              </IconButton>
            )}
            {/*** Edit Button */}
            {((authority?.includes("ENTRY") && authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && (
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  console.log("params32323", params?.row);
                  const tempBillDetail = params?.row?.billDetails;
                  console.log("tempBillDetail", params?.row?.billDetails);
                  const billDetail = tempBillDetail.map((data, index) => {
                    return {
                      ...data,
                      srNo: index + 1,
                      caseNumberName: caseNumbers1.find((data1) => {
                        return data?.caseNumber == data1?.id;
                      })?.caseNumber,
                      caseMainTypeEng: caseMainTypes.find((data1) => {
                        return data?.caseMainType == data1?.id;
                      })?.caseMainType,
                      caseMainTypeMar: caseMainTypes.find((data1) => {
                        return data?.caseMainType == data1?.id;
                      })?.caseMainTypeMr,
                      caseSubTypeEng: caseSubTypes.find((data1) => {
                        return data?.caseSubType == data1?.id;
                      })?.subType,
                      caseSubTypeMar: caseSubTypes.find((data1) => {
                        return data?.caseSubType == data1?.id;
                      })?.caseSubTypeMr,
                    };
                  });
                  localStorage.setItem("billDetail", JSON.stringify(billDetail));
                  localStorage.setItem("deleteButtonInputState", true);
                  localStorage.setItem("btnInputStateDemandBill", true);
                  localStorage.setItem("buttonInputState", false);
                  localStorage.setItem("buttonInputStateNew", true);
                  // localStorage.setItem("pageMode", "EDIT");
                  localStorage.setItem("disabledButtonInputState", false);
                  localStorage.setItem("newCourtCaseEntry", JSON.stringify(params?.row));
                  localStorage.setItem(
                    "NewCourtCaseEntryAttachmentList",
                    params?.row?.NewCourtCaseEntryAttachmentList,
                  );
                  router.push({
                    pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                  });
                }}
              >
                <EditIcon style={{ color: "#556CD6" }} />
              </IconButton>
            )}
            {/** delete */}
            {((authority?.includes("ENTRY") && authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && (
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    console.log("params.row4343434: ", params.row);
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
            )}
            {/** case details button */}
            {((authority?.includes("ENTRY") && authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    console.log("2323423",params?.row)
                    localStorage.setItem("pageMode", "View");
                    localStorage.setItem("buttonInputStateNew", false);
                    localStorage.setItem("deleteButtonInputState", false);
                    localStorage.setItem("btnInputStateDemandBill", false);
                    localStorage.setItem("buttonInputState", true);
                    localStorage.setItem("disabledButtonInputState", true);
                    localStorage.setItem("newCourtCaseEntry", JSON.stringify(params?.row));
                    localStorage.setItem(
                      "NewCourtCaseEntryAttachmentList",
                      params?.row?.NewCourtCaseEntryAttachmentList,
                    );

                    router.push({
                      pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                      query: {
                        caseId:params?.row?.id,
                      },

                  

                
                    });
                  }}
                >
                  {<FormattedLabel id="caseDetails" />}
                </Button>
              </IconButton>
            )}
            {/** add hearing button */}
            {((authority?.includes("ENTRY") && authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && (
              <IconButton>
                <Button variant="contained" size="small" onClick={() => addHearing(params.row)}>
                  {<FormattedLabel id="addHearing" />}
                </Button>
              </IconButton>
            )}



            {/* **Vakalatnama Button ** */}
            {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING") &&
              data.caseStatus == "CASE CREATED") ||
              (authority?.includes("ADMIN") && data.caseStatus == "CASE CREATED")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/vakalatnama",
                    
                      query: {

                        // pageMode: "Final",

                        id:record?.id,
                        // getById:record.row.id
                      },
                    });
                  }}
                >
                  {/* <FormattedLabel id="clerkRemark" /> */}
                Vakalatnama
                </Button>
              </IconButton>
            )}



            {/* ***Vakalatnama Approval */}




              {/* Exp */}
              {((authority?.includes("HOD") &&
              // authority?.includes("ADD_HEARING") &&
              data.caseStatus == "CASE CREATED") ||
              (authority?.includes("HOD") && data.caseStatus == "VAKALATNAMA_CREATED")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/vakalatnamaApproved",
                    
                      query: {

                        // pageMode: "Final",

                        id:record?.id,
                        // getById:record.row.id
                      },
                    });
                  }}
                >
                 
                Print to Vakalatnama
                </Button>
              </IconButton>
            )}





            {/** parawise report button */}

            {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING") &&
              data.caseStatus == "CASE CREATED") ||
              (authority?.includes("ADMIN") && data.caseStatus == "CASE CREATED")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                      // below path for testing the hod UI
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcHod",
                      // below path for testing the conc dpt UI
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  {/* <FormattedLabel id="clerkRemark" /> */}
                  Parawise Request
                </Button>
              </IconButton>
            )}

            {/* Reassign button */}
            {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING") &&
              data.caseStatus == "PARAWISE_RPT_REASSIGNED_TO_LEGAL_CLERK") ||
              (authority?.includes("ADMIN") &&
                data.caseStatus == "PARAWISE_RPT_REASSIGNED_TO_LEGAL_CLERK")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                      // below path for testing the hod UI
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcHod",
                      // below path for testing the conc dpt UI
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  {/* <FormattedLabel id="clerkRemark" /> */}
                  Recreate Parawise Request
                </Button>
              </IconButton>
            )}

            {authority?.includes("ENTRY") &&
              user?.roles?.includes("HOD") &&
              data.caseStatus == "PARAWISE_REPORT_DEPARTMENT_ASSIGNED_AND_SENT_TO_HOD" && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                          // below path for testing the hod UI
                          "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcHod",
                        // below path for testing the conc dpt UI
                        // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                        // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest",
                        query: {
                          ...record,
                        },
                      });
                    }}
                  >
                    <FormattedLabel id="hodRemarks" />
                  </Button>
                </IconButton>
              )}

            {/* for concern Dept Clerk */}
            {authority?.includes("CONCERN DEPARTMENT CLERK") &&
              data.caseStatus == "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS" && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                          // below path for testing the hod UI
                          "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                        // below path for testing the conc dpt UI
                        // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                        // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest",
                        query: {
                          ...record,
                        },
                      });
                    }}
                  >
                    Parawise Remark
                  </Button>
                </IconButton>
              )}

            {/* for Concern Department HOD digital signature */}

            {authority?.includes("CONCERN DEPARTMENT HOD") &&
              data.caseStatus == "WRITTEN_STATEMENT_APPROVED_BY_HOD" && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname: "/LegalCase/transaction/newCourtCaseEntry/digitalSignature",

                        query: {
                          ...record,
                        },
                      });
                    }}
                  >
                    Digital signature
                  </Button>
                </IconButton>
              )}

            {/** Written Statement button only for advocate logIn */}
            {console.log("dkfdsfkjsdkf", data.caseStatus.split(" ")[0])}
            {((authority?.includes("WRITTEN_STATEMENT") &&
              data.caseStatus.split(" ")[0] == "CONCRND_DPT_HOD_APPROVED") ||
              authority?.includes("ADMIN")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/advocateWrittenStatement",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  {<FormattedLabel id="writtenStatememt" />}
                </Button>
              </IconButton>
            )}

            {/* ws for lc HOD */}

            {((authority?.includes("HOD") &&
              authority?.includes("ENTRY") &&
              data.caseStatus == "WRITTEN_STATEMENT_CREATED") ||
              (authority?.includes("ADMIN") && data.caseStatus == "WRITTEN_STATEMENT_CREATED")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname: "/LegalCase/transaction/newCourtCaseEntry/writtenStatementApprovedByHOD",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  {/* {<FormattedLabel id="printWrittenStatement" />}
                   */}
                  Written Approval
                </Button>
              </IconButton>
            )}

            {/* Print button for Advocate */}
            {authority?.includes("WRITTEN_STATEMENT") &&
              data.caseStatus == "DIGITILY_SIGNED_BY_CONCERNED_HOD" && (
                <>
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setPrintData(params.row);
                        handlePrint();
                        setIsReady("none");
                        console.log("params.row", params.row);
                      }}
                    >
                      {<FormattedLabel id="printWrittenStatement" />}
                    </Button>
                  </IconButton>

                  {/* Mark as completed  / approveWrittenStatementByHod*/}
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        // setPrintData(params.row);
                        // handlePrint();
                        // setIsReady("none");
                        approveWrittenStatementByHod(params.row);

                        console.log("params.row", params.row);
                      }}
                    >
                      {/* {<FormattedLabel id="printWrittenStatement" />} */}
                      Mark as WS Completed
                    </Button>
                  </IconButton>
                </>
              )}

            {authority?.includes("WRITTEN_STATEMENT") &&
              data.caseStatus == "WRITTEN_STATEMENT_APPROVED_BY_HOD" && (
                <>
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setPrintData(params.row);
                        handlePrint();
                        setIsReady("none");
                        console.log("params.row", params.row);
                      }}
                    >
                      {<FormattedLabel id="printWrittenStatement" />}
                    </Button>
                  </IconButton>

                  {/* Mark as completed  / approveWrittenStatementByHod*/}
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        // setPrintData(params.row);
                        // handlePrint();
                        // setIsReady("none");
                        approveWrittenStatementByHod(params.row);

                        console.log("params.row", params.row);
                      }}
                    >
                      {/* {<FormattedLabel id="printWrittenStatement" />} */}
                      Mark as WS Completed
                    </Button>
                  </IconButton>
                </>
              )}
          </Box>
        );
      },
    },
  ];

  // -------------------- useEffect ---------

  useEffect(() => {
    getCourtName();
    getAdvocateName();
    getCaseTypes();
    getCaseSubType();
    getYears();
    getCaseNumberAll();
    getDepartmentName();
  }, []);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAllCaseEntry();
  }, [courtNames, advocateNames]);

  useEffect(() => {
    console.log("authority123");
  }, [authority]);

  // View
  return (
    <>
      <Paper
        component={Box}
        elevation={5}
        sx={{
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: "10vh",
        }}
      >
        {/* new Header */}
        <Grid
          container
          style={{
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <IconButton>
            <ArrowBackIcon
              onClick={() => {
                router.back();
              }}
            />
          </IconButton>

          <Grid item xs={11}>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              {" "}
              <FormattedLabel id="caseEntry" />
            </h2>
          </Grid>
        </Grid>
        <Paper style={{ display: isReady }}>
          <PRINTWRITTENSTATEMENT ref={componentRef} data={printData} />
        </Paper>

        {/* old Header */}
        {/* <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginBottom: 40,
            padding: 8,
            paddingLeft: 30,
            borderRadius: 100,
          }}
        >
          <strong style={{ display: "flex", justifyContent: "center" }}>
            <FormattedLabel id='caseEntry' />
          </strong>
        </div> */}

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            {/* {authority == "CLERK" ? (
              <>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  localStorage.removeItem("NewCourtCaseEntryAttachmentList");
                  localStorage.setItem("pageMode", "Add");
                  localStorage.setItem("buttonInputStateNew", true);
                  router.push({
                    pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                  });
                }}
              >
                <FormattedLabel id="add" />
              </Button>
            )} */}

            {authority?.includes("CLERK") && authority?.includes("ENTRY") && (
              <Button
                variant="contained"
                onClick={() => {
                  localStorage.removeItem("NewCourtCaseEntryAttachmentList");
                  localStorage.setItem("pageMode", "Add");
                  localStorage.setItem("buttonInputStateNew", true);
                  router.push({
                    pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                  });
                }}
              >
                <FormattedLabel id="add" />
              </Button>
            )}
          </div>

          {/* New Table */}
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
                printOptions: { disableToolbarButton: true },
                // disableExport: true,
                // disableToolbarButton: true,
                // csvOptions: { disableToolbarButton: true },
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
              getAllCaseEntry(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllCaseEntry(_data, data.page);
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default Index;
