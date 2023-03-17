import React from "react";
import { Row, Col, Form } from "antd";
import Stack from "@mui/material/Stack";
import { Collapse } from "@mui/material";
import { useRouter } from "next/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { yupResolver } from "@hookform/resolvers/yup";
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

const View = () => {
  const router = useRouter();
  const [noticeDate, setNoticeDate] = React.useState(null);
  const [requisitionDate, setRequisitionDate] = React.useState(null);

  return (
    <>
      <BasicLayout>
        <Card>
          <Grid container mt={2} ml={5} mb={5} border px={5} height={10}>
            <Grid item xs={5}></Grid>
            <Grid item xs={5.7}>
              <h2>Office Note</h2>
            </Grid>
          </Grid>
        </Card>

        <Card style={{ marginTop: 5, height: 300 }}>
          <form layout="vartical">
            {/* testCode */}
            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={1}></Grid>

              <Grid item xs={2}>
                {/* <TextField
                    id="standard-basic"
                    label="Case Serial No."
                    // variant="filled"
                  /> */}
                <TextField
                  //// required
                  id="standard-basic"
                  label="Notice No."
                  variant="standard"
                />
              </Grid>
              <Grid item xs={1}></Grid>

              <Grid item xs={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Notice Date"
                    // InputProps={{ style: { fontSize: 5 } }}
                    // InputLabelProps={{ style: { fontSize: 50 } }}
                    value={noticeDate}
                    onChange={(newValue) => {
                      setNoticeDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        InputLabelProps={{ style: { fontSize: 13 } }}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={1}></Grid>

              <Grid item xs={2}>
                <TextField
                  //// required
                  id="standard-basic"
                  label="Notice received from Advocate/Person"
                  variant="standard"
                  // style={{ fontSize: 10 }}
                  InputProps={{ style: { fontSize: 15 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={1}></Grid>

              <Grid item xs={2}>
                <FormControl variant="standard" sx={{ minWidth: 190 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Department Name
                  </InputLabel>
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
                    <MenuItem value={"DepartmentName"}>
                      Department Name
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* 2nd Row */}

            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                <TextField
                  //// required
                  id="standard-basic"
                  label="Notice received through"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Requisition Date"
                    // InputProps={{ style: { fontSize: 5 } }}
                    // InputLabelProps={{ style: { fontSize: 50 } }}
                    value={requisitionDate}
                    onChange={(newValue) => {
                      setRequisitionDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        InputLabelProps={{ style: { fontSize: 13 } }}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                {/* <Form.Item label="Attached file"> */}
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
                {/* </Form.Item> */}
              </Grid>

              <Grid item xs={1}></Grid>

              <Grid item xs={2}>
                <TextField
                  //// required
                  id="standard-basic"
                  label="Parawise Information from concern Department"
                  variant="standard"
                />
              </Grid>
            </Grid>

            {/* 3rd Row */}

            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                {/* <Form.Item label="Image"> */}
                <label>Image</label>
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
                {/* </Form.Item> */}
              </Grid>
            </Grid>

            {/* <Col xl={3} lg={1} md={1} sm={1}></Col> */}
            {/* <Col xl={4} lg={6} md={6} sm={8} xs={24}>
              <Form.Item label="Image">
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
              </Form.Item>
            </Col> */}

            {/* new Row */}

            {/* RowButton */}
            {/* <Row style={{ marginTop: 30 }}>
              <Col xl={9} lg={6} md={6}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Button htmlType="submit">Save</Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                // onClick={resetForm}
                >
                  Reset
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  // danger
                  onClick={() => {
                    router.push(
                      `/LegalCase/transaction/notices/NoticeSendToDepartment/`
                    );
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row> */}

            {/* materialUi */}

            <Grid container style={{ marginTop: 20 }}>
              <Grid item xs={4}></Grid>
              <Grid item xs={1}>
                <Button variant="outlined" type="submit">
                  Save
                </Button>
              </Grid>

              <Grid item xs={0.5}></Grid>

              <Grid item xs={1}>
                <Button variant="outlined">Reset</Button>
              </Grid>
              <Grid item xs={0.5}></Grid>

              <Grid item xs={1}>
                <Button
                  variant="outlined"
                  //   onClick={() => {
                  //     router.push(
                  //       `/LegalCase/transaction/notices/NoticeSendToDepartment/`
                  //     );
                  //   }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </BasicLayout>
    </>
  );
};

export default View;
