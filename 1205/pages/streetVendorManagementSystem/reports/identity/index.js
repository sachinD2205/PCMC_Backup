import { Button, Grid, Paper, Stack } from "@mui/material";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// Index
const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Back
  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
  };

  // view
  return (
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
            <h1>ओळखपत्र</h1>
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
          <Button variant="contained" type="primary" onClick={backToHomeButton}>
            back To home
          </Button>
          <Button
            variant="contained"
            type="primary"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            print
          </Button>
        </Stack>
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
                  <img
                    src="/logo.png"
                    alt="Maharashtra Logo"
                    height={100}
                    width={100}
                  />
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
                  <img
                    src="/barcode.jpg"
                    alt="Maharashtra Logo"
                    height={100}
                    width={100}
                  />
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
                      <b>ओळखपत्र क्रमांक :</b>
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
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="/logo.png"
                        alt="Maharashtra Logo"
                        height={150}
                        width={150}
                      />
                    </div>
                  </td>
                </tr>
                {/**2 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>नावं :</b>
                    </h3>
                  </td>
                </tr>
                {/**3 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>जन्मदिनांक :</b>
                    </h3>
                  </td>
                </tr>
                {/**4 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>लिंग :</b>
                    </h3>
                  </td>
                </tr>
                {/**5 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>पथविक्रेत्याची वर्गवारी : </b>
                    </h3>
                  </td>
                </tr>
                {/**6 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>व्यवसायाचा प्रकार : </b>
                    </h3>
                  </td>
                </tr>
                {/**7 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>भ्रमणध्वनी क्रमांक : </b>
                    </h3>
                  </td>
                </tr>
                {/**9 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>जारी केल्याचा दिनांक : </b>
                    </h3>
                  </td>
                </tr>
                {/**10 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>वैधता (पर्यंत) : </b>
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
                      <b>पथविक्रेत्याचा निवासी पत्ता : </b>
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

export default Index;
