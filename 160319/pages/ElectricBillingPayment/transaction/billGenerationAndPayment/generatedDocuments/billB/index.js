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
  console.log("connectionData", componentRef);

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
  const [selectedObject, setSelectedObject] = useState();
  const [work, setWork] = useState();

  //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
  let approvalId = router?.query?.id;
  console.log("service123", approvalId);
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
                <ComponentToPrintBillB connectionData={connectionData} billData={billData} ref={componentRef} />
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

                        router.push(`/ElectricBillingPayment/transaction/billGenerationAndPayment/billGeneration`)                    }}
                >
                    Exit
                </Button>
            </div>
        </>
  );
};

class ComponentToPrintBillB extends React.Component {
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
                    <b>विभागासाठी :</b>
                    लेखाशाखेसाठी
                  </h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>स्थायी समिती / म.न.पा. मंजुरी ठराव क्रं.</h4>

                  <h4 style={{ marginLeft: "80px" }}>दिनांक:-</h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>मा. आयुक्त यांचा निर्णय</h4>

                  <h4 style={{ marginLeft: "80px" }}>दिनांक:-</h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>
                    मालाची तपासणी केली असुन ती बिलात दाखविलेली रक्कम रुपये आदेशाप्रमाणे बरोबर आहे.
                  </h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>भांडारपाल / लेखापाल</h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh", marginBottom: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>
                    प्रदानार्थ मंजूर र.रु. <b>{"1630.0"}</b> अक्षरी <b>{"एक हजार सहाशे तीस "}</b>रुपये
                  </h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>
                    <b>लेखापाल / लेखाधिकारी</b>
                  </h4>
                </div>
              </div>
            </div>

            <div className={styles.date7} style={{ marginTop: "2vh" }}>
              <div className={styles.date8}>
                <div className={styles.add7}>
                  <h5>
                    <b>कार्यकारी अभियंता(वि)</b>
                  </h5>
                  <h5>म.न.पा.</h5>
                </div>
              </div>
            </div>

            <hr
              style={{ marginLeft: "80px", marginRight: "80px", height: "3px", backgroundColor: "black" }}
            />

            {/********** Section 2 **************/}

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>
                    <b>लेखाशाखेसाठी</b>
                  </h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>म.न.पा. आदेशाप्रमाणे माल मिळाला. दाखला पाहीला</h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>बिलाची सांख्यिकी तपासणी केली असे</h4>
                </div>
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>
                    रक्कम रुपये <b>{"1630.0"} </b>अक्षरी <b>{"एक हजार सहाशे तीस"}</b> रुपये अदा करणेस हरकत
                    वाटत नाही.
                  </h4>
                </div>
              </div>
            </div>

            <div className={styles.date1}>
              <h4 style={{ marginLeft: "80px" }}>
                <b>लिपीक</b>
              </h4>
              <h4>
                <b>लेखापाल</b>
              </h4>
              <h4 style={{ marginRight: "80px" }}>
                <b>शाखाधिकारी</b>
              </h4>
            </div>

            <hr
              style={{ marginLeft: "80px", marginRight: "80px", height: "3px", backgroundColor: "black" }}
            />

            {/*********** Section 3 ****************/}

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}>
                    रक्कम रुपये <b>{"16300"}</b> फक्त अदा करावे.
                  </h4>
                </div>
              </div>
            </div>

            <div className={styles.date7} style={{ marginTop: "6vh" }}>
              <div className={styles.date8}>
                <div className={styles.add7}>
                  <h5>
                    <b>लेखाधिकारी / मुख्यलेखापाल</b>
                  </h5>
                </div>
              </div>
            </div>

            <hr
              style={{ marginLeft: "80px", marginRight: "80px", height: "3px", backgroundColor: "black" }}
            />

            {/*********** Section 4 ****************/}

            <div className={styles.date4} style={{ marginBottom: "2vh" }}>
              <div className={styles.date2}>
                <p style={{ marginLeft: "80px", marginRight: "40px" }}>
                  {"  "}
                  महानगरपालिकेकडून रक्कम रुपये <b>{"1630.0"}</b> अक्षरी <b>{"एक हजार सहाशे तीस"}</b> रुपये फक्त धनादेश क्रमांक <b>{"1213"}</b> दिनांक <b>{"25/06/2021"}</b> नुसार मिळाले.
                </p>{" "}
              </div>
            </div>

            <div className={styles.date7}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "80px" }}><b>धनादेश घेणा-याची सही</b></h4>
                </div>
              </div>
            </div>

            <div className={styles.date7} style={{ marginTop: "6vh" }}>
              <div className={styles.date8}>
                <div className={styles.add7}>
                  <h5>
                    <b>महानगरपालिका</b>
                  </h5>
                  <h5>
                    <b>पिपरी ४११०१८.</b>
                  </h5>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      </>
    );
  }
}

export default Index;
