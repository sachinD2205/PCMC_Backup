import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { Button, IconButton, Paper, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import * as yup from 'yup'
import { EyeFilled } from "@ant-design/icons";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/Slb/newCourtCaseSchema";
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
  const [departmentNames, setDepartmentNames] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [parameterNames, setParameterName] = useState([]);
  const [subParameterName, setSubParameterName] = useState([]);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Case entry
  const getFormEntry = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.SLB}/trnEntry/getAll`, {
        // params: {
        //   pageSize: _pageSize,
        //   pageNo: _pageNo,
        // },
      })
      .then((r) => {
        console.log("r", r);
        let result = r.data.trnEntryList;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            parameterName: r.parameterName,
            subParameterName: r.subParameterName,
            createDtTm: moment(r.createDtTm).format("YYYY-MM-DD"),
            valueString: r.valueString,
            moduleName: r.moduleName,
            entryUniqueIdentifier: r.entryUniqueIdentifier,
            zoneKey: r.zoneKey,
            wardKey: r.wardKey,
            zoneName: r.zoneName,
            wardName: r.wardName,
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

  // get Paramter

  const getParameterName = () => {
    axios.get(`${urls.SLB}/parameter/getAll`).then((res) => {
      console.log("ghfgf", res);
      setParameterName(
        res?.data?.parameterList?.map((r, i) => ({
          id: r.id,
          name: r.name,
          parameterName: r.parameterName,
        })),
      );
    });
  };

  // get sub-Parameter Name
  const getSubParameterName = (id) => {
    axios.get(`${urls.SLB}/subParameter/getAll`).then((res) => {
      console.log("ghfgf11", res);
      setSubParameterName(
        res?.data?.subParameterList?.map((r, i) => ({
          id: r.id,
          description: r.description,
          parameterKey: r.parameterKey,
          subParameterName: r.subParameterName,
        })),
      );
    });
  };
  // columns
  const columns = [
    // old
    {
      field: "srNo",
      headerName: "Sr. No",
      align: "center",
      headerAlign: "center",

      columnWidth: 20,
    },
    {
      field: "entryUniqueIdentifier",

      headerName: "UDID",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "zoneName",

      headerName: "Zone Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "wardName",

      headerName: "Ward Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "moduleName",

      headerName: "Module",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "parameterName",

      headerName: "Benchmark",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "subParameterName",
      headerName: "Sub-Parameters",
      // headerName: <FormattedLabel id='filingDate' />,
      flex: 1,

      headerAlign: "center",
      align: "center",
    },
    {
      field: "valueString",
      // headerName: <FormattedLabel id='stampNo' />,
      headerName: "Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "createDtTm",
      // headerName: <FormattedLabel id='stampNo' />,
      headerName: "Date & Time",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  useEffect(() => {
    getFormEntry();
  }, [parameterNames, subParameterName]);

  useEffect(() => {
    getParameterName();
    getSubParameterName();
  }, []);

  // View
  return (
    <>
      <Paper
        component={Box}
        elevation={5}
        // variant='outlined'
        sx={{
          // border: 1,
          // borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: "10vh",
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
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>SLB Entry Details</h2>
        </Box>

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
              endIcon={<AddIcon />}
              variant="contained"
              onClick={() => router.push(`/Slb/transaction/entry/entryForm`)}
            >
              {/* <FormattedLabel id='add' /> */}
              Add
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
              // marginLeft: 5,
              // marginRight: 5,
              // marginTop: 5,
              // marginBottom: 5,
              // width: "1500px",

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
              getFormEntry(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getFormEntry(_data, data.page);
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default Index;
