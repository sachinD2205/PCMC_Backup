import { Button, Paper, Stack } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
// import styles from "../styles/issuanceOfStreetVendorLicenseCertificate.module.css";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import styles from "../../../../components/streetVendorManagementSystem/styles/issuanceOfStreetVendorLicenseCertificate.module.css";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useRouter } from "next/router";
import moment from "moment";

/** Author - Sachin Durge */
// IssuanceOfStreetVendorlicensecertificate
const CertificateIssuanceOfHawkerLicense = () => {
  const componentRef = useRef();
  const router = useRouter();
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [certificateData, setCertificateData] = useState();
  const [loadderState, setLoadderState] = useState(false);

  // HandleToPrintButton
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getHawkerCertificateData = () => {
    setLoadderState(true);
    axios
      .get(
        `${urls.HMSURL}/hawkerLiscenseCertificate/getById?issuanceOfliscenseId=${issuanceOfHawkerLicenseId}`,
      )
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setCertificateData(r?.data);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch((errors) => {
        setLoadderState(false);
        <Failed />;
      });
  };

  useEffect(() => {
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
      localStorage.getItem("issuanceOfHawkerLicenseId") != ""
    ) {
      setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
    }
  }, []);

  useEffect(() => {
    console.log("issuanceOfHawkerLicenseId", issuanceOfHawkerLicenseId);
    getHawkerCertificateData();
  }, [issuanceOfHawkerLicenseId]);

  useEffect(() => {
    console.log("certificateData", certificateData);
  }, [certificateData]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          elevation={0}
          sx={{
            paddingTop: "50px",
            paddingRight: "100px",
            paddingLeft: "100px",
          }}
        >
          <br />
          <br />
          <Stack
            spacing={5}
            direction="row"
            style={{
              display: "flex",
              justifyContent: "left",
              marginLeft: "50px",
            }}
          >
            <Button
              variant="contained"
              type="primary"
              style={{ float: "right" }}
              onClick={() => handlePrint()}
            >
              {<FormattedLabel id="print" />}
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("issuanceOfHawkerLicenseId");
                if (localStorage.getItem("loggedInUser") == "citizenUser") {
                  router.push("/dashboard");
                } else {
                  router.push("/streetVendorManagementSystem/dashboards");
                }
              }}
              type="button"
              variant="contained"
              color="primary"
            >
              {<FormattedLabel id="back" />}
            </Button>
          </Stack>
          <br />
          <br />
          <ComponentToPrint ref={componentRef} certificateData={certificateData} />
        </Paper>
      )}
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends React.Component {
  render() {
    console.log("propscertificate", this?.props?.certificateData);

    // view;
    return (
      <>
        <Paper
          elevation={0}
          sx={{
            paddingRight: "20px",
            paddingLeft: "20px",
            paddingLeft: "20px",
            paddingBottom: "50px",
            height: "1400px",
          }}
        >
          <table
            style={{
              border: "2px solid black",
              width: "90%",
              marginLeft: "2%",
              marginRight: "10%",
              marginTop: "20px",
            }}
          >
            {/** Header */}
            <tr className={styles.pcmc1}>
              <div className={styles.main}>
                <div className={styles.one}>
                  <img src="/logo.png" alt="Maharashtra Logo" height={198} width={198}></img>
                </div>
                <div className={styles.pcmc}>
                  <h1>
                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                  </h1>
                  <div className={styles.centerCertificate}>
                    <h1>
                      <b>पिंपरी - ४११ ०१८</b>
                    </h1>
                  </div>
                </div>
              </div>
            </tr>

            {/** Header End */}
            <tbody>
              <tr colSpan="30">
                <div className={styles.dateCertificateNo}>
                  <td>
                    <h4>
                      <b>
                        फेरीवाला नोंदणी क्र.: &nbsp;&nbsp;
                        {moment(this?.props?.certificateData?.certificateIssuedDate).format("DD-MM-YYYY")}
                      </b>
                    </h4>
                  </td>

                  <td>
                    <h4>
                      <b>फेरीवाला नोंदणी क्र.: &nbsp;&nbsp;{this?.props?.certificateData?.certificateNo} </b>
                    </h4>
                  </td>
                </div>
              </tr>

              <tr colSpan="30">
                <center>
                  <td>
                    <h2 style={{ marginTop: "25px" }} className={styles.extraWidth1}>
                      <b>फेरीवाला नोंदणी प्रमाणपत्र</b>
                    </h2>
                  </td>
                </center>
              </tr>
              {/** P1 */}
              <tr colSpan="30">
                <td>
                  <h3 className={styles.extraWidth1}>
                    <p className={styles.p1}>
                      श्री./श्रीमती.&nbsp;&nbsp; {this?.props?.certificateData?.applicantName} यांना भारत
                      सरकारच्या "दि स्ट्रीट व्हेंडर्स (प्रोटेक्शन ऑफ लाईव्हलिहूड अँड रेग्युलेशन ऑफ स्ट्रीट
                      व्हेंडींग) अधिनियम २०१४" चे मधील प्रकरण २ कलम ४ (१) अन्वये सदर फेरीवाला नोंदणी प्रमाणपत
                      देणेत येते की, महाराष्ट्र शासनाचे आदेशान्वये लागू असलेल्या राष्ट्रीय फेरीवाला धोरण २००९
                      चे प्रकरण क्र. ४.५.४ मधील तरतूदींनुसार पिंपरी चिंचवड शहरातील ‘‘फेरीवाला व्यावसायिक”
                      म्हणून पिंपरी चिंचवड महानगरपालिकेकडून {this?.props?.certificateData?.fullAddressMr} या
                      चालू व्यवसाय जागेवरील बायोमेट्रीक सर्वेक्षण करण्यात येऊन महानगरपालिका स्तरावर खालील
                      तक्त्यात दर्शविल्याप्रमाणे नोंद घेणेत आलेली आहे.
                    </p>
                  </h3>
                </td>
              </tr>
              <tr colSpan="30">
                <center>
                  <td>
                    <h2 className={styles.extraWidth1}>
                      <b>फेरीवाला नोंद तपशील</b>
                    </h2>
                  </td>
                </center>
              </tr>

              {/** Inside Table */}
              <center>
                <div className={styles.extraWidth1}>
                  <tr>
                    <td colSpan={20} rowSpan={1} className={styles.borderBlack}>
                      <h3 className={styles.center} style={{ marginLeft: "5px", marginRight: "5px" }}>
                        फेरीवाल्याचे नाव: &nbsp;&nbsp;{this?.props?.certificateData?.applicantName}
                      </h3>
                    </td>
                    <td colSpan={10} rowSpan={4} className={styles.borderBlack}>
                      <img
                        src={`${urls.CFCURL}/file/preview?filePath=${
                          this?.props?.certificateData?.siteVisits[
                            this?.props?.certificateData?.siteVisits?.length - 1
                          ]?.streetVendorPhoto
                        }`}
                        alt="Street Vendor Photo"
                        width={200}
                      ></img>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={20} className={styles.borderBlack}>
                      <h3 className={styles.center} style={{ marginLeft: "5px", marginRight: "5px" }}>
                        निवासाचा पत्ता: &nbsp;&nbsp;{this?.props?.certificateData?.fullAddressMr}
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={20} className={styles.borderBlack}>
                      <h3 className={styles.center} style={{ marginLeft: "5px", marginRight: "5px" }}>
                        फोन क्र: &nbsp;&nbsp;{this?.props?.certificateData?.mobile}
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={10} className={styles.borderBlack}>
                      <h3 className={styles.center} style={{ marginLeft: "10px", marginRight: "5px" }}>
                        व्यवसाय प्रकार:&nbsp;&nbsp; {this?.props?.certificateData?.hawkerTypeNameMr}
                      </h3>
                    </td>
                    <td colSpan={10} className={styles.borderBlack}>
                      <h3 className={styles.center} style={{ marginLeft: "10px", marginRight: "5px" }}>
                        व्यवसाय साधन:&nbsp;&nbsp;{this?.props?.certificateData?.hawkingModeNameMr}
                      </h3>
                    </td>
                  </tr>
                </div>
              </center>

              {/** P2 */}
              <tr>
                <td>
                  <h3 className={styles.extraWidth1}>
                    <p className={styles.p1}>
                      सदर नोंदणीनुसार आपणांस पिंपरी चिंचवड महानगरपालिके कडून नव्याने नेमून दिलेल्या जागेवर या
                      नोंदणी प्रमाणपत्राचे मागील बाजूस ठरवून दिलेल्या अटी/शर्तीनुसार आपण व्यवसाय करावयाचा आहे.
                      सदर अटी /शर्तीचे पालन करणे आपणांवर बंधनकारक असून, या अटींवरच सदरचे ‘‘फेरीवाला नोंदणी
                      प्रमाणपत्र” आपणांस देणेत येत आहे. सदरचे फेरीवाला नोंदणी प्रमाणपत्र अथवा व्यवसायाची नेमून
                      दिलेली जागा आपणांस इतरांचे नावे परस्पर हस्तांतरीत करता येणार नाही. या प्रमाणपत्राचे
                      नुतनीकरण दरवर्षी एप्रिल महिन्यामध्ये करणे आपणांस बंधनकारक राहील.
                    </p>
                  </h3>
                </td>
              </tr>
              {/** P3 */}
              <tr>
                <td>
                  <h3 className={styles.extraWidth1}>
                    <p className={styles.p1}>
                      आपण मनपाच्या सर्व अटी/शर्ती व ठरविलेले परवाना शुल्क, विलंब शुल्क तसेच महाराष्ट्र शासनाचे
                      योजनेनुसार त्यामध्ये वेळोवेळी होणारे बदल इत्यादींच्या अधिन राहून व्यवसाय करावयाचा आहे.
                      सदर नियम व कायदेशीर तरतूदींचा आपणाकडू न भंग झाल्यास आपले फेरीवाला नोंदणी प्रमाणपत्र रद्द
                      करण्यात येईल.
                    </p>
                  </h3>
                </td>
              </tr>

              {/** Footer */}
              <div className={styles.extraWidth1}>
                <tr style={{ paddingTop: "10vh" }}>
                  <td rowSpan="6" colSpan={10}>
                    <div
                      style={{
                        width: "600px",
                        marginLeft: "50px",
                      }}
                    >
                      <img src="/qrcode1.png" alt="barcode" width={100} height={100} />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td colSpan={20}>
                    <h3 className={styles.extraWidth2}>क्षेत्रिय अधिकारी</h3>
                  </td>
                </tr>

                <tr>
                  <td colSpan={20}>
                    <h3 className={styles.extraWidth2}>अक्षेत्रिय कार्यालय</h3>
                  </td>
                </tr>

                <tr>
                  <td colSpan={20}>
                    <h3 className={styles.extraWidth2}>पिंपरी चिंचवड महानगरपालिका ,पिंपरी – ४११ ०१८</h3>
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </Paper>
      </>
    );
  }
}

export default CertificateIssuanceOfHawkerLicense;
