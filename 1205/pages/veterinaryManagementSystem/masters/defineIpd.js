import React, { useEffect, useState } from "react";
import router from "next/router";
import Head from "next/head";
import styles from "./vetMasters.module.css";

import URLs from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import sweetAlert from "sweetalert";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useSelector } from "react-redux";
import moment from "moment";
import { TimePicker } from "@mui/x-date-pickers";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const [table, setTable] = useState([]);
  const [runAgain, setRunAgain] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [zoneDropDown, setZoneDropDown] = useState([
    {
      id: 1,
      zoneEn: "",
      zoneMr: "",
    },
  ]);
  const [wardDropDown, setWardDropDown] = useState([
    {
      id: 1,
      wardEn: "",
      wardMr: "",
    },
  ]);

  let petSchema = yup.object().shape({
    // petAnimalKey: yup.number().required("Please select a pet animal"),
    // breedNameEn: yup.string().required("Please enter breed name in english"),
    // breedNameMr: yup.string().required("Please enter breed name in marathi"),
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    //Get Zone
    axios.get(`${URLs.CFCURL}/master/zone/getAll`).then((res) => {
      setZoneDropDown(
        res.data.zone.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        })),
      );
    });

    //Get Ward
    axios.get(`${URLs.CFCURL}/master/ward/getAll`).then((res) => {
      // axios.get(`${URLs.VMS}/master/ward/getAll`).then((res) => {
      setWardDropDown(
        res.data.ward.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          wardEn: j.wardName,
          wardMr: j.wardNameMr,
        })),
      );
    });
  }, []);

  useEffect(() => {
    setRunAgain(false);
    //Get OPD
    axios.get(`${URLs.VMS}/mstIpd/getAll`).then((res) => {
      setTable(
        res.data.mstIpdList.map((obj, i) => ({
          srNo: i + 1,
          ...obj,
          ipdOpeningTimeShow: moment(obj.ipdOpeningTime).format("hh:mm a"),
          ipdClosingTimeShow: moment(obj.ipdClosingTime).format("hh:mm a"),
        })),
      );
    });
  }, [runAgain]);

  const deleteIPD = (deleteID) => {
    console.log("Delete ID: ", deleteID);

    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${URLs.VMS}/mstIpd/delete/${deleteID}`).then((res) => {
          if (res.status == 226) {
            sweetAlert("Deleted!", "Record Deleted successfully !", "success");
            setRunAgain(true);
          }
        });
      }
    });
  };

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",

      field: "ipdName",
      headerAlign: "center",
      headerName: <FormattedLabel id="ipdName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "officeType",
      headerAlign: "center",
      headerName: <FormattedLabel id="officeType" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "ipdOpeningTimeShow",
      headerAlign: "center",
      headerName: <FormattedLabel id="ipdOpeningTime" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "ipdClosingTimeShow",
      headerAlign: "center",
      headerName: <FormattedLabel id="ipdClosingTime" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: "#1976d2" }}
              onClick={() => {
                reset({
                  ...params.row,
                });
                setCollapse(true);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              style={{ color: "red" }}
              onClick={() => {
                deleteIPD(params.row.id);
              }}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  const clearFields = () => {
    reset({
      fromDate: null,
      toDate: null,
      ipdPrefix: "",
      ipdNo: "",
      ipdName: "",
      ipdWorkingDays: "",
      flatOrBuildingNo: "",
      buildingName: "",
      ipdDetailAddress: "",
      roadName: "",
      landmark: "",
      pincode: "",
      remark: "",
      zoneKey: "",
      wardKey: "",
      officeType: "",
      ipdOpeningTime: null,
      ipdClosingTime: null,
      labFacility: false,
      xRayFacility: false,
    });
  };

  const finalSubmit = (data) => {
    console.table({
      ...data,
    });

    axios.post(`${URLs.VMS}/mstIpd/save`, { ...data, activeFlag: "Y" }).then((res) => {
      if (data.id) {
        sweetAlert("Updated!", "IPD data updated successfully!", "success");
      } else {
        sweetAlert("Success!", "IPD data saved successfully!", "success");
      }
      setRunAgain(true);
      clearFields();
      setCollapse(false);
    });
  };

  return (
    <>
      <Head>
        <title>Define IPD</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}> Define IPD</div>
        <div className={styles.row} style={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => {
              setCollapse(!collapse);
            }}
            endIcon={<Add />}
          >
            <FormattedLabel id="add" />
          </Button>
        </div>
        <Slide in={collapse} mountOnEnter unmountOnExit>
          <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
            <div className={styles.row}>
              <FormControl sx={{ width: 250 }} error={!!error.fromDate}>
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disableFuture
                        disabled={router.query.pageMode == "view" ? true : false}
                        inputFormat="dd/MM/yyyy"
                        label={<FormattedLabel id="fromDate" />}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        renderInput={(params) => (
                          <TextField {...params} size="small" fullWidth variant="standard" />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{error?.fromDate ? error.fromDate.message : null}</FormHelperText>
              </FormControl>
              <FormControl sx={{ width: 250 }} error={!!error.toDate}>
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disableFuture
                        disabled={router.query.pageMode == "view" ? true : false}
                        inputFormat="dd/MM/yyyy"
                        label={<FormattedLabel id="toDate" />}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        renderInput={(params) => (
                          <TextField {...params} size="small" fullWidth variant="standard" />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{error?.toDate ? error.toDate.message : null}</FormHelperText>
              </FormControl>
              <FormControl
                disabled={router.query.pageMode == "view" ? true : false}
                variant="standard"
                error={!!error.zoneKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zone" />
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
            </div>
            <div className={styles.row}>
              <FormControl
                disabled={router.query.pageMode == "view" ? true : false}
                variant="standard"
                error={!!error.wardKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="ward" />
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
                      label="wardKey"
                    >
                      {wardDropDown &&
                        wardDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.wardEn
                              : // @ts-ignore
                                value?.wardMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="wardKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{error?.wardKey ? error.wardKey.message : null}</FormHelperText>
              </FormControl>
              <FormControl
                disabled={router.query.pageMode == "view" ? true : false}
                variant="standard"
                error={!!error.officeType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="officeType" />
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
                      label="officeType"
                    >
                      <MenuItem key={1} value={"Head Office"}>
                        {language == "en" ? "Head Office" : "मुख्य कार्यालय"}
                      </MenuItem>
                      <MenuItem key={2} value={"Section Office"}>
                        {language == "en" ? "Section Office" : "विभाग कार्यालय"}
                      </MenuItem>
                    </Select>
                  )}
                  name="officeType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{error?.officeType ? error.officeType.message : null}</FormHelperText>
              </FormControl>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="ipdPrefix" />}
                // @ts-ignore
                variant="standard"
                {...register("ipdPrefix")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ipdPrefix") ? true : false,
                }}
                error={!!error.ipdPrefix}
                helperText={error?.ipdPrefix ? error.ipdPrefix.message : null}
              />
            </div>
            <div className={styles.row}>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="ipdNo" />}
                // @ts-ignore
                variant="standard"
                {...register("ipdNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ipdNo") ? true : false,
                }}
                error={!!error.ipdNo}
                helperText={error?.ipdNo ? error.ipdNo.message : null}
              />
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="ipdName" />}
                // @ts-ignore
                variant="standard"
                {...register("ipdName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ipdName") ? true : false,
                }}
                error={!!error.ipdName}
                helperText={error?.ipdName ? error.ipdName.message : null}
              />
              <FormControl style={{ marginTop: 10 }} error={!!error.ipdOpeningTime}>
                <Controller
                  control={control}
                  name="ipdOpeningTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label={<FormattedLabel id="ipdOpeningTime" />}
                        value={field.value}
                        onChange={(time) => {
                          field.onChange(moment(time).format("YYYY-MM-DDTHH:mm"));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            sx={{ width: 250 }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{error?.ipdOpeningTime ? error.ipdOpeningTime.message : null}</FormHelperText>
              </FormControl>
            </div>
            <div className={styles.row}>
              <FormControl style={{ marginTop: 10 }} error={!!error.ipdClosingTime}>
                <Controller
                  //   format="HH:mm"
                  control={control}
                  name="ipdClosingTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label={<FormattedLabel id="ipdClosingTime" />}
                        value={field.value}
                        onChange={(time) => field.onChange(moment(time).format("YYYY-MM-DDTHH:mm"))}
                        // selected={field.value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            sx={{ width: 250 }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{error?.ipdClosingTime ? error.ipdClosingTime.message : null}</FormHelperText>
              </FormControl>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="ipdWorkingDays" />}
                // @ts-ignore
                variant="standard"
                {...register("ipdWorkingDays")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ipdWorkingDays") ? true : false,
                }}
                error={!!error.ipdWorkingDays}
                helperText={error?.ipdWorkingDays ? error.ipdWorkingDays.message : null}
              />
              <div style={{ width: 250, display: "flex", flexDirection: "column" }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="labFacility"
                      control={control}
                      defaultValue={false}
                      render={({ field: props }) => (
                        <Checkbox
                          {...props}
                          checked={props.value}
                          onChange={(e) => props.onChange(e.target.checked)}
                        />
                      )}
                    />
                  }
                  label={<FormattedLabel id="labFacility" />}
                />
                <FormControlLabel
                  control={
                    <Controller
                      name="xRayFacility"
                      control={control}
                      defaultValue={false}
                      render={({ field: props }) => (
                        <Checkbox
                          {...props}
                          checked={props.value}
                          onChange={(e) => props.onChange(e.target.checked)}
                        />
                      )}
                    />
                  }
                  label={<FormattedLabel id="xRayFacility" />}
                />
              </div>
            </div>
            <div className={styles.row}>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="ipdAddress" />}
                // @ts-ignore
                variant="standard"
                {...register("ipdDetailAddress")}
                InputLabelProps={{
                  shrink: router.query.id || watch("ipdDetailAddress") ? true : false,
                }}
                error={!!error.ipdDetailAddress}
                helperText={error?.ipdDetailAddress ? error.ipdDetailAddress.message : null}
              />
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="flatOrBuildingNo" />}
                // @ts-ignore
                variant="standard"
                {...register("flatOrBuildingNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("flatOrBuildingNo") ? true : false,
                }}
                error={!!error.flatOrBuildingNo}
                helperText={error?.flatOrBuildingNo ? error.flatOrBuildingNo.message : null}
              />
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="buildingName" />}
                // @ts-ignore
                variant="standard"
                {...register("buildingName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("buildingName") ? true : false,
                }}
                error={!!error.buildingName}
                helperText={error?.buildingName ? error.buildingName.message : null}
              />
            </div>
            <div className={styles.row}>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="roadName" />}
                // @ts-ignore
                variant="standard"
                {...register("roadName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("roadName") ? true : false,
                }}
                error={!!error.roadName}
                helperText={error?.roadName ? error.roadName.message : null}
              />
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="landmark" />}
                // @ts-ignore
                variant="standard"
                {...register("landmark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("landmark") ? true : false,
                }}
                error={!!error.landmark}
                helperText={error?.landmark ? error.landmark.message : null}
              />
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="pincode" />}
                // @ts-ignore
                variant="standard"
                {...register("pincode")}
                InputLabelProps={{
                  shrink: router.query.id || watch("pincode") ? true : false,
                }}
                error={!!error.pincode}
                helperText={error?.pincode ? error.pincode.message : null}
              />
            </div>
            <div className={styles.row}>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="remark" />}
                // @ts-ignore
                variant="standard"
                {...register("remark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("remark") ? true : false,
                }}
                error={!!error.remark}
                helperText={error?.remark ? error.remark.message : null}
              />
            </div>
            <div className={styles.buttons}>
              <Button color="success" variant="contained" type="submit" endIcon={<Save />}>
                <FormattedLabel id="save" />
              </Button>
              <Button variant="outlined" color="error" onClick={clearFields} endIcon={<Clear />}>
                <FormattedLabel id="clear" />
              </Button>
              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToApp />}
                onClick={() => {
                  //   isDeptUser
                  //     ? router.push(`/veterinaryManagementSystem/transactions/petLicense/application`)
                  //     : router.push(`/dashboard`);
                  router.push(`/veterinaryManagementSystem/dashboard`);
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </div>
          </form>
        </Slide>
        <DataGrid
          autoHeight
          sx={{
            marginTop: "2vh",
            width: "100%",

            "& .cellColor": {
              backgroundColor: "#1976d2",
              color: "white",
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Paper>
    </>
  );
};

export default Index;
