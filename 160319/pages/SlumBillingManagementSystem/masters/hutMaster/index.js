import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel, Box,
  MenuItem,
  Paper,
  Select, FormLabel, Checkbox,
  Slide,
  TextField,
  Tooltip,
  ListItem,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { GridToolbar } from "@mui/x-data-grid";

import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import hutMasterSchema from "../../../../containers/schema/slumManagementSchema/hutMasterSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(hutMasterSchema) });
  const [pageSize, setPageSize] = useState();
  const router1 = useRouter()
  const [dataFromDUR, setDataFromDUR] = useState(false)

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [zoneDetails, setZoneDetails] = useState();
  const [slumDetails, setSlumDetails] = useState();
  const [owershipDetails, setOwnershipDetails] = useState();
  const [constrctionDetails, setConstructionDetails] = useState();
  const [usageSubTypeDetails, setUsageSubTypeDetails] = useState();
  const [usageDetails, setUsageTypeDetails] = useState();
  const [rehabilitation, setIsCheckedrehabilitation] = useState(false)
  const [eligibility, setIsCheckedeligibility] = useState(false)
  const [waterConnection, setIsCheckedwaterConnection] = useState(false)
  // const label = { inputProps: { "aria-label": "Checkbox demo" } }

  const [selectUsageType, setUsageTypes] = useState(null)
  const [areaDetails, setAreaDetails] = useState()
  const [villageDetails, setVillageDetails] = useState()
  const [cityDetails, setCityDetails] = useState()
  const router = useRouter()

  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();

  useEffect(() => {
    getZone()
  }, []);

  useEffect(() => {

    getSlumDetails()
  }, [])

  useEffect(() => {
    getOwnershipType()
  }, [])

  useEffect(() => {
    getConstructionType()
  }, [])

  useEffect(() => {
    getUsageType()
  }, [])


  useEffect(() => {
    getAreaDetails()
  }, [])

  useEffect(() => {
    // getCityDetails()
  }, [])
  useEffect(() => {
    getVillageDetails()
  }, [])

  useEffect(() => {
    getHutMaster();
  }, [])



  useEffect(() => {
    if (selectUsageType !== null) {
      getUsageSubTypeDetails()
    }
  }, [])
  // }, [selectUsageType])
  const getAreaDetails = () => {
    axios.get(`${urls.SLUMURL}/master/area/getAll`).then((res) => {
      setAreaDetails(
        res.data.area.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          areaName: r.areaName,

        }))
      )
    })
  }
  const getVillageDetails = () => {
    axios.get(`${urls.SLUMURL}/master/village/getAll`).then((res) => {
      setVillageDetails(
        res.data.village.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          villageName: r.villageName,

        }))
      )
    })
  }


  // const getVillageDetails=()=>{
  //   axios.get(`${urls.CFCURL}/master/village/getAll`).then((res) => {
  //     setVillageDetails(
  //       res.data.village.map((r, i) => ({
  //         id: r.id,
  //         srNo: i + 1,
  //         villageName: r.villageName,

  //       }))
  //     )
  //   })
  // } 

  const getZone = () => {
    axios.get(`${urls.SLUMURL}/master/zone/getAll`).then((res) => {
      setZoneDetails(
        res.data.zone.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          zoneName: r.zoneName,
          zone: r.zone,
          ward: r.ward,
          area: r.area,
          zooAddress: r.zooAddress,
          zooAddressAreaInAcres: r.zooAddressAreaInAcres,
          zooApproved: r.zooApproved,
          zooFamousFor: r.zooFamousFor,
        }))
      )
    })
  }

  const getSlumDetails = () => {
    axios.get(`${urls.SLUMURL}/mstSlum/getAll`).then((res) => {
      setSlumDetails(
        res.data.mstSlumList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          slumName: r.slumName,

        }))
      )
    })
  }

  const getOwnershipType = () => {
    axios.get(`${urls.SLUMURL}/mstSbOwnershipType/getAll`).then((res) => {
      setOwnershipDetails(
        res.data.mstSbOwnershipTypeList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          ownershipType: r.ownershipType,
        }))
      )
    })
  }

  const getHutMaster = (_pageSize = 10, _pageNo = 0) => {

    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        console.log(";res", res.data.mstHutList);

        let result = res.data.mstHutList;
        const _res = result.map((res, i) => {
          console.log("@@@", res)
          return {
            srNo: i + 1,
            id: res.id,
            hutPrefix: res.hutPrefix,
            zoneKey: res.zoneKey,

            hutNo: res.hutNo,
            ownershipKey: res.ownershipKey,

            slumKey: res.slumKey,
            areaOfHut: res.areaOfHut,
            length: res.length,
            breadth: res.breadth,
            height: res.height,
            constructionTypeKey: res.constructionTypeKey,
            usageTypeKey: res.usageTypeKey,
            usageSubTypeKey: res.usageSubTypeKey,

            rehabilitation: res.rehabilitation === "Yes" ? true : false,
            eligibility: res.eligibility === "eligible" ? true : false,
            waterConnection: res.waterConnection === "Yes" ? true : false,
            noOfFloors: res.noOfFloors,
            maleCount: res.maleCount,
            femaleCount: res.femaleCount,
            totalFamilyMembers: res.totalFamilyMembers,
            areaKey: res.areaKey,
            villageKey: res.villageKey,
            cityKey: res.cityKey,
            pincode: res.pincode,
            lattitude: res.lattitude,
            longitude: res.longitude,
            assemblyConstituency: res.assemblyConstituency,
            partNoInList: res.partNoInList,
            correction: res.correction,
            remarks: res.remarks,
            zoneName:zoneDetails?.find((obj) => { return obj.id == res.zoneKey }) ? zoneDetails.find((obj) => { return obj.id == res.zoneKey }).zoneName : "-",
            // slumName: slumDetails?.find((obj) => obj?.id === res.slumKey)
            //   ?.slumName,
              slumName:slumDetails?.find((obj) => { return obj.id == res.slumKey }) ? slumDetails.find((obj) => { return obj.id == res.slumKey }).slumName : "-",
            ownershipName:owershipDetails.find((obj) => { return obj.id == res.ownershipKey }) ? owershipDetails.find((obj) => { return obj.id == res.ownershipKey }).ownershipType : "-",
            constructionTypeName: constrctionDetails.find((obj) => { return obj.id == res.constructionTypeKey }) ? constrctionDetails.find((obj) => { return obj.id == res.constructionTypeKey }).constructionType : "-",
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
        })

        setDataSource([..._res]);
        console.log("check", res)
        setIsCheckedrehabilitation(res.rehabilitation === "Yes" ? true : false)

        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      });
  };

  const getConstructionType = () => {
    axios.get(`${urls.SLUMURL}/mstConstructionType/getAll`).then((res) => {
      setConstructionDetails(
        res.data.mstConstructionTypeList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          constructionType: r.constructionType,
        }))
      )
    })
  }

  const getUsageType = () => {
    axios.get(`${urls.SLUMURL}/mstSbUsageType/getAll`).then((res) => {
      setUsageTypeDetails(
        res.data.mstSbUsageTypeList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          usageType: r.usageType,
        }))
      )
    })
  }


  const getUsageSubTypeDetails = () => {
    axios
      .get(
        `${urls.SLUMURL}/mstSbSubUsageType/getSubUsageByUsageId?id=${selectUsageType}`
        // `${urls.SLUMURL}/mstSbSubUsageType/getAll`
      )
      .then((res) => {
        // setUsageSubTypeDetails({...res
        setUsageSubTypeDetails(
          res.data.mstSbSubUsageTypeList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            subUsageType: r.subUsageType,
            // zone: r.zone,
            // ward: r.ward,
            // area: r.area,
            // zooAddress: r.zooAddress,
            // zooAddressAreaInAcres: r.zooAddressAreaInAcres,
            // zooApproved: r.zooApproved,
            // zooFamousFor: r.zooFamousFor,
          }))
        )
      })
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstSbOwnershipType/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getHutMaster();
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
          axios
            .post(`${urls.SLUMURL}/mstSbOwnershipType/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getHutMaster();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setIsCheckedeligibility(false)
    setIsCheckedrehabilitation(false)
    setIsCheckedwaterConnection(false)
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
      rehabilitation: rehabilitation == true ? "Yes" : "No",
      eligibility: eligibility == true ? "eligible" : "not_eligible",
      waterConnection: waterConnection == true ? "Yes" : "No",
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.SLUMURL}/mstHut/save`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getHutMaster();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const resetValuesExit = {
    areaKey: "",
    areaOfHut: "",
    assemblyConstituency: "",
    breadth: "",
    cityKey: "",
    constructionTypeKey: "",
    correction: "",
    eligibility: false,
    femaleCount: "",
    height: "",
    hutNo: "",
    hutPrefix: "",
    lattitude: "",
    length: "",
    longitude: "",
    maleCount: "",
    noOfFloors: "",
    ownershipKey: "",
    ownershipType: "",
    ownershipTypeMr: "",
    ownershipTypePrefix: "",
    partNoInList: "",
    pincode: "",
    rehabilitation: false,
    remarks: "",
    totalFamilyMembers: "",
    usageSubTypeKey: "",
    usageTypeKey: "",
    villageKey: "",
    waterConnection: false,
    zoneKey: ""
  };

  const cancellButton = () => {
    setIsCheckedeligibility(false)
    setIsCheckedrehabilitation(false)
    setIsCheckedwaterConnection(false)
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    areaKey: "",
    areaOfHut: "",
    assemblyConstituency: "",
    breadth: "",
    cityKey: "",
    constructionTypeKey: "",
    correction: "",
    eligibility: false,
    femaleCount: "",
    height: "",
    hutNo: "",
    hutPrefix: "",
    lattitude: "",
    length: "",
    longitude: "",
    maleCount: "",
    noOfFloors: "",
    ownershipKey: "",
    ownershipType: "",
    ownershipTypeMr: "",
    ownershipTypePrefix: "",
    partNoInList: "",
    pincode: "",
    rehabilitation: false,
    remarks: "",
    totalFamilyMembers: "",
    usageSubTypeKey: "",
    usageTypeKey: "",
    villageKey: "",
    waterConnection: false,
    zoneKey: ""
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },


    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneKey" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "hutNo",
      headerName: <FormattedLabel id="hutNo" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "slumName",
      headerName: <FormattedLabel id="slumKey" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "areaOfHut",
      headerName: <FormattedLabel id="areaOfHut" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "ownershipName",
      headerName: <FormattedLabel id="ownershipKey" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "constructionTypeName",
      headerName: <FormattedLabel id="constructionTypeKey" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
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
                setIsCheckedrehabilitation(params.row.rehabilitation)
                setIsCheckedeligibility(params.row.eligibility)
                setIsCheckedwaterConnection(params.row.waterConnection)
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
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

            <IconButton


              disabled={editButtonInputState}
              onClick={() => {
                {
                  router1.push({
                    pathname:
                      "/SlumBillingManagementSystem/masters/hutMember",
                    query: { id: params.row.id },
                  })
                }

              }}
            >
              <Tooltip title="Hut Member">
                <MenuIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* <div
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
        
        <FormattedLabel id='hutMaster' />
      </div> */}
      <Paper elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}>
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
          <h2> <FormattedLabel id='hutMaster' /></h2>
        </Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="hutPrefix" />}
                    variant="standard"
                    {...register("hutPrefix")}
                    error={!!errors.hutPrefix}
                    helperText={
                      errors?.hutPrefix ? errors.hutPrefix.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.zoneKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="zoneKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => field.onChange(value)}
                        >
                          {zoneDetails &&
                            zoneDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.zoneName
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="zoneKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.zoneKey ? errors.zoneKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="hutNo" />}
                    variant="standard"
                    {...register("hutNo")}
                    error={!!errors.hutNo}
                    helperText={
                      errors?.hutNo ? errors.hutNo.message : null
                    }
                  />
                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.slumKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="slumKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => field.onChange(value)}
                        >
                          {slumDetails &&
                            slumDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.slumName
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="zoneKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.slumKey ? errors.slumKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "200px", marginTop: "2%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="areaOfHut" />}
                    variant="standard"
                    {...register("areaOfHut")}
                    error={!!errors.areaOfHut}
                    helperText={
                      errors?.areaOfHut ? errors.areaOfHut.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.ownershipKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="ownershipKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => field.onChange(value)}
                        >
                          {owershipDetails &&
                            owershipDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.ownershipType
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="ownershipKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.ownershipKey ? errors.ownershipKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.constructionTypeKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="constructionTypeKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => field.onChange(value)}
                        >
                          {constrctionDetails &&
                            constrctionDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.constructionType
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="constructionTypeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.constructionTypeKey ? errors.constructionTypeKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.usageTypeKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="usageTypeKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => {
                            field.onChange(value)
                            setUsageTypes(value.target.value)
                            getUsageSubTypeDetails()
                          }}
                        >
                          {usageDetails &&
                            usageDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.usageType
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="usageTypeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.usageTypeKey ? errors.usageTypeKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.usageSubTypeKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="usageSubTypeKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => field.onChange(value)}
                        >
                          {usageSubTypeDetails &&
                            usageSubTypeDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.subUsageType
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="usageSubTypeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.usageSubTypeKey ? errors.usageSubTypeKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "200px", marginTop: "2%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="length" />}
                    variant="standard"
                    {...register("length")}
                    error={!!errors.length}
                    helperText={
                      errors?.length ? errors.length.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="breadth" />}
                    variant="standard"
                    {...register("breadth")}
                    error={!!errors.breadth}
                    helperText={
                      errors?.breadth ? errors.breadth.message : null
                    }
                  />
                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "200px", marginTop: "2%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="height" />}
                    variant="standard"
                    {...register("height")}
                    error={!!errors.height}
                    helperText={
                      errors?.height ? errors.height.message : null
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="noOfFloors" />}
                    variant="standard"
                    {...register("noOfFloors")}
                    error={!!errors.noOfFloors}
                    helperText={
                      errors?.noOfFloors ? errors.noOfFloors.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "200px", marginTop: "2%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="totalFamilyMembers" />}
                    variant="standard"
                    {...register("totalFamilyMembers")}
                    error={!!errors.totalFamilyMembers}
                    helperText={
                      errors?.totalFamilyMembers ? errors.totalFamilyMembers.message : null
                    }
                  />
                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "200px", marginTop: "2%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="maleCount" />}
                    variant="standard"
                    {...register("maleCount")}
                    error={!!errors.maleCount}
                    helperText={
                      errors?.maleCount ? errors.maleCount.message : null
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "200px", marginTop: "2%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="femaleCount" />}
                    variant="standard"
                    {...register("femaleCount")}
                    error={!!errors.femaleCount}
                    helperText={
                      errors?.femaleCount ? errors.femaleCount.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "200px", marginTop: "2%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="assemblyConstituency" />}
                    variant="standard"
                    {...register("assemblyConstituency")}
                    error={!!errors.assemblyConstituency}
                    helperText={
                      errors?.assemblyConstituency ? errors.assemblyConstituency.message : null
                    }
                  />
                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="partNoInList" />}
                    variant="standard"
                    {...register("partNoInList")}
                    error={!!errors.partNoInList}
                    helperText={
                      errors?.partNoInList ? errors.partNoInList.message : null
                    }
                  />
                </Grid>

                {/* <Grid container style={{padding:"10px"}}> */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop:"2%"
                  }}
                >
                  <FormLabel
                    id="demo-controlled-radio-buttons-group"
                  // style={{ minWidth: "230px" }}
                  >
                    <FormattedLabel id="rehabilitation" />
                    <Checkbox value={rehabilitation}
                      checked={rehabilitation ? true : false}
                      onChange={() => {
                        console.log("reahbilitation " + !rehabilitation)
                        setIsCheckedrehabilitation(!rehabilitation)
                      }} />

                  </FormLabel>

                  <FormLabel id="demo-controlled-radio-buttons-group">
                    <FormattedLabel id="eligibility" />

                    <Checkbox value={eligibility}
                      checked={eligibility ? true : false}
                      onChange={() => {
                        console.log("eligibility " + !eligibility)
                        setIsCheckedeligibility(!eligibility)
                      }} />
                  </FormLabel>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    <FormattedLabel id="waterConnection" />

                    <Checkbox value={waterConnection}
                      checked={waterConnection ? true : false}
                      onChange={() => {
                        console.log("waterConnection " + !waterConnection)
                        setIsCheckedwaterConnection(!waterConnection)
                      }} />
                  </FormLabel>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.areaKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="areaKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => field.onChange(value)}
                        >
                          {areaDetails &&
                            areaDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.areaName
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="areaKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.areaKey ? errors.areaKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.villageKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="villageKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => {
                            field.onChange(value)
                            // setUsageTypes(value.target.value)
                          }}
                        >
                          {villageDetails &&
                            villageDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.villageName
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="villageKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.villageKey ? errors.villageKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>


                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.cityKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                    // disabled={isDisabled}
                    >
                      <FormattedLabel id="cityKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            field.value
                          }
                          onChange={(value) => field.onChange(value)}
                        >
                          {usageSubTypeDetails &&
                            usageSubTypeDetails.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  value?.id
                                }
                              >
                                {
                                  value?.subUsageType
                                }
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="cityKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.cityKey ? errors.cityKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}

                {/* <Grid container style={{ padding: "10px" }}> */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ width: "200px", marginTop: "2%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="pincode" />}
                      variant="standard"
                      {...register("pincode")}
                      error={!!errors.pincode}
                      helperText={
                        errors?.pincode ? errors.pincode.message : null
                      }
                    />
                  </Grid>
                  <Grid container style={{ padding: "10px" }}> 
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "200px", marginTop: "2%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="lattitude" />}
                      variant="standard"
                      {...register("lattitude")}
                      error={!!errors.lattitude}
                      helperText={
                        errors?.lattitude ? errors.lattitude.message : null
                      }
                    />
                  </Grid>


                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ width: "200px", marginTop: "2%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="longitude" />}
                      variant="standard"
                      {...register("longitude")}
                      error={!!errors.longitude}
                      helperText={
                        errors?.longitude ? errors.longitude.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ width: "200px", marginTop: "2%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="correction" />}
                      variant="standard"
                      {...register("correction")}
                      error={!!errors.correction}
                      helperText={
                        errors?.correction ? errors.correction.message : null
                      }
                    />
                  </Grid>
                </Grid>

                {/* <Grid container style={{ padding: "10px" }}> */}
                 
                  {/* <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    sx={{ marginTop: "2%" }}
                  >
                    <TextField
                      size="small"
                      sx={{ width: "200px", marginTop: "2%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="remarks" />}
                      variant="standard"
                      {...register("remarks")}
                      error={!!errors.remarks}
                      helperText={
                        errors?.remarks ? errors.remarks.message : null
                      }
                    />
                  </Grid> */}

                {/* </Grid> */}
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    sx={{ marginTop: "2%" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText == 'Save' ? (
                        <FormattedLabel id="save" />
                      ) : (
                        <FormattedLabel id="update" />
                      )}
                    </Button>{' '}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ marginTop: "2%" }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    sx={{ marginTop: "2%" }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>

              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
        <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "end" }}
          >
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
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
        <DataGrid
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
          density="compact"
          pagination
          paginationMode="server"
          rowCount={totalElements}
          rowsPerPageOptions={[5]}
          pageSize={pageSize}
          rows={dataSource}
          columns={columns}
          onPageChange={(_data) => {
            getHutMaster(pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getHutMaster(pageSize, _data);
          }}
        //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
