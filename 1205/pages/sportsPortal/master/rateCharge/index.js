import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import URLS from "../../../../URLS/urls";
//import styles from "../../../../styles/sportsPortalStyles/bookingTimeMaster.module.css";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import schema from "../../../../containers/schema/sportsPortalSchema/rateChargeSchema";

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
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [disable, setDisable] = useState(true);
  const [value, setValuee] = useState(null);
  const [valuee, setValueTwo] = useState(null);
  const [type, setType] = useState();
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [dateValue, setDateValue] = useState(null);
  const [venueNames, setVenueNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  // const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [applicantTypess, setApplicantTypess] = useState([]);
  const [chargeTypess, setChargeTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [venues, setVenues] = useState([]);
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  // EditSelectedRow
  const [editSelectedRow, setEditSelectedRow] = useState({});

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getCaseType();
  }, [zoneNames, wardNames, fetchData]);

  // useEffect - Reload On update , delete ,Saved on refresh
  // useEffect(() => {
  //   getAllDetails();
  // }, [
  //   zoneNames,
  //   wardNames,
  //   departments,
  //   // subDepartments,
  //   facilityNames,
  //   fetchData,
  //   facilityTypess,
  // ]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    // getDepartments();
    // getSubDepartments();
    getFacilityTypes();
    getFacilityName();
    getVenue();
    getVenueNames();
    getApplicantTypes();
    getChargeTypes();
    getDurationTypes();
  }, []);

  // getVenue -- Facility Type -- Facility Type
  const getVenue = () => {
    axios.get(`${URLS.SPURL}/venueMaster/getAll`).then((r) => {
      setVenues(
        r.data.venue.map((row) => ({
          id: row.id,
          venue: row.venue,
          venueMr: row.venueMr,
          // facilityName: row.facilityName,
          // facilityType: row.facilityType,
        })),
      );
    });
  };

  // getFacilityName --  Facility Type
  const getFacilityName = () => {
    axios.get(`${URLS.SPURL}/facilityName/getAll`).then((r) => {
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        })),
      );
    });
  };

  // getFacility Type
  const getFacilityTypes = () => {
    axios.get(`${URLS.SPURL}/facilityType/getAll`).then((r) => {
      console.log("facility types are:", r.data.facilityType);
      setFacilityTypess(r.data.facilityType);
      // setFacilityTypess(
      //   r.data.facilityType.map((row) => ({
      //     id: row.id,
      //     facilityType: row.facilityType,
      //   }))
      // );
    });
  };

  // Duration Type

  const [durationTypess, setDurationTypess] = useState([]);

  const getDurationTypes = () => {
    axios.get(`${URLS.SPURL}/master/durationType/getAll`).then((r) => {
      setDurationTypess(
        r.data.durationType.map((row) => ({
          id: row.id,
          typeName: row.typeName,
          typeNameMr: row.typeNameMr,
        })),
      );
    });
  };

  // getApplicant Type
  const getApplicantTypes = () => {
    axios.get(`${URLS.SPURL}/applicantType/getAll`).then((r) => {
      console.log(" types :", r.data.applicantType);
      setApplicantTypess(r.data.applicantType);
      setApplicantTypess(
        r.data.applicantType.map((row) => ({
          id: row.id,
          typeName: row.typeName,
          typeNameMr: row.typeNameMr,
        })),
      );
    });
  };
  // getFacility Type
  const getChargeTypes = () => {
    axios.get(`${URLS.SPURL}/chargeType/getAll`).then((r) => {
      console.log(" types :", r.data.applicantType);
      setChargeTypess(r.data.applicantType);
      setChargeTypess(
        r.data.chargeType.map((row) => ({
          id: row.id,
          //   applicantType: row.applicantType,
          //   applicantTypeMr: row.applicantTypeMr,
          typeName: row.typeName,
          typeNameMr: row.typeNameMr,
        })),
      );
    });
  };
  const getAllTypes = () => {
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };

  const getVenueNames = () => {
    axios.get(`${URLS.SPURL}/venueMaster/getAll`).then((r) => {
      setVenueNames(
        r.data.venue.map((row) => ({
          id: row.id,
          venue: row.venue,
          venueMr: row.venueMr,
          // facilityName: row.facilityName,
        })),
      );
    });
  };

  const getWardNames = () => {
    axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };
  // const getDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/department/getAll`).then((r) => {
  //     setDepartments(
  //       r.data.department.map((row) => ({
  //         id: row.id,
  //         department: row.department,
  //       })),
  //     );
  //   });
  // };

  // const getSubDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/subDepartment/getAll`).then((r) => {
  //     setSubDepartments(
  //       r.data.subDepartment.map((row) => ({
  //         id: row.id,
  //         subDepartmentName: row.subDepartment,
  //       })),
  //     );
  //   });
  // };

  // Get Data By ID
  // const getDataById = (value) => {
  //   console.log("clicked");
  //   setIsOpenCollapse(false);
  //   setID(value);
  //   const tempData = axios
  //     .get(`${urls.BaseURL}/facilityMaster/getFacilityMasterData/?id=${value}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       reset(res.data);
  //       setButtonInputState(true);
  //       setIsOpenCollapse(true);
  //       setBtnSaveText("Edit");
  //     });
  // };

  // Delete By ID
  // const deleteById = async (value) => {
  //   await axios

  //     .delete(`${urls.BaseURL}/bookingMaster/discardBookingMaster/${value}`)
  //     .then((res) => {
  //       if (res.status == 226) {
  //         message.success("Record Deleted !!!");
  //         getAllDetails();
  //         setButtonInputState(false);
  //       }
  //     });
  // };

  //Delete By ID(SweetAlert)

  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${URLS.SPURL}/bookingMaster/getAll/discardBookingMaster/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             getAllDetails();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
  //   });
  // };

  // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   // const date = moment(fromData.Date.d, "YYYY-MM-DD").format("YYYY-MM-DD");
  //   let fromBookingTime;
  //   let toBookingTime;
  //   if (moment(value).format("HH") >= 12) {
  //     fromBookingTime = moment(value).format("HH:mm:SS");
  //   } else {
  //     fromBookingTime = moment(value).format("HH:mm:SS");
  //   }

  //   if (moment(valuee).format("HH") >= 12) {
  //     toBookingTime = moment(valuee).format("HH:mm:SS");
  //   } else {
  //     toBookingTime = moment(valuee).format("HH:mm:SS");
  //   }

  //   // const fromBookingTime = moment(value).format("HH:mm") + ":00";
  //   // const toBookingTime = moment(valuee).format("HH:mm") + ":00";

  //   console.log("From", fromBookingTime);
  //   console.log("To", toBookingTime);

  //   // const toBookingTime = moment(fromData.toBookingTime).format(
  //   //   "YYYY-MM-DD hh:mm:ss"
  //   // );

  //   // console.log("To", valuee.getTime());
  //   // console.log("date kuthli ahe re: ", date);

  //   const finalBodyForApi = {
  //     ...fromData,
  //     fromBookingTime,
  //     toBookingTime,
  //   };

  //   console.log("DATA: ", finalBodyForApi);

  //   if (btnSaveText === "Save") {
  //     console.log("Post -----");
  //     const tempData = axios
  //       .post(
  //         `${urls.BaseURL}/bookingMaster/getAll/saveBookingMaster`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Saved !!!");
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");

  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  //   // Update Data Based On ID
  //   else if (btnSaveText === "Edit") {
  //     console.log("Put -----");
  //     const tempData = axios
  //       .post(
  //         `${urls.BaseURL}/bookingMaster/getAll/saveBookingMaster/?id=${id}`,

  //         fromData
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Updated !!!");
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");

  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //         }
  //       });
  //   }
  // };

  //Delete by ID(SweetAlert)
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${URLS.SPURL}/bookingMaster/saveBookingMaster`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getCaseType();
              // setButtonInputState(false);
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
          axios.post(`${URLS.SPURL}/bookingMaster/saveBookingMaster`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getPaymentRate();
              getCaseType();
              // setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };
  // Get Table - Data
  const getCaseType = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${URLS.SPURL}/master/rateCharge/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("get response", r);
        // console.log(r.fromDate, r.toDate);
        let result = r.data.rateCharge;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            // date: `${moment(r.fromDate, 'YYYY-MM-DD').format(
            //   'YYYY-MM-DD'
            // )} to ${moment(r.toDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}`,
            // date: r.toDate,
            //moment(date).format('YYYY-MM-DD')
            // date: moment(r.toDate).format('YYYY-MM-DD'),
            toDate: r.toDate,
            fromDate: r.fromDate,
            amount: r.amount,
            capacity: r.capacity,
            zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)?.zoneName,
            venue: venueNames?.find((obj) => obj?.id === r.venue)?.venue,
            wardName: wardNames?.find((obj) => obj?.id === r.wardName)?.wardName,
            // department: departments?.find((obj) => obj?.id === r.department)?.department,
            // subDepartment: subDepartments?.find((obj) => obj?.id === r.subDepartment)?.subDepartment,
            // fromBookingTime: moment(r.fromBookingTime, "hh:mm A").format(
            //   "hh:mm A"
            // ),
            fromBookingTime: moment(r.fromBookingTime, "HH:mm:ss A").format("HH:mm:ss A"),
            // toBookingTime: moment(r.toBookingTime, "hh:mm A").format("hh:mm A"),
            toBookingTime: moment(r.toBookingTime, "HH:mm:ss A").format("HH:mm:ss A"),
            facilityName: facilityNames?.find((obj) => obj?.id === r.facilityName)?.facilityName,
            facilityType: facilityTypess?.find((obj) => obj?.id === r.facilityType)?.facilityType,
            applicantType: applicantTypess?.find((obj) => obj?.id === r.applicantType)?.applicantType,
            venue: venues?.find((obj) => obj?.id === r.venue)?.venue,
            // id: r.id,
            // srNo: i + 1,
            // facilityTypeId: r.facilityTypeId,
            // geoCode: r.geoCode,
            // zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
            //   ?.zoneName,
            // wardName: wardNames?.find((obj) => obj?.id === r.wardName)
            //   ?.wardName,
            // department: departments?.find((obj) => obj?.id === r.department)
            //   ?.department,
            // subDepartment: subDepartments?.find(
            //   (obj) => obj?.id === r.subDepartment
            // )?.subDepartment,

            // facilityType: r.facilityType,
            // facilityPrefix: r.facilityPrefix,
            // facilityId: r.facilityId,
            // remark: r.remark,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);

        console.log("formated response", _res);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    console.log("submitted form:", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      // fromBookingTime: moment(fromData.fromBookingTime).format('LTS'),
      // fromBookingTime: moment(fromData.fromBookingTime).format('LT'),
      //   fromBookingTime: moment(fromData.fromBookingTime, "HH:mm:ss").format("HH:mm:ss"),
      // toBookingTime: moment(fromData.toBookingTime).format('LTS'),
      // toBookingTime: moment(fromData.toBookingTime).format('LT'),
      //   toBookingTime: moment(fromData.toBookingTime, "HH:mm:ss").format("HH:mm:ss"),
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    console.log("body", _body);
    if (btnSaveText === "Save") {
      const tempData = axios.post(`${URLS.SPURL}/master/rateCharge/save`, _body).then((res) => {
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");

          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      delete _body.venue;
      console.log("update body:", _body);
      const tempData = axios.post(`${URLS.SPURL}/bookingMaster/saveBookingMaster`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getCaseType();
          // setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
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
    setIsOpenCollapse(false);
    setDeleteButtonState(false);
    setEditButtonInputState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    zoneName: "",
    wardName: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venueName: "",
    toDate: null,
    fromDate: null,
    fromBookingTime: null,
    toBookingTime: null,
    capacity: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneName: "",
    wardName: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venueName: "",
    toDate: null,
    fromDate: null,
    fromBookingTime: null,
    toBookingTime: null,
    capacity: "",
    // fromDate: "",
    // toDate: "",
  };

  // Get Table - Data
  // const getAllDetails = () => {
  //   axios
  //     .get(`${URLS.SPURL}/bookingMaster/getAll`)
  //     .then((res) => {
  //       setDataSource(
  //         res.data.bookingMaster.map((r, i) => ({
  // id: r.id,
  // srNo: i + 1,
  // date: r.toDate,
  // capacity: r.capacity,
  // zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
  //   ?.zoneName,
  // venue: venueNames?.find((obj) => obj?.id === r.venue)?.venue,
  // wardName: wardNames?.find((obj) => obj?.id === r.wardName)
  //   ?.wardName,
  // department: departments?.find((obj) => obj?.id === r.department)
  //   ?.department,
  // // subDepartment: subDepartments?.find(
  // //   (obj) => obj?.id === r.subDepartment
  // // )?.subDepartment,
  // fromBookingTime: moment(r.fromBookingTime, "hh:mm A").format(
  //   "hh:mm A"
  // ),
  // toBookingTime: moment(r.toBookingTime, "hh:mm A").format("hh:mm A"),
  // facilityName: facilityNames?.find(
  //   (obj) => obj?.id === r.facilityName
  // )?.facilityName,
  // facilityType: facilityTypess?.find(
  //   (obj) => obj?.id === r.facilityType
  // )?.facilityType,
  //         }))
  //       );
  //     });
  // };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      padding: "2%",
    },
    // {
    //   // field: 'toDate',
    //   field: "date",
    //   headerName: <FormattedLabel id="toDate" />,
    //   //type: "number",
    //   flex: 1,
    // },

    {
      field: "zoneName",
      headerName: <FormattedLabel id="zone" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "wardName",
      headerName: <FormattedLabel id="ward" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "facilityType",
      headerName: <FormattedLabel id="facilityType" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "facilityName",
      headerName: <FormattedLabel id="facilityName" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "venue",
      headerName: <FormattedLabel id="venue" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "amount",
      headerName: "Amount",
      //type: "number",
      flex: 1,
    },

    {
      field: "toBookingTime",
      headerName: <FormattedLabel id="toBookingTime" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "capacity",
      headerName: <FormattedLabel id="capacity" />,
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "remark",
    //   headerName: "Remark",
    //   flex: 1,
    // },

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box
    //         sx={{
    //           // backgroundColor: "whitesmoke",
    //           width: "100%",
    //           height: "100%",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Edit"),
    //               setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             const wardId = wardNames.find(
    //               (obj) => obj?.wardName === params.row.wardName
    //             )?.id;

    //             const facilityNameId = facilityNames.find(
    //               (obj) => obj?.facilityName === params.row.facilityName
    //             )?.id;

    //             const zoneId = zoneNames.find(
    //               (obj) => obj?.zoneName === params.row.zoneName
    //             )?.id;

    //             const venueId = venueNames.find(
    //               (obj) => obj?.venueName === params.row.venueName
    //             )?.id;

    //             const departmentId = departments.find(
    //               (obj) => obj?.department === params.row.department
    //             )?.id;

    //             // const subDepartmentId = subDepartments.find(
    //             //   (obj) => obj?.subDepartment === params.row.subDepartment
    //             // )?.id;

    //             reset({
    //               ...params.row,
    //               wardName: wardId,
    //               zoneName: zoneId,
    //               venueName: venueId,
    //               department: departmentId,
    //               facilityName: facilityNameId,
    //               // subDepartment: subDepartmentId,
    //             });
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
    //       </Box>
    //     );
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
          // <Box>
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                // setBtnSaveText(<FormattedLabel id="update" />),
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                const wardId = wardNames.find((obj) => obj?.wardName === params.row.wardName)?.id;

                const facilityNameId = facilityNames.find(
                  (obj) => obj?.facilityName === params.row.facilityName,
                )?.id;

                const zoneId = zoneNames.find((obj) => obj?.zoneName === params.row.zoneName)?.id;

                const venueId = venueNames.find((obj) => obj?.venueName === params.row.venueName)?.id;

                // const departmentId = departments.find((obj) => obj?.department === params.row.department)?.id;

                // const subDepartmentId = subDepartments.find(
                //   (obj) => obj?.subDepartment === params.row.subDepartment,
                // )?.id;
                //facilityTypess
                const facilityTypeId = facilityTypess.find(
                  (obj) => obj?.facilityTypes === params.row.facilityTypes,
                )?.id;
                const applicantTypeId = applicantTypess.find(
                  (obj) => obj?.applicantTypes === params.row.applicantTypes,
                )?.id;
                // fromBookingTime: null,
                console.log(moment(params.row.fromBookingTime, "hh:mm A").format("hh:mm A"));
                const fromBookingTimee = moment(params.row.fromBookingTime, "hh:mm A").format("hh:mm A");
                // toBookingTime: null,
                //  const
                const toBookingTimee = moment(params.row.toBookingTime, "hh:mm A").format("hh:mm A");

                reset({
                  ...params.row,
                  wardName: wardId,
                  zoneName: zoneId,
                  venueName: venueId,
                  facilityName: facilityNameId,
                  // department: departmentId,
                  // subDepartment: subDepartmentId,
                  facilityType: facilityTypeId,
                  applicantType: applicantTypeId,
                  fromBookingTime: fromBookingTimee,
                  toBookingTime: toBookingTimee,
                });
                console.log("params.row: ", {
                  ...params.row,
                  wardName: wardId,
                  zoneName: zoneId,
                  venueName: venueId,
                  facilityName: facilityNameId,
                  // department: departmentId,
                  // subDepartment: subDepartmentId,
                });
                // reset({ ...params.row });
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
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
      <Paper sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5, padding: 1 }}>
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
          <strong>{<FormattedLabel id="rateChargeMaster" />}</strong>
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <>
                    <div className={styles.one}>
                      {/* venue */}
                      <div>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.venue}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="venue" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="venue"

                                // disabled={disable}
                              >
                                {/* {venueNames &&
                                  venueNames
                                    .filter((facility) => {
                                      return facility.facilityName === selectedFacilityName;
                                    })
                                    .map((venue, index) => (
                                      <MenuItem key={index} value={venue.id}>
                                        {venue.venue}
                                      </MenuItem>
                                    ))}
                              </Select> */}

                                {/* )} */}
                                {venues &&
                                  venues.map((venue, index) => (
                                    <MenuItem key={index} value={venue.id}>
                                      {language == "en" ? venue?.venue : venue?.venueMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="venue"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>{errors?.venue ? errors.venue.message : null}</FormHelperText>
                        </FormControl>
                      </div>

                      {/* facilityName */}
                      <div>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.facilityName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="facilityName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                // onChange={(value) => field.onChange(value)
                                // }
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("value: ", value.target.value);
                                  //   setSelectedFacilityName(value.target.value);
                                  //   setDisableKadhnariState(false);
                                }}
                                label="facilityName"
                                // disabled={disableKadhnariState}
                              >
                                {facilityNames &&
                                  facilityNames
                                    // .filter((facility) => {
                                    //   return facility.facilityType === selectedFacilityType;
                                    // })
                                    .map((facilityName, index) => (
                                      <MenuItem key={index} value={facilityName.id}>
                                        {language == "en"
                                          ? facilityName?.facilityName
                                          : facilityName?.facilityNameMr}
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name="facilityName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.facilityName ? errors.facilityName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      {/* facilityType */}
                      <div>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.facilityType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="facilityType" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("value: ", value.target.value);
                                  setSelectedFacilityType(value.target.value);
                                  //   setDisableKadhnariState(false);
                                }}
                                label="facilityType"
                              >
                                {facilityTypess &&
                                  facilityTypess.map((facilityType, index) => (
                                    <MenuItem key={index} value={facilityType.id}>
                                      {language == "en"
                                        ? facilityType?.facilityType
                                        : facilityType?.facilityTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="facilityType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.facilityType ? errors.facilityType.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className={styles.one}>
                      {/* chargeType */}
                      <div>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.chargeType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="chargeType" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("value: ", value.target.value);
                                  setSelectedFacilityType(value.target.value);
                                  setDisableKadhnariState(false);
                                }}
                                label="chargeType"
                              >
                                {chargeTypess &&
                                  chargeTypess.map((chargeType, index) => (
                                    <MenuItem key={index} value={chargeType.id}>
                                      {language == "en" ? chargeType?.typeName : chargeType?.typeNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="chargeType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.chargeType ? errors.chargeType.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      {/* registration fees */}

                      {/* <div>
                        <TextField
                          id="standard-basic"
                          //   label={<FormattedLabel id="capacity" />}
                          label="Charges Fees"
                          variant="standard"
                          {...register("registrationFes")}
                          error={!!errors.duration}
                          helperText={errors?.duration ? "duration is Required !!!" : null}
                        />
                      </div> */}

                      {/*rate */}

                      {/*Deposite*/}

                      {/* <div>
                        <TextField
                          id="standard-basic"
                          //   label={<FormattedLabel id="capacity" />}
                          label="Deposite"
                          variant="standard"
                          {...register("deposit")}
                          error={!!errors.duration}
                          helperText={errors?.duration ? "duration is Required !!!" : null}
                        />
                      </div> */}

                      {/* capacity */}
                      {/* <div>
                        <TextField
                          id="standard-basic"
                          //   label={<FormattedLabel id="capacity" />}
                          label="Duration"
                          variant="standard"
                          {...register("duration")}
                          error={!!errors.duration}
                          helperText={errors?.duration ? "duration is Required !!!" : null}
                        />
                      </div> */}

                      {/* bookingType */}

                      {/* <div>
                        <FormControl variant="standard" error={!!errors.bookingType}>
                          <InputLabel id="demo-simple-select-standard-label">
                            Duration Type
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setType(value.target.value);
                                }}
                              
                                label="durationType"
                              >
                                <MenuItem value="Daily">hr</MenuItem>
                                <MenuItem value="Monthly">Month</MenuItem>
                                <MenuItem value="threeM">year</MenuItem>
                              </Select>
                            )}
                            name="durationType"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                      </div> */}
                      <div>
                        <FormControl variant="standard" error={!!errors.duration}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="duration" />}
                            // label="Duration"
                            variant="standard"
                            {...register("duration")}
                            error={!!errors.duration}
                          />
                          <FormHelperText>{errors?.duration ? errors.duration.message : null}</FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl variant="standard" error={!!errors.facilityType}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="durationType" />
                            {/* Duration Type */}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("value: ", value.target.value);
                                  // setSelectedFacilityType(value.target.value);
                                  // setDisableKadhnariState(false);
                                }}
                                label="durationType"
                              >
                                {durationTypess &&
                                  durationTypess.map((durationType, index) => (
                                    <MenuItem key={index} value={durationType.id}>
                                      {language == "en" ? durationType?.typeName : durationType?.typeNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="durationType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.durationType ? errors.durationType.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className={styles.one}>
                      {/* Duration Type */}

                      {/* applicantType */}
                      <div>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.applicantType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="applicantType" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("value: ", value.target.value);
                                  setSelectedFacilityType(value.target.value);
                                  setDisableKadhnariState(false);
                                }}
                                label="applicantType"
                              >
                                {applicantTypess &&
                                  applicantTypess.map((applicantType, index) => (
                                    <MenuItem key={index} value={applicantType.id}>
                                      {language == "en" ? applicantType?.typeName : applicantType?.typeNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="applicantType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.applicantType ? errors.applicantType.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl variant="standard" error={!!errors.ammount}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="amount" />}
                            // label="Amount"
                            variant="standard"
                            {...register("ammount")}
                            error={!!errors.ammount}
                          />
                          <FormHelperText>{errors?.ammount ? errors.ammount.message : null}</FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </>

                  <div className={styles.btn}>
                    <Button type="submit" variant="contained" color="success" endIcon={<SaveIcon />}>
                      {btnSaveText == "Save" ? <FormattedLabel id="save" /> : <FormattedLabel id="update" />}
                    </Button>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
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
            <FormattedLabel id="add" />
          </Button>
        </div>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          // disableToolbarButton
          disableDensitySelector
          components={{ Toolbar: GridToolbar }}
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
          // loading={data.loading}
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getCaseType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getCaseType(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;