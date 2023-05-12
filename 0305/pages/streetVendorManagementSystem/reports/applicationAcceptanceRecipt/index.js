import { Button, Grid, Paper, Stack } from "@mui/material";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// Index
const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
  };

  // view
  return (
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
          direction='row'
          style={{
            display: "flex",
            justifyContent: "left",
            marginLeft: "50px",
          }}
        >
          <Button
            variant='contained'
            type='primary'
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            print
          </Button>
        </Stack>
        <div>
          <center>
            <h1>अर्जाची पावती / पोहोच पावती / Acknowledgement Slip</h1>
          </center>
        </div>

        <ComponentToPrint ref={componentRef} />
      </Paper>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
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
                <img
                  src='/logo.png'
                  alt='Maharashtra Logo'
                  height={100}
                  width={100}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h2>
                  <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                </h2>
                <h3>
                  <b>पथविक्रेता व्यवस्थापन प्रणाली</b>
                </h3>
                <h4>
                  <b>अर्जाची पावती / पोहोच पावती </b>
                </h4>
              </div>
              <div className='col-md-7'>
                <img
                  src='/barcode.jpg'
                  alt='Maharashtra Logo'
                  height={100}
                  width={100}
                />
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
                  <b>Receipt No:</b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्ज क्र :</b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b> दिनांक :</b>
                </Grid>
                {/** Third Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>वेळ :</b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय :</b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b> विभाग :</b>
                </Grid>
                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>
                    <b>अर्जादाराचे नाव :</b>
                  </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>Mobile No :</b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>Email ID :</b>
                </Grid>
                {/** Fifth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>पत्ता : </b>
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
              </Grid>
              {/** New Row */}
              <Grid
                container
                style={{
                  marginLeft: "5vw",
                  marginTop: "5px",
                  marginBottom: "10px",
                }}
              >
                <Grid item sx={12} sm={12} md={12} lg={12} xl={12}>
                  <b>महोदय,</b>
                </Grid>
              </Grid>
              <div style={{ margin: "10px", padding: "10px" }}>
                <h3>
                  आपण दिलेल्या अर्जाची नोंदनों आम्ही घेतली आहे.आपला &nbsp;
                  <b>अर्ज क्रमांक &nbsp;&nbsp;103322230012368</b> आहे. आपण
                  दिलेले काम अंदाजे &nbsp;<b>दि.&nbsp;17/12/2022</b> पर्यंत
                  पूर्ण होणे अपेक्षित आहे.आपल्या अर्जावर तपासणी करून आपणांस
                  त्याबाबत लवकरच SMS द्वारे कळविण्यात येईल. आपले
                  प्रमाणपत्र/कागदपत्र मिळण्याचे ठिकाण CFC33/Pimpri राहील.
                </h3>
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

export default Index;
