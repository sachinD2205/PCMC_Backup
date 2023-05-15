import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import router from "next/router";
import styles from "./goshwara.module.css";
import axios from "axios";
import urls from "../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { useSelector } from "react-redux";

const Index = () => {
  const language = useSelector((state) => state.labels.language);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
  const [selectedObject, setSelectedObject] = useState();
  const [work, setWork] = useState();
  const [newsPaper, setNewsPaper] = useState();

  //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
  let approvalId = router?.query?.id;
  console.log("service123", approvalId);
  useEffect(() => {
    getNewsPaper();
  }, []);
  const getNewsPaper = () => {
    axios.get(`${urls.NRMS}/newsStandardFormatSizeMst/getAll`).then((r) => {
      console.log(
        "getZone.data",
        r?.data?.newsStandardFormatSizeMstList?.map((r, i) => ({
          standardFormatSize: r.standardFormatSize,
          rotationGroupKey: r.rotationGroupKey,
          rotationSubGroupKey: r.rotationSubGroupKey,
          newspaperLevel: r.newspaperLevel,
        })),
      );
      setNewsPaper(
        r?.data?.newsStandardFormatSizeMstList?.map((r, i) => ({
          id: r.id,
          newspaperLevel: r.newspaperLevel,
          rotationGroupKey: r.rotationGroupKey,
          rotationSubGroupKey: r.rotationSubGroupKey,
          standardFormatSize: r.standardFormatSize,

          // newspaperName: r.newspaperName,
          // newspaperAgencyName: r.newspaperAgencyName,
        })),
      );
    });
  };

  const user = useSelector((state) => state.user.user);

  console.log("user", user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  useEffect(() => {
    axios.get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${router?.query?.id}`).then((r) => {
      console.log("selectedobject", r.data);
      setSelectedObject(r.data);
    });
  }, []);
  console.log("selectedobject", selectedObject);
  return (
    <>
      <div>
        <ComponentToPrint selectedObject={{ ...selectedObject, language }} ref={componentRef} />
      </div>
      <br />
      <div className={styles.btn}>
        <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            swal("Exit!");
            router.push({
              pathname: "/nrms/transaction/AdvertisementRotation",
            });
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
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
                <h2>
                  <b>पिंपरी चिंचवड महानगरपालिका, पिंपरी,पुणे</b>
                </h2>
                <h3>
                  <b>माहिती व जनसंपर्क विभाग </b>
                </h3>
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>दुरध्वनी क्रमांक:020-67333333/1528/1534</b>
                    </h5>
                    <h5>
                      <b>E-mail :pro@pcmcindia.gov.in</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फॅक्स क्रमांक:27425600</b>
                    </h5>
                    <h5>
                      <b> इमेल: egov@pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div>
              </div>
              <div className={styles.logo1}>
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </div>
            </div>
            <div>
              <hr />
            </div>

            <div className={styles.two}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "490px" }}>
                    <b>ऑर्डर क्रमांक : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{this?.props?.selectedObject?.releasingOrderNumber}</h4>
                </div>
              </div>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>प्रति</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{/* {this?.props?.selectedObject?.id} */}</h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>मा. जाहिरात व्‍यवस्‍थापक </b>
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

              {/* subject */}

              <div className={styles.date5} style={{ marginBottom: "2vh" }}>
                <div className={styles.date6}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>विषय- जाहिरात प्रसिद्धीबाबात </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {/* {' ' +
                                                moment(
                                                    this?.props?.selectedObject?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                    </b>{" "}
                  </h4>
                </div>
              </div>

              {/* 
                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <h4 style={{ marginLeft: '40px' }}>
                                        {' '}
                                        <b>अर्जदाराचे नाव : </b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}>
                                        {' ' +
                                            this?.props?.dataa?.afNameMr +
                                            ' ' +
                                            this?.props?.dataa?.alNameMr}
                                    </h4>
                                </div>
                            </div> */}

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "60px" }}>
                    {" "}
                    <b>महोदय, </b>
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

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    {" "}
                    पिंपरी चिंचवड महानगरपालिकेकडील खालील जाहिरात आपल्या वर्तमानपत्रात प्रसिद्ध करण्यात यावी.
                  </p>{" "}
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

              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> जाहिरात क्र :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>{this?.props?.selectedObject?.newsPublishRequestNo}</h4>
                  {/* {console.log("XCV",priority)} */}
                </div>
              </div>

              {/* department name */}
              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> विभागाचे नाव :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.language == "en"
                      ? this?.props?.selectedObject?.departmentName
                      : this?.props?.selectedObject?.departmentNameMr}
                  </h4>
                </div>
                {/* department name */}
              </div>
              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> कामाचा तपशिल :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.typeOfNews == 1
                      ? this?.props?.selectedObject?.workName
                      : this?.props?.selectedObject?.newsAdvertisementSubject}
                  </h4>
                  {/* {console.log("XCV",priority)} */}
                </div>

                {/* department name */}
              </div>

              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> प्रसिध्दी तारीख :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {/* {this?.props?.selectedObject?.fromDate?.split("T")[0]} */}
                    {moment(this?.props?.selectedObject?.newsPublishDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                  </h4>
                  {/* {console.log("XCV",priority)} */}
                </div>

                {/* department name */}
              </div>

              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> प्रसिद्धीचा स्तर :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.language == "en"
                      ? this?.props?.selectedObject?.priorityName
                      : this?.props?.selectedObject?.priorityNameMr}
                  </h4>
                </div>

                {/* department name */}
              </div>

              {/* details */}
              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    {" "}
                    तरी उपरोक्त प्रमाणे सदरची जाहिरात कमीत कमी आकारमानात प्रसिद्ध करावी. जाहिरात बिलाची अदायगी
                    जाहिरात रोटेशन धोरण सन २०१९-२० नुसार करण्यात येईल. तसेच सदर जाहिरातीचे बिल सहाय्यक आयुक्त,
                    माहिती व जनसंपर्क विभाग, पिंपरी चिंचवड महानगरपलिका यांच्या नावे दोन प्रतीमध्ये माहिती व
                    जनसंपर्क विभागात जाहिरात प्रसिद्धी दिनांकापासून १५ दिवसाचे आत सादर करावे
                  </p>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b></b>
                  </h4>
                </div>
              </div>

              <div className={styles.date7} style={{ marginBottom: "2vh" }}>
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
                  <h4 style={{ marginLeft: "10px" }}>
                    <b></b>
                  </h4>
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
