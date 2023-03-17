import { EyeFilled } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Button, IconButton, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/LegalCaseSchema/newCourtCaseSchema";
import urls from "../../../../URLS/urls";

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

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  /* Case Type  - Case Main Type*/
  const getCaseNumberAll = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`)
      .then((res) => {
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
          advocateNameMr:
            r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
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

  // Case entry
  const getAllCaseEntry = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
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
            srNo: i + 1,
            courtCaseNumber: r.courtCaseNumber,
            caseReference: r.caseReference,
            caseMainType: r.caseMainType,
            courtName: r.courtName,
            court: r.court,
            stampNo: r.stampNo,
            fillingDate: moment(r.fillingDate).format("YYYY-MM-DD"),
            advocateName: r.advocateName,
            advocateName1: advocateNames?.find(
              (obj) => obj.id === r.advocateName,
            )?.advocateName,
            advocateNameMr: advocateNames?.find(
              (obj) => obj.id === r.advocateName,
            )?.advocateNameMr,
            filedBy: r.filedBy,
            filedByMr: r.filedByMr,
            filedAgainst: r.filedAgainst,
            caseDetails: r.caseDetails,
            caseMainType: r.caseMainType,
            caseMainTypeName: caseTypes?.find(
              (obj) => obj.id === r.caseMainType,
            )?.caseMainType,
            subType: r.subType,
            year: r.year,
            opponentAdvocate: r.opponentAdvocate,
            concernPerson: r.concernPerson,
            appearanceDate: moment(r.appearanceDate).format("YYYY-MM-DD"),
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
            caseRefnceNo: r.caseRefnceNo,


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
            courtNameMr: courtNames?.find((obj) => obj.id === r.court)
              ?.courtNameMr,
            courtNameEn: courtNames?.find((obj) => obj.id === r.court)
              ?.courtNameEn,
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
          axios
            .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, body)
            .then((res) => {
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
          axios
            .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, body)
            .then((res) => {
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

  // columns
  const columns = [
    // old
    {
      field: "srNo",
      headerName: <FormattedLabel id='srNo' />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      field: language === "en" ? "courtNameEn" : "courtNameMr",
      headerName: <FormattedLabel id='courtName' />,
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "fillingDate",
      headerName: <FormattedLabel id='fillingDate' />,
      // flex: 1,
      width: 190,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stampNo",
      headerName: <FormattedLabel id='stampNo' />,
      width: 170,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "advocateName1" : "advocateNameMr",
      headerName: <FormattedLabel id='advocateName' />,
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id='actions' />,
      width: 500,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {/**View Button */}
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
                localStorage.setItem(
                  "newCourtCaseEntry",
                  JSON.stringify(params?.row),
                );
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
            {/*** Edit Button */}
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
                localStorage.setItem("deleteButtonInputState", true);
                localStorage.setItem("btnInputStateDemandBill", true);
                localStorage.setItem("buttonInputState", false);
                localStorage.setItem("buttonInputStateNew", true);
                localStorage.setItem("pageMode", "Add");
                localStorage.setItem("disabledButtonInputState", false);
                localStorage.setItem(
                  "newCourtCaseEntry",
                  JSON.stringify(params?.row),
                );
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
            {/** delete */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
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
            {/** case details button */}
            <IconButton>
              <Button
                variant='contained'
                size='small'
                onClick={() => {
                  localStorage.setItem("pageMode", "View");
                  localStorage.setItem("buttonInputStateNew", false);
                  localStorage.setItem("deleteButtonInputState", false);
                  localStorage.setItem("btnInputStateDemandBill", false);
                  localStorage.setItem("buttonInputState", true);
                  localStorage.setItem("disabledButtonInputState", true);
                  localStorage.setItem(
                    "newCourtCaseEntry",
                    JSON.stringify(params?.row),
                  );
                  localStorage.setItem(
                    "NewCourtCaseEntryAttachmentList",
                    params?.row?.NewCourtCaseEntryAttachmentList,
                  );

                  router.push({
                    pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                  });
                }}
              >
                {<FormattedLabel id='caseDetails' />}
              </Button>
            </IconButton>
            {/** add hearing button */}
            <IconButton>
              <Button
                variant='contained'
                size='small'
                onClick={() => addHearing(params.row)}
              >
                {<FormattedLabel id='addHearing' />}
              </Button>
            </IconButton>
            {/** send notice button */}
            <IconButton>
              <Button
                variant='contained'
                size='small'
                onClick={() => {
                  const record = params.row;
                  console.log("row1111", params.row);
                  return router.push({
                    pathname: "/LegalCase/transaction/newNotice/view",
                    query: {
                      ...record,
                    },
                  });
                }}
              >
                <FormattedLabel id='sendNotice' />
              </Button>
            </IconButton>
            
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
        <div
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
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            <Button
              variant='contained'
              onClick={() => {
                localStorage.removeItem("pageMode");
                localStorage.removeItem("NewCourtCaseEntryAttachmentList");
                localStorage.setItem("buttonInputStateNew", true);
                router.push({
                  pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                  query: {
                    pageMode: "Add",
                  },
                });
              }}
            >
              <FormattedLabel id='add' />
            </Button>
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
            density='compact'
            // autoHeight={true}
            // rowHeight={50}
            pagination
            paginationMode='server'
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
