import CheckIcon from "@mui/icons-material/Check";
import { Button, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import styles from "../../../../styles/publicAuditorium/transactions/[auditoriumBooking].module.css";

import ClearIcon from "@mui/icons-material/Clear";
const Index = () => {
  const router = useRouter();

  return (
    <>
      <Paper
        sx={{
          marginLeft: 2,
          marginRight: 2,

          marginBottom: 2,
          padding: 1,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <div className={styles.small}>
          <div
            style={{
              backgroundColor: "#3EADCF",
            }}
          >
            <h1
              style={{
                marginLeft: "350px",
                marginTop: "25px",
                color: "yellow",
              }}
            >
              <b>पिंपरी चिंचवड महानगरपलिका,पिंपरी-४११०१८</b>
            </h1>
            <h3
              style={{
                display: "flex",
                justifyContent: "center",
                color: "yellow",
              }}
            >
              <b>सार्वजनिक सभागृह बुकिंग आणि प्रसारण व्यवस्थापन</b>
            </h3>
          </div>

          <h3
            style={{
              marginLeft: "500px",
              marginTop: "25px",
              color: "red",
            }}
          >
            <b>रंगमंदिर वापराबाबत अटी व शर्ती</b>
          </h3>
          {/* term */}

          <div
            style={{
              marginLeft: "70px",
              marginTop: "25px",
              marginRight: "25px",
            }}
          >
            <h4>
              १) कार्यक्रमाचे आरक्षण अनामत रक्कम भरुन घेउन करणेत येईल. मात्र किमान ५ दिवस अगोदर आहे जमा
              केल्यानंतरच कार्यक्रमाचे आरक्षण निश्चीत होईल. कार्यक्रम केलेली तालमीपूर्वी अर्जदाराने
              कार्यक्रमाचे आहे न भरल्यास जमा म जप्त करण्यात येईल.
            </h4>

            <h4
              style={{
                marginTop: "10px",
                marginRight: "25px",
              }}
            >
              2)विजबिल लागेल. साहित्य / आकार (उपलब्धतेनुसार) कार्यक्रमाचे दिवशी भवा.
            </h4>

            <h4
              style={{
                marginTop: "10px",
                marginRight: "25px",
              }}
            >
              3) कार्यक्रमासाठी पोलिस परवाना आवश्यक राहील.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              ४) करमणूक कर अधिकारी कार्यालय पुणे, धर्मादाय आयुक्त नोंदणी प्रमाणपत्र, तिकीट सेलिंग परवाना,
              नाट्यप्रयोगास लेखकाचे परवानगी पत्र इ. परवाने कार्यक्रमाच्या तीन दिवस अगोदर व्यवस्थापकास
              दाखवण्यात यावेत, याबात कायदेशीर बाबी निर्माण झाल्यास त्याची जबाबदारी अर्जदारावर राहील.
            </h4>

            <h4
              style={{
                marginTop: "10px",
                marginRight: "25px",
              }}
            >
              ५) रंगमंदिरात स्वयंपाक करता येणार नाही.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              ६) अपवादात्मक परिस्थितीत वातानुकूलित यंत्रणा (AC) बंद पडल्यास बाहेरून पखे आणण्याची जबाबदारी
              अर्जदाराची राहील.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              ७) शक्य असल्यास कार्यक्रमाच्या पूर्व तयारी साठी एक तास अगोदर रंगमंदिर उपलब्ध करुन देण्यात येईल.
              मात्र कार्यक्रमानंतर रंगमंदिर सोडण्यास अ तासापेक्षा जास्त वेळ झाल्यास त्यानुसार जादा भाडे
              आकारण्यात येईल.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              ८) रंगित तालीम साठी वातानुकूलित यंत्रणा (AC) असणार नाही.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              ९) रंगमंदिर ज्या अर्जदारास वापरावयास परवानगी दिली आहे अशा अर्जदारास व्यवस्थापकाच्या परवानगी करता
              येणार नाही. शिवाय दुसऱ्याच्या नावे दिलेली परवानगी वर्ग.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              १०) रंगमंदिर ताब्यात दिलेपासून ते रिकामे करून देई पर्यंतच्या वेळेत रंगमंदिरात थुंकणे, धुम्रपान
              करणे, बेशिस्त किंवा अक्षेपार्ह वर्तन केल्याचे निदर्शणास आल्यास तसेच रंगमंदिरातील साधनसामग्रीची
              खराबी किंवा नुकसाण झाल्यास, नुकसान भरपाई भरण्याची जबाबदारी अर्जदाराची राहील.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              ११) कार्याक्रमाच्या पाच दिवस अगोदर अपरिहार्य कारणासाठी कारण न देता दिलेली तारीख रद्द करण्याचा
              अधिकार व्यवस्थापकास राहील. व या कामी अर्जदारास कोणत्याही प्रकारची नुकसान भरपाई देण्यात येणार
              नाही.
            </h4>
          </div>

          <div
            className={styles.AcceptBtn}
            style={{
              marginRight: "20px",
            }}
          >
            <Button
              variant="contained"
              size="small"
              color="success"
              endIcon={<CheckIcon />}
              onClick={() => {
                router.push({
                  pathname: `/PublicAuditorium/transaction/auditoriumBooking`,
                  query: {
                    pageMode: "Add",
                  },
                });
              }}
              // disabled={state}
            >
              {/* <FormattedLabel id="Tnc" /> */}
              Terms And Conditions
            </Button>
            <div style={{ marginLeft: "5vh" }}>
              <Button
              size="small"
                variant="contained"
                color="error"
                endIcon={<ClearIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/dashboard`,
                    query: {
                      pageMode: "Add",
                    },
                  });
                }}
              >
                {/* <FormattedLabel id="exit" /> */}
                Exit
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.row}></div>
      </Paper>
    </>
  );
};

export default Index;
