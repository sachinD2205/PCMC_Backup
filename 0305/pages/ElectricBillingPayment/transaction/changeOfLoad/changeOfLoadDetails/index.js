import {
    Box,
    Button,
    Paper,
    Tooltip,
  } from "@mui/material";
  import React from "react";
  import { Controller, FormProvider, useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/billPaymentSchema";
  import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
  import { useState } from "react";
  import axios from "axios";
  import { useEffect } from "react";
  import { height } from "@mui/system";
  import ToggleOnIcon from "@mui/icons-material/ToggleOn";
  import ToggleOffIcon from "@mui/icons-material/ToggleOff";
  import moment from "moment";
  import sweetAlert from "sweetalert";
  import { useRouter } from "next/router";
  import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
  import { language } from "../../../../../features/labelSlice";
  import urls from "../../../../../URLS/urls";
  import { useDispatch, useSelector } from "react-redux";
  import theme from "../../../../../theme.js";
  import styles from "./view.module.css";
  import AddIcon from "@mui/icons-material/Add";
  import ClearIcon from "@mui/icons-material/Clear";
  import DeleteIcon from "@mui/icons-material/Delete";
  import EditIcon from "@mui/icons-material/Edit";
  import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
  import ExitToAppIcon from "@mui/icons-material/ExitToApp";
  import SaveIcon from "@mui/icons-material/Save";
  // import samplePdf from "../../../../../public/certificate.pdf"
  // import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
  import { setNewEntryConnection } from '../../../../../features/userSlice'
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  import IconButton from "@mui/material/IconButton";
  import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
  import UploadButton from "../../../../../components/fileUpload/UploadButton";
  import { useLocation } from "react-router-dom";
  
  
  const Index = () => {
    const {
      register,
      control,
      handleSubmit,
      methods,
      reset,
      watch,
      formState: { errors },
    } = useForm({
      criteriaMode: "all",
      resolver: yupResolver(schema),
      mode: "onChange",
    });
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
    const router = useRouter();
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [dataSource, setDataSource] = useState([]);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [department, setDepartment] = useState([]);
    const [consumptionType, setConsumptionType] = useState([]);
    const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState([]);
    const [subDivision, setSubDivision] = useState([]);
    const [buttonInputState, setButtonInputState] = useState();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const [fetchData, setFetchData] = useState(null);
    const [entryConnectionId,setEntryConnectionId] = useState()
  
    let tableData = [];
    let tableData1 = [];
    let tableData2 = [];
    let tableData3 = [];
    let tableData4 = [];
  
    const language = useSelector((state) => state.labels.language);
  
    //get logged in user
    const user = useSelector((state) => state.user.user);
  
    console.log("user", user);
  
    // selected menu from drawer
  
    let selectedMenuFromDrawer = Number(
      localStorage.getItem("selectedMenuFromDrawer")
    );
  
    // console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);
  
    // get authority of selected user
  
    const authority = user?.menus?.find((r) => {
      return r.id == selectedMenuFromDrawer;
    })?.roles;
  
    console.log("authority", authority);
  
    useEffect(() => {
      // getAllChangeOfLoadDetails();
      getDepartment();
      getConsumptionType();
      getBillingDivisionAndUnit();
    }, [window.location.reload])
  
  
  
    useEffect(() => {
      getDepartment();
      getConsumptionType();
      getBillingDivisionAndUnit();
    }, []);
  
    const [data, setData] = useState({
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: 10,
      page: 1,
    });
  
    //handle Add Button
    const handleAddButton = () => {
            // reset({
            //   ...resetValuesExit,
            // });
            // setEditButtonInputState(true);
            // setDeleteButtonState(true);
            // setBtnSaveText("Save");
            // setButtonInputState(true);
            router.push('/ElectricBillingPayment/transaction/changeOfLoad/addChangeOfLoad');
    }
  
    //handle view actions as per role
    const handleViewActions = (paramsRow) => {
        console.log("clicked id", paramsRow.status)
        router.push({
          pathname: '/ElectricBillingPayment/transaction/changeOfLoad/viewChangeOfLoad',
          query: {
            id: paramsRow.id,
          },
        }
        )
  
    }
  
    // get Department Name
    const getDepartment = () => {
      axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
        setDepartment(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
        console.log("res.data", r.data);
      });
    };
  
  
    // get Consumption Type
    const getConsumptionType = () => {
      axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
        setConsumptionType(res.data.mstConsumptionTypeList);
        console.log("getConsumptionType", res.data);
      });
    };
  
    // get Billing Division And Unit 
    const getBillingDivisionAndUnit = () => {
      axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
        let temp = res.data.mstBillingUnitList;
        setBillingDivisionAndUnit(temp.map((each) => {
          return {
            id: each.id,
            billingDivisionAndUnit: `${each.divisionName}/${each.billingUnit}`
          }
        }));
        console.log("getBillingDivisionAndUnit.data", temp);
      });
    };
  
  
  
  
    useEffect(() => {
      getAllChangeOfLoadDetails();
    }, [fetchData,department,billingDivisionAndUnit,consumptionType]);
  
    // Get Table - Data
    const getAllChangeOfLoadDetails = (_pageSize = 10, _pageNo = 0) => {
      console.log("_pageSize,_pageNo", _pageSize, _pageNo);
  
      axios
        .get(`${urls.EBPSURL}/trnChangeOfLoad/getAll`,
        {
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
      })
        .then((r) => {
          let result = r.data.trnChangeOfLoadList;

          let tableData=[], tableData1=[], tableData2=[], tableData3=[], tableData4=[];
  
          if (authority && authority?.find((val) => val === "ENTRY")) {
            tableData1 = result?.filter((data, index) => {
              return data;
            });
          }
  
          if (authority && authority?.find((val) => val === "DEPUTY_ENGINEER")) {
  
            tableData2 = result?.filter((data, index) => {
              return data;
            });
          }
  
          if (authority && authority?.find((val) => val === "EXECUTIVE_ENGINEER")) {
            tableData3 = result?.filter((data, index) => {
              return data;
            });
          }
  
          if (authority && authority?.find((val) => val === "PAYMENT VERIFICATION")) {
            tableData4 = result?.filter((data, index) => {
              return data;
            });
          }
  
          tableData = [
            ...tableData1,
            ...tableData2,
            ...tableData3,
            ...tableData4,
          ];

          console.log("getAllChangeOfLoadDetails", tableData);
            let _res = tableData.map((r, i) => {
              console.log("r", r)
              
              return {
                activeFlag: r.activeFlag,
                id: r.id,
                srNo: (i + 1) + (_pageNo * _pageSize),
                consumerNo: r?.consumerNo,
                consumerName: r?.consumerName,
                consumerNameMr: r?.consumerNameMr,
                status: r.status === null ? "Pending" :
                  r.status == 0 ? "Save As Draft" :
                  r.status == 1 ? "Rejected by Dy Eng" :
                    r.status == 2 ? "Waiting For MSECDL" :
                      r.status == 3 ? "Waiting for Dy Eng" :
                        r.status == 4 ? "Rejected by Exe Eng" :
                          r.status == 5 ? "Waiting For Exe Eng" :
                            r.status == 6 ? "Rejected By Acc" :
                              r.status == 7 ? "Waiting For Accountant" :
                              r.status == 25 ? "Waiting For Jr.Eng after bill" :
                                r.status == 8 ? "Completed" :
                                  r.status == 9 ? "Close" : "Invalid"
              }
            });
  
            console.log("_res",_res)
            setDataSource(_res);
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
            console.log("Save New COnnection ............ 6")
            axios
              .post(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/save`, body, {
                headers:{
                  Authorization: `Bearer ${user.token}`
                }
              })
              .then((res) => {
                console.log("delet res", res);
                if (res.status == 201) {
                  swal("Record is Successfully Deleted!", {
                    icon: "success",
                  });
                  getAllChangeOfLoadDetails();
                  // setButtonInputState(false);
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
            console.log("Save New COnnection ............ 7")
            axios
              .post(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/save`, body,  {
                headers:{
                  Authorization: `Bearer ${user.token}`
                }
              })
              .then((res) => {
                console.log("delet res", res);
                if (res.status == 201) {
                  swal("Record is Successfully Activated!", {
                    icon: "success",
                  });
                  // getPaymentRate();
                  getAllChangeOfLoadDetails();
                  // setButtonInputState(false);
                }
              });
          } else if (willDelete == null) {
            swal("Record is Safe");
          }
        });
      }
    };
  
  
    const columns = [
      //Sr No
      { field: "srNo", width: 70, headerName: <FormattedLabel id="srNo" />, },
  
       // consumerNo
       {
        field: language === "en" ? "consumerNo" : "consumerNoMr",
        headerName: <FormattedLabel id="consumerNo" />,
        headerAlign: "center",
        align: "center",
      },
     
  
      // consumerName
      {
        field: language === "en" ? "consumerName" : "consumerNameMr",
        headerName: <FormattedLabel id="consumerName" />,
        headerAlign: "center",
        align: "center",
        flex: 1,
      },
  
      // status
      {
        field: language === "en" ? "status" : "statusMr",
        width: 200,
        headerAlign: "center",
        align: "center",
        headerName: <FormattedLabel id="status"/>,
        flex: 1,
        renderCell: (params) => {
          return (
            <Box>
             {
              params.row.status === "Completed" ? 
              <p style={{color:"#4BB543"}}>{params.row.status}</p>
              :
              params.row.status.includes("Rejected") ? 
                <p style={{color:"red"}}>{params.row.status}</p> 
              :
                params.row.status.includes("Waiting For Jr.") && authority && authority?.find((val) => val === "ENTRY") ? 
                <p style={{color:"blue"}}>{params.row.status}</p>
              :
                params.row.status.includes("Waiting for Dy") && authority && authority?.find((val) => val === "DEPUTY_ENGINEER") ? 
                <p style={{color:"blue"}}>{params.row.status}</p>
              : 
              params.row.status.includes("Waiting For Ex") && authority && authority?.find((val) => val === "EXECUTIVE_ENGINEER") ? 
              <p style={{color:"blue"}}>{params.row.status}</p>
            : 
            params.row.status.includes("Accountant") && authority && authority?.find((val) => val === "PAYMENT VERIFICATION") ? 
              <p style={{color:"blue"}}>{params.row.status}</p>
            : 
              <p style={{color:"orange"}}>{params.row.status}</p>
             }
            </Box>
          );
        },
      },
  
      {
        field: "actions",
        headerName: <FormattedLabel id="actions" />,
        width: 130,
        headerAlign: "center",
        align: "center",
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <Box>
               <Tooltip title="View">
              <IconButton
                onClick={() => { handleViewActions(params.row) }}
              >
                <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
              </IconButton>
              </Tooltip>
  
              {
                authority && authority[0] === "ENTRY" ?
                    <>
                      {/* <IconButton
                        disabled={editButtonInputState}
                        onClick={() => {
                            router.push({
                                pathname: '/ElectricBillingPayment/transaction/billGenerationAndPayment/editBillGeneration',
                                query: {
                                  id: params.row.id,
                                },
                              }),
                          reset(params.row);
                        }}
                      >
                        <EditIcon style={{ color: "#556CD6" }} />
                      </IconButton> */}
  
                     
                      <IconButton
                        disabled={editButtonInputState}
                        onClick={() => {
                          setBtnSaveText("Update"),
                          setEntryConnectionId(params.row.id),
                          reset(params.row);
                        }}
                      >
                        {params.row.activeFlag == "Y" ? (
                           <Tooltip title="Active">
                          <ToggleOnIcon
                            style={{ color: "green", fontSize: 30 }}
                            onClick={() => deleteById(params.id, "N")}
                          />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Inactive">
                          <ToggleOffIcon
                            style={{ color: "red", fontSize: 30 }}
                            onClick={() => deleteById(params.id, "Y")}
                          />
                          </Tooltip>
                        )}
                      </IconButton>
                    </>
                    : 
                    authority && authority[0] === "PAYMENT VERIFICATION" && params.row.status === "Waiting For Jr.Eng after bill" ?
                    <Tooltip title="Edit">
                    <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                        router.push({
                            pathname: '/ElectricBillingPayment/transaction/billGenerationAndPayment/editBillPayment',
                            query: {
                              id: params.row.id,
                            },
                          }),
                      reset(params.row);
                    }}
                  >
                    <EditIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                    </Tooltip>
                    :                  
                    <></>
              }
            </Box>
          );
        },
      },
    ];
  
    // Row
  
    return (
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
            <FormattedLabel id="changeOfLoad" />
          </h2>
        </Box>
  
        {
        authority && authority.find((val)=> val  === "ENTRY") ?
          <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              // type='primary'
              disabled={buttonInputState}
              onClick={handleAddButton}
            >
              <FormattedLabel id="add" />
            </Button>
          </div>
  
          :
  
          <></>
      }
    
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
          // rows={dataSource}
          // columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          //checkboxSelection
  
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
            getAllChangeOfLoadDetails(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getAllChangeOfLoadDetails(_data, data.page);
          }}
        />
  
      </Paper>
    );
  };
  
  export default Index;
  
  