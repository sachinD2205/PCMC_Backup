import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ApproveNotice = () => {
  const {
    register,
    control,
    handleSubmit,
    // @ts-ignore
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(noticeSchema),
  });

  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [departmentList, setDepartmentList] = useState([]);

  const token = useSelector((state) => state.user.user.token);

  const selectedNoticeAttachmentToSend = useSelector((state) => {
    return state.user.selectedNoticeAttachmentToSend;
  });

  const getNotice = (noticeId) => {
    axios
      .get(`${urls.LCMSURL}/notice/getNoticeById`, {
        params: {
          noticeId: noticeId,
        },
      })
      .then((res) => {
        console.log("res notice history", res);
        let _res = res.data;

        setValue("noticeRecivedDate", _res.noticeRecivedDate);
        setValue("noticeDate", _res.noticeDate);
        setValue(
          "noticeRecivedFromAdvocatePerson",
          _res.noticeRecivedFromAdvocatePerson
        );
        setValue("department", _res.department);
        setValue("requisitionDate", _res.requisitionDate);

        // setDataSource(
        //   res?.data?.map((r, i) => ({
        //     srNo: i + 1,
        //     id: r.id,
        //     noticeDate: moment(r.noticeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
        //     noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
        //       "YYYY-MM-DD"
        //     ),
        //     requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
        //       "YYYY-MM-DD"
        //     ),
        //     department: r.department,
        //     noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson,
        //     requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
        //   }))
        // );
      });
  };

  const _columns = [
    {
      field: "srNo",
      headerName: "srNo",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Remark",
      headerName: "Remark",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Creater/Approver",
      headerName: "User",
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Designation",
      headerName: "Designation",
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Department",
      headerName: "Department",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Remark Date",
      headerName: "Remark Date",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Remark Time",
      headerName: "Remark Time",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
  ];

  const router = useRouter();

  const onFinish = (data) => {
    const _data = {
      ...data,
      pageMode: "APPROVE",
      noticeAttachment: selectedNoticeAttachmentToSend,
      id: router.query.id,
    };

    console.log("data", data, _data);

    axios
      .post(`${urls.LCMSURL}/notice/saveTrnNotice`, _data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 201) {
          console.log("res save notice", r);
          swal("Record is Successfully Saved!", {
            icon: "success",
          });
          router.push({
            pathname: "/LegalCase/transaction/newNotice",
            query: { mode: "Create" },
          });
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  useEffect(() => {
    getDepartmentName();
  }, []);

  useEffect(() => {
    console.log("router.query", router.query);
    // reset(router?.query);
    getNotice(Number(router.query.id));
  }, [router?.query?.pageMode]);

  const getDepartmentName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <Box style={{ padding: "70px" }}>
      <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
        <Grid xs={4} item style={{ display: "flex", justifyContent: "center" }}>
          <FormControl style={{ marginTop: 10 }} error={!!errors.noticeDate}>
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
                    disabled
                    onChange={(date) => {
                      // field.onChange(date)
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                    }}
                    // selected={field.value}
                    // center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        error={!!errors.noticeDate}
                        helperText={
                          errors?.noticeDate ? errors?.noticeDate.message : null
                        }
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
          </FormControl>
        </Grid>

        <Grid xs={4} item style={{ display: "flex", justifyContent: "center" }}>
          <FormControl
            style={{ marginTop: 10 }}
            error={!!errors.noticeRecivedDate}
          >
            <Controller
              control={control}
              name="noticeRecivedDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    disabled
                    label={
                      <span style={{ fontSize: 16 }}>Notice Received date</span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    // selected={field.value}
                    // center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        // fullWidth
                        error={!!errors.noticeRecivedDate}
                        helperText={
                          errors?.noticeRecivedDate
                            ? errors?.noticeRecivedDate.message
                            : null
                        }
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
            {/* <FormHelperText>
                                  {errors?.noticeRecivedDate
                                    ? errors.noticeRecivedDate.message
                                    : null}
                                </FormHelperText> */}
          </FormControl>
        </Grid>

        <Grid xs={4} item style={{ display: "flex", justifyContent: "center" }}>
          <TextField
            autoFocus
            sx={{ width: 250 }}
            disabled
            id="standard-basic"
            label="Notice received from Advocate/Person"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            {...register("noticeRecivedFromAdvocatePerson")}
            error={!!errors.noticeRecivedFromAdvocatePerson}
            helperText={
              errors?.noticeRecivedFromAdvocatePerson
                ? errors.noticeRecivedFromAdvocatePerson.message
                : null
            }
          />
        </Grid>
      </Grid>
      <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
        <Grid xs={6} item style={{ display: "flex", justifyContent: "center" }}>
          <FormControl
            error={!!errors.department}
            variant="standard"
            sx={{
              minWidth: 230,
            }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Department Name
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Department Name"
                  disabled
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                >
                  {departmentList &&
                    departmentList.map((department, index) => (
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
            <FormHelperText>
              {errors?.department ? errors?.department.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid xs={6} item style={{ display: "flex", justifyContent: "center" }}>
          <FormControl
            style={{ marginTop: 10 }}
            error={!!errors.requisitionDate}
          >
            <Controller
              control={control}
              name="requisitionDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>Requisition Date</span>
                    }
                    disabled
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    // selected={field.value}
                    // center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        error={!!errors.requisitionDate}
                        helperText={
                          errors?.requisitionDate
                            ? errors?.requisitionDate.message
                            : null
                        }
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
            {/* <FormHelperText>
                                  {errors?.requisitionDate
                                    ? errors?.requisitionDate.message
                                    : null}
                                </FormHelperText> */}
          </FormControl>
        </Grid>
      </Grid>
      <Divider />
      <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography style={{ fontWeight: 900, fontSize: "20px" }}>
            Notice History
          </Typography>
        </Grid>
        <Grid item xs={12}>
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
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
            rows={dataSource}
            columns={_columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            //checkboxSelection
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Button variant="outlined" size="small" onClick={handleOpen}>
            SAVE
          </Button>
          <Button variant="outlined" size="small">
            CANCEL
          </Button>
        </Grid>
      </Grid>
      <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
        <Grid item xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px",
            }}
          >
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <form onSubmit={handleSubmit(onFinish)}>
                <Box sx={style}>
                  <Box sx={{ padding: "10px" }}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Enter Remark
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Please Enter Remark"
                      label="Enter Remark"
                    />
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      padding: "10px",
                    }}
                  >
                    <Button variant="outlined" size="small" type="submit">
                      SAVE
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleClose}
                    >
                      CANCEL
                    </Button>
                  </Box>
                </Box>
              </form>
            </Modal>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApproveNotice;
