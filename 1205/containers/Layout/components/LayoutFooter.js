import { Typography, Grid, Box } from "@mui/material";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

const LayoutFooter = () => {
  let language = useSelector((state) => state.labels.language);

  return (
    // <div className="layout-footer">
    <div
      style={{
        width: "100%",
        color: "white",
        zIndex: 1,
        // padding: "20px",
        position: "fixed",
        bottom: 0,
        // marginTop: 'auto',
        // marginTop: "200px",
      }}
    >
      {/* <b>PCMC ©2022 Powered by Atos Nascent</b> */}
      <Grid
        container
        style={{
          background: "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
        }}
      >
        {/* <Grid
          item
          xs={1}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src="/logo.png" alt="Picturer" width={30} height={30} />
        </Grid>
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
          xs={1}
        >
          <Typography style={{ fontSize: "6px" }} component="div">
            {language === "en" ? "PIMPRI" : "पिंपरी"}
          </Typography>
          <Typography style={{ fontSize: "6px" }} component="div">
            {language === "en" ? "CHINCHWAD" : "पिंपरी"}
          </Typography>
          <Typography style={{ fontSize: "6px" }} component="div">
            {language === "en" ? "MUNICIPAL" : "महानगर"}
          </Typography>
          <Typography style={{ fontSize: "6px" }} component="div">
            {language === "en" ? "CORPORATION" : "पालिका"}
          </Typography>
        </Grid> */}

        {/* <Typography style={{ fontSize: "10px" }} component="div">
            पिंपरी-चिंचवड
          </Typography>
          <Typography style={{ fontSize: "10px" }} component="div">
            महानगरपालिका
          </Typography> */}
        <Grid
          item
          xs={5}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src="/smartCityPCMC.png"
            alt="Picturer"
            width={50}
            height={30}
            style={{ paddingLeft: "2px" }}
          />
          <Box ml={2}>
            <Typography variant="body2">
              {language === "en"
                ? "Pimpri Chinchwad Smart City initiative"
                : "पिंपरी चिंचवड स्मार्ट सिटी उपक्रम"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "12px" }}>Service</Typography>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "12px" }}>Help and Support</Typography>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>

        <Grid
          item
          xs={4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "10px",
          }}
        >
          {language === "en" ? (
            <>
              <Typography style={{ fontSize: "12px" }}>
                © 2023, developed by
                <Box
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    fontStyle: "italic",
                    paddingLeft: "2px",
                  }}
                  display="inline"
                >
                  Nascent Infotechnologies Pvt. Ltd.
                </Box>{" "}
                {/* and{" "} */}
                <Box
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                  display="inline"
                >
                  {" "}
                  & ATOS
                </Box>
              </Typography>
            </>
          ) : (
            <>
              <Typography style={{ fontSize: "12px" }}>
                <Box
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                  display="inline"
                >
                  © 2023, नासेंट इन्फोटेक. प्रा. लि. आणि अँटोस द्वारा विकसित.
                  {/* एटोस {' '} आणि नेसेंट {' '} द्वारे विकसित{' '} */}
                </Box>
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default LayoutFooter;
