import { Button, Grid, Paper, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
// PaymentCollectionRecipt
const PaymentCollectionRecipt = () => {
  const [loadderState, setLoadderState] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [paymentCollectionReciptData, setPaymentCollectionReciptData] = useState();
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // getHawkerLiceseData
  const getIssuanceOfHawkerLicsenseData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setPaymentCollectionReciptData(r?.data);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  useEffect(() => {
    // setLoadderState(true);
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
      localStorage.getItem("issuanceOfHawkerLicenseId") != ""
    ) {
      setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
    }
  }, []);

  useEffect(() => {
    console.log("issuanceOfHawkerLicenseId", issuanceOfHawkerLicenseId);
    getIssuanceOfHawkerLicsenseData();
  }, [issuanceOfHawkerLicenseId]);

  useEffect(() => {
    console.log("paymentCollectionReciptData", paymentCollectionReciptData);
  }, [paymentCollectionReciptData]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper
            elevation={0}
            style={{
              margin: "50px",
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
              <br />
              <br />
              <center>
                <h1>पैसे भरल्याची पावती / Payment Paid Slip</h1>
              </center>
            </div>

            <ComponentToPrint ref={componentRef} paymentCollectionReciptData={paymentCollectionReciptData} />
          </Paper>
        </div>
      )}
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    console.log("propscertificate", this?.props?.paymentCollectionReciptData);
    return (
      <div>
        <Paper
          elevation={0}
          // style={{
          //   margin: "50px",
          // }}
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "650px",
          }}
        >
          <div
            style={{
              width: "100%",
              border: "2px solid black",
            }}
          >
            {/** First Row */}
            <div
              style={{
                marginTop: "30px",
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <img src="/logo.png" alt="Maharashtra Logo" height={100} width={100} />
              </div>
              <div style={{ textAlign: "center" }}>
                <h2>
                  <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                </h2>
                <h3>
                  <b>पथविक्रेता व्यवस्थापन प्रणाली</b>
                </h3>
                <h3>
                  <b>पैसे भरल्याची पावती </b>
                </h3>
              </div>
              <div className="col-md-7">
                <img src="/barcode.jpg" alt="Maharashtra Logo" height={100} width={100} />
              </div>
            </div>

            {/** Second Row */}
            <div>
              <Grid
                container
                style={{
                  marginLeft: "5vw",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>पावती क्रमांक : </b> &nbsp; &nbsp;
                  {this?.props?.paymentCollectionReciptData?.paymentCollection?.receiptNo}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>सेवा शुल्क पत्र : &nbsp; &nbsp; </b>{" "}
                  {this?.props?.paymentCollectionReciptData?.loi?.loiNo}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्ज क्र : </b> &nbsp; &nbsp;{" "}
                  {this?.props?.paymentCollectionReciptData?.applicationNumber}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>दिनांक : </b> &nbsp; &nbsp;
                  {this?.props?.paymentCollectionReciptData?.paymentCollection?.receiptDate}
                </Grid>
                {/** Third Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>वेळ : </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय : </b> &nbsp; &nbsp; पथाविक्रेता परवाना जारी करणे
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विभाग : </b> &nbsp; &nbsp;भूमी आणि जिंदगी
                </Grid>
                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्जादाराचे नाव : </b> &nbsp; &nbsp;
                  {this?.props?.paymentCollectionReciptData?.applicantName}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>मोबाईल नंबर : </b> &nbsp; &nbsp;
                  {this?.props?.paymentCollectionReciptData?.mobile}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>ई - मेल आयडी : </b> &nbsp; &nbsp;{" "}
                  {this?.props?.paymentCollectionReciptData?.emailAddress}
                </Grid>
                {/** Fifth Row */}
                <Grid item sx={4} sm={4} md={4} lg={4} xl={4}>
                  <b>पत्ता :</b> &nbsp; &nbsp;{this?.props?.paymentCollectionReciptData?.fullAddressCrMr}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
              </Grid>
              {/** New Row */}
              <br />
              <div
                style={{
                  margin: "10px",
                  marginLeft: "40px",
                  padding: "10px",
                  // border: "2px solid red",
                }}
              >
                <h3>
                  <b>
                    देय रक्कम :&nbsp;&nbsp;
                    {this?.props?.paymentCollectionReciptData?.loi?.totalAmount} (
                    {this?.props?.paymentCollectionReciptData?.loi?.totalInWords})
                  </b>
                </h3>

                <h3>
                  <b>
                    पेमेंट मोड :&nbsp;&nbsp;
                    {this?.props?.paymentCollectionReciptData?.paymentCollection?.paymentType} (
                    {this?.props?.paymentCollectionReciptData?.paymentCollection?.paymentMode})
                  </b>
                </h3>

                <br />
              </div>
            </div>
          </div>

          {/**
          <table className={styles.report} style={{ marginLeft: "50px" }}>
            <tr style={{ marginLeft: "25px" }}>
              <td>
                <h5 style={{ padding: "10px", marginLeft: "20px" }}>
                  अर्जासोबत खालील कागदपत्रे स्वीकारण्यात आली.
                  <br />
                  <br />
                  <br /> <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </h5>
              </td>
            </tr>
          </table>
           */}
        </Paper>
      </div>
    );
  }
}

export default PaymentCollectionRecipt;
