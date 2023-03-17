import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  IconButton,
  Paper,
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
// import schema from "./schema";
import schema from "../../../../containers/schema/LegalCaseSchema/addHearingSchema";

import { EyeFilled } from "@ant-design/icons";
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
  
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);

  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [editButtonInputState, setEditButtonInputState] = useState(false);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getCaseTypes();

    getCaseStage();
   
  }, []);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAddHearing();
  }, [caseTypes,caseStages]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);


  const getCaseStage = () =>{
    axios.get(`${urls.LCMSURL}/master/caseStages/getAll`)
    .then((res) =>{
      setCaseStages(
        res.data.caseStages.map((r,i) =>({
          id:r.id,
          caseStages:r.caseStages,
          caseStagesMr:r.caseStagesMr

        }))
      )
    })
  } 

  const getAddHearing = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/trnsaction/addHearing/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("r", r);
        let result = r.data.addHearing;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,


            // caseMainType:caseTypes?.find((obj) =>obj.id ===caseMainType)?.caseMainType,

            caseMainType: caseTypes?.find((obj) => obj.id === r.caseMainType)
            ?.caseMainType,

            caseMainTypeMr: caseTypes?.find((obj) => obj.id === r.caseMainType)?.caseMainTypeMr,
            caseMainType:r.caseMainType,

            // filingDate:moment.(r.filingDate).format("YYYY-MM-DD"),

            filingDate: moment(r.filingDate).format("YYYY-MM-DD"),


            hearingDate : moment(r.hearingDate).format("YYYY-MM-DD"),

            caseStage:r.caseStage,

            // caseStages:caseStages?.find((obj) =>obj.id === r.caseStages)?.caseStages,

            caseStagesMr:caseStages?.find((obj) =>obj.id === r.caseStages)?.caseStagesMr,
            courtCaseNumber:r.courtCaseNumber,
            caseEntry:r.caseEntry,
            caseStatus:r.caseStatus,
            
            AddHearingMr:r.AddHearingMr,
            remark:r.remark,
            remarkMr:r.remarkMr,

            // caseStages:r.caseStages,

            caseNumber:r.caseNumber,
            
            // caseMainType:r.caseMainType,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
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

  //Delete by Id
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
            .post(
              `${urls.LCMSURL}/trnsaction/addHearing/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                // getAllCaseEntry();
                getAddHearing()
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
            .post(
              `${urls.LCMSURL}/trnsaction/addHearing/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                // getAllCaseEntry();
                getAddHearing()
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // get Case Type

  const getCaseTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAll`)
      .then((res) => {
        setCaseTypes(
          res.data.caseMainType.map((r, i) => ({
            id: r.id,
            caseMainType: r.caseMainType,
            caseMainTypeMr:r.caseMainTypeMr
          }))
        );
      });
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

  // add Hearing

  const addHearing = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/addHearing/view",
      query: {
        pageMode: "addHearing",
        ...record,
        caseEntry: record.id,
      },
    });
  };


  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",

      width:140


      // width: 120,
    },
    {
      field: "caseNumber",

      headerName: <FormattedLabel id="courtCaseNo" />,
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   // field: "caseMainType",

    //   field: language === "en" ? "caseMainType" : "caseMainTypeMr",

    //   headerName: <FormattedLabel id="caseType" />,
    //   width: 190,
    //   headerAlign: "center",
    //   align: "center",
    // },

    {
      field: "filingDate",
      headerName: <FormattedLabel id="filingDate" />,
      // flex: 1,
      width: 260,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hearingDate",
      headerName: <FormattedLabel id="hearingDate" />,
      width: 260,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    ,
    // {
    //   field: language === "en" ? "caseStages" : "caseStagesMr",
    //   headerName: <FormattedLabel id="caseStages" />,
    //   width: 240,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },

    {
      field: "actions",
      headerName: "Actions",
      width: 290,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {console.log(
              "22",
              language === "en" ? "caseMainType" : "caseMainTypeMr"
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname: "/LegalCase/transaction/addHearing/view",
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
                  pathname: "/LegalCase/transaction/addHearing/view",
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
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
          
            <FormattedLabel id="addHearing" />
          </h2>
        </Box>
        <Divider />

         <div>
       
       <div
         style={{
           display: "flex",
           justifyContent: "right",
           marginTop: 10,
         }}
       >
         <Button
           // type="primary"
           variant="contained"
           onClick={() =>
             router.push(`/LegalCase/transaction/addHearing/view`)
           }
         >
           <FormattedLabel id="add" />
         </Button>
       </div>

       {/* </Paper> */}

       {/* New Table */}
       <Box
         sx={{
           height: 400,
           marginTop:"10px"
           // width: 1000,
          //  marginLeft: 10,

           // width: '100%',

           // overflowX: 'auto',
         }}
       >
         <DataGrid
          //  disableColumnFilter
          //  disableColumnSelector
          // disableToolbarButton
          //  disableDensitySelector

           components={{ Toolbar: GridToolbar }}
           componentsProps={{
             toolbar: {
               showQuickFilter: true,
               quickFilterProps: { debounceMs: 500 },
              //  printOptions: { disableToolbarButton: true },
               // disableExport: true,
               // disableToolbarButton: true,
              //  csvOptions: { disableToolbarButton: true },
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
             getAddHearing(data.pageSize, _data);
           }}
           onPageSizeChange={(_data) => {
             console.log("222", _data);
             // updateData("page", 1);
             getAddHearing(_data, data.page);
           }}
         />
       </Box>
     </div>
        </Paper>
    </>
  );
};

export default Index;
