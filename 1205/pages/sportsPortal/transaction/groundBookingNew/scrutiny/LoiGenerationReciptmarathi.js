import { Button } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "./LoiGenerationRecipt.module.css";
const LoiGenerationRecipt = () => {
  const [venueNames, setVenueNames] = useState([]);

  const getVenueNames = () => {
    axios.get(`${urls.SPURL}/venueMaster/getAll`).then((r) => {
      setVenueNames(
        r.data.venue.map((row) => ({
          id: row.id,
          venue: row.venue,
        })),
      );
    });
  };
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const getLoiGenerationData = (data) => {
    axios.get(`${urls.SPURL}/groundBooking/getById?id=${router?.query?.applicationId}`).then((res) => {
      const tempData = res?.data;

      setApplicableCharages(res?.data?.applicableCharages);

      const _res = {
        ...tempData,
        venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
        fromBookingTime: moment(tempData.fromBookingTime).format("hh:mm A"),
        toBookingTime: moment(tempData.toBookingTime).format("hh:mm A"),

        // venueNames: tempData?.venue,
        // venue: tempData?.venueNames,
      };

      console.log("getbyId", _res);

      setdata(_res);
      console.log("loi recept data", res.data);
      // reset(_res);
    });
  };

  const [data, setdata] = useState();
  useEffect(() => {
    getVenueNames();
    getLoiGenerationData();
    console.log("ghfvgh", venueNames);
  }, [venueNames]);

  const [applicableCharages, setApplicableCharages] = useState([]);
  const [sum, setSum] = useState();
  useEffect(() => {
    if (applicableCharages) {
      let deposite = 0,
        rate = 0;

      applicableCharages.forEach((charge) => {
        deposite += charge.chargeType == 2 ? charge.amountPerHead : 0;
        rate += charge.chargeType == 1 ? charge.totalAmount : 0;
      });
      console.log("Rate: ", rate);
      console.log("deposite: ", deposite);
      setSum(deposite + rate);
    }
  }, [applicableCharages]);

  const user = useSelector((state) => state?.user.user);

  const componentRef = useRef(null);
  const router = useRouter();
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("router?.query", router?.query);
    reset(router?.query);
  }, []);
  // const router = useRouter()
  // View
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={data} sum={sum} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            swal({
              title: "Exit?",
              text: "Are you sure you want to exit this Record ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal("Record is Successfully Exit!", {
                  icon: "success",
                });
                router.push("/sportsPortal/transaction/groundBookingNew/scrutiny");
              } else {
                swal("Record is Safe");
              }
            });
          }}
        >
          Exit
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
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                {/* <h4>
                {' '}
                <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
              </h4> */}

                {/* <h4>
                {' '}
                <b>महाराष्ट्र, भारत</b>
              </h4> */}
              </div>
              <div className={styles.logo1}>
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                <b>सेवा स्वीकृती पत्र</b>
              </h2>
            </div>

            <div className={styles.two}>
              <p>
                <b>
                  <h3>प्रिय, {this?.props?.data?.applicantName}</h3>
                  <br></br> &ensp; तुमच्याकडे {this?.props?.data?.serviceName} या सेवेसाठी नागरिक सेवा
                  पोर्टलवर कृपया तुमची रक्कम रुपये: {this?.props?.data?.loi?.amount} <br />
                  निश्चित करा आणि केलेल्या सेवेची रक्कम/शुल्क भरा.
                  <br /> किंवा जवळील पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालयाला भेट द्या .<br></br>
                </b>
              </p>

              <div className={styles.date2}>
                <h4>विभाग:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.serviceName}</b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>LOI NO : </h4> <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.loi?.loiNo}</h4>
              </div>

              {/* <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम (रु)</th>
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.data?.applicableCharages?.map((r, i) => (
                    <tr>
                      <td colSpan={4}>{}</td>

                      <td colSpan={4}>{r.chargeTypeName}</td>

                      <td colSpan={4}>{r.amountPerHead}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>एकूण रक्कम : </b>
                    </td>
                    <td colSpan={4}>
                      <b>{this?.props?.sum}</b>
                    </td>
                  </tr>
                </tbody>
              </table> */}

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम (रु)</th>
                    <th colSpan={2}>एकूण तास</th>
                    <th colSpan={2}>एकूण दिवस</th>
                    <th colSpan={2}>एकूण (रु)</th>
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.data?.applicableCharages?.map((r, i) => (
                    <>
                      <tr>
                        <td colSpan={4}>{i + 1}</td>
                        <td colSpan={4}>{r.chargeTypeName}</td>
                        <td colSpan={4}>{r.amountPerHead}</td>
                        <td colSpan={2}>{r.chargeType == 2 ? "-" : r.hours}</td>
                        <td colSpan={2}>{r.chargeType == 2 ? "-" : r.chargableDays}</td>
                        <td colSpan={4}>{r.chargeType == 2 ? r.amountPerHead : r.totalAmount}</td>
                      </tr>
                    </>
                  ))}

                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>एकूण रक्कम : </b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                      {/* <b>{applicableCharages?.totalAmount}</b> */}
                    </td>
                    <td colSpan={2}>
                      <b></b>
                      {/* <b>{applicableCharages?.totalAmount}</b> */}
                    </td>
                    <td colSpan={2}>
                      <b></b>
                      {/* <b>{applicableCharages?.totalAmount}</b> */}
                    </td>
                    <td colSpan={4}>
                      <b>{this?.props?.sum}</b>
                      {/* <b>{applicableCharages?.totalAmount}</b> */}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4>
                  <b>Application No. : </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.applicationNumber}</h4>
              </div>

              <div className={styles.date2}>
                <h4>
                  <b>Applicant Name : </b>
                </h4>
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.applicantName}</h4>
              </div>
              <div className={styles.date2}>
                <h3>
                  {" "}
                  <b> Venue Name:</b> {this?.props?.data?.venueNames}
                </h3>
              </div>

              <div className={styles.date2}>
                <br></br>
                <h3>
                  {" "}
                  <b> Date :</b> {this?.props?.data?.fromDate} To {this?.props?.data?.toDate}
                </h3>
                <br></br>
                <br></br>
              </div>

              <h3>
                {" "}
                <b> Time :</b> {this?.props?.data?.fromBookingTime} To {this?.props?.data?.toBookingTime}
              </h3>

              {/* <div className={styles.date2}>
                <h4>अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " + moment(this?.props?.data?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
              {/* </h4>
              </div>  */}

              <div className={styles.date2}>
                <h4>
                  {/* <b>अर्जदाराचा पत्ता :</b>{" "} */}
                  <b>Applicant Address :</b>{" "}
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.cAddress}
                  {" ,"}
                  {/* {this?.props?.data?.abuildingNameMr}
                  {' ,'}
                  <br></br>
                  {this?.props?.data?.aroadNameMr} {','}
                  {this?.props?.data?.alandmarkMr} {','} */}
                  <br></br>
                  {this?.props?.data?.cCityName} {","}
                  {this?.props?.data?.cState}
                  {","}
                  {this?.props?.data?.cPincode}{" "}
                </h4>
              </div>

              <hr />

              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </div>
                <div className={styles.add1}>
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
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
