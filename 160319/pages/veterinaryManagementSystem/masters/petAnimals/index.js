// // import { yupResolver } from "@hookforpostm/resolvers/yup";
// import AddIcon from "@mui/icons-material/Add";
// import ClearIcon from "@mui/icons-material/Clear";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import SaveIcon from "@mui/icons-material/Save";
// import {
//   Box,
//   Button,
//   FormControl,
//   Grid,
//   InputBase,
//   InputLabel,
//   Paper,
//   Slide,
//   TextField,
//   Toolbar,
// } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import {
//   DataGrid,
//   GridToolbarDensitySelector,
//   GridToolbarFilterButton,
// } from "@mui/x-data-grid";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
// // import styles from "../court/view.module.css
// import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
// import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/billingCycleSchema";
// import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import { GridToolbar } from "@mui/x-data-grid";
// import { border } from "@mui/system";
// import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import { useSelector } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";
// // import urls from "../../../../URLS/urls";
// import urls from "../../../../URLS/urls";
// import { useRouter } from "next/router";

// const Index = () => {
//   const {
//     register,
//     control,
//     handleSubmit,
//     methods,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: "all",
//     resolver: yupResolver(schema),
//     mode: "onChange",
//   });

//   const [btnSaveText, setBtnSaveText] = useState("Save");
//   const [dataSource, setDataSource] = useState([]);
//   const [buttonInputState, setButtonInputState] = useState();
//   const [isOpenCollapse, setIsOpenCollapse] = useState(false);
//   const [id, setID] = useState();
//   const [fetchData, setFetchData] = useState(null);
//   const [editButtonInputState, setEditButtonInputState] = useState(false);
//   const [deleteButtonInputState, setDeleteButtonState] = useState(false);
//   const [slideChecked, setSlideChecked] = useState(false);
//   const [isDisabled, setIsDisabled] = useState(true);
//   const router = useRouter();

//   const language = useSelector((state) => state.labels.language);

//   const [data, setData] = useState({
//     rows: [],
//     totalRows: 0,
//     rowsPerPageOptions: [10, 20, 50, 100],
//     pageSize: 10,
//     page: 1,
//   });

//   useEffect(() => {
//     getPetAnimals();
//   }, [fetchData]);

//   // Get Table - Data
//   const getPetAnimals = (_pageSize = 10, _pageNo = 0) => {
//     console.log("_pageSize,_pageNo", _pageSize, _pageNo);
//     axios
//       .get(`${urls.VMS}/mstPetAnimal/getAll`, {
//         params: {
//           pageSize: _pageSize,
//           pageNo: _pageNo,
//         },
//       })
//       .then((r) => {
//         console.log(";r", r);
//         let result = r.data.mstPetAnimalList;
//         console.log("result", result);

//         let _res = result.map((r, i) => {
//           console.log("44");
//           return {
//             // r.data.map((r, i) => ({
//             activeFlag: r.activeFlag,

//             id: r.id,
//             srNo: i + 1,
//             petAnimal: r.name,
//             status: r.activeFlag === "Y" ? "Active" : "Inactive",
//           };
//         });
//         setDataSource([..._res]);
//         setData({
//           rows: _res,
//           totalRows: r.data.totalElements,
//           rowsPerPageOptions: [10, 20, 50, 100],
//           pageSize: r.data.pageSize,
//           page: r.data.pageNo,
//         });
//       });
//   };

//   const onSubmitForm = (fromData) => {
//     console.log("fromData", fromData);
//     // Save - DB
//     let _body = {
//       ...fromData,
//       activeFlag: fromData.activeFlag,
//     };
//     if (btnSaveText === "Save") {
//       const tempData = axios
//         .post(`${urls.VMS}/mstPetAnimal/save`, _body)
//         .then((res) => {
//           if (res.status == 201) {
//             sweetAlert("Saved!", "Record Saved successfully !", "success");

//             setButtonInputState(false);
//             setIsOpenCollapse(false);
//             setFetchData(tempData);
//             setEditButtonInputState(false);
//             setDeleteButtonState(false);
//           }
//         });
//     }
//     // Update Data Based On ID
//     else if (btnSaveText === "Update") {
//       const tempData = axios
//         .post(`${urls.VMS}/mstPetAnimal/save`, _body)
//         .then((res) => {
//           console.log("res", res);
//           if (res.status == 201) {
//             fromData.id
//               ? sweetAlert(
//                 "Updated!",
//                 "Record Updated successfully !",
//                 "success"
//               )
//               : sweetAlert("Saved!", "Record Saved successfully !", "success");
//             getPetAnimals();
//             // setButtonInputState(false);
//             setEditButtonInputState(false);
//             setDeleteButtonState(false);
//             setIsOpenCollapse(false);
//           }
//         });
//     }
//   };

//   // Delete By ID
//   const deleteById = (value, _activeFlag) => {
//     let body = {
//       activeFlag: _activeFlag,
//       id: value,
//     };
//     console.log("body", body);
//     if (_activeFlag === "N") {
//       swal({
//         title: "Inactivate?",
//         text: "Are you sure you want to inactivate this Record ? ",
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       }).then((willDelete) => {
//         console.log("inn", willDelete);
//         if (willDelete === true) {
//           axios
//             .post(`${urls.VMS}/mstPetAnimal/save`, body)
//             .then((res) => {
//               console.log("delet res", res);
//               if (res.status == 201) {
//                 swal("Record is Successfully Deleted!", {
//                   icon: "success",
//                 });
//                 getPetAnimals();
//                 // setButtonInputState(false);
//               }
//             });
//         } else if (willDelete == null) {
//           swal("Record is Safe");
//         }
//       });
//     } else {
//       swal({
//         title: "Activate?",
//         text: "Are you sure you want to activate this Record ? ",
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       }).then((willDelete) => {
//         console.log("inn", willDelete);
//         if (willDelete === true) {
//           axios
//             .post(`${urls.VMS}/mstPetAnimal/save`, body)
//             .then((res) => {
//               console.log("delet res", res);
//               if (res.status == 201) {
//                 swal("Record is Successfully Activated!", {
//                   icon: "success",
//                 });
//                 // getPaymentRate();
//                 getPetAnimals();
//                 // setButtonInputState(false);
//               }
//             });
//         } else if (willDelete == null) {
//           swal("Record is Safe");
//         }
//       });
//     }
//   };

//   // Exit Button
//   const exitButton = () => {
//     reset({
//       ...resetValuesExit,
//     });
//     setButtonInputState(false);
//     setSlideChecked(false);
//     setSlideChecked(false);
//     setIsOpenCollapse(false);
//     setEditButtonInputState(false);
//     setDeleteButtonState(false);
//   };

//   // cancell Button
//   const cancellButton = () => {
//     reset({
//       ...resetValuesCancell,
//       id,
//     });
//   };

//   // Reset Values Cancell
//   const resetValuesCancell = {
//     name: "",
//   };

//   // Reset Values Exit
//   const resetValuesExit = {
//     name: "",

//     id: null,
//   };

//   const columns = [
//     { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
//     {

//       field: language === "en" ? "petAnimal" : "petAnimal",

//       headerName: <FormattedLabel id="name" />,
//       flex: 1,
//     },

//     //Action
//     {
//       field: "actions",
//       headerName: <FormattedLabel id="actions" />,
//       width: 120,
//       sortable: false,
//       disableColumnMenu: true,
//       renderCell: (params) => {
//         return (
//           <Box>
//             <IconButton
//               disabled={editButtonInputState}
//               onClick={() => {
//                 setBtnSaveText("Update"),
//                   setID(params.row.id),
//                   setIsOpenCollapse(true),
//                   setSlideChecked(true);
//                 // setButtonInputState(true);
//                 console.log("params.row: ", params.row);
//                 // reset(params.row);
//                 reset({
//                   ...params.row,
//                   name: params.row.petAnimal
//                 })
//               }}
//             >
//               <EditIcon style={{ color: "#556CD6" }} />
//             </IconButton>
//             {/* <IconButton onClick={() => deleteById(params.id)}>
//               <DeleteIcon />
//             </IconButton> */}
//             <IconButton
//               disabled={editButtonInputState}
//               onClick={() => {
//                 setBtnSaveText("Update"),
//                   setID(params.row.id),
//                   //   setIsOpenCollapse(true),
//                   setSlideChecked(true);
//                 // setButtonInputState(true);
//                 console.log("params.row: ", params.row);
//                 reset(params.row);
//               }}
//             >
//               {params.row.activeFlag == "Y" ? (
//                 <ToggleOnIcon
//                   style={{ color: "green", fontSize: 30 }}
//                   onClick={() => deleteById(params.id, "N")}
//                 />
//               ) : (
//                 <ToggleOffIcon
//                   style={{ color: "red", fontSize: 30 }}
//                   onClick={() => deleteById(params.id, "Y")}
//                 />
//               )}
//             </IconButton>
//           </Box>
//         );
//       },
//     },
//   ];

//   // Row

//   return (
//     <Paper
//       elevation={8}
//       variant="outlined"
//       sx={{
//         border: 1,
//         borderColor: "grey.500",
//         marginLeft: "10px",
//         marginRight: "10px",
//         marginTop: "10px",
//         marginBottom: "60px",
//         padding: 1,
//       }}
//     >
//       <Box
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           paddingTop: "10px",
//           // backgroundColor:'#0E4C92'
//           // backgroundColor:'		#0F52BA'
//           // backgroundColor:'		#0F52BA'
//           background:
//             "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
//         }}
//       >
//         <h2>
//           <FormattedLabel id="petAnimals" />
//         </h2>
//       </Box>

//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmitForm)}>
//           {isOpenCollapse && (
//             <Slide
//               direction="down"
//               in={slideChecked}
//               mountOnEnter
//               unmountOnExit
//             >
//               <Grid container>
//                 <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

//                 <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
//                   <TextField
//                     label={<FormattedLabel id="name" />}
//                     id="standard-basic"
//                     variant="standard"
//                     {...register("name")}
//                     error={!!errors.name}
//                     InputProps={{ style: { fontSize: 18 } }}
//                     InputLabelProps={{
//                       style: { fontSize: 15 },
//                       //true
//                       shrink:
//                         (watch("name") ? true : false) ||
//                         (router.query.name ? true : false),
//                     }}
//                     helperText={
//                       // errors?.studentName ? errors.studentName.message : null
//                       errors?.name ? "Book Classification is Required !!!" : null
//                     }
//                   />
//                 </Grid>

//                 <Grid
//                   container
//                   spacing={5}
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     paddingTop: "10px",
//                     marginTop: "20px",
//                   }}
//                 >
//                   <Grid item>
//                     <Button
//                       sx={{ marginRight: 8 }}
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       endIcon={<SaveIcon />}
//                     >
//                       {btnSaveText === "Update" ? (
//                         <FormattedLabel id="update" />
//                       ) : (
//                         <FormattedLabel id="save" />
//                       )}
//                     </Button>
//                   </Grid>
//                   <Grid item>
//                     <Button
//                       sx={{ marginRight: 8 }}
//                       variant="contained"
//                       color="primary"
//                       endIcon={<ClearIcon />}
//                       onClick={() => cancellButton()}
//                     >
//                       <FormattedLabel id="clear" />
//                     </Button>
//                   </Grid>
//                   <Grid item>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       endIcon={<ExitToAppIcon />}
//                       onClick={() => exitButton()}
//                     >
//                       <FormattedLabel id="exit" />
//                     </Button>
//                   </Grid>
//                 </Grid>
//                 {/* </div> */}
//               </Grid>
//             </Slide>
//           )}
//         </form>
//       </FormProvider>

//       <div className={styles.addbtn}>
//         <Button
//           variant="contained"
//           endIcon={<AddIcon />}
//           // type='primary'
//           disabled={buttonInputState}
//           onClick={() => {
//             reset({
//               ...resetValuesExit,
//             });
//             setEditButtonInputState(true);
//             setDeleteButtonState(true);
//             setBtnSaveText("Save");
//             setButtonInputState(true);
//             setSlideChecked(true);
//             setIsOpenCollapse(!isOpenCollapse);
//           }}
//         >
//           <FormattedLabel id="add" />
//         </Button>
//       </div>

//       <DataGrid
//         // disableColumnFilter
//         // disableColumnSelector
//         // disableToolbarButton
//         // disableDensitySelector
//         components={{ Toolbar: GridToolbar }}
//         componentsProps={{
//           toolbar: {
//             showQuickFilter: true,
//             quickFilterProps: { debounceMs: 500 },
//             // printOptions: { disableToolbarButton: true },
//             // disableExport: true,
//             // disableToolbarButton: true,
//             // csvOptions: { disableToolbarButton: true },
//           },
//         }}
//         autoHeight
//         sx={{
//           // marginLeft: 5,
//           // marginRight: 5,
//           // marginTop: 5,
//           // marginBottom: 5,

//           overflowY: "scroll",

//           "& .MuiDataGrid-virtualScrollerContent": {},
//           "& .MuiDataGrid-columnHeadersInner": {
//             backgroundColor: "#556CD6",
//             color: "white",
//           },

//           "& .MuiDataGrid-cell:hover": {
//             color: "primary.main",
//           },
//         }}
//         // rows={dataSource}
//         // columns={columns}
//         // pageSize={5}
//         // rowsPerPageOptions={[5]}
//         //checkboxSelection

//         density="compact"
//         // autoHeight={true}
//         // rowHeight={50}
//         pagination
//         paginationMode="server"
//         // loading={data.loading}
//         rowCount={data.totalRows}
//         rowsPerPageOptions={data.rowsPerPageOptions}
//         page={data.page}
//         pageSize={data.pageSize}
//         rows={data.rows}
//         columns={columns}
//         onPageChange={(_data) => {
//           getPetAnimals(data.pageSize, _data);
//         }}
//         onPageSizeChange={(_data) => {
//           console.log("222", _data);
//           // updateData("page", 1);
//           getPetAnimals(_data, data.page);
//         }}
//       />
//     </Paper>
//   );
// };

// export default Index;

import React, { useEffect, useState } from 'react'
import router from 'next/router'
import Head from 'next/head'
import styles from '../vetMasters.module.css'

import URLs from '../../../../URLS/urls'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { Paper, Button, TextField, IconButton, Slide } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { Add, Clear, Delete, Edit, ExitToApp, Save } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import sweetAlert from 'sweetalert'

const Index = () => {
  const [table, setTable] = useState([])
  const [runAgain, setRunAgain] = useState(false)
  const [collapse, setCollapse] = useState(false)

  let petSchema = yup.object().shape({
    nameEn: yup.string().required('Please enter pet animal name in english'),
    nameMr: yup.string().required('Please enter pet animal name in marathi'),
  })

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(petSchema),
  })

  useEffect(() => {
    setRunAgain(false)

    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setTable(
        res.data.mstPetAnimalList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          nameEn: j.nameEn,
          nameMr: j.nameMr,
        }))
      )
    })
  }, [runAgain])

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
          .delete(`${URLs.VMS}/mstPetAnimal/delete/${deleteId}`)
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

      field: 'nameEn',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petAnimalEn' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'nameMr',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petAnimalMr' />,
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
                  nameEn: params.row.nameEn,
                  nameMr: params.row.nameMr,
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
      .post(`${URLs.VMS}/mstPetAnimal/save`, { ...data, activeFlag: 'Y' })
      .then((res) => {
        if (data.id) {
          sweetAlert('Updated!', 'Animal data updated successfully!', 'success')
        } else {
          sweetAlert('Success!', 'Animal data saved successfully!', 'success')
        }
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
          <FormattedLabel id='petAnimal' />
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
              <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='petAnimalEn' />}
                variant='standard'
                {...register('nameEn')}
                error={!!error.nameEn}
                helperText={error?.nameEn ? error.nameEn.message : null}
              />
              <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='petAnimalMr' />}
                variant='standard'
                {...register('nameMr')}
                error={!!error.nameMr}
                helperText={error?.nameMr ? error.nameMr.message : null}
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
                    nameEn: null,
                    nameMr: null,
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
