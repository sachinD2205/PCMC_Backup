import React, { useEffect, useRef, useState } from "react";
import router from "next/router";
import Head from "next/head";
import styles from "./petLicense.module.css";
import URLs from "../../../../URLS/urls";
import sweetAlert from "sweetalert";

import { Button, Paper } from "@mui/material";
import Image from "next/image";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { ExitToApp, MoreTimeRounded, Print } from "@mui/icons-material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
const Index = () => {
  const [applicationDetails, setApplicationDetails] = useState({});
  const [date, setDate] = useState("");
  const [petBreeds, setPetBreeds] = useState([
    {
      id: 1,
      breedNameEn: "",
      breedNameMr: "",
      petAnimalKey: "",
    },
  ]);
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: applicationDetails.petName + " License",
  });

  useEffect(() => {
    setDate(moment(new Date()).format("DD-MM-YYYY"));

    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setPetBreeds(
        res.data.mstAnimalBreedList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
          petAnimalKey: j.petAnimalKey,
        })),
      );
    });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      axios
        .get(`${URLs.VMS}/trnRenewalPetLicence/getById?id=${router.query.id}`)
        .then((res) => {
          if (res.data.status != "License Generated") {
            axios
              .post(`${URLs.VMS}/trnRenewalPetLicence/save`, { ...res.data, status: "License Generated" })
              .then((response) => {
                console.log("License Generated: ", response.data);
              })
              .catch((error) => {
                console.log("error: ", error);
                sweetAlert({
                  title: "ERROR!",
                  text: `${error}`,
                  icon: "error",
                  buttons: {
                    confirm: {
                      text: "OK",
                      visible: true,
                      closeModal: true,
                    },
                  },
                  dangerMode: true,
                });
              });
          }

          let yearOfRenewal = Number(moment(res.data.applicationDate).format("YYYY")) + 1;
          let dOfRenewal = Number(moment(res.data.applicationDate).format("DD")) - 1;

          setApplicationDetails({
            ...res.data,
            animalBreed: petBreeds.find((obj) => obj.id === res.data.animalBreedKey)?.breedNameEn,
            applicationDate: moment(res.data.applicationDate).format("DD-MM-YYYY"),
            // dateOfRenewal: dOfRenewal + moment(res.data.applicationDate).format("-MM-") + yearOfRenewal,
            dateOfRenewal: moment(res.data.dateOfExpiry).subtract(1, "day").format("DD-MM-YYYY"),
          });
        })
        .catch((error) => {
          console.log("error: ", error);
          sweetAlert({
            title: "ERROR!",
            text: `${error}`,
            icon: "error",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            dangerMode: true,
          });
        });
    }
  }, [petBreeds]);

  return (
    <>
      <Head>
        <title>Pet License</title>
      </Head>
      <Paper className={styles.main}>
        {applicationDetails && (
          <>
            <div className={styles.licenseWrapper} ref={componentRef}>
              {/* Header */}
              <div className={styles.header}>
                <Image src={"/logo.png"} width={80} height={80} />
                <div className={styles.centerHeader}>
                  <label>पिंपरी चिंचवड महानगरपालिका</label>
                  <label>पशु वैद्यकीय विभाग</label>
                  <label>पाळीव प्राणी परवाना</label>
                </div>
                {
                  // @ts-ignore
                  applicationDetails.petAnimalPhoto && (
                    <img
                      // @ts-ignore
                      src={`/aazadiKaAmrutMahotsav.png`}
                      width={120}
                      height={65}
                      alt="75amrutMahotsav"
                    />
                  )
                }
              </div>
              {/* Sub-Header */}
              <div className={styles.subHeader1}>
                <label> पाळीव प्राणी परवाना क्रमांक: </label>
                {/* <span>DG/2023/148</span> */}
                <span>
                  {
                    // @ts-ignore
                    applicationDetails.licenseNo
                  }
                </span>
              </div>
              <div className={styles.subHeader2}>
                <label>
                  {
                    "(मुंबई प्रांतिक म.न.पा. अधिनियम १९४९, प्रकरण परिशिष्ट १४, नियम २२ (अ) सह कलम ३८६ (१) सह कर उपविधी नियम ६ अन्वये )"
                  }
                </label>
              </div>
              {/* Details */}
              <table className={styles.tableWrap}>
                <tr className={styles.tableRow}>
                  <td className={styles.tableHeader} colSpan={2}>
                    अर्जदाराची माहिती
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"मालकाचे नाव/(Owner Name)"}</td>
                  <td className={styles.tableData2} colSpan={2}>
                    {
                      // @ts-ignore
                      applicationDetails.ownerName
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"संपूर्ण पत्ता/(Detail Address)"}</td>
                  <td className={styles.tableData2} colSpan={2}>
                    {
                      // @ts-ignore
                      applicationDetails.addrFlatOrHouseNo
                    }
                    {", "}
                    {
                      // @ts-ignore
                      applicationDetails.addrBuildingName
                    }
                    {", "}
                    {
                      // @ts-ignore
                      applicationDetails.detailAddress
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"भ्रमणध्वनी क्रमांक/(Mobile No.)"}</td>
                  <td className={styles.tableData2} colSpan={2}>
                    {
                      // @ts-ignore
                      applicationDetails.ownerMobileNo
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"ई-मेल आयडी/(E-mail ID)"}</td>
                  <td className={styles.tableData2} colSpan={2}>
                    {
                      // @ts-ignore
                      applicationDetails.ownerEmailId
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableHeader} colSpan={2}>
                    पाळीव प्राण्याची माहिती
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"प्राण्याचं नाव/(Pet Name)"}</td>
                  <td className={styles.tableData2}>
                    {
                      // @ts-ignore
                      applicationDetails.petName
                    }
                  </td>
                  <td className={styles.tableHeader} style={{ fontSize: "small" }}>
                    {"प्राण्याचं चित्र/(Pet Photo)"}
                  </td>
                </tr>

                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"प्राण्याची जात/(Pet Breed)"}</td>
                  <td className={styles.tableData2}>
                    {
                      // @ts-ignore
                      applicationDetails.animalBreed
                    }
                  </td>
                  <td rowSpan={5}>
                    <img
                      // @ts-ignore
                      src={`${URLs.CFCURL}/file/preview?filePath=${applicationDetails.petAnimalPhoto}`}
                      // height={65}
                      // width={65}
                      height={160}
                      width={160}
                      alt="petPhoto"
                    />
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"रंग/(Color)"}</td>
                  <td className={styles.tableData2}>
                    {
                      // @ts-ignore
                      applicationDetails.animalColor
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"वय/(Age)"}</td>
                  <td className={styles.tableData2}>
                    {
                      // @ts-ignore
                      applicationDetails.animalAge
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"वजन/(Weight)"}</td>
                  <td className={styles.tableData2}>
                    {
                      // @ts-ignore
                      applicationDetails.animalWeight
                    }{" "}
                    kg
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"लिंग/(Gender)"}</td>
                  <td className={styles.tableData2}>
                    {
                      // @ts-ignore
                      applicationDetails.animalGender
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableHeader} colSpan={2}>
                    परवाना विषयक माहिती
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"परवाना नोंदणी दिनांक/(Date of License)"}</td>
                  <td className={styles.tableData2} colSpan={2}>
                    {
                      // @ts-ignore
                      applicationDetails?.applicationDate
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"कालबाह्यता दिनांक/(Date of Expiry)"}</td>
                  <td className={styles.tableData2} colSpan={2}>
                    {
                      // @ts-ignore
                      applicationDetails?.dateOfRenewal
                    }
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableHeader} colSpan={2}>
                    परवाना शुल्क
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"नवीन परवाना शुल्क/(New License Fees)"}</td>
                  <td className={styles.tableData2} colSpan={2}></td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"परवाना नुतनीकरण फी/(License Renewal Fees)"}</td>
                  <td className={styles.tableData2} colSpan={2}>
                    Rs. 50.00
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableData1}>{"परवाना विलंब दंड/(License Late Fine)"}</td>
                  <td className={styles.tableData2} colSpan={2}></td>
                </tr>
              </table>
              {/* Body */}
              <div className={styles.licenseBody}>
                <label>
                  श्री/श्रीमती.{" "}
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails.ownerName
                    }{" "}
                  </span>{" "}
                  राहणार{" "}
                  <span>
                    {" "}
                    {
                      // @ts-ignore
                      applicationDetails.addrFlatOrHouseNo
                    }
                    {", "}
                    {
                      // @ts-ignore
                      applicationDetails.addrBuildingName
                    }
                    {", "}
                    {
                      // @ts-ignore
                      applicationDetails.detailAddress
                    }
                  </span>{" "}
                  यांना पिंपरी चिंचवड महानगरपालिका हद्दीमध्ये, पाळीव प्राणी परवाना प्राप्त दिनांकापासून १
                  वर्षासाठी त्यांनी त्यांच्या अर्जामध्ये वर्णन केलेला प्राणी ताब्यात ठेवणेस (पाळणेस),
                  महानगरपालिकेच्या पशुवैद्यकीय विभागाने निश्चित केलेल्या अटी व शर्तीचे पालन करणेचे अधिन राहून
                  परवानगी देणेत येत आहे. परवाना धारकाने परवानगी दिलेल्या वर्षांमध्ये सदरचा परवाना मा. आयुक्त
                  यांनी किंवा प्राधिकृत केलेल्या कोणत्याही अधिकाऱ्याने मागणी केलेस तो हजर केले पाहिजे.
                </label>
              </div>
              {/* Signature */}
              <div className={styles.signatureWrapper}>
                <img src={"/qrcode1.png"} alt="" width={150} height={150} />

                <Image src="/pawPrints.png" alt="" height={200} width={250} />
                <div className={styles.signatureDetails}>
                  <label>{"(डॉ. अरुण मारुती दगडे)"}</label>
                  <label>पशुवैद्यकीय अधिकारी</label>
                  <label>पिंपरी चिंचवड महानगरपालिका-पिंपरी, १८</label>
                </div>
              </div>
              {/* Date */}
              <div className={styles.endDate}>
                <label>
                  Date: <span>{date}</span>
                </label>
              </div>
            </div>
          </>
        )}

        <div className={styles.buttons}>
          <Button variant="contained" endIcon={<Print />} onClick={handleToPrint}>
            <FormattedLabel id="print" />
          </Button>
          <Button
            variant="outlined"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              // router.push(`/veterinaryManagementSystem/transactions/renewalPetLicense/hod`);
              router.back();
            }}
          >
            <FormattedLabel id="exit" />
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
