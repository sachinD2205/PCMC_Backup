import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Divider, IconButton, Paper } from "@mui/material";
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
import { EyeFilled } from "@ant-design/icons";
// import schema from "../newCourtCaseEntry/schema";
// import schema from "../../../../containers/schema/LegalCaseSchema/transferAdvocateSchema";
import { CasesSharp } from "@mui/icons-material";
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
    resolver: yupResolver(),
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

  const [caseNumbers, setCaseNumbers] = useState([]);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getCourtName();
    getAdvocateName();
    getCaseTypes();
    getCaseSubType();
    getYears();
    getDepartmentName();
    getCourtCaseNumber();
  }, []);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getTransferAdvocate();
  }, [caseNumbers, caseTypes, courtNames]);

  const getCourtCaseNumber = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`)
      .then((res) => {
        console.log("res court case no", res);
        setCaseNumbers(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            // courtCaseNumber: r.courtCaseNumber,
            caseNumber:r.caseNumber

          })),
        );
      });
  };

  const getTransferAdvocate = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/trnsaction/transferAdvocate/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("r", r);
        let result = r.data.transferAdvocate;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log(
            "44",
            r,
            caseNumbers?.find((obj) => {
              console.log("111", obj);
              return obj.id === r.caseNumber;
            })?.caseNumber,
          );
          return {
            activeFlag: r.activeFlag,
            courtNameText: courtNames?.find((obj) => obj.id === r.court)
              ?.courtName,
            courtNameMrText: courtNames?.find((obj) => obj.id === r.court)
              ?.courtMr,
            court: r.court,


            caseTypeText: caseTypes ?.find((obj) => obj.id ===r.caseMainType)?.caseMainType,
            caseMainType:r.caseMainType,

            id: r.id,
            srNo: i + 1,
            filingDate: moment(r.filingDate).format("DD-MM-YYYY"),
            filedBy: r.filedBy,
            filedByMr: r.filedByMr,
            caseNumber: r.caseNumber,
            courtCaseNumberText: caseNumbers?.find(
              (row) => row.id === r.caseNumber,
            )?.caseNumber,
            caseType: r.caseType,
            caseTypeText: caseTypes?.find((obj) => {
              console.log("111", obj);
              return obj.id === r.caseType;
            })?.caseMainType,

            caseTypeTextMr: caseTypes ?.find((obj) => obj.id === r.caseType)?.caseMainTypeMr,


            transferFromAdvocate: r.transferFromAdvocate,

            transferToAdvocate: r.transferToAdvocate,

            fromDate: moment(r.fromDate).format("YYYY-MM-DD"),

            toDate: moment(r.toDate).format("YYYY-MM-DD"),

            newAppearnceDate: moment(r.newAppearnceDate).format("YYYY-MM-DD"),

            remark: r.remark,
            remarkMr: r.remarkMr,

            // transferFromAdvocate:
            //   r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
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

  // get Court Name
  const getCourtName = () => {
    axios.get(`${urls.LCMSURL}/master/court/getAll`).then((res) => {
      console.log("4443", res);
      setCourtNames(
        res.data.court.map((r, i) => ({
          id: r.id,
          courtName: r.courtName,
          courtMr: r.courtMr,
        })),
      );
    });
  };

  // New

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

  const [departmentNames, setDepartmentNames] = useState([]);

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

  // Delete By Id
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
            .post(`${urls.LCMSURL}/trnsaction/transferAdvocate/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getTransferAdvocate();
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
            .post(`${urls.LCMSURL}/trnsaction/transferAdvocate/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getTransferAdvocate();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // get Case Type
  const [caseTypes, setCaseTypes] = useState([]);

  const getCaseTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      console.log("res case type", res);
      setCaseTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          caseMainType: r.caseMainType,
          caseMainTypeMr: r.caseMainTypeMr,

        })),
      );
    });
  };

  const [caseSubTypes, setCaseSubTypes] = useState([]);

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

  const [years, setYears] = useState([]);

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

  // // Edit Record
  // const actionOnRecord = (record, pageMode) => {
  //   console.log("Record : ---> ", record);
  //   router.push({
  //     pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
  //     query: {
  //       pageMode: pageMode,
  //       ...record,
  //     },
  //   });
  // };

  // add Hearing

  // const addHearing = (record) => {
  //   console.log("All Records", record);
  //   router.push({
  //     pathname: "/LegalCase/transaction/addHearing/view",
  //     query: {
  //       pageMode: "addHearing",
  //       ...record,
  //       caseEntry: record.id,
  //     },
  //   });
  // };
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id='srNo' />,
      align: "center",
      headerAlign: "center",
      width: 100,
    },
    {
      // field: "courtName",
      // field:"courtName",
      headerName: "Court Case Number",
      field: "courtCaseNumberText",
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      // headerName: "Case Type",
      headerName:<FormattedLabel id="caseType"/>,
  
      field: language === "en" ? "caseTypeText" :"caseTypeTextMr"  ,

      width: 210,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "courtNameText" : "courtNameMrText",
      // field: "courtName",
      headerName: <FormattedLabel id='courtName' />,
      width: 290,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    ,
    {
      headerName: "Filing Date",
      field: "filingDate",
      width: 140,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "actions",
      // headerName: "Actions",
      headerName:<FormattedLabel id="actions"/>,
      width: 200,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname: "/LegalCase/transaction/transferAdvocate/view",
                  query: {
                    pageMode: "Edit",
                    ...record,
                  },
                });
                console.log("row", params.row);
                ("");
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
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

            {/* for View Icon */}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname: "/LegalCase/transaction/transferAdvocate/view",
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
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Box>
        <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
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
            paddingTop: "20px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id='transferAdvocate' />
          </h2>
        </Box>
        <Divider />

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginRight:"10px",
              marginTop: 10,
              marginBottom:"10px"
            }}
          >
            <Button
              // type="primary"
              variant='contained'
              onClick={() =>
                router.push(`/LegalCase/transaction/transferAdvocate/view`)
              }
            >
              <FormattedLabel id='add' />
            </Button>
          </div>

          {/* </Paper> */}

          {/* New Table */}
          <Box
            sx={{
              marginTop: "10px",
              border: 1,

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
                getTransferAdvocate(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getTransferAdvocate(_data, data.page);
              }}
            />
          </Box>
        </div>
        </Paper>
      </Box>
    </>
  );
};

export default Index;
