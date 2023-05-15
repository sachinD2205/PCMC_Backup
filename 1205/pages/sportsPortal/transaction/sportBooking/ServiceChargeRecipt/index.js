import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import router, { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "./goshwara.module.css";
import { Controller, useFormContext } from "react-hook-form";

const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const router = useRouter();
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [facilityNames, setFacilityNames] = useState([]);
  const getFacilityName = () => {
    axios.get(`${urls.SPURL}/facilityName/getAll`).then((r) => {
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        })),
      );
    });
  };

  useEffect(() => {
    console.log("applicableCharages", applicableCharages);
  }, [applicableCharages]);
  const [booking, setBooking] = useState([]);

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
  // const [slots, setSlots] = useState([]);

  // const getSlots = (value) => {
  //   let body = {
  //     facilityType: getValues("facilityType"),
  //     facilityName: getValues("facilityName"),
  //     venue: getValues("venue"),
  //     toDate: getValues("toDate"),
  //     fromDate: getValues("fromDate"),
  //     // zone: getValues("zone"),
  //     // month: getValues("month"),
  //   };
  //   console.log("DATA77", body);

  //   axios.post(`${urls.SPURL}/sportsBooking/getSlotsByMonth`, body, {}).then((res) => {
  //     let temp = res.data.map((row) => ({
  //       id: row.id,
  //       slot: row.fromBookingTime + "-" + row.toBookingTime,
  //     }));
  //     setSlots(temp);
  //     console.log("res.message", temp);
  //   });

  //   // setBookingType(value);
  //   // console.log("props.bookingType", value);
  //   // props.bookingType(value);
  // };

  useEffect(() => {
    // getFacilityTypes();
    getFacilityName();
    getVenueNames();
    // getSlots();
  }, []);
  const [dataa, setDataa] = useState(null);
  const [applicableCharages, setApplicableCharages] = useState([]);

  useEffect(() => {
    axios.get(`${urls.SPURL}/sportsBooking/getById?id=${router?.query?.applicationId}`).then((res) => {
      console.log("564", res);
      setApplicableCharages(res?.data?.applicableCharages);
      const tempData = res?.data;

      const _res = {
        ...tempData,
        facilityName: facilityNames?.find((obj) => obj?.id == tempData?.facilityName)?.facilityName,
        venue: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
        // bookingId: bookingId?.find((obj) => obj?.id == tempData?.bookingId)?.bookingId,
        // facilityName: facilityNames?.find((obj) => obj?.id == tempData?.facilityName)?.facilityName,
        // venue: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
        // bookingId: venueNames?.find((obj) => obj?.id == tempData?.venue)?.venue,
      };
      setDataa(_res);

      console.log("board data", _res);
    });
  }, [venueNames]);

  // view
  return (
    <>
      <div>
        <ComponentToPrint dataa={dataa} ref={componentRef} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={() => {
            router.push({
              pathname: "/sportsPortal/transaction/sportBooking/SanctionLetter",
              query: {
                ...router?.query,
              },
            });
          }}
        >
          View Sanction Letter
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
                router.push({
                  pathname: "/sportsPortal/transaction/sportBooking/SanctionLetter",
                  query: {
                    ...router?.query,
                  },
                });
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
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>Applicant Name : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" " + this?.props?.dataa?.firstName}
                    {" " + this?.props?.dataa?.middleName}
                    {" " + this?.props?.dataa?.lastName}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>Venue Name : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.venue}</h4>
                  {/* <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b> निवडलेला स्लॉट: </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.bookingId}</h4> */}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>Selected Month: </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.fromDate}</h4> -
                  <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.toDate}</h4>
                  <h4 style={{ marginLeft: "40px" }}> </h4>{" "}
                </div>
              </div>
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>Selected Slot: </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{" " + this?.props?.dataa?.bookingId}</h4>
                </div>
              </div>

              <p>
                <h5 style={{ marginLeft: "40px", marginRight: "40px" }}>
                  <b>
                    पुढील प्रमाणे फी मिळाली :-
                    <br />
                    {/* <table id="table-to-xls" className={styles.report_table}>
                      <thead>
                        <tr>
                          <th colSpan={2}>अ.क्र</th>
                          <th colSpan={8}>शुल्काचे नाव</th>
                          <th colSpan={2}>रक्कम (रु)</th>
                        </tr>
                        <tr>
                          <td colSpan={4}>1)</td>
                          <td colSpan={4}>{this?.props?.dataa?.facilityName}</td>
                          <td colSpan={4}>{this?.props?.dataa?.totalAmount}</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={4}>
                            <b></b>
                          </td>
                          <td colSpan={4}>
                            <b></b>
                          </td>
                          <td colSpan={4}>
                            <b>एकूण रक्कम : {this?.props?.dataa?.amount} रु .</b>
                          </td>
                        </tr>
                      </tbody>
                    </table> */}
                    {this?.props?.dataa?.bookingType === "Individual" && (
                      <table id="table-to-xls" className={styles.report_table}>
                        <thead>
                          <tr>
                            <th colSpan={2}>अ.क्र</th>
                            <th colSpan={8}>शुल्काचे नाव</th>
                            <th colSpan={2}>रक्कम (रु)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={4}>1)</td>
                            <td colSpan={4}>
                              {this?.props?.dataa?.applicableCharages.map((charge, index) => {
                                return (
                                  <td colSpan={4}>
                                    <b>{charge.chargeTypeName}</b>
                                  </td>
                                );
                              })}
                            </td>

                            <>
                              {this?.props?.dataa?.applicableCharages.map((charge, index) => {
                                console.log("serviceChargeId1212", charge);
                                return <td colSpan={4}>{charge.amountPerHead}</td>;
                              })}
                            </>
                          </tr>

                          <tr>
                            <td colSpan={4}>
                              <b></b>
                            </td>
                            <td colSpan={4}>
                              <b>एकूण रक्कम : </b>
                            </td>
                            <td colSpan={4}>
                              <b>
                                {this?.props?.dataa?.applicableCharages.map((charge, index) => {
                                  console.log("serviceChargeId1212", charge);
                                  return <td colSpan={4}>{charge.totalAmount}</td>;
                                })}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {this?.props?.dataa?.bookingType === "Group" && (
                      <table id="table-to-xls" className={styles.report_table}>
                        <thead>
                          <tr>
                            <th colSpan={5}>अ.क्र</th>
                            <th colSpan={10}>शुल्काचे नाव</th>
                            <th colSpan={10}>एकूण संख्या</th>
                            <th colSpan={10}>प्रत्येकी रक्कम (रु)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={5}>1)</td>
                            <td colSpan={10}>
                              {this?.props?.dataa?.applicableCharages.map((charge, index) => {
                                return (
                                  <>
                                    <b>{charge.chargeTypeName}</b>
                                  </>
                                );
                              })}
                            </td>
                            <td colSpan={10}>{dataa?.totalGroupMember}</td>
                            {/* <td colSpan={4}></td> */}
                            <td colSpan={10}>
                              {this?.props?.dataa?.applicableCharages.map((charge, index) => {
                                return <>{charge.amountPerHead}</>;
                              })}
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={25}>
                              <b>एकूण रक्कम : </b>
                            </td>
                            <td colSpan={10}>
                              <b>
                                {this?.props?.dataa?.applicableCharages.map((charge, index) => {
                                  console.log("serviceChargeId1212", charge);
                                  return <>{charge.totalAmount}</>;
                                })}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    <br />
                    खेळ आरक्षित झालेल्याचा दिनांक:{" "}
                    <b>
                      {" "}
                      {" " + moment(this?.props?.dataa?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </b>{" "}
                    {/* {this?.props?.dataa?.marriageDate} */}व खेळ आरक्षित आकारण्यात येणारे शुल्क
                  </b>
                  <b> एकूण फी</b> &nbsp;
                  {/* <b>{this?.props?.dataa?.loi?.amount}</b> */}
                  <b>
                    {this?.props?.dataa?.applicableCharages.map((charge, index) => {
                      console.log("serviceChargeId1212", charge);
                      return <>{charge.totalAmount}</>;
                    })}{" "}
                    रु .
                  </b>
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
