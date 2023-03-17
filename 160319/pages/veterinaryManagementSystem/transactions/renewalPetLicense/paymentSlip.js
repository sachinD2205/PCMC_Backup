import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import Image from "next/image";
import styles from "./paymentSlip.module.css";
import URLs from "../../../../URLS/urls";

import { Button, Paper } from "@mui/material";
import { ExitToApp, Print } from "@mui/icons-material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";

const Index = () => {
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Pet License Renewal Payment Slip",
  });

  // // @ts-ignore
  // const printByNameDao = useSelector((state) => state.user.user.userDao);
  // @ts-ignore
  const printByNameDao = useSelector((state) => state.user.user);
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [fiscalYear, setFiscalYear] = useState("");
  const [applicationDetails, setApplicationDetails] = useState({});
  const [petBreeds, setPetBreeds] = useState([
    {
      id: 1,
      breedNameEn: "",
      breedNameMr: "",
      petAnimalKey: "",
    },
  ]);

  useEffect(() => {
    let currentYear = Number(moment(new Date()).format("YYYY"));
    setFiscalYear(`${currentYear}-${currentYear + 1}`);

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
          setApplicationDetails({
            ...res.data,
            animalBreed: petBreeds.find((obj) => obj.id === res.data.animalBreedKey)?.breedNameEn,
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
        <title>Pet License Renewal Payment Slip</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.paymentWrapper} ref={componentRef}>
          <div className={styles.officeCopy}>
            <div className={styles.header}>
              <Image src={"/qrcode1.png"} width={60} height={60} />
              <div className={styles.centerHeader}>
                <h1>
                  <FormattedLabel id="pcmc" />
                </h1>
                <div className={styles.row}>
                  <div style={{ display: "flex", columnGap: 10 }}>
                    <label style={{ fontWeight: "bold" }}>
                      <FormattedLabel id="fiscalYear" />:
                    </label>
                    <span>{fiscalYear}</span>
                  </div>
                </div>
              </div>
              <Image src={"/logo.png"} width={70} height={70} />
            </div>

            <table className={styles.tableWrap}>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1} style={{ textAlign: "center" }} colSpan={5}>
                  <FormattedLabel id="officeCopy" />
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="receiptNo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="date" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="relatedTo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="cfcRefNo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="cfcCounterNo" />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>0000025</span>
                </td>
                <td className={styles.tableData2}>
                  <span>27/02/2023</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "Veterinary Management System" : "प.व्य.प्र"}</span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="receivedFrom" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{applicationDetails.ownerName}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="serviceName" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Pet License Renewal</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="narration" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Regarding Pet License Renewal Certificate </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="address" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {applicationDetails.addrFlatOrHouseNo}
                    {", "}
                    {applicationDetails.addrBuildingName}
                    {", "}
                    {applicationDetails.detailAddress}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="paymentMode" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="rupees" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="bankName" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="chequeNo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="chequeDate" />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>Paytm UPI</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
                <td className={styles.tableData2}>{/* <span>00000001548</span> */}</td>
                <td className={styles.tableData2}>{/* <span>01/02/2023</span> */}</td>
                <td className={styles.tableData2}>{/* <span>State Bank of India</span> */}</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="referenceNo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="date" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="details" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="payableAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="receivedAmount" />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>00001568</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY")}</span>
                </td>
                <td className={styles.tableData2}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* <span>{language === "en" ? "Certificate Fee" : "प्रमाणपत्र शुल्क"}</span> */}
                    <span>{language === "en" ? "Renewal Fee" : "नूतनीकरण शुल्क"}</span>
                  </div>
                </td>
                <td className={styles.tableData2}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* <span>{language === "en" ? "₹ 75.00" : "₹ ७५.००"}</span> */}
                    <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                  </div>
                </td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="payableAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="rebateAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="advanceAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="actualPayableAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="receivedAmount" />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
                <td className={styles.tableData2}>{/* <label>Rebate Amount/सूट रक्कम</label> */}</td>
                <td className={styles.tableData2}>{/* <label>Advance Amount/आगाऊ रक्कम</label> */}</td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>{<FormattedLabel id="totalAmount" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="amountInWords" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{language === "en" ? "Fifty rupees Only" : "पन्नास रुपये फक्त"}</span>
                </td>
                <td className={styles.tableData1} colSpan={3}>
                  <label style={{ marginBottom: 100 }}>{<FormattedLabel id="receiverSignature" />}:</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="remark" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails.scrutinyRemark
                    }
                  </span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={2}></td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="printDateAndTime" />}: </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="printBy" />}: </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {/* {language === "en"
                      ? printByNameDao?.firstNameEn +
                        " " +
                        printByNameDao?.middleNameEn +
                        " " +
                        printByNameDao?.lastNameEn
                      : printByNameDao?.firstNameMr +
                        " " +
                        printByNameDao?.middleNameMr +
                        " " +
                        printByNameDao?.lastNameMr} */}
                    {language === "en"
                      ? printByNameDao?.firstName +
                        " " +
                        printByNameDao?.middleName +
                        " " +
                        printByNameDao?.surname
                      : printByNameDao?.firstNamemr +
                        " " +
                        printByNameDao?.middleNamemr +
                        " " +
                        printByNameDao?.surnamemr}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div className={styles.divider}></div>
          <div className={styles.customerCopy}>
            <div className={styles.header}>
              <Image src={"/qrcode1.png"} width={60} height={60} />
              <div className={styles.centerHeader}>
                <h1>
                  <FormattedLabel id="pcmc" />
                </h1>
                <div className={styles.row}>
                  <div style={{ display: "flex", columnGap: 10 }}>
                    <label style={{ fontWeight: "bold" }}>
                      <FormattedLabel id="fiscalYear" />:
                    </label>
                    <span>{fiscalYear}</span>
                  </div>
                </div>
              </div>
              <Image src={"/logo.png"} width={70} height={70} />
            </div>

            <table className={styles.tableWrap}>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1} style={{ textAlign: "center" }} colSpan={5}>
                  <FormattedLabel id="customerCopy" />
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="receiptNo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="date" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="relatedTo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="cfcRefNo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="cfcCounterNo" />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>0000025</span>
                </td>
                <td className={styles.tableData2}>
                  <span>27/02/2023</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "Veterinary Management System" : "प.व्य.प्र"}</span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="receivedFrom" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{applicationDetails.ownerName}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="serviceName" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Pet License Renewal</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="narration" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Regarding Pet License Renewal Certificate </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="address" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {applicationDetails.addrFlatOrHouseNo}
                    {", "}
                    {applicationDetails.addrBuildingName}
                    {", "}
                    {applicationDetails.detailAddress}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="paymentMode" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="rupees" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="bankName" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="chequeNo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="chequeDate" />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>Paytm UPI</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
                <td className={styles.tableData2}>{/* <span>00000001548</span> */}</td>
                <td className={styles.tableData2}>{/* <span>01/02/2023</span> */}</td>
                <td className={styles.tableData2}>{/* <span>State Bank of India</span> */}</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="referenceNo" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="date" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="details" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="payableAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="receivedAmount" />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>00001568</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY")}</span>
                </td>
                <td className={styles.tableData2}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* <span>{language === "en" ? "Certificate Fee" : "प्रमाणपत्र शुल्क"}</span> */}
                    <span>{language === "en" ? "Renewal Fee" : "नूतनीकरण शुल्क"}</span>
                  </div>
                </td>
                <td className={styles.tableData2}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* <span>{language === "en" ? "₹ 75.00" : "₹ ७५.००"}</span> */}
                    <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                  </div>
                </td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="payableAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="rebateAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="advanceAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="actualPayableAmount" />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="receivedAmount" />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
                <td className={styles.tableData2}>{/* <label>Rebate Amount/सूट रक्कम</label> */}</td>
                <td className={styles.tableData2}>{/* <label>Advance Amount/आगाऊ रक्कम</label> */}</td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>{<FormattedLabel id="totalAmount" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{language === "en" ? "₹ 50.00" : "₹ ५०.००"}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="amountInWords" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{language === "en" ? "Fifty rupees Only" : "पन्नास रुपये फक्त"}</span>
                </td>
                <td className={styles.tableData1} colSpan={3}>
                  <label style={{ marginBottom: 100 }}>{<FormattedLabel id="receiverSignature" />}:</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="remark" />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails.scrutinyRemark
                    }
                  </span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={2}></td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="printDateAndTime" />}: </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id="printBy" />}: </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {/* {language === "en"
                      ? printByNameDao?.firstNameEn +
                        " " +
                        printByNameDao?.middleNameEn +
                        " " +
                        printByNameDao?.lastNameEn
                      : printByNameDao?.firstNameMr +
                        " " +
                        printByNameDao?.middleNameMr +
                        " " +
                        printByNameDao?.lastNameMr} */}
                    {language === "en"
                      ? printByNameDao?.firstName +
                        " " +
                        printByNameDao?.middleName +
                        " " +
                        printByNameDao?.surname
                      : printByNameDao?.firstNamemr +
                        " " +
                        printByNameDao?.middleNamemr +
                        " " +
                        printByNameDao?.surnamemr}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button variant="contained" endIcon={<Print />} onClick={handleToPrint}>
            <FormattedLabel id="print" />
          </Button>
          <Button
            variant="outlined"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              router.push({
                // pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application`,
                pathname: `/dashboard`,
                // query: {
                //   id: router.query.id,
                //   petAnimal: petBreeds.find((obj) => {
                //     return obj.petAnimalKey;
                //   }),
                // },
              });
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
