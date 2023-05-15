import React, { useEffect, useRef, useState } from "react";
import router from "next/router";
import styles from "../../sbms.module.css";
import {
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  IconButton,
  Box,
  Grid,
  Modal,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useSelector } from "react-redux";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useReactToPrint } from "react-to-print";
import SelfDeclaration from "../generateDocuments/selfDeclaration";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SelfAttestation from "../generateDocuments/selfAttestation";
import ClearIcon from "@mui/icons-material/Clear";

const Index = () => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    height: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  let loggedInUser = localStorage.getItem("loggedInUser");
  // console.log("loggedInUser", loggedInUser);

  // acknowledgement useState


  const [ID, setId] = useState(null);
  const [photo, setPhoto] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isOverduePayment, setIsOverduePayment] = useState(false);
  const [hutNo, setHutNo] = useState("");
  const [hutKey, setHutKey] = useState("");
  const [choice, setChoice] = useState("");
  const [selectedSlum, setSelectedSlum] = useState("");
  const [hutDataLoder, setHutDataLoader] = useState(false);
  const [applicantData, setApplicantData] = useState({});
  const [selectedHutData, setSelectedHutData] = useState({});
  const [hutOwnerData, setHutOwnerData] = useState({});
  const [selfDeclarationFlag, setSelfDeclarationFlag] = useState(false);
  const [selfAttestationFlag, setSelfAttestationFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openEntryConnections, setOpenEntryConnections] = React.useState(false);
  const handleOpenEntryConnections = () => setOpenEntryConnections(true);
  const handleCloseEntryConnections = () => setOpenEntryConnections(false);
  const handleCancel = () => setIsModalOpenForResolved(false);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false)
  const [searchedConnections, setSearchedConnections] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [slumDropDown, setSlumDropDown] = useState([
    {
      id: 1,
      slumEn: "",
      slumMr: "",
    },
  ]);
  const [areaDropDown, setAreaDropDown] = useState([
    {
      id: 1,
      areaEn: "",
      areaMr: "",
    },
  ]);
  const [villageDropDown, setVillageDropDown] = useState([
    {
      id: 1,
      villageEn: "",
      villageMr: "",
    },
  ]);
  const [titleDropDown, setTitleDropDown] = useState([
    {
      id: 1,
      titleEn: "",
      titleMr: "",
    },
  ]);
  const cityDropDown = [
    {
      id: 1,
      cityEn: "Pimpri",
      cityMr: "पिंपरी",
    },
    {
      id: 2,
      cityEn: "Chinchwad",
      cityMr: "चिंचवड",
    },
    {
      id: 3,
      cityEn: "Bhosari",
      cityMr: "भोसरी",
    },
  ];

  useEffect(() => {
    if (choice === "selfDeclaration") {
      handleGenerateButton1();
    } else if (choice === "selfAttestation") {
      handleGenerateButton2();
    }
  }, [choice]);

  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });

  const componentRef2 = useRef();
  const handleGenerateButton2 = useReactToPrint({
    content: () => componentRef2.current,
  });

  useEffect(() => {
    let selectedHut = selectedHutData;
    let hutOwner = hutOwnerData;
    setValue(
      "ownerTitle", !hutOwner?.title ? "-" : language == "en" ? 
      titleDropDown && titleDropDown.find((obj) => obj.id == hutOwner?.title)?.titleEn
          : titleDropDown && titleDropDown.find((obj) => obj.id == hutOwner?.title)?.titleMr
    );
    setValue("ownerFirstName", !hutOwner?.firstName ? "-" : language == "en" ? hutOwner?.firstName : hutOwner?.firstNameMr);
    setValue("ownerMiddleName", !hutOwner?.middleName ? "-" : language == "en" ? hutOwner?.middleName : hutOwner?.middleNameMr);
    setValue("ownerLastName", !hutOwner?.lastName ? "-" : language == "en" ? hutOwner?.lastName : hutOwner?.lastNameMr);
    setValue("ownerMobileNo", hutOwner?.mobileNo ? hutOwner?.mobileNo : "-");
    setValue("ownerAadharNo", hutOwner?.aadharNo ? hutOwner?.aadharNo : "-");
    setValue("ownerEmailId", hutOwner?.emailId ? hutOwner?.emailId : "-");
    setValue("pincode", selectedHut?.pincode ? selectedHut?.pincode : "-");
    setValue("lattitude", selectedHut?.lattitude ? selectedHut?.lattitude : "-");
    setValue("longitude", selectedHut?.longitude ? selectedHut?.longitude : "-");
  }, [hutOwnerData, selectedHutData]);

  useEffect(() => {
    let temp = {
      applicantFirstName: `${watch("applicantFirstNameMr")}`,
      applicantFirstNameEn: `${watch('applicantFirstName')}`,
      applicantMiddleName: `${watch("applicantMiddleNameMr")}`,
      applicantLastName: `${watch("applicantLastNameMr")}`,
      applicantMobileNo: `${watch("applicantMobileNo")}`,
      applicantAadharNo: `${watch("applicantAadharNo")}`,
      applicantPhoto: photo,
    };
    setApplicantData(temp);
  }, [watch("applicantAadharNo"), photo]);

  useEffect(() => {
    getSlumData();
    getAreaData();
    getVillageData();
    getHutData();
    getTitleData();
    getServiceCharges();
    setValue("noOfCopies", 1);
  }, []);

  useEffect(() => {
    getSlumData();
    getAreaData();
    getVillageData();
    getTitleData();
    getServiceCharges();
  }, [selectedHutData, language]);

  useEffect(() => {
    getServiceCharges();
  }, [watch("noOfCopies")]);

  const getServiceCharges = () => {
    axios.get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=120`).then((r) => {
      let temp = r.data.serviceCharge[0];
      console.log("getServiceCharges", temp);
      setValue("feesApplicable", watch("noOfCopies") * temp?.amount);
    });
  };

  const handleUploadDocument = (path) =>{
    console.log("handleUploadDocument",path);
      let temp = {
        documentPath: path,
        documentKey : 1,
        documentType : "",
        remark : "",
      }
    setPhoto(temp)
  }

  const getTitleData = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      let result = r.data.title;
      // console.log("getTitleData", result);
      let res =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            titleEn: r.title,
            titleMr: r.titleMr,
          };
        });
      // console.log("getTitleDatares", res);
      setTitleDropDown(res);
    });
  };

  const getHutData = (selectedId) => {
    axios.get(`${urls.SLUMURL}/mstHut/getAll`).then((r) => {
      let result = r.data.mstHutList;
      let selectedHut = result && result.find((obj) => obj.id == selectedId);
      let hutOwner = selectedHut && selectedHut.mstHutMembersList.find((obj) => obj.headOfFamily === "Yes");
      console.log("hutOwner", hutOwner);
      setHutOwnerData(hutOwner);
      setSelectedHutData(selectedHut);
      setHutKey(selectedHut?.id);
      handleCloseEntryConnections();
    });
  };

  console.log("selectedHutData", selectedHutData);

  // handle search connections
  const handleSearchHut = () => {
    handleOpenEntryConnections();
    setHutDataLoader(true);
    console.log("hutNo", hutNo);
    axios
      .get(`${urls.SLUMURL}/mstHut/search/hutNo?hutNo=${watch("hutNo")}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.mstHutList;
        setHutDataLoader(false);
        console.log("handleSearchHut", slumDropDown);

        let _res = result.map((r, i) => {
          console.log("r", r);
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            hutNo: r.hutNo,
            slum: slumDropDown && slumDropDown.find((obj) => obj.id == r.slumKey)?.slumEn,
            slumMr: slumDropDown && slumDropDown.find((obj) => obj.id == r.slumKey)?.slumMr,
          };
        });

        setSearchedConnections({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  const handleSelectConnection = (id) => {
    console.log("selected id", id);
    getHutData(id);
  };

  const getVillageData = () => {
    axios.get(`${urls.SLUMURL}/master/village/getAll`).then((r) => {
      let result = r.data.village;
      // console.log("getVillageData", result);
      let res =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            villageEn: r.villageName,
            villageMr: r.villageNameMr,
          };
        });
      console.log("getVillageData", res);
      let temp = res && res.find((obj) => obj.id == selectedHutData?.villageKey);
      console.log("villageKey", temp);
      setValue("villageKey", !temp ? "-" : language == "en" ? temp?.villageEn : temp?.villageMr);
      setVillageDropDown(res);
    });
  };

  const getSlumData = () => {
    axios.get(`${urls.SLUMURL}/mstSlum/getAll`).then((r) => {
      let result = r.data.mstSlumList;
     
      let res =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            slumEn: r.slumName,
            slumMr: r.slumNameMr,
          };
        });
      let temp = res && res.find((obj) => obj.id == selectedHutData?.slumKey);
      //  console.log("getSlumData", temp);
      setValue("slumKey", !temp ? "-" : language == "en" ? temp?.slumEn : temp?.slumMr);
      setSlumDropDown(res);
    });
  };

  const getAreaData = () => {
    axios.get(`${urls.SLUMURL}/master/area/getAll`).then((r) => {
      let result = r.data.area;
      let res =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            areaEn: r.areaName,
            areaMr: r.areaNameMr,
          };
        });
      let temp = res && res.find((obj) => obj.id == selectedHutData?.areaKey);
      setValue("areaKey", !temp ? "-" : language === "en" ? temp?.areaEn : temp?.areaMr);
      setAreaDropDown(res);
    });
  };

  const clearFields = () => {
    reset({
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNo: "",
      emailId: "",
      aadharNo: "",
      pincode: "",
      areaKey: "",
      villageKey: "",
      cityName: "",
      lattitude: "",
      longitude: "",
      outstandingTaxesAmount: "",
      slumKey: "",
      hutNo: "",
    });
  };

  const handleOnSubmit = (formData) => {
    let body = {
      activeFlag:"Y",
      slumKey: selectedHutData?.slumKey,
      hutNo: formData?.hutNo,
      applicantTitle: formData?.applicantTitle,
      applicantMiddleName: formData?.applicantMiddleName,
      applicantFirstName: formData?.applicantFirstName,
      applicantLastName: formData?.applicantLastName,
      applicantMiddleNameMr: formData?.applicantMiddleNameMr,
      applicantFirstNameMr: formData?.applicantFirstNameMr,
      applicantLastNameMr: formData?.applicantLastNameMr,
      applicantPhoto:photo?.documentPath,
      applicantMobileNo: formData?.applicantMobileNo,
      applicantAadharNo: formData?.applicantAadharNo,
      applicantEmailId: formData?.applicantEmailId,
      areaKey: selectedHutData?.areaKey,
      cityKey: selectedHutData?.cityKey,
      villageKey: selectedHutData?.villageKey,
      pincode: selectedHutData?.pincode,
      lattitude: selectedHutData?.lattitude,
      longitude: selectedHutData?.longitude,
      noOfCopies: formData?.noOfCopies,
      asOnDate: null,
      feesApplicable: formData?.feesApplicable,
      outstandingTax: null,
      remarks: "test",
      isApproved: null,
      isComplete: null,
      status:null,
      isDraft: null
  }
    console.log("formdata", body);

    // if (btnSaveText === "Save") {
    //   if (loggedInUser === "citizenUser") {
    //     const tempData = axios
    //       .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, body, {
    //         headers: {
    //           UserId: user.id,
    //         },
    //       })
    //       .then((res) => {
    //         // if (res.status == 201) {
    //         //   sweetAlert("Saved!", "Inssurance photopass Saved successfully !", "success");
    //         //   router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
    //         // }
    //         console.log("res", res);
    //         if (res.status == 201) {
    //                 sweetAlert({
    //                     title: "Saved!",
    //                     text: "Issuance of NOC Application Saved successfully !",
    //                     icon: "success",
    //                     dangerMode: false,
    //                     closeOnClickOutside: false,
    //                 }).then((will) => {
    //                     if (will) {
    //                         sweetAlert({
    //                             // title: "Great!",
    //                             text: ` Your Issuance of NOC Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
    //                             icon: "success",
    //                             buttons: ["View Acknowledgement", "Go To Photopass Details"],
    //                             dangerMode: false,
    //                             closeOnClickOutside: false,
    //                         }).then((will) => {
    //                             if (will) {
    //                                 {
    //                                     router.push('/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails')
    //                                 }

    //                             } else {
    //                                 router.push({
    //                                     pathname:
    //                                         "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfPhotopass",
    //                                     query: { id: res.data.message.split('[')[1].split(']')[0] },
    //                                 })

    //                             }
    //                         })
    //                     }
    //                 })

    //         }
    //         else {
    //             sweetAlert("Error!", "Something Went Wrong !", "error");
    //         }
    //       });
    //   } else {
    //     const tempData = axios
    //       .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, body, {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       })
    //       .then((res) => {
    //         // if (res.status == 201) {
    //         //   sweetAlert("Saved!", "Inssurance photopass Saved successfully !", "success");
    //         //   router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
    //         // }
    //         console.log("res", res);
    //         if (res.status == 201) {
    //                 sweetAlert({
    //                     title: "Saved!",
    //                     text: "Issuance Of Noc Application Saved successfully !",
    //                     icon: "success",
    //                     dangerMode: false,
    //                     closeOnClickOutside: false,
    //                 }).then((will) => {
    //                     if (will) {
    //                         sweetAlert({
    //                             // title: "Great!",
    //                             text: ` Your Issuance of Noc Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
    //                             icon: "success",
    //                             buttons: ["View Acknowledgement", "Go To Photopass Details"],
    //                             dangerMode: false,
    //                             closeOnClickOutside: false,
    //                         }).then((will) => {
    //                             if (will) {
    //                                 {
    //                                     router.push('/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails')
    //                                 }
    //                                 // removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

    //                             } else {
    //                                 router.push({
    //                                     pathname:
    //                                         "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfPhotopass",
    //                                     query: { id: res.data.message.split('[')[1].split(']')[0] },
    //                                 })
    //                                 // removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

    //                             }
    //                         })
    //                     }
    //                 })
    //                 // var a = res.data.message;
    //                 // getApplicationDetails(res.data.message.split('[')[1].split(']')[0])
    //                 // setApplicationNumberDetails(res.data.message.split('[')[1].split(']')[0])
    //                 // setIsModalOpenForResolved(true)

    //         }
    //         else {
    //             sweetAlert("Error!", "Something Went Wrong !", "error");
    //         }
    //       });
    //   }
    // }
  };

  const handlePaymentButton = () => {};

  const columns = [
    //Sr No
    { field: "srNo", width: 50, headerName: <FormattedLabel id="srNo" />, flex: 1 },

    // hutNo
    {
      field: language === "en" ? "hutNo" : "hutNo",
      headerName: <FormattedLabel id="hutNo" />,
      flex: 1,
    },

    // slumKey
    {
      field: language === "en" ? "slum" : "slumMr",
      headerName: <FormattedLabel id="slumKey" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                handleSelectConnection(params.row.id);
              }}
            >
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
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
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          {/* search Slum Address by hut number */}

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
            <h2>
              <FormattedLabel id="searchSlumDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Hut No */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="hutNo" required/>}
                // @ts-ignore
                variant="standard"
                {...register("hutNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("hutNo") ? true : false,
                }}
                error={!!error.hutNo}
                helperText={error?.hutNo ? error.hutNo.message : null}
              />
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop:"10px",
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  handleSearchHut();
                }}
              >
                {<FormattedLabel id="search" />}
              </Button>
            </Grid>
          </Grid>

          {/* Modal to select Entry Connections */}

          <div>
            <Modal
              open={openEntryConnections}
              onClose={handleCloseEntryConnections}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
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
                  loading={hutDataLoder}
                  rowCount={searchedConnections.totalRows}
                  rowsPerPageOptions={searchedConnections.rowsPerPageOptions}
                  page={searchedConnections.page}
                  pageSize={searchedConnections.pageSize}
                  rows={searchedConnections.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    handleSearchHut(searchedConnections.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    handleSearchHut(_data, searchedConnections.page);
                  }}
                />
              </Box>
            </Modal>
          </div>

          <Box
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="hutOwnerDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* owner Title */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="title" required/>}
                // @ts-ignore
                variant="standard"
                value={watch("ownerTitle")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ownerTitle") ? true : false,
                }}
                error={!!error.ownerTitle}
                helperText={error?.ownerTitle ? error.ownerTitle.message : null}
              />
            </Grid>

            {/* firstName */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="firstName" required/>}
                // @ts-ignore
                variant="standard"
                value={watch("ownerFirstName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ownerFirstName") ? true : false,
                }}
                error={!!error.ownerFirstName}
                helperText={error?.ownerFirstName ? error.ownerFirstName.message : null}
              />
            </Grid>

            {/* middleName */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="middleName"  required/>}
                // @ts-ignore
                variant="standard"
                value={watch("ownerMiddleName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ownerMiddleName") ? true : false,
                }}
                error={!!error.ownerMiddleName}
                helperText={error?.ownerMiddleName ? error.ownerMiddleName.message : null}
              />
            </Grid>

            {/* lastName */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lastName" required/>}
                // @ts-ignore
                variant="standard"
                value={watch("ownerLastName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ownerLastName") ? true : false,
                }}
                error={!!error.ownerLastName}
                helperText={error?.ownerLastName ? error.ownerLastName.message : null}
              />
            </Grid>

            {/* mobileNo */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="mobileNo" required/>}
                // @ts-ignore
                variant="standard"
                value={watch("ownerMobileNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ownerMobileNo") ? true : false,
                }}
                error={!!error.ownerMobileNo}
                helperText={error?.ownerMobileNo ? error.ownerMobileNo.message : null}
              />
            </Grid>

            {/* emailId */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="emailId" required/>}
                // @ts-ignore
                variant="standard"
                value={watch("ownerEmailId")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ownerEmailId") ? true : false,
                }}
                error={!!error.ownerEmailId}
                helperText={error?.ownerEmailId ? error.ownerEmailId.message : null}
              />
            </Grid>

            {/* aadharNo */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="aadharNo" required/>}
                // @ts-ignore
                variant="standard"
                value={watch("ownerAadharNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ownerAadharNo") ? true : false,
                }}
                error={!!error.ownerAadharNo}
                helperText={error?.ownerAadharNo ? error.ownerAadharNo.message : null}
              />
            </Grid>

            {/* Slum Name */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="slumName" required />}
                // @ts-ignore
                variant="standard"
                value={watch("slumKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("slumKey") ? true : false,
                }}
                error={!!error.slumKey}
                helperText={error?.slumKey ? error.slumKey.message : null}
              />
            </Grid>

            {/* Area */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="area" required/>}
                // @ts-ignore
                variant="standard"
                value={watch("areaKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("areaKey") ? true : false,
                }}
                error={!!error.areaKey}
                helperText={error?.areaKey ? error.areaKey.message : null}
              />
            </Grid>

            {/* Village */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="village" required/>}
                // @ts-ignore
                variant="standard"
                value={watch("villageKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("villageKey") ? true : false,
                }}
                error={!!error.villageKey}
                helperText={error?.villageKey ? error.villageKey.message : null}
              />
            </Grid>

            {/* city */}
            {/* <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="city" />}
                // @ts-ignore
                variant="standard"
                value={watch("cityKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("cityKey") ? true : false,
                }}
                error={!!error.cityKey}
                helperText={error?.cityKey ? error.cityKey.message : null}
              />
            </Grid> */}

            {/* pincode */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="pincode" required/>}
                // label={labels["pincode"]}
                // @ts-ignore
                variant="standard"
                {...register("pincode")}
                InputLabelProps={{
                  shrink: router.query.id || watch("pincode") ? true : false,
                }}
                error={!!error.pincode}
                helperText={error?.pincode ? error.pincode.message : null}
              />
            </Grid>

            {/* Lattitude */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lattitude" required/>}
                // label={labels["lattitude"]}
                // @ts-ignore
                variant="standard"
                {...register("lattitude")}
                InputLabelProps={{
                  shrink: router.query.id || watch("lattitude") ? true : false,
                }}
                error={!!error.lattitude}
                helperText={error?.lattitude ? error.lattitude.message : null}
              />
            </Grid>

            {/* Longitude */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="longitude" required/>}
                // label={labels["longitude"]}
                // @ts-ignore
                variant="standard"
                {...register("longitude")}
                InputLabelProps={{
                  shrink: router.query.id || watch("longitude") ? true : false,
                }}
                error={!!error.longitude}
                helperText={error?.longitude ? error.longitude.message : null}
              />
            </Grid>
          </Grid>

          {/********* Applicant Information *********/}

          <Box
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="applicantInfo" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Applicant Title */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                disabled={router.query.pageMode == "view" ? true : false}
                variant="standard"
                error={!!error.applicantTitle}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="title" required/>
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "250px" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // @ts-ignore
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="applicantTitle"
                    >
                      {titleDropDown &&
                        titleDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.titleEn
                              : // @ts-ignore
                                value?.titleMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="applicantTitle"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{error?.title ? error.title.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Applicant firstName (English) */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="firstNameEn" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantFirstName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantFirstName") ? true : false,
                }}
                error={!!error.applicantFirstName}
                helperText={error?.applicantFirstName ? error.applicantFirstName.message : null}
              />
            </Grid>

            {/* Applicant firstName (Marathi) */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="firstNamemr" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantFirstNameMr")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantFirstNameMr") ? true : false,
                }}
                error={!!error.applicantFirstNameMr}
                helperText={error?.applicantFirstNameMr ? error.applicantFirstNameMr.message : null}
              />
            </Grid>

            {/* Applicant middleName (English) */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="middleNameEn" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantMiddleName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantMiddleName") ? true : false,
                }}
                error={!!error.applicantMiddleName}
                helperText={error?.applicantMiddleName ? error.applicantMiddleName.message : null}
              />
            </Grid>

            {/* Applicant middleName (Marathi) */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="middleNamemr" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantMiddleNameMr")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantMiddleNameMr") ? true : false,
                }}
                error={!!error.applicantMiddleNameMr}
                helperText={error?.applicantMiddleNameMr ? error.applicantMiddleNameMr.message : null}
              />
            </Grid>

            {/* Applicant lastName (English) */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lastNameEn" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantLastName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantLastName") ? true : false,
                }}
                error={!!error.applicantLastName}
                helperText={error?.applicantLastName ? error.applicantLastName.message : null}
              />
            </Grid>

            {/* Applicant lastName (Marathi) */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lastNamemr" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantLastNameMr")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantLastNameMr") ? true : false,
                }}
                error={!!error.applicantLastNameMr}
                helperText={error?.applicantLastNameMr ? error.applicantLastNameMr.message : null}
              />
            </Grid>

            {/* Applicant mobileNo */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="mobileNo" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantMobileNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantMobileNo") ? true : false,
                }}
                error={!!error.applicantMobileNo}
                helperText={error?.applicantMobileNo ? error.applicantMobileNo.message : null}
              />
            </Grid>

            {/* Applicant emailId */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="emailId" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantEmailId")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantEmailId") ? true : false,
                }}
                error={!!error.applicantEmailId}
                helperText={error?.applicantEmailId ? error.applicantEmailId.message : null}
              />
            </Grid>

            {/* Applicant aadharNo */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="aadharNo" required/>}
                // @ts-ignore
                variant="standard"
                {...register("applicantAadharNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantAadharNo") ? true : false,
                }}
                error={!!error.applicantAadharNo}
                helperText={error?.applicantAadharNo ? error.applicantAadharNo.message : null}
              />
            </Grid>

            {/* Applicant Upload Photos */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <label>
                <b>
                  <FormattedLabel id="photo" required/>
                </b>
              </label>
              <UploadButton
                appName="SLUM"
                serviceName="SLUM-IssuancePhotopass"
                filePath={(path)=>{handleUploadDocument(path)}}
                fileName={photo && photo.documentPath}
              />
            </Grid>
          </Grid>

          {/******* Additional Fields *********/}

          <Box
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="additionalFields" />
            </h2>
          </Box>

          <Grid container sx={{ marginLeft: "13px" }}>
            {/* No of copies */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="noOfCopies" required/>}
                // @ts-ignore
                variant="standard"
                {...register("noOfCopies")}
                InputLabelProps={{
                  shrink: router.query.id || watch("noOfCopies") ? true : false,
                }}
                error={!!error.noOfCopies}
                helperText={error?.noOfCopies ? error.noOfCopies.message : null}
              />
            </Grid>

            {/* feesApplicable */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="feesApplicable"/>}
                // @ts-ignore
                variant="standard"
                {...register("feesApplicable")}
                InputLabelProps={{
                  shrink: router.query.id || watch("feesApplicable") ? true : false,
                }}
                error={!!error.feesApplicable}
                helperText={error?.feesApplicable ? error.feesApplicable.message : null}
              />
            </Grid>
          </Grid>

          <Box
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="outstandingTaxesAmount" />
            </h2>
          </Box>

          <Grid container>
            <Grid container sx={{ padding: "10px" }}>
              {/* Pending Payments */}
              <Grid
                item
                xl={1}
                lg={1}
                md={1}
                sm={1}
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              ></Grid>

              {/* property taxes amount */}
              <Grid
                item
                xl={7}
                lg={7}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              >
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="propertyTaxesAmount" />}
                  // label={labels["outstandingTaxesAmount"]}
                  // @ts-ignore
                  variant="standard"
                  // value={watch("propertyTaxesAmount")}
                  {...register("propertyTaxesAmount")}
                  InputLabelProps={{
                    shrink: watch("propertyTaxesAmount") ? true : false,
                  }}
                  error={!!error.propertyTaxesAmount}
                  helperText={error?.propertyTaxesAmount ? error.propertyTaxesAmount.message : null}
                />
              </Grid>

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop:"10px",
                }}
              >
                <Button variant="contained" disabled={!isOverduePayment} onClick={handlePaymentButton}>
                     <FormattedLabel id="payment" />
                </Button>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* Pending Payments */}
              <Grid
                item
                xl={1}
                lg={1}
                md={1}
                sm={1}
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              ></Grid>

              {/* water taxes amount */}
              <Grid
                item
                xl={7}
                lg={7}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              >
                <TextField
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="waterTaxesAmount" />}
                  // label={labels["waterTaxesAmount"]}
                  // @ts-ignore
                  variant="standard"
                  // value={watch("waterTaxesAmount")}
                  {...register("waterTaxesAmount")}
                  InputLabelProps={{
                    shrink: watch("waterTaxesAmount") ? true : false,
                  }}
                  error={!!error.waterTaxesAmount}
                  helperText={error?.waterTaxesAmount ? error.waterTaxesAmount.message : null}
                />
              </Grid>

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop:"10px",
                }}
              >
                <Button variant="contained" disabled={!isOverduePayment} onClick={handlePaymentButton}>
                <FormattedLabel id="payment" />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Box
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="generateDocuments" />
            </h2>
          </Box>

          <Grid container>
            <Grid container sx={{ padding: "10px" }}>
              {/* Pending Payments */}
              <Grid
                item
                xl={1}
                lg={1}
                md={1}
                sm={1}
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              ></Grid>

              {/* property taxes amount */}
              <Grid
                item
                xl={7}
                lg={7}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              >
                <label>
                  <b>
                    <FormattedLabel id="selfDeclarationForm" />
                  </b>
                </label>
              </Grid>

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selfDeclarationFlag ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setChoice("selfDeclaration");
                      handleOpen();
                    }}
                  >
                  {language ==="en"?  "Preview" : "पूर्वावलोकन"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setChoice("selfDeclaration");
                      handleOpen();
                    }}
                  >
                    <FormattedLabel id="generate" />
                  </Button>
                )}
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* Pending Payments */}
              <Grid
                item
                xl={1}
                lg={1}
                md={1}
                sm={1}
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              ></Grid>

              {/* water taxes amount */}
              <Grid
                item
                xl={7}
                lg={7}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              >
                <label>
                  <b>
                    <FormattedLabel id="selfAttestation" />
                  </b>
                </label>
              </Grid>

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >

                {selfAttestationFlag ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setChoice("selfAttestation");
                      handleOpen();
                    }}
                  >
                    {" "}
                    {language ==="en"?  "Preview" : "पूर्वावलोकन"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setChoice("selfAttestation");
                      handleOpen();
                    }}
                  >
                    {" "}
                    <FormattedLabel id="generate" />
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Buttons Row */}

          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                color="success"
                variant="contained"
                type="submit"
                disabled={isOverduePayment || (selfDeclarationFlag && selfAttestationFlag ? false : true)}
                endIcon={<Save />}
              >
                <FormattedLabel id="save" />
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button variant="outlined" color="error" onClick={clearFields} endIcon={<Clear />}>
                <FormattedLabel id="clear" />
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToApp />}
                onClick={() => {
                  //   isDeptUser
                  //     ? router.push(`/veterinaryManagementSystem/transactions/petLicense/application`)
                  //     : router.push(`/dashboard`);
                  router.push(
                    `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`,
                  );
                }}
              >
                <FormattedLabel id="exit" />
                {/* {labels["exit"]} */}
              </Button>
            </Grid>
          </Grid>

          {/* View Demand Letter */}

          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {choice && choice === "selfDeclaration" && selectedHutData && (
                  <SelfDeclaration
                    applicantData={applicantData}
                    hutData={selectedHutData}
                    handleClose={handleClose}
                    setSelfDeclarationFlag={setSelfDeclarationFlag}
                    selfDeclarationFlag={selfDeclarationFlag}
                  />
                )}
                {choice && choice === "selfAttestation" && selectedHutData && (
                  <SelfAttestation
                    applicantData={applicantData}
                    hutData={selectedHutData}
                    handleClose={handleClose}
                    setSelfAttestationFlag={setSelfAttestationFlag}
                    selfAttestationFlag={selfAttestationFlag}
                  />
                )}
              </Box>
            </Modal>
          </div>

          <div>
          <Modal
                                title="Modal For Payment"
                                open={isModalOpenForResolved}
                                onOk={true}
                                onClose={handleCancel} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
                                footer=""
                                // width="1800px"
                                // height="auto"
                                sx={{
                                    padding: 5,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "90%",
                                        backgroundColor: "white",
                                        height: "40vh",
                                    }}
                                >

                                    <Box style={{ height: "60vh" }}>
                                        <>
                                            <Grid container sx={{ padding: "10px" }}>
                                                <Grid item
                                                    spacing={3}
                                                    xl={6}
                                                    lg={6}
                                                    md={6}

                                                    sm={12}
                                                    xs={12} sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 20
                                                    }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ExitToAppIcon />}
                                                        onClick={() => changePaymentStatus()}
                                                    >
                                                        <FormattedLabel id="payment" />
                                                    </Button>
                                                </Grid>
                                                <Grid item
                                                    spacing={3}
                                                    xl={6}
                                                    lg={6}
                                                    md={6}

                                                    sm={12}
                                                    xs={12} sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 20
                                                    }}>
                                                    <Button
                                                        sx={{ marginRight: 8 }}
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ClearIcon />}
                                                        onClick={() => handleCancel()}
                                                    >
                                                        <FormattedLabel id="closeModal" />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </>
                                    </Box>
                                </Box>
                            </Modal>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default Index;
