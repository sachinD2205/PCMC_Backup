import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "../goshwara.module.css";
import axios from "axios";
import urls from "../../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { ToWords } from "to-words";


// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = ({ connectionData, billData, componentRef }) => {

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
  const [selectedObject, setSelectedObject] = useState();
  const [work, setWork] = useState();

  //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
  let approvalId = router?.query?.id;
  console.log("service123", approvalId);

  console.log("selectedobject", selectedObject);

  // view
  return (
    <>
      <div>
        <ComponentToPrintFormB connectionData={connectionData} billData={billData} ref={componentRef} />
      </div>
      <br />

      <div className={styles.btn}>
        {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                    onClick={handlePrint}
                >
                    print
                </Button> */}

        {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                >
                    Digital Signature
                </Button> */}

        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            // swal(
            //     'Exit!',
            //     'जारी केलेल्या प्रमाणपत्र प्रत घेण्यास झोन ऑफिस ला भेट दया',
            //     'success',
            // )
            // const record = selectedObject;

            // router.push({
            //   pathname: '/nrms/transaction/AdvertisementRotation/view',
            //   query: {
            //     pageMode: "View",
            //     ...record,

            //   },
            // });

            router.push(`/ElectricBillingPayment/transaction/billGenerationAndPayment/billGeneration`);
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};

class ComponentToPrintFormB extends React.Component {
  render() {
    const toWords = new ToWords({ localeCode: "mr-IN" });
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका </b>
                    </h5>
                    <h5>
                      {" "}
                      <b>मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</b>
                    </h5>
                    <h5>
                      <b> महाराष्ट्र, भारत</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फोन क्रमांक:91-020-2742-5511/12/13/14</b>
                    </h5>
                    <h5>
                      <b> इमेल: egov@pcmcindia.gov.in</b>
                    </h5>
                    <h5>
                      <b>/ sarathi@pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div>
              </div>
              <div className={styles.logo1}>
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                {/* <b>पावती</b> */}
                <h5>{/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}</h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5} style={{ marginBottom: "6vh", marginTop: "2vh" }}>
                <div className={styles.date6}>
                  <h4>
                    {" "}
                    <b>विषय : </b> येथील वीजमीटरचे वीजबील म.रा.वि.वि.कं.ली.यांना अदा करणेबाबत.
                  </h4>
                </div>
              </div>

              {/*********** LETTER TABLE ****************/}

              <div className={styles.table} style={{ marginBottom: "2vh" }}>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>अ.क्र.</th>
                    <th>ग्राहक क्रमांक</th>
                    <th>मीटर क्रमांक</th>
                    <th>युनिट</th>
                    <th>रक्कम रुपये</th>
                  </tr>
                  <tr>
                    <td>{"1"}</td>
                    <td>{this?.props?.connectionData?.consumerNo}</td>
                    <td>{this?.props?.connectionData?.meterNo}</td>
                    <td>{this?.props?.billData?.consumedUnit}</td>
                    <td>{this?.props?.billData?.toBePaidAmount}</td>
                  </tr>
                  <tr>
                    <td> </td>
                    <td> </td>
                    <td>
                      <b>एकूण</b>
                    </td>
                    <td>
                      <b>{this?.props?.billData?.consumedUnit}</b>
                    </td>
                    <td>
                      <b>{this?.props?.billData?.toBePaidAmount}</b>
                    </td>
                  </tr>
                </table>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    {" "}
                    दिनांक 
                    <b>
                    {` ${day}/${month}/${year}`}
                    </b>
                  </p>
                </div>
              </div>

              <div className={styles.date7} style={{ marginTop: "2vh", marginBottom: "6vh" }}>
                <div className={styles.date8}>
                  <div className={styles.add7}>
                    <h5>
                      <b>कार्यकारी अभियंता(वि)</b>
                    </h5>
                    <h5>म.न.पा.</h5>
                  </div>
                </div>
              </div>

              {/* details */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
