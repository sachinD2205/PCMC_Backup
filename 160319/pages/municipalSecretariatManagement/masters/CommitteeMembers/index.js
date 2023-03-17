import { yupResolver } from "@hookform/resolvers/yup"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
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
  Checkbox,
  Tooltip,
  MenuItem,
  List,
  ListItem,
} from "@mui/material"
import PreviewIcon from "@mui/icons-material/Preview"
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
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstCommitteeMembersSchema"
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
    resolver: yupResolver(Schema),
    mode: "onChange",
  })
  const [data, setData] = useState([])

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [reasonForChange, setReasonForChange] = useState(false)

  const [wardNames, setwardNames] = useState([])

  const getwardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setwardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        }))
      )
    })
  }

  // const [ewardNames, setewardNames] = useState([]);

  // const getewardNames = () => {
  //   axios
  //     .get(`${urls.CFCURL /master}/master/MstPaymentType/getpaymentTypeData`)
  //     .then((r) => {
  //       setewardNames(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           ewardName: row.ewardName,
  //         })),
  //       );
  //     });
  // };
  const [casts, setCasts] = useState([])

  // getCasts
  const getCasts = () => {
    axios.get(`${urls.CFCURL}/master/cast/getAll`).then((r) => {
      console.log(":21", r.data.mCast)
      setCasts(
        r.data.mCast.map((row) => ({
          id: row.id,
          caste: row.cast,
        }))
      )
    })
  }

  // const [flag, setFlag] = useState(null);
  //   useEffect(() => {
  //     console.log("flag",flag)
  // }, [flag])

  const [genders, setGenders] = useState([])

  // getGenders
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
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

  // getReligions
  const getReligions = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      setReligions(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
        }))
      )
    })
  }
  const [idProofs, setIdProofs] = useState([])

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

  // const [bankNames, setBankNames] = useState([]);

  // // getCasts
  // const getBankNames = () => {
  //   axios
  //     .get(`${urls.CFCURL /master}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setCasts(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           bankName: row.bankName,
  //         })),
  //       );
  //     });
  // };
  // const [branchNames, setBranchNames] = useState([]);

  // // getCasts
  // const getBranchNames = () => {
  //   axios
  //     .get(`${urls.CFCURL /master}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setCasts(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           branchName: row.branchName,
  //         })),
  //       );
  //     });
  // };

  const [comittees1, setcomittees1] = useState([])

  const getcomittees1 = () => {
    axios.get(`${urls.MSURL}/mstDefineCommittees/getAll`).then((r) => {
      setcomittees1(
        r.data.committees.map((row) => ({
          id: row.id,
          comittee: row.CommitteeName,
        }))
      )
    })
  }

  useEffect(() => {
    getcomittees1()
    getwardNames()
    getGenders()
    getCasts()
    //  // getSubCast();
    getReligions()
    getPartyNames()
    //   getBankNames();
    //   getBranchNames();
    getIdProofs()
    //   getewardNames();
  }, [])

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
            .post(`${urls.MSURL}/mstDefineCommitteeMembers/save`, body)
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
            .post(`${urls.MSURL}/mstDefineCommitteeMembers/save`, body)
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
    event.preventDefault()
    const dateOfBirth = new Date(formData.dateOfBirth).toISOString()
    const electedDate = new Date(formData.electedDate).toISOString()
    const fromDate = new Date(formData.fromDate).toISOString()
    const toDate = new Date(formData.toDate).toISOString()
    const nominatedAsChairperson = formData?.nominatedAsChairperson?.toString()
    const nominatedCorporators = Number(formData?.nominatedCorporators)
    const memberChange = formData?.memberChange?.toString()
    console.log("From Date ${formData} ")

    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      dateOfBirth,
      electedDate,
      fromDate,
      toDate,
      nominatedAsChairperson,
      nominatedCorporators,
      memberChange,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(
          `${urls.MSURL}/mstDefineCommitteeMembers/save`,

          finalBodyForApi
        )
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
        .post(`${urls.MSURL}/mstDefineCommitteeMembers/save`, finalBodyForApi)
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

  // const [zoneNos, setzoneNos] = useState([]);

  // const getzoneNos = () => {
  //   axios
  //     .get(`${urls.CFCURL /master}/master/MstPaymentType/getpaymentTypeData`)
  //     .then((r) => {
  //       setzoneNos(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           zoneNo: row.zoneNo,
  //         })),
  //       );
  //     });
  // };

  // useEffect(() => {
  //   getzoneNos();
  // }, []);

  // const [zoneNames, setzoneNames] = useState([]);

  // const getzoneNames = () => {
  //   axios
  //     .get(`${urls.CFCURL /master}/master/MstPaymentType/getpaymentTypeData`)
  //     .then((r) => {
  //       setzoneNames(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           zoneName: row.zoneName,
  //         })),
  //       );
  //     });
  // };

  // useEffect(() => {
  //   getzoneNames();
  // }, []);

  // Reset Values Cancell
  const resetValuesCancell = {
    officeName: "",
    officeAddress: "",
    officeType: "",
    gisId: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    officeName: "",
    officeAddress: "",
    officeType: "",
    gisId: "",
    id: "",
  }

  // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios.get(`${urls.MSURL}/mstDefineCommitteeMembers/getAll`).then((res) => {
      console.log(res.data.committeeMembers, ">>>>>>>>>>>>")
      setDataSource(
        res.data.committeeMembers.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          address: r.address,
          addressMr: r.addressMr,
          amountDecidedPerMeeting: r.amountDecidedPerMeeting,
          caste: r.caste,
          caste1: casts?.find((obj) => obj.id === r.caste)?.caste,
          casteCertificateNo: r.casteCertificateNo,
          committee: r.committee,
          committee1: comittees1?.find((obj) => obj.id === r.committee)
            ?.comittee,
          dateOfBirth: r.dateOfBirth,
          electedDate: r.electedDate,
          electedWardName: r.electedWardName,
          emailAddress: r.emailAddress,
          firstName: r.firstName,
          firstNameMr: r.firstNameMr,
          fromDate: r.fromDate,
          gender: r.gender,
          gender1: genders?.find((obj) => obj.id === r.gender)?.gender,
          idProofCategory1: r.idProofCategory,
          idProofCategory1: idProofs?.find(
            (obj) => obj.id === r.idProofCategory
          )?.idProof,
          idProofNo: r.idProofNo,
          lastname: r.lastname,
          lastnameMr: r.lastnameMr,
          memberChange: r.memberChange,
          middleName: r.middleName,
          middleNameMr: r.middleNameMr,
          mobileNo: r.mobileNo,
          monthlyHonorariumAmount: r.monthlyHonorariumAmount,
          monthlyMaximumLimitForCommittee: r.monthlyMaximumLimitForCommittee,
          nominatedAsChairperson: r.nominatedAsChairperson,
          nominatedCorporators: r.nominatedCorporators,
          partyName: r.partyName,
          partyName1: partyNames?.find((obj) => obj.id === r.partyName)
            ?.partyName,
          reasonForChange: r.reasonForChange,
          reasonForChangeMr: r.reasonForChangeMr,
          religion: r.religion,
          religion1: religions?.find((obj) => obj.id === r.religion)?.religion,
          toDate: r.toDate,
          ward: r.ward,
          ward1: wardNames?.find((obj) => obj.id === r.ward)?.wardName,
          activeFlag: r.activeFlag,
        }))
      )
      //  setFilteredData(res.data.committeeMembers);
    })
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getlicenseTypeDetails()
  }, [wardNames, casts, genders, partyNames, religions, idProofs, comittees1])

  // const customFilter = (dataSource, filters) => {
  //     return dataSource.filter(item => {
  //         let pass = true;
  //         for (const [key, value] of Object.entries(filters)) {
  //             if (item[key] !== value) {
  //                 pass = false;
  //                 break;
  //             }
  //         }
  //         return pass;
  //     });
  // }

  // const customFilter = (dataSource, filters) => {
  //     return dataSource.filter(item => {
  //         let pass = true;
  //         for (const [key, value] of Object.entries(filters)) {
  //             let date = new Date(item[key]);
  //             let filterDate = new Date(value);
  //             if (date.getTime() !== filterDate.getTime()) {
  //                 pass = false;
  //                 break;
  //             }
  //         }
  //         return pass;
  //     });
  // }

  // const filters = { fromDate: new Date("2022-12-31"), toDate: new Date("2023-01-04")};
  // const filteredData = customFilter(dataSource, filters);

  // const filters = { fromDate:"2023-01-03", toDate:"2023-01-03" };
  // const filteredData = customFilter(dataSource, filters);

  // const customFilter = (dataSource, filters) => {
  //     return dataSource.filter(item => {
  //         let pass = true;
  //         const fromDate = new Date(item.fromDate);
  //         const toDate = new Date(item.toDate);
  //         const filterFromDate = new Date(filters.fromDate);
  //         const filterToDate = new Date(filters.toDate);
  //         if (fromDate < filterFromDate || toDate > filterToDate) {
  //             pass = false;
  //         }
  //         return pass;
  //     });
  // }

  // const filters = { fromDate: new Date("2023-01-01"), toDate: new Date("2023-01-31")};
  // const filteredData = customFilter(dataSource, filters);

  // console.log(filteredData,"FILTERED")
  // const [fromDate, setFromDate] = useState("");
  //   const [toDate, setToDate] = useState("");
  //   const [filteredData, setFilteredData] = useState([]);

  // const customFilter = (dataSource, filters) => {
  //   return dataSource
  //     .filter((item) => {
  //       const fromDate = new Date(item.fromDate);
  //       const toDate = new Date(item.toDate);
  //       const filterFromDate = new Date(filters.fromDate);
  //       const filterToDate = new Date(filters.toDate);
  //       return fromDate >= filterFromDate && toDate <= filterToDate;
  //     })
  //     .map((item, index) => {
  //       return { id: index, ...item };
  //     });
  // };

  // const handleFromDateChange = (event) => {
  //     setFromDate(event.target.value);
  //   };

  //   const handleToDateChange = (event) => {
  //     setToDate(event.target.value);
  //   };

  //   const handleSearchClick = () => {
  //     const filters = { fromDate, toDate };
  //     const filteredData = customFilter(dataSource, filters);
  //     if(filteredData.length > 0){
  //         setFilteredData(filteredData);
  //     }
  //   };

  // console.log(filteredData,"/////////////////////")

  // console.log(dataSource,"}}}}}}}}}}")

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 80,
    },
    {
      field: "committee1",
      headerName: "Committee Name",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 155,
    },

    {
      field: "ward1",
      headerName: "Ward Name",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 120,
    },
    {
      field: "electedWardName",
      headerName: "Elected Ward Name",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 165,
      // width:"150px"
    },
    {
      field: "firstName",
      headerName: "First Name English",
      // type: "number",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 170,
    },
    // {
    //   field: "firstNameMr",
    //   headerName: "First Name Marathi",
    //   // type: "number",
    //   // flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   width: 170,
    // },
    {
      field: "middleName",
      headerName: "Middle Name English",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 175,
    },
    // {
    //   field: "middleNameMr",
    //   headerName: "Middle Name Marathi",
    //   // type: "number",
    //   // flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   width: 180,
    // },
    {
      field: "lastname",
      headerName: "Last Name English",
      // type: "number",
      // flex: 1,
      width: 165,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "lastnameMr",
    //   headerName: "Last Name Marathi",
    //   // type: "number",
    //   // flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   width: 165,
    // },
    {
      field: "gender1",
      headerName: "Gender",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 90,
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 120,
    },
    {
      field: "religion1",
      headerName: "Religion",
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "caste1",
      headerName: "Caste",
      // type: "number",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 80,
    },
    {
      field: "casteCertificateNo",
      headerName: "Caste Certification No.",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 185,
    },
    {
      field: "partyName1",
      headerName: "Party Name",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 120,
    },
    {
      field: "idProofCategory1",
      headerName: " Id Proof Category ",
      // type: "number",
      // flex: 1,
      width: 155,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "idProofNo",
      headerName: " Id Proof No ",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 120,
    },
    {
      field: "nominatedAsChairperson",
      headerName: "Nominated As Chairperson",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 165,
    },
    {
      field: "nominatedCorporators",
      headerName: "Nominated As Corporators",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 165,
    },

    {
      field: "mobileNo",
      headerName: " Mobile No",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "emailAddress",
      headerName: " Email Address ",
      // type: "number",
      // flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: " Address",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 200,
    },
    // {
    //   field: "addressMr",
    //   headerName: " Address Marathi",
    //   // type: "number",
    //   // flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   width: 200,
    // },
    {
      field: "electedDate",
      headerName: " Elected Date",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "monthlyHonorariumAmount",
      headerName: " Monthly Honarium Amount",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 170,
    },
    {
      field: "amountDecidedPerMeeting",
      headerName: " Amount/Meeting",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "monthlyMaximumLimitForCommittee",
      headerName: " Monthly Maximum Limit of Committee",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 220,
    },
    {
      field: "fromDate",
      headerName: "From Date",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 130,
    },
    {
      field: "toDate",
      headerName: "To Date",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 130,
    },
    {
      field: "reasonForChange",
      headerName: " Reason For Change",
      // type: "number",
      // flex: 1,
      align: "center",
      headerAlign: "center",
      width: 160,
    },
    // {
    //   field: "reasonForChangeMr",
    //   headerName: " Reason For Change in Marathi",
    //   // type: "number",
    //   // flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   width: 160,
    // },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
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

  //rows data define

  // View
  return (
    <>
      {/* <BasicLayout titleProp={"none"}> */}
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
          Define Committee Members
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
                // marginTop: 30,
                marginBottom: 30,
                padding: 8,
                paddingLeft: 30,
                marginLeft: "40px",
                marginRight: "65px",
                borderRadius: 100,
              }}
            >
              Define Committee Members
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
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.committee}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Select Committee *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 200 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Select Committee*"
                              >
                                {comittees1 &&
                                  comittees1.map((comittee, index) => (
                                    <MenuItem key={index} value={comittee.id}>
                                      {comittee.comittee}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="committee"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.committee
                              ? errors.committee.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <b>
                          <FormControlLabel
                            control={<Checkbox />}
                            label="Nominated as Chairperson"
                            {...register("nominatedAsChairperson")}
                            onChange={(e) => {
                              //  addressChange(e);
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
                          error={!!errors.electedWardName}
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
                                <MenuItem value={10}>ten</MenuItem>
                                {/* {ewardNames &&
                                    ewardNames.map((ewardName, index) => (
                                      <MenuItem key={index} value={ewardName.id}>
                                        {ewardName.ewardName}
                                      </MenuItem>
                                    ))} */}
                              </Select>
                            )}
                            name="electedWardName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.electedWardName
                              ? errors.electedWardName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="First name *"
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
                                // sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Gender *"
                              >
                                {genders &&
                                  genders.map((gender, index) => (
                                    <MenuItem key={index} value={gender.id}>
                                      {gender.gender}
                                    </MenuItem>
                                  ))}
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
                                      {cast.caste}
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
                          error={!!errors.partyName}
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
                            name="partyName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.partyName
                              ? errors.partyName.message
                              : null}
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
                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TextField
                          id='standard-basic'
                          label='Pan No *'
                          variant='standard'
                          {...register("panno")}
                          error={!!errors.panno}
                          helperText={
                            errors?.panno
                              ? errors.panno.message
                              : null
                          }
                        />
        
           
</Grid> */}

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
                        <TextField
                          id="standard-basic"
                          label="Amount Decided /Meeting*"
                          variant="standard"
                          {...register("amountDecidedPerMeeting")}
                          error={!!errors.amountDecidedPerMeeting}
                          helperText={
                            errors?.amountDecidedPerMeeting
                              ? errors.amountDecidedPerMeeting.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Monthly Max Limit of Committee*"
                          variant="standard"
                          {...register("monthlyMaximumLimitForCommittee")}
                          error={!!errors.monthlyMaximumLimitForCommittee}
                          helperText={
                            errors?.monthlyMaximumLimitForCommittee
                              ? errors.monthlyMaximumLimitForCommittee.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl style={{ marginTop: 10, width: 185 }}>
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
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
                        <FormControl style={{ marginTop: 10, width: 185 }}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
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
                        <b>
                          <FormControlLabel
                            control={<Checkbox />}
                            label="Member Change"
                            {...register("memberChange")}
                            onChange={(event) => {
                              setReasonForChange(event.target.checked)
                              setValue("reasonForChange", "")
                            }}
                          />
                        </b>
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          style={{
                            backgroundColor: "white",
                            width: "215px",
                          }}
                          id="outlined-basic"
                          label="Reason For Change"
                          variant="standard"
                          {...register("reasonForChange")}
                          error={!!errors.reasonForChange}
                          helperText={
                            errors?.reasonForChange
                              ? errors.reasonForChange.message
                              : null
                          }
                          disabled={!reasonForChange}
                        />
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            id="standard-basic"
                            label="Reason For Change in Marathi*"
                            variant="standard"
                            {...register("reasonForChangeMr")}
                            error={!!errors.reasonForChangeMr}
                            helperText={
                              errors?.reasonForChangeMr
                                ? errors.reasonForChangeMr.message
                                : null
                            }
                          />
                        </Grid> */}
                    </Grid>
                  </div>

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
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              autoHeight
              sx={{
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                marginBottom: 5,
              }}
              rows={dataSource}
              // rows={filteredData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              options={{
                filtering: true,
              }}
              //checkboxSelection
            />
          </div>
        </div>
      </Paper>
      {/* </BasicLayout> */}
    </>
  )
}

export default Index

// export default index
