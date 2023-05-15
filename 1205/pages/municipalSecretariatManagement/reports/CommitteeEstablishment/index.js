import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from '@mui/icons-material/Preview';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from '@mui/icons-material/Print';


import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  Card,
  Tooltip,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Popper,
} from "@mui/material";
import { DataGrid ,GridToolbarContainer,GridToolbar,GridColDef,GridToolbarExport,GridRowProps } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import urls from "../../../../URLS/urls";
 import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstPopulationMasterSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert"
import { LeftOutlined } from "@ant-design/icons";
import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Drawer from "@mui/material/Drawer";


let drawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);
 

  
// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  

const customFilter = (dataSource, filters) => {
  return dataSource
    .filter((item) => {
      const fromDate = new Date(item.fromDate);
      const toDate = new Date(item.toDate);
      const filterFromDate = new Date(filters.fromDate);
      const filterToDate = new Date(filters.toDate);
      return fromDate >= filterFromDate && toDate <= filterToDate;
    })
    .map((item, index) => {
      return { id: index, ...item };
    });
};






const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const handleSearchClick = () => {
    const filters = { fromDate, toDate };
    const filteredData = customFilter(dataSource, filters);
    if(filteredData.length > 0){
        setFilteredData(filteredData);
    }
  };




console.log(filteredData,"/////////////////////")

console.log(dataSource,"}}}}}}}}}}")


  
// //   // Delete By ID
//   const deleteById = (value, _activeFlag) => {
//     let body = {
//       activeFlag: _activeFlag,
//       id: value,
//     };
//     console.log("body", body);
//     if (_activeFlag === "N") {
//       swal({
//         title: "Delete?",
//         text: "Are you sure you want to Delete this Record ? ",
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       }).then((willDelete) => {
//         console.log("inn", willDelete);
//         if (willDelete === true) {
//           axios
//             .post("http://localhost:8099/ms/api/mstPopulation/save", body)
//             .then((res) => {
//               console.log("delet res", res);
//               if (res.status == 200) {
//                 swal("Record is Successfully Deleted!", {
//                   icon: "success",
//                 });
//                 getlicenseTypeDetails();
//                 setButtonInputState(false);
//               }
//             });
//         } else if (willDelete == null) {
//           swal("Record is Safe");
//         }
//       });
//     } else {
//       swal({
//         title: "Delete?",
//         text: "Are you sure you want to Delete this Record ? ",
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       }).then((willDelete) => {
//         console.log("inn", willDelete);
//         if (willDelete === true) {
//           axios
//             .post("http://localhost:8099/ms/api/mstPopulation/save", body)
//             .then((res) => {
//               console.log("delet res", res);
//               if (res.status == 200) {
//                 swal("Record is Successfully Deleted!", {
//                   icon: "success",
//                 });
//                 getlicenseTypeDetails();
//                 setButtonInputState(false);
//               }
//             });
//         } else if (willDelete == null) {
//           swal("Record is Safe");
//         }
//       });
//     }
//   };


 

//   // OnSubmit Form
//   const onSubmitForm = (formData,event) => {
//    event.preventDefault();
   
//     // Update Form Data
//     const finalBodyForApi = {
//       ...formData,
//               activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
//     };

//     // Save - DB
//     if (btnSaveText === "Save") {
//       console.log("Post -----",finalBodyForApi);
//       axios
//         .post(
//           `http://localhost:8099/ms/api/mstPopulation/save`,
//           finalBodyForApi,
//         )
//         .then((res) => {
//           if (res.status == 200) {
//             sweetAlert("Saved!", "Record Saved successfully !", "success");
//             getlicenseTypeDetails();
//             setButtonInputState(false);
//             setEditButtonInputState(false);
//             setDeleteButtonState(false);
//             setIsOpenCollapse(false);
//           }
//         });
//     }
//     // Update Data Based On ID
//     else if (btnSaveText === "Update") {
//       console.log("Put -----");
// axios
//         .post(
//           `http://localhost:8099/ms/api/mstPopulation/save`,
//           finalBodyForApi,
//         )
//         .then((res) => {
//           if (res.status == 200) {
//             sweetAlert("Updated!", "Record Updated successfully !", "success");
//             getlicenseTypeDetails();
//             setButtonInputState(false);
//             setIsOpenCollapse(false);
//           }
//         });
//     }
//   };

//   // Exit Button
//   const exitButton = () => {
//     reset({
//       ...resetValuesExit,
//     });
//     setButtonInputState(false);
//     setIsOpenCollapse(false);
//   };

//   // cancell Button
//   const cancellButton = () => {
//     reset({
//       ...resetValuesCancell,
//       id
//     });
//   };



// //   const [honariumNames, setHonariumNames] = useState([]);

// //   const getHonariumNames = () => {
// //     axios
// //       .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
// //       .then((r) => {
// //         setHonariumNames(
// //           r.data.map((row) => ({
// //             id: row.id,
// //             honariumName: row.honariumName,
// //           })),
// //         );
// //       });
// //   };



// //   useEffect(() => {
// //     getHonariumNames();
// //   
// //   }, []);

// //   // Reset Values Cancell
//   const resetValuesCancell = {
    
//        id: "",
//              ward: "",
//             maleCount: "",
//             femaleCount:"" ,
//             totalCount:"",
    
    
//   };

// //   // Reset Values Exit
//   const resetValuesExit = {
//     id: "",
//              ward: "",
//             maleCount: "",
//             femaleCount:"" ,
//             totalCount:"",
//   };

// //   // Get Table - Data
//   const getlicenseTypeDetails = () => {

//   console.log("getLIC ----")
//     axios
//       .get(`http://localhost:8099/ms/api/mstPopulation/getAll`)
//       .then((res) => {
//         console.log(res,">>>>>>")
//         setDataSource(
//           res.data.population.map((r, i) => ({
//             id: r.id,
//         srNo:i+1,
//              ward: r.ward,
//             maleCount: r.maleCount,
//             femaleCount: r.femaleCount,
//             totalCount: r.totalCount,
//           activeFlag: r.activeFlag,
//           })),
//         );
//  setFilteredData(res.data.committeeMembers);
//       });
//   };

//   // useEffect - Reload On update , delete ,Saved on refresh
//   useEffect(() => {
//     getlicenseTypeDetails();
//   }, []);

  // define colums table
  const columns = [
    {
    field:"srNo",
    headerName:"Sr No.",
    width:90,
    align:"center",
    headerAlign:"center",
  },
    {
      field: "fromDate",
      headerName: "From Date",
     width:110,
      align:"center",
    headerAlign:"center",
    },
    
    
    {
      field: "toDate",
      headerName: "To Date",
       width:110,
      align:"center",
    headerAlign:"center",
    },
    {
      field: "nameOfCommittee",
      headerName: "Name of Committee",
      width:210,
      align:"center",
    headerAlign:"center",
    },
    {
      field: "committeeEstablishmentDate",
      headerName: "Committee Establishment Date",
      width:235,
      align:"center",
    headerAlign:"center",
    },
    {
      field: "committeeDismissedDate",
      headerName: "Committee Dismissed Date",
      width:235,
      align:"center",
    headerAlign:"center",
    },
    {
      field: "honorariumPerMeeting",
      headerName: "Honorarium Per Meeting",
      width:235,
      align:"center",
    headerAlign:"center",
    },
    {
      field: "status",
      headerName: "Status",
      width:135,
      align:"center",
    headerAlign:"center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align:"center",
    headerAlign:"center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="Edit details">
                <IconButton 
                onClick={ () => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                    setIsOpenCollapse(true),
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
               
              }}
                >
                <EditIcon />
              </IconButton>
              </Tooltip>
            
            <Tooltip title="Delete details">
            <IconButton onClick={() => deleteById(params.id,params.activeFlag)}>
              <DeleteIcon />
            </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  

  // View
  return (
    <>
      <BasicLayout titleProp={"none"}>
      <Card>
      <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
      Committee Establishment
          {/* <strong> Document Upload</strong> */}
        </div>
        </Card>
        <Paper
          sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 , padding:1}}
        >
         
<div style={{display:"flex", justifyContent:"space-evenly",alignItems:"center",marginTop: 20  }} >
          {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                
         
                <FormControl style={{ width :185}}>
                  <Controller
                    control={control}
                    name='fromDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat='YYYY/MM/DD'
                          label={
                            <span style={{ fontSize: 16 }}>
                              From Date*
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size='small'
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </FormControl>
                </Grid>
                
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>

              <FormControl style={{ width :185}}>
                  <Controller
                    control={control}
                    name='toDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat='YYYY/MM/DD'
                          label={
                            <span style={{ fontSize: 16 }}>
                              To Date
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size='small'
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </FormControl>
                </Grid> */}


 <form
 style={{display:"flex",flexDirection:"row",alignItems:"center", justifyContent:"space-evenly"}}>
<div
style={{display:"flex",flexDirection:"column",}}
>
 <label htmlFor="from-date"><strong>From Date</strong></label>
        <TextField
          id="from-date"
          
          type="date"
          value={fromDate}
          onChange={handleFromDateChange}
        />
    </div>
       <div
       style={{display:"flex",flexDirection:"column",paddingLeft:"20px"}}>
        <label htmlFor="to-date"><strong>To Date</strong></label>
         <TextField
          id="to-date"
          // label="To Date"
          type="date"
          value={toDate}
          onChange={handleToDateChange}
        />
       </div>
       

<div
 style={{display:"flex",flexDirection:"column",paddingLeft:"20px" ,paddingTop:"20px"}}
> 
<Button sx={{backgroundColor:"rgb(0, 132, 255) !important" ,height:35}}
              variant='contained'
              size="small" onClick={handleSearchClick}>
          Search
        </Button></div>
     
      </form>

           <div className={styles.addbtn}>
            <Button
            sx={{backgroundColor:"rgb(0, 132, 255) !important",marginLeft:20,}}
              variant='contained'
              endIcon={<PrintIcon />}
              type='primary'
              disabled={buttonInputState}
              onClick={() => {
                // reset({
                //   ...resetValuesExit,
                // });
                setBtnSaveText("Save");
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              Print{" "}
            </Button>
          </div>
</div>
         

          <DataGrid
            autoHeight
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 2,
              marginBottom: 5,
            }}
           rows={filteredData}
            // rows={dataSource}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            //    components={{
            //   Toolbar: ()=>{return <GridToolbarContainer sx={{justifyContent:"flex-end"}}> <GridToolbarExport /> </GridToolbarContainer>}
            // }}
              components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        // disableColumnFilter
        // disableColumnSelector
        // disableDensitySelector
          />

 {isOpenCollapse && (
           <Card
           sx={{width:500,marginLeft:27}}
           
           >
             
                <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
         <p
         style={{paddingLeft:85,marginBottom:0}}
         >Popup Print Modal</p>
          {/* <strong> Document Upload</strong> */}
        </div>
              
                 <p 
                 style={{paddingLeft:40}}
                 >You Want To Print in:</p>  

                    <div 
                    // className={styles.btn}
className={styles.btnOverride}
                    >
                     <Button
// sx={{height:35,}}
              variant='contained'
              size="small"
              color='error'
> PDF
</Button>  
<Button
sx={{marginLeft:5,}}
              variant='contained'
              size="small"
              color='success'
> Excel
</Button>  
<Button
sx={{backgroundColor:"rgb(0, 132, 255) !important",marginLeft:5 ,height:35,}}
              variant='contained'
              size="small"
> CSV
</Button>  
                    </div>
                  
                
            </Card>
          )}
        {/* <CSVLink data={data}>Download CSV</CSVLink>
        <PDFDownloadLink document={<MyPdfDocument data={filteredData}/>} fileName="data.pdf">
          Download PDF
        </PDFDownloadLink> */}
        </Paper>
      </BasicLayout>
    </>
  );
};

export default Index;


