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
  console.log("selectedobject", connectionData, billData);

  // view
  return (
    <>
      <div>
        <ComponentToPrintBillA connectionData={connectionData} billData={billData} ref={componentRef} />
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

class ComponentToPrintBillA extends React.Component {
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

            {/* <div className={styles.foot}>
           
           
            
          </div> */}
            {/* <h4>
              {' '}
              <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
            </h4> */}

            {/* <h4>
              {' '}
              <b>महाराष्ट्र, भारत</b>
            </h4> */}
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
          {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div >
              <h4>
                {' '}
                <b>दिनांक :</b>
              </h4>{' '}
              <h4 style={{ marginLeft: '10px' }}>
                <b>{this?.props?.dataa?.payment?.receiptDate}</b>
              </h4>
            </div>

            <div >
              <h4>
                {' '}
                <b>वेळ :</b>
              </h4>{' '}
              <h4 style={{ marginLeft: '10px' }}>
                {this?.props?.dataa?.payment?.receiptTime}
              </h4>
            </div>
          </div>
          <div className={styles.date2}>
            <h4 style={{ marginLeft: '40px' }}>
              {' '}
              <b>पावती क्रमांक :</b>
            </h4>{' '}
            <h4 style={{ marginLeft: '10px' }}>
              <b>{this?.props?.dataa?.payment?.receiptNo}</b>
            </h4>
          </div> */}

          {/********** LETTER HEADER **************/}

          <div className={styles.date7}>
            <div className={styles.date4} style={{ marginTop: "2vh" }}>
              <div className={styles.date3}>
                <h4 style={{ marginLeft: "80px" }}>
                  <b>१) मा.कार्यकारी अभियंता (वि), विदयुत यांचेकडील दिनांक {'---'} रोजीची मंजुर टिपणी.</b>
                </h4>
              </div>
            </div>
          </div>

          <div className={styles.date7}>
            <div className={styles.date4} style={{ marginTop: "2vh" }}>
              <div className={styles.date3}>
                <h4 style={{ marginLeft: "80px" }}>
                  <b>२) म.रा.वि.वि.कंपनी लि. यांचेकडील प्राप्त बील माहे :</b>
                </h4>
              </div>
            </div>
          </div>

          <div className={styles.date7}>
            <div className={styles.date4} style={{ marginTop: "2vh" }}>
              <div className={styles.date3}>
                <h4 style={{ marginLeft: "80px" }}>
                  <b>३) मा.आयुक्त यांचेकडील अधिकार प्रदान आदेश क्र. लेखा/कावि/४१४/२०१८/, दि {'23/04/2018'}</b>
                </h4>
              </div>
            </div>
          </div>

          
          <div className={styles.date7} style={{ marginBottom: "2vh", marginTop: "2vh" }}>
            <div className={styles.date8}>
              <div className={styles.add7}>
                <h5>
                  <b>महानगरपालिका</b>
                </h5>
                <h5>पिंपरी - १८</h5>
                <h5>क्र.:  /वि/जा/</h5>
                <h5> दिनांक:- <b>
                {`  ${day}/${month}/${year}`}
                </b></h5>
              </div>
            </div>
          </div>

          {/********** LETTER SUBJECT **************/}

          <div className={styles.date5}>
            <div className={styles.date6}>
              <h4>
                {" "}
                <b>विषय : </b> येथील वीजमीटरचे वीजबिल म.रा.वि.वि.कं.ली. यांना अदा करणेबाबत.
              </h4>{" "}
              
            </div>
          </div>

          {/*********** LETTER TO ****************/}

          <div className={styles.date4}>
            <div className={styles.date2}>
              <h4 style={{ marginLeft: "80px" }}>
                {" "}
                <b>आदेश, </b>
              </h4>{" "}
              <h4 style={{ marginLeft: "10px" }}>
                <b>
                  {" "}
                  {/* {' ' +
                                            moment(
                                                this?.props?.selectedObject?.createDtTm,
                                                'YYYY-MM-DD',
                                            ).format('DD-MM-YYYY')} */}
                </b>{" "}
                {/* {this?.props?.dataa?.applicationDate} */}
              </h4>
            </div>
          </div>

          {/*********** LETTER BODY ****************/}

          <div className={styles.date4} style={{ marginBottom: "2vh" }}>
            <div className={styles.date2}>
              <p style={{ marginLeft: "80px", marginRight: "40px" }}>
                {"  "}
                येथील वीजमीटरचे वीजबिल या कार्यालयास प्राप्त झाले असुन, सदर बिलांची तांत्रीक तपासणी केली असता मीटर ग्राहक क्रमांक व देय रक्कम म.रा.वि.वि.कं.लि. चे नियमाप्रमाणे योग्य आहेत. प्राप्त बिलांचा तपशिल खालीलप्रमाणे.
              </p>{" "}
            </div>
          </div>

          {/*********** LETTER TABLE ****************/}

          <div className={styles.table} style={{ marginBottom: "2vh" }}>
          <table style={{width:"100%"}}>
            <tr>
              <th>अ.क्र.</th>
              <th>विजमिटरचे ठिकाण</th>
              <th>ग्राहक क्रमांक</th>
              <th>मीटर क्रमांक</th>
              <th>निव्वळ देय रक्कम</th>
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

          <div className={styles.date4}>
            <div className={styles.date2}>
              <p style={{ marginLeft: "80px" }}>
              उपरोक्त ठिकाणी म.न.पा. तर्फे विजवापर होत असलेले सदरचे बिल म.रा.वि.वि.क. लि.स अदा करणे आवश्यक आहे.
              </p>{" "}
            </div>
          </div>

          <div className={styles.date4}>
            <div className={styles.date2}>
              <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                {" "}
                सबब, मी, कार्यकारी अभियंता (वि), विदयुत, पिंपरी चिंचवड महानगरपालिका, या आदेशान्वये म.रा.वि.वि.कं.लि.स रक्कम रुपये <b>{this?.props?.billData?.toBePaidAmount}</b>  अक्षरी रक्कम रुपये <b>{toWords.convert(this?.props?.billData?.toBePaidAmount)}</b>रुपये फक्त म.रा.वि.वि.कं.लि.स अदा करण्यास या आदेशान्वये मान्यता देण्यात येत आहे.
              </p>{" "}
            </div>
          </div>

            {/*********** LETTER SIGNATURE ****************/}

            <div className={styles.date7}>
            <div className={styles.date8}>
              <div className={styles.add7}>
                <h5>
                  <b>कार्यकारी अभियंता (वि</b>
                </h5>
                <h5>महानगरपालिका</h5>
              </div>
            </div>
          </div>

          <div className={styles.date4}>
            <div className={styles.date2}>
              <p style={{ marginLeft: "80px" }}>प्रत-</p>
            </div>
          </div>

          <div className={styles.date4} style={{ marginBottom: "2vh" }}>
            <div className={styles.date2}>
              <p style={{ marginLeft: "80px" }}> १. लेखा विभाग</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </>
)
  }
}

export default Index;
