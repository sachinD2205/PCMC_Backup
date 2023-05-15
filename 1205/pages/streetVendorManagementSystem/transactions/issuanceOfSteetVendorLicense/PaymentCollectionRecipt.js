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
import moment from "moment";
// PaymentCollectionRecipt
const PaymentCollectionRecipt = () => {
  const [loadderState, setLoadderState] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] = useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
  const [paymentCollectionReciptData, setPaymentCollectionReciptData] = useState();
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // issuance
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
        setLoadderState(false);
        <Failed />;
      });
  };

  // renewal
   const getRenewalOfHawkerLicenseData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/transaction/renewalOfHawkerLicense/getById?id=${renewalOfHawkerLicenseId}`)
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
        setLoadderState(false);
        <Failed />;
      });
  };
  

  // cancellation
   const getCancellationOfHawkerLicenseData = () => {
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
        setLoadderState(false);
        <Failed />;
      });
  };

   // transfer
   const getTransferOfHawkerLicenseData = () => {
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
        setLoadderState(false);
        <Failed />;
      });
  };



 // idSet
  useEffect(() => {
    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null && 
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
    }

    // renewal
  else if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
       localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
        localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
      setRenewalOfHawkerLicenseId(localStorage.getItem("renewalOfHawkerLicenseId"));
    }

    // cancelltion
   else if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
       localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      setCancellationOfHawkerLicenseId(localStorage.getItem("cancellationOfHawkerLicenseId"));
    }


    // transfer
   else if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" && 
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
      setTransferOfHawkerLicenseId(localStorage.getItem("transferOfHawkerLicenseId"));
    }



  }, []);

  // api
  useEffect(() => {

     // issuance
    if (issuanceOfHawkerLicenseId != null && issuanceOfHawkerLicenseId != undefined && issuanceOfHawkerLicenseId != ""  ) {
      getIssuanceOfHawkerLicsenseData();
    }
    // renewal
    else if (renewalOfHawkerLicenseId != null && renewalOfHawkerLicenseId != undefined && renewalOfHawkerLicenseId != "") {
      getRenewalOfHawkerLicenseData();
    }
    // cancellation
    else if (cancellationOfHawkerLicenseId != null && cancellationOfHawkerLicenseId != undefined && cancellationOfHawkerLicenseId != "") {
      getCancellationOfHawkerLicenseData();
    }
      // transfer
     else if (transferOfHawkerLicenseId != null && transferOfHawkerLicenseId != undefined  && transferOfHawkerLicenseId != "") {
      getTransferOfHawkerLicenseData();
    }

  }, [issuanceOfHawkerLicenseId,renewalOfHawkerLicenseId,cancellationOfHawkerLicenseId,transferOfHawkerLicenseId]);

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
            <div>
              <br />
              <br />
              <center>
                <h1>पैसे भरल्याची पावती / Payment Receipt</h1>
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
                  {moment(this?.props?.paymentCollectionReciptData?.paymentCollection?.receiptDate).format(
                    "DD-MM-YYYY",
                  )}
                </Grid>
                {/** Third Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>वेळ : </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय : </b> &nbsp; &nbsp; {this?.props?.paymentCollectionReciptData?.serviceNameMr}
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
