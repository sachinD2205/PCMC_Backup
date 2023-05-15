import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import sweetAlert from "sweetalert";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumBooking";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useRouter } from "next/router";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const localizer = momentLocalizer(moment);

const AuditoriumBooking = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "",
      level: "",
    },
    defaultValues: {
      levelsOfRolesDaoList: [{ equipment: "", quantity: "", rate: "", total: "" }],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    name: "levelsOfRolesDaoList",
    control,
  });

  const appendUI = () => {
    append({
      equipment: "",
      quantity: "",
      rate: "",
      total: "",
    });
  };

  const language = useSelector((state) => state.labels.language);

  const router = useRouter();

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [slideChecked, setSlideChecked] = useState(true);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [id, setID] = useState();

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [events, setEvents] = useState([]);
  const [nextKeyToSend, setNextKeyToSend] = useState(null);
  const [auditoriums, setAuditoriums] = useState([]);
  const [services, setServices] = useState([]);
  const [bank, setBank] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);

  const [bookingFor, setBookingFor] = useState("Booking For PCMC");
  const [loading, setLoading] = useState(false);

  const [nextEntryNumber, setNextEntryNumber] = useState();
  const [meetings, setMeetings] = useState([]);

  const [showListOfShifts, setShowListOfShifts] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [daysOfSlots, setDaysOfSlots] = useState([]);
  const [chargeNames, setChargeNames] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentCharges, setEquipmentCharges] = useState([]);

  const [accordionOpen, setAccordionOpen] = useState(false);

  const onView = useCallback((newView) => console.log("newView", newView));

  const user = useSelector((state) => state.user.user);
  const [bookedAud, setBookedAud] = useState(0);

  console.log("useruser", user, bookedAud);

  const onNavigate = (date, view) => {
    let start, end;

    if (view === "month") {
      // start = moment(date).startOf("month").format("YYYY-MM-DD")
      // console.log(start)
      // end = moment(date).endOf("month").format("YYYY-MM-DD")
      setstartDateLo(moment(date).startOf("month").format("YYYY-MM-DD"));
      console.log(start);
      setendDateLo(moment(date).endOf("month").format("YYYY-MM-DD"));
    }
    console.log("Navigate", start, end);

    return console.log({ start, end });
  };

  const _dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 6 && {
        style: {
          color: "red",
          backgroundColor: "#FFA07A",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // width: "50px",
        },
      }),
      ...(moment(date).day() === 0 && {
        style: {
          color: "red",
          backgroundColor: "#FFA07A",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // width: "50px",
        },
      }),
    }),
    [],
  );

  const handleSelectEvent = useCallback(
    // (event) => window.alert(event.title),
    (event) => {
      loging(event), setIsModalOpen(true);
    },
    [],
  );

  const loging = (event) => {
    console.log("..........events", event);
    setSendquery(event);
    // filterDocketAddToLocalStorage("startDate", event.start)
    // filterDocketAddToLocalStorage("queryParams", event)
    return event;
  };

  const handleChangeRadio = (event) => {
    setBookingFor(event.target.value);
  };

  const [_value, set_Value] = useState(0);

  const handleChange = (event, newValue) => {
    set_Value(newValue);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [rateChartData, setRateChartData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [shortlistData, setShortlistData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getNextBookingKey();
    getShifts();
    getAuditorium();
    getServices();
    getChargeNames();
    getBank();
    getEvents();
    getSlots();
    getEquipment();
    getEquipmentCharges();
    getNexAuditoriumBookingNumber();
    // getAvailableSlotsForBooking();
    setMeetings(
      [
        { id: 1, committeeName: "ABC", agendaNo: 123 },
        { id: 1, committeeName: "ABC", agendaNo: 123 },
      ].map((row) => ({
        id: row.id,
        title: row.committeeName,
        start: moment(new Date()).format("YYYY/MM/DD"),
        end: moment(new Date()).format("YYYY/MM/DD"),
        resourceId: 1,
        agendaNo: row.agendaNo,
      })),
    );
  }, []);

  useEffect(() => {
    getAuditoriumBooking();
  }, [auditoriums]);

  useEffect(() => {
    setValue("applicantName", user?.firstName + " " + user?.surname);
    setValue("applicantMobileNo", user?.mobile);
    setValue("applicantConfirmMobileNo", user?.mobile);
    setValue("applicantEmail", user?.emailID);
    setValue("applicantConfirmEmail", user?.emailID);
    setValue("applicantFlatHouseNo", user?.pflatBuildingNo);
    setValue("applicantFlatBuildingName", user?.pbuildingName);
    setValue("applicantLandmark", user?.plandmark);
    setValue("applicantArea", user?.proadName);
    setValue("applicantCity", user?.pcity?.charAt(0).toUpperCase() + user?.pcity?.slice(1).toLowerCase());
    setValue("applicantPinCode", user?.ppincode);
  }, []);

  useEffect(() => {
    const dates = [];

    auditoriums?.map((val) => {
      if (val.id == watch("auditoriumKey")) {
        console.log("valdd", val.startTime, val.endTime);

        let start = moment(val.startTime.split("T")[1], "HH:mm");
        let end = moment(val.endTime.split("T")[1], "HH:mm");
        let middile = moment(val.startTime.split("T")[1], "HH:mm");

        middile.add(1, "hour");

        while (true) {
          if (start.isAfter(end)) {
            break;
          }
          dates.push({
            fromTime: start.format("HH:mm"),
            toTime: middile.format("HH:mm"),
          });
          start = start.add(60, "minutes");
          middile = middile.add(60, "minutes");
        }

        dates.pop();
        // setAllSlots(dates);
      }
    }),
      // Iterate through available slots and if from time matches with the start time of the allslots then mark is same as true

      dates.map((row) => {
        let _aa = row.fromTime;

        // find matching from all slots where _aa matches with value of fromTime
        let _bb = availableSlots.find(
          (val) => val.fromTime.split(":")[0] + ":" + row.fromTime.split(":")[1] == _aa,
        );
        // set _bb isSame to true
        if (_bb) {
          console.log("inside if");
          row.isSame = true;
        } else {
          row.isSame = false;
        }
      });

    console.log("dates", dates);

    setAllSlots(dates);

    console.log("allSlots", allSlots);

    //bookingDate: "2023-03-27"
  }, [availableSlots]);

  const getNexAuditoriumBookingNumber = () => {
    setLoading(true);
    axios.get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`).then((r) => {
      console.log("neext key", r);
      setNextEntryNumber(r.data);
      setValue("auditoriumBookingNo", r?.data);
      setLoading(false);
    });
  };

  const getRateChartForSelectedShift = () => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstRateChart/getRateByAuditoriumKeyEventKeyApplicationDateAndShift`, {
        params: {
          auditoriumKey: watch("auditoriumKey"),
          eventKey: watch("eventKey"),
          // fromDate: moment(watch("fromDate")).format("DD/MM/YYYY"),
          // toDate: moment(watch("toDate")).format("DD/MM/YYYY"),
          applicationDate: moment(watch("fromDate")).format("DD/MM/YYYY"),
          period: watch("shift"),
        },
      })
      .then((res) => {
        console.log("31res31", res);
        setAccordionOpen(true);
        console.log("res chart", res);
        setLoading(false);
        let result = res.data.mstRateChartList;
        if (res.data.mstRateChartList.length == 0) {
          toast("No Data Available !", {
            type: "error",
          });
        }
        let _res = result.map((val, i) => {
          console.log(
            "5543",
            chargeNames,
            val.chargeNameKey,
            chargeNames?.find((obj) => {
              return obj?.id == val.chargeNameKey;
            })?.charge,
          );
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1,
            id: i,
            auditoriumName: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == val.auditoriumKey;
                })?.auditoriumNameEn
              : "-",
            // auditoriumNameMr: val.auditoriumKey
            //   ? auditoriums?.find((obj) => {
            //       return obj?.id == val.auditoriumKey;
            //     })?.auditoriumNameMr
            //   : "-",
            eventName: val.eventKey
              ? events?.find((obj) => {
                  return obj?.id == val.eventKey;
                })?.eventNameEn
              : "-",
            // eventName: val.eventKey
            //   ? events?.find((obj) => {
            //       return obj?.id == val.eventKey;
            //     })?.eventNameEn
            //   : "-",
            chargeName: val.chargeNameKey
              ? chargeNames?.find((obj) => {
                  return obj?.id == val.chargeNameKey;
                })?.charge
              : "-",
            _charge: val.chargeNameKey ? val.chargeNameKey : "-",
            // chargeNameMr: val.changeNameKey
            //   ? chargeNames?.find((obj) => {
            //       return obj?.id == val.chargeNameKey;
            //     })?.chargeMr
            //   : "-",
            price: val.price ? val.price : "-",
            fromDate: val.fromDate ? moment(val.fromDate).format("DD-MM-YYYY") : "-",
            id: val.id,
            // toDate: val.toDate ? moment(val.toDate).format("DD-MM-YYYY") : "-",
            // range: val.rangeKey
            //   ? [
            //       { id: 1, type: "10%" },
            //       { id: 2, type: "20%" },
            //       { id: 3, type: "30%" },
            //       { id: 4, type: "40%" },
            //       { id: 5, type: "50%" },
            //     ].find((obj) => {
            //       return obj.id == val.rangeKey;
            //     })?.type
            //   : "-",
            // status: val.activeFlag === "Y" ? "Active" : "Inactive",
            // _auditoriumName: val?.auditoriumKey,
            // eventKey: val?.eventKey,
            // charge: val?.chargeNameKey,
            period: val.period,
            gst: 1.18 * val.price,
          };
        });
        console.log("setShortlistData", _res);

        setRateChartData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((err) => {
        console.log("err", err);
        setAccordionOpen(false);
        setLoading(false);
      });
  };

  const getChargeNames = () => {
    axios.get(`${urls.CFCURL}/master/chargeName/getAll`).then((res) => {
      console.log("11res11", res);

      let result = res.data.chargeName;
      let _res = result.map((val, i) => {
        return {
          ...val,
        };
      });

      setChargeNames(_res);
    });
  };

  const getSlots = () => {
    axios.get(`${urls.CFCURL}/master/slot/getAll`).then((r) => {
      console.log("slots res", r);
      setSlots(
        r.data.slots.map((row, index) => ({
          id: row.id,
          fromTime: row.fromTime,
          toTime: row.toTime,
          slotDate: row.slotDate,
        })),
      );
    });
  };

  const getEquipment = () => {
    axios.get(`${urls.PABBMURL}/mstEquipment/getAll`).then((res) => {
      console.log("res equipment", res);
      setEquipments(res?.data?.mstEquipmentList);
    });
  };

  const getEquipmentCharges = () => {
    axios.get(`${urls.PABBMURL}/mstEquipmentCharges/getAll`).then((res) => {
      console.log("res equipment charges", res);
      setEquipmentCharges(res?.data?.mstEquipmentChargesList);
    });
  };

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe 4Au", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          ...row,
          id: row.id,
          auditoriumNameEn: row.auditoriumNameEn,
        })),
      );
    });
  };

  const getServices = () => {
    axios.get(`http://15.206.219.76:8090/cfc/api/master/service/getAll`).then((r) => {
      console.log("respe ser", r);
      setServices(
        r.data.service.map((row, index) => ({
          id: row.id,
          serviceName: row.serviceName,
          serviceNameMr: row.serviceNameMr,
        })),
      );
    });
  };

  const getBank = () => {
    console.log("123");
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`)
      // .get("http://15.206.219.76:8090/cfc/api/master/bank/getAll")
      .then((r) => {
        console.log("bank 123", r);
        setBank(r?.data?.bank);
      });
  };

  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row, index) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };

  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        })),
      );
    });
  };

  const getEvents = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
      setEvents(
        r.data.trnAuditoriumEventsList.map((row) => ({
          ...row,
          id: row.id,
          programEventDescription: row.programEventDescription,
        })),
      );
    });
  };

  const getNextBookingKey = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`).then((r) => {
      console.log("res nextKey", r.data);
      setNextKeyToSend(r?.data);
    });
  };

  const getAvailableSlotsForBooking = (auditoriumKey, fromDate, toDate) => {
    setLoading(true);
    axios
      // .get("http://192.168.68.125:9006/pabbm/api/auditoriumBookingDetails/getAll", {
      .get(`${urls.PABBMURL}/auditoriumBookingDetails/getBookingDetailsByDateAndAuditoriumId`, {
        params: {
          auditoriumId: auditoriumKey,
          fromDate: moment(fromDate).format("DD/MM/YYYY"),
          toDate: moment(toDate).format("DD/MM/YYYY"),
        },
      })
      .then((r) => {
        console.log("slots from BE", r);
        setAvailableSlots(
          r.data.auditoriumBookingDetailsList.map((row) => ({
            ...row,
            id: row.id,
          })),
        );

        setLoading(false);

        if (r.data.auditoriumBookingDetailsList.length === 0) {
          setShowMessage(true);
        } else {
          setShowMessage(false);
        }
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
      });
  };

  const getShifts = () => {
    axios.get(`${urls.PABBMURL}/mstEventHour/getAll`).then((r) => {
      console.log("respe shift", r);
      setShifts(
        r.data.mstEventHourList.map((row, index) => ({
          id: row.id,
          timeSlot: row.timeSlot,
          shift: row.shift,
        })),
      );
    });
  };

  const getAuditoriumBooking = () => {
    setLoading(true);
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`,
        // "http://192.168.68.123:9003/pabbm/api/trnAuditoriumBookingOnlineProcess/getAll",
      )
      .then((res) => {
        console.log("res aud", res);

        setLoading(false);
        let _result = res.data.trnAuditoriumBookingOnlineProcessList[0];
        setBookedAud(_result);

        let result = res.data.trnAuditoriumBookingOnlineProcessList;
        let _res = result.map((val, i) => {
          return {
            // srNo: _pageSize * _pageNo + i + 1,
            id: val.id,
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            toDate: val.toDate ? val.toDate : "-",
            fromDate: val.fromDate ? val.fromDate : "-",
            holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
            // status: val.activeFlag === "Y" ? "Active" : "Inactive",
            status: val.applicationStatus,
            activeFlag: val.activeFlag,

            auditoriumId: val.auditoriumId
              ? auditoriums.find((obj) => obj?.id == val.auditoriumId)?.auditoriumNameEn
              : "Not Available",
            eventDate: val.eventDate ? moment(val?.eventDate).format("DD-MM-YYYY") : "-",
            mobile: val.mobile ? val.mobile : "-",
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName + " " + val.organizationOwnerLastName
              : "-",
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

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
          axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getAuditoriumBooking();
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
          axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getAuditoriumBooking();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    billPrefix: "",
    billType: "",
    fromDate: null,
    toDate: null,
    remark: "",
  };

  const exitButton = () => {
    router.push("/dashboard");
  };

  const onSubmitForm = (formData) => {
    sweetAlert({
      title: "Auditorium Booking",
      text: "Do you really want to book an auditorium?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: ["No", "Yes"],
    }).then((will) => {
      if (will) {
        console.log("formData", formData);

        const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
        const finalBodyForApi = {
          ...formData,
          createdUserId: user?.id,
          isApproved: true,
          eventDate,
          applicationNumber: nextEntryNumber.toString(),
          // auditoriumBookingNo: Number(formData.auditoriumBookingNo),
          auditoriumId: Number(formData.auditoriumId),
          aadhaarNo: Number(formData.aadhaarNo),
          landlineNo: Number(formData.landlineNo),
          mobile: Number(formData.mobile),
          depositAmount: Number(formData.depositAmount),
          payRentAmount: Number(formData.payRentAmount),
          pincode: Number(formData.pincode),
          rentAmount: Number(formData.rentAmount),
          extendedRentAmount: Number(formData.extendedRentAmount),
          bankaAccountNo: Number(formData.bankaAccountNo),
          pincode: Number(formData?.pinCode),
          bookingFor: bookingFor,
          flatBuildingNo: Number(formData.flatBuildingNo),
          //booked data
          shift: watch("shift"),
          startTime: watch("startTime"),
          auditoriumBookingDetailsList: selectedCheckbox.map((val) => {
            return {
              auditoriumId: watch("auditoriumKey"),
              fromTime: val.split("-")[0].trim(),
              toTime: val.split("-")[1].trim(),
              bookingDate: moment(watch("fromDate")).format("YYYY-MM-DD"),
              // bookingKey: nextKeyToSend,
              applicationNumberKey: nextEntryNumber.toString(),
            };
          }),
          equipmentBookingList: formData.levelsOfRolesDaoList.map((val) => {
            console.log("first", val);
            return {
              equipmentKey: Number(val.equipment),
              quantity: Number(val.quantity),
              rate: Number(val.rate),
              total: Number(val.total),
              applicationNumberKey: nextEntryNumber.toString(),
            };
          }),
          totalAmount:
            (formData.depositAmount +
              formData.rentAmount +
              formData.securityGuardChargesAmount +
              formData.boardChargesAmount) *
            1.18,
          securityGuardChargeAmount: Number(formData.securityGuardChargesAmount),
          boardChargesAmount: Number(formData.boardChargesAmount),
          serviceId: 113,
          paymentDao: {
            bankAccountHolderName: formData?.bankAccountHolderName,
            bankaAccountNo: formData?.bankaAccountNo,
            typeOfBankAccount: formData?.typeOfBankAccount,
            bankNameId: formData?.bankNameId,
            bankAddress: formData?.bankAddress,
            ifscCode: formData?.ifscCode,
            micrCode: formData?.micrCode,
          },
          processType: "B",
          designation: "Citizen"
        };

        console.log("finalBodyForApi", finalBodyForApi);

        // axios
        //   .post(
        //     `http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/save`,
        //     finalBodyForApi,
        //   )
        //   .then((res) => {
        //
        axios.post(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`, finalBodyForApi).then((res) => {
          console.log("save data", res);
          if (res.status == 201) {
            formData.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert(
                  "Saved!",
                  `Record Saved successfully, Your Application Number is ${
                    bookedAud?.applicationNumber
                  }!`,
                  "success",
                );
            getAuditoriumBooking();
            setButtonInputState(false);
            setIsOpenCollapse(true);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            router.push({
              pathname: "./auditoriumBooking/acknowledgmentReceiptmarathi",
              query: "",
            });
          }
        });
      } else {
        router.push("/dashboard");
      }
    });
  };

  const resetValuesExit = {
    fromDate: "",
    toDate: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      headerAlign: "center",
    },
    {
      field: "auditoriumId",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "organizationOwnerFirstName",
      headerName: <FormattedLabel id="organizationOwnerFirstName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "mobile",
      headerName: <FormattedLabel id="mobile" />,
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "organizationName",
      headerName: <FormattedLabel id="organizationName" />,
      flex: 1,
      headerAlign: "center",
    },
    ,
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      headerAlign: "center",
    },
  ];

  const _columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: "Auditorium",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "bookingDate",
      headerName: "Event Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "shift",
      headerName: "Shift",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const rateChartColumns = [
    {
      field: "srNo",
      headerName: "Sr No",
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: "Auditorium",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventName",
      headerName: "Event",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chargeName",
      headerName: "Charge",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "period",
      headerName: "Period (Hr)",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "gst",
      headerName: "GST",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "deposite",
    //   headerName: "Deposite",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "rent",
    //   headerName: "Rent",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "securityGuardCharges",
    //   headerName: "Security Guard Charges",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "boardCharges",
    //   headerName: "Board Charges",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
  ];

  const handleSlotChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    //chargeKey
    //33 Depo,34 rent,35 Security,36 Board

    if (isChecked) {
      setSelectedCheckbox([...selectedCheckbox, value]);

      let _test = {};
      rateChartData.rows.map((val) => {
        chargeNames?.map((obj) => {
          if (obj?.id == val._charge) {
            _test = { ..._test, [obj?.charge]: val?.price };
          }
        });
      }),
        setValue("depositAmount", _test.Deposite);
      setValue("boardChargesAmount", _test["Board Charges"]);
      setValue("securityGuardChargesAmount", _test["Security Guard Charges"]);
      setValue("rentAmount", _test.Rent);
      // setValue(
      //   "boardChargesAmount",
      //   ((selectedCheckbox.length + 1) * _test["Board Charges"]) / watch("shift"),
      // );
      // setValue(
      //   "securityGuardChargesAmount",
      //   ((selectedCheckbox.length + 1) * _test["Security Guard Charges"]) / watch("shift"),
      // );
      // setValue("rentAmount", ((selectedCheckbox.length + 1) * _test.Rent) / watch("shift"));

      // setValue("rentAmount", ((selectedCheckbox.length + 1) * rateChartData.rows[3].price) / watch("shift"));
    } else {
      setSelectedCheckbox(selectedCheckbox.filter((val) => val !== value));
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Paper>
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
              {/* Auditorium Booking */}
              <FormattedLabel id="auditoriumBooking" />
            </h2>
          </Box>
          {console.log("selectedCheckbox", selectedCheckbox)}
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <>
                  <Accordion sx={{ padding: "10px" }} defaultExpanded>
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>Check Auditorium Availability</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl error={errors.auditoriumKey} variant="standard" sx={{ width: "90%" }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="auditorium" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => {
                                    setValue("auditoriumId", value.target.value);
                                    return field.onChange(value);
                                  }}
                                  label={<FormattedLabel id="auditorium" />}
                                >
                                  {auditoriums &&
                                    auditoriums.map((auditorium, index) => {
                                      return (
                                        <MenuItem key={index} value={auditorium.id}>
                                          {auditorium.auditoriumNameEn}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="auditoriumKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.auditoriumKey ? errors.auditoriumKey.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.eventKey}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="selectEvent" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => {
                                    setValue("serviceId", value.target.value);
                                    return field.onChange(value);
                                  }}
                                  label={<FormattedLabel id="selectEvent" />}
                                >
                                  {events?.map((service, index) => (
                                    <MenuItem key={index} value={service.id}>
                                      {service.programEventDescription}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                              name="eventKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.eventKey ? errors.eventKey.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <FormControl sx={{ width: "90%" }} error={errors.calendar}>
                            <Controller
                              name="fromDate"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {/* <FormattedLabel id="eventDate" /> */}
                                        From Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => {
                                      field.onChange(date);
                                      setValue("eventDayFrom", moment(date).format("dddd"));
                                      setValue("eventDateFrom", date);
                                    }}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField {...params} size="small" fullWidth error={errors.calendar} />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.calendar ? errors.calendar.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <FormControl sx={{ width: "90%" }} error={errors.calendar}>
                            <Controller
                              name="toDate"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {/* <FormattedLabel id="eventDate" /> */}
                                        To Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => {
                                      field.onChange(date);
                                      setValue("eventDayTo", moment(date).format("dddd"));
                                      setValue("eventDateTo", date);

                                      let _abc = [];

                                      let dates = [];

                                      let start = moment(watch("fromDate"));
                                      let end = moment(watch("toDate"));

                                      while (true) {
                                        if (start.isAfter(end)) {
                                          break;
                                        }
                                        dates.push({
                                          date: start.format("DD-MM-YYYY"),
                                        });
                                        start = start.add(1, "days");
                                      }

                                      setDaysOfSlots(dates);

                                      // for (
                                      //   var m = moment(watch("fromDate"));
                                      //   m.isBefore(watch("toDate"));
                                      //   m.add(1, "days")
                                      // ) {
                                      //   console.log("345m",m);
                                      //   startDate.push(m.format("DD-MM-YYYY"));
                                      // }

                                      // for (
                                      //   let i = 0;
                                      //   i <= moment(watch("toDate")).diff(moment(watch("fromDate")), "days");
                                      //   i++
                                      // ) {
                                      //   _abc.push(i + 1);
                                      // }
                                      // console.log("_abc",_abc,"startDate",dates);
                                      // setDaysOfSlots(_abc);
                                    }}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField {...params} size="small" fullWidth error={errors.calendar} />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.calendar ? errors.calendar.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          disabled={
                            !(
                              watch("auditoriumKey") &&
                              watch("eventKey") &&
                              watch("fromDate") &&
                              watch("toDate")
                            )
                          }
                          endIcon={<SearchIcon />}
                          onClick={() => {
                            setShowListOfShifts(true);
                            setAvailableSlots([]);
                            getAvailableSlotsForBooking(
                              watch("auditoriumKey"),
                              watch("fromDate"),
                              watch("toDate"),
                            );
                          }}
                        >
                          Search
                        </Button>
                      </Grid>
                      {showListOfShifts && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              backgroundColor: "#EEE7F6",
                              alignItems: "center",
                              padding: "10px",
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: "900" }}>
                              List of shifts for booking
                            </Typography>
                          </Grid>
                          <Box sx={{ padding: "10px" }}>
                            {showMessage && (
                              <Typography sx={{ fontWeight: "900" }}>All Slot's are available</Typography>
                            )}
                          </Box>

                          <Grid container sx={{ padding: "10px", display: "flex", justifyContent: "center" }}>
                            <FormGroup fullWidth sx={{ width: "40%" }}>
                              <FormControl fullWidth error={errors.shift} variant="outlined" size="small">
                                <InputLabel id="demo-simple-select-outlined-label">
                                  <FormattedLabel id="shift" />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-outlined-label"
                                      id="demo-simple-select-outlined"
                                      value={field.value}
                                      onChange={(value) => {
                                        console.log("wwq", value.target.value, shifts);
                                        return field.onChange(value);
                                      }}
                                      label={<FormattedLabel id="shift" />}
                                    >
                                      {shifts.map((auditorium, index) => {
                                        return (
                                          <MenuItem key={index} value={auditorium.timeSlot}>
                                            {auditorium.shift +
                                              " " +
                                              "(" +
                                              auditorium.timeSlot +
                                              " " +
                                              "Hrs" +
                                              ")"}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  )}
                                  name="shift"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>{errors?.shift ? errors.shift.message : null}</FormHelperText>
                              </FormControl>
                            </FormGroup>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              disabled={
                                !(
                                  watch("auditoriumKey") &&
                                  watch("eventKey") &&
                                  watch("fromDate") &&
                                  watch("toDate") &&
                                  watch("shift")
                                )
                              }
                              onClick={() => {
                                getRateChartForSelectedShift();
                              }}
                            >
                              Confirm
                            </Button>
                          </Grid>
                          <Divider />
                          <Grid container sx={{ padding: "10px" }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                              Booking Number :- {nextKeyToSend}
                            </Typography>
                          </Grid>

                          <Grid container sx={{ padding: "10px" }}>
                            {daysOfSlots?.map((item) => {
                              return (
                                <Card sx={{ width: "100%" }}>
                                  <CardHeader
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      padding: "5px",
                                    }}
                                    subheader={item.date}
                                  />
                                  <Divider />

                                  <CardContent>
                                    <Grid container>
                                      {allSlots?.map((val, index) => {
                                        return (
                                          <Grid
                                            item
                                            xs={2}
                                            sx={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              border: "1px solid gray",
                                              borderRadius: "5px",
                                              margin: "5px",
                                            }}
                                          >
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  // checked={val.isSame}
                                                  value={val.fromTime + " - " + val.toTime}
                                                  checked={selectedCheckbox.includes(
                                                    val.fromTime + " - " + val.toTime,
                                                  )}
                                                  disabled={val.isSame}
                                                  onChange={handleSlotChange}
                                                />
                                              }
                                              label={val.fromTime + " - " + val.toTime}
                                            />
                                          </Grid>
                                        );
                                      })}
                                    </Grid>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </Grid>

                          <Grid container sx={{ padding: "10px" }}>
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                              Booking Charges -
                            </Typography>
                          </Grid>

                          <Grid container sx={{ padding: "10px" }}>
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
                              initialState={{
                                aggregation: {
                                  model: {
                                    price: "sum",
                                  },
                                },
                              }}
                              autoHeight={true}
                              pagination
                              paginationMode="server"
                              rowCount={rateChartData.totalRows}
                              rowsPerPageOptions={rateChartData.rowsPerPageOptions}
                              page={rateChartData.page}
                              pageSize={rateChartData.pageSize}
                              rows={rateChartData.rows}
                              columns={rateChartColumns}
                              onPageChange={(_data) => {}}
                              onPageSizeChange={(_data) => {}}
                            />
                          </Grid>

                          {/* <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              endIcon={<CheckIcon />}
                              onClick={() => {}}
                            >
                              Shortlist
                            </Button>
                          </Grid> */}
                        </>
                      )}

                      {/* <Box style={{ height: "auto", overflow: "auto" }}>
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
                          pagination
                          paginationMode="server"
                          rowCount={shortlistData.totalRows}
                          rowsPerPageOptions={shortlistData.rowsPerPageOptions}
                          page={shortlistData.page}
                          pageSize={shortlistData.pageSize}
                          rows={shortlistData.rows}
                          columns={_columns}
                          onPageChange={(_data) => {
                            // getBillType(data.pageSize, _data);
                          }}
                          onPageSizeChange={(_data) => {
                            // getBillType(_data, data.page);
                          }}
                        />
                      </Box> */}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion sx={{ padding: "10px" }}>
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>Equipments</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box style={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}>
                        {router.query.mode === "view" ? (
                          <></>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            endIcon={<AddBoxOutlinedIcon />}
                            onClick={() => {
                              appendUI();
                            }}
                          >
                            Add More
                          </Button>
                        )}
                      </Box>
                      <Grid container>
                        {fields.map((witness, index) => {
                          return (
                            <>
                              <Grid
                                container
                                key={index}
                                sx={{
                                  backgroundColor: "#E8F6F3",
                                  padding: "5px",
                                }}
                              >
                                <Grid
                                  item
                                  xs={5}
                                  sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                  <FormControl style={{ width: "90%" }} size="small">
                                    <InputLabel id="demo-simple-select-label">Equipment</InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label="Equipment"
                                          value={field.value}
                                          onChange={(value) => {
                                            field.onChange(value);
                                            // console.log("value",value.target.value);
                                            let df = equipmentCharges.find((val) => {
                                              return (
                                                val.equipmentName == value.target.value && val.totalAmount
                                              );
                                            });
                                            setValue(`levelsOfRolesDaoList.${index}.rate`, df.totalAmount);
                                          }}
                                          style={{ backgroundColor: "white" }}
                                        >
                                          {equipments.length > 0
                                            ? equipments.map((val, id) => {
                                                return (
                                                  <MenuItem key={id} value={val.id}>
                                                    {language === "en"
                                                      ? val.equipmentNameEn
                                                      : val.equipmentNameMr}
                                                  </MenuItem>
                                                );
                                              })
                                            : "Not Available"}
                                        </Select>
                                      )}
                                      name={`levelsOfRolesDaoList.${index}.equipment`}
                                      control={control}
                                      defaultValue=""
                                      key={witness.id}
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                      {errors?.departmentName ? errors.departmentName.message : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label="Rate"
                                    disabled
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    variant="outlined"
                                    style={{ backgroundColor: "white" }}
                                    {...register(`levelsOfRolesDaoList.${index}.rate`)}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label="Quantity"
                                    variant="outlined"
                                    // key={witness.id}
                                    style={{ backgroundColor: "white" }}
                                    {...register(`levelsOfRolesDaoList.${index}.quantity`)}
                                    key={witness.id}
                                    // name={`levelsOfRolesDaoList[${index}].quantity`}
                                    inputRef={register()}
                                    onChange={(event) => {
                                      const { value } = event.target;
                                      setValue(
                                        `levelsOfRolesDaoList[${index}].total`,
                                        value * watch(`levelsOfRolesDaoList.${index}.rate`),
                                      );
                                    }}
                                    error={errors?.levelsOfRolesDaoList?.[index]?.quantity}
                                    helperText={
                                      errors?.levelsOfRolesDaoList?.[index]?.quantity
                                        ? errors.levelsOfRolesDaoList?.[index]?.quantity.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label="Total"
                                    disabled
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    variant="outlined"
                                    style={{ backgroundColor: "white" }}
                                    {...register(`levelsOfRolesDaoList.${index}.total`)}
                                  />
                                </Grid>

                                {/* {router.query.mode === "view" ? (
                                  <></>
                                ) : (
                                  <> */}
                                <Grid
                                  item
                                  xs={1}
                                  sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                  <IconButton color="error" onClick={() => remove(index)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                                {/* </>
                                )} */}
                              </Grid>
                            </>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion sx={{ padding: "10px" }}>
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>Booking Auditorium Detail's</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl error={errors.auditoriumId} variant="standard" sx={{ width: "90%" }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {" "}
                              <FormattedLabel id="selectAuditorium" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  disabled
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="selectAuditorium" />}
                                >
                                  {auditoriums &&
                                    auditoriums.map((auditorium, index) => {
                                      return (
                                        <MenuItem key={index} value={auditorium.id}>
                                          {auditorium.auditoriumNameEn}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="auditoriumId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.auditoriumId ? errors.auditoriumId.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.serviceId}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="selectEvent" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  disabled
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="selectEvent" />}
                                >
                                  {events &&
                                    events.map((service, index) => (
                                      <MenuItem
                                        key={index}
                                        sx={{
                                          display: service.programEventDescription ? "flex" : "none",
                                        }}
                                        value={service.id}
                                      >
                                        {service.programEventDescription}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="serviceId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.serviceId ? errors.serviceId.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="auditoriumBookingNumber" />}
                            variant="standard"
                            sx={{ width: "90%" }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            value={nextEntryNumber}
                            {...register("auditoriumBookingNo")}
                            // error={!!errors.auditoriumBookingNo}
                            // helperText={
                            //   errors?.auditoriumBookingNo
                            //     ? errors.auditoriumBookingNo.message
                            //     : null
                            // }
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <FormControl sx={{ width: "100%" }}>
                          <RadioGroup
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-around",
                            }}
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={bookingFor}
                            onChange={handleChangeRadio}
                          >
                            <FormControlLabel
                              value="Booking For PCMC"
                              control={<Radio />}
                              label={<FormattedLabel id="bookingForPCMC" />}
                            />
                            <FormControlLabel
                              value="Booking For Other Vendor"
                              control={<Radio />}
                              label={<FormattedLabel id="bookingForOtherVendor" />}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      {bookingFor === "Booking For PCMC" && (
                        <Grid container sx={{ padding: "10px" }}>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              type="number"
                              sx={{
                                width: "90%",
                                "& .MuiInput-input": {
                                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                  },
                                },
                              }}
                              onInput={(e) => {
                                e.target.value = Math.max(0, parseInt(e.target.value))
                                  .toString()
                                  .slice(0, 10);
                              }}
                              id="standard-basic"
                              label="Employee Id"
                              variant="standard"
                              {...register("employeeId")}
                              error={!!errors.employeeId}
                              helperText={errors?.employeeId ? errors.employeeId.message : null}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              sx={{ width: "90%" }}
                              id="standard-basic"
                              label="Employee name"
                              variant="standard"
                              {...register("employeeName")}
                              error={!!errors.employeeName}
                              helperText={errors?.employeeName ? errors.employeeName.message : null}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              sx={{ width: "90%" }}
                              id="standard-basic"
                              label="Designation"
                              variant="standard"
                              {...register("employeeDesignation")}
                              error={!!errors.employeeDesignation}
                              helperText={
                                errors?.employeeDesignation ? errors.employeeDesignation.message : null
                              }
                            />
                          </Grid>
                        </Grid>
                      )}

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="organizationName" />}
                            variant="standard"
                            {...register("organizationName")}
                            error={!!errors.organizationName}
                            helperText={errors?.organizationName ? errors.organizationName.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Event Title"
                            // label={<FormattedLabel id="title" />}
                            variant="standard"
                            {...register("eventTitle")}
                            error={!!errors.eventTitle}
                            helperText={errors?.eventTitle ? errors.eventTitle.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="flat_buildingNo" />}
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            variant="standard"
                            type="number"
                            {...register("flatBuildingNo")}
                            error={!!errors.flatBuildingNo}
                            helperText={errors?.flatBuildingNo ? errors.flatBuildingNo.message : null}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={1.5}
                          sm={1.5}
                          md={1.5}
                          lg={1.5}
                          xl={1.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl error={errors.title} variant="standard" sx={{ width: "80%" }}>
                            <InputLabel id="demo-simple-select-standard-label">Title</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title"
                                >
                                  {["Mr", "Mrs", "Ms", "Miss"].map((city, index) => {
                                    return (
                                      <MenuItem key={index} value={city}>
                                        {city}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="title"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>{errors?.title ? errors.title.message : null}</FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={3.5}
                          sm={3.5}
                          md={3.5}
                          lg={3.5}
                          xl={3.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="organizationOwnerFirstName" />}
                            variant="standard"
                            {...register("organizationOwnerFirstName")}
                            error={!!errors.organizationOwnerFirstName}
                            helperText={
                              errors?.organizationOwnerFirstName
                                ? errors.organizationOwnerFirstName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3.5}
                          sm={3.5}
                          md={3.5}
                          lg={3.5}
                          xl={3.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="organizationOwnerMiddleName" />}
                            variant="standard"
                            {...register("organizationOwnerMiddleName")}
                            error={!!errors.organizationOwnerMiddleName}
                            helperText={
                              errors?.organizationOwnerMiddleName
                                ? errors.organizationOwnerMiddleName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3.5}
                          sm={3.5}
                          md={3.5}
                          lg={3.5}
                          xl={3.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="organizationOwnerLastName" />}
                            variant="standard"
                            {...register("organizationOwnerLastName")}
                            error={!!errors.organizationOwnerLastName}
                            helperText={
                              errors?.organizationOwnerLastName
                                ? errors.organizationOwnerLastName.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" />}
                            variant="standard"
                            {...register("buildingName")}
                            error={!!errors.buildingName}
                            helperText={errors?.buildingName ? errors.buildingName.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" />}
                            variant="standard"
                            {...register("roadName")}
                            error={!!errors.roadName}
                            helperText={errors?.roadName ? errors.roadName.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="landmark" />}
                            variant="standard"
                            {...register("landmark")}
                            error={!!errors.landmark}
                            helperText={errors?.landmark ? errors.landmark.message : null}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="pinCode" />}
                            variant="standard"
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6);
                            }}
                            {...register("pinCode")}
                            error={!!errors.pinCode}
                            helperText={errors?.pinCode ? errors.pinCode.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="aadhaarNo" />}
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                            }}
                            variant="standard"
                            {...register("aadhaarNo")}
                            error={!!errors.aadhaarNo}
                            helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 11);
                            }}
                            label={<FormattedLabel id="landline" />}
                            variant="standard"
                            {...register("landlineNo")}
                            error={!!errors.landlineNo}
                            helperText={errors?.landlineNo ? errors.landlineNo.message : null}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="mobile" />}
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                            }}
                            variant="standard"
                            {...register("mobile")}
                            error={!!errors.mobile}
                            helperText={errors?.mobile ? errors.mobile.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="emailAddress" />}
                            variant="standard"
                            {...register("emailAddress")}
                            error={!!errors.emailAddress}
                            helperText={errors?.emailAddress ? errors.emailAddress.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl error={errors.checkAuditoriumKey} variant="standard">
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="messageDisplay" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="messageDisplay" />}
                                >
                                  {["Yes", "No"].map((auditorium, index) => {
                                    return (
                                      <MenuItem key={index} value={auditorium}>
                                        {auditorium}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="messageDisplay"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.messageDisplay ? errors.messageDisplay.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="eventDetails" />}
                            variant="standard"
                            {...register("eventDetails")}
                            error={!!errors.eventDetails}
                            helperText={errors?.eventDetails ? errors.eventDetails.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <FormControl sx={{ width: "90%" }} error={errors.eventDateFrom}>
                            <Controller
                              name="eventDateFrom"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    disablePast
                                    inputFormat="DD/MM/YYYY"
                                    disabled
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {/* <FormattedLabel id="eventDate" /> */}
                                        Event Date From
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => {
                                      field.onChange(date);
                                    }}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        fullWidth
                                        error={errors.eventDateFrom}
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.eventDateFrom ? errors.eventDateFrom.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <FormControl sx={{ width: "90%" }} error={errors.eventDateTo}>
                            <Controller
                              name="eventDateTo"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    disablePast
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {/* <FormattedLabel id="eventDate" /> */}
                                        Event Date To
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => {
                                      field.onChange(date);
                                    }}
                                    disabled
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        fullWidth
                                        error={errors.eventDateTo}
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.eventDateTo ? errors.eventDateTo.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            // label={<FormattedLabel id="eventDay" />}
                            label="Event Day From"
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="standard"
                            {...register("eventDayFrom")}
                            error={!!errors.eventDayFrom}
                            helperText={errors?.eventDayFrom ? errors.eventDayFrom.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            // label={<FormattedLabel id="eventDay" />}
                            label="Event Day To"
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="standard"
                            {...register("eventDayTo")}
                            error={!!errors.eventDayTo}
                            helperText={errors?.eventDayTo ? errors.eventDayTo.message : null}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        {/*   <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
                            <Controller
                              name="eventTimeFrom"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="eventTimeFrom" />
                                      </span>
                                    }
                                    renderInput={(params) => (
                                      <TextField {...params} size="small" error={!!errors.eventTimeFrom} />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.eventTimeFrom ? errors.eventTimeFrom.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
                            <Controller
                              name="eventTimeTo"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="eventTimeTo" />
                                      </span>
                                    }
                                    renderInput={(params) => (
                                      <TextField {...params} size="small" error={!!errors.eventTimeTo} />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.eventTimeTo ? errors.eventTimeTo.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid> */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="depositAmount" />}
                            variant="standard"
                            type="number"
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            {...register("depositAmount")}
                            error={!!errors.depositAmount}
                            helperText={errors?.depositAmount ? errors.depositAmount.message : null}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        {/* <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "end",
                          }}
                        >
                          <Typography>
                            <FormattedLabel id="payDepositAmount" />
                          </Typography>
                          <Link href="#">Link</Link>
                        </Grid> */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="rentAmount" />}
                            variant="standard"
                            type="number"
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                            }}
                            {...register("rentAmount")}
                            error={!!errors.rentAmount}
                            helperText={errors?.rentAmount ? errors.rentAmount.message : null}
                          />
                        </Grid>
                        {/* <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="payRentAmount" />}
                            variant="standard"
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                            }}
                            {...register("payRentAmount")}
                            error={!!errors.payRentAmount}
                            helperText={errors?.payRentAmount ? errors.payRentAmount.message : null}
                          />
                        </Grid> */}
                      </Grid>

                      {/* <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "end",
                          }}
                        >
                          <Typography>
                            <FormattedLabel id="depositReceipt" />
                          </Typography>
                          <Link
                            onClick={() => {
                              console.log("ww");
                              router.push({
                                pathname: "/PublicAuditorium/transaction/auditoriumBooking/DepositReceipt",
                                // query: {
                                //   ...router?.query,
                                // },
                              });
                            }}
                          >
                            Print
                          </Link>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="extendedRentAmount" />}
                            variant="standard"
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                            }}
                            {...register("extendedRentAmount")}
                            error={!!errors.extendedRentAmount}
                            helperText={errors?.extendedRentAmount ? errors.extendedRentAmount.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "end",
                          }}
                        >
                          <Typography>
                            <FormattedLabel id="rentReceipt" />
                          </Typography>
                          <Link
                            onClick={() => {
                              console.log("ww");
                              router.push({
                                pathname: "/PublicAuditorium/transaction/auditoriumBooking/RentReceipt",
                              });
                            }}
                          >
                            Print
                          </Link>
                        </Grid>
                      </Grid> */}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion sx={{ padding: "10px" }}>
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>Applicant Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Applicant Name"
                            variant="standard"
                            {...register("applicantName")}
                            error={!!errors.applicantName}
                            helperText={errors?.applicantName ? errors.applicantName.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label="Mobile Number"
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                            }}
                            variant="standard"
                            {...register("applicantMobileNo")}
                            error={!!errors.applicantMobileNo}
                            helperText={errors?.applicantMobileNo ? errors.applicantMobileNo.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label="Confirm Mobile"
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                            }}
                            variant="standard"
                            {...register("applicantConfirmMobileNo")}
                            error={!!errors.applicantConfirmMobileNo}
                            helperText={
                              errors?.applicantConfirmMobileNo
                                ? errors.applicantConfirmMobileNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Email Address"
                            variant="standard"
                            {...register("applicantEmail")}
                            error={!!errors.applicantEmail}
                            helperText={errors?.applicantEmail ? errors.applicantEmail.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Confirm Email Address"
                            variant="standard"
                            {...register("applicantConfirmEmail")}
                            error={!!errors.applicantConfirmEmail}
                            helperText={
                              errors?.applicantConfirmEmail ? errors.applicantConfirmEmail.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Relation With Organization"
                            variant="standard"
                            {...register("relationWithOrganization")}
                            error={!!errors.relationWithOrganization}
                            helperText={
                              errors?.relationWithOrganization
                                ? errors.relationWithOrganization.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label="Flat/Building No."
                            sx={{
                              width: "90%",
                            }}
                            variant="standard"
                            {...register("applicantFlatHouseNo")}
                            error={!!errors.applicantFlatHouseNo}
                            helperText={
                              errors?.applicantFlatHouseNo ? errors.applicantFlatHouseNo.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Building Name"
                            variant="standard"
                            {...register("applicantFlatBuildingName")}
                            error={!!errors.applicantFlatBuildingName}
                            helperText={
                              errors?.applicantFlatBuildingName
                                ? errors.applicantFlatBuildingName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Landmark"
                            variant="standard"
                            {...register("applicantLandmark")}
                            error={!!errors.applicantLandmark}
                            helperText={errors?.applicantLandmark ? errors.applicantLandmark.message : null}
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Area"
                            variant="standard"
                            {...register("applicantArea")}
                            error={!!errors.applicantArea}
                            helperText={errors?.applicantArea ? errors.applicantArea.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl
                            error={errors.applicantCountry}
                            variant="standard"
                            sx={{ width: "90%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">Country</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  // value={field.value}
                                  value="India"
                                  disabled
                                  onChange={(value) => field.onChange(value)}
                                  label="Select Country"
                                >
                                  {[
                                    { id: 1, name: "India" },
                                    { id: 2, name: "Other" },
                                  ].map((country, index) => {
                                    return (
                                      <MenuItem key={index} value={country.name}>
                                        {country.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="applicantCountry"
                              control={control}
                              defaultValue="India"
                            />
                            <FormHelperText>
                              {errors?.applicantCountry ? errors.applicantCountry.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl error={errors.applicantState} variant="standard" sx={{ width: "90%" }}>
                            <InputLabel id="demo-simple-select-standard-label">Select State</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  // value={field.value}
                                  disabled
                                  value="Maharashtra"
                                  onChange={(value) => field.onChange(value)}
                                  label="Select State"
                                >
                                  {["Maharashtra", "Other"].map((state, index) => {
                                    return (
                                      <MenuItem key={index} value={state}>
                                        {state}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="applicantState"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.applicantState ? errors.applicantState.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl error={errors.applicantCity} variant="standard" sx={{ width: "90%" }}>
                            <InputLabel id="demo-simple-select-standard-label">City</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="City"
                                >
                                  {["Pimpri Chinchwad", "Pune", "Other"].map((city, index) => {
                                    return (
                                      <MenuItem key={index} value={city}>
                                        {city}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="applicantCity"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.applicantCity ? errors.applicantCity.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label="Pin Code"
                            variant="standard"
                            {...register("applicantPinCode")}
                            error={!!errors.applicantPinCode}
                            helperText={errors?.applicantPinCode ? errors.applicantPinCode.message : null}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion sx={{ padding: "10px" }}>
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>
                        {" "}
                        <FormattedLabel id="ecsFormDetails" />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="bankAccountHolderName" />}
                            variant="standard"
                            {...register("bankAccountHolderName")}
                            error={!!errors.bankAccountHolderName}
                            helperText={
                              errors?.bankAccountHolderName ? errors.bankAccountHolderName.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="bankAccountNumber" />}
                            variant="standard"
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            {...register("bankaAccountNo")}
                            error={!!errors.bankaAccountNo}
                            helperText={errors?.bankaAccountNo ? errors.bankaAccountNo.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl error={errors.checkAuditoriumKey} variant="standard">
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="typeOfBankAccount" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="typeOfBankAccount" />}
                                >
                                  {[
                                    { id: 1, type: "Current" },
                                    { id: 2, type: "Saving" },
                                    { id: 3, type: "Other" },
                                  ].map((auditorium, index) => {
                                    return (
                                      <MenuItem key={index} value={auditorium.id}>
                                        {auditorium.type}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="typeOfBankAccount"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.typeOfBankAccount ? errors.typeOfBankAccount.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl variant="standard" error={!!errors.bankNameId} sx={{ width: "90%" }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="bankName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="bankName" />}
                                >
                                  {bank.map((bank, index) => (
                                    <MenuItem
                                      key={index}
                                      value={bank.id}
                                      sx={{
                                        display: bank.bankName ? "flex" : "none",
                                      }}
                                    >
                                      {bank.bankName}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                              name="bankNameId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.bankNameId ? errors.bankNameId.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="bankAddress" />}
                            variant="standard"
                            {...register("bankAddress")}
                            error={!!errors.bankAddress}
                            helperText={errors?.bankAddress ? errors.bankAddress.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="ifscCode" />}
                            variant="standard"
                            {...register("ifscCode")}
                            error={!!errors.ifscCode}
                            helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="micrCode" />}
                            variant="standard"
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                  "-webkit-appearance": "none",
                                },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                            }}
                            {...register("micrCode")}
                            error={!!errors.micrCode}
                            helperText={errors?.micrCode ? errors.micrCode.message : null}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="remark" />}
                            {...register("remarks")}
                            variant="standard"
                            error={!!errors.remark}
                            helperText={errors?.remark ? errors.remark.message : null}
                          />
                        </Grid>
                      </Grid>

                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
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
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </>
              </form>
            </Slide>
          )}
        </Paper>
      )}
    </div>
  );
};

export default AuditoriumBooking;
