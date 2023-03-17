import React from "react";
import { Row, Col, Form } from "antd";
import Stack from "@mui/material/Stack";
import { Collapse } from "@mui/material";
import { useRouter } from "next/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../../../styles/LegalCase_Styles/view.module.css";
import {
  Card,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Paper,
} from "@mui/material";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";

const NoticeDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });
  const router = useRouter();
  const [noticeDate, setNoticeDate] = React.useState(null);
  const [requisitionDate, setRequisitionDate] = React.useState(null);

  const onSubmitForm = (fromData) => {};
  return (
    <>
      <Box
        style={{
          display: "flex",
          // justifyContent: "center",
          // marginLeft:'50px',
          paddingTop: "10px",
          marginTop: "20px",

          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Typography
          style={{
            display: "flex",
            marginLeft: "100px",
            color: "white",
            // justifyContent: "center",
          }}
        >
          <h2>
            <FormattedLabel id="advocateDetails" />
          </h2>
        </Typography>
      </Box>
      <Divider />

      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className={styles.small}>
              {/* First Row */}
              <div className={styles.row}>
                <div>
                  <FormControl style={{ marginTop: 10 }} error={!!errors.fromDate}>
                    <Controller
                      control={control}
                      name="noticeDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Notice Date</span>}
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                // fullWidth
                                sx={{ width: 230 }}
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
                    <FormHelperText>{errors?.noticeDate ? errors.noticeDate.message : null}</FormHelperText>
                  </FormControl>
                </div>

                <div>
                  <FormControl style={{ marginTop: 10 }} error={!!errors.fromDate}>
                    <Controller
                      control={control}
                      name="noticeDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Notice Received date</span>}
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                // fullWidth
                                sx={{ width: 230 }}
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
                      {errors?.noticeReceivedDate ? errors.noticeReceivedDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>

                <div>
                  <TextField
                    autoFocus
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label="Notice received from Advocate/Person"
                    variant="standard"
                    // {...register("businessSubTypePrefix")}
                    // error={!!errors.businessSubTypePrefix}
                    // helperText={
                    //   errors?.businessSubTypePrefix
                    //     ? errors.businessSubTypePrefix.message
                    //     : null
                    // }
                  />
                </div>
              </div>
              {/* 2nd Row */}
              <div className={styles.row}>
                <div>
                  <TextField
                    //// required
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label="Area"
                    variant="standard"
                  />
                  {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                </div>

                <div>
                  <TextField
                    //// required
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label="Road Name"
                    variant="standard"
                  />
                  {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                </div>

                <div>
                  <TextField
                    //// required
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label="Landmark"
                    variant="standard"
                  />
                  {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                </div>
              </div>

              {/* 3rd Row */}
              <div className={styles.row}>
                <div>
                  <TextField
                    //// required
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label="City/Village"
                    variant="standard"
                  />
                  {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                </div>

                <div>
                  <TextField
                    //// required
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label="Pin Code"
                    variant="standard"
                  />
                  {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                </div>

                <div>
                  <FormControl variant="standard" sx={{ minWidth: 250 }}>
                    <InputLabel id="demo-simple-select-standard-label">Department Name</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // value={age}
                      // onChange={handleChange}
                      label="Department Name"
                    >
                      {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                      <MenuItem>
                        <FormControlLabel control={<Checkbox />} label="property Tax" />
                      </MenuItem>
                      <MenuItem>
                        {" "}
                        <FormControlLabel control={<Checkbox />} label="Town Planning" />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* 4th Row */}
              <div className={styles.row1}>
                <div>
                  <FormControl style={{ marginTop: 10 }} error={!!errors.fromDate}>
                    <Controller
                      control={control}
                      name="requisitionDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Requisition Date</span>}
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                // fullWidth
                                sx={{ width: 230 }}
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
                      {errors?.fromDate ? errors.requisitionDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>
                {/* <div>
                    <label>Attached file</label>
                    <TextField
                      //// required
                      id="standard-basic"
                      //                     label="Upload
                      // Documents/Order "
                      variant="standard"
                      type="file"
                      InputLabelProps={{ style: { fontSize: 10 } }}
                      InputProps={{ style: { fontSize: 12 } }}
                    />
                  </div> */}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      {/* </Paper> */}
    </>
  );
};

export default NoticeDetails;
