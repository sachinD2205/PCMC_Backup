import { Button, Paper } from "@mui/material";
import { Image } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import styles from "./MRC.module.css";

const MarriageCertificateReport = () => {
  let user = useSelector((state) => state.user.user);
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [data, setData] = useState(null);

  useEffect(() => {
    let applicationId;
    let serviceId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (localStorage.getItem("applicationId")) {
      applicationId = localStorage.getItem("applicationId");
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    if (router?.query?.serviceId) {
      serviceId = router?.query?.serviceId;
    } else if (localStorage.getItem("serviceId")) {
      serviceId = localStorage.getItem("serviceId");
    }
    axios
      .get(
        `${urls.MR}/transaction/marriageCertificate/getMCBySIdAndId?applicationId=${applicationId}&serviceId=${serviceId}`,
      )
      .then((r) => {
        console.log("r.data", r.data);
        setData({ ...r.data, token: user?.token });
      });
  }, [router?.query?.applicationId, router?.query?.serviceId, user?.token]);

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          sx={{ width: "25px" }}
          type="primary"
          variant="contained"
          onClick={() => {
            console.log("tokeeennn", this?.props?.data?.token);
            if (this?.props?.data?.token != null) {
              router.push("/marriageRegistration/transactions/newMarriageRegistration/scrutiny");
            } else {
              router.push("/dashboard");
            }
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
        <div>
          <div>
            <Paper>
              <table className={styles.data} style={{ marginTop: "25px" }}>
                <tr>
                  <div className={styles.main}>
                    <div className={styles.one}>
                      {/* <Image
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.gphoto}`}
                        alt="Groom Photo"
                        height={140}
                        width={130}
                      /> */}
                      {/* </img> */}
                    </div>
                    <div className={styles.two}>
                      {/* <Image
                        width={300}
                        height={200}
                        src={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
                      /> */}
                      <Image src={"/logoCer.jpg"} alt="Maharashtra Logo" height={100} width={100}></Image>
                    </div>
                    <div className={styles.three}>
                      {/* <Image
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.bphoto}`}
                        alt="Bride Photo"
                        height={140}
                        width={130}
                      ></Image> */}
                      <Image src={"/mahaonline.png"} alt="Maharashtra Logo" height={80} width={80}></Image>
                    </div>
                  </div>
                </tr>

                <tr>
                  <center style={{ lineHeight: "0.8" }}>
                    <h2>महाराष्ट्र शासन</h2>
                    <h2>GOVERNMENT OF MAHARASHTRA</h2>
                    <h3>पिंपरी चिंचवड महानगरपालिका</h3> <h3>Pimpri-Chinchwad Municipal Corporation</h3>{" "}
                    <h3>(भाग चार-ब) महाराष्ट्र शासन राजपत्र , मे 20, १९९९ / वैशाख ३० , शके १९२१ </h3>{" "}
                    <h3>नमुना 'इ' / Form 'E'</h3>
                    <h3>विवाह नोंदणी प्रमाणपत्र</h3> <h3>Certificate Of Registration Of Marriage</h3>
                    <h4>(कलम ६ (१) आणि नियम ५ पहा) </h4>
                    <h4>See section 6(1) and Rule 5</h4>
                  </center>
                </tr>
              </table>

              <table className={styles.data}>
                <div className={styles.data1}>
                  <div
                    className={styles.a}
                    style={{
                      paddingLeft: "2vh",
                      paddingTop: "4px",
                      paddingRight: "2vh",
                      paddingBottom: "1vh",
                    }}
                  >
                    <div style={{ marginLeft: "150px" }}>
                      <b>प्रमाणित करण्यात येते की ,/Certified that,Marriage between</b>
                    </div>
                    <br />
                    <div className={styles.nameAdh1}>
                      पतीचे नाव
                      <div style={{ marginLeft: "8vh" }}>
                        <b>
                          : {this?.props?.data?.gfNameMr + " "} {this?.props?.data?.gmNameMr + " "}
                          {this?.props?.data?.glNameMr}
                        </b>{" "}
                      </div>
                      <div style={{ marginLeft: "160px" }}>
                        आधार क्रमांक/Aadhar No:<b> {this?.props?.data?.gaadharNo + " "}</b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      Name of husband
                      <div style={{ marginLeft: "40px" }}>
                        <b>
                          : {this?.props?.data?.gfName + " "} {this?.props?.data?.gmName + " "}
                          {this?.props?.data?.glName}
                        </b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      राहणार
                      <div style={{ marginLeft: "102px" }}>
                        <b>
                          : {this?.props?.data?.gbuildingNoMr} {this?.props?.data?.gbuildingNameMr}
                          {this?.props?.data?.groadNameMr} {","}
                          {this?.props?.data?.glandmarkMr} {","}
                          {this?.props?.data?.gcityNameMr} {""}
                          {/* {this?.props?.data?.astateMr} {","}
                        {this?.props?.data?.gpincode}{" "} */}
                        </b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      Residing at:
                      <div style={{ marginLeft: "74px" }}>
                        <b>
                          : {this?.props?.data?.gbuildingNo} {this?.props?.data?.gbuildingName}
                          {this?.props?.data?.groadName} {","}
                          {this?.props?.data?.glandmark} {","}
                          {this?.props?.data?.gcityName} {""}
                          {/* {this?.props?.data?.gstate}
                        {" ,"}
                        {this?.props?.data?.gpincode}{" "} */}
                        </b>
                      </div>
                    </div>
                    <br />
                    <div className={styles.nameAdh1}>
                      पत्नीचे नाव
                      <div style={{ marginLeft: "8vh" }}>
                        <b>
                          : {this?.props?.data?.bfNameMr + " "}
                          {this?.props?.data?.bmNameMr + " "}
                          {this?.props?.data?.blNameMr}{" "}
                        </b>
                      </div>
                      <div style={{ marginLeft: "160px" }}>
                        आधार क्रमांक/Aadhar No:<b>{this?.props?.data?.baadharNo + " "}</b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      Wife's Name
                      <div style={{ marginLeft: "67px" }}>
                        <b>
                          : {this?.props?.data?.bfName + " "}
                          {this?.props?.data?.bmName + " "}
                          {this?.props?.data?.blName}{" "}
                        </b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      राहणार
                      <div style={{ marginLeft: "102px" }}>
                        <b>
                          : {this?.props?.data?.bbuildingNoMr} {this?.props?.data?.bbuildingNameMr}
                          {this?.props?.data?.broadNameMr} {","}
                          {this?.props?.data?.blandmarkMr} {","}
                          {this?.props?.data?.bcityNameMr} {""}
                        </b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      Residing at
                      <div style={{ marginLeft: "75px" }}>
                        <b>
                          : {this?.props?.data?.bbuildingNo}
                          {" ,"}
                          {this?.props?.data?.bbuildingName}
                          {", "}
                          {this?.props?.data?.broadName} {","}
                          {this?.props?.data?.blandmark} {","}
                          {this?.props?.data?.bcityName} {""}
                        </b>
                      </div>
                    </div>
                    <br />
                    यांचा विवाह दिनांक :
                    <b>
                      {" "}
                      {" " + moment(this?.props?.data?.marriageDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </b>{" "}
                    रोजी
                    <b>{" " + this?.props?.data?.pplaceOfMarriageMr}</b>
                    (ठिकाणी) येथे विधी संपन्न झाला. त्याची महाराष्ट्र विवाह मंडळाचे विनियमन आणि विवाह नोंदणी
                    विधेयक १९९८ अन्वये ठेवण्यात आलेल्या , नोंद वहीच्या खंड क्र ३ अनुक्रमांक :
                    <b>{" " + this?.props?.data?.registrationNumber}</b> वर दिनांक :{" "}
                    <b>
                      {" " + moment(this?.props?.data?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </b>{" "}
                    रोजी माझ्याकडून नोंदणी करण्यात आली आहे.
                    <br />
                    <br />
                    Solemnized on :
                    <b>
                      {" "}
                      {" " + moment(this?.props?.data?.marriageDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </b>{" "}
                    at (Place) is :<b>{" " + this?.props?.data?.pplaceOfMarriage}</b> registered by me on{" "}
                    <b>
                      {" " + moment(this?.props?.data?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </b>{" "}
                    at Serial No:
                    <b>{" " + this?.props?.data?.registrationNumber}</b> of Volume 3 of register of Marriages
                    maintained under the Maharashtra Regulation of Marriage Bureaus and Registration of
                    Marriage Act 1998. {/* </td> */}
                  </div>
                </div>
              </table>
              <div className={styles.kahipnB}>
                <div className={styles.mainB}>
                  <div className={styles.oneB}>
                    <Image
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.gphoto}`}
                      alt="Groom Photo"
                      height={90}
                      width={80}
                    />
                    {/* </img> */}
                  </div>
                  <div className={styles.twoB}></div>
                  <div className={styles.threeB}>
                    <Image
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.bphoto}`}
                      alt="Bride Photo"
                      height={90}
                      width={80}
                    ></Image>
                  </div>
                </div>
              </div>
              <div className={styles.kahipn}>
                <div>
                  <div className={styles.digital}>
                    <div className={styles.logo1}>
                      <img src="/qrcode1.png" alt="" height="40vh" width="40vw" />
                    </div>

                    {this?.props?.data?.applicationStatus == "CERTIFICATE_ISSUED" ? (
                      <div className={styles.logo1} style={{ marginLeft: "45vh" }}>
                        <img src="/verified.png" alt="Verified Logo" height={50} width={50}></img>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={styles.nameAdh}
                    style={{
                      paddingLeft: "5vh",
                    }}
                  >
                    प्रमाणपत्र क्र / Certificate No :&nbsp; <b>{" " + this?.props?.data?.certificateNo}</b>
                  </div>
                </div>
                <div className={styles.kahipnL}>
                  <div
                    style={{
                      marginLeft: "5vh",
                      // marginRight: "5vh",
                      marginTop: "5px",
                      paddingRight: "5vh",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div>
                        <b>ठिकाण: </b>
                      </div>
                      <div>
                        <b>&nbsp;पिंपरी</b>
                      </div>
                      <div>
                        <b>&nbsp;चिंचवड</b>
                      </div>
                      <div>
                        <b>&nbsp;महानगरपालिका</b>
                      </div>
                    </div>
                    <br />
                    <div>
                      <b>
                        दिनांक :{" "}
                        <b>
                          {" " +
                            moment(this?.props?.data?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                        </b>
                      </b>
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: "2vh",
                    }}
                  >
                    <div className={styles.circle} style={{ paddingTop: "2vh" }}>
                      <div className={styles.text}>Seal</div>
                    </div>
                  </div>
                  <div style={{ paddingTop: "2vh", marginLeft: "5vh" }}>
                    <b>
                      विवाह निबंधक :{" " + this?.props?.data?.zone?.zoneNameMr}
                      <br />
                      <b> पिंपरी चिंचवड</b>
                    </b>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}

export default MarriageCertificateReport;
