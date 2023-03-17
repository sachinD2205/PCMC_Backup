import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "../goshwara.module.css";
import axios from "axios";
import urls from "../../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";

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
  useEffect(() => {
    // getWard();
    // getAllTableData();
    // getDepartment();
    // getRotationGroup();
    // getRotationSubGroup();
    // getNewsPaper();
    // getDate();
  });

  useEffect(() => {
    axios
      // .get(
      //   `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}`,
      // )
      // .get(
      //   `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getById?applicationId=${router?.query?.id}`,
      // )
      .get(`${urls.NRMS}/trnNewsPublishRequest/getAll`)
      //   .get(
      //     `${urls.MR}/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${router?.query?.id}&serviceId=${router.query.serviceId}`,
      //   )
      .then((r) => {
        // setDataa(res.data.trnNewsPublishRequestList)
        // console.log('board data', res.data.trnNewsPublishRequestList)
        // dataa && dataa.map((each) => {
        //     if (each.id == approvalId) {
        //       setSelectedObject(each)
        //     }
        //   }

        //   )
        let result = r.data.trnNewsPublishRequestList;
        console.log("getAllTableData", result);
        result &&
          result.map((each) => {
            if (each.id == approvalId) {
              setSelectedObject(each);
            }
          });
      });
  });
  console.log("selectedobject", selectedObject);

  // view
  return (
    <>
      <div>
        <ComponentToPrintOfficialNotesheet connectionData={connectionData} billData={billData} ref={componentRef} />
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

class ComponentToPrintOfficialNotesheet extends React.Component {
  render() {
    const showDateFormat = (date) => {
      let formattedDate = date?.split("T");
      return formattedDate ? formattedDate[0] : "-";
    };

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

              {/********** LETTER HEADER **************/}

              <div className={styles.date7}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>कार्यालयीन टिपणी</b>
                    </h4>
                  </div>
                </div>

                <div className={styles.date8}>
                  <div className={styles.add7} style={{ marginBottom: "2vh" }}>
                    <h4 style={{ marginRight: "40px" }}>
                      <b>दिनांक :</b>
                      {this?.props?.billData?.currReadingDate}

                    </h4>
                  </div>
                </div>
              </div>{console.log("dataaa",this?.props)}

              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6}>
                  <h4>
                    {" "}
                    <b>विषय : </b> येथील वीजमीटरचे वीजबील म.रा.वि.वि.क.ली. यांना अदा करणेबाबत.(माहे मे 2021)
                  </h4>{" "}
                </div>
              </div>

              {/*********** LETTER TO ****************/}

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "80px" }}>
                    {" "}
                    <b>मा. सविनय सादर, </b>
                  </h4>{" "}
                </div>
              </div>

              {/*********** LETTER BODY ****************/}

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    {"  "}
                    येथील वीजमीटरचे वीजबील या कार्यालयास प्राप्त झाले असून सदर बीलाची तांत्रीक तपासणी केली
                    असता मीटर ग्राहक क्रमांक व देय रक्कम म.रा. वि.वि.के.सी. वे नियमाप्रमाणे योग्य आहेत.
                    प्राप्त बीलाचा तपशित खालीलप्रमाणे.
                  </p>{" "}
                </div>
              </div>

              {/*********** LETTER TABLE ****************/}

              <div className={styles.table} style={{ marginBottom: "2vh" }}>
              <table>
                <tr>
                  <th>अ.क्र.</th>
                  <th>विजमिटरचे ठिकाण</th>
                  <th>ग्राहक क्रमांक</th>
                  <th>मीटर क्रमांक</th>
                  <th>देय रक्कम</th>
                </tr>
                <tr>
                  <td>{"1"}</td>
                  <td>{this?.props?.connectionData?.consumerAddress}</td>
                  <td>{this?.props?.connectionData?.consumerNo}</td>
                  <td>{this?.props?.connectionData?.meterNo}</td>
                  <td>{this?.props?.billData?.toBePaidAmount}</td>
                </tr>
                <tr>
                  <td>{" "}</td>
                  <td>{" "}</td>
                  <td>{" "}</td>
                  <td><b>एकूण रक्कम रुपये</b></td>
                  <td><b>{this?.props?.billData?.toBePaidAmount}</b></td>
                </tr>
              </table>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    {" "}
                    येथील वीजमीटरचे वीजबील म.रा. वि.वि.के.सी. यांना अदा करणेबाबत.
                  </p>{" "}
                </div>
              </div>

             
                <div className={styles.date5}>
                  <div>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>रक्कम रुपये:</b>
                      {this?.props?.billData?.toBePaidAmount}
                    </h4>
                  </div>
                  
                  <div>
                    <h4 style={{ marginLeft: "80px"}} >
                      <b>इतकी तरतुद सन :</b>
                      {/* {this?.props?.connectionData} */}
                    </h4>
                  </div>
                  </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    {" "}
                    अंदाजपत्रकात केलेली आहे.व रक्कम रु. <b>{this?.props?.billData?.toBePaidAmount}</b>{"  "}
                    इतकी तरतुद शिल्लक आहे. उपरोक् ठिकाणांचा विजपुरवठा म.रा. वि. वि. के.सी. कडून खंडीत केला जाऊ
                    नये यासाठी प्राप्त बील अदा करणे आवश्यक आहे. तथापि, सदर बील अदा करणेसाठी मंजुरी असल्यास
                    सोबतच्या आदेशावर स्वाक्षरी होणे.
                  </p>{" "}
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}> सविनय सादर,</p>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}> लिपिक</p>
                </div>
              </div>

              {/*********** LETTER SIGNATURE ****************/}

              {/* <div className={styles.date7} style={{ marginBottom: "2vh" }}>
                <div className={styles.date8}>
                  <div className={styles.add7}>
                    <h5>
                      <b>सही/-</b>
                    </h5>
                    <h5>सहाय्यक आयुक्त</h5>
                    <h5>माहिती व जनसंपर्क विभाग</h5>
                    <h5>पिंपरी चिंचवड महानगरपालिका</h5>
                    <h5>पिंपरी ४११ ०१८</h5>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
