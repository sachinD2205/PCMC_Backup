import { Button, FormControl, Paper, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import styles from "./report.module.css";
const Index = () => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm();

  let router = useRouter();
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) => state?.user?.user?.menus?.find((m) => m?.id == selectedMenu));
  let language = useSelector((state) => state.labels.language);

  const [zones, setZones] = useState([]);
  const [wards, setWards] = useState([]);
  const [maritalStatus, setMaritalStatus] = useState([]);
  const [religion, setReligion] = useState([]);
  const [dataSource, setDataSource] = useState();

  // const getApplicationDetail = () => {
  //   axios
  //     .get(
  //       `${urls.MR}/report`,
  //     )
  //     .then((r) => {
  //       setDataSource(
  //         r.data.map((j, i) => ({
  //           id: j.id,
  //           srNo: i + 1,
  //           zoneName: j.zoneName,
  //           wardName: j.wardName,
  //           registrationNo: j.registrationNo,
  //           marriageDate: j.marriageDate,
  //           marriagePlace: j.marriagePlace,
  //           hFName: j.hFName,
  //           hBuildingName: j.hBuildingName,
  //           hAge: j.hAge,
  //           hReligionByMarriage: j.hReligionByMarriage,
  //           wFName: j.wFName,
  //           wBuildingName: j.wBuildingName,
  //           wAge: j.wAge,
  //           wReligionByMarriage: j.wReligionByMarriage,
  //           registrationDate: j.registrationDate,
  //           registrationNo: j.registrationNo,
  //           applicationAcceptanceCharge: j.applicationAcceptanceCharge,
  //           hStatus: j.hStatus,
  //           wstatus: j.wstatus,
  //           hMobileNo: j.hMobileNo,
  //           wMobileNo: j.wMobileNo,
  //         })),
  //       )
  //     })
  // }

  const getWards = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWards(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };

  const getReligion = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      setReligion(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
          religionMr: row.religionMr,
        })),
      );
    });
  };

  const getMaritalStatus = () => {
    axios.get(`${urls.MR}/master/maritalstatus/getAll`).then((r) => {
      // console.log("r.data.maritalStatus",r.data.maritalStatus);
      setMaritalStatus(
        r.data.maritalStatus.map((row) => ({
          id: row.id,
          statusDetails: row.statusDetails,
          statusDetailsMar: row.statusDetailsMar,
        })),
      );
    });
  };

  const getZones = () => {
    axios.get(`${urls.CFCURL}/zone/getAll`).then((r) => {
      setZones(
        r.data.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };
  useEffect(() => {
    getZones();
    getWards();
    getReligion();
    getMaritalStatus();
  }, []);

  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
    };

    axios
      .get(
        `${urls.NRMS}/reportsController/getAllByFromDateAndToDateRotationRequest?fromDate=${getValues(
          "fromDate",
        )}&toDate=${getValues("toDate")}`,
      )
      .then((r) => {
        setDataSource(
          r?.data?.trnNewsPublishRequestList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          }),
        );
      });
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    router.push("/nrms/dashboard");
  };

  return (
    <>
      <Paper>
        <div style={{ padding: 10 }}>
          <Button variant="contained" color="primary" style={{ float: "right" }} onClick={handlePrint}>
            {language === "en" ? "Print" : "प्रत काढा"}
          </Button>
          <p>
            <center>
              <h1>
                {
                  language === "en"
                    ? menu.menuNameEng /* "Application Details Report" */
                    : menu.menuNameMr /* "अर्ज तपशील अहवाल" */
                }
              </h1>
            </center>
          </p>
          <Button
            onClick={backToHomeButton}
            variant="contained"
            color="primary"
            style={{ marginTop: "-100px" }}
          >
            {language === "en" ? "Back To home" : "मुखपृष्ठ"}
          </Button>
        </div>

        {/* <center>
          <h1>Application Details Report</h1>
        </center> */}
        <div className={styles.searchFilter} styles={{ marginTop: "50px" }}>
          <FormControl sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="fromDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={<span style={{ fontSize: 14 }}>{language === "en" ? "From Date" : "पासून"}</span>}
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("DD/MM/YYYY"))}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
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
          <FormControl sx={{ marginTop: 0, marginLeft: "5vh" }}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={<span style={{ fontSize: 14 }}>{language === "en" ? "To Date" : "पर्यंत"}</span>}
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("DD/MM/YYYY"))}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
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
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "4px" }}
            onClick={getApplicationDetail}
          >
            {language === "en" ? "Search" : "शोधा"}
          </Button>
        </div>
        {/* <Row>
            <Col xl={4} lg={4} md={4} sm={24} xs={24}></Col>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Ward
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  name="online"
                  label="online"
                >
                  <MenuItem value="">
                    <em>Choose a ward</em>
                  </MenuItem>
                  {wards &&
                    wards.map((ward, index) => (
                      <MenuItem key={index} value={ward.wardName}>
                        {ward.wardName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Col>

            <Col xl={3} lg={3} md={3} sm={1}></Col>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Zone
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  //value={online}
                  name="online"
                  //onChange={handleChange}
                  label="online"
                >
                  <MenuItem value="">
                    <em>Choose a zone</em>
                  </MenuItem>
                  {zones &&
                    zones.map((zone, index) => (
                      <MenuItem key={index} value={zone.zoneName}>
                        {zone.zoneName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Col>
            <br />
          </Row>
          <Row>
            <Col xl={4} lg={4} md={4} sm={24} xs={24}></Col>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                name={'fromDate'}
                label="From Date "
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date',
                  },
                ]}
              >
                <DatePicker/>
              </Form.Item>
            </Col>
            <Col xl={3} lg={3} md={3} sm={1}></Col>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                name={'toDate'}
                label="To Date "
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date',
                  },
                ]}
              >
                <DatePicker
                />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1} />
            <Col
              xl={2}
              lg={2}
              md={2}
              sm={2}
              xs={2}
              style={{ marginTop: '30px' }}
            >
              <Button
                onClick={() => {
                  if (wards) {
                    getApplicationDetail()
                  } else if (wards == null) {
                    message.info('Please Select all field')
                  }
                }}
                type="primary"
              >
                Search
              </Button>
            </Col>
          </Row> */}
        {/* <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            color="primary"
            type="primary"
            style={{ float: 'right' }}
            onClick={handlePrint}
          >
            print
          </Button>
          <Button
            onClick={backToHomeButton}
            type="primary"
            variant="contained"
            color="primary"
          >
            back To home
          </Button>
        </div> */}

        <ComponentToPrint ref={componentRef} dataToMap={{ dataSource, language, menu }} />
      </Paper>
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Paper>
              <table className={styles.report_table}>
                <thead>
                  {/* <tr>
                    <th colSpan={30}>
                      <h3>
                        <b>Application Form Report</b>
                      </h3>
                    </th>
                  </tr> */}
                  {/* <tr>
                    <th colSpan={30}>
                      <h3>
                        <b>
                          {this?.props?.dataToMap?.language === "en"
                            ? this?.props?.dataToMap[0]?.zone?.zoneName
                            : this.props.dataToMap[0]?.zone.zoneNameMr}
                        </b>
                      </h3>
                    </th>
                  </tr> */}
                  <tr>
                    <th colSpan={30}>
                      <h3>
                        <b>
                          {this?.props?.dataToMap?.language === "en"
                            ? this?.props?.dataToMap?.menu.menuNameEng
                            : this?.props?.dataToMap?.menu.menuNameMr}
                        </b>
                      </h3>
                    </th>
                  </tr>

                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>{this?.props?.dataToMap?.language === "en" ? "Sr.No." : "अ.क्र."}</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>{this?.props?.dataToMap?.language === "en" ? "Department Name" : "विभागाचे नाव"}</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "News/Advertisement Request Number And Advertisement Subject"
                          : "बातमी/जाहिरात विनंती क्रमांक आणि जाहिरात विषय"}{" "}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en" ? "Published Date" : "प्रकाशित तारीख"}{" "}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>{this?.props?.dataToMap?.language === "en" ? "Rotation Group" : "रोटेशन ग्रुप"} </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "News Paper Names"
                          : "वर्तमानपत्रे/साप्ताहिके यांची नावे"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.dataToMap?.language === "en" ? "Date" : "दिनांक"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.dataToMap?.language === "en" ? "Signature" : "स्वाक्षरी"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.dataToMap?.language === "en" ? "Remark" : "शेरा"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Rotation Received Sign"
                        : "रोटेशन मिळाल्याची सही"}
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
                    <td>9</td>
                    <td>10</td>
                  </tr>

                  {this.props.dataToMap.dataSource &&
                    this.props.dataToMap.dataSource.map((r, i) => (
                      <tr key={i}>
                        <td>{r.srNo}</td>
                        <td>
                          {this.props.dataToMap.language == "en" ? r.departmentName : r.departmentNameMr}
                        </td>
                        <td>
                          {r.newsRotationRequestNo + r.newsAdvertisementSubject != null
                            ? r.newsAdvertisementSubject
                            : r.workName}
                        </td>
                        <td>{r.newsPublishDate}</td>
                        <td>
                          {this.props.dataToMap.language == "en"
                            ? r.rotationGroupName + "-" + r.rotationSubGroupName
                            : r.rotationGroupNameMr + "-" + r.rotationSubGroupNameMr}
                        </td>
                        <td>
                          {this.props.dataToMap.language == "en" ? r.newsPapersNames : r.newsPapersNamesMr}
                        </td>
                        <td>{r.marriageDate}</td>
                        <td>{r.marriageDate}</td>
                        <td>{r.marriageDate}</td>
                        <td>{r.marriageDate}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default Index;
