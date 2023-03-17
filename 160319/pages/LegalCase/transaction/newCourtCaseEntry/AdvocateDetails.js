import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";

// AdvocateDetails
const AdvocateDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [disabledButtonInputState, setDisabledButtonInputState] =
    useState(false);
  const language = useSelector((state) => state.labels.language);
  const [courtNames, setCourtNames] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);

  // advocateNames
  const getAdvocateName = () => {
    axios.get(`${urls.LCMSURL}/master/advocate/getAll`).then((res) => {
      setAdvocateNames(
        res.data.advocate.map((r, i) => ({
          id: r.id,
          advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
          advocateNameMr:
            r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
        })),
      );
    });
  };

  // departmentNames
  const getDepartmentName = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartmentNames(
        res.data.department.map((r, i) => ({
          id: r.id,
          deptName: r.deptName,
          deptName: r.departmentMr,
        })),
      );
    });
  };

  // courtNames
  const getCourtName = () => {
    axios.get(`${urls.LCMSURL}/master/court/getAll`).then((res) => {
      setCourtNames(
        res.data.court.map((r, i) => ({
          id: r.id,
          courtName: r.courtName,
          courtMr: r.courtMr,
        })),
      );
    });
  };

  // ------------------ useEffect -----------

  useEffect(() => {
    if (localStorage.getItem("disabledButtonInputState") == "true") {
      setDisabledButtonInputState(true);
    } else if (localStorage.getItem("disabledButtonInputState") == "false") {
      setDisabledButtonInputState(false);
    }
    getDepartmentName();
  }, []);

  useEffect(() => {
    console.log("disabledButtonInputState", disabledButtonInputState);
  }, [disabledButtonInputState]);

  useEffect(() => {
    getCourtName();
  }, [departmentNames]);

  useEffect(() => {
    getAdvocateName();
  }, [courtNames]);

  // View
  return (
    <>
      {/** Title */}
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 20,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "50px",
          marginRight: "75px",
          borderRadius: 100,
        }}
      >
        <strong style={{ display: "flex", justifyContent: "center" }}>
          <FormattedLabel id='advocateDetails' />
        </strong>
      </div>
      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          {/** AdvocateName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              variant='standard'
              sx={{ minWidth: 190 }}
              error={!!errors?.advocateName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='advocateName' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    disabled={disabledButtonInputState}
                    onChange={(value) => field.onChange(value)}
                    label='Advocate Name'
                  >
                    {advocateNames &&
                      advocateNames.map((advocateName, index) => (
                        <MenuItem key={index} value={advocateName?.id}>
                          {language == "en"
                            ? advocateName?.advocateName
                            : advocateName?.advocateNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='advocateName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.advocateName ? errors?.advocateName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/** OppenentAdvocateName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              id='standard-basic'
              label={<FormattedLabel id='opponentAdvocateEn' />}
              variant='standard'
              {...register("opponentAdvocate")}
              error={!!errors?.opponentAdvocate}
              helperText={
                errors?.opponentAdvocate
                  ? errors?.opponentAdvocate?.message
                  : null
              }
            />
          </Grid>
          {/** OppenentAdovovateMr */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              id='standard-basic'
              label={<FormattedLabel id='opponentAdvocateMr' />}
              variant='standard'
              {...register("opponentAdvocateMr")}
              error={!!errors?.opponentAdvocateMr}
              helperText={
                errors?.opponentAdvocateMr
                  ? errors?.opponentAdvocateMr?.message
                  : null
              }
            />
          </Grid>
          {/**concerPersonEn */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              id='standard-basic'
              label={<FormattedLabel id='concernPersonEn' />}
              variant='standard'
              {...register("concernPerson")}
              error={!!errors?.concernPerson}
              helperText={
                errors?.concernPerson ? errors?.concernPerson?.message : null
              }
            />
          </Grid>
          {/**concernPersonMr */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              id='standard-basic'
              label={<FormattedLabel id='concernPersonMr' />}
              variant='standard'
              {...register("concernPersonMr")}
              error={!!errors?.concernPersonMr}
              helperText={
                errors?.concernPersonMr
                  ? errors?.concernPersonMr?.message
                  : null
              }
            />
          </Grid>
          {/**applicationDate */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              style={{ marginTop: 10 }}
              error={!!errors?.appearanceDate}
            >
              <Controller
                control={control}
                name='appearanceDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabledButtonInputState}
                      inputFormat='DD/MM/YYYY'
                      label={
                        <span style={{ fontSize: 16 }}>
                          <FormattedLabel id='appearanceDate' />
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField {...params} size='small' />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.appearanceDate
                  ? errors?.appearanceDate?.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/** depet name */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              variant='standard'
              sx={{ minWidth: 190 }}
              error={!!errors?.department}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='deptName' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id='deptName' />}
                  >
                    {departmentNames &&
                      departmentNames.map((deptName, index) => (
                        <MenuItem key={index} value={deptName?.id}>
                          {language == "en"
                            ? deptName?.deptName
                            : deptName?.departmentMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='department'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.department ? errors?.department?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default AdvocateDetails;
