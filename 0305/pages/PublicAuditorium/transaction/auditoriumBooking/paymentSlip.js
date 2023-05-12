import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import Image from "next/image";
import styles from "./paymentSlip.module.css";
import URLs from "../../../../URLS/urls";

import { Button, Grid, Paper } from "@mui/material";
import { ExitToApp, Print } from "@mui/icons-material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";

const Index = () => {
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Auditorium Booking Payment Slip",
  });

  // @ts-ignore
  const printByNameDao =
    useSelector((state) => state?.user?.user?.userDao) ?? useSelector((state) => state.user.user);
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  // @ts-ignore
  const isDeptUser = useSelector((state) => state?.user?.user?.userDao?.deptUser);

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
  const [bankName, setBankName] = useState([]);

  const [showData, setShowData] = useState();

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((r) => {
      setPaymentTypes(
        r.data.paymentType.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
          paymentTypeMr: row.paymentTypeMr,
        })),
      );
    });
  };

  const [paymentModes, setPaymentModes] = useState([]);
  const getPaymentModes = () => {
    axios.get(`${urls.BaseURL}/paymentMode/getAll`).then((r) => {
      setPaymentModes(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        })),
      );
    });
  };

  console.log("showData", showData);

  useEffect(() => {
    let currentYear = Number(moment(new Date()).format("YYYY"));
    setFiscalYear(`${currentYear}-${currentYear + 1}`);
    // setFiscalYear(`${currentYear}-${currentYear + 1 - 2000}`);

    //Get Bank
    axios.get(`${URLs.CFCURL}/master/bank/getAll`).then((res) => {
      setBankName(
        res.data.bank.map((j) => ({
          id: j.id,
          bankNameEn: j.bankName,
          bankNameMr: j.bankNameMr,
          branchNameEn: j.branchName,
          branchNameMr: j.branchNameMr,
        })),
      );
    });
  }, []);

  useEffect(() => {
    // console.log("first1", router?.query?.data && JSON.parse(router?.query?.data));
    // router?.query?.data && setShowData(JSON.parse(router?.query?.data));
  }, []);

  useEffect(() => {
    getAllData();
    getPaymentModes();
    getPaymentTypes();
  }, []);

  const getAllData = () => {
    let id = router?.query?.data && JSON.parse(router?.query?.data);
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id?.applicationNumber}`,
      )
      .then((res) => {
        console.log("respinse", res);
        setShowData(res?.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  return (
    <>
      <Head>
        <title>Auditorium Booking Payment Slip</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.paymentWrapper} ref={componentRef}>
          <div className={styles.officeCopy}>
            <Grid container>
              <Grid item xs={3}></Grid>
              <Grid item xs={6}>
                <div className={styles.centerHeader}>
                  <h1>Pimpri-Chinchwad Municipal Corporation</h1>
                  <div className={styles.row}>
                    <div style={{ display: "flex", columnGap: 10 }}>
                      <label style={{ fontWeight: "bold" }}>F.Y.:</label>
                      <span>{fiscalYear}</span>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "end" }}>
                <Image src={"/logo.png"} width={70} height={70} />
              </Grid>
            </Grid>
            {/* <div className={styles.header}> */}
            {/* <Image src={"/qrcode1.png"} width={60} height={60} /> */}
            {/* <div className={styles.centerHeader}>
                <h1>Pimpri-Chinchwad Municipal Corporation</h1>
                <div className={styles.row}>
                  <div style={{ display: "flex", columnGap: 10 }}>
                    <label style={{ fontWeight: "bold" }}>F.Y.:</label>
                    <span>{fiscalYear}</span>
                  </div>
                </div>
              </div> */}
            {/* <Image src={"/logo.png"} width={70} height={70} /> */}
            {/* </div> */}

            <table className={styles.tableWrap}>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1} style={{ textAlign: "center" }} colSpan={5}>
                  Office Copy
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  {/* <label>{<FormattedLabel id="receiptNo" />}</label> */}
                  <label>Receipt No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Related To</label>
                </td>
                <td className={styles.tableData1}>
                  <label>CFC Ref No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>CFC Counter No</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.paymentDao?.receiptNumber}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {moment(
                      // @ts-ignore
                      applicationDetails?.applicationDate,
                    ).format("DD-MM-YYYY")}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? "Public Auditorium Booking & Broadcast Management"
                      : "सार्वजनिक सभागृह बुकिंग आणि प्रसारण व्यवस्थापन"}
                  </span>
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
                  <label>Received From:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{showData?.applicantName}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>LOI No:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{showData?.LoiNo}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Service Name:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Auditorium Booking</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Narration :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Regarding online auditorium booking </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Address :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {showData?.applicantFlatHouseNo +
                      ", " +
                      showData?.applicantArea +
                      ", " +
                      showData?.applicantCity +
                      ", " +
                      showData?.applicantState +
                      ", " +
                      showData?.applicantPinCode +
                      "."}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Payment Type</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Total Amount</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Bank Name</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque Date</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {paymentTypes.find((val) => val.id == showData?.paymentDao?.paymentType)?.paymentType}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? bankName?.find((val) => {
                          return val?.id == showData?.paymentDao?.bankNameId;
                        })?.bankNameEn
                      : bankName?.find((val) => val?.id === showData?.paymentDao?.bankNameId)?.bankNameMr}
                  </span>
                </td>
                <td className={styles.tableData2}>{/* <span>01/02/2023</span> */}</td>
                <td className={styles.tableData2}>{/* <span>State Bank of India</span> */}</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Application No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Event</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Payable Amount</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Received Amount</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.applicationNumber}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY")}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{showData?.eventTitle}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                  <br />
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Deposit Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.depositAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Rent Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.rentAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>security Guard Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.securityGuardChargeAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Board Charges</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.boardChargesAmount}`}</label>
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>Total Amount :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <label> {`₹${showData?.totalAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span></span>
                </td>
                <td className={styles.tableData1} colSpan={1}>
                  <label style={{ marginBottom: 100 }}>Receiver Signature :</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Remark :</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{showData?.applicationStatus}</span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={1}></td>
                <td rowSpan={3} colSpan={1}>
                  <Image src={"/qrcode1.png"} width={60} height={60} />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print Date And Time : </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print By : </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {useSelector(
                      (state) =>
                        // @ts-ignore
                        state?.user?.user?.userDao,
                    )
                      ? language === "en"
                        ? printByNameDao.firstNameEn +
                          " " +
                          printByNameDao.middleNameEn +
                          " " +
                          printByNameDao.lastNameEn
                        : printByNameDao?.firstNameMr +
                          " " +
                          printByNameDao?.middleNameMr +
                          " " +
                          printByNameDao?.lastNameMr
                      : language === "en"
                      ? printByNameDao.firstName +
                        " " +
                        printByNameDao.middleName +
                        " " +
                        printByNameDao.surname
                      : printByNameDao.firstNamemr +
                        " " +
                        printByNameDao.middleNamemr +
                        " " +
                        printByNameDao.surnamemr}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          {/* customerCopy */}
          <div className={styles.divider}></div>
          <div className={styles.customerCopy}>
            {/* <div className={styles.header}>
              <Image src={"/qrcode1.png"} width={60} height={60} />
              <div className={styles.centerHeader}>
                <h1>Pimpri-Chinchwad Municipal Corporation</h1>
                <div className={styles.row}>
                  <div style={{ display: "flex", columnGap: 10 }}>
                    <label style={{ fontWeight: "bold" }}>F.Y.:</label>
                    <span>{fiscalYear}</span>
                  </div>
                </div>
              </div>
              <Image src={"/logo.png"} width={70} height={70} />
            </div> */}
            <Grid container>
              <Grid item xs={3}></Grid>
              <Grid item xs={6}>
                <div className={styles.centerHeader}>
                  <h1>Pimpri-Chinchwad Municipal Corporation</h1>
                  <div className={styles.row}>
                    <div style={{ display: "flex", columnGap: 10 }}>
                      <label style={{ fontWeight: "bold" }}>F.Y.:</label>
                      <span>{fiscalYear}</span>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "end" }}>
                <Image src={"/logo.png"} width={70} height={70} />
              </Grid>
            </Grid>

            <table className={styles.tableWrap}>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1} style={{ textAlign: "center" }} colSpan={5}>
                  Customer Copy
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  {/* <label>{<FormattedLabel id="receiptNo" />}</label> */}
                  <label>Receipt No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Related To</label>
                </td>
                <td className={styles.tableData1}>
                  <label>CFC Ref No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>CFC Counter No</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.paymentDao?.receiptNumber}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {moment(
                      // @ts-ignore
                      applicationDetails?.applicationDate,
                    ).format("DD-MM-YYYY")}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? "Public Auditorium Booking & Broadcast Management"
                      : "सार्वजनिक सभागृह बुकिंग आणि प्रसारण व्यवस्थापन"}
                  </span>
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
                  <label>Received From:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{showData?.applicantName}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>LOI No:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{showData?.LoiNo}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Service Name:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Auditorium Booking</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Narration :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>Regarding online auditorium booking </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Address :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {showData?.applicantFlatHouseNo +
                      ", " +
                      showData?.applicantArea +
                      ", " +
                      showData?.applicantCity +
                      ", " +
                      showData?.applicantState +
                      ", " +
                      showData?.applicantPinCode +
                      "."}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Payment Type</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Total Amount</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Bank Name</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Cheque Date</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {paymentTypes.find((val) => val.id == showData?.paymentDao?.paymentType)?.paymentType}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === "en"
                      ? bankName?.find((val) => {
                          return val?.id == showData?.paymentDao?.bankNameId;
                        })?.bankNameEn
                      : bankName?.find((val) => val?.id === showData?.paymentDao?.bankNameId)?.bankNameMr}
                  </span>
                </td>
                <td className={styles.tableData2}>{/* <span>01/02/2023</span> */}</td>
                <td className={styles.tableData2}>{/* <span>State Bank of India</span> */}</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Application No</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Date</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Event</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Payable Amount</label>
                </td>
                <td className={styles.tableData1}>
                  <label>Received Amount</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>{showData?.applicationNumber}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY")}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{showData?.eventTitle}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                  <br />
                </td>
                <td className={styles.tableData2}>
                  <span>{`₹${showData?.totalAmount}`}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Deposit Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.depositAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Rent Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.rentAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>security Guard Amount</label>
                </td>
                <td className={styles.tableData2}>
                  <label>{`₹${showData?.securityGuardChargeAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Board Charges</label>
                </td>
                <td className={styles.tableData2}>
                  <label> {`₹${showData?.boardChargesAmount}`}</label>
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>Total Amount :</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <label> {`₹${showData?.totalAmount}`}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label></label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span></span>
                </td>
                <td className={styles.tableData1} colSpan={2}>
                  <label style={{ marginBottom: 100 }}>Receiver Signature :</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Remark :</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{showData?.applicationStatus}</span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={1}></td>
                <td rowSpan={3} colSpan={1}>
                  <Image src={"/qrcode1.png"} width={60} height={60} />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print Date And Time : </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>Print By : </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {useSelector(
                      (state) =>
                        // @ts-ignore
                        state?.user?.user?.userDao,
                    )
                      ? language === "en"
                        ? printByNameDao.firstNameEn +
                          " " +
                          printByNameDao.middleNameEn +
                          " " +
                          printByNameDao.lastNameEn
                        : printByNameDao?.firstNameMr +
                          " " +
                          printByNameDao?.middleNameMr +
                          " " +
                          printByNameDao?.lastNameMr
                      : language === "en"
                      ? printByNameDao.firstName +
                        " " +
                        printByNameDao.middleName +
                        " " +
                        printByNameDao.surname
                      : printByNameDao.firstNamemr +
                        " " +
                        printByNameDao.middleNamemr +
                        " " +
                        printByNameDao.surnamemr}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button size="small" variant="contained" endIcon={<Print />} onClick={handleToPrint}>
            Print
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              router.push({
                pathname: `/PublicAuditorium/transaction/auditoriumBooking/bookedAcknowledgmentReceipt`,
                query: showData,
              });
              // router.push(`/PublicAuditorium/transaction/auditoriumBooking/bookedAcknowledgmentReceipt`);
              // isDeptUser
              //   ? router.push(`/PublicAuditorium/transaction/bookedPublicAuditorium`)
              //   : router.push(`/dashboard`);
            }}
          >
            Exit
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
