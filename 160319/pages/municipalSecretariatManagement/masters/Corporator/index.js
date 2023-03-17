import { yupResolver } from "@hookform/resolvers/yup"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import PreviewIcon from "@mui/icons-material/Preview"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  Card,
  Grid,
  InputLabel,
  Select,
  FormControlLabel,
  Tooltip,
  MenuItem,
  Checkbox,
} from "@mui/material"
// import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { message } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import BasicLayout from "../../../../containers/Layout/BasicLayout"
import urls from "../../../../URLS/urls"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstCorporatorSchema"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import sweetAlert from "sweetalert"
import { LeftOutlined } from "@ant-design/icons"
import { styled, useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Drawer from "@mui/material/Drawer"

let drawerWidth

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
  })
)
// const [flag, setFlag] = useState(null);
//     useEffect(() => {
//       console.log("flag",flag)
//   }, [flag])

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
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onChange",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [wardNames, setwardNames] = useState([])

  const getwardNames = () => {
    axios.get(`${urls.BaseURL}/ward/getAll`).then((r) => {
      setwardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        }))
      )
    })
  }

  const [ewardNames, setewardNames] = useState([])

  // const getewardNames = () => {
  //   axios
  //     .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
  //     .then((r) => {
  //       setewardNames(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           ewardName: row.ewardName,
  //         })),
  //       );
  //     });
  // };

  const getewardNames = () => {
    //by ANWAR ANSARI
    axios.get(`${urls.MSURL}/mstElectoral/getAll`).then((r) => {
      setewardNames(
        r.data.electoral.map((row) => ({
          id: row.id,
          ewardName: row.electoralWardName,
        }))
      )
    })
  }

  const [casts, setCasts] = useState([])

  // getCasts
  const getCasts = () => {
    axios.get(`${urls.BaseURL}/cast/getAll`).then((r) => {
      setCasts(
        r.data.mCast.map((row) => ({
          id: row.id,
          cast: row.cast,
        }))
      )
    })
  }

  const [genders, setGenders] = useState([])

  // getGenders
  const getGenders = () => {
    axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          genderEn: row.gender,
          genderMr: row.genderMr,
        }))
      )
    })
  }
  const [partyNames, setPartyNames] = useState([])

  // // getGenders
  const getPartyNames = () => {
    axios.get(`${urls.MSURL}/mstDefinePartyName/getAll`).then((r) => {
      setPartyNames(
        r.data.definePartyName.map((row) => ({
          id: row.id,
          partyName: row.partyName,
        }))
      )
    })
  }
  const [religions, setReligions] = useState([])

  // getReligion
  const getReligions = () => {
    axios.get(`${urls.BaseURL}/religion/getAll`).then((r) => {
      setReligions(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
        }))
      )
    })
  }
  const [idProofs, setIdProofs] = useState([])

  // // getReligions
  const getIdProofs = () => {
    axios.get(`${urls.MSURL}/mstDefineIdentificationProof/getAll`).then((r) => {
      console.log(r.data.identificationProof, "IDPROOF")
      setIdProofs(
        r.data.identificationProof.map((row) => ({
          id: row.id,
          idProof: row.identificationProofDocument,
        }))
      )
    })
  }

  const [bankNames, setBankNames] = useState([])

  // getCasts
  const getBankNames = () => {
    axios.get(`${urls.BaseURL}/bank/getAll`).then((r) => {
      setBankNames(
        r.data.bank.map((row) => ({
          id: row.id,
          bankName: row.bankName,
        }))
      )
    })
  }
  const [branchNames, setBranchNames] = useState([])

  // getCasts
  const getBranchNames = () => {
    axios.get(`${urls.BaseURL}/bank/getAll`).then((r) => {
      setBranchNames(
        r.data.bank.map((row) => ({
          id: row.id,
          branchName: row.branchName,
        }))
      )
    })
  }
  useEffect(() => {
    getwardNames()
    getGenders()
    getCasts()
    //  // getSubCast();
    getReligions()
    getPartyNames()
    getBankNames()
    getBranchNames()
    getIdProofs()
    getewardNames()
  }, [])

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getlicenseTypeDetails()
  }, [
    wardNames,
    branchNames,
    bankNames,
    religions,
    partyNames,
    genders,
    casts,
    ewardNames,
  ]) // by ANWAR ANSARI

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log("body", body)
    if (_activeFlag === "N") {
      swal({
        title: "Delete?",
        text: "Are you sure you want to Delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/mstDefineCorporators/save`, body)
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getlicenseTypeDetails()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    } else {
      swal({
        title: "Delete?",
        text: "Are you sure you want to Delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/mstDefineCorporators/save`, body)
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getlicenseTypeDetails()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    }
  }

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const dateOfBirth = new Date(formData.dateOfBirth).toISOString()
    const electedDate = new Date(formData.electedDate).toISOString()
    const resignDate = new Date(formData.resigndate).toISOString()
    const nominatedCorporators = formData?.nominatedCorporators.toString()
    console.log("From Date ${fromDate} ")

    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      dateOfBirth,
      electedDate,
      resignDate,
      nominatedCorporators,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(`${urls.MSURL}/mstDefineCorporators/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            setIsOpenCollapse(false)
          }
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("Put -----", finalBodyForApi)
      axios
        .post(`${urls.MSURL}/mstDefineCorporators/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
          }
        })
    }
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setIsOpenCollapse(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const [zoneNos, setzoneNos] = useState([])

  const getzoneNos = () => {
    axios
      .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
      .then((r) => {
        setzoneNos(
          r.data.map((row) => ({
            id: row.id,
            zoneNo: row.zoneNo,
          }))
        )
      })
  }

  useEffect(() => {
    getzoneNos()
  }, [])

  const [zoneNames, setzoneNames] = useState([])

  const getzoneNames = () => {
    axios
      .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
      .then((r) => {
        setzoneNames(
          r.data.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
          }))
        )
      })
  }

  useEffect(() => {
    getzoneNames()
  }, [])

  // Reset Values Cancell
  const resetValuesCancell = {
    id: "",
    nominatedCorporators: "",
    ward: "",
    electedWard: "",
    firstName: "",
    firstNameMr: "",
    middleName: "",
    middleNameMr: "",
    lastname: "",
    lastnameMr: "",
    gender: "",
    dateOfBirth: null,
    religion: "",
    caste: "",
    casteCertificateNo: "",
    party: "",
    idProofCategory: "",
    idProofNo: "",
    panNo: "",
    mobileNo: "",
    emailAddress: "",
    address: "",
    addressMr: "",
    electedDate: null,
    monthlyHonorariumAmount: "",
    resigndate: null,
    reason: "",
    reasonMr: "",
    bankName: "",
    branchName: "",
    savingAccountNo: "",
    bankIfscCode: "",
    bankMicrCode: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    id: "",
    nominatedCorporators: "",
    ward: "",
    electedWard: "",
    firstName: "",
    firstNameMr: "",
    middleName: "",
    middleNameMr: "",
    lastname: "",
    lastnameMr: "",
    gender: "",
    dateOfBirth: null,
    religion: "",
    caste: "",
    casteCertificateNo: "",
    party: "",
    idProofCategory: "",
    idProofNo: "",
    panNo: "",
    mobileNo: "",
    emailAddress: "",
    address: "",
    addressMr: "",
    electedDate: null,
    monthlyHonorariumAmount: "",
    resigndate: null,
    reason: "",
    reasonMr: "",
    bankName: "",
    branchName: "",
    savingAccountNo: "",
    bankIfscCode: "",
    bankMicrCode: "",
  }

  // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios.get(`${urls.MSURL}/mstDefineCorporators/getAll`).then((res) => {
      console.log(res.data.corporator, "______________________")
      setDataSource(
        res.data.corporator.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          nominatedCorporators: r.nominatedCorporators,
          ward: r.ward,
          ward1: wardNames?.find((obj) => obj.id === r.ward)?.wardName,
          electedWard: r.electedWard,
          firstName: r.firstName,
          firstNameMr: r.firstNameMr,
          middleName: r.middleName,
          middleNameMr: r.middleNameMr,
          lastname: r.lastname,
          lastnameMr: r.lastnameMr,
          gender: r.gender,
          gender1: genders?.find((obj) => obj.id === r.gender)?.genderEn,
          dateOfBirth: r.dateOfBirth,
          religion: r.religion,
          religion1: religions?.find((obj) => obj.id === r.religion)?.religion,
          caste: r.caste,
          caste1: casts?.find((obj) => obj.id === r.caste)?.cast,
          casteCertificateNo: r.casteCertificateNo,
          party: r.party,
          party1: partyNames?.find((obj) => obj.id === r.party)?.partyName,
          idProofCategory: r.idProofCategory,
          idProofCategory1: idProofs?.find(
            (obj) => obj.id === r.idProofCategory
          )?.idProof,
          idProofNo: r.idProofNo,
          panNo: r.panNo,
          mobileNo: r.mobileNo,
          emailAddress: r.emailAddress,
          address: r.address,
          addressMr: r.addressMr,
          electedDate: r.electedDate,
          monthlyHonorariumAmount: r.monthlyHonorariumAmount,
          resignDate: r.resignDate,
          reason: r.reason,
          reasonMr: r.reasonMr,
          bankName: r.bankName,
          bankName1: bankNames?.find((obj) => obj.id === Number(r.bankName))
            ?.bankName,
          branchName: r.branchName,
          branchName1: branchNames?.find(
            (obj) => obj.id === Number(r.branchName)
          )?.branchName,
          savingAccountNo: r.savingAccountNo,
          bankIfscCode: r.bankIfscCode,
          bankMicrCode: r.bankMicrCode,
          activeFlag: r.activeFlag,
        }))
      )
    })
  }

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "nominatedCorporators",
      headerName: "Nominated Corporators",
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "ward1",
      headerName: "Ward Name",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "electedWard",
      headerName: "Elected Ward Name",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstName",
      headerName: "First Name English",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "firstNameMr",
    //   headerName: "First Name Marathi",
    //   // type: "number",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "middleName",
      headerName: "Middle Name English",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "middleNameMr",
    //   headerName: "Middle Name Marathi",
    //   // type: "number",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "lastname",
      headerName: "Last Name English",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "lastnameMr",
    //   headerName: "Last Name Marathi",
    //   // type: "number",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "gender1",
      headerName: "Gender",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "religion1",
      headerName: "Religion",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "caste1",
      headerName: "Caste",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "casteCertificateNo",
      headerName: "Caste Certification No.",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "party1",
      headerName: "Party Name",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "idProofCategory1",
      headerName: " Id Proof Category ",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "idProofNo",
      headerName: " Id Proof No ",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "panNo",
      headerName: "Pan no",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "mobileNo",
    //   headerName: " Mobile No",
    //   // type: "number",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "emailAddress",
    //   headerName: " Email Address ",
    //   // type: "number",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "address",
      headerName: " Address",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "addressMr",
    //   headerName: " Address Marathi",
    //   // type: "number",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "electedDate",
      headerName: " Elected Date",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "monthlyHonorariumAmount",
      headerName: " Monthly Honarium Amount",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "resignDate",
      headerName: " Resigned Date",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reason",
      headerName: " Reason",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "reasonMr",
    //   headerName: " Reason in Marathi",
    //   // type: "number",
    //   width: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "bankName1",
      headerName: " Bank Name",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "branchName1",
      headerName: " Branch Name",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bankMicrCode",
      headerName: " MICR Code",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "savingAccountNo",
      headerName: " Saving Account No",
      // type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bankIfscCode",
      headerName: "IFSC Code",
      // type: "number",
      width: 100,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerAlign: "center",
      align: "center",
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
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setButtonInputState(true)
                  console.log("params.row: ", params.row)
                  reset(params.row)
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete details">
              <IconButton
                onClick={() => deleteById(params.id, params.activeFlag)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  // View
  return (
    <>
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
          Define Corporator
          {/* <strong> Document Upload</strong> */}
        </div>
      </Card>
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
          <div>
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
              Define Corporator
              {/* <strong> Document Upload</strong> */}
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.small}>
                  <div className={styles.maindiv}>
                    <Grid
                      container
                      sx={{
                        marginLeft: 5,
                        marginTop: 2,
                        marginBottom: 5,
                        align: "center",
                      }}
                    >
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <b>
                          <FormControlLabel
                            control={<Checkbox />}
                            label="Nominated Corporator"
                            {...register("nominatedCorporators")}
                            onChange={(e) => {
                              // addressChange(e);
                            }}
                          />
                        </b>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 80 }}
                          error={!!errors.ward}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Ward Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 200 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Ward Name *"
                              >
                                {wardNames &&
                                  wardNames.map((wardName, index) => (
                                    <MenuItem key={index} value={wardName.id}>
                                      {wardName.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="ward"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.ward ? errors.ward.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 80 }}
                          // error={!!errors.electedWard}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Elected Ward Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 200 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Elected Ward Name *"
                              >
                                {/* <MenuItem value={1}>eward1</MenuItem> */}
                                {ewardNames &&
                                  ewardNames.map((ewardName, index) => (
                                    <MenuItem key={index} value={ewardName.id}>
                                      {ewardName.ewardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="electedWard"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                              {errors?.electedWard
                                ? errors.electedWard.message
                                : null}
                            </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="First name English *"
                          variant="standard"
                          {...register("firstName")}
                          error={!!errors.firstName}
                          helperText={
                            errors?.firstName ? errors.firstName.message : null
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            id="standard-basic"
                            label="First name Marathi *"
                            variant="standard"
                            {...register("firstNameMr")}
                            error={!!errors.firstNameMr}
                            helperText={
                              errors?.firstNameMr
                                ? errors.firstNameMr.message
                                : null
                            }
                          />
                        </Grid> */}

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Middle name English *"
                          variant="standard"
                          {...register("middleName")}
                          error={!!errors.middleName}
                          helperText={
                            errors?.middleName
                              ? errors.middleName.message
                              : null
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            id="standard-basic"
                            label="Middle name English *"
                            variant="standard"
                            {...register("middleNameMr")}
                            error={!!errors.middleNameMr}
                            helperText={
                              errors?.middleNameMr
                                ? errors.middleNameMr.message
                                : null
                            }
                          />
                        </Grid> */}

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Last name English *"
                          variant="standard"
                          {...register("lastname")}
                          error={!!errors.lastname}
                          helperText={
                            errors?.lastname ? errors.lastname.message : null
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            id="standard-basic"
                            label="Last name Marathi *"
                            variant="standard"
                            {...register("lastnameMr")}
                            error={!!errors.lastnameMr}
                            helperText={
                              errors?.lastnameMr
                                ? errors.lastnameMr.message
                                : null
                            }
                          />
                        </Grid> */}

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 2, minWidth: 120 }}
                          error={!!errors.gender}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Gender
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Gender *"
                              >
                                {genders &&
                                  genders.map((obj, i) => {
                                    return (
                                      <MenuItem key={i} value={obj.id}>
                                        {obj.genderEn}
                                      </MenuItem>
                                    )
                                  })}
                              </Select>
                            )}
                            name="gender"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.gender ? errors.gender.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl style={{ marginTop: 10, width: 185 }}>
                          <Controller
                            control={control}
                            name="dateOfBirth"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Date of Birth*
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
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 2, minWidth: 120 }}
                          error={!!errors.religion}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Religion
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Religion *"
                              >
                                {religions &&
                                  religions.map((religion, index) => (
                                    <MenuItem key={index} value={religion.id}>
                                      {religion.religion}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="religion"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.religion ? errors.religion.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 2, minWidth: 120 }}
                          error={!!errors.caste}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Caste
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Caste *"
                              >
                                {casts &&
                                  casts.map((cast, index) => (
                                    <MenuItem key={index} value={cast.id}>
                                      {cast.cast}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="caste"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.caste ? errors.caste.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Caste Certificate No *"
                          variant="standard"
                          {...register("casteCertificateNo")}
                          error={!!errors.casteCertificateNo}
                          helperText={
                            errors?.casteCertificateNo
                              ? errors.casteCertificateNo.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 2, minWidth: 120 }}
                          error={!!errors.party}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Party Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Party Name*"
                              >
                                {partyNames &&
                                  partyNames.map((partyName, index) => (
                                    <MenuItem key={index} value={partyName.id}>
                                      {partyName.partyName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="party"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.party ? errors.party.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 2, minWidth: 120 }}
                          error={!!errors.idProofCategory}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Id Proof category
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Id proof Category *"
                              >
                                {idProofs &&
                                  idProofs.map((idProof, index) => (
                                    <MenuItem key={index} value={idProof.id}>
                                      {idProof.idProof}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="idProofCategory"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.idProofCategory
                              ? errors.idProofCategory.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="ID Proof No *"
                          variant="standard"
                          {...register("idProofNo")}
                          error={!!errors.idProofNo}
                          helperText={
                            errors?.idProofNo ? errors.idProofNo.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Pan No *"
                          variant="standard"
                          {...register("panNo")}
                          error={!!errors.panNo}
                          helperText={
                            errors?.panNo ? errors.panNo.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Mobile No *"
                          variant="standard"
                          {...register("mobileNo")}
                          error={!!errors.mobileNo}
                          helperText={
                            errors?.mobileNo ? errors.mobileNo.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Email Address*"
                          variant="standard"
                          {...register("emailAddress")}
                          error={!!errors.emailAddress}
                          helperText={
                            errors?.emailAddress
                              ? errors.emailAddress.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Address English*"
                          variant="standard"
                          {...register("address")}
                          error={!!errors.address}
                          helperText={
                            errors?.address ? errors.address.message : null
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            id="standard-basic"
                            label="Address Marathi*"
                            variant="standard"
                            {...register("addressMr")}
                            error={!!errors.addressMr}
                            helperText={
                              errors?.addressMr
                                ? errors.addressMr.message
                                : null
                            }
                          />
                        </Grid> */}

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl style={{ marginTop: 10, width: 185 }}>
                          <Controller
                            control={control}
                            name="electedDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Elected Date*
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
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Monthly Honarium Amount*"
                          variant="standard"
                          {...register("monthlyHonorariumAmount")}
                          error={!!errors.monthlyHonorariumAmount}
                          helperText={
                            errors?.monthlyHonorariumAmount
                              ? errors.monthlyHonorariumAmount.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl style={{ marginTop: 10, width: 185 }}>
                          <Controller
                            control={control}
                            name="resignDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Resign Date*
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
                        </FormControl>
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            id="standard-basic"
                            label="Reason*"
                            variant="standard"
                            {...register("reasonMr")}
                            error={!!errors.reasonMr}
                            helperText={
                              errors?.reasonMr ? errors.reasonMr.message : null
                            }
                          />
                        </Grid> */}

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Reason*"
                          variant="standard"
                          {...register("reason")}
                          error={!!errors.reason}
                          helperText={
                            errors?.reason ? errors.reason.message : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </div>

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
                    Bank Details
                  </div>

                  <Grid
                    container
                    sx={{
                      marginLeft: 20,
                      marginRight: 140,
                      marginTop: 2,
                      marginBottom: 5,
                      align: "center",
                    }}
                  >
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 2, minWidth: 120 }}
                        error={!!errors.bankName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Bank Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Bank Name*"
                            >
                              {bankNames &&
                                bankNames.map((bankName, index) => (
                                  <MenuItem key={index} value={bankName.id}>
                                    {bankName.bankName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="bankName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bankName ? errors.bankName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 2, minWidth: 120 }}
                        error={!!errors.branchName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Branch Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Branch Name*"
                            >
                              {branchNames &&
                                branchNames.map((branchName, index) => (
                                  <MenuItem key={index} value={branchName.id}>
                                    {branchName.branchName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="branchName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.branchName
                            ? errors.branchName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <TextField
                        id="standard-basic"
                        label="Saving Account No*"
                        variant="standard"
                        {...register("savingAccountNo")}
                        error={!!errors.savingAccountNo}
                        helperText={
                          errors?.savingAccountNo
                            ? errors.savingAccountNo.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <TextField
                        id="standard-basic"
                        label="Bank IFSC Code*"
                        variant="standard"
                        {...register("bankIfscCode")}
                        error={!!errors.bankIfscCode}
                        helperText={
                          errors?.bankIfscCode
                            ? errors.bankIfscCode.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <TextField
                        id="standard-basic"
                        label="Bank MICR Code*"
                        variant="standard"
                        {...register("bankMicrCode")}
                        error={!!errors.bankMicrCode}
                        helperText={
                          errors?.bankMicrCode
                            ? errors.bankMicrCode.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>

                  <div className={styles.btn}>
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
        )}
        <div className={styles.addbtn}>
          <Button
            sx={{ backgroundColor: "rgb(0, 132, 255) !important" }}
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              })
              setBtnSaveText("Save")
              setIsOpenCollapse(!isOpenCollapse)
            }}
          >
            Add{" "}
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
        />
      </Paper>
    </>
  )
}

export default Index

// export default index
