import { Box, Button, IconButton, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";

// DemandedBillToAdvocateTable
const DemandedBillToAdvocateTable = () => {
  const router = useRouter();
  const [authority, setAuthority] = useState();
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user1 = useSelector((state) => state?.user?.user);
  const user = useSelector((state) => state?.user?.user?.userDao);
  // const 'user' = useSelector((state) => state.user.user.userDao);
  const token = useSelector((state) => state?.user?.user?.token);
  const [dataSource, setDataSource] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [pageMode, setPageMode] = useState("Add");
  const language = useSelector((state) => state.labels.language);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseSubTypes, setcaseSubTypes] = useState([]);
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [caseNumbers1, setCaseNumbers1] = useState([]);
  const [temp, setTemp] = useState();
  const [statuses, setStatuses] = useState();

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  /* Case Number  - Court Case Number*/
  const getcaseNumber = () => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCourtCaseEntryByAdvocateId?advocateId=${user?.advocateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setTemp(res.data.newCourtCaseEntry);
        setCaseNumbers(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            caseNumber: r.caseNumber,
          })),
        );
      });
  };

  /* Case Type  - Case Main Type*/
  const getCaseMainTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      setCaseMainTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          caseMainType: r.caseMainType,
          caseMainTypeMr: r.caseMainTypeMr,
        })),
      );
    });
  };

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

  /* Case Sub Type */
  const getCaseSubTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseSubType/getAll`).then((res) => {
      setcaseSubTypes(
        res.data.caseSubType.map((r, i) => ({
          id: r.id,
          // caseMainType: r.caseMainType,
          subType: r.subType,
          caseSubTypeMr: r.caseSubTypeMr,
        })),
      );
    });
  };

  // get Table Data
  const getDemandedBill = (_pageSize = 10, _pageNo = 0) => {
    if (authority == "BILL_SUBMISSION") {
      // Dept Clerk
      setStatuses("BILL_RAISED");
    } else if (authority == "BILL_APPROVAL") {
      // HOD
      setStatuses("BILL_SUBMITTED");
    } else if (authority == "ACCOUNTANT") {
      // Accountant
      setStatuses("BILL_APPROVED");
    }

    const body = {
      "statuses": [statuses],
    };
    if (statuses != null || statuses) {
      axios
        .post(
          `${urls.LCMSURL}/transaction/demandedBillAndPaymentToAdvocate/getDetailsByStatus`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((r) => {
          let result = r.data.demandedBillAndPaymentToAdvocate;

          let _res = result.map((data, index) => {
            return {
              ...data,
              srNo: index + 1,
              advocateName:
                data?.advocate?.firstName +
                "  " +
                data?.advocate?.middleName +
                "  " +
                data?.advocate?.lastName,
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
    }
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id='srNo' />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      field: "status",
      headerName: "Application Status",
      align: "center",
      headerAlign: "center",
      width: 150,
    },
    {
      headerName: "Advocate Name",
      width: 250,
      field: "advocateName",
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id='actions' />,
      width: 500,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <Box>
              {/** Depet cleark */}
              {params?.row?.status === "BILL_RAISED" &&
                authority?.find(
                  (r) => r === "BILL_SUBMISSION" || r === "ADMIN",
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant='contained'
                        size='small'
                        onClick={() => {
                          console.log("params?.row11212", params?.row);
                          const attachments = params?.row?.attachments;
                          console.log(
                            "const attachments = params?.row?.attachments",
                            attachments.map((data, index) => {
                              return { ...data, srNo: index + 1 };
                            }),
                          );
                          localStorage.setItem(
                            "attachments",
                            JSON.stringify(
                              attachments.map((data, index) => {
                                return { ...data, srNo: index + 1 };
                              }),
                            ),
                          );
                          const advocateId = params?.row?.advocateId;
                          const tempBillDetail = params?.row?.billDetail;
                          console.log(
                            "tempBillDetail",
                            params?.row?.billDetail,
                          );

                          const billDetail = tempBillDetail.map(
                            (data, index) => {
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
                            },
                          );
                          const tableRowData = {
                            ...params?.row,
                            pageMode: "View",
                            advocateId: advocateId,
                            role: "BILL_SUBMISSION",
                            designation: "dept_Clerk",
                          };
                          localStorage.setItem("role", "BILL_SUBMISSION");
                          localStorage.setItem("deleteButtonInputState", false);
                          localStorage.setItem("billDetailComponent", false);
                          localStorage.setItem("paidAmountTableState", true);
                          localStorage.setItem(
                            "approvalAmountDisabledState",
                            "false",
                          );
                          localStorage.setItem(
                            "btnInputStateDemandBill",
                            "false",
                          );
                          localStorage.setItem(
                            "tableRowData",
                            JSON.stringify(tableRowData),
                          );

                          localStorage.setItem(
                            "billDetail",
                            JSON.stringify(billDetail),
                          );
                          localStorage.setItem(
                            "approvalAmountTableState",
                            false,
                          );
                          localStorage.setItem("paidAmountInputState", false);
                          localStorage.setItem(
                            "demandedBillTableActionButtonInputState",
                            false,
                          );
                          router.push({
                            pathname:
                              "/LegalCase/transaction/demandedBillToAdvocate/Scrutiny",
                          });
                        }}
                      >
                        Action
                      </Button>
                    </IconButton>
                  </>
                )}
              {/** HOD */}
              {params?.row?.status === "BILL_SUBMITTED" &&
                authority?.find(
                  (r) => r === "BILL_APPROVAL" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant='contained'
                      size='small'
                      onClick={() => {
                        const advocateId = params?.row?.advocateId;
                        const tempBillDetail = params?.row?.billDetail;
                        const attachments = params?.row?.attachments;
                        localStorage.setItem(
                          "attachments",
                          JSON.stringify(
                            attachments.map((data, index) => {
                              return { ...data, srNo: index + 1 };
                            }),
                          ),
                        );
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
                        const tableRowData = {
                          ...params?.row,
                          pageMode: "View",
                          advocateId: advocateId,
                          designation: "dept_Clerk",
                          role: "BILL_APPROVAL",
                        };
                        localStorage.setItem("role", "BILL_APPROVAL");
                        localStorage.setItem("deleteButtonInputState", false);
                        localStorage.setItem("paidAmountInputState", false);
                        localStorage.setItem("paidAmountTableState", true);
                        localStorage.setItem("billDetailComponent", false);
                        localStorage.setItem(
                          "approvalAmountDisabledState",
                          "false",
                        );
                        localStorage.setItem(
                          "btnInputStateDemandBill",
                          "false",
                        );
                        localStorage.setItem(
                          "tableRowData",
                          JSON.stringify(tableRowData),
                        );

                        localStorage.setItem(
                          "billDetail",
                          JSON.stringify(billDetail),
                        );
                        router.push({
                          pathname:
                            "/LegalCase/transaction/demandedBillToAdvocate/Scrutiny",
                        });
                      }}
                    >
                      Action
                    </Button>
                  </IconButton>
                )}
              {/** Accountant */}
              {params?.row?.status === "BILL_APPROVED" &&
                authority?.find((r) => r === "ACCOUNTANT" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant='contained'
                      size='small'
                      onClick={() => {
                        const tempBillDetail = params?.row?.billDetail;
                        const attachments = params?.row?.attachments;
                        const advocateId = params?.row?.advocateId;
                        localStorage.setItem(
                          "attachments",
                          JSON.stringify(
                            attachments.map((data, index) => {
                              return { ...data, srNo: index + 1 };
                            }),
                          ),
                        );
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
                        const tableRowData = {
                          ...params?.row,
                          pageMode: "View",
                          advocateId: advocateId,
                          designation: "dept_Clerk",
                          role: "BILL_PAID",
                        };
                        localStorage.setItem("role", "BILL_PAID");
                        localStorage.setItem("paidAmountTableState", false);
                        localStorage.setItem("billDetailComponent", false);
                        localStorage.setItem("deleteButtonInputState", false);
                        localStorage.setItem(
                          "approvalAmountDisabledState",
                          "true",
                        );
                        localStorage.setItem(
                          "btnInputStateDemandBill",
                          "false",
                        );
                        localStorage.setItem(
                          "tableRowData",
                          JSON.stringify(tableRowData),
                        );

                        localStorage.setItem(
                          "billDetail",
                          JSON.stringify(billDetail),
                        );
                        router.push({
                          pathname:
                            "/LegalCase/transaction/demandedBillToAdvocate/Scrutiny",
                        });
                      }}
                    >
                      Action
                    </Button>
                  </IconButton>
                )}
            </Box>
          </>
        );
      },
    },
  ];

  // -------------------- useEffect -------------

  // useEffect
  useEffect(() => {
    let auth = user1?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    getcaseNumber();
    getCaseMainTypes();
    getCaseSubTypes();
    getCaseNumberAll();
  }, []);

  useEffect(() => {
    getDemandedBill();
  }, [caseMainTypes, caseSubTypes, caseNumbers, authority, caseNumbers1]);

  // View
  return (
    <>
      <Paper elevation={5} style={{ height: "900px" }}>
        <br />
        <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: "50px",
            // marginTop: ,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "50px",
            marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <strong style={{ display: "flex", justifyContent: "center" }}>
            Demand Bill Payment To Advocate Table
          </strong>
        </div>
        <div
          style={{
            margin: "50px",
            marginBottom: "50px",
            // border: "2px solid red",
          }}
        >
          {/** Table **/}
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
              margin: "20px",
              marginRight: "20px",
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
              getDemandedBill(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getDemandedBill(_data, data.page);
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default DemandedBillToAdvocateTable;
