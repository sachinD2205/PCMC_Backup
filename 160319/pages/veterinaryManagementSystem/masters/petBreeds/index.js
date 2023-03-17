// import { yupResolver } from "@hookform/resolvers/yup";
// import AddIcon from "@mui/icons-material/Add";
// import ClearIcon from "@mui/icons-material/Clear";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import SaveIcon from "@mui/icons-material/Save";
// import { useRouter } from "next/router";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// import {
//     Box,
//     Button,
//     Divider,
//     FormControl,
//     FormHelperText,
//     Grid,
//     InputBase,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     Slide,
//     TextField,
//     Toolbar,
// } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import {
//     DataGrid,
//     GridToolbarDensitySelector,
//     GridToolbarFilterButton,
// } from "@mui/x-data-grid";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Controller, FormProvider, useForm } from "react-hook-form";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
// // import styles from "../court/view.module.css";
// import styles from "../../../../styles/LegalCase_Styles/court.module.css";

// import schema from "../../../../containers/schema/LegalCaseSchema/courtSchema";
// import sweetAlert from "sweetalert";

// import { GridToolbar } from "@mui/x-data-grid";
// import { border } from "@mui/system";
// import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";

// import { ElevatorOutlined } from "@mui/icons-material";
// import { useSelector } from "react-redux";
// import urls from "../../../../URLS/urls";
// import { EyeFilled } from "@ant-design/icons";
// // import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// const Index = () => {
//     const {
//         register,
//         control,
//         handleSubmit,
//         methods,
//         reset,
//         watch,
//         formState: { errors },
//     } = useForm({
//         criteriaMode: "all",
//         resolver: yupResolver(schema),
//         mode: "onChange",
//     });
//     const router = useRouter();

//     const [btnSaveText, setBtnSaveText] = useState("Save");

//     const [dataSource, setDataSource] = useState([]);
//     const [buttonInputState, setButtonInputState] = useState();
//     const [isOpenCollapse, setIsOpenCollapse] = useState(false);
//     const [id, setID] = useState();
//     const [fetchData, setFetchData] = useState(null);
//     const [editButtonInputState, setEditButtonInputState] = useState(false);
//     const [deleteButtonInputState, setDeleteButtonState] = useState(false);
//     const [slideChecked, setSlideChecked] = useState(false);
//     const [isDisabled, setIsDisabled] = useState(true);
//     const [moduleNames, setModuleName] = useState([]);

//     const language = useSelector((state) => state.labels.language);

//     // const [data, setData] = useState({
//     //   rows: [],
//     //   totalRows: 0,
//     //   rowsPerPageOptions: [10, 20, 50, 100],
//     //   pageSize: 10,
//     //   page: 1,column
//     // });
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         getModuleName();
//     }, [fetchData]);

//     // get Animal Name
//     const getModuleName = () => {
//         axios.get(`${urls.VMS}/mstPetAnimal/getAll`).then((res) => {
//             // let result = res.data.mstPetAnimalList;
//             console.log("ghfgf", res);
//             setModuleName(
//                 res?.data?.mstPetAnimalList?.map((r, i) => ({
//                     id: r.id,
//                     // name: r.name,
//                     moduleName: r.name
//                 }))
//                 // result.map((r, i) => ({
//                 //     id: r.id,
//                 //     // name: r.name,
//                 //     petAnimalKey: r.name,
//                 // }))
//             );
//         });
//     };

//     useEffect(() => {
//         getModuleName();
//         console.log(moduleNames)
//     }, []);

//     // get Parameter
//     const getParameter = () => {
//         axios
//             .get(`${urls.VMS}/mstAnimalBreed/getAll`, {
//                 // params: {
//                 //   pageSize: _pageSize,
//                 //   pageNo: _pageNo,
//                 // },
//             })
//             .then((r) => {
//                 console.log(";r", r);
//                 let result = r.data.mstAnimalBreedList;
//                 console.log("result", result);

//                 // setData(r.data.parameterList)

//                 let _res = result.map((res, i) => {
//                     // console.log('test',res);
//                     return {
//                         srNo: i + 1,
//                         animalBreed: res.animalBreed,
//                         petAnimalName: res.petAnimalName ? res.petAnimalName : res.petAnimalKey
//                         // petAnimalName:res.petAnimalKey
//                     }
//                 })
//                 setData(
//                     _res
//                 );

//                 // res.data.caseMainType.map((r, i) => ({
//                 //   id: r.id,
//                 //   // caseMainType: r.caseMainType,
//                 //   caseMainType: r.caseMainType,
//                 //   caseMainTypeMr: r.caseMainTypeMr,
//                 // }))
//             });
//     };

//     useEffect(() => {
//         getParameter();
//     }, [moduleNames]);

//     // New
//     const onSubmitForm = (fromData) => {
//         console.log("fromData", fromData);
//         // alert("1");

//         // Save - DB
//         let _body = {
//             ...fromData,

//             // activeFlag:  btnSaveText === "Update" ? null :   fromData.activeFlag,
//         };
//         if (btnSaveText === "Save") {
//             const tempData = axios
//                 .post(`${urls.VMS}/mstAnimalBreed/save`, _body)
//                 .then((res) => {
//                     if (res.status == 201) {
//                         sweetAlert("Saved!", "Record Saved successfully !", "success");

//                         setButtonInputState(false);
//                         setIsOpenCollapse(false);
//                         setFetchData(tempData);
//                         setEditButtonInputState(false);
//                         setDeleteButtonState(false);
//                     }
//                 });
//         }
//         // Update Data Based On ID
//         else if (btnSaveText === "Update") {
//             const tempData = axios
//                 .post(`${urls.VMS}/mstAnimalBreed/save`, _body)
//                 .then((res) => {
//                     console.log("res", res);
//                     if (res.status == 200) {
//                         fromData.id
//                             ? sweetAlert(
//                                 "Updated!",
//                                 "Record Updated successfully !",
//                                 "success"
//                             )
//                             : sweetAlert("Saved!", "Record Saved successfully !", "success");
//                         getParameter();
//                         // setButtonInputState(false);
//                         setEditButtonInputState(false);
//                         setDeleteButtonState(false);
//                         setIsOpenCollapse(false);
//                     }
//                 });
//         }
//     };

//     // Exit Button
//     const exitButton = () => {
//         reset({
//             ...resetValuesExit,
//         });
//         setButtonInputState(false);
//         setSlideChecked(false);
//         setSlideChecked(false);
//         setIsOpenCollapse(false);
//         setEditButtonInputState(false);
//         setDeleteButtonState(false);
//     };

//     // cancell Button
//     const cancellButton = () => {
//         reset({
//             ...resetValuesCancell,
//             id,
//         });
//     };

//     // Reset Values Cancell
//     const resetValuesCancell = {
//         petAnimalKey: "",
//         animalBreed: "",
//     };

//     // Reset Values Exit
//     const resetValuesExit = {
//         // module: "",
//         petAnimalKey: "",
//         animalBreed: "",

//         id: null,
//     };

//     // Delete By ID
//     const deleteById = (value, _activeFlag) => {
//         let body = {
//             activeFlag: _activeFlag,
//             id: value,
//         };
//         console.log("body", body);
//         if (_activeFlag === "N") {
//             swal({
//                 title: "Inactivate?",
//                 text: "Are you sure you want to inactivate this Record ? ",
//                 icon: "warning",
//                 buttons: true,
//                 dangerMode: true,
//             }).then((willDelete) => {
//                 console.log("inn", willDelete);
//                 if (willDelete === true) {
//                     axios
//                         .post(`${urls.VMS}/mstAnimalBreed/save`, body)
//                         .then((res) => {
//                             console.log("delet res", res);
//                             if (res.status == 200) {
//                                 swal("Record is Successfully Deleted!", {
//                                     icon: "success",
//                                 });
//                                 getParameter()
//                             }
//                         });
//                 } else if (willDelete == null) {
//                     swal("Record is Safe");
//                 }
//             });
//         } else {
//             swal({
//                 title: "Activate?",
//                 text: "Are you sure you want to activate this Record ? ",
//                 icon: "warning",
//                 buttons: true,
//                 dangerMode: true,
//             }).then((willDelete) => {
//                 console.log("inn", willDelete);
//                 if (willDelete === true) {
//                     axios
//                         .post(`${urls.VMS}/mstAnimalBreed/save`, body)
//                         .then((res) => {
//                             console.log("delet res", res);
//                             if (res.status == 200) {
//                                 swal("Record is Successfully Deleted!", {
//                                     icon: "success",
//                                 });
//                                 getParameter()

//                             }
//                         });
//                 } else if (willDelete == null) {
//                     swal("Record is Safe");
//                 }
//             });
//         }
//     };

//     const columns = [
//         {
//             field: "srNo", headerName: "Sr.No",
//             width: "100",
//             headerAlign: "center",
//             align: "center",

//             // flex: 1

//         },
//         {
//             field: "petAnimalName",
//             // field: language === "en" ? "courtName" : "courtMr",
//             headerName: " Animal Name",
//             // headerName: <FormattedLabel id="courtName" />,
//             // flex: 1,
//             width: "250",
//             headerAlign: "center",
//             align: "center",

//         },
//         // { field: "courtNo", headerName: "Court No", flex: 1 },

//         {
//             field: "animalBreed",
//             headerName: "Animal Breed",
//             width: "500",
//             headerAlign: "center",
//             align: "center",

//             flex: 1,

//         },

//         // Action
//         {
//             field: "actions",
//             headerName: <FormattedLabel id="actions" />,
//             width: 120,
//             sortable: false,
//             disableColumnMenu: true,
//             renderCell: (params) => {
//                 return (
//                     <Box>
//                         <IconButton
//                             disabled={editButtonInputState}
//                             onClick={() => {
//                                 setBtnSaveText("Update"),
//                                     setID(params.row.id),
//                                     setIsOpenCollapse(true),
//                                     setSlideChecked(true);
//                                 // setButtonInputState(true);
//                                 console.log("params.row: ", params.row);
//                                 // reset(params.row);
//                                 reset({
//                                     ...params.row,
//                                     name: params.row.petAnimal
//                                 })
//                             }}
//                         >
//                             <EditIcon style={{ color: "#556CD6" }} />
//                         </IconButton>
//                         {/* <IconButton onClick={() => deleteById(params.id)}>
//                     <DeleteIcon />
//                   </IconButton> */}
//                         <IconButton
//                             disabled={editButtonInputState}
//                             onClick={() => {
//                                 setBtnSaveText("Update"),
//                                     setID(params.row.id),
//                                     //   setIsOpenCollapse(true),
//                                     setSlideChecked(true);
//                                 // setButtonInputState(true);
//                                 console.log("params.row: ", params.row);
//                                 reset(params.row);
//                             }}
//                         >
//                             {params.row.activeFlag == "Y" ? (
//                                 <ToggleOnIcon
//                                     style={{ color: "green", fontSize: 30 }}
//                                     onClick={() => deleteById(params.id, "N")}
//                                 />
//                             ) : (
//                                 <ToggleOffIcon
//                                     style={{ color: "red", fontSize: 30 }}
//                                     onClick={() => deleteById(params.id, "Y")}
//                                 />
//                             )}
//                         </IconButton>
//                     </Box>
//                 );
//             },
//         },
//     ];

//     // Row

//     return (
//         // <BasicLayout>
//         <Paper
//             elevation={8}
//             variant="outlined"
//             sx={{
//                 border: 1,
//                 borderColor: "grey.500",
//                 justifyContent: "center",
//                 alignContent: "center",
//                 // marginLeft: "10px",
//                 // marginRight: "10px",
//                 marginTop: "10px",
//                 marginBottom: "60px",
//                 padding: 1,
//             }}
//         >
//             <Box
//                 style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     paddingTop: "10px",
//                     // backgroundColor:'#0E4C92'
//                     // backgroundColor:'		#0F52BA'
//                     // backgroundColor:'		#0F52BA'
//                     background:
//                         "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
//                 }}
//             >
//                 <h2>Breeds</h2>

//                 {/* <h2><FormattedLabel id="parameter"/> </h2> */}
//             </Box>

//             <Divider />

//             <FormProvider {...methods}>
//                 <form onSubmit={handleSubmit(onSubmitForm)}>
//                     {isOpenCollapse && (
//                         <Slide
//                             direction="down"
//                             in={slideChecked}
//                             mountOnEnter
//                             unmountOnExit
//                         >
//                             <Grid
//                                 container
//                                 sx={{
//                                     // marginLeft: "30px",
//                                     justifyContent: "center",
//                                     alignContent: "center",
//                                     marginTop: "20px"

//                                 }}
//                             >
//                                 <Grid item xs={1} />
//                                 {/* Animal Name */}
//                                 <Grid
//                                     item
//                                     // sx={{
//                                     //   // marginLeft: "48px",
//                                     //   justifyContent:'center',
//                                     //   alignContent:"center",
//                                     // }}
//                                     xs={3}
//                                 >
//                                     <FormControl
//                                         variant="standard"
//                                         fullWidth
//                                         error={!!errors.petAnimalKey}
//                                     >
//                                         <InputLabel id="demo-simple-select-standard-label">
//                                             Animal Name
//                                         </InputLabel>
//                                         <Controller
//                                             render={({ field }) => (
//                                                 <Select

//                                                     // sx={{ width: "50%" }}
//                                                     value={field.value}
//                                                     onChange={(value) => field.onChange(value)}
//                                                     // label={<FormattedLabel id="caseType" />}
//                                                     label="Animal Name"

//                                                 // InputLabelProps={{
//                                                 //   shrink: //true
//                                                 //     (watch("caseMainType") ? true : false) ||
//                                                 //     (router.query.caseMainType ? true : false),
//                                                 // }}

//                                                 >
//                                                     {moduleNames &&
//                                                         moduleNames.map((moduleName, index) => (
//                                                             <MenuItem key={index} value={moduleName.id}>
//                                                                 {moduleName.moduleName}
//                                                                 {/* {language == "en"
//                                       ? name?.name
//                                       : name?.name} */}
//                                                             </MenuItem>
//                                                         ))}
//                                                 </Select>
//                                             )}
//                                             name="petAnimalKey"
//                                             control={control}
//                                             defaultValue=""
//                                         />
//                                         <FormHelperText>
//                                             {errors?.petAnimalKey ? errors.petAnimalKey.message : null}
//                                         </FormHelperText>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item xs={1.5} />

//                                 {/* Parameter  In English*/}
//                                 <Grid item
//                                     // sx={{
//                                     //   // marginLeft: "48px",
//                                     //   justifyContent:'center',
//                                     //   alignContent:"center",
//                                     // }}
//                                     xs={3}>
//                                     <TextField
//                                         fullWidth
//                                         // sx={{width:'50%'}}
//                                         // required
//                                         id="standard-basic"
//                                         label="Breed"
//                                         variant="standard"
//                                         // disabled={isDisabled}
//                                         InputProps={{ style: { fontSize: 18 } }}
//                                         InputLabelProps={{
//                                             style: { fontSize: 15 },
//                                             //true
//                                             shrink:
//                                                 (watch("animalBreed") ? true : false) ||
//                                                 (router.query.animalBreed ? true : false),
//                                         }}
//                                         {...register("animalBreed")}
//                                         error={!!errors.animalBreed}
//                                         helperText={errors?.animalBreed ? errors.animalBreed.message : " "}
//                                     />
//                                 </Grid>

//                                 <Grid
//                                     container
//                                     spacing={5}
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "center",
//                                         alignContent: "center",
//                                         paddingTop: "50px",
//                                     }}
//                                 >
//                                     <Grid tem xs={1} />
//                                     <Grid item xs={2}  >
//                                         <Button
//                                             // sx={{ marginRight: 10 }}
//                                             type="submit"
//                                             variant="contained"
//                                             color="primary"
//                                             endIcon={<SaveIcon />}
//                                         >
//                                             {/* {btnSaveText} */}
//                                             {btnSaveText === "Update" ? (
//                                                 <FormattedLabel id="update" />
//                                             ) : (
//                                                 <FormattedLabel id="save" />
//                                             )}
//                                         </Button>{" "}
//                                     </Grid>
//                                     <Grid item xs={2} >
//                                         <Button
//                                             // sx={{ marginRight: 8 }}
//                                             variant="contained"
//                                             color="primary"
//                                             endIcon={<ClearIcon />}
//                                             onClick={() => cancellButton()}
//                                         >
//                                             {/* <FormattedLabel id="clear" /> */}
//                                             Clear
//                                         </Button>
//                                     </Grid>
//                                     <Grid item xs={2} >
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             endIcon={<ExitToAppIcon />}
//                                             onClick={() => exitButton()}
//                                         >
//                                             {/* <FormattedLabel id="exit" /> */}
//                                             Exit
//                                         </Button>
//                                     </Grid>
//                                 </Grid>
//                                 {/* </div> */}
//                             </Grid>
//                         </Slide>
//                     )}
//                 </form>
//             </FormProvider >

//             <div className={styles.addbtn}>
//                 <Button
//                     variant="contained"
//                     endIcon={<AddIcon />}
//                     // type='primary'
//                     disabled={buttonInputState}
//                     onClick={() => {
//                         reset({
//                             ...resetValuesExit,
//                         });
//                         setEditButtonInputState(true);
//                         setDeleteButtonState(true);
//                         setBtnSaveText("Save");
//                         setButtonInputState(true);
//                         setSlideChecked(true);
//                         setIsOpenCollapse(!isOpenCollapse);
//                     }}
//                 >
//                     {/* <FormattedLabel id="add" /> */}
//                     Add
//                 </Button>
//             </div>

//             <DataGrid
//                 getRowId={(row) => row.srNo}
//                 // disableColumnFilter
//                 // disableColumnSelector
//                 // disableToolbarButton
//                 // disableDensitySelector
//                 components={{ Toolbar: GridToolbar }}
//                 componentsProps={{
//                     toolbar: {
//                         showQuickFilter: true,
//                         quickFilterProps: { debounceMs: 500 },
//                         printOptions: { disableToolbarButton: true },
//                         // disableExport: true,
//                         // disableToolbarButton: true,
//                         // csvOptions: { disableToolbarButton: true },
//                     },
//                 }}
//                 autoHeight
//                 sx={{
//                     // width:"900px",
//                     overflowY: "scroll",

//                     "& .MuiDataGrid-virtualScrollerContent": {},
//                     "& .MuiDataGrid-columnHeadersInner": {
//                         backgroundColor: "#556CD6",
//                         color: "white",
//                     },

//                     "& .MuiDataGrid-cell:hover": {
//                         color: "primary.main",
//                     },
//                 }}
//                 density="compact"
//                 // autoHeight={true}
//                 // rowHeight={50}
//                 // pagination
//                 // paginationMode="server"
//                 // loading={data.loading}
//                 // rowCount={data.totalRows}
//                 // rowsPerPageOptions={data.rowsPerPageOptions}
//                 // page={data.page}
//                 // pageSize={data.pageSize}
//                 rows={data}
//                 columns={columns}
//             // onPageChange={(_data) => {
//             //   getParameter(data.pageSize, _data);
//             // }}
//             // onPageSizeChange={(_data) => {
//             //   console.log("222", _data);
//             // updateData("page", 1);
//             // getParameter(_data, data.page);
//             // }}
//             />
//         </Paper>
//         // </BasicLayout>
//     );
// };

// export default Index;

import React, { useEffect, useState } from 'react'
import router from 'next/router'
import Head from 'next/head'
import styles from '../vetMasters.module.css'

import URLs from '../../../../URLS/urls'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Add, Clear, Delete, Edit, ExitToApp, Save } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import { useSelector } from 'react-redux'

const Index = () => {
  const [table, setTable] = useState([])
  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    {
      id: 1,
      petNameEn: '',
      petNameMr: '',
    },
  ])
  const [runAgain, setRunAgain] = useState(false)
  const [collapse, setCollapse] = useState(false)

  let petSchema = yup.object().shape({
    petAnimalKey: yup.number().required('Please select a pet animal'),
    breedNameEn: yup.string().required('Please enter breed name in english'),
    breedNameMr: yup.string().required('Please enter breed name in marathi'),
  })

  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(petSchema),
  })

  useEffect(() => {
    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimalDropDown(
        res.data.mstPetAnimalList.map((j, i) => ({
          id: j.id,
          petNameEn: j.nameEn,
          petNameMr: j.nameMr,
        }))
      )
    })
  }, [])

  useEffect(() => {
    setRunAgain(false)

    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setTable(
        res.data.mstAnimalBreedList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
          petAnimalEn: petAnimalDropDown.find(
            (obj) => obj.id === j.petAnimalKey
          )?.petNameEn,
          petAnimalMr: petAnimalDropDown.find(
            (obj) => obj.id === j.petAnimalKey
          )?.petNameMr,
        }))
      )
    })
  }, [runAgain, petAnimalDropDown])

  const deleteAnimal = (deleteId) => {
    sweetAlert({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${URLs.VMS}/mstAnimalBreed/delete/${deleteId}`)
          .then((res) => {
            if (res.status == 226) {
              sweetAlert('Deleted!', 'Record Deleted successfully !', 'success')
              setRunAgain(true)
            }
          })
      }
    })
  }

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'petAnimalEn' : 'petAnimalMr',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petAnimal' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'breedNameEn',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='breedNameEn' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'breedNameMr',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='breedNameMr' />,
      flex: 1,
    },

    {
      headerClassName: 'cellColor',

      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: '#1976d2' }}
              onClick={() => {
                reset({
                  id: params.row.id,
                  petAnimalKey: params.row.petAnimalKey,
                  breedNameEn: params.row.breedNameEn,
                  breedNameMr: params.row.breedNameMr,
                })
                setCollapse(true)
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              style={{ color: 'red' }}
              onClick={() => {
                deleteAnimal(params.row.id)
              }}
            >
              <Delete />
            </IconButton>
          </>
        )
      },
    },
  ]

  const finalSubmit = (data) => {
    console.log('Data: ', data)

    axios
      .post(`${URLs.VMS}/mstAnimalBreed/save`, { ...data, activeFlag: 'Y' })
      .then((res) => {
        if (data.id) {
          sweetAlert('Updated!', 'Animal data updated successfully!', 'success')
        } else {
          sweetAlert('Success!', 'Animal data saved successfully!', 'success')
        }
        reset({
          petAnimalKey: '',
          breedNameEn: '',
          breedNameMr: '',
        })
        setRunAgain(true)
      })
      .catch((error) => {
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
          icon: 'error',
          buttons: {
            confirm: {
              text: 'OK',
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        })
      })
  }

  return (
    <>
      <Head>
        <title>Pet Animal</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id='petBreed' />
        </div>
        <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() => {
              setCollapse(!collapse)
            }}
          >
            <FormattedLabel id='add' />
          </Button>
        </div>
        <Slide direction='down' in={collapse} mountOnEnter unmountOnExit>
          <form
            onSubmit={handleSubmit(finalSubmit)}
            style={{ padding: '5vh 3%' }}
          >
            <div
              className={styles.row}
              style={{ justifyContent: 'space-evenly' }}
            >
              <FormControl variant='standard' error={!!error.petAnimalKey}>
                <InputLabel id='demo-simple-select-standard-label'>
                  <FormattedLabel id='petAnimal' />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: '250px' }}
                      labelId='demo-simple-select-standard-label'
                      id='demo-simple-select-standard'
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label='petAnimalKey'
                    >
                      {petAnimalDropDown &&
                        petAnimalDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == 'en'
                              ? //@ts-ignore
                                value.petNameEn
                              : // @ts-ignore
                                value?.petNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name='petAnimalKey'
                  control={control}
                  defaultValue=''
                />
                <FormHelperText>
                  {error?.petAnimalKey ? error.petAnimalKey.message : null}
                </FormHelperText>
              </FormControl>
              <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='breedNameEn' />}
                variant='standard'
                {...register('breedNameEn')}
                error={!!error.breedNameEn}
                helperText={
                  error?.breedNameEn ? error.breedNameEn.message : null
                }
              />
              <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='breedNameMr' />}
                variant='standard'
                {...register('breedNameMr')}
                error={!!error.breedNameMr}
                helperText={
                  error?.breedNameMr ? error.breedNameMr.message : null
                }
              />
            </div>
            <div className={styles.buttons}>
              <Button
                color='success'
                variant='contained'
                type='submit'
                endIcon={<Save />}
              >
                <FormattedLabel id='save' />
              </Button>
              <Button
                variant='outlined'
                color='error'
                endIcon={<Clear />}
                onClick={() => {
                  reset({
                    petAnimalKey: null,
                    breedNameEn: '',
                    breedNameMr: '',
                  })
                }}
              >
                <FormattedLabel id='clear' />
              </Button>
              <Button
                variant='contained'
                color='error'
                endIcon={<ExitToApp />}
                onClick={() => {
                  router.back()
                }}
              >
                <FormattedLabel id='exit' />
              </Button>
            </div>
          </form>
        </Slide>

        <div className={styles.table}>
          <DataGrid
            autoHeight
            sx={{
              marginTop: '5vh',
              width: '100%',

              '& .cellColor': {
                backgroundColor: '#1976d2',
                color: 'white',
              },
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>
      </Paper>
    </>
  )
}

export default Index
