import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
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
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
// import styles from "../../../styles/[cfcCenter].module.css";
// import styles from '../../../styles/[cfcCenter].module.css'
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";

const Index = () => {
  let schema = yup.object().shape({
    // wardId: yup.string().nullable().required(" wardId is Required !!"),
    // zoneId: yup.string().nullable().required(" ZoneId is Required !!"),
    // cfcName: yup.string().required(" Cfc Name is Required !!"),
    // cfcOwnerName: yup.string().required(" Cfc Owner Name is Required !!"),
    // cfcAddress: yup.string().required(" Cfc Address is Required !!"),
    // cfcGisID: yup.string().required(" Cfc GIS ID is Required !!"),
    // cfcGstinNo: yup.string().required(" CFC GSTIN No is Required !!"),
    // cfcOwnerAadharNo: yup
    //   .string()
    //   .required(" Cfc Owner Aadhar No is Required wardId!!"),
    // cfcOwnerPanNo: yup.string().required(" Cfc Owner Pan No is Required !!"),
    // licenseNo: yup.string().required(" License No is Required !!"),
    // walletId: yup.string().required(" Wallet Id is Required !!"),
    // BankName: yup.string().required(" Bank Name is Required !!"),
    // accountNumber: yup.string().required(" Account Number is Required !!"),
    // branchNumber: yup.string().required(" Branch Number is Required !!"),
    // branchAddress: yup.string().required(" Branch Address is Required !!"),
    // ifscCode: yup.string().required(" IFSC Code is Required !!"),
    // microde: yup.string().required(" MICR Code is Required !!"),
    // maximumDailyLimitForWalletRechargeRs: yup
    //   .string()
    //   .required(" Maximum Daily Limit For Wallet Recharge (Rs) is Required !!"),
    // threshholdBalanceRs: yup
    //   .string()
    //   .required(" Threshhold Balance (Rs) is Required !!"),
    // minimumBalanceRs: yup
    //   .string()
    //   .required(" Minimum Balance (Rs) is Required !!"),
    // BalanceAvailableRs: yup
    //   .string()
    //   .required(" Balance Available (Rs) is Required !!"),
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
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
  const [zones, setZones] = useState([]);
  const [wards, setWards] = useState([]);

  const language = useSelector((state) => state?.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getZone();
  }, []);

  useEffect(() => {
    getWard();
  }, []);

  useEffect(() => {
    getCfcCenterMaster();
  }, [zones, wards]);

  const getZone = () => {
    axios.get(`${urls.BaseURL}/zone/getAll`).then((r) => {
      // setZones(
      //   r.data.zone.map((row) => ({
      //     id: row.id,
      //     zone: row.zone,
      //   })),
      // );
      setZones(r.data.zone);
    });
  };

  const getWard = () => {
    axios.get(`${urls.BaseURL}/ward/getAll`).then((r) => {
      // setWards(
      //   r.data.ward.map((row) => ({
      //     id: row.id,
      //     ward: row.ward,
      //   })),
      // );
      setWards(r.data.ward);
    });
  };

  // Get Table - Data
  const getCfcCenterMaster = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        let result = res.data.cfcCenters;
        let _res = result.map((r, i) => ({
          id: r.id,
          srNo: Number(_pageNo + "0") + i + 1,
          zoneId: r.zoneId,
          wardId: r.wardId,
          cfcName: r.cfcName,
          cfcOwnerName: r.cfcOwnerName,
          cfcAddress: r.cfcAddress,
          cfcGisID: r.cfcGisID,
          cfcGstinNo: r.cfcGstinNo,
          cfcOwnerAadharNo: r.cfcOwnerAadharNo,
          cfcOwnerPanNo: r.cfcOwnerPanNo,
          licenseNo: r.licenseNo,
          walletId: r.walletId,
          BankName: r.BankName,
          branchAddress: r.branchAddress,
          accountNumber: r.accountNumber,
          branchNumber: r.branchNumber,
          ifscCode: r.ifscCode,
          microde: r.microde,
          maximumDailyLimitForWalletRechargeRs: r.maximumDailyLimitForWalletRechargeRs,
          threshholdBalanceRs: r.threshholdBalanceRs,
          minimumBalanceRs: r.minimumBalanceRs,
          BalanceAvailableRs: r.BalanceAvailableRs,
          // zoneId: zones?.find((obj) => obj?.id === r.zoneId)?.zoneId,
          // wardId: wardIds?.find((obj) => obj?.id === r.wardId)?.wardId,
          activeFlag: r.activeFlag,
        }));

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"), setID(rows.id), setIsOpenCollapse(true), setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // alert("He");
    const finalBodyForApi = {
      ...formData,
    };

    axios.post(`${urls.CFCURL}/master/cfcCenters/save`, finalBodyForApi).then((res) => {
      // console.log("Data Saved", res);

      if (res.status == 200) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getCfcCenterMaster();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: 'Delete?',
  //     text: 'Are you sure you want to delete this Record ? ',
  //     icon: 'warning',
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios
  //       .delete(`${urls.BaseURL}/master/cfcCenters/discard/${value}`)
  //       .then((res) => {
  //         if (res.status == 226) {
  //           if (willDelete) {
  //             swal('Record is Successfully Deleted!', {
  //               icon: 'success',
  //             })
  //           } else {
  //             swal('Record is Safe')
  //           }
  //           getCfcCenterMaster()
  //           setButtonInputState(false)
  //         }
  //       })
  //   })
  // }

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Deactivate?",
  //       text: "Are you sure you want to deactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/cfcCenters/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully Deactivated!", {
  //               icon: "success",
  //             });
  //             getCfcCenterMaster();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/cfcCenters/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });
  //             getCfcCenterMaster();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.CFCURL}/master/cfcCenters/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Inactivated!", {
                icon: "success",
              });
              getCfcCenterMaster();
              setButtonInputState(false);
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
          axios.post(`${urls.CFCURL}/master/cfcCenters/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });

              setButtonInputState(false);
              getCfcCenterMaster();
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
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
    zoneId: "",
    wardId: "",
    cfcName: "",
    cfcOwnerName: "",
    cfcAddress: "",
    cfcGisID: "",
    cfcGstinNo: "",
    cfcOwnerAadharNo: "",
    cfcOwnerPanNo: "",
    licenseNo: "",
    walletId: "",
    BankName: "",
    accountNumber: "",
    branchNumber: "",
    branchAddress: "",
    ifscCode: "",
    microde: "",
    maximumDailyLimitForWalletRechargeRs: "",
    threshholdBalanceRs: "",
    minimumBalanceRs: "",
    BalanceAvailableRs: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneId: "",
    wardId: "",
    cfcName: "",
    cfcOwnerName: "",
    cfcAddress: "",
    cfcGisID: "",
    cfcGstinNo: "",
    cfcOwnerAadharNo: "",
    cfcOwnerPanNo: "",
    licenseNo: "",
    walletId: "",
    BankName: "",
    accountNumber: "",
    branchNumber: "",
    branchAddress: "",
    ifscCode: "",
    microde: "",
    maximumDailyLimitForWalletRechargeRs: "",
    threshholdBalanceRs: "",
    minimumBalanceRs: "",
    BalanceAvailableRs: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      width: 5,
    },
    {
      field: "zoneId",
      headerName: "Zone ",
      width: 10,
    },
    {
      field: "wardId",
      headerName: "Ward",
      width: 7,
    },
    {
      field: "cfcGisID",
      headerName: "cfc Gis ID",
      width: 17,
    },
    {
      field: "cfcGstinNo",
      headerName: "cfcGstinNo",
      width: 17,
    },
    {
      field: "cfcName",
      headerName: "cfcName",

      width: 17,
    },
    {
      field: "cfcOwnerName",
      headerName: "cfcOwnerName",

      width: 17,
    },
    {
      field: "cfcAddress",
      headerName: "cfcAddress",

      width: 17,
    },
    {
      field: "cfcOwnerAadharNo",
      headerName: "cfcOwnerAadharNo",

      width: 17,
    },
    {
      field: "cfcOwnerPanNo",
      headerName: "cfcOwnerPanNo",

      width: 17,
    },
    {
      field: "licenseNo",
      headerName: "licenseNo",

      width: 17,
    },
    {
      field: "walletId",
      headerName: "walletId",

      width: 17,
    },
    {
      field: "BankName",
      headerName: "BankName",

      width: 17,
    },
    {
      field: "accountNumber",
      headerName: "accountNumber",

      width: 17,
    },
    {
      field: "branchNumber",
      headerName: "branchNumber",

      width: 17,
    },
    {
      field: "ifscCode",
      headerName: "ifscCode",

      width: 17,
    },
    {
      field: "microde",
      headerName: "microde",

      width: 17,
    },
    {
      field: "branchAddress",
      headerName: "Branch Address",
      // type: "number",
      width: 20,
    },

    {
      field: "maximumDailyLimitForWalletRechargeRs",
      headerName: "MLFWRR",
      // type: "number",
      width: 20,
    },
    {
      field: "threshholdBalanceRs",
      headerName: "threshholdBalanceRs",
      // type: "number",
      width: 20,
    },

    {
      field: "minimumBalanceRs",
      headerName: "minimumBalanceRs",
      // type: "number",
      width: 20,
    },

    {
      field: "BalanceAvailableRs",
      headerName: "BalanceAvailableRs",
      // type: "number",
      width: 20,
    },
    // {
    //   field: "packageNameEng",
    //   headerName: "Module",
    //   // type: "number",
    //   flex: 1,
    // },
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText('Update'),
    //               setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true)
    //             setButtonInputState(true)
    //             console.log('params.row: ', params.row)
    //             reset(params.row)
    //           }}
    //         >
    //           <EditIcon />
    //         </IconButton>
    //         <IconButton
    //           disabled={deleteButtonInputState}
    //           onClick={() => deleteById(params.id)}
    //         >
    //           <DeleteIcon />
    //         </IconButton>
    //       </>
    //     )
    //   },
    // },

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
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  // setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
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
        Cfc Center
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Cfc Name"
                          variant="standard"
                          {...register("cfcName")}
                          error={!!errors.cfcName}
                          helperText={errors?.cfcName ? errors.cfcName.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Cfc Owner Name"
                          variant="standard"
                          {...register("cfcOwnerName")}
                          error={!!errors.cfcOwnerName}
                          helperText={errors?.cfcOwnerName ? errors.cfcOwnerName.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Cfc Address*"
                          variant="standard"
                          {...register("cfcAddress")}
                          error={!!errors.cfcAddress}
                          helperText={errors?.cfcAddress ? errors.cfcAddress.message : null}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          // sx={{ minWidth: 120 }}
                          error={!!errors.zoneId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">Zone name</InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Zone Name"
                              >
                                {zones &&
                                  zones.map((zone, index) => {
                                    return (
                                      <MenuItem key={index} value={zone.id}>
                                        {language == "en" ? zone.zoneName : zone.zoneNameMr}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="zoneId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>{errors?.zoneId ? errors.module.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          // sx={{ marginTop: 3 }}
                          error={!!errors.wardId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">Ward Name</InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Ward Name"
                              >
                                {wards &&
                                  wards.map((ward, index) => {
                                    return (
                                      <MenuItem key={index} value={ward.id}>
                                        {language == "en" ? ward.wardName : ward.wardNameMr}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="wardId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>{errors?.wardId ? errors.module.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Cfc Gis ID*"
                          variant="standard"
                          {...register("cfcGisID")}
                          error={!!errors.cfcGisID}
                          helperText={errors?.cfcGisID ? errors.cfcGisID.message : null}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="CFC GSTIN No*"
                          variant="standard"
                          {...register("cfcGstinNo")}
                          error={!!errors.cfcGstinNo}
                          helperText={errors?.cfcGstinNo ? errors.cfcGstinNo.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Cfc Owner Aadhar No*"
                          variant="standard"
                          {...register("cfcOwnerAadharNo")}
                          error={!!errors.cfcOwnerAadharNo}
                          helperText={errors?.cfcOwnerAadharNo ? errors.cfcOwnerAadharNo.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Cfc Owner Pan No*"
                          variant="standard"
                          {...register("cfcOwnerPanNo")}
                          error={!!errors.cfcOwnerPanNo}
                          helperText={errors?.cfcOwnerPanNo ? errors.cfcOwnerPanNo.message : null}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="License No*"
                          variant="standard"
                          {...register("licenseNo")}
                          error={!!errors.licenseNo}
                          helperText={errors?.licenseNo ? errors.licenseNo.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Wallet Id*"
                          variant="standard"
                          {...register("walletId")}
                          error={!!errors.walletId}
                          helperText={errors?.walletId ? errors.walletId.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Bank Name*"
                          variant="standard"
                          {...register("BankName")}
                          error={!!errors.BankName}
                          helperText={errors?.BankName ? errors.BankName.message : null}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Account Number*"
                          variant="standard"
                          {...register("accountNumber")}
                          error={!!errors.accountNumber}
                          helperText={errors?.accountNumber ? errors.accountNumber.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Branch Number*"
                          variant="standard"
                          {...register("branchNumber")}
                          error={!!errors.branchNumber}
                          helperText={errors?.branchNumber ? errors.branchNumber.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Branch Address*"
                          variant="standard"
                          {...register("branchAddress")}
                          error={!!errors.branchAddress}
                          helperText={errors?.branchAddress ? errors.branchAddress.message : null}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Ifsc Code*"
                          variant="standard"
                          {...register("ifscCode")}
                          error={!!errors.ifscCode}
                          helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Micr Code*"
                          variant="standard"
                          {...register("microde")}
                          error={!!errors.microde}
                          helperText={errors?.microde ? errors.microde.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Maximum Daily Limit For Wallet Recharge (Rs)*"
                          variant="standard"
                          {...register("maximumDailyLimitForWalletRechargeRs")}
                          error={!!errors.maximumDailyLimitForWalletRechargeRs}
                          helperText={
                            errors?.maximumDailyLimitForWalletRechargeRs
                              ? errors.maximumDailyLimitForWalletRechargeRs.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="threshhold Balance (Rs)*"
                          variant="standard"
                          {...register("threshholdBalanceRs")}
                          error={!!errors.threshholdBalanceRs}
                          helperText={errors?.threshholdBalanceRs ? errors.threshholdBalanceRs.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Minimum Balance (Rs)*"
                          variant="standard"
                          {...register("minimumBalanceRs")}
                          error={!!errors.minimumBalanceRs}
                          helperText={errors?.minimumBalanceRs ? errors.minimumBalanceRs.message : null}
                        />
                      </Grid>
                      <Grid
                        xs={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Balance Available (Rs)*"
                          variant="standard"
                          {...register("BalanceAvailableRs")}
                          error={!!errors.BalanceAvailableRs}
                          helperText={errors?.BalanceAvailableRs ? errors.BalanceAvailableRs.message : null}
                        />
                      </Grid>
                    </Grid>

                    {/* <div className={styles.buttons}> */}
                    <div>
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        Exit
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        {/* <div className={styles.addbtn}> */}
        <div>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
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
          >
            Add{" "}
          </Button>
        </div>

        {/* 
        <DataGrid
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
          density="compact"
          autoHeight={true}
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
            getCfcCenterMaster(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getCfcCenterMaster(_data, data.page);
          }}
        /> */}

        <Box style={{ overflowX: "scroll", display: "flex" }}>
          <DataGrid
            sx={{
              backgroundColor: "white",
              // overflowY: "scroll",

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
            autoHeight={true}
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
              getCfcCenterMaster(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getCfcCenterMaster(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
