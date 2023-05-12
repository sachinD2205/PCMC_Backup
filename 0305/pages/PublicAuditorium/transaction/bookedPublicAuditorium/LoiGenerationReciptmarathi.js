import { Button, Grid } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "./LoiGenerationRecipt.module.css";
const LoiGenerationRecipt = () => {
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

  const [data, setdata] = useState();
  const [receiptData, setReceiptData] = useState();
  const [loading, setLoading] = useState(false);

  const [auditoriums, setAuditoriums] = useState([]);

  useEffect(() => {
    console.log("useeffect");
    getLoiGenerationData();
    getAuditoriumBooking();
    getAuditorium();
  }, []);
  const user = useSelector((state) => state?.user.user);

  const componentRef = useRef(null);
  const router = useRouter();
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  let _daata;

  useEffect(() => {
    console.log("router?.query", router.query);
    _daata = router?.query?.receiptData && JSON.parse(router?.query?.receiptData);
    console.log("router?.query", _daata);
    _daata && setReceiptData(_daata);
  }, [auditoriums]);

  const getLoiGenerationData = (data) => {
    console.log("1234", router?.query?.applicationId);

    if (router?.query?.applicationId) {
      axios
        .get(
          `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${Number(
            router?.query?.applicationId,
          )}`,
        )
        .then((res) => {
          setdata(res.data);
          console.log("loi recept data", res.data);
        });
    }
  };

  const getAuditoriumBooking = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: "dsc",
        },
      })
      .then((res) => {
        console.log("res res", res);
        setLoading(false);
        let result = res.data.trnAuditoriumBookingOnlineProcessList;

        result?.map((item) => {
          console.log("556", item.id, _daata);
          if (item?.id == _daata?.id) {
            return item;
          }
        });

        // setReceiptData(
        //   result.map((item) => {
        //     if (item.id == _daata.id) {
        //       return item;
        //     }
        //   }),
        // );

        // let _res = result.map((val, i) => {
        //   return {
        //     ...val,
        //     srNo: _pageSize * _pageNo + i + 1,
        //     id: val.id,
        //     auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
        //     toDate: val.toDate ? val.toDate : "-",
        //     fromDate: val.fromDate ? val.fromDate : "-",
        //     holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
        //     status: val?.applicationStatus?.replace(/[_]/g, " "),
        //     _status: val.status,
        //     activeFlag: val.activeFlag,
        //     auditoriumBookingNo: val.applicationNumber,
        //     // auditoriumId: val.auditoriumId
        //     //   ? auditoriums.find((obj) => obj?.id == val.auditoriumId)?.auditoriumNameEn
        //     //   : "Not Available",
        //     auditoriumId: val.auditoriumId,
        //     _auditoriumId: val.auditoriumId,
        //     eventDate: val.eventDate ? moment(val?.eventDate).format("DD-MM-YYYY") : "-",
        //     mobile: val.mobile ? val.mobile : "-",
        //     organizationName: val.organizationName ? val.organizationName : "-",
        //     organizationOwnerFirstName: val.organizationOwnerFirstName
        //       ? val.organizationOwnerFirstName + " " + val.organizationOwnerLastName
        //       : "-",
        //   };
        // });
      });
  };

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe 4Au", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          ...row,
          id: row.id,
          auditoriumNameEn: row.auditoriumNameEn,
        })),
      );
    });
  };

  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={receiptData} auditoriums={auditoriums} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button variant="contained" size="small" sx={{ size: "23px" }} type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          size="small"
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
                // swal("Record is Successfully Exit!", {
                //   icon: "success",
                // });
                router.push("/PublicAuditorium/transaction/bookedPublicAuditorium");
              } else {
                // swal("Record is Safe");
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
    console.log("props", this.props);
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="/logo.png" alt="" height="80vh" width="80vw" />
              </Grid>
              <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h2>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h2>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="/smartCityPCMC.png" alt="" height="80vh" width="80vw" />
              </Grid>
            </Grid>
            {/* <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
              </div>
              <div className={styles.logo1}>
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </div>
            </div> */}
            <div>
              <h2 className={styles.heading}>
                <b>सेवा स्वीकृती शुल्क पत्र</b>
              </h2>
            </div>

            <div className={styles.two} style={{ marginTop: "2vh", marginLeft: "5vh", marginRight: "5vh" }}>
              <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "" }}>
                    {" "}
                    <b>एलओआय क्र : {}</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>{this?.props?.data?.LoiNo ? this?.props?.data?.LoiNo : "-"}</b>
                  </h4>
                </div>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>दिनांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b> {" " + moment(this?.props?.data?.eventDate).format("DD-MM-YYYY")}</b>{" "}
                    {/* <b>{router?.query?.appointmentDate}</b> */}
                  </h4>
                </div>
              </div>
              <div className={styles.date2}>
                <h4>अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.applicationNumber}</h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचे नाव : </h4>
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.applicantName}</h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b> {" " + moment(this?.props?.data?.eventDate).format("DD-MM-YYYY")}</b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्जदाराचा पत्ता : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.applicantFlatHouseNo}
                  {" ,"}
                  {this?.props?.data?.applicantFlatBuildingName}
                  {" ,"}
                  {this?.props?.data?.applicantLandmark} {","}
                  {this?.props?.data?.applicantArea} {","}
                  {/* <br></br> */}
                  {this?.props?.data?.applicantCity} {","}
                  {this?.props?.data?.applicantState}
                  {","}
                  {this?.props?.data?.applicantPinCode}
                  {"."}
                </h4>
              </div>

              <p>
                <b>
                  <h3>प्रति, {this?.props?.data?.applicantName}</h3>
                  <p>
                    <b>
                      <h3 style={{ paddingLeft: "10%" }}>विषय :- सार्वजनिक सभागृह बुकिंग रक्कम भरणे बाबत</h3>
                      <h3 style={{ paddingLeft: "10%" }}>
                        संदर्भ :- आपला अर्ज क्र {this?.props?.data?.applicationNumber}, दिनांक -{" "}
                        {" " + moment(this?.props?.data?.applicationDate).format("DD-MM-YYYY")},
                      </h3>
                    </b>
                  </p>
                  महोदय/महोदया,
                  <br /> आपल्या वरील संदर्भीय अर्जान्वये केलेली अधिकृत सार्वजनिक सभागृह बुकिंग ची मागणी पिंपरी
                  चिंचवड महानगर पालिका च्या प्राधिकृत अधिकाऱ्यांनी मान्य केली असून सदर आदेश निर्गमित
                  करण्यापूर्वी महानगरपालिकेला देय असलेली रक्कम अदा करावी लागेल.
                  <br /> तुमच्या <b> {this?.props?.data?.serviceNameMr}</b> या सेवेसाठी नागरिक सेवा पोर्टलवर
                  कृपया तुमची रक्कम निश्चित करा आणि केलेल्या सेवेची रक्कम/शुल्क भरा, किंवा जवळील पिंपरी चिंचवड
                  महानगरपलिका विभागीय कार्यालयाला भेट द्या .<br></br>
                </b>
              </p>

              <div className={styles.date2}>
                <h4>सभागृहाचे नाव:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {
                      this?.props?.auditoriums?.find((obj) => {
                        return obj?.id == this?.props?.data?.auditoriumId;
                      })?.auditoriumNameMr
                    }
                  </b>
                </h4>
              </div>

              {/* <div className={styles.date2}>
                <h4>LOI NO : </h4> <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.loi?.loiNo}</h4>
              </div> */}

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>अ.क्र</th>
                    <th colSpan={8}>शुल्काचे नाव</th>
                    <th colSpan={2}>रक्कम रुपये :</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>1)</td>
                    <td colSpan={4}>Deposit Amount</td>
                    <td colSpan={4}>{this?.props?.data?.depositAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>2)</td>
                    <td colSpan={4}>Rent Amount</td>
                    <td colSpan={4}>{this?.props?.data?.rentAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>3)</td>
                    <td colSpan={4}>Security Guard Charges</td>
                    <td colSpan={4}>{this?.props?.data?.securityGuardChargeAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>4)</td>
                    <td colSpan={4}>Board Charges</td>
                    <td colSpan={4}>{this?.props?.data?.boardChargesAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>एकूण रक्कम रुपये : {this?.props?.data?.totalAmount} (18% GST Included) </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <hr />

              <Grid container>
                <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img src="/qrcode1.png" alt="" height="50vh" width="50vw" />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img src="/barcode.png" alt="" height="35vh" width="60vw" />
                </Grid>
              </Grid>

              {/* <div className={styles.foot}>
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
                  <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                </div>
                <div className={styles.logo1}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
