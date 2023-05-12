import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./prescription.module.css";

import { Button, Paper } from "@mui/material";
import { Clear, Print } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import axios from "axios";
import URLs from "../../../URLS/urls";

const Index = () => {
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Prescription",
  });

  const [data, setData] = useState({
    facilityName: "",
    date: "",
    dateOfAdmission: "",
    ownerName: "",
    // casePaperNo: "",
    casePaperNo: Number(),
    address: "",
    species: "",
    breed: "",
    color: "",
    petName: "",
    // petAge: "",
    petAge: Number(),
    petSex: "",
    symptoms: "",
    medicines: [{ medicineName: "", days: "", dosage: "", remark: "" }],
  });
  const [species, setSpecies] = useState([{ id: 1, nameEn: "", nameMr: "" }]);
  const [petBreeds, setPetBreeds] = useState([{ id: 1, breedNameEn: "", breedNameMr: "" }]);
  const [opd, setOpd] = useState([{ id: 1, opdEn: "" }]);
  const [ipd, setIpd] = useState([{ id: 1, ipdEn: "" }]);

  useEffect(() => {
    if (router.query.service == "opd") {
      //Get OPD
      axios.get(`${URLs.VMS}/mstOpd/getAll`).then((res) => {
        setOpd(
          res.data.mstOpdList.map((j, i) => ({
            id: j.id,
            opdEn: j.opdName,
          })),
        );
      });
    }

    if (router.query.service == "ipd") {
      //Get IPD
      axios.get(`${URLs.VMS}/mstIpd/getAll`).then((res) => {
        setIpd(
          res.data.mstIpdList.map((j, i) => ({
            id: j.id,
            ipdEn: j.ipdName,
          })),
        );
      });
    }

    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setSpecies(
        res.data.mstPetAnimalList.map((j, i) => ({
          id: j.id,
          nameEn: j.nameEn,
          nameMr: j.nameMr,
        })),
      );
    });

    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setPetBreeds(
        res.data.mstAnimalBreedList.map((j, i) => ({
          id: j.id,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
        })),
      );
    });
  }, []);

  useEffect(() => {
    if (router.query.id) {
      axios
        .get(
          `${URLs.VMS}/${
            router.query.service == "opd" ? "trnAnimalTreatment" : "trnAnimalTreatmentIpd"
          }/getById?id=${router.query.id}`,
        )
        .then((res) => {
          setData({
            facilityName:
              router.query.service == "opd"
                ? opd.find((obj) => obj.id === res.data.opdKey)?.opdEn + ""
                : ipd.find((obj) => obj.id === res.data.ipdKey)?.ipdEn + "",
            date: moment(new Date()).format("DD / MM / YYYY"),
            dateOfAdmission: moment(res.data.applicationDate).format("DD / MM / YYYY"),
            ownerName: res.data.ownerFullName,
            casePaperNo: Number(res.data.casePaperNo.split("CNO")[1]),
            address: res.data.ownerAddress,
            species: species.find((obj) => obj.id == res.data.animalName)?.nameEn + "",
            breed: petBreeds.find((obj) => obj.id === res.data.animalSpeciesKey)?.breedNameEn + "",
            color: res.data.animalColour,
            petName: res.data.petName ?? "",
            petAge: res.data.animalAge,
            petSex: res.data.animalSex,
            symptoms: res.data.symptoms,
            medicines: router.query.service == "opd" ? res.data.opdMedicineDao : res.data.ipdMedicineDao,
          });
        });
    }
  }, [ipd, opd, petBreeds, species]);

  return (
    <>
      <Head>
        <title>Prescription</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.wrapper} ref={componentRef}>
          <div className={styles.head}>
            <h1>पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८</h1>
            <h2>पशु बाह्य रुग्ण उपचार केंद्र</h2>
            {/* <h3>पिंपरी / प्राधिकरण</h3> */}
            <h3>{data?.facilityName}</h3>
          </div>

          <div className={styles.divider}></div>

          <table className={styles.detailsWrapper}>
            <tr>
              <td className={styles.fieldName}>Date: </td>
              <td className={styles.dynamicData}>{data?.date}</td>
              <td colSpan={6}></td>
            </tr>
            <tr>
              <td className={styles.fieldName} style={{ width: "24%" }}>
                Date of Admission:
              </td>
              <td className={styles.dynamicData} colSpan={5}>
                {data?.dateOfAdmission}
              </td>
              <td className={styles.fieldName} style={{ width: "18%" }} colSpan={2}>
                Case Paper No.:
              </td>
              <td className={styles.dynamicData}>{data?.casePaperNo}</td>
            </tr>
            <tr>
              <td className={styles.fieldName}>Name of Owner:</td>
              <td className={styles.dynamicData} colSpan={8}>
                {data?.ownerName}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>Address:</td>
              <td className={styles.dynamicData} colSpan={8}>
                {data?.address}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>Species: </td>
              <td className={styles.dynamicData} colSpan={2}>
                {data?.species}
              </td>
              <td className={styles.fieldName}>Breed: </td>
              <td className={styles.dynamicData} colSpan={2}>
                {data?.breed}
              </td>
              <td className={styles.fieldName} style={{ width: "8%" }}>
                Color:{" "}
              </td>
              <td className={styles.dynamicData} colSpan={2}>
                {data?.color}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>Name: </td>
              <td className={styles.dynamicData} colSpan={2}>
                {data?.petName}
              </td>
              <td className={styles.fieldName}>Age: </td>
              <td className={styles.dynamicData} colSpan={2}>
                {data?.petAge}
                {data?.petAge > 1 ? " yrs" : " yr"}
              </td>
              <td className={styles.fieldName} style={{ width: "8%" }}>
                Sex:{" "}
              </td>
              <td className={styles.dynamicData} colSpan={2}>
                {data?.petSex == "M" ? "Male" : "Female"}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>Symptoms:</td>
              <td className={styles.dynamicData} colSpan={8}>
                {data?.symptoms}
              </td>
            </tr>
          </table>
          <div
            className={styles.row}
            style={{
              marginBottom: "1%",
              fontSize: "medium",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            <span>Medicine Details / Prescription</span>
          </div>
          <div className={styles.row} style={{ marginTop: "1%" }}>
            <table className={styles.medicineWrapper}>
              <tr className={styles.medicineRow} style={{ fontWeight: "bold", textAlign: "center" }}>
                <td style={{ width: "6%" }}>Sr No.</td>
                <td style={{ width: "35%" }}>Medicine</td>
                <td style={{ width: "7%" }}>Days</td>
                <td style={{ width: "10%" }}>Dosage</td>
                <td style={{ width: "42%" }}>Remark</td>
              </tr>
              {data.medicines.map((obj, i) => {
                console.log(data);
                return (
                  <tr key={i} className={styles.medicineRow}>
                    <td style={{ paddingLeft: "1.5%" }}>{i + 1}</td>
                    <td style={{ paddingLeft: "1.5%" }}>{obj.medicineName}</td>
                    <td style={{ paddingLeft: "1.5%" }}>{obj.days}</td>
                    <td style={{ paddingLeft: "1.5%" }}>{obj.dosage}</td>
                    <td style={{ paddingLeft: "1.5%" }}>{obj.remark}</td>
                  </tr>
                );
              })}
            </table>
          </div>
          <div className={styles.signatureWrapper}>
            <span>(करिता) पशुवैद्यकीय अधिकारी</span>
            <span>पिंपरी चिंचवड महानगरपालिका</span>
            <span>पिंपरी - ४११ ०१८</span>
          </div>

          <div className={styles.divider}></div>
          <div className={styles.footer}>
            <div className={styles.column}>
              <span>पिंपरी</span>
              <span>कै. नारायण मेधाजी लोखंडे भवन</span>
              <span>पिंपरी-नेहरूनगर रोड,</span>
              <span>महात्मा फुले पुतळ्याशेजारी</span>
              <span>पिंपरी, पुणे - ४११ ०१८</span>
            </div>
            <div className={styles.divider2}></div>
            <div className={styles.column}>
              <span>प्राधिकरण</span>
              <span>छत्रपती शिवाजी महाराज जलतरण तलाव</span>
              <span>गाळा नं ८, आकुर्डी पोलिस चौकी शेजारी,</span>
              <span>से. नं २६, प्राधिकरण, निगडी,</span>
              <span>पुणे - ४११ ०४४</span>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button variant="contained" endIcon={<Print />} onClick={handleToPrint}>
            Print
          </Button>
          <Button
            color="error"
            variant="outlined"
            endIcon={<Clear />}
            onClick={() => {
              router.push(`/veterinaryManagementSystem/dashboard`);
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
