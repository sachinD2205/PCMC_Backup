import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import axios from "axios";
import router from "next/router";
import styles from "./goshwara.module.css";
// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
import moment from "moment";
import urls from "../../../../../../URLS/urls";
import { useForm } from "react-hook-form";
import swal from "sweetalert";

const Index = (props) => {
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
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
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

  const [sum, setSum] = useState(0);
  const [applicableCharages, setApplicableCharages] = useState([]);

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
  useEffect(() => {
    getVenueNames();
    console.log("router?.query?.role", router?.query?.role);
    reset(props?.data);
    console.log("propsyetoy", venueNames);
  }, []);
  useEffect(() => {
    axios.get(`${urls.SPURL}/groundBooking/getById?id=${router.query?.applicationId}`).then((res) => {
      const tempData = res?.data;

      setApplicableCharages(res?.data?.applicableCharages);

      const _res = {
        ...tempData,
        venueNames: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
        fromBookingTime: moment(tempData.fromBookingTime).format("hh:mm A"),
        toBookingTime: moment(tempData.toBookingTime).format("hh:mm A"),
      };

      console.log("getbyId", _res);

      setDataa(_res);
      console.log("loi recept data", res.data);
      // setDataa(res.data);
      console.log("serviceCharge", res.data);
    });
  }, [venueNames]);
  // view
  return (
    <>
      <div>
        <ComponentToPrint dataa={dataa} ref={componentRef} sum={sum} />
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
                router.push("/dashboard");
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

class ComponentToPrint extends React.Component {
  render() {
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
                <b>पावती</b>
                {/* <h5>(महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८)</h5> */}
              </h2>
            </div>

            <div className={styles.two}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>अर्जाचा क्रमांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{this?.props?.dataa?.applicationNumber}</h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>अर्ज दिनांक : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " + moment(this?.props?.dataa?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>अर्जदाराचे नाव : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.applicantName}</h4>
                </div>
                <br></br>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: "40px" }}>
                  {" "}
                  <b>Venue Name : </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.venueNames}</h4>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: "40px" }}>
                  {" "}
                  <b>Date : </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {" " + this?.props?.dataa?.fromDate} To
                  {" " + this?.props?.dataa?.toDate}
                </h4>
              </div>
              <div className={styles.date2}>
                <h4 style={{ marginLeft: "40px" }}>
                  {" "}
                  <b>Time : </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {" " + this?.props?.dataa?.fromBookingTime} To
                  {" " + this?.props?.dataa?.toBookingTime}
                </h4>
              </div>

              <p>
                <h5 style={{ marginLeft: "40px", marginRight: "40px" }}>
                  <b>
                    पुढील प्रमाणे फी मिळाली :-
                    <br />
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
                        {this?.props?.dataa?.applicableCharages?.map((r, i) => (
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
                          </td>
                          <td colSpan={2}>
                            <b></b>
                          </td>
                          <td colSpan={2}>
                            <b></b>
                          </td>
                          <td colSpan={4}>
                            <b>{this?.props?.sum}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    मैदान आरक्षित झालेल्याचा दिनांक:{" "}
                    <b>
                      {" "}
                      {" " + moment(this?.props?.dataa?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.marriageDate} */}व मैदान आरक्षित आकारण्यात येणारे शुल्क
                  </b>
                  <b> एकूण फी</b> &nbsp;
                  {/* <b>{this?.props?.dataa?.loi?.amount}</b> */}
                  <b>{this?.props?.sum} /- (रु) .</b>
                  <br />
                  <br />
                  <b>
                    {this?.props?.dataa?.serviceNameMr} या सेवेसाठी नागरिक सेवा पोर्टलवर तुमची रक्कम प्राप्त
                    झाली आहे. <br />
                    <br />
                    पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालय आपल्यासेवेस तत्पर आहे ,धन्यवाद.!!
                  </b>
                </h5>
              </p>

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

export default Index;
