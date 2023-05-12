import { Button, Grid } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "../goshwara.module.css";
import axios from "axios";
import urls from "../../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { ToWords } from "to-words";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = ({ applicantData, hutData, handleClose, setSelfAttestationFlag }) => {

  const [age, setAge] = useState(0);
  const [applicantPhoto, setApplicantPhoto] = useState()

  useEffect(()=>{
    let temp = hutData?.mstHutMembersList && hutData?.mstHutMembersList.find((member)=> member?.firstName === applicantData?.applicantFirstNameEn)
    setAge(temp?.age)
  console.log("temp", temp);
  },[hutData,applicantData]);


 useEffect(()=>{
    setApplicantPhoto(applicantData?.applicantPhoto?.documentPath)
  },[applicantData?.applicantPhoto?.documentPath]);


  console.log("applicantData", applicantData);

  // view
  return (
    <div id="selfAttestation">
      <div>
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.two}>
              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6} style={{marginTop: "6vh"}}>
                  <h4>
                    {" "}
                    <b>प्रपत्र – ब </b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date5}>
                <div className={styles.date6}>
                  <h4>
                    {" "}
                    <b>स्वयं - साक्षांकनासाठी स्वयंघोषणापत्र </b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date7} >
                <div className={styles.date8} >
                  <div className={styles.add7} style={{ marginRight: "80px", paddingBottom: "6vh", paddingTop: "6vh",border: "1px solid black" }}>
                  {
                        
                        applicantPhoto ?
                        <img
                src={applicantPhoto}
                alt="अर्जदाराचा फोटो"
                height="100vw"
                width="100vw"
              />
                        :
                        <h4>अर्जदाराचा फोटो</h4>
                      }
                  </div>
                </div>
              </div>

              {/*********** LETTER BODY ****************/}

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "70px" }}>
                  मी {`${applicantData?.applicantFirstName} ${applicantData?.applicantMiddleName} ${applicantData?.applicantLastName}`}.. श्री.{`${applicantData?.applicantMiddleName} ${applicantData?.applicantLastName}`} यांचा मुलगा/मुलगी वय {age} वर्ष, आधार क्रमांक (असल्यास)  {`${applicantData?.applicantAadharNo}`} व्यवसाय ………………………………………. राहणार ……………………………………….. याद्वारे घोषित करतो/करते की, झोपडपट्टी पुनर्वसन योजनेत पात्रता तपासण्यासाठी विहित पुराव्याच्या स्वयं साक्षांकित केलेल्या प्रती या मूळ कागपत्रांच्याच सत्य प्रती आहेत. त्या खोट्या असल्याचे आढळून आल्यास, भारतीय दंड संहिता अन्वये आणि/किंवा संबंधित कायद्यानुसार माझ्यावर खटला भरला जाईल व त्यानुसार मी शिक्षेस पात्र राहीन याची मला पूर्ण जाणीव आहे.
                  </p>{" "}
                </div>
              </div>

            <div style={{display: "flex", justifyContent: "space-between"}}>
             <div>
             <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}> ठिकाण:-……………….</p>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}> दिनांक:-……………… </p>
                </div>
              </div>
             </div>

             <div>
             <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginRight: "80px" }}> अर्जदाराची सही:-……………..</p>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginRight: "80px" }}> अर्जदाराचे नाव:-…………….. </p>
                </div>
              </div>
             </div>
             </div>

            </div>
          </div>
        </div>
      </>
      </div>
      <br />

      

      <div className={styles.btn}>
           
        <Grid container sx={{
          display:"flex",
          justifyContent: "space-around",
          alignItems: "center"
        }}>
          <Grid item>
            <Button
              type="primary"
              variant="contained"
              onClick={() => {
                handleClose();
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </Grid>

          <Grid item >
            <Button
              type="primary"
              variant="contained"
              onClick={() => {
                handleClose();
                setSelfAttestationFlag(true);
              }}
            >
              <FormattedLabel id="agreeAndProceed" />
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Index;
