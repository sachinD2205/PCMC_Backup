// First Ahawal Form

import { yupResolver } from "@hookform/resolvers/yup";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/fireBrigadeSystem/firstAhwal";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../../URLS/urls";

// function getStyles(name, personName2, theme) {
// return {
// fontWeight:
// personName2.indexOf(name) === -1
//   ? theme.typography.fontWeightRegular
//   : theme.typography.fontWeightMedium,
// };
// }

// function getStyles(name, personName3, theme) {
//   return {
//     fontWeight:
//       personName3.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const resetValuesExit = {
  reasonOfFire: "",
  reasonOfFireMr: "",
};

const names = [
  { name: "A. निवासी आगी", value: 1 },
  { name: "झोपडी (फोटो पास असल्यास मोफत)", value: 2 },
  { name: "B. बिगर निवासी आगी", value: 3 },
  { name: "दुकाने", value: 4 },
  { name: "वर्कशॉप", value: 5 },
  { name: "लघुउद्योग", value: 6 },
  { name: "एन्टरप्राईज्स", value: 7 },
  { name: "गॅरेज", value: 8 },
  { name: "C. वाहन आगी", value: 9 },
  { name: "दोन वा तीनचाकी", value: 10 },
  { name: "चार चाकी (हलके)", value: 11 },
  { name: "चार चाकी (जड )", value: 12 },

  //   "A. निवासी आगी",
  //   " झोपडी (फोटो पास असल्यास मोफत)",
  //   "B. बिगर निवासी आगी",
  //   "दुकाने",
  //   "वर्कशॉप",
  //   "लघुउद्योग",
  //   "एन्टरप्राईज्स",
  //   "गॅरेज",
  //   "C. वाहन आगी",
  //   "दोन वा तीनचाकी",
  //   "चार चाकी (हलके)",
  //   "चार चाकी (जड )",
];

const Form = () => {
  const {
    handleSubmit,
    register,
    control,
    methods,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Multiple Add for external support
  const [extperson, setExtPerson] = useState([{ externalServiceId: null, esname: "", esconatact: "" }]);

  const handleClick2 = () => {
    const rowsInput = {
      externalServiceId: null,
      esname: "",
      esconatact: "",
    };
    setExtPerson([...extperson, rowsInput]);
  };

  const removeUser = (index) => {
    const filteredUser = [...extperson];
    filteredUser.splice(index, 1);
    setExtPerson(filteredUser);
  };

  // Multiple Add for Vehicle
  const [vehicle, setVehicle] = React.useState([
    {
      vehicle: "",
      outTime: "",
      reachedTime: "",
      workDuration: "",
      leaveTime: "",
      inTime: "",
      firstAhawalId: "",
      distanceTravelledInKms: "",
    },
  ]);

  const handleClickVehicle = () => {
    const rowsInputs = {
      vehicle: "",
      outTime: "",
      reachedTime: "",
      workDuration: "",
      leaveTime: "",
      inTime: "",
      firstAhawalId: "",
      distanceTravelledInKms: "",
    };
    setVehicle([...vehicle, rowsInputs]);
  };

  const removeVehicle = (index) => {
    const filteredVehicle = [...vehicle];
    filteredVehicle.splice(index, 1);
    setVehicle(filteredVehicle);
  };

  // Multiple Add For External Employee
  const [externalEmp, setExternalEmp] = useState([
    {
      offDutyEmpName: "",
      offDutyEmpNameMr: "",
      offDutyEmpContactNo: "",
      offDutyEmpAddress: "",
      offDutyEmpAddressMr: "",
    },
  ]);

  const handleClickEmployee = () => {
    const addedRow = {
      offDutyEmpName: "",
      offDutyEmpNameMr: "",
      offDutyEmpContactNo: "",
      offDutyEmpAddress: "",
      offDutyEmpAddressMr: "",
    };
    setExternalEmp([...externalEmp, addedRow]);
  };

  const removeEmployee = (index) => {
    const filterEmployee = [...externalEmp];
    filterEmployee.splice(index, 1);
    setExternalEmp(filterEmployee);
  };

  useEffect(() => {
    console.log("kkkkkkkk", getValues("firstAhawal.isLossInAmount"));
  }, []);

  // multiselect
  const theme = useTheme();

  const [slideChecked, setSlideChecked] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  // const [fetchData, setFetchData] = useState(null);

  // Fire Station
  const [fireStationName, setFireStationName] = React.useState([]);
  const handleChangeFireStation = (event) => {
    const {
      target: { value },
    } = event;
    setFireStationName(typeof value === "string" ? value.split(",") : value);
    setCrew(event.target.value);
  };

  // Fire Crew
  const [fireCrewsMul, setFireCrewsMul] = React.useState([]);
  const handleChangeFireCrewsMul = (event) => {
    const {
      target: { value },
    } = event;
    setFireCrewsMul(typeof value === "string" ? value.split(",") : value);
  };

  // crew - Employee Name
  const [crewEmployeeName, setCrewEmployeeName] = React.useState([]);
  const handleChangeCrewEmployeeName = (event) => {
    console.log("eevent", event.target);
    const {
      target: { value },
    } = event;
    setCrewEmployeeName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  // external Employee
  const [externalEmployee, setExternalEmployee] = React.useState([]);
  const handleChangeExternalEmployee = (event) => {
    const {
      target: { value },
    } = event;
    setExternalEmployee(typeof value === "string" ? value.split(",") : value);
  };

  // fire Equipment
  const [fireEquipmentMul, setFireEquipmentMul] = React.useState([]);
  const handleChangeFireEquipmentMul = (event) => {
    const {
      target: { value },
    } = event;
    setFireEquipmentMul(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const language = useSelector((state) => state?.labels.language);

  const token = useSelector((state) => state.user.user.token);

  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    console.log("event4", event, personName);
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
      // value
    );
  };

  const [subVardiType, setSubVardiType] = useState();

  // get Vardi Types
  const getSubVardiTypes = () => {
    axios.get(`${urls.FbsURL}/transaction/subTypeOfVardi/getSubTypeOfVardiMasterData`).then((res) => {
      console.log("sub", res?.data);
      setSubVardiType(res?.data);
    });
  };

  const [fireCrew, setFireCrew] = useState();
  const [crew, setCrew] = useState();

  // get crew
  const getCrew = () => {
    axios.get(`${urls.FbsURL}/master/fireCrew/getAll`).then((res) => {
      console.log("11sub", res?.data?.fireCrew);
      setFireCrew(res?.data?.fireCrew);
    });
  };

  console.log("personName", personName);
  // Exit button Routing
  const router = useRouter();

  // const userTemplate = { esname: "", esname: "", esconatact: "" };

  // const { reset } = useFormContext();

  // const {
  //   // control,
  //   // register,
  //   reset,

  //   formState: { errors },
  // } = useFormContext();

  // const [btnSaveText, setBtnSaveText] = useState("Update");

  const [businessTypes, setBusinessTypes] = useState([]);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const [fireStation, setfireStation] = useState();
  const [showVardiOther, setShowVardiOther] = useState([]);
  const [showFireOther, setShowFireOther] = useState([]);
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
  const [desg, setDesg] = useState();
  const [thirdCharge, setThirdCharge] = useState([]);

  const [value, setValue2] = React.useState(dayjs("2014-08-18T21:11:54"));
  const [OutsiteArea, setOutsiteArea] = useState([]);
  const [Payment, setPayment] = useState([]);

  const [open, setOpen] = React.useState(true);

  const [standByDuty, setStandByDuty] = React.useState();

  const [menus, subMenus] = React.useState();

  const [lossAmount, setLossAmount] = React.useState();
  const [insurrancePolicy, setInsurrancePolicy] = React.useState();
  const [fireEquipmentsAvailable, setFireEquipmentsAvailable] = React.useState();
  const [externalPerson, setExternalPerson] = React.useState();
  const [externalService, setExternalService] = useState();
  const [externalServiceProvided, setExternalServiceProvided] = useState();

  //2-  get fire station name
  const getExternalServices = () => {
    axios.get(`${urls.FbsURL}/master/externalService/getAll`).then((res) => {
      console.log("resss", res.data);
      setExternalServiceProvided(res?.data?.externalService);
    });
  };

  console.log("menus", menus);
  console.log("standByDuty", standByDuty);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    getDesg();
    getVardiTypes();
    getFireStation();
    getUser();
    getFireReason();
    getPinCode();
    getServices();
    getChargeRate();
    getCharge();
    getThirdCharge();
    getExternalServices();
    getSubVardiTypes();
    getCrew();
    getVehicleNumber();
  }, []);

  const [charge, setCharge] = useState();

  const getCharge = () => {
    axios
      .get(`${urls.FbsURL}/master/chargeType/getAll`)
      .then((res) => {
        console.log("charge", res?.data?.chargeType);
        setCharge(res?.data?.chargeType);
      })
      .catch((err) => console.log(err));
  };

  const [chargeRate, setChargeRate] = useState();

  // Get Charge Rate
  const getChargeRate = () => {
    axios.get(`${urls.FbsURL}/chargeTypeRateEntry/getAll`).then((res) => {
      console.log("ch", res?.data?.chargeTypeRate);
      setChargeRate(res?.data?.chargeTypeRate);
    });
  };

  // Get Charge Rate
  const getThirdCharge = () => {
    axios.get(`${urls.FbsURL}/mstThirdCharge/getAll`).then((res) => {
      console.log("ch", res?.data?.thirdCharge);
      setThirdCharge(res?.data?.thirdCharge);
    });
  };
  const [services, setServices] = useState();

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((res) => setServices(res?.data?.service))
      .catch((error) => console.log(error));
  };

  const [crPincodes, setCrPinCodes] = useState();

  // fetch pin code from cfc
  const getPinCode = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`)
      .then((res) => {
        console.log("pin", res?.data?.pinCode);
        setCrPinCodes(res?.data?.pinCode);
      })
      .catch((err) => console.log(err));
  };

  // get Designation from cfc
  const getDesg = () => {
    axios.get(`${urls.CFCURL}/master/designation/getAll`).then((res) => {
      console.log("userDesg", res?.data?.designation);
      setDesg(res?.data?.designation);
    });
  };

  // get employee from cfc
  const getUser = () => {
    axios

      .get(`${urls.CFCURL}/master/user/getAll`)
      // axios.get(`${urls.CFCURL}/auth/getAllUsers`)
      .then((res) => {
        console.log("userEmployee", res?.data?.user);
        setUserLst(res?.data?.user);
        // department: departmentList?.find((d)=>d.id===val.department)?.department,
        // setUserLst(
        //   res.data.map((r, index) => ({
        //     id: r.designation,
        //     // designation: desg?.find((d) => d.id === r.designation)?.r.designation,
        //     designation: desg?.find((d) => d.id === id)?.desg,
        //   }))
        // );
      });
  };

  const [vehicleNumber, setVehicleNumber] = useState();

  // get vehicle number
  const getVehicleNumber = () => {
    axios.get(`${urls.FbsURL}/VehicleDetailsMasterMaster/getVehicleDetailsMasterData`).then((res) => {
      console.log("fi", res.data);

      setVehicleNumber(res?.data);
    });
  };

  // 1- get fire station name
  const getFireStation = () => {
    axios.get(`${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`).then((res) => {
      console.log("fi", res.data);

      setfireStation(res?.data);
    });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios.get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`).then((res) => {
      console.log("resss", res.data);

      setVardiTypes(res?.data);
    });
  };

  const [reason, setReason] = useState();

  // get reason of fire
  const getFireReason = () => {
    axios.get(`${urls.FbsURL}/mstReasonOfFire/get`).then((res) => {
      setReason(res?.data);
    });
  };

  // setDataSource(
  //   res.data.firstAhawal.externalSupportLst.map((o, i) => {
  //     return {
  //       srNo: i + 1,
  //       ...o,
  //     };
  //   })
  // );
  const getById = (appId) => {
    axios.get(`${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${appId}`).then((res) => {
      console.log("23000", res.data);
      console.log("23", res.data.firstAhawal.isLossInAmount);
      reset(res.data);
      setLossAmount(res.data.firstAhawal.isLossInAmount);
      setExternalService(res.data.firstAhawal.isExternalServiceProvide);
      setExternalPerson(res.data.firstAhawal.isExternalPersonAddedInDuty);
      setInsurrancePolicy(res.data.firstAhawal.insurancePolicyApplicable);
      setFireEquipmentsAvailable(res.data.firstAhawal.isFireEquipmentsAvailable);

      // setValue(
      //   "isLossInAmount",
      //   res.data.firstAhawal.isLossInAmount
      // ),
      //   setValue(
      //     "isExternalServiceProvide",
      //     res.data.firstAhawal.isExternalServiceProvide
      //   ),
      //   setValue(
      //     "isExternalPersonAddedInDuty",
      //     res.data.firstAhawal.isExternalPersonAddedInDuty
      //   ),
      //   setValue(
      //     "insurancePolicyApplicable",
      //     res.data.firstAhawal.insurancePolicyApplicable
      //   ),
      //   setValue(
      //     "isFireEquipmentsAvailable",
      //     res.data.firstAhawal.isFireEquipmentsAvailable
      //   ),

      // fire stations
      setFireStationName(
        typeof res.data.firstAhawal.fireStations === "string"
          ? res.data.firstAhawal.fireStations.split(",")
          : value,
      );

      // fireStationCrews
      setFireCrewsMul(
        typeof res.data.firstAhawal.fireStationCrews === "string"
          ? res.data.firstAhawal.fireStationCrews.split(",")
          : value,
      );

      // // crew- employeeName
      setCrewEmployeeName(
        typeof res.data.firstAhawal.employeeName === "string"
          ? res.data.firstAhawal.employeeName.split(",")
          : value,
      );

      // // external - offDutyEmployees
      // setExternalEmployee(
      //   typeof res.data.firstAhawal.offDutyEmployees === "string"
      //     ? res.data.firstAhawal.offDutyEmployees.split(",")
      //     : value
      // );

      // // Fire Equipments
      // setFireEquipmentMul(
      //   typeof res.data.firstAhawal.fireEquipments === "string"
      //     ? res.data.firstAhawal.fireEquipments.split(",")
      //     : value
      // );

      setValue("id", res.data.id);
      setValue("firstAhawal", res.data.firstAhawal);
      setValue("firstAhawalId", res.data.firstAhawal.id);
      // setValue(
      //   "vardiDispatchTime",
      //   moment(res.data.firstAhawal.vardiDispatchTime, "HH:mm:ss").format(
      //     "HH:mm:ss"
      //   )
      // );
      console.log("666", moment(res.data.firstAhawal.vardiDispatchTime, "HH:mm:ss").format("HH:mm:ss"));
    });
  };

  // const onSubmitForm2 = (formData) => {
  //   if (btnSaveText === "Save") {
  //     const tempData = axios
  //       .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, {
  //         formData,
  //         id: null,
  //       })
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //           setFetchData(tempData);
  //           getData();
  //         }
  //       });
  //   } else if (btnSaveText === "Update") {
  //     axios
  //       .post(`${urls.FbsURL}/mstReasonOfFire/save`, formData)
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");
  //           getData();
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  // Delete By ID
  const deleteById2 = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios.delete(`${urls.FbsURL}/mstReasonOfFire/discard/${value}`).then((res) => {
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

  const onSubmitForm = (fromData) => {
    // e.preventDefault();
    // e.stopPropogation();
    console.log("fromData", fromData);

    const finalBody = {
      id: router?.query?.id ? router.query.id : null,

      // id: fromData.id,

      firstAhawal: {
        id: router?.query?.firstAhawalId ? router.query.firstAhawalId : null,
        ...fromData.firstAhawal,
        // firstAhawal: "",
        // externalSupportLst: [],
        externalSupportLst:
          fromData.firstAhawal.externalSupportLst == "" ? [] : getValues("firstAhawal.externalSupportLst"),
        vehicleEntryLst: [],
        // vehicleEntryLst: getValues("firstAhawal.vehicleEntryLst")?.map((r) => {
        //   return {
        //     inTime: r.inTime == "" ? null : moment(r.inTime, "HH:mm:ss").format("HH:mm:ss"),
        //     outTime: moment(r.outTime, "HH:mm:ss").format("HH:mm:ss"),
        //     reachedTime: moment(r.reachedTime, "HH:mm:ss").format("HH:mm:ss"),
        //     leaveTime: moment(r.leaveTime, "HH:mm:ss").format("HH:mm:ss"),
        //     distanceTravelledInKms: r.distanceTravelledInKms,
        //     workDuration: r.workDuration,
        //   };
        // }),
        otherEmployeesLst: getValues("firstAhawal.otherEmployeesLst"),
        // otherEmployeesLst: [],
        // id: fromData.firstAhawal.id,
        vardiDispatchTime: moment(fromData.firstAhawal.vardiDispatchTime, "HH:mm:ss").format("HH:mm:ss"),
        // vardiDispatchTime: moment(
        //   fromData.vardiDispatchTime,
        //   "HH:mm:ss"
        // ).format("HH:mm:ss"),

        isLossInAmount: fromData.firstAhawal.isLossInAmount,
        isExternalServiceProvide: fromData.firstAhawal.isExternalServiceProvide,
        isExternalPersonAddedInDuty: externalPerson,

        insurancePolicyApplicable: fromData.firstAhawal.insurancePolicyApplicable,

        isFireEquipmentsAvailable: fromData.firstAhawal.isFireEquipmentsAvailable,

        // fireStations: fireStationName.toString(),

        fireStations: fireStationName
          .map((r) => fireStation.find((fire) => fire.fireStationName == r)?.id)
          .toString(),

        // fireStationCrews: fireCrewsMul.toString(),
        fireStationCrews: fireCrewsMul.map((r) => fireCrew.find((crew) => crew.crewName == r)?.id).toString(),

        // Crew - EmployeeName
        // employeeName: crewEmployeeName.toString(),

        employeeName: crewEmployeeName
          .map(
            (r) =>
              userLst.find((user) => user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn == r)
                ?.id,
          )
          .toString(),

        // external employee Name
        // offDutyEmployees: externalEmployee.toString(),

        offDutyEmployees: externalEmployee
          .map(
            (r) =>
              userLst.find((user) => user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn == r)
                ?.id,
          )
          .toString(),

        fireEquipments: fireEquipmentMul.toString(),
        // departureTime: null,
        dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format("YYYY-MM-DDThh:mm:ss"),
      },
      // rescueVardi: personName,

      // application date
      // dateAndTimeOfVardi: moment(
      //   r.dateAndTimeOfVardi,
      //   "YYYY-MM-DDTHH:mm:ss"
      // ).format("YYYY-MM-DDTHH:mm:ss"),
      role: "VERIFICATION",
      desg: "SUB_FIRE_OFFICER",
    };

    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, finalBody, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              fromData.id
                ? sweetAlert("Complete!", "Action Completed successfully !", "success")
                : sweetAlert("Saved!", "Record Saved successfully !", "success");
              router.back();
            }
          });
      }
    });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query);
      // reset(router.query);
      getById(router.query.id);

      // typeOfVardiId(router.query.typeOfVardiId);

      // subTypeOfVardi(router.query.subTypeOfVardi);
    }
  }, []);

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };
  // Reset Values Cancell
  const resetValuesCancell = {
    serviceName: "",
    informerName: "",
    informerNameMr: "",
    informerMiddleName: "",
    informerMiddleNameMr: "",
    informerLastName: "",
    informerLastNameMr: "",
    area: "",
    areaMr: "",
    city: "",
    cityMr: "",
    contactNumber: "",
    mailID: "",
    vardiPlace: "",
    vardiPlaceMr: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    slipHandedOverToMr: "",
    landmark: "",
    vardiReceivedName: "",
    dateAndTimeOfVardi: "",
    documentsUpload: "",
    employeeShiftID: "",
    reasonOfFire: "",
    firedThingsDuringAccuse: "",
    lossInAmount: "",
    insurancePolicyDetails: "",
    fireEquipments: "",
    manPowerLoss: "",
    employeeDetailsDuringFireWorks: "",
    chargesCollected: "",
    billPayerDetails: "",
    nameOfSubFireOfficer: "",
    nameOfMainFireOfficer: "",
    typeOfVardiOther: "",
    reasonOfFireOther: "",
  };

  // View
  return (
    <Box
      style={{
        margin: "4%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
        <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,
                color: "#2980B9",
              }}
            >
              <ArrowBackIcon
                onClick={() =>
                  router.push({
                    pathname: "/FireBrigadeSystem/transactions/firstAhawal",
                  })
                }
              />
            </IconButton>

            <Typography
              sx={{
                textAlignVertical: "center",
                textAlign: "center",
                color: "rgb(7 110 230 / 91%)",
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
              }}
            >
              {<FormattedLabel id="emergencyServicesFirstVardiAhawal" />}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Paper
        sx={{
          margin: 1,
          padding: 2,
          backgroundColor: "#F5F5F5",
        }}
        elevation={5}
      >
        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className={styles.small}>
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>{<FormattedLabel id="informerDetails" />}</Box>
                </Box>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      // size="small"
                      id="standard-basic"
                      label={<FormattedLabel id="informerName" />}
                      variant="standard"
                      {...register("vardiSlip.informerName")}
                      error={!!errors.informerName}
                      helperText={errors?.informerName ? errors.informerName.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="informerMiddleName" />}
                      variant="standard"
                      {...register("vardiSlip.informerMiddleName")}
                      error={!!errors.informerMiddleName}
                      helperText={errors?.informerMiddleName ? errors.informerMiddleName.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="informerLastName" />}
                      variant="standard"
                      {...register("vardiSlip.informerLastName")}
                      error={!!errors.informerLastName}
                      helperText={errors?.informerLastName ? errors.informerLastName.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="informerNameMr" />}
                      variant="standard"
                      {...register("vardiSlip.informerNameMr")}
                      error={!!errors.informerNameMr}
                      helperText={errors?.informerNameMr ? errors.informerNameMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="informerMiddleNameMr" />}
                      variant="standard"
                      {...register("vardiSlip.informerMiddleNameMr")}
                      error={!!errors.informerMiddleNameMr}
                      helperText={errors?.informerMiddleNameMr ? errors.informerMiddleNameMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="informerLastNameMr" />}
                      variant="standard"
                      {...register("vardiSlip.informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={errors?.informerLastNameMr ? errors.informerLastNameMr.message : null}
                    />
                  </Grid>
                </Grid>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="area" />}
                      variant="standard"
                      {...register("vardiSlip.area")}
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="city" />}
                      variant="standard"
                      {...register("vardiSlip.city")}
                      error={!!errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <FormControl
                      variant="standard"
                      sx={{ width: "80%" }}
                      error={!!errors.pinCode}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="pincode" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="pincode" />}
                          >
                            {crPincodes &&
                              crPincodes.map((crPincode, index) => (
                                <MenuItem key={index} value={crPincode.id}>
                                  {crPincode.pinCode}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="pinCode"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.pinCode ? errors.pinCode.message : null}
                      </FormHelperText>
                    </FormControl> */}
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="email" />}
                      variant="standard"
                      {...register("vardiSlip.mailID")}
                      error={!!errors.mailID}
                      helperText={errors?.mailID ? errors.mailID.message : null}
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="areaMr" />}
                      variant="standard"
                      {...register("vardiSlip.areaMr")}
                      error={!!errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="cityMr" />}
                      variant="standard"
                      {...register("vardiSlip.cityMr")}
                      error={!!errors.cityMr}
                      helperText={errors?.cityMr ? errors.cityMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="contactNumber" />}
                      variant="standard"
                      {...register("vardiSlip.contactNumber")}
                      error={!!errors.contactNumber}
                      helperText={errors?.contactNumber ? errors.contactNumber.message : null}
                    />
                  </Grid>
                </Grid>
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>{<FormattedLabel id="vardiDetails" />}</Box>
                </Box>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="occurancePlace" />}
                      variant="standard"
                      {...register("vardiSlip.vardiPlace")}
                      error={!!errors.vardiPlace}
                      helperText={errors?.vardiPlace ? errors.vardiPlace.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="occurancePlaceMr" />}
                      variant="standard"
                      {...register("vardiSlip.vardiPlaceMr")}
                      error={!!errors.vardiPlaceMr}
                      helperText={errors?.vardiPlaceMr ? errors.vardiPlaceMr.message : null}
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl error={!!errors.vardiDispatchTime} sx={{ width: "80%" }}>
                      <Controller
                        control={control}
                        defaultValue={null}
                        name="vardiDispatchTime"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              ampm={false}
                              openTo="hours"
                              views={["hours", "minutes", "seconds"]}
                              inputFormat="HH:mm:ss"
                              mask="__:__:__"
                              label="Vardi Dispatch Time"
                              value={field.value}
                              onChange={(time) => {
                                field.onChange(time);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{ width: "80%" }}
                                  size="small"
                                  {...params}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.vardiDispatchTime ? errors.vardiDispatchTime.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="landmark" />}
                      variant="standard"
                      {...register("vardiSlip.landmark")}
                      error={!!errors.landmark}
                      helperText={errors?.landmark ? errors.landmark.message : null}
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="landmarkMr" />}
                      variant="standard"
                      {...register("vardiSlip.landmarkMr")}
                      error={!!errors.landmarkMr}
                      helperText={errors?.landmarkMr ? errors.landmarkMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl sx={{ minWidth: "80%" }} variant="standard" error={!!errors.typeOfVardiId}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="typeOfVardiId" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value.target.value);
                              field.onChange(value);
                              setShowVardiOther(value.target.value);
                            }}
                            label="Type of Vardi"
                          >
                            {vardiTypes &&
                              vardiTypes.map((vardi, index) => (
                                <MenuItem key={index} value={vardi.id}>
                                  {language == "en" ? vardi.vardiName : vardi.vardiNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="vardiSlip.typeOfVardiId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfVardiId ? errors.typeOfVardiId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl sx={{ minWidth: "80%" }} variant="standard" error={!!errors.typeOfVardiId}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="subTypesOfVardi" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                            }}
                            label="Sub Type Of Vardi"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {subVardiType &&
                              subVardiType
                                .filter((u) => u.vardiTypeId == showVardiOther)
                                .map((vardi, index) => (
                                  <MenuItem key={index} value={vardi.id}>
                                    {language == "en" ? vardi.subVardiName : vardi.subVardiNameMr}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name="vardiSlip.subTypeOfVardi"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfVardiId ? errors.typeOfVardiId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="otherVardiType" />}
                      variant="standard"
                      {...register("vardiSlip.otherVardiType")}
                      error={!!errors.otherVardiType}
                      helperText={errors?.otherVardiType ? errors.otherVardiType.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: "80%" }}
                      // size="small"
                      error={!!errors.reasonOfFire}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="reasonOfFire" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            // onChange={(value) => field.onChange(value)}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setShowFireOther(value.target.value);
                            }}
                            label={<FormattedLabel id="reasonOfFire" />}
                          >
                            {reason &&
                              reason.map((res, index) => (
                                <MenuItem key={index} value={res.id}>
                                  {language == "en" ? res.reasonOfFire : res.reasonOfFireMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="firstAhawal.reasonOfFire"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.reasonOfFire ? errors.reasonOfFire.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      defaultValue={null}
                      label={<FormattedLabel id="otherReasonOfFire" />}
                      variant="standard"
                      {...register("firstAhawal.otherReasonOfFire")}
                      error={!!errors.otherReasonOfFire}
                      helperText={errors?.otherReasonOfFire ? errors.otherReasonOfFire.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: "80%" }}
                      error={!!errors.nameOfSubFireOfficer}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Name of Subfire Officer/Station Officer */}
                        {<FormattedLabel id="nameOfSubFireOfficer" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="List"
                          >
                            {/* {userLst &&
                              userLst
                                .filter((u) => u.desg === "SFO")
                                .map((user, index) => (
                                  <MenuItem key={index} value={user.id}>
                                    {user.firstName +
                                      " " +
                                      (typeof user.middleName === "string"
                                        ? user.middleName
                                        : " ") +
                                      " " +
                                      user.lastName}
                                  </MenuItem>
                                ))} */}
                            {userLst &&
                              userLst
                                .filter((u) => u.designation == 39)
                                .map((user, index) => (
                                  <MenuItem
                                    key={index}
                                    value={user.id}
                                    sx={{
                                      display: typeof user.firstNameEn === "string" ? "flex" : "none",
                                    }}
                                  >
                                    {(typeof user.firstNameEn === "string" && user.firstNameEn) +
                                      " " +
                                      (typeof user.middleNameEn === "string" ? user.middleNameEn : " ") +
                                      " " +
                                      (typeof user.lastNameEn === "string" && user.lastNameEn)}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name="firstAhawal.nameOfSubFireOfficer"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.nameOfSubFireOfficer ? errors.nameOfSubFireOfficer.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {" "}
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: "80%" }}
                      error={!!errors.nameOfMainFireOfficer}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Name of main Fire Officer */}
                        {<FormattedLabel id="nameOfMainFireOfficer" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="List"
                          >
                            {userLst &&
                              userLst
                                .filter((u) => u.designation == 40)
                                .map((user, index) => (
                                  <MenuItem
                                    key={index}
                                    value={user.id}
                                    sx={{
                                      display: typeof user.firstNameEn === "string" ? "flex" : "none",
                                    }}
                                  >
                                    {(typeof user.firstNameEn === "string" && user.firstNameEn) +
                                      " " +
                                      (typeof user.middleNameEn === "string" ? user.middleNameEn : " ") +
                                      " " +
                                      (typeof user.lastNameEn === "string" && user.lastNameEn)}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name="firstAhawal.nameOfMainFireOfficer"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.nameOfMainFireOfficernameOfMainFireOfficer
                          ? errors.nameOfMainFireOfficernameOfMainFireOfficer.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">
                        <FormattedLabel id="isTenantHaveAnyLoss" />
                      </FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.isLossInAmount"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label={<FormattedLabel id="No" />}
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setLossAmount(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setLossAmount(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {lossAmount == "Yes" ? (
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="lossInAmount" />}
                        variant="standard"
                        {...register("firstAhawal.lossInAmount")}
                        error={!!errors.lossInAmount}
                        helperText={errors?.lossInAmount ? errors.lossInAmount.message : null}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  )}

                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                {/* 
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "5px",
                        paddingLeft: 10,
                      }}
                    >
                      {<FormattedLabel id="paymentDetails" />}
                    </h3>
                  </div>
                </div>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerName" />}
                      variant="standard"
                      {...register("billPayerName")}
                      error={!!errors.billPayerName}
                      helperText={
                        errors?.billPayerName
                          ? errors.billPayerName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayeraddress" />}
                      variant="standard"
                      {...register("billPayeraddress")}
                      error={!!errors.billPayeraddress}
                      helperText={
                        errors?.billPayeraddress
                          ? errors.billPayeraddress.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerContact" />}
                      variant="standard"
                      {...register("billPayerContact")}
                      error={!!errors.billPayerContact}
                      helperText={
                        errors?.billPayerContact
                          ? errors.billPayerContact.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerNameMr" />}
                      variant="standard"
                      {...register("billPayerNameMr")}
                      error={!!errors.billPayerNameMr}
                      helperText={
                        errors?.billPayerNameMr
                          ? errors.billPayerNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayeraddressMr" />}
                      variant="standard"
                      {...register("billPayeraddressMr")}
                      error={!!errors.billPayeraddressMr}
                      helperText={
                        errors?.billPayeraddressMr
                          ? errors.billPayeraddressMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="collectedAmount" />}
                      variant="standard"
                      {...register("collectedAmount")}
                      error={!!errors.collectedAmount}
                      helperText={
                        errors?.collectedAmount
                          ? errors.collectedAmount.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="referenceNumber" />}
                      variant="standard"
                      {...register("referenceNumber")}
                      error={!!errors.referenceNumber}
                      helperText={
                        errors?.referenceNumber
                          ? errors.referenceNumber.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={11} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      fullWidth
                      multiline
                      maxRows={2}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerDetails" />}
                      variant="standard"
                      {...register("billPayerDetails")}
                      error={!!errors.billPayerDetails}
                      helperText={
                        errors?.billPayerDetails
                          ? errors.billPayerDetails.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={11} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      fullWidth
                      multiline
                      maxRows={2}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerDetailsMr" />}
                      variant="standard"
                      {...register("billPayerDetailsMr")}
                      error={!!errors.billPayerDetailsMr}
                      helperText={
                        errors?.billPayerDetailsMr
                          ? errors.billPayerDetailsMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={11} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      fullWidth
                      multiline
                      maxRows={2}
                      id="standard-basic"
                      variant="standard"
                      label={<FormattedLabel id="chargesCollected" />}
                      {...register("chargesCollected")}
                      error={!!errors.chargesCollected}
                      helperText={
                        errors?.chargesCollected
                          ? errors.chargesCollected.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={11} className={styles.feildres}></Grid>
                </Grid> */}
                <br />
                <br />
                {/* Payment Detail Button */}
                {/* <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ minWidth: "70%" }}
                      variant="standard"
                      error={!!errors.outSidePcmcArea}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Citizen need to Payment
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setPayment(value.target.value);
                            }}
                            label="Citizen need to Payment"
                          >
                            <MenuItem value={1}>Yes</MenuItem>
                            <MenuItem value={2}>No</MenuItem>
                          </Select>
                        )}
                        name=""
                        control={control}
                        defaultValue=""
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    {Payment === 1 && (
                      <Button
                        variant="outlined"
                        onClick={() =>
                          router.push({
                            pathname:
                              "/FireBrigadeSystem/transactions/firstAhawal/loiGenerationComponent",
                          })
                        }
                      >
                        Get Payment Details
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid> */}
                {/* Multiline select */}
                {/* <Grid item xs={4} className={styles.feildres}>
                  <FormControl sx={{ m: 1, minWidth: 240 }}>
                    <InputLabel htmlFor="grouped-native-select">
                      Charges
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          variant="standard"
                          native
                          defaultValue=""
                          id="grouped-native-select"
                          label="Charges"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {chargeRate?.map((val) => {
                            console.log("1234", val);
                            return (
                              <>
                                <optgroup
                                  value={
                                    charge.find(
                                      (obj) => obj.id === val.chargeType
                                    )?.id
                                  }
                                  label={
                                    charge.find(
                                      (obj) => obj.id === val.chargeType
                                    )?.chargeType
                                  }
                                >
                                  <option
                                    value={val.id}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {val.subCharge}
                                  </option>
                                </optgroup>
                              </>
                            );
                          })}
                        </Select>
                      )}
                      name="chargesApply"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid> */}
                {/* citizen code */}
                {/* <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ minWidth: "70%" }}
                      variant="standard"
                      error={!!errors.outSidePcmcArea}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        is citizen outside from pcmc area
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setOutsiteArea(value.target.value);
                            }}
                            label="is citizen outside from pcmc area"
                          >
                            <MenuItem value={1}>Yes</MenuItem>
                            <MenuItem value={2}>No</MenuItem>
                          </Select>
                        )}
                        name="outSidePcmcArea"
                        control={control}
                        defaultValue=""
                      />
           
                    </FormControl>
                  </Grid>
                  {OutsiteArea === 1 && (
                    <Grid item xs={8} className={styles.feildres}>
                      <>
                        <Grid item xs={8} className={styles.feildres}>
                          <div
                            style={{
                              backgroundColor: "skyblue",
                              padding: 5,
                              width: "200",
                            }}
                          >
                            Citizen is outside from PCMC Area citizen has to pay
                            charges immediately
                          </div>
                        </Grid>
                        <Grid item xs={9} className={styles.feildres}>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              router.push({
                                pathname:
                                  "/FireBrigadeSystem/transactions/firstAhawal/payScreen",
                              })
                            }
                          >
                            Get Payment Details
                          </Button>
                        </Grid>
                      </>
                    </Grid>
                  )} */}
                {/* end */}
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>{<FormattedLabel id="vardiAndEmployeeDetails" />}</Box>
                </Box>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        {<FormattedLabel id="vardiAndEmployeeDetails" />}
                      </InputLabel>
                      <Select
                        // labelId="demo-multiple-chip-label"
                        labelId="demo-multiple-checkbox-label"
                        // id="demo-multiple-chip"
                        id="demo-multiple-checkbox"
                        multiple
                        value={fireStationName}
                        onChange={handleChangeFireStation}
                        input={<OutlinedInput id="select-multiple-chip" label="Fire Station" />}
                        // input={<OutlinedInput label="Tag" />}
                        // renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected?.map((value) => (
                              <Chip sx={{ backgroundColor: "#AFDBEE" }} key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {fireStation?.map((fire, index) => (
                          <MenuItem
                            // key={name}
                            // value={name}
                            key={index}
                            value={
                              // fire.id
                              fire.fireStationName
                            }
                            // style={getStyles(fire, personName2, theme)}
                          >
                            <Checkbox checked={fireStationName.indexOf(fire.fireStationName) > -1} />
                            <ListItemText primary={fire.fireStationName} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id='demo-multiple-chip-label'>
                        Fire Station
                      </InputLabel>
                      <Select
                        labelId='demo-multiple-chip-label'
                        id='demo-multiple-chip'
                        multiple
                        value={personName2}
                        onChange={handleChange2}
                        input={
                          <OutlinedInput
                            id='select-multiple-chip'
                            label='Fire Station'
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {fireStation &&
                          fireStation.map((name) => (
                            <MenuItem
                              key={name}
                              value={name.id}
                              style={getStyles(name, personName, theme)}
                            >
                              {name.fireStationName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl> */}
                  </Grid>

                  {crew == 2 || crew == "Pimpri" ? (
                    <>
                      {/* fire crew */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel id="demo-multiple-chip-label">Fire Crew</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={fireCrewsMul}
                            onChange={handleChangeFireCrewsMul}
                            input={<OutlinedInput id="select-multiple-chip" label="Fire Crew" />}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip sx={{ backgroundColor: "#AFDBEE" }} key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {fireCrew?.map((crew, index) => (
                              <MenuItem
                                // key={name}
                                // value={name}
                                key={index}
                                value={
                                  crew.crewName
                                  // language === "en"
                                  //   ? crew.crewName
                                  //   : crew.crewNameMr
                                }
                                // style={getStyles(crew, personName3, theme)}
                              >
                                {/* {language == "en"
                                  ? crew.crewName
                                  : crew.crewNameMr} */}
                                <Checkbox checked={fireCrewsMul.indexOf(crew.crewName) > -1} />
                                <ListItemText primary={language == "en" ? crew.crewName : crew.crewNameMr} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  ) : (
                    <>
                      {/* crew - Employee Name */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <InputLabel id="demo-multiple-chip-label">Employee Name</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            rows={2}
                            value={crewEmployeeName}
                            onChange={handleChangeCrewEmployeeName}
                            input={<OutlinedInput id="select-multiple-chip" label="Employee Name" />}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip sx={{ backgroundColor: "#AFDBEE" }} key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {userLst.length > 0 &&
                              userLst.map((user, index) => (
                                <MenuItem
                                  // key={name}
                                  // value={name}
                                  key={index}
                                  value={
                                    // user.id
                                    // user.id
                                    user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn
                                  }
                                  // style={getStyles(user, personName5, theme)}
                                >
                                  <Checkbox
                                    checked={
                                      crewEmployeeName.indexOf(
                                        user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn,
                                      ) > -1
                                    }
                                  />
                                  <ListItemText
                                    primary={
                                      (typeof user?.firstNameEn === "string" && user.firstNameEn) +
                                      " " +
                                      (typeof user?.middleNameEn === "string" ? user.middleNameEn : " ") +
                                      " " +
                                      (typeof user?.lastNameEn === "string" && user.lastNameEn)
                                    }
                                  />
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}

                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">is External Person(Employee) added in duty?</FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.isExternalPersonAddedInDuty"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setExternalPerson(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setExternalPerson(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  {/* {isOpenCollapse && ( */}

                  {/* // )} */}
                  {externalPerson == "Yes" && (
                    <>
                      <Grid
                        container
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        className={styles.feildres}
                        sx={{ marginBottom: "5%" }}
                      >
                        <Grid item xs={11} className={styles.feildres}>
                          <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel id="demo-multiple-chip-label">
                              {<FormattedLabel id="otherExternalEmp" />}
                            </InputLabel>
                            <Select
                              labelId="demo-multiple-chip-label"
                              id="demo-multiple-chip"
                              multiple
                              rows={2}
                              value={externalEmployee}
                              onChange={handleChangeExternalEmployee}
                              input={
                                <OutlinedInput
                                  id="select-multiple-chip"
                                  label="Other External Employee Who is Not on duty but
                                  present at the time of Vardi"
                                />
                              }
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {selected.map((value) => (
                                    <Chip sx={{ backgroundColor: "#AFDBEE" }} key={value} label={value} />
                                  ))}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {userLst?.map((user, index) => (
                                <MenuItem
                                  // key={name}
                                  // value={name}
                                  key={index}
                                  value={
                                    // user.id
                                    user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn
                                  }
                                  // style={getStyles(user, personName5, theme)}
                                >
                                  <Checkbox
                                    checked={
                                      externalEmployee.indexOf(
                                        user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn,
                                      ) > -1
                                    }
                                  />
                                  <ListItemText
                                    primary={
                                      (typeof user?.firstNameEn === "string" && user.firstNameEn) +
                                      " " +
                                      (typeof user?.middleNameEn === "string" ? user.middleNameEn : " ") +
                                      " " +
                                      (typeof user?.lastNameEn === "string" && user.lastNameEn)
                                    }
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                            {/* <Select
                              multiple
                              displayEmpty
                              value={externalEmployee.firstNameEn}
                              onChange={handleChangeExternalEmployee}
                              input={<Input id='select-multiple-placeholder' />}
                              renderValue={(selected) => {
                                if (selected?.length === 0) {
                                  return <em>Placeholder</em>;
                                }

                                return selected?.join(", ");
                              }}
                              MenuProps={MenuProps}
                            >
                              <MenuItem disabled value=''>
                                <em>Placeholder</em>
                              </MenuItem>
                              {userLst &&
                                userLst?.map((name, index) => (
                                  <MenuItem
                                    key={index}
                                    value={name.id}
                                    // style={getStyles(name, this)}
                                  >
                                    {name.firstNameEn}
                                  </MenuItem>
                                ))}
                            </Select> */}
                          </FormControl>
                        </Grid>
                        {/* <Grid item xs={1} className={styles.feildres}></Grid> */}
                        {/* <Grid item xs={4} className={styles.feildres}></Grid> */}
                      </Grid>

                      {/* <Box className={styles.tableHead}>
                        <Box
                        // className={styles.feildHead}
                        // sx={{ width: "400px" }}
                        >
                          {<FormattedLabel id='personDetailsNotOnDuty' />}
                        </Box>
                      </Box> */}
                      {console.log("externalEmp", externalEmp.length)}
                      <Container>
                        <Paper component={Box} p={1}>
                          {externalEmp &&
                            externalEmp.map((e, index) => {
                              return (
                                <>
                                  <Grid
                                    container
                                    columns={{ xs: 4, sm: 8, md: 12 }}
                                    className={styles.feildres}
                                    spacing={3}
                                    key={index}
                                    p={1}
                                    sx={{
                                      // backgroundColor: "#E8F6F3",
                                      border: "7px solid #E8F6F3",
                                      paddingBottom: "49px",
                                      padding: "10px",
                                      margin: "5px",
                                      width: "99%",
                                    }}
                                  >
                                    <Grid item xs={4} className={styles.feildres}>
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        variant="standard"
                                        label={<FormattedLabel id="personName" />}
                                        {...register(`otherEmployeesLst.${index}.offDutyEmpName`)}
                                        error={!!errors.offDutyEmpName}
                                        helperText={
                                          errors?.offDutyEmpName ? errors.offDutyEmpName.message : null
                                        }
                                      />
                                    </Grid>

                                    <Grid item xs={4} className={styles.feildres}>
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        label={<FormattedLabel id="personAddress" />}
                                        variant="standard"
                                        {...register(`otherEmployeesLst.${index}.offDutyEmpAddress`)}
                                        error={!!errors.offDutyEmpAddress}
                                        helperText={
                                          errors?.offDutyEmpAddress ? errors.offDutyEmpAddress.message : null
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={4} className={styles.feildres}>
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        label={<FormattedLabel id="personContactno" />}
                                        variant="standard"
                                        {...register(`otherEmployeesLst.${index}.offDutyEmpContactNo`)}
                                        error={!!errors.offDutyEmpContactNo}
                                        helperText={
                                          errors?.offDutyEmpContactNo
                                            ? errors.offDutyEmpContactNo.message
                                            : null
                                        }
                                      />
                                    </Grid>

                                    <Grid item xs={4} className={styles.feildres}>
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        variant="standard"
                                        label="Full Name (in Marathi)"
                                        // label={<FormattedLabel id="personName" />}
                                        {...register(`otherEmployeesLst.${index}.offDutyEmpNameMr`)}
                                        error={!!errors.offDutyEmpNameMr}
                                        helperText={
                                          errors?.offDutyEmpNameMr ? errors.offDutyEmpNameMr.message : null
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={4} className={styles.feildres}>
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        label="Address (in Marathi)"
                                        // label={
                                        //   <FormattedLabel id="personAddress" />
                                        // }
                                        variant="standard"
                                        {...register(`otherEmployeesLst.${index}.offDutyEmpAddressMr`)}
                                        error={!!errors.offDutyEmpAddressMr}
                                        helperText={
                                          errors?.offDutyEmpAddressMr
                                            ? errors.offDutyEmpAddressMr.message
                                            : null
                                        }
                                      />
                                    </Grid>

                                    <Grid item xs={4} className={styles.feildres}>
                                      <IconButton color="error" onClick={() => removeEmployee(index)}>
                                        <DeleteIcon sx={{ fontSize: 35 }} />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            })}
                          <br />
                          <Button variant="contained" color="secondary" onClick={handleClickEmployee}>
                            Add More <AddBoxOutlinedIcon />
                          </Button>
                        </Paper>
                      </Container>
                    </>
                  )}
                </Grid>
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="externalAdditionalSupportService" />}
                  </Box>
                </Box>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">is External Support Provided?</FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.isExternalServiceProvide"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setExternalService(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setExternalService(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                {/* <Grid item xs={11} className={styles.feildres}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        External Services
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={personName4}
                        onChange={handleChange4}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {fireStation?.map((name, index) => (
                          <MenuItem key={name.id} value={name.fireStationName}>
                            <Checkbox
                              checked={
                                personName4.indexOf(name.fireStationName) > -1
                              }
                              // checked={name.fireStationName }
                            />
                            <ListItemText primary={name.fireStationName} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid> */}
                {/* <Grid container spacing={3}>
                  <Grid item md={3}>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: "80%" }}
                      error={!!errors.externalServiceProvided}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="externalServiceName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="externalServiceName" />}
                          >
                             {externalServiceProvided &&
                              externalServiceProvided.map((fire, index) => (
                                <MenuItem key={index} value={fire.id}>
                              
                                  {fire.serviceType}
                                </MenuItem>
                              ))} 
                         
                          </Select>
                        )}
                        name="externalServiceId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.fireStationName
                          ? errors.fireStationName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={3}>
                    <TextField
InputLabelProps={{
shrink: true,
}}
                      sx={{ width: "80%" }}
                      // size="small"
                      id="standard-basic"
                      label={<FormattedLabel id="personName" />}
                      variant="standard"
                      {...register("esname")}
                      error={!!errors.esname}
                      helperText={errors?.esname ? errors.esname.message : null}
                    />
                  </Grid>
                  <Grid item md={3}>
                    <TextField
InputLabelProps={{
shrink: true,
}}
                      sx={{ width: "80%" }}
                      // size="small"
                      id="standard-basic"
                      label={<FormattedLabel id="personContactno" />}
                      variant="standard"
                      {...register("escontactNo")}
                      error={!!errors.escontactNo}
                      helperText={
                        errors?.escontactNo ? errors.escontactNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item md={3}>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid> */}
                <br />
                <br />
                {externalService == "Yes" ? (
                  <>
                    <Container>
                      <Paper component={Box} p={1} sx={{ paddingLeft: "20px" }}>
                        {extperson &&
                          extperson.map((u, index) => {
                            return (
                              <>
                                <Grid container spacing={3} key={index} p={1}>
                                  <Grid item md={4} sm={6} xs={8}>
                                    <FormControl
                                      variant="standard"
                                      sx={{ minWidth: "80%" }}
                                      error={!!errors.externalServiceId}
                                    >
                                      <InputLabel id="demo-simple-select-standard-label">
                                        {<FormattedLabel id="externalServiceName" />}
                                      </InputLabel>
                                      <Controller
                                        render={({ field }) => (
                                          <Select
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                            label={<FormattedLabel id="externalServiceName" />}
                                          >
                                            {externalServiceProvided &&
                                              externalServiceProvided.map((fire, index) => (
                                                <MenuItem key={index} value={fire.id}>
                                                  {fire.serviceType}
                                                </MenuItem>
                                              ))}
                                          </Select>
                                        )}
                                        name={`firstAhawal.externalSupportLst.${index}.externalServiceId`}
                                        control={control}
                                        defaultValue={null}
                                      />
                                      <FormHelperText>
                                        {errors?.externalServiceId ? errors.externalServiceId.message : null}
                                      </FormHelperText>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4}>
                                    <TextField
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      sx={{ width: "80%" }}
                                      // size="small"
                                      id="standard-basic"
                                      label={<FormattedLabel id="personName" />}
                                      variant="standard"
                                      {...register(`firstAhawal.externalSupportLst.${index}.esname`)}
                                      error={!!errors.esname}
                                      helperText={errors?.esname ? errors.esname.message : null}
                                    />
                                  </Grid>
                                  <Grid item md={3}>
                                    <TextField
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      sx={{ width: "80%" }}
                                      // size="small"
                                      id="standard-basic"
                                      label={<FormattedLabel id="personContactno" />}
                                      variant="standard"
                                      {...register(`firstAhawal.externalSupportLst.${index}.escontactNo`)}
                                      error={!!errors.escontactNo}
                                      helperText={errors?.escontactNo ? errors.escontactNo.message : null}
                                    />
                                  </Grid>
                                  <Grid item md={1}>
                                    <IconButton color="error" onClick={() => removeUser(index)}>
                                      <DeleteIcon sx={{ fontSize: 35 }} />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </>
                            );
                          })}
                        <br />
                        <Button variant="contained" color="secondary" onClick={handleClick2}>
                          Add More <AddBoxOutlinedIcon />
                        </Button>
                      </Paper>
                    </Container>

                    <br />
                    <br />
                  </>
                ) : (
                  <></>
                )}
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>{<FormattedLabel id="otherDetails" />}</Box>
                </Box>
                <br />
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={11} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      id="standard-basic"
                      label={<FormattedLabel id="firedThingsDuringAccuse" />}
                      variant="standard"
                      multiline
                      maxRows={2}
                      {...register("firstAhawal.firedThingsDuringAccuse")}
                      error={!!errors.firedThingsDuringAccuse}
                      helperText={
                        errors?.firedThingsDuringAccuse ? errors.firedThingsDuringAccuse.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={11} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      id="standard-basic"
                      label={<FormattedLabel id="firedThingsDuringAccuseMr" />}
                      variant="standard"
                      multiline
                      maxRows={2}
                      {...register("firstAhawal.firedThingsDuringAccuseMr")}
                      error={!!errors.firedThingsDuringAccuseMr}
                      helperText={
                        errors?.firedThingsDuringAccuseMr ? errors.firedThingsDuringAccuseMr.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">Have Insurrance Policy?</FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.insurancePolicyApplicable"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setInsurrancePolicy(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setInsurrancePolicy(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {insurrancePolicy == "Yes" ? (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ width: "80%" }}
                          multiline
                          // maxRows={2}
                          rows={3}
                          id="standard-basic"
                          label={<FormattedLabel id="insurancePolicyDetails" />}
                          variant="standard"
                          {...register("firstAhawal.insurancePolicyDetails")}
                          error={!!errors.insurancePolicyDetails}
                          helperText={
                            errors?.insurancePolicyDetails ? errors.insurancePolicyDetails.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ width: "80%" }}
                          multiline
                          // maxRows={2}
                          rows={3}
                          id="standard-basic"
                          label={<FormattedLabel id="insurancePolicyDetailsMr" />}
                          variant="standard"
                          {...register("firstAhawal.insurancePolicyDetailsMr")}
                          error={!!errors.insurancePolicyDetailsMr}
                          helperText={
                            errors?.insurancePolicyDetailsMr ? errors.insurancePolicyDetailsMr.message : null
                          }
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}

                  <Grid item xs={4} className={styles.feildres}>
                    {/* <FormControl component='fieldset' sx={{ marginTop: "8%" }}>
                      <FormLabel component='legend'>
                        Is Fire Equipments Available?
                      </FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name='isFireEquipmentsAvailable'
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value='Yes'
                              control={<Radio />}
                              label='Yes'
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setFireEquipmentsAvailable(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value='No'
                              control={<Radio />}
                              label='No'
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setFireEquipmentsAvailable(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl> */}
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">Is fire equipment is available?</FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.isFireEquipmentsAvailable"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setFireEquipmentsAvailable(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setFireEquipmentsAvailable(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {fireEquipmentsAvailable == "Yes" ? (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel id="demo-multiple-chip-label">Fire Equipment</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={fireEquipmentMul}
                            onChange={handleChangeFireEquipmentMul}
                            input={<OutlinedInput id="select-multiple-chip" label="Fire Equipment" />}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip sx={{ backgroundColor: "#AFDBEE" }} key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            <MenuItem
                              key="1"
                              value="11"
                              // style={getStyles(personName6, theme)}
                            >
                              Fire Extinguishers
                            </MenuItem>
                            <MenuItem
                              key="2"
                              value="12"
                              // style={getStyles(personName6, theme)}
                            >
                              Fire Alarm Systems
                            </MenuItem>
                            <MenuItem
                              key="3"
                              value="13"
                              // style={getStyles(personName6, theme)}
                            >
                              Smoke detector
                            </MenuItem>
                            <MenuItem
                              key="4"
                              value="14"
                              // style={getStyles(personName2, theme)}
                            >
                              Heat Detector
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}
                </Grid>
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {/* {<FormattedLabel id="otherDetails" />} */}
                    Vehicle Details
                  </Box>
                </Box>
                <br />
                <br />

                <>
                  <Container>
                    <Paper component={Box} p={1}>
                      {vehicle &&
                        vehicle.map((u, index) => {
                          return (
                            <>
                              <Grid
                                container
                                spacing={3}
                                key={index}
                                p={1}
                                sx={{
                                  // backgroundColor: "#E8F6F3",
                                  border: "7px solid #E8F6F3",
                                  paddingBottom: "49px",
                                  padding: "10px",
                                  margin: "5px",
                                  width: "99%",
                                }}
                              >
                                <Grid item md={3} sm={6} xs={8}>
                                  <FormControl
                                    variant="standard"
                                    sx={{ minWidth: "80%" }}
                                    error={!!errors.vehicle}
                                  >
                                    <InputLabel id="demo-simple-select-standard-label">
                                      {/* {
                                        <FormattedLabel id='externalServiceName' />
                                      } */}
                                      Vehicle Number
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          value={field.value}
                                          onChange={(value) => field.onChange(value)}
                                          label={<FormattedLabel id="externalServiceName" />}
                                        >
                                          {vehicleNumber &&
                                            vehicleNumber.map((fire, index) => (
                                              <MenuItem key={index} value={fire.id}>
                                                {fire.vehicleNumber}
                                              </MenuItem>
                                            ))}
                                        </Select>
                                      )}
                                      name={`firstAhawal.vehicleEntryLst.${index}.vehicle`}
                                      control={control}
                                      defaultValue=""
                                    />
                                    <FormHelperText>
                                      {errors?.vehicle ? errors.vehicle.message : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid item md={4}>
                                  <FormControl error={!!errors.outTime} sx={{ width: "100%" }}>
                                    <Controller
                                      control={control}
                                      defaultValue={null}
                                      name={`firstAhawal.vehicleEntryLst.${index}.outTime`}
                                      render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                          <TimePicker
                                            ampm={false}
                                            openTo="hours"
                                            views={["hours", "minutes", "seconds"]}
                                            inputFormat="HH:mm:ss"
                                            mask="__:__:__"
                                            label="Station Out Time"
                                            value={field.value}
                                            onChange={(time) => {
                                              field.onChange(time);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                size="small"
                                                {...params}
                                              />
                                            )}
                                          />
                                        </LocalizationProvider>
                                      )}
                                    />
                                    <FormHelperText>
                                      {errors?.outTime ? errors.outTime.message : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid item md={5}>
                                  <FormControl error={!!errors.reachedTime} sx={{ width: "90%" }}>
                                    <Controller
                                      control={control}
                                      defaultValue={null}
                                      name={`firstAhawal.vehicleEntryLst.${index}.reachedTime`}
                                      render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                          <TimePicker
                                            ampm={false}
                                            openTo="hours"
                                            views={["hours", "minutes", "seconds"]}
                                            inputFormat="HH:mm:ss"
                                            mask="__:__:__"
                                            label="Vehicle Reached At Location Time"
                                            value={field.value}
                                            onChange={(time) => {
                                              field.onChange(time);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                size="small"
                                                {...params}
                                              />
                                            )}
                                          />
                                        </LocalizationProvider>
                                      )}
                                    />
                                    <FormHelperText>
                                      {errors?.reachedTime ? errors.reachedTime.message : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid item md={3}>
                                  <TextField
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    sx={{ width: "80%" }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="pumpingTime" />}
                                    label="Pumping Time"
                                    variant="standard"
                                    {...register(`firstAhawal.vehicleEntryLst.${index}.workDuration`)}
                                    error={!!errors.workDuration}
                                    helperText={errors?.workDuration ? errors.workDuration.message : null}
                                  />
                                </Grid>
                                <Grid item md={4}>
                                  <FormControl error={!!errors.leaveTime} sx={{ width: "100%" }}>
                                    <Controller
                                      control={control}
                                      defaultValue={null}
                                      name={`firstAhawal.vehicleEntryLst.${index}.leaveTime`}
                                      render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                          <TimePicker
                                            ampm={false}
                                            openTo="hours"
                                            views={["hours", "minutes", "seconds"]}
                                            inputFormat="HH:mm:ss"
                                            mask="__:__:__"
                                            label="Vehicle leave At Location Time"
                                            value={field.value}
                                            onChange={(time) => {
                                              field.onChange(time);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                // sx={{ width: "80%" }}
                                                size="small"
                                                {...params}
                                              />
                                            )}
                                          />
                                        </LocalizationProvider>
                                      )}
                                    />
                                    <FormHelperText>
                                      {errors?.leaveTime ? errors.leaveTime.message : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid item md={5}>
                                  <FormControl error={!!errors.reachedTime} sx={{ width: "90%" }}>
                                    <Controller
                                      control={control}
                                      defaultValue={null}
                                      name={`firstAhawal.vehicleEntryLst.${index}.inTime`}
                                      render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                          <TimePicker
                                            ampm={false}
                                            openTo="hours"
                                            views={["hours", "minutes", "seconds"]}
                                            inputFormat="HH:mm:ss"
                                            mask="__:__:__"
                                            label="Vehicle In Time At Fire Station"
                                            value={field.value}
                                            onChange={(time) => {
                                              field.onChange(time);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                // sx={{ width: "80%" }}
                                                size="small"
                                                {...params}
                                              />
                                            )}
                                          />
                                        </LocalizationProvider>
                                      )}
                                    />
                                    <FormHelperText>
                                      {errors?.inTime ? errors.inTime.message : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid item md={4}>
                                  <TextField
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    sx={{ width: "80%" }}
                                    id="standard-basic"
                                    // label={<FormattedLabel id="distanceTravelledInKms" />}
                                    label="Vehicle Km"
                                    variant="standard"
                                    {...register(
                                      `firstAhawal.vehicleEntryLst.${index}.distanceTravelledInKms`,
                                    )}
                                    error={!!errors.distanceTravelledInKms}
                                    helperText={
                                      errors?.distanceTravelledInKms
                                        ? errors.distanceTravelledInKms.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid item md={6}></Grid>
                                <Grid item md={1}>
                                  <IconButton color="error" onClick={() => removeVehicle(index)}>
                                    <DeleteIcon sx={{ fontSize: 35 }} />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </>
                          );
                        })}
                      <br />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClickVehicle}
                        sx={{ marginLeft: "800px" }}
                      >
                        Add More
                        <AddBoxOutlinedIcon sx={{ paddingLeft: "7px", fontSize: 28 }} />
                      </Button>
                    </Paper>
                  </Container>

                  <br />
                  <br />
                </>
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {/* {<FormattedLabel id="otherDetails" />} */}
                    Life Loss (जीवितहानी)
                  </Box>
                </Box>

                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={2} className={styles.feildres}>
                    <h3>Employee (कर्मचारी) = </h3>
                  </Grid>
                  <Grid item xs={9} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      variant="standard"
                      id="outlined-multiline-static"
                      label="Detail"
                      multiline
                      rows={2}
                      {...register("firstAhawal.selfLossDetails")}

                      // defaultValue="Default Value"
                    />
                  </Grid>

                  <Grid item xs={2} className={styles.feildres}>
                    <h3>Other (समोरचा) = </h3>
                  </Grid>
                  <Grid item xs={9} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      variant="standard"
                      id="outlined-multiline-static"
                      label="Detail"
                      multiline
                      rows={2}
                      {...register("firstAhawal.otherLossDetails")}

                      // defaultValue="Default Value"
                    />
                  </Grid>
                </Grid>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={2} className={styles.feildres}>
                    <h3>Total Count = </h3>
                  </Grid>

                  <Grid item xs={5} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="manPowerLoss" />}
                      variant="standard"
                      {...register("firstAhawal.manPowerLoss")}
                      error={!!errors.manPowerLoss}
                      helperText={errors?.manPowerLoss ? errors.manPowerLoss.message : null}
                    />
                  </Grid>
                  <Grid item xs={5} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="injurred" />}
                      label="Total Injurred"
                      variant="standard"
                      {...register("firstAhawal.injurred")}
                      error={!!errors.injurred}
                      helperText={errors?.injurred ? errors.injurred.message : null}
                    />
                  </Grid>
                </Grid>
                <br />
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {/* {<FormattedLabel id="otherDetails" />} */}
                    Property Loss (वीत्त)
                  </Box>
                </Box>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      variant="standard"
                      // label={<FormattedLabel id="totalVehicleLoss" />}
                      label="Total Vehicle Loss"
                      {...register("firstAhawal.totalVehicleLoss")}
                      error={!!errors.totalVehicleLoss}
                      helperText={errors?.totalVehicleLoss ? errors.totalVehicleLoss.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="totalBuildingLoss" />}
                      label="Total Building Loss"
                      variant="standard"
                      {...register("firstAhawal.totalBuildingLoss")}
                      error={!!errors.totalBuildingLoss}
                      helperText={errors?.totalBuildingLoss ? errors.totalBuildingLoss.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="fireDamages" />}
                      label="Fire Damages (आगीमुळे झालेले नुकसान)"
                      variant="standard"
                      {...register("firstAhawal.fireDamages")}
                      error={!!errors.fireDamages}
                      helperText={errors?.fireDamages ? errors.fireDamages.message : null}
                    />
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
                      <FormattedLabel id="save" />
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
                      // color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() =>
                        router.push({
                          pathname: "/FireBrigadeSystem/transactions/firstAhawal",
                        })
                      }
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </form>
          </FormProvider>
        </div>
      </Paper>
    </Box>
  );
};

export default Form;
