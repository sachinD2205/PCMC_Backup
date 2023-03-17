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
import React, { useRef, useState } from "react";
import axios from 'axios'
import urls from '../../../../URLS/urls'
import { useReactToPrint } from 'react-to-print'

import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import TextField from "@mui/material/TextField";
import KeyPressEvents from "../../../../util/KeyPressEvents";
// import styles from "./report.module.css";

import styles from "../../../../styles/LegalCase_Styles/courtWiseReport.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useRouter } from "next/router";


const Index = () => {
  const [dataSource, setDataSource] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [value, setValue] = React.useState(null);
  const [btnSaveText, setBtnSaveText] = useState("Search");
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const router = useRouter();

  const [age, setAge] = React.useState("");
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    //  setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    //resolver: yupResolver(schema),
    // mode: "onChange",
  });

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    // history.push({ pathname: '/homepage' })
  }

  // const searchButton = (fromDate, toDate) => {
  const searchButton = () => {
    let fromDate = moment(watch('fromDate')).format('YYYY-MM-DD');
    let toDate = moment(watch('toDate')).format('YYYY-MM-DD');
    console.log("vv", fromDate, toDate);
    if (fromDate && toDate) {
      axios
        .get(
          `${urls.LCMSURL}/report/getMultipleAdvBillTrackingReport?fromDate=${fromDate}&toDate=${toDate}`,
          // `${urls.LCMSURL}/report/getMultipleAdvBillTrackingReport?fromDate=2023-01-27&toDate=2023-12-27`

        )
        .then((r) => {
          setDataSource(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              caseNumbers: j.caseNumbers,
              courtName: j.courtName,
              deptName1: j.deptName1,
              AdvName1: j.AdvName1,
              paidAmountDate: j.paidAmountDate,
              paidamount: j.paidamount,
              // fromDate: j.fromDate,
              // toDate: j.toDate,
            })),
          )
        })
    }
  }


  return (
    <>
      <BasicLayout titleProp={"none"}>

        <Card>
          {/* <Grid container style={{ marginLeft:"340px"}}>
          <Typography style={{ fontSize:"30px"}}>
Multiple Advocates and Bill Tracking</Typography>
              
          </Grid> */}

          {/* For Header */}

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              // marginLeft:'50px',
              paddingTop: "10px",
              marginTop: "10px",

              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
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
                Multiple Advocates and Bill Tracking
              </h2>
            </Typography>
          </Box>

          <Grid
            container
            style={{ height: "90px", justifyContent: "center", marginTop: 10 }}
          >
            <Grid item xl={4}></Grid>
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

              >Search</Button>
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

                onClick={handlePrint}
              >
                print</Button>
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
                        <b>Multiple Advocates and Bill Tracking</b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>Sr.No.</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Case No</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Court Name</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Department Name</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Advocate Name</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Payment Date</b>
                    </th>
                    <th rowSpan={4} colSpan={1}>
                      <b>Paid Amount</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                  </tr>
                  {this?.props?.dataToMap &&
                    this.props.dataToMap.map((r, i) => (
                      <tr key={i}>
                        <td>{r.srNo}</td>
                        <td>{r.caseNumbers}</td>
                        <td>{r.courtName}</td>
                        <td>{r.deptName1}</td>
                        <td>{r.AdvName1}</td>
                        <td>{r.paidAmountDate}</td>
                        <td>{r.paidamount}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>

      </>
    );
  };
}
export default Index;
