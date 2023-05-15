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
import styles from "./bookedAcknowledgmentReceipt.module.css";

const BookedAcknowledgmentReceipt = () => {
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
  const [loading, setLoading] = useState(false);

  const [auditoriums, setAuditoriums] = useState([]);

  useEffect(() => {
    getAuditorium();
  }, []);
  const user = useSelector((state) => state?.user.user);

  const isDeptUser = useSelector((state) => state?.user?.user?.userDao?.deptUser);

  const [showData, setShowData] = useState();

  const componentRef = useRef(null);
  const router = useRouter();
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  let _daata;

  useEffect(() => {
    _daata = router?.query && router?.query;
    _daata && setShowData(_daata);
  }, [auditoriums]);

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
        <ComponentToPrint ref={componentRef} data={showData} auditoriums={auditoriums} />
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
          color="error"
          onClick={() => {
            swal({
              title: "Exit?",
              text: "Are you sure you want to exit ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                // swal("Record is Successfully Exit!", {
                //   icon: "success",
                // });
                // router.push("/PublicAuditorium/transaction/bookedPublicAuditorium");

                isDeptUser
                  ? router.push(`/PublicAuditorium/transaction/bookedPublicAuditorium`)
                  : router.push(`/dashboard`);
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
                <b>प्रेक्षागृह बुकिंग पावती</b>
              </h2>
            </div>

            <div className={styles.two} style={{ marginTop: "2vh", marginLeft: "5vh", marginRight: "5vh" }}>
              <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "" }}>
                    {" "}
                    <b>एलओआय क्र : { }</b>
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
                      <h3 style={{ paddingLeft: "10%", fontWeight: 900 }}>विषय :- सभागृह बुकिंग यशस्वी</h3>
                      <h3 style={{ paddingLeft: "10%" }}>
                        संदर्भ :- आपला अर्ज क्र {this?.props?.data?.applicationNumber}, दिनांक -{" "}
                        {" " + moment(this?.props?.data?.applicationDate).format("DD-MM-YYYY")},
                      </h3>
                    </b>
                  </p>
                  महोदय/महोदया,
                  <br /> आपल्या वरील संदर्भीय अर्जान्वये केलेली अधिकृत पिंपरी चिंचवड महानगर पालिका च्या
                  सार्वजनिक सभागृह बुकिंग ची विनंती यशस्वी झाली आहे.
                </b>
              </p>
              <div className={styles.date2}>
                <h4>कार्यक्रमाचे नाव:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.eventTitle}</b>
                </h4>
              </div>
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
                <h4>नियोजित तास:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {
                      this?.props?.auditoriums?.find((obj) => {
                        return obj?.id == this?.props?.data?.auditoriumId;
                      })?.auditoriumNameMr
                    }
                  </b>
                </h4>
              </div> */}
              <div className={styles.date2}>
                <h4>दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{" " + moment(this?.props?.data?.eventDate).format("DD-MM-YYYY")}</b>
                </h4>
              </div>

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

export default BookedAcknowledgmentReceipt;
