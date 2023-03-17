import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "../../../../components/streetVendorManagementSystem/styles/issuanceOfStreetVendorLicenseCertificate.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

/** Authore - Sachin Durge */
// Identity
const IdCardOfStreetVendor = () => {
  const componentRef = useRef();
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const router = useRouter();
  const [iCardData, setICardData] = useState();
  const [loadderState, setLoadderState] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getICardData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/hawkerLiscenseIdCard/getById?issuanceOfliscenseId=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setICardData(r?.data);
          setLoadderState(false);
        } else {
          <Failed />;
          setLoadderState(false);
        }
      })
      .catch(() => {
        <Failed />;
        setLoadderState(false);
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
    getICardData();
  }, [issuanceOfHawkerLicenseId]);

  useEffect(() => {
    console.log("iCardData", iCardData);
  }, [iCardData]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper
            style={{
              margin: "50px",
            }}
          >
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
                  router.push("/streetVendorManagementSystem/dashboards");
                }}
                type="button"
                variant="contained"
                color="primary"
              >
                {<FormattedLabel id="back" />}
              </Button>
            </Stack>
            <div>
              <center>
                <h1>ओळखपत्र</h1>
              </center>
            </div>

            <ComponentToPrint ref={componentRef} iCardData={iCardData} />
          </Paper>
        </div>
      )}
    </>
  );
};

// ComponentToPrint - ClassComonent
class ComponentToPrint extends React.Component {
  render() {
    // View
    return (
      <div>
        <Paper
          // style={{
          //   margin: "50px",
          // }}
          elevation={0}
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "1000px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "700px",
                border: "2px solid black",
                paddingLeft: "20px",
                paddingRight: "20px",
                // padding: "20px",
              }}
            >
              {/** First Row */}
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Image src="/logo.png" alt="PCMC Logo" height={100} width={100} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h2>
                    <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                  </h2>
                  <h3>
                    <b>ओळखपत्र</b>
                  </h3>
                </div>
                <div className="col-md-7">
                  <Image src="/barcode.jpg" alt="Barcode Logo" height={100} width={100} />
                </div>
              </div>
              <table
                style={{
                  width: "100%",
                  marginTop: "75px",
                  marginLeft: "20px",
                  marginRight: "20px",
                  marginBottom: "20px",
                  // border: "2px solid red",
                }}
              >
                {/**1 */}
                <tr>
                  <td
                    colSpan={30}
                    // style={{ border: "2px solid yellow" }}
                  >
                    <h3>
                      <b>ओळखपत्र क्रमांक : </b>&nbsp; {this?.props?.iCardData?.iCardNo}
                    </h3>
                  </td>

                  <td
                    colSpan={10}
                    rowSpan={5}
                    style={{
                      // border: "2px solid pink",
                      display: "table-cell",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginRight: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`${urls.CFCURL}/file/preview?filePath=${
                          this?.props?.iCardData?.siteVisits[this?.props?.iCardData?.siteVisits?.length - 1]
                            ?.streetVendorPhoto
                        }`}
                        alt="Street Vendor Photo"
                        width={200}
                      ></img>
                    </div>
                  </td>
                </tr>
                {/**2 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>नावं : &nbsp; </b>
                      {this?.props?.iCardData?.applicantName}
                    </h3>
                  </td>
                </tr>
                {/**3 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>जन्मदिनांक :&nbsp;</b> {this?.props?.iCardData?.dateOfBirth}
                    </h3>
                  </td>
                </tr>
                {/**4 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>लिंग :&nbsp; </b>
                      {this?.props?.iCardData?.genderNameMr}
                    </h3>
                  </td>
                </tr>
                {/**5 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>पथविक्रेत्याची वर्गवारी :&nbsp; </b>
                      {this?.props?.iCardData?.hawkerTypeNameMr}
                    </h3>
                  </td>
                </tr>
                {/**6 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>व्यवसायाचा प्रकार : </b>&nbsp;{this?.props?.iCardData?.hawkingModeNameMr}
                    </h3>
                  </td>
                </tr>
                {/**7 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>भ्रमणध्वनी क्रमांक : </b>&nbsp; {this?.props?.iCardData?.mobile}
                    </h3>
                  </td>
                </tr>
                {/**9 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>जारी केल्याचा दिनांक :</b> &nbsp; {this?.props?.iCardData?.icardIssuedDate}
                    </h3>
                  </td>
                </tr>
                {/**10 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>वैधता (पर्यंत) :&nbsp; </b>
                    </h3>
                  </td>
                  <td
                    style={{
                      // border: "2px solid pink",
                      display: "table-cell",
                    }}
                  >
                    <h3
                      style={{
                        marginRight: "20px",
                        //   border: "2px solid pink",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <b>स्वाक्षरी : </b>
                    </h3>
                  </td>
                </tr>
                {/**11*/}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>पथविक्रेत्याचा निवासी पत्ता :</b>&nbsp;
                      {this?.props?.iCardData?.fullAddressMr}
                    </h3>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default IdCardOfStreetVendor;
