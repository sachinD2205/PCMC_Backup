import { Button } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../acknowledgement/loiGeneratedReceipt.module.css"
const LoiGenerationRecipt = () => {
  const {
    reset,
    formState: { errors },
  } = useForm();

  const logedInUser = localStorage.getItem("loggedInUser");
  const [applications, setApplicationDetails] = useState([])
  const [data, setdata] = useState();
  const [deptnm, setDeptNm] = useState(null)
  const [departments, setDepartments] = useState([]);
  const language = useSelector((state) => state.labels.language);
  let user = useSelector((state) => state.user.user)
  const componentRef = useRef(null);
  const router = useRouter();

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    getDepartments()

  }, []);
  useEffect(() => {
    getApplicationDetails()
  }, [departments])

  useEffect(() => {
    getLoiGenerationData();
  }, [applications])

  useEffect(() => {
    console.log("router?.query", router?.query);
    reset(router?.query);
  }, []);

  // load department
  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
        }))
      );
    });
  };

  // get loi record by application no
  const getLoiGenerationData = (data) => {
    if (logedInUser === "citizenUser") {
      axios.get(`${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${applications.id}`, {
        headers: {
          UserId: user.id
        }
      }).then((res) => {
        if (res.data.trnAppealLoiList.length != 0) {
          setdata(res.data.trnAppealLoiList[0]);
        }
      });
    } else {
      axios.get(`${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${applications.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }).then((res) => {
        setdata(res.data.trnAppealLoiList[0]);
      })
    }
  };

  // get RTI Application by application no
  const getApplicationDetails = () => {
    if (logedInUser === "citizenUser") {
      axios.get(`${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${router.query.id}`, {
        headers: {
          UserId: user.id
        }
      },).then((res) => {
        setApplicationDetails(res.data)
        setDeptNm(departments?.find((obj) => { return obj.id == res.data?.departmentKey }) ? departments.find((obj) => { return obj.id == res.data.departmentKey }).department : "-")

      })
    } else {
      axios.get(`${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      },).then((res) => {
        setApplicationDetails(res.data)
        setDeptNm(departments?.find((obj) => { return obj.id == res.data?.departmentKey }) ? departments.find((obj) => { return obj.id == res.data.departmentKey }).department : "-")

      })
    }
  }

  // LOI Payment api
  const loiPayment = () => {
    const body = {
      activeFlag: "Y",
      isComplete: false,
      isApproved: false,
      ...data,
    }
    if (logedInUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.RTI}/trnAppealLoi/save`, body, {
          headers: {
            UserId: user.id
          }
        },) 
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            sweetAlert(language=="en"?"Saved!":"जतन केले!", language=="en"?"LOI Payment Done Successful!":"LOI पेमेंट यशस्वी झाले!", "success");
            router.push({
              pathname: "/RTIOnlineSystem/transactions/rtiApplication/ViewRTIApplication",
              query: { id: applications.id },
            })
          }
          else {
            sweetAlert(language=="en"?"Error!":"त्रुटी",  language=="en"?"Something went wrong!":"काहीतरी चूक झाली!", "error");
          }
        });
    } else {
      const tempData = axios
        .post(`${urls.RTI}/trnAppealLoi/save`, body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        },)
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            sweetAlert(language=="en"?"Saved!":"जतन केले!", language=="en"?"LOI Payment Done Successful!":"LOI पेमेंट यशस्वी झाले!", "success");
            router.push({
              pathname: "/RTIOnlineSystem/transactions/rtiApplication/ViewRTIApplication",
              query: { id: router.query.id },
            })
          }
          else {
            sweetAlert(language=="en"?"Error!":"त्रुटी",  language=="en"?"Something went wrong!":"काहीतरी चूक झाली!", "error");
          }
        }); 
    }
  }

  // View
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={data} application={applications} deptNm={deptnm} />
      </div><br />
      <div className={styles.btn}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => loiPayment()}
        >
          <FormattedLabel id="payment" />
        </Button>
        <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={handlePrint}>
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            swal({
              title: language=="en"?"Exit?":"बाहेर पडायचे?",
              text: language=="en"?"Are you sure you want to exit this Record ? ":"तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal(language=="en"?"Record is Successfully Exit!":"रेकॉर्ड यशस्वीरित्या बाहेर पडते आहे!", {
                  icon: "success",
                });
                router.push("/RTIOnlineSystem/transactions/rtiApplication/rtiApplicationList");
              } else {
                swal(language=="en"?"Record is Safe":"रेकॉर्ड सुरक्षित आहे");
              }
            });
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
      </div>
    </>
  );
};
// class component To Print
class ComponentToPrint extends React.Component {
  render() {
    console.log(this.props.data, "props");
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>
                <h1>
                  <b><FormattedLabel id="pimpariChinchwadMaha" /></b>
                </h1>
              </div>
              <div className={styles.logo1}>
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                <b><FormattedLabel id="serviceAcceptance" /></b>
              </h2>
            </div>

            <div className={styles.two}>
              <p>
                <b>
                  <h3><FormattedLabel id="ackDear" />, {this?.props?.application?.applicantFirstName + " " + this?.props?.application?.applicantMiddleName + " " + this?.props?.application?.applicantLastName}</h3>
                  <br></br> &ensp; <FormattedLabel id="rtiApplicationAmt" />: {this?.props?.data?.amount} <br />
                  <FormattedLabel id="determineandPayAmt" />
                  <br /> <FormattedLabel id="contactNearestpcmcDivisionalOffice" /><br></br>
                </b>
              </p>

              <div className={styles.date2}>
                <h4><FormattedLabel id="departmentKey" /> : </h4> <div style={{ marginLeft: "10px" }}>{this.props.deptNm}</div>
                <h4 style={{ marginLeft: "10px" }}>
                  <b><FormattedLabel id="RTI" /></b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4><FormattedLabel id="loiNo" /> : </h4> <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.loiNo}</h4>
              </div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}><FormattedLabel id="srNo" /></th>
                    <th colSpan={8}><FormattedLabel id="chargeNm" /></th>
                    <th colSpan={2}><FormattedLabel id="amount" /></th>
                  </tr>
                  <tr>
                    <td colSpan={4}><FormattedLabel id="no1" /></td>
                    <td colSpan={4}><FormattedLabel id="rti" /></td>
                    <td colSpan={4}>{this?.props?.data?.totalAmount}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}> <FormattedLabel id="other" /></td>
                    <td colSpan={4}>{this?.props?.data?.penaltyCharge}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b><FormattedLabel id="totalAmount" /> : {this?.props?.data?.totalAmount}</b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4><FormattedLabel id="applicationNo" /> : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.application?.applicationNo}</h4>
              </div>

              <div className={styles.date2}>
                <h4><FormattedLabel id="applicantName" /> : </h4>
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.application?.applicantFirstName + " " + this?.props?.application?.applicantMiddleName + " " + this?.props?.application?.applicantLastName}</h4>
              </div>

              <div className={styles.date2}>
                <h4><FormattedLabel id="dateofApplication" /> :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " + moment(this?.props?.application?.applicationDate).format("DD-MM-YYYY")}
                  </b>{" "}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4><FormattedLabel id="applicantAddress" /> : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>

                  {this?.props?.application?.address}

                </h4>
              </div>

              <hr />

              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5><FormattedLabel id="pimpariChinchwadMaha" /></h5>
                  <h5><FormattedLabel id="ackpcmcAddress" /></h5>
                  <h5> <FormattedLabel id="ackstateCountry" /></h5>
                </div>
                <div className={styles.add1}>
                  <h5><FormattedLabel id="ackPcmcphNo" /></h5>
                  <h5><FormattedLabel id="emailId" />: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
                </div>
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
                </div>
                <div className={styles.logo1}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
