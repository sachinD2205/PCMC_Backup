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
import SelfAttestation from "../generateDocuments/selfAttestation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

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
    width: "50%",
    height: "50%",
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

  const [ID, setId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [occupierPhoto, setOccupierPhoto] = useState(null);
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
  const [viewAddName, setViewAddName] = useState(false);
  const [viewExistingOwnerName, setViewExistingOwnerName] = useState(false);
  const [openEntryConnections, setOpenEntryConnections] = useState(false);
  const handleOpenEntryConnections = () => setOpenEntryConnections(true);
  const handleCloseEntryConnections = () => setOpenEntryConnections(false);
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
  const [zoneDropDown, setZoneDropDown] = useState([
    {
      id: 1,
      zoneEn: "",
      zoneMr: "",
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
  const [transferDropDown, setTransferDropDown] = useState([
    {
      id: 1,
      transferTypeEn: "",
      transferTypeMr: "",
    },
  ]);
  const [subTransferDropDown, setsubTransferDropDown] = useState([
    {
      id: 1,
      subTransferTypeEn: "",
      subTransferTypeMr: "",
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
    let temp = titleDropDown && titleDropDown.find((each)=> each.id == hutOwner?.title )
    console.log("titleDropDown", temp);
    setValue('ownerTitle', temp?.titleEn ? temp?.titleMr : "-")
    setValue("ownerFirstName", hutOwner?.firstName ? hutOwner?.firstName : "-");
    setValue("ownerMiddleName", hutOwner?.middleName ? hutOwner?.middleName : "-");
    setValue("ownerLastName", hutOwner?.lastName ? hutOwner?.lastName : "-");
    setValue("ownerMobileNo", hutOwner?.mobileNo ? hutOwner?.mobileNo : "-");
    setValue("ownerAadharNo", hutOwner?.aadharNo ? hutOwner?.aadharNo : "-");
    setValue("ownerEmailId", hutOwner?.emailId ? hutOwner?.emailId : "-");
    setValue('ocuupiersTitle', temp?.titleEn ? temp?.titleMr : "-")
    setValue("ocuupiersFirstName", selectedHut?.firstName ? selectedHut?.firstName : "-");
    setValue("ocuupiersMiddleName", selectedHut?.middleName ? selectedHut?.middleName : "-");
    setValue("ocuupierLastName", selectedHut?.lastName ? selectedHut?.lastName : "-");
    setValue("ocuupierMobileNo", selectedHut?.mobileNo ? selectedHut?.mobileNo : "-");
    setValue("ocuupierAadharNo", selectedHut?.aadharNo ? selectedHut?.aadharNo : "-");
    setValue("ocuupierEmailId", selectedHut?.emailId ? selectedHut?.emailId : "-");
    setValue(
      "cityKey",
      (language == "en"
        ? cityDropDown && cityDropDown.find((obj) => obj.id == selectedHut?.cityKey)?.cityEn
          ? cityDropDown && cityDropDown.find((obj) => obj.id == selectedHut?.cityKey)?.cityEn
          : cityDropDown && cityDropDown.find((obj) => obj.id == selectedHut?.cityKey)?.cityMr
        : "-"),
    );
    setValue("pincode", selectedHut?.pincode ? selectedHut?.pincode : "-");
    setValue("lattitude", selectedHut?.lattitude ? selectedHut?.lattitude : "-");
    setValue("longitude", selectedHut?.longitude ? selectedHut?.longitude : "-");
    setValue("oldHutNo", selectedHut?.hutNo ? selectedHut?.hutNo : "-");
    setValue("hutNo", selectedHut?.hutNo ? selectedHut?.hutNo : "");
  }, [hutOwnerData, selectedHutData]);

  useEffect(() => {
    getSlumData();
    getAreaData();
    getVillageData();
    getHutData();
    getTitleData();
    setValue("noOfCopies", 1);
  }, []);

  useEffect(()=>{
    getSlumData();
    getZone();
    getAreaData();
    getVillageData();
    getTitleData();
    getServiceCharges();
  },[selectedHutData]);
  
    // get Zone Name
    const getZone = () => {
      axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
        let result = res.data.zone;
        let _res =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            zoneEn: r.zoneName,
            zoneMr: r.zoneNameMr,
          };
        });
        setZoneDropDown(_res);
        // console.log("getZone",result);
      });
    };

    useEffect(() => {
      getServiceCharges();
    }, [watch("noOfCopies")]);
  
    const getServiceCharges = () => {
      axios.get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=123`).then((r) => {
        let temp = r.data.serviceCharge[0];
        console.log("getServiceCharges", temp);
        setValue("feesApplicable", watch("noOfCopies") * temp?.amount);
      });
    };

  const handleUploadDocument = (type, path) =>{
    console.log("handleUploadDocument",path);
      let temp = {
        documentPath: path,
        documentKey : 1,
        documentType : "",
        remark : "",
      }
      if(type === "proposedOwnerPhoto"){
        setPhoto(temp)
      }
      else{
        setOccupierPhoto(temp);
      }
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
      setTitleDropDown(res);
      
    });
  };

  const getHutData = (selectedId) => {
    axios.get(`${urls.SLUMURL}/mstHut/getAll`).then((r) => {
      let result = r.data.mstHutList;
      let selectedHut = result && result.find((obj) => obj.id == selectedId);
      let hutOwner = selectedHut && selectedHut.mstHutMembersList.find((obj) => obj.headOfFamily == "Yes");
      setHutOwnerData(hutOwner);
      setSelectedHutData(selectedHut);
      setHutKey(selectedHut?.id);
      setValue("hutNo", selectedHut?.hutNo);
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
      setValue("villageKey", temp?.villageEn ? temp?.villageMr : "-");
      setVillageDropDown(res);
    });
  };

  const getSlumData = () => {
    axios.get(`${urls.SLUMURL}/mstSlum/getAll`).then((r) => {
      let result = r.data.mstSlumList;
      // console.log("getSlumData", result);
      let res =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            slumEn: r.slumName,
            slumMr: r.slumNameMr,
          };
        });
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
      console.log("areaMr", temp);
      setValue("areaKey", temp?.areaEn ? temp?.areaMr : "-");
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
    console.log("formdata", formData);
    console.log("selectedHutData", selectedHutData);

    let body = {
      slumKey: selectedHutData?.slumKey,
      hutKey: hutKey,
      hutOwnerKey: hutOwnerData?.id,
      hutNo: formData?.newHutNo,
      applicationNo: null,
      currentOwnerTitle: formData?.ownerTitle,
      currentOwnerMiddleName: formData?.ownerMiddleName,
      currentOwnerFirstName: formData?.ownerFirstName,
      currentOwnerLastName: formData?.ownerLastName,
      currentOwnerMobileNo: formData?.ownerMobileNo,
      currentOwnerAadharNo: formData?.ownerAadharNo,
      currentOwnerEmailId: formData?.ownerEmailId,
      currentOccupierTitle: formData?.ocuupiersTitle,
      currentOccupierMiddleName: formData?.ocuupiersMiddleName,
      currentOccupierFirstName: formData?.ocuupiersFirstName,
      currentOccupierLastName: formData?.ocuupiersLastName,
      currentOccupierPhoto: occupierPhoto?.documentPath,
      currentOccupierMobileNo: formData?.ocuupiersMobileNo,
      currentOccupierAadharNo: formData?.ocuupiersAadharNo,
      currentOccupierEmailId: formData?.ocuupiersEmailId,
      proposedOwnerTitle: formData?.proposedOwnerTitle,
      proposedOwnerMiddleName: formData?.proposedOwnerMiddleName,
      proposedOwnerFirstName: formData?.proposedOwnerFirstName,
      proposedOwnerLastName: formData?.proposedOwnerLastName,
      proposedOwnerPhoto: photo?.documentPath,
      proposedOwnerMobileNo: formData?.proposedOwnerMobileNo,
      proposedOwnerAadharNo: formData?.proposedOwnerAadharNo,
      proposedOwnerEmailId: formData?.proposedOwnerEmailId,
      outstandingTax: formData?.propertyTaxesAmount,
      transferRemarks: formData?.transferRemarks,
      oldHutNo: formData?.oldHutNo,
      transferDate: formData?.transferDate,
      feesApplicable: formData?.feesApplicable,
      // transferTypeKey: "12",
      // transferSubTypeKey: "1",
      saleValue: formData?.saleValue,
      marketValue: formData?.marketValue,
      areaOfHut: formData?.areaOfHut,
      status: null,
      // remarks: "",
      transferHutMembersList: [],
    };
    console.log("body", body);

    // setDataSource(body);

    if (btnSaveText === "Save") {
      if (loggedInUser === "citizenUser") {
        const tempData = axios
          .post(`${urls.SLUMURL}/trnTransferHut/save`, body, {
            headers: {
              UserId: user.id,
            },
          })
          .then((res) => {
            // if (res.status == 201) {
            //   sweetAlert("Saved!", "Application of Transfer Hut Saved successfully !", "success");
            //   router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
            // }

            console.log("res", res);
            if (res.status == 201) {
                    sweetAlert({
                        title: "Saved!",
                        text: "Hut Transfer Application Saved successfully !",
                        icon: "success",
                        dangerMode: false,
                        closeOnClickOutside: false,
                    }).then((will) => {
                        if (will) {
                            sweetAlert({
                                // title: "Great!",
                                text: ` Your Hut Transfer Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                icon: "success",
                                buttons: ["View Acknowledgement", "Go To Hut Transfer Details"],
                                dangerMode: false,
                                closeOnClickOutside: false,
                            }).then((will) => {
                                if (will) {
                                    {
                                        router.push('/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails')
                                    }
                                    // removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                } else {
                                    router.push({
                                        pathname:
                                            "/SlumBillingManagementSystem/transactions/acknowledgement/hutTransfer",
                                        query: { id: res.data.message.split('[')[1].split(']')[0] },
                                    })
                                    // removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                }
                            })
                        }
                    })
                    // var a = res.data.message;
                    // getApplicationDetails(res.data.message.split('[')[1].split(']')[0])
                    // setApplicationNumberDetails(res.data.message.split('[')[1].split(']')[0])
                    // setIsModalOpenForResolved(true)

            }
            else {
                sweetAlert("Error!", "Something Went Wrong !", "error");
            }
          });
      } else {
        const tempData = axios
          .post(`${urls.SLUMURL}/trnTransferHut/save`, body, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            // if (res.status == 201) {
            //   sweetAlert("Saved!", "Application of Transfer Hut Saved successfully !", "success");
            //   router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
            // }

            console.log("res", res);
            if (res.status == 201) {
                    sweetAlert({
                        title: "Saved!",
                        text: "Hut Transfer Application Saved successfully !",
                        icon: "success",
                        dangerMode: false,
                        closeOnClickOutside: false,
                    }).then((will) => {
                        if (will) {
                            sweetAlert({
                                // title: "Great!",
                                text: ` Your Hut Transfer Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                icon: "success",
                                buttons: ["View Acknowledgement", "Go To Hut Transfer Details"],
                                dangerMode: false,
                                closeOnClickOutside: false,
                            }).then((will) => {
                                if (will) {
                                    {
                                        router.push('/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails')
                                    }
                                    // removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                } else {
                                    router.push({
                                        pathname:
                                            "/SlumBillingManagementSystem/transactions/acknowledgement/hutTransfer",
                                        query: { id: res.data.message.split('[')[1].split(']')[0] },
                                    })
                                    // removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                }
                            })
                        }
                    })
                    // var a = res.data.message;
                    // getApplicationDetails(res.data.message.split('[')[1].split(']')[0])
                    // setApplicationNumberDetails(res.data.message.split('[')[1].split(']')[0])
                    // setIsModalOpenForResolved(true)

            }
            else {
                sweetAlert("Error!", "Something Went Wrong !", "error");
            }
          });
      }
    }
  };

  const handlePaymentButton = () => {};

  const columns = [
    //Sr No
    { field: "srNo", width: 50, headerName: <FormattedLabel id="srNo" />, flex: 1 },

    // hutNo
    {
      field: language === "en" ? "hutNo" : "hutNo",
      headerName: <FormattedLabel id="hutNo" />,
      width: 200,
    },

    // slumKey
    {
      field: language === "en" ? "slum" : "slumMr",
      headerName: <FormattedLabel id="slumKey" />,
      width: 200,
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
              <FormattedLabel id="searchHutDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Hut No */}
            <Grid
              item
              xl={3}
              lg={3}
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
                sx={{ width: "250px" }}
                label={<FormattedLabel id="hutNo" />}
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

            {/* Slum Name */}
            <Grid
              item
              xl={3}
              lg={3}
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
                error={!!error.slumKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="slumName" />
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
                      label="slumKey"
                    >
                      {slumDropDown &&
                        slumDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.slumEn
                              : // @ts-ignore
                                value?.slumMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="slumKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{error?.slumKey ? error.slumKey.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Zone Name */}
            <Grid
              item
              xl={3}
              lg={3}
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
                error={!!error.zoneKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zoneName" />
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
                      label="zoneKey"
                    >
                      {zoneDropDown &&
                        zoneDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.zoneEn
                              : // @ts-ignore
                                value?.zoneMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="zoneKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{error?.zoneKey ? error.zoneKey.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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

          {/* Modal to select Hut details */}

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

          {/* Hut Owners Details */}
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
                label={<FormattedLabel id="title" />}
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
                label={<FormattedLabel id="firstName" />}
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
                label={<FormattedLabel id="middleName" />}
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
                label={<FormattedLabel id="lastName" />}
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
                label={<FormattedLabel id="mobileNo" />}
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
                label={<FormattedLabel id="emailId" />}
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
                label={<FormattedLabel id="aadharNo" />}
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
          </Grid>

          {/* Hut Occupier's Details */}
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
              <FormattedLabel id="hutOccupiersDetails" />
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
                label={<FormattedLabel id="title" />}
                // @ts-ignore
                variant="standard"
                value={watch("ocuupiersTitle")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ocuupiersTitle") ? true : false,
                }}
                error={!!error.ocuupiersTitle}
                helperText={error?.ocuupiersTitle ? error.ocuupiersTitle.message : null}
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
                label={<FormattedLabel id="firstName" />}
                // @ts-ignore
                variant="standard"
                value={watch("ocuupiersFirstName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ocuupiersFirstName") ? true : false,
                }}
                error={!!error.ocuupiersFirstName}
                helperText={error?.ocuupiersFirstName ? error.ocuupiersFirstName.message : null}
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
                label={<FormattedLabel id="middleName" />}
                // @ts-ignore
                variant="standard"
                value={watch("ocuupiersMiddleName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ocuupiersMiddleName") ? true : false,
                }}
                error={!!error.ocuupiersMiddleName}
                helperText={error?.ocuupiersMiddleName ? error.ocuupiersMiddleName.message : null}
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
                label={<FormattedLabel id="lastName" />}
                // @ts-ignore
                variant="standard"
                value={watch("ocuupiersLastName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ocuupiersLastName") ? true : false,
                }}
                error={!!error.ocuupiersLastName}
                helperText={error?.ocuupiersLastName ? error.ocuupiersLastName.message : null}
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
                label={<FormattedLabel id="mobileNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("ocuupiersMobileNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ocuupiersMobileNo") ? true : false,
                }}
                error={!!error.ocuupiersMobileNo}
                helperText={error?.ocuupiersMobileNo ? error.ocuupiersMobileNo.message : null}
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
                label={<FormattedLabel id="emailId" />}
                // @ts-ignore
                variant="standard"
                value={watch("ocuupiersEmailId")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ocuupiersEmailId") ? true : false,
                }}
                error={!!error.ocuupiersEmailId}
                helperText={error?.ocuupiersEmailId ? error.ocuupiersEmailId.message : null}
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
                label={<FormattedLabel id="aadharNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("ocuupiersAadharNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ocuupiersAadharNo") ? true : false,
                }}
                error={!!error.ocuupiersAadharNo}
                helperText={error?.ocuupiersAadharNo ? error.ocuupiersAadharNo.message : null}
              />
            </Grid>

                {/*  proposed occupier Upload Photos */}
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
                  <FormattedLabel id="photo" />
                </b>
              </label>
              <UploadButton
                appName="SLUM"
                serviceName="SLUM-Transfer"
                filePath={(path) => {
                  handleUploadDocument("occupierPhoto",path);
                }}
                fileName={occupierPhoto && occupierPhoto.documentPath}
              />
            </Grid>
          </Grid>

          {/* Hut Address Details */}

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
              <FormattedLabel id="hutAddressDetails" />
            </h2>
          </Box>

          <Grid container>
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
                label={<FormattedLabel id="area" />}
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
                label={<FormattedLabel id="village" />}
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
            </Grid>

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
                label={<FormattedLabel id="pincode" />}
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
                label={<FormattedLabel id="lattitude" />}
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
                label={<FormattedLabel id="longitude" />}
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

            {/******* Additional Fields *********/}

            <Box
            style={{
              marginTop: "10px",
              marginBottom: "10px",
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
                label={<FormattedLabel id="noOfCopies" />}
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
                label={<FormattedLabel id="feesApplicable" />}
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

          {/* Outstanding amount */}

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
                  marginTop: "10px",
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
                  marginTop: "10px",
                }}
              >
                <Button variant="contained" disabled={!isOverduePayment} onClick={handlePaymentButton}>
                <FormattedLabel id="payment" />
                </Button>
              </Grid>
            </Grid>

            {/* <Grid container sx={{ padding: "10px" }}>
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
              <h4>
                <FormattedLabel id="details" />:
              </h4>
            </Grid> */}

          </Grid>

          {/********* Transfer Details *********/}

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
              <FormattedLabel id="transferDetails" />
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
                label={<FormattedLabel id="hutNo" />}
                // @ts-ignore
                variant="standard"
                {...register("newHutNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("newHutNo") ? true : false,
                }}
                error={!!error.newHutNo}
                helperText={error?.newHutNo ? error.newHutNo.message : null}
              />
            </Grid>

            {/* Old Hut No */}
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
                label={<FormattedLabel id="oldHutNo" />}
                // @ts-ignore
                variant="standard"
                {...register("oldHutNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("oldHutNo") ? true : false,
                }}
                error={!!error.oldHutNo}
                helperText={error?.oldHutNo ? error.oldHutNo.message : null}
              />
            </Grid>

            {/* Transfer Type */}
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
                error={!!error.transferTypeKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="transferType" />
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
                    >
                      {transferDropDown &&
                        transferDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.transferTypeEn
                              : // @ts-ignore
                                value?.transferTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="transferTypeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.transferTypeKey ? error.transferTypeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* sub Transfer Type */}
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
                error={!!error.subTransferTypeKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="subTransferType" />
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
                    >
                      {subTransferDropDown &&
                        subTransferDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.subTransferTypeEn
                              : // @ts-ignore
                                value?.subTransferTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="subTransferTypeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.subTransferTypeKey ? error.subTransferTypeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* transfer Date */}

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
              <FormControl error={!!error.transferDate}>
                <Controller
                  control={control}
                  name="transferDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="transferDate" />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) => {
                          // field.onChange(date)
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ width: "250px" }}
                            variant="standard"
                            size="small"
                            error={!!error.transferDate}
                            helperText={error?.transferDate ? error?.transferDate.message : null}
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

            {/* Sale Value */}
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
                label={<FormattedLabel id="saleValue" />}
                // @ts-ignore
                variant="standard"
                {...register("saleValue")}
                InputLabelProps={{
                  shrink: router.query.id || watch("saleValue") ? true : false,
                }}
                error={!!error.saleValue}
                helperText={error?.saleValue ? error.saleValue.message : null}
              />
            </Grid>

            {/* Market Value */}
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
                label={<FormattedLabel id="marketValue" />}
                // @ts-ignore
                variant="standard"
                {...register("marketValue")}
                InputLabelProps={{
                  shrink: router.query.id || watch("marketValue") ? true : false,
                }}
                error={!!error.marketValue}
                helperText={error?.marketValue ? error.marketValue.message : null}
              />
            </Grid>

            {/* Hut Area */}
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
                label={<FormattedLabel id="hutArea" />}
                // @ts-ignore
                variant="standard"
                {...register("areaOfHut")}
                InputLabelProps={{
                  shrink: router.query.id || watch("areaOfHut") ? true : false,
                }}
                error={!!error.areaOfHut}
                helperText={error?.areaOfHut ? error.areaOfHut.message : null}
              />
            </Grid>

            {/* Transfer Remark */}

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
                label={<FormattedLabel id="transferRemarks" />}
                // @ts-ignore
                variant="standard"
                {...register("transferRemarks")}
                InputLabelProps={{
                  shrink: router.query.id || watch("transferRemarks") ? true : false,
                }}
                error={!!error.transferRemarks}
                helperText={error?.transferRemarks ? error.transferRemarks.message : null}
              />
            </Grid>
          </Grid>

          {/* Proposed owner Details */}

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
              <FormattedLabel id="proposedOwnerDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* proposed Owner Title */}
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
                error={!!error.proposedOwnerTitle}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="proposedOwnerTitle" />
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
                  name="proposedOwnerTitle"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.proposedOwnerTitle ? error.proposedOwnerTitle.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* proposed Owner firstName (English) */}
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
                label={<FormattedLabel id="proposedOwnerFirstName" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerFirstName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerFirstName") ? true : false,
                }}
                error={!!error.proposedOwnerFirstName}
                helperText={error?.proposedOwnerFirstName ? error.proposedOwnerFirstName.message : null}
              />
            </Grid>

            {/* proposed Owner firstName (Marathi) */}
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
                label={<FormattedLabel id="proposedOwnerFirstNameMr" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerFirstNameMr")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerFirstNameMr") ? true : false,
                }}
                error={!!error.proposedOwnerFirstNameMr}
                helperText={error?.proposedOwnerFirstNameMr ? error.proposedOwnerFirstNameMr.message : null}
              />
            </Grid>

            {/* proposed Owner middleName (English) */}
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
                label={<FormattedLabel id="proposedOwnerMiddleName" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerMiddleName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerMiddleName") ? true : false,
                }}
                error={!!error.proposedOwnerMiddleName}
                helperText={error?.proposedOwnerMiddleName ? error.proposedOwnerMiddleName.message : null}
              />
            </Grid>

            {/* proposed Owner middleName (Marathi) */}
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
                label={<FormattedLabel id="proposedOwnerMiddleNameMr" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerMiddleNameMr")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerMiddleNameMr") ? true : false,
                }}
                error={!!error.proposedOwnerMiddleNameMr}
                helperText={error?.proposedOwnerMiddleNameMr ? error.proposedOwnerMiddleNameMr.message : null}
              />
            </Grid>

            {/* proposed Owner lastName (English) */}
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
                label={<FormattedLabel id="proposedOwnerLastName" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerLastName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerLastName") ? true : false,
                }}
                error={!!error.proposedOwnerLastName}
                helperText={error?.proposedOwnerLastName ? error.proposedOwnerLastName.message : null}
              />
            </Grid>

            {/* proposed Owner lastName (Marathi) */}
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
                label={<FormattedLabel id="proposedOwnerLastNameMr" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerLastNameMr")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerLastNameMr") ? true : false,
                }}
                error={!!error.proposedOwnerLastNameMr}
                helperText={error?.proposedOwnerLastNameMr ? error.proposedOwnerLastNameMr.message : null}
              />
            </Grid>

            {/* proposed Owner mobileNo */}
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
                label={<FormattedLabel id="proposedOwnerMobileNo" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerMobileNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerMobileNo") ? true : false,
                }}
                error={!!error.proposedOwnerMobileNo}
                helperText={error?.proposedOwnerMobileNo ? error.proposedOwnerMobileNo.message : null}
              />
            </Grid>

            {/* proposed Owner emailId */}
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
                label={<FormattedLabel id="proposedOwnerEmailId" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerEmailId")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerEmailId") ? true : false,
                }}
                error={!!error.proposedOwnerEmailId}
                helperText={error?.proposedOwnerEmailId ? error.proposedOwnerEmailId.message : null}
              />
            </Grid>

            {/* proposed Owner aadharNo */}
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
                label={<FormattedLabel id="proposedOwnerAadharNo" />}
                // @ts-ignore
                variant="standard"
                {...register("proposedOwnerAadharNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerAadharNo") ? true : false,
                }}
                error={!!error.proposedOwnerAadharNo}
                helperText={error?.proposedOwnerAadharNo ? error.proposedOwnerAadharNo.message : null}
              />
            </Grid>

            {/*  proposed Owner Upload Photos */}
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
                  <FormattedLabel id="photo" />
                </b>
              </label>
              <UploadButton
                appName="SLUM"
                serviceName="SLUM-Transfer"
                filePath={(path) => {
                  handleUploadDocument("proposedOwnerPhoto",path);
                }}
                fileName={photo && photo.documentPath}
              />
            </Grid>
          </Grid>

          {/* Generate Document */}

          {/* <Box
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
          </Box> */}

          {/* <Grid container>
            <Grid container sx={{ padding: "10px" }}>
            
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
                <Button
                  variant="contained"
                  onClick={() => {
                    setChoice("selfDeclaration"), handleGenerateButton1();
                  }}
                >
                  <FormattedLabel id="generate" />
                </Button>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
      
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
                <Button
                  variant="contained"
                  onClick={() => {
                    setChoice("selfAttestation"), handleGenerateButton2();
                  }}
                >
                  <FormattedLabel id="generate" />
                </Button>
              </Grid>
            </Grid>
          </Grid> */}

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
                disabled={isOverduePayment}
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
                  router.push(`/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails`);
                }}
              >
                <FormattedLabel id="exit" />
                {/* {labels["exit"]} */}
              </Button>
            </Grid>
          </Grid>

          <Paper style={{ display: "none" }}>
            {console.log("selectedHutData", selectedHutData)}
            {choice && choice === "selfDeclaration" && selectedHutData && (
              <SelfDeclaration
                applicantData={applicantData}
                hutData={selectedHutData}
                componentRef={componentRef1}
              />
            )}
            {choice && choice === "selfAttestation" && selectedHutData && (
              <SelfAttestation
                applicantData={applicantData}
                hutData={selectedHutData}
                componentRef={componentRef2}
              />
            )}
          </Paper>
        </form>
      </Paper>
    </>
  );
};

export default Index;
