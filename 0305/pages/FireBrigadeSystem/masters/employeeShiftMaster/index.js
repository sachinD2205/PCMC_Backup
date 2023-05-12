import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import Multiselect from "multiselect-react-dropdown";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import schema from "../../../../containers/schema/fireBrigadeSystem/employeeShiftMaster";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const router = useRouter();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  // const [op, setOption] = useState([]);
  const [demo, setDemo] = useState([]);

  // let abc = userLst.map((user) => {
  //   user.firstNameEn &&
  //     user.firstNameEn + " " + user.middleName &&
  //     user.middleName + " " + user.lastName &&
  //     user.lastName;
  // });

  // console.log("abc", abc);

  useEffect(() => {
    getUser();
    getData();
  }, [fetchData]);

  useEffect(() => {
    getUser();
    getDesg();
  }, []);

  // Get Table - Data
  const getData = () => {
    axios
      .get(`${urls.FbsURL}/employeeShiftMaster/getEmployeeShiftMasterData`)
      .then((res) => {
        // multiselect option
        // const getoption = [];
        // for (let i = 0; i < res.data.length; i++) {
        //   name;
        //   getoption.push(res.data[i].nameOfOtherEmployee);
        // }
        // setOption(getoption);
        // option end..

        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            shiftName: r.shiftName,
            // shiftStartTime: r.shiftStartTime,
            // shiftEndTime: r.shiftEndTime,
            shiftStartTime: moment(r.shiftStartTime, "hh:mm a").format(
              "hh:mm a"
            ),
            shiftEndTime: moment(r.shiftEndTime, "hh:mm a").format("hh:mm a"),
            nameOfCFO: r.nameOfCFO,
            nameOfSFO: r.nameOfSFO,
            nameOfOtherEmployee: r.nameOfOtherEmployee,
          }))
        );
      });
  };

  const [des, setDes] = useState();

  // Get desg
  const getDesg = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`)
      .then((res) => {
        console.log("res.data", res.data?.designation);
        setDes(res?.data?.designation);
      })
      .catch((err) => console.log(err));
  };

  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((res) => {
        console.log("res.data", res?.data?.user);
        setUserLst(res?.data?.user);
      })
      .catch((err) => console.log(err));
  };

  const onSubmitForm = (fromData) => {
    let newBody = {
      ...fromData,
      shiftStartTime: moment(fromData.shiftStartTime).format("HH:mm:ss"),
      shiftEndTime: moment(fromData.shiftEndTime).format("HH:mm:ss"),
    };
    console.log("Form Data ", fromData, newBody);
    const tempData = axios
      .post(
        `${urls.FbsURL}/employeeShiftMaster/saveEmployeeShiftMaster`,
        newBody
      )
      .then((res) => {
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((err) => console.log(err));
  };

  // Delete By ID
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios
          .delete(
            `${urls.FbsURL}/employeeShiftMaster/discardEmployeeShiftMaster/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    shiftName: "",
    shiftStartTime: "",
    shiftEndTime: "",
    nameOfCFO: "",
    nameOfSFO: "",
    nameOfOtherEmployee: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    shiftName: "",
    shiftStartTime: "",
    shiftEndTime: "",
    nameOfCFO: "",
    nameOfSFO: "",
    nameOfOtherEmployee: "",
  };

  const columns = [
    {
      field: "shiftName",
      headerName: <FormattedLabel id="shiftName" />,
      flex: 1,
    },
    {
      field: "shiftStartTime",
      headerName: <FormattedLabel id="shiftStartTime" />,
      flex: 1,
    },
    {
      field: "shiftEndTime",
      headerName: <FormattedLabel id="shiftEndTime" />,
      flex: 1,
    },
    {
      field: "nameOfCFO",
      headerName: <FormattedLabel id="nameOfCFO" />,
      flex: 1,
    },
    {
      field: "nameOfSFO",
      headerName: <FormattedLabel id="nameOfSFO" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              className={styles.edit}
              disabled={editButtonInputState}
              onClick={() => {
                setIsOpenCollapse(false),
                  setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className={styles.delete}
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // Row

  return (
    // <Paper
    //   sx={{
    //     marginLeft: 5,
    //     marginRight: 5,
    //     marginTop: 5,
    //     marginBottom: 5,
    //     paddingBottom: 5,
    //     paddingTop: 2,
    //   }}
    //   elevation={5}
    // >
    //   {isOpenCollapse && (
    //     <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
    //       <div>
    //         <FormProvider {...methods}>
    //           <form onSubmit={handleSubmit(onSubmitForm)}>
    //             <div className={styles.small}>
    //               <div className={styles.row}>
    //                 <div>
    //                   <TextField
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     label={<FormattedLabel id="shiftName" />}
    //                     variant="standard"
    //                     {...register("shiftName")}
    //                     error={!!errors.shiftName}
    //                     helperText={
    //                       errors?.shiftName ? errors.shiftName.message : null
    //                     }
    //                   />
    //                 </div>
    //                 {/* <div>
    //                   <FormControl
    //                     style={{ marginTop: 10 }}
    //                     error={!!errors.shiftStartTime}
    //                   >
    //                     <Controller
    //                       control={control}
    //                       name="shiftStartTime"
    //                       defaultValue={null}
    //                       render={({ field }) => (
    //                         <LocalizationProvider dateAdapter={AdapterMoment}>
    //                           <DatePicker
    //                             required
    //                             inputFormat="DD/MM/YYYY"
    //                             label={
    //                               <span style={{ fontSize: 16 }}>
    //                                 Shift Start Time
    //                               </span>
    //                             }
    //                             value={field.value}
    //                             onChange={(date) => field.onChange(date)}
    //                             selected={field.value}
    //                             center
    //                             renderInput={(params) => (
    //                               <TextField
    //                                 {...params}
    //                                 size="row"
    //                                 fullWidth
    //                                 InputLabelProps={{
    //                                   style: {
    //                                     fontSize: 12,
    //                                     marginTop: 3,
    //                                   },
    //                                 }}
    //                               />
    //                             )}
    //                           />
    //                         </LocalizationProvider>
    //                       )}
    //                     />
    //                     <FormHelperText>
    //                       {errors?.shiftStartTime
    //                         ? errors.shiftStartTime.message
    //                         : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                 </div> */}
    //                 <div>
    //                   <FormControl
    //                     style={{ marginTop: 10 }}
    //                     error={!!errors.shiftStartTime}
    //                   >
    //                     <Controller
    //                       control={control}
    //                       name="shiftStartTime"
    //                       render={({ field }) => (
    //                         <LocalizationProvider dateAdapter={AdapterMoment}>
    //                           <TimePicker
    //                             label={<FormattedLabel id="shiftStartTime" />}
    //                             value={field.value}
    //                             onChange={(time) => field.onChange(time)}
    //                             selected={field.value}
    //                             renderInput={(params) => (
    //                               <TextField {...params} />
    //                             )}
    //                           />
    //                         </LocalizationProvider>
    //                       )}
    //                     />
    //                     <FormHelperText>
    //                       {errors?.shiftStartTime
    //                         ? errors.shiftStartTime.message
    //                         : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                   ;
    //                 </div>
    //                 <div>
    //                   <FormControl
    //                     style={{ marginTop: 10 }}
    //                     error={!!errors.shiftEndTime}
    //                   >
    //                     <Controller
    //                       control={control}
    //                       name="shiftEndTime"
    //                       render={({ field }) => (
    //                         <LocalizationProvider dateAdapter={AdapterMoment}>
    //                           <TimePicker
    //                             label={<FormattedLabel id="shiftEndTime" />}
    //                             value={field.value}
    //                             onChange={(time) => field.onChange(time)}
    //                             selected={field.value}
    //                             renderInput={(params) => (
    //                               <TextField {...params} />
    //                             )}
    //                           />
    //                         </LocalizationProvider>
    //                       )}
    //                     />
    //                     <FormHelperText>
    //                       {errors?.shiftEndTime
    //                         ? errors.shiftEndTime.message
    //                         : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                   ;
    //                 </div>
    //                 {/* <div>
    //                   <FormControl
    //                     style={{ marginTop: 10 }}
    //                     error={!!errors.dateAndTimeOfVardi}
    //                   >
    //                     <Controller
    //                       control={control}
    //                       name="shiftStartTime"
    //                       defaultValue={null}
    //                       render={({ field }) => (
    //                         <LocalizationProvider dateAdapter={AdapterMoment}>
    //                           <DateTimePicker
    //                             renderInput={(props) => (
    //                               <TextField {...props} />
    //                             )}
    //                             // label={<FormattedLabel id="shiftStartTime" />}
    //                             label="shiftStartTime"
    //                             value={field.value}
    //                             onChange={(date) =>
    //                               field.onChange(
    //                                 moment(date).format("YYYY-MM-DDThh:mm:ss")
    //                               )
    //                             }
    //                           />
    //                         </LocalizationProvider>
    //                       )}
    //                     />

    //                     <FormHelperText>
    //                       {errors?.dateAndTimeOfVardi
    //                         ? errors.dateAndTimeOfVardi.message
    //                         : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                 </div> */}
    //                 {/* <div>
    //                   <FormControl
    //                     style={{ marginTop: 10 }}
    //                     error={!!errors.shiftStartTime}
    //                   >
    //                     <Controller
    //                       control={control}
    //                       name="shiftEndTime"
    //                       defaultValue={null}
    //                       render={({ field }) => (
    //                         <LocalizationProvider dateAdapter={AdapterMoment}>
    //                           <DatePicker
    //                             required
    //                             inputFormat="DD/MM/YYYY"
    //                             label={
    //                               <span style={{ fontSize: 16 }}>
    //                                 Shift End Time
    //                               </span>
    //                             }
    //                             value={field.value}
    //                             onChange={(date) => field.onChange(date)}
    //                             selected={field.value}
    //                             center
    //                             renderInput={(params) => (
    //                               <TextField
    //                                 {...params}
    //                                 size="row"
    //                                 fullWidth
    //                                 InputLabelProps={{
    //                                   style: {
    //                                     fontSize: 12,
    //                                     marginTop: 3,
    //                                   },
    //                                 }}
    //                               />
    //                             )}
    //                           />
    //                         </LocalizationProvider>
    //                       )}
    //                     />
    //                     <FormHelperText>
    //                       {errors?.shiftEndTime
    //                         ? errors.shiftEndTime.message
    //                         : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                 </div> */}
    //               </div>
    //               <div className={styles.row}>
    //                 <div>
    //                   <FormControl
    //                     variant="standard"
    //                     sx={{ m: 1, minWidth: 120 }}
    //                     error={!!errors.crPincode}
    //                   >
    //                     {/* <label>Officer Name to Release Vehicle</label><br/> */}
    //                     <InputLabel id="demo-simple-select-standard-label">
    //                       {<FormattedLabel id="nameOfCFO" />}
    //                     </InputLabel>
    //                     <Controller
    //                       render={({ field }) => (
    //                         <Select
    //                           sx={{ width: 250 }}
    //                           value={field.value}
    //                           onChange={(value) => field.onChange(value)}
    //                           label={<FormattedLabel id="nameOfCFO" />}
    //                         >
    //                           {userLst &&
    //                             userLst
    //                               .filter((u) => u.desg === "CFO")
    //                               .map((user, index) => (
    //                                 <MenuItem key={index} value={user.id}>
    //                                   {user.firstNameEn +
    //                                     " " +
    //                                     (typeof user.middleName === "string"
    //                                       ? user.middleName
    //                                       : " ") +
    //                                     " " +
    //                                     user.lastName}
    //                                 </MenuItem>
    //                               ))}
    //                         </Select>
    //                       )}
    //                       name="nameOfCFO"
    //                       control={control}
    //                       defaultValue=""
    //                     />
    //                     <FormHelperText
    //                       style={errors?.nameOfCFO ? { color: "red" } : {}}
    //                     >
    //                       {errors?.nameOfCFO ? errors.nameOfCFO.message : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                 </div>

    //                 <div>
    //                   <FormControl
    //                     variant="standard"
    //                     sx={{ m: 1, minWidth: 120 }}
    //                     error={!!errors.crPincode}
    //                   >
    //                     {/* <label>Officer Name to Release Vehicle</label><br/> */}
    //                     <InputLabel id="demo-simple-select-standard-label">
    //                       {<FormattedLabel id="nameOfSFO" />}
    //                     </InputLabel>
    //                     <Controller
    //                       render={({ field }) => (
    //                         <Select
    //                           sx={{ width: 250 }}
    //                           value={field.value}
    //                           onChange={(value) => field.onChange(value)}
    //                           label={<FormattedLabel id="nameOfSFO" />}
    //                         >
    //                           {userLst &&
    //                             userLst
    //                               .filter((u) => u.desg === "SFO")
    //                               .map((user, index) => (
    //                                 <MenuItem key={index} value={user.id}>
    //                                   {user.firstNameEn +
    //                                     " " +
    //                                     (typeof user.middleName === "string"
    //                                       ? user.middleName
    //                                       : " ") +
    //                                     " " +
    //                                     user.lastName}
    //                                 </MenuItem>
    //                               ))}
    //                         </Select>
    //                       )}
    //                       name="nameOfSFO"
    //                       control={control}
    //                       defaultValue=""
    //                     />
    //                     <FormHelperText
    //                       style={errors?.nameOfSFO ? { color: "red" } : {}}
    //                     >
    //                       {errors?.nameOfSFO ? errors.nameOfSFO.message : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                 </div>
    //                 {/* Multi select React Dropdown */}
    //                 <div style={{ width: 280 }}>
    //                   <p>{<FormattedLabel id="nameOfOtherEmployee" />}</p>
    //                   {console.log("111", demo)}
    //                   <Multiselect
    //                     options={userLst}
    //                     selectedValues={(w) => {
    //                       console.log("w", w);
    //                     }}
    //                     onSelect={(e) => {
    //                       console.log("e", e);
    //                     }}
    //                     displayValue="firstNameEn"

    //                     // selectedValues={(w) => {
    //                     //   console.log("ww", w);
    //                     // }}
    //                     // onChange={setDemo}
    //                     // isObject={false}
    //                     // value={demo}
    //                     // labelledBy="select"
    //                     // onRemove={(event) => {
    //                     //   console.log(event);
    //                     // }}
    //                     // onSelect={(event) => {
    //                     //   console.log("event", event);
    //                     // }}
    //                     // options={userLst}
    //                     // options={userLst.map((user) => user.firstNameEnEn)}
    //                     // options={userLst.map(
    //                     //   (user) =>
    //                     //     user.firstNameEn &&
    //                     //     user.firstNameEn + " " + user.middleName &&
    //                     //     user.middleName + " " + user.lastName &&
    //                     //     user.lastName
    //                     // )}
    //                     // showCheckbox
    //                   />
    //                   {/* <FormHelperText
    //                       style={
    //                         errors?.nameOfOtherEmployee?.message
    //                           ? {}
    //                           : { color: "red" }
    //                       }
    //                     >
    //                       {errors?.nameOfOtherEmployee
    //                         ? errors.nameOfOtherEmployee.message
    //                         : null}
    //                     </FormHelperText> */}
    //                 </div>
    //               </div>
    //             </div>

    //             <div className={styles.btn}>
    //               <Button
    //                 sx={{ marginRight: 8 }}
    //                 type="submit"
    //                 variant="contained"
    //                 color="success"
    //                 endIcon={<SaveIcon />}
    //               >
    //                 {/* {btnSaveText} */}
    //                 {btnSaveText === "Update" ? (
    //                   <FormattedLabel id="update" />
    //                 ) : (
    //                   <FormattedLabel id="save" />
    //                 )}
    //               </Button>{" "}
    //               <Button
    //                 sx={{ marginRight: 8 }}
    //                 variant="contained"
    //                 color="primary"
    //                 endIcon={<ClearIcon />}
    //                 onClick={() => cancellButton()}
    //               >
    //                 <FormattedLabel id="clear" />
    //               </Button>
    //               <Button
    //                 variant="contained"
    //                 color="error"
    //                 endIcon={<ExitToAppIcon />}
    //                 onClick={() =>
    //                   router.push({
    //                     pathname: "/FireBrigadeSystem/masters",
    //                   })
    //                 }
    //               >
    //                 <FormattedLabel id="exit" />
    //               </Button>
    //             </div>
    //           </form>
    //         </FormProvider>
    //       </div>
    //     </Slide>
    //   )}

    //   <div className={styles.addbtn}>
    //     <Button
    //       variant="contained"
    //       endIcon={<AddIcon />}
    //       type="primary"
    //       disabled={buttonInputState}
    //       onClick={() => {
    //         reset({
    //           ...resetValuesExit,
    //         });
    //         setEditButtonInputState(true);
    //         setDeleteButtonState(true);
    //         setBtnSaveText("Save");
    //         setButtonInputState(true);
    //         setSlideChecked(true);
    //         setIsOpenCollapse(!isOpenCollapse);
    //       }}
    //     >
    //       <FormattedLabel id="add" />
    //     </Button>
    //   </div>
    //   <DataGrid
    //     autoHeight
    //     sx={{
    //       marginLeft: 5,
    //       marginRight: 5,
    //       marginTop: 5,
    //       marginBottom: 5,
    //     }}
    //     rows={dataSource}
    //     columns={columns}
    //     pageSize={5}
    //     rowsPerPageOptions={[5]}
    //   />
    // </Paper>
    <>
      {isOpenCollapse && (
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box
                  style={{
                    margin: "4%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingBottom: "20%",
                  }}
                >
                  <Paper
                    sx={{
                      margin: 1,
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {btnSaveText == "Update" ? (
                          <FormattedLabel id="updateEmp" />
                        ) : (
                          <FormattedLabel id="addEmp" />
                        )}
                      </Box>
                    </Box>
                    <br />
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="shiftName" />}
                          variant="standard"
                          {...register("shiftName")}
                          error={!!errors.shiftName}
                          helperText={
                            errors?.shiftName ? errors.shiftName.message : null
                          }
                        />
                      </Grid>
                      {/* <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.shiftStartTime}
                          sx={{ width: "70%" }}
                        >
                          <Controller
                            control={control}
                            name="shiftStartTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  required
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Shift Start Time
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
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
                          <FormHelperText>
                            {errors?.shiftStartTime
                              ? errors.shiftStartTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}
                      {/* <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.shiftStartTime}
                          sx={{ width: "70%" }}
                        >
                          <Controller
                            control={control}
                            name="shiftStartTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  required
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Shift Start Time
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
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
                          <FormHelperText>
                            {errors?.shiftStartTime
                              ? errors.shiftStartTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "70%" }}
                          error={!!errors.shiftStartTime}
                        >
                          <Controller
                            control={control}
                            name="shiftStartTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={<FormattedLabel id="shiftStartTime" />}
                                  value={field.value}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
                                  renderInput={(params) => (
                                    <TextField size="small" {...params} />
                                  )}
                                  defaultValue={null}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.shiftStartTime
                              ? errors.shiftStartTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "70%" }}
                          error={!!errors.shiftEndTime}
                        >
                          <Controller
                            control={control}
                            name="shiftEndTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={<FormattedLabel id="shiftEndTime" />}
                                  value={field.value}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
                                  renderInput={(params) => (
                                    <TextField size="small" {...params} />
                                  )}
                                  defaultValue={null}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.shiftEndTime
                              ? errors.shiftEndTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="shiftNameMr" />}
                          variant="standard"
                          {...register("shiftNameMr")}
                          error={!!errors.shiftNameMr}
                          helperText={
                            errors?.shiftNameMr
                              ? errors.shiftNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "70%" }}
                          variant="standard"
                          error={!!errors.crPincode}
                        >
                          {/* <label>Officer Name to Release Vehicle</label><br/> */}
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="nameOfCFO" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="nameOfCFO" />}
                              >
                                {/* {des &&
                                  des.map((d) => (
                                    <MenuItem key={index} value={d.id}>
                                      {d.designation}
                                    </MenuItem>
                                  ))} */}

                                {userLst &&
                                  userLst
                                    .filter((u) => u.id === "13")
                                    .map((user, index) => (
                                      <MenuItem key={index} value={user.id}>
                                        {user.firstNameEnEn +
                                          " " +
                                          (typeof user.middleNameEn === "string"
                                            ? user.middleNameEn
                                            : " ") +
                                          " " +
                                          user.lastNameEn}
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name="nameOfCFO"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText
                            style={errors?.nameOfCFO ? { color: "red" } : {}}
                          >
                            {errors?.nameOfCFO
                              ? errors.nameOfCFO.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "75%" }}
                          error={!!errors.crPincode}
                        >
                          {/* <label>Officer Name to Release Vehicle</label><br/> */}
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="nameOfSFO" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="nameOfSFO" />}
                              >
                                {/* {userLst &&
                                  userLst
                                    .filter((u) => u.desg === "SFO")
                                    .map((user, index) => (
                                      <MenuItem
                                        // size="small"
                                        key={index}
                                        value={user.id}
                                      >
                                        {user.firstNameEn +
                                          " " +
                                          (typeof user.middleName === "string"
                                            ? user.middleName
                                            : " ") +
                                          " " +
                                          user.lastName}
                                      </MenuItem>
                                    ))} */}
                              </Select>
                            )}
                            name="nameOfSFO"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText
                            style={errors?.nameOfSFO ? { color: "red" } : {}}
                          >
                            {errors?.nameOfSFO
                              ? errors.nameOfSFO.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      // className={styles.feildres}
                    >
                      <Grid item xs={4} sx={{ paddingLeft: "5%" }}>
                        <h4>{<FormattedLabel id="nameOfOtherEmployee" />}</h4>

                        {/* <Multiselect
                          // options={userLst}
                          selectedValues={(w) => {
                            console.log("w", w);
                          }}
                          onSelect={(e) => {
                            console.log("e", e);
                          }}
                          // displayValue="firstNameEn"
                          // selectedValues={(w) => {
                          //   console.log("ww", w);
                          // }}
                          // onChange={setDemo}
                          // isObject={false}
                          // value={demo}
                          // labelledBy="select"
                          // onRemove={(event) => {
                          //   console.log(event);
                          // }}
                          // onSelect={(event) => {
                          //   console.log("event", event);
                          // }}
                          // options={userLst}
                          // options={userLst.map((user) => user.firstNameEn)}
                          options={userLst.map(
                            (user) =>
                              user.firstNameEnEn &&
                              user.firstNameEnEn + " " + user.middleNameEn &&
                              user.middleNameEn + " " + user.lastNameEn &&
                              user.lastNameEn
                          )}
                          showCheckbox
                        /> */}
                        {/* <FormHelperText
                           style={
                             errors?.nameOfOtherEmployee?.message
                               ? {}
                          : { color: "red" }
                      }
                    >
                      {errors?.nameOfOtherEmployee
                            ? errors.nameOfOtherEmployee.message
                            : null}
                      </FormHelperText>  */}
                      </Grid>
                    </Grid>

                    <br />
                    <br />
                    <br />
                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        <Button
                          type="submit"
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() =>
                            router.push({
                              pathname:
                                "/FireBrigadeSystem/masters/employeeShiftMaster",
                            })
                          }
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </form>
            </FormProvider>
          </div>
        </Slide>
      )}

      <Box style={{ display: "flex", marginTop: "5%" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="employeeShiftMasterTitle" />}
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
            className={styles.adbtn}
            sx={{
              borderRadius: 100,

              padding: 2,
              marginLeft: 1,
              textAlign: "center",
              border: "2px solid #3498DB",
            }}
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>

      <Box>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          disableExport
          // disableToolbarButton
          // disableDensitySelector
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              csvOptions: { disableToolbarButton: true },
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            paddingLeft: "2%",
            paddingRight: "2%",
            // width: "60%",
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              // transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box>
    </>
  );
};

export default Index;
