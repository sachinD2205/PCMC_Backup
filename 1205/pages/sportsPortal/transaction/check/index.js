import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  // Table,
  TextField,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Col, Row, Table } from "antd";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import URLS from "../../../../URLS/urls";

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
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [tempVal, setTempVal] = useState(0);

  // const [searchBtn, setSearchBtn] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [facilityNameField, setFacilityNameField] = useState(true);
  useEffect(() => {
    getAllTypes();
    getWardNames();
    getDepartments();
    getSubDepartments();
    getFacilityTypes();
    getFacilityName();
    getVenue();
  }, []);

  const getVenue = () => {
    axios.get(`${URLS.SPURL}/venueMaster/getAll`).then((r) => {
      setVenues(
        r.data.venue.map((row) => ({
          id: row.id,
          venue: row.venue,
        })),
      );
    });
  };

  const getFacilityName = () => {
    axios.get(`${URLS.SPURL}/facilityName/getAll`).then((r) => {
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityType: row.facilityType,
        })),
      );
    });
  };

  // ${URLS.SPURL}
  const getFacilityTypes = () => {
    axios.get(`${URLS.SPURL}/facilityType/getAll`).then((r) => {
      setFacilityTypess(
        r.data.facilityType.map((row) => ({
          id: row.id,
          facilityType: row.facilityType,
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
        })),
      );
    });
  };
  const getDepartments = () => {
    axios.get(`${URLS.CFCURL}/master/department/getAll`).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
        })),
      );
    });
  };

  const getSubDepartments = () => {
    axios.get(`${URLS.CFCURL}/master/subDepartment/getAll`).then((r) => {
      console.log("SD: ", r.data);
      setSubDepartments(
        r.data.subDepartment.map((row) => ({
          id: row.id,
          subDepartmentName: row.subDepartment,
        })),
      );
    });
  };
  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    Ward: "",
    zone: "",
    subDepartment: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    formDateTime: "",
    toDateTime: "",
    formDateTime: null,
    toDateTime: null,
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    Ward: "",
    zone: "",
    subDepartment: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    formDateTime: "",
    toDateTime: "",
    formDateTime: null,
    toDateTime: null,
    id: "",
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    router.push("/transaction");
  };

  const searchButton = (data) => {
    // alert("Clicked");
    console.log("Check data: ", data);
    const tempData = axios.post(`${URLS.SPURL}/facilityAvailabilityStatus/checkStatus`, data).then((res) => {
      console.log("data", res.data);
      if (res?.data?.length != 0) {
        console.log("Temp Data", res.data);
        setDataSource(
          res.data.map((row) => ({
            id: row.id,
            capacity: row.capacity,

            // zoneName: row.zoneName,
            zoneName: zoneNames?.find((obj) => obj?.id === row.zoneName)?.zoneName,
            wardName: wardNames?.find((obj) => obj?.id === row.wardName)?.wardName,
            facilityType: facilityTypess?.find((obj) => obj?.id === row.facilityType)?.facilityType,
            facilityName: facilityNames?.find((obj) => obj?.id === row.facilityName)?.facilityName,
            venue: venues?.find((obj) => obj?.id === row.venue)?.venue,

            fromBookingTime: moment(row.fromBookingTime, "hh:mm A").format("hh:mm A"),
            toBookingTime: moment(row.toBookingTime, "hh:mm A").format("hh:mm A"),
            date: row.date,
          })),
        );
      } else {
        alert("Not Available");
      }
    });
  };

  useEffect(() => {
    if (watch("facilityType")) {
      console.log("abc123", watch("facilityType"));
      if (watch("facilityType") == 12) {
        setTempVal(1);
      } else if (watch("facilityType") == 13) {
        setTempVal(2);
      } else if (watch("facilityType") == 14) {
        setTempVal(3);
      } else if (watch("facilityType") == 15) {
        setTempVal(4);
      }
    }
  }, [watch("facilityType")]);

  const cols = [
    {
      title: "Date",
      dataIndex: "date",
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      title: "From Time",
      dataIndex: "fromBookingTime",
      flex: 1,
    },
    {
      title: "Zone",
      dataIndex: "zoneName",
      flex: 1,
    },
    {
      title: "WardName",
      dataIndex: "wardName",
      flex: 1,
    },
    {
      title: "Facility Type",
      dataIndex: "facilityType",
      flex: 1,
    },
    {
      title: "Facility Name",
      dataIndex: "facilityName",
      flex: 1,
    },

    {
      title: "Venue",
      dataIndex: "venue",
      flex: 1,
    },
    {
      title: "To Time",
      dataIndex: "toBookingTime",
      // dataIndex: moment("toBookingTime").format("LT"),
      flex: 1,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      flex: 1,
    },

    {
      title: "Actions",
      width: "56px",
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                {tempVal == 2 ? (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => {
                      router.push({
                        pathname: `/sportsPortal/transaction/groundBookingNew/citizen/citizenForm`,
                      });
                    }}
                  >
                    Book Now /groundBookingNew
                  </Button>
                ) : (
                  ""
                )}
                {tempVal == 1 ? (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => {
                      console.log("Booking Data for Sports ", record);
                      router.push({
                        pathname: `/sportsPortal/transaction/sportBooking`,
                        query: {
                          fromBookingTime: record.fromBookingTime,
                        },
                      });
                    }}
                  >
                    Book Now / sportBooking
                  </Button>
                ) : (
                  ""
                )}
                {tempVal == 3 ? (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => {
                      router.push({
                        pathname: `/sportsPortal/transaction/swimmingPoolM/citizen/citizenForm`,
                      });
                    }}
                  >
                    Book Now / swimmingPoolM
                  </Button>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Paper
        sx={{
          marginLeft: 2,
          marginRight: 2,
          marginTop: 2,
          marginBottom: 2,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <div>
          <FormProvider {...methods}>
            {/* <form onSubmit={handleSubmit(onSubmitForm)}> */}
            <form onSubmit={handleSubmit(searchButton)}>
              <div className={styles.small}>
                <div className={styles.details} style={{ marginBottom: "2vh" }}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "2vh",
                      }}
                    >
                      Facility Availability
                    </h3>
                  </div>
                </div>

                <div className={styles.searchtable}>
                  <div className={styles.row}>
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.zone}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="zone" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 195 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="zone"
                            >
                              {zoneNames &&
                                zoneNames.map((zoneName, index) => (
                                  <MenuItem key={index} value={zoneName.id}>
                                    {zoneName.zoneName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zone"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zone ? errors.zone.message : null}</FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.ward}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="ward" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 195 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="ward"
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
                        <FormHelperText>{errors?.ward ? errors.ward.message : null}</FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.facilityType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="facilityType" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 195 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                console.log("value: ", value.target.value);
                                setSelectedFacilityType(value.target.value);
                                setFacilityNameField(false);
                              }}
                              label="facilityType"
                            >
                              {facilityTypess &&
                                facilityTypess.map((facilityType, index) => (
                                  <MenuItem key={index} value={facilityType.id}>
                                    {facilityType.facilityType}
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
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.facilityName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="facilityName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 195 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="department"
                              disabled={facilityNameField}
                            >
                              {facilityNames &&
                                facilityNames
                                  .filter((facility) => {
                                    return facility.facilityType === selectedFacilityType;
                                  })
                                  .map((facilityName, index) => (
                                    <MenuItem key={index} value={facilityName.id}>
                                      {facilityName.facilityName}
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

                    {/* <div style={{ marginTop: "2vh" }}>
                      <FormControl style={{ marginTop: 0 }} error={!!errors.formDateTime}>
                        <Controller
                          control={control}
                          name="formDateTime"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>{<FormattedLabel id="formDateTime" />}</span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD"),
                                    // moment(date).format("DD-MM-YYYY")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    // variant="standard"
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        // marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.formDateTime ? errors.formDateTime.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div> */}

                    {/* <div style={{ marginTop: "2vh" }}>
                      <FormControl style={{ marginTop: 0 }} error={!!errors.toDateTime}>
                        <Controller
                          control={control}
                          name="toDateTime"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>{<FormattedLabel id="toDateTime" />}</span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD"),
                                    // moment(date).format("DD-MM-YYYY")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    // variant="standard"
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        // marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDateTime ? errors.toDateTime.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div> */}

                    {/* <div>
                    <FormControl
                      variant="standard"
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.department}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="department" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 195 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="department"
                          >
                            {departments &&
                              departments.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {department.department}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="department"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.department ? errors.department.message : null}</FormHelperText>
                    </FormControl>
                  </div> */}
                  </div>
                  <div className={styles.row}>
                    {/* <div>
                    <FormControl
                      variant="standard"
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.subDepartment}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="subDepartment" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 195 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="subDepartment"
                          >
                            {subDepartments &&
                              subDepartments.map((subDepartmentName, index) => (
                                <MenuItem key={index} value={subDepartmentName.id}>
                                  {subDepartmentName.subDepartmentName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="subDepartment"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.subDepartment ? errors.subDepartment.message : null}
                      </FormHelperText>
                    </FormControl>
                  </div> */}

                    <div>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.venue}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="venue" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 170 }}
                                labelId="demo-simple-select-standard-label"
                                Fdate
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="venue"
                              >
                                {venues &&
                                  venues.map((venue, index) => (
                                    <MenuItem key={index} value={venue.id}>
                                      {venue.venue}
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
                      </Grid>
                    </div>
                    <div>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormControl variant="standard" error={!!errors.bookingType}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="bookingType" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 195 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setType(value.target.value);
                                }}
                                label="bookingType"
                              >
                                <MenuItem value="Daily">Daily</MenuItem>
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="threeM">3 Month</MenuItem>
                                <MenuItem value="sixM">6 Month</MenuItem>
                                <MenuItem value="oneY">1 Year</MenuItem>
                              </Select>
                            )}
                            name="bookingType"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                      </Grid>
                    </div>
                  </div>

                  {/* <Divider /> */}
                  <div className={styles.btn}>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      //   type="Button"
                      variant="contained"
                      color="success"
                      // onClick={() => searchButton()}
                      //   endIcon={<SaveIcon />}
                    >
                      Search
                    </Button>

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
                <div className={styles.bookingTable}>
                  {console.log("dataS", dataSource)}
                  <Table bordered columns={cols} scroll={{ x: 400 }} dataSource={dataSource} />
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </Paper>
    </>
  );
};

export default Index;
