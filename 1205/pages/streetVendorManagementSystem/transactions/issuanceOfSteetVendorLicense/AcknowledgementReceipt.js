import React, { useEffect, useRef, useState } from "react";
import { Button, Grid, Paper, Stack } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";
import axios from "axios";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import moment from "moment";

// Index
const Index = () => {
  const [loadderState, setLoadderState] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] = useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
  const [acknowledgementReceipt, setAcknowledgementReceipt] = useState();
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
          setAcknowledgementReceipt(r?.data);
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

   // getRenewalOfHawkerLicenseData
  const getRenewalOfHawkerLicenseData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/transaction/renewalOfHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setAcknowledgementReceipt(r?.data);
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


   // getCancellationOfHawkerLicenseData
  const getCancellationOfHawkerLicenseData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setAcknowledgementReceipt(r?.data);
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


  // getTransferOfHawkerLicenseData
  const getTransferOfHawkerLicenseData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setAcknowledgementReceipt(r?.data);
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
    console.log("acknowledgementReceipt", acknowledgementReceipt);
  }, [acknowledgementReceipt]);

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
            <div>
              <br />
              <br />
              <center>
                <h1>अर्जाची पावती / पोहोच पावती</h1>
              </center>
            </div>
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
              <Button variant="contained" type="primary" style={{ float: "right" }} onClick={handlePrint}>
                print
              </Button>
            </Stack>
            <ComponentToPrint ref={componentRef} acknowledgementReceipt={acknowledgementReceipt} />
          </Paper>
        </div>
      )}
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    console.log(" {this?.props?.acknowledgementReceipt }", this?.props?.acknowledgementReceipt);

    return (
      <div>
        <Paper
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "1000px",
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
                  <b>परवाना प्रणाली</b>
                </h3>
                <h3>
                  <b>अर्जाची पावती / पोहोच पावती</b>
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
                  marginLeft: "10vw",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्ज क्र :</b> {this?.props?.acknowledgementReceipt?.applicationNumber}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>दिनांक :</b>{" "}
                  {moment(this?.props?.acknowledgementReceipt?.applicationDate).format("DD-MM-YYYY")}
                </Grid>
                {/** Third Row */}

                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय :</b> {this?.props?.acknowledgementReceipt?.serviceNameMr}
                </Grid>

                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्जादाराचे नाव :</b> {this?.props?.acknowledgementReceipt?.applicantName}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>मोबाईल नंबर : </b> {this?.props?.acknowledgementReceipt?.mobile}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>ई - मेल आयडी : </b> {this?.props?.acknowledgementReceipt?.emailAddress}
                </Grid>
              </Grid>
              {/** New Row */}
              <br />
              <div style={{ margin: "10px", marginLeft: "40px", padding: "10px" }}>
                <h4>
                  महोदय,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <b> {this?.props?.acknowledgementReceipt?.applicantName}</b>
                </h4>
                <h4>
                  <b>
                    आपण दिलेल्या अर्जाची नोंदणी आम्ही घेतली आहे.आपला अर्ज क्रमांक{" "}
                    <b> ({this?.props?.acknowledgementReceipt?.applicationNumber})</b> आहे. आपण दिलेले काम
                    अंदाजे <b>दि. &nbsp;</b>
                    पर्यंत पूर्ण होणे अपेक्षित आहे. आपल्या अर्जावर तपासणी करून आपणांस त्याबाबत लवकरच SMS
                    द्वारे कळविण्यात येईल.
                  </b>
                </h4>
                <br />
              </div>

              <div style={{ margin: "10px", marginLeft: "500px", padding: "10px" }}>
                <h4>
                  <b>सही </b>
                </h4>
                <br />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default Index;
