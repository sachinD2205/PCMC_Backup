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
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "./view.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";

const TransferDetails = () => {
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    getCourtName();
  }, [departmentNames]);

  useEffect(() => {
    getAdvocateName();
  }, [courtNames]);

  useEffect(() => {
    getDepartmentName();
  }, []);

  const [advocateNames, setAdvocateNames] = useState([]);

  // getAdvocateName
  const getAdvocateName = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`)
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            advocateName: r.firstName + " " + r.middleName + " " + r.lastName,

            advocateNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
          }))
        );
      });
  };

  // get Departments Namede
  const [departmentNames, setDepartmentNames] = useState([]);

  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((res) => {
        setDepartmentNames(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            department: r.departmentMr,
          }))
        );
      });
  };

  // get Court Name

  const [courtNames, setCourtNames] = useState([]);
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`)
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              variant="standard"
              sx={{ minWidth: 190 ,marginTop:"20px" }}
              error={!!errors.transferFromAdvocate}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="advocateName" /> */}
                Transfer From Advocate
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    //   sx={{ width: 500 }}
                    value={field.value}
                    disabled={router?.query?.pageMode === "View"}
                    onChange={(value) => field.onChange(value)}
                    label=" Transfer From Advocate"
                  >
                      {advocateNames &&
                      advocateNames.map((advocateName, index) => (
                        <MenuItem
                          key={index}
                          // @ts-ignore
                          value={advocateName.id}
                        >
                          {/* @ts-ignore */}
                          {/* {title.title} */}
                          {language == "en"
                            ? advocateName?.advocateName
                            : advocateName?.advocateNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="transferFromAdvocate"
                //   control={control}
                defaultValue=""
              />
            </FormControl>
            <FormHelperText>
              {errors?.transferFromAdvocate ? errors.transferFromAdvocate.message : null}
            </FormHelperText>
          </Grid>

          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              variant="standard"
              sx={{ minWidth: 190, marginTop:"20px"}}
              error={!!errors.transferToAdvocate}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="advocateName" /> */}
                Transfer To Advocate
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    //   sx={{ width: 500 }}
                    value={field.value}
                    disabled={router?.query?.pageMode === "View"}
                    onChange={(value) => field.onChange(value)}
                    label=" Transfer To Advocate"
                  >
                    {advocateNames &&
                      advocateNames.map((advocateName, index) => (
                        <MenuItem
                          key={index}
                          // @ts-ignore
                          value={advocateName.id}
                        >
                          {/* @ts-ignore */}
                          {/* {title.title} */}
                          {language == "en"
                            ? advocateName?.advocateName
                            : advocateName?.advocateNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="transferToAdvocate"
                //   control={control}
                defaultValue=""
              />
            </FormControl>


            <FormHelperText>
              {errors?.transferToAdvocate ? errors.transferToAdvocate.message : null}
            </FormHelperText>
          </Grid>

          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              style={{ marginTop: 0 }}
              error={!!errors.fromDate}
            >
              <Controller
                //   control={control}
                name="fromDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={router?.query?.pageMode === "View"}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>
                          {/* <FormattedLabel id="appearanceDate" /> */}
                          From Date
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          // fullWidth
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
                  {errors?.fromDate ? errors.fromDate.message : null}
                </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              // style={{ marginTop: 10 }}
              style={{ marginTop: 0 }}

              error={!!errors.toDate}
            >
              <Controller
                //   control={control}
                name="toDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={router?.query?.pageMode === "View"}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>
                          {/* <FormattedLabel id="appearanceDate" /> */}
                          To Date
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          // fullWidth
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
              <FormHelperText>
                  {errors?.toDate ? errors.toDate.message : null}
                </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              style={{ marginTop: 10 }}
              error={!!errors.newAppearnceDate}
            >
              <Controller
                //   control={control}
                name="newAppearnceDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={router?.query?.pageMode === "View"}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>
                          {/* <FormattedLabel id="appearanceDate" /> */}
                          Select New (Appearance)Date
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          // fullWidth
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
              <FormHelperText>
                  {errors?.newAppearnceDate ? errors.newAppearnceDate.message : null}
                </FormHelperText>
            </FormControl>
          </Grid>

        <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              // label="RemarksEn"
              label= {<FormattedLabel id="remarksEn"/>}
              maxRows={4}
              {...register("remark")}


              error={!!errors.remark}
              helperText={errors?.remark ? errors.remark.message : null}
            />
          </Grid>


          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              // label="RemarksMr"
              label= {<FormattedLabel id="remarksMr"/>}
              maxRows={4}
              {...register("remarkMr")}

              error={!!errors.remarkMr}
              helperText={errors?.remarkMr ? errors.remarkMr.message : null}
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default TransferDetails;
