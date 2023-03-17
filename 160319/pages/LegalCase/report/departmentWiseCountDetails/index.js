import { EyeTwoTone, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Slide,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import urls from "../../../../URLS/urls";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import TextField from "@mui/material/TextField";
import KeyPressEvents from "../../../../util/KeyPressEvents";
// import styles from "./report.module.css";
import styles from "../../../../styles/LegalCase_Styles/departmentWiseReport.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useRouter } from "next/router";
import DepartmentWiseCountDetailsToPrint from "../../../../components/legalCaseReports/DepartmentWiseCountDetailsToPrint";

const Index = () => {
  const [dataSource, setDataSource] = useState();
  const [value, setValue] = React.useState(null);
  const [inputState, setInputState] = useState(false);
  const router = useRouter();
  const [isReady, setIsReady] = useState("none");

  const [deptID, setdeptID] = useState();
  const [department, setDepartmentName] = useState([]);
  const getdepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
      setDepartmentName(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
        })),
      );
    });
  };

  useEffect(() => {
    getdepartment();
  }, []);
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  const handleChange = (event) => {
    setDepartmentName(event.target.value);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const printComponentRef = useRef();
  const handleComponentPrint = useReactToPrint({
    content: () => printComponentRef.current,
  });

  const backToHomeButton = () => {
    // history.push({ pathname: '/homepage' })
  };

  useEffect(() => {
    console.log(deptID);
  }, [deptID]);

  // const searchButton = (fromDate, toDate) => {
  const searchButton = () => {
    let fromDate = moment(watch("fromDate")).format("YYYY-MM-DD");
    let toDate = moment(watch("toDate")).format("YYYY-MM-DD");

    if ((fromDate && toDate) || deptID) {
      axios
        .get(
          `${urls.LCMSURL}/report/getDepartmentwiseCountReport?fromDate=${fromDate}&toDate=${toDate}&departmentId=${deptID}`,
          // `${urls.LCMSURL}/report/getDepartmentwiseCountReport?fromDate=2023-01-13&toDate=2023-12-13`
        )
        .then((r) => {
          setDataSource(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              deptName: j.deptName,
              deptRunningCount: j.deptRunningCount,
              deptFinalCount: j.deptFinalCount,
              deptOrderJudgementCount: j.deptOrderJudgementCount,

              deptTotalCount: j.deptTotalCount,
            })),
          );
        });
    }
  };

  return (
    <>
      <BasicLayout titleProp={"none"}>
        <Card>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              // marginLeft:'50px',
              paddingTop: "10px",
              marginTop: "10px",

              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <Typography
              style={{
                display: "flex",
                // marginLeft: "100px",
                color: "white",
                // justifyContent: "center",
              }}
            >
              <h2>
                {/* <FormattedLabel id="advocateDetails" /> */}
                Department Wise Count Details
              </h2>
            </Typography>
          </Box>
          <Paper style={{ display: isReady }}>
            {dataSource && <DepartmentWiseCountDetailsToPrint ref={printComponentRef} data={dataSource} />}
          </Paper>
          {/* <Grid container>
            <Grid item xl={9}></Grid>
            <Grid item>
              <h1> Department Wise Count Details</h1>
            </Grid>
          </Grid> */}

          <Grid container style={{ marginTop: 40 }}>
            <Grid item xl={1}></Grid>
            {/* <Form.Item> */}
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <FormControl
                sx={{
                  marginLeft: 5,
                  marginTop: 2,
                  align: "center",
                  minWidth: 150,
                }}
              >
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="YYYY/MM/DD"
                        label={<span style={{ fontSize: 16 }}>From Date</span>}
                        // InputLabelProps={{ style: { fontSize: 16 } }}
                        // InputProps={{ style: { fontSize: 8 } }}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            // size="small"
                            //fullWidth
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
              {/* </Form.Item> */}
            </Grid>

            {/* <Col xl={1}></Col> */}

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              {/* <Form.Item> */}
              <FormControl
                sx={{
                  marginLeft: 5,
                  marginTop: 2,
                  align: "center",
                  minWidth: 150,
                }}
              >
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="YYYY/MM/DD"
                        sx={{ marginLeft: 5, marginTop: 2, align: "center" }}
                        label={<span style={{ fontSize: 16 }}>To Date</span>}
                        // InputLabelProps={{ style: { fontSize: 16 } }}
                        // InputProps={{ style: { fontSize: 16 } }}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            // size="small"
                            //fullWidth
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
              {/* </Form.Item> */}
            </Grid>

            {/* <Col xl={1}></Col> */}

            <Grid item xl={5}>
              {/* <FormControl
                sx={{
                  minWidth: 180,
                  marginTop: 2,
                  marginLeft: 5,
                  align: "center",
                }}
              // size="small"
              >
                <InputLabel id="demo-select-small">Department Name </InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  style={{ height: 50 }}
                  value={department}
                  label="DepartmentName"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Department Name </MenuItem>
                </Select>
              </FormControl> */}
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 100, marginLeft: 2 }}
                error={!!errors.advocate}
              >
                <InputLabel id="demo-simple-select-standard-label">DepartmentName</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ width: 200 }}
                      value={field.value}
                      onChange={(value) => {
                        setdeptID(value.target.value);
                        field.onChange(value);
                      }}
                      label="DepartmentName"
                    >
                      {department &&
                        department.map((department, index) => (
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
            </Grid>

            {/* <Col xl={1}></Col> */}

            <Grid item xl={2}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#008CBA",
                  color: "white",
                  marginTop: "30px",
                  marginLeft: "50px",
                }}
                onClick={searchButton}
              >
                Search
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#008CBA",
                  color: "white",
                  marginTop: "30px",
                  marginLeft: "50px",
                }}
                onClick={handleComponentPrint}
              >
                print
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#008CBA",
                  color: "white",
                  marginTop: "30px",
                  marginLeft: "50px",
                }}
                onClick={() => router.push(`LegalCase/dashboard`)}
              >
                back To home
              </Button>
            </Grid>
          </Grid>
        </Card>

        <ComponentToPrint ref={componentRef} dataToMap={dataSource} />
      </BasicLayout>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Card style={{ width: "100%" }}>
              {/* <Row>
                <Button>Print</Button>
              </Row> */}
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b> Department Wise Count Details</b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>Sr.No.</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Department Name</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Running Cases</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Final Order</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>For Order/Judgement</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Total </b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.dataToMap &&
                    this.props.dataToMap.map((r, i) => (
                      <tr key={i}>
                        <td>{r.srNo}</td>
                        <td>{r.deptName}</td>
                        <td>{r.deptRunningCount}</td>
                        <td>{r.deptFinalCount}</td>
                        <td>{r.deptOrderJudgementCount}</td>
                        <td>{r.deptTotalCount}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </>
    );
  }
}
export default Index;
