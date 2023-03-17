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

import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import TextField from "@mui/material/TextField";
import KeyPressEvents from "../../../../util/KeyPressEvents";
// import styles from "./report.module.css";
import { useReactToPrint } from "react-to-print";
import styles from "../../../../styles/LegalCase_Styles/courtWiseReport.module.css";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import urls from "../../../../URLS/urls";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";

const Index = () => {
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
  const [dataSource, setDataSource] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [inputState, setInputState] = useState(false);
  const [value, setValue] = React.useState(null);
  const [btnSaveText, setBtnSaveText] = useState("Search");
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [advName, setadvName] = useState();
  const router = useRouter();

  const [departmentName, setDepartmentName] = React.useState("");

  const handleChange = (event) => {
    setDepartmentName(event.target.value);
  };
  let fromDate = moment(watch("fromDate")).format("YYYY-MM-DD");
  let toDate = moment(watch("toDate")).format("YYYY-MM-DD");
  const getdailyDetail = () => {
    if (fromDate && toDate) {
      axios

        .get(
          `${urls.LCMSURL}/report/getNextDailyCauseListReport?fromDate=${fromDate}&toDate=${toDate}`
        )
        .then((r) => {
          console.log(r);
          setDataSource(
            r.data.map((j, i) => ({
              id: r.id,
              srNo: i + 1,
              caseNumber: j.caseNumber,
              nexHearingDate: j.nexHearingDate,
              nextFiledBy1: j.nextFiledBy1,
              filedAgainst: j.filedAgainst,
              nextAdvocateName1: j.nextAdvocateName1,
              caseStage: j.caseStage,
              caseStatus: j.caseStatus,
            }))
          );
        });
    }
  };

  useEffect(() => {
    //  getdailyDetail();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    // history.push({ pathname: '/homepage' })
  };

  return (
    <>
      <BasicLayout titleProp={"none"}>
        <Card>
          {/* <Grid container style={{ marginLeft:"340px"}}>
          <Typography style={{ fontSize:"30px"}}>Advocate Wise Count Details</Typography>
              
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
                Next day cause List Details
              </h2>
            </Typography>
          </Box>
          {/* <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSearchForm)}> */}
          <Grid
            container
            style={{
              height: "90px",
              justifyContent: "center",
              marginTop: 10,
            }}
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

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Button
                variant="contained"
                type="submit"
                style={{
                  backgroundColor: "#008CBA",
                  color: "white",
                  marginTop: "30px",
                  marginLeft: "50px",
                }}
                onClick={getdailyDetail}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Button
                variant="contained"
                type="primary"
                style={{
                  backgroundColor: "#008CBA",
                  color: "white",
                  marginTop: "30px",
                  marginLeft: "20px",
                }}
                onClick={handlePrint}
              >
                Print
              </Button>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Button
                variant="contained"
                type="primary"
                style={{
                  backgroundColor: "#008CBA",
                  color: "white",
                  marginTop: "30px",
                  // marginLeft: "1px",
                }}
                onClick={() => router.push(`LegalCase/dashboard`)}
              >
                Back
              </Button>
            </Grid>
          </Grid>
          {/* </form>
        </FormProvider> */}
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
                        <b>Next Day Cause List Detail</b>
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
                      <b>Previous Hearing Date</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Case No Filed By</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Filed Against</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Advocate</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Stage</b>
                    </th>
                    <th rowSpan={4} colSpan={1}>
                      <b>Status</b>
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
                    <td>8</td>
                  </tr>

                  {this.props.dataToMap &&
                    this.props.dataToMap.map((r, i) => (
                      <tr key={i}>
                        <td>{r.srNo}</td>
                        <td>{r.caseNumber}</td>
                        <td>{r.nexHearingDate}</td>
                        <td>{r.nextFiledBy1}</td>
                        <td>{r.filedAgainst}</td>
                        <td>{r.nextAdvocateName1}</td>
                        <td>{r.caseStage}</td>
                        <td>{r.caseStatus}</td>
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
