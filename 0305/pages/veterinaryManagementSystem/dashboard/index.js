import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "./vetMain.module.css";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import axios from "axios";
import URLs from "../../../URLS/urls";
import { DataGrid } from "@mui/x-data-grid";
import { CreditCard, Edit, Description, Check, Undo, MoreHoriz, Watch } from "@mui/icons-material";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    {
      id: 1,
      petNameEn: "",
      petNameMr: "",
    },
  ]);
  const [area, setArea] = useState([{ id: 1, areaEn: "", areaMr: "" }]);
  const [zone, setZone] = useState([{ id: 1, zoneEn: "", zoneMr: "" }]);
  const [ward, setWard] = useState([{ id: 1, wardEn: "", wardMr: "" }]);
  const [petBreeds, setPetBreeds] = useState([{ id: 1, breedNameEn: "", breedNameMr: "" }]);
  const [petLicenseTiles, setPetLicenseTiles] = useState([{ id: 1, label: "", count: 0, icon: <Edit /> }]);
  const [petLicenses, setPetLicenses] = useState([]);
  const [table, setTable] = useState([{ id: 1 }]);
  const [opdTiles, setOpdTiles] = useState([{ id: 1, label: "", count: 0, icon: <Edit /> }]);
  const [opdAll, setOpdAll] = useState([]);
  const [opdTable, setOpdTable] = useState([{ id: 1 }]);
  const [ipdTiles, setIpdTiles] = useState([{ id: 1, label: "", count: 0, icon: <Edit /> }]);
  const [ipdAll, setIpdAll] = useState([]);
  const [ipdTable, setIpdTable] = useState([{ id: 1 }]);
  const [dashboardType, setDashboardType] = useState("petLicense");

  let petSchema = yup.object().shape({
    // petAnimalKey: yup.number().required("Please select a pet animal"),
    // breedNameEn: yup.string().required("Please enter breed name in english"),
    // breedNameMr: yup.string().required("Please enter breed name in marathi"),
  });

  const {
    watch,
    setValue,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    //Get Area
    axios.get(`${URLs.CFCURL}/master/area/getAll`).then((res) => {
      setArea(
        res.data.area.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          areaEn: j.areaName,
          areaMr: j.areaNameMr,
        })),
      );
    });

    //Get Zone
    axios.get(`${URLs.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(
        res.data.zone.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        })),
      );
    });

    //Get Ward
    axios.get(`${URLs.CFCURL}/master/ward/getAll`).then((res) => {
      setWard(
        res.data.ward.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          wardEn: j.wardName,
          wardMr: j.wardNameMr,
        })),
      );
    });

    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimalDropDown(
        res.data.mstPetAnimalList.map((j) => ({
          id: j.id,
          petNameEn: j.nameEn,
          petNameMr: j.nameMr,
        })),
      );
    });

    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setPetBreeds(
        res.data.mstAnimalBreedList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
        })),
      );
    });
  }, []);

  useEffect(() => {
    if (petAnimalDropDown.length > 0) {
      setValue("petAnimalKey", petAnimalDropDown[0]["id"]);
      tilesData(petAnimalDropDown[0]["id"]);
    }

    //Get All Pet License
    axios.get(`${URLs.VMS}/trnPetLicence/getAll`).then((res) => {
      setPetLicenses(
        res.data.trnPetLicenceList.map((j, i) => ({
          srNo: i + 1,
          ...j,
          fullAddress: j.addrFlatOrHouseNo + ", " + j.addrBuildingName + ", " + j.detailAddress,
          breedEn: petBreeds.find((obj) => obj.id == j.animalBreedKey)?.breedNameEn,
          breedMr: petBreeds.find((obj) => obj.id == j.animalBreedKey)?.breedNameMr,
          rabiesStatus: j.antiRabiesVaccinationStatus == "y" ? "Yes" : "No",
        })),
      );
    });

    //Get OPD data
    axios.get(`${URLs.VMS}/trnAnimalTreatment/getAll`).then((res) => {
      setOpdAll(
        res.data.trnAnimalTreatmentList.map((j, i) => ({
          srNo: i + 1,
          ...j,
          wardEn: ward.find((obj) => obj.id === j.wardKey)?.wardEn,
          wardMr: ward.find((obj) => obj.id === j.wardKey)?.wardMr,
          areaEn: area.find((obj) => obj.id === j.areaKey)?.areaEn,
          areaMr: area.find((obj) => obj.id === j.areaKey)?.areaMr,
          zoneEn: zone.find((obj) => obj.id === j.zoneKey)?.zoneEn,
          zoneMr: zone.find((obj) => obj.id === j.zoneKey)?.zoneMr,
          petAnimalEn: petAnimalDropDown.find((obj) => obj.id === Number(j.animalName))?.petNameEn,
          petAnimalMr: petAnimalDropDown.find((obj) => obj.id === Number(j.animalName))?.petNameMr,
          petAnimalBreedEn: petBreeds.find((obj) => obj.id === j.animalSpeciesKey)?.breedNameEn,
          petAnimalBreedMr: petBreeds.find((obj) => obj.id === j.animalSpeciesKey)?.breedNameMr,
        })),
      );
    });

    //Get IPD data
    axios.get(`${URLs.VMS}/trnAnimalTreatmentIpd/getAll`).then((res) => {
      setIpdAll(
        res.data.trnAnimalTreatmentIpdList.map((j, i) => ({
          srNo: i + 1,
          ...j,
          wardEn: ward.find((obj) => obj.id === j.wardKey)?.wardEn,
          wardMr: ward.find((obj) => obj.id === j.wardKey)?.wardMr,
          areaEn: area.find((obj) => obj.id === j.areaKey)?.areaEn,
          areaMr: area.find((obj) => obj.id === j.areaKey)?.areaMr,
          zoneEn: zone.find((obj) => obj.id === j.zoneKey)?.zoneEn,
          zoneMr: zone.find((obj) => obj.id === j.zoneKey)?.zoneMr,
          petAnimalEn: petAnimalDropDown.find((obj) => obj.id === Number(j.animalName))?.petNameEn,
          petAnimalMr: petAnimalDropDown.find((obj) => obj.id === Number(j.animalName))?.petNameMr,
          petAnimalBreedEn: petBreeds.find((obj) => obj.id === j.animalSpeciesKey)?.breedNameEn,
          petAnimalBreedMr: petBreeds.find((obj) => obj.id === j.animalSpeciesKey)?.breedNameMr,
        })),
      );
    });
  }, [petAnimalDropDown, petBreeds, ward, area, zone]);

  useEffect(() => {
    if (petLicenses.length > 0) {
      tilesData(petAnimalDropDown[0]["id"]);
      // setTable(petLicenses);
      setTable(petLicenses.filter((obj) => obj.petAnimalKey == petAnimalDropDown[0]["id"]));
      setOpdTable(opdAll.filter((obj) => obj.animalName == petAnimalDropDown[0]["id"]));
      setIpdTable(ipdAll.filter((obj) => obj.animalName == petAnimalDropDown[0]["id"]));
    }
  }, [petLicenses, petAnimalDropDown, opdAll, ipdAll]);

  const tilesData = (petKey) => {
    // @ts-ignore
    let filteredDataPetLicense = petLicenses.filter((obj) => obj.petAnimalKey == petKey);
    setTable(filteredDataPetLicense);
    let pendingPetLicense = 0,
      approvedPetLicense = 0,
      reassignedPetLicense = 0,
      paidApplicationsPetLicense = 0;

    for (let i of filteredDataPetLicense) {
      if (i.status == "Applied") {
        ++pendingPetLicense;
      } else if (i.status == "Approved by HOD") {
        ++approvedPetLicense;
      } else if (i.status == "Payment Successful" || i.status == "License Generated") {
        ++paidApplicationsPetLicense;
      } else if (
        i.status == "Reassigned by HOD" ||
        i.status == "Reassigned by Clerk" ||
        i.status == "Rejected by HOD"
      ) {
        ++reassignedPetLicense;
      }
    }

    setPetLicenseTiles([
      {
        id: 1,
        label: "Total Applications",
        count: filteredDataPetLicense.length,
        icon: <Description />,
        status: ["all"],
      },
      {
        id: 2,
        label: "Pending",
        count: pendingPetLicense,
        icon: <MoreHoriz />,
        status: ["Applied", "Approved by Clerk"],
      },
      { id: 3, label: "Approved", count: approvedPetLicense, icon: <Check />, status: ["Approved by HOD"] },
      {
        id: 5,
        label: "Reassigned",
        count: reassignedPetLicense,
        icon: <Undo />,
        status: ["Reassigned by Clerk", "Reassigned by HOD", "Rejected by HOD"],
      },
      {
        id: 4,
        label: "Paid Applications",
        count: paidApplicationsPetLicense,
        icon: <CreditCard />,
        status: ["Payment Successful", "License Generated"],
      },
    ]);

    let pendingOpd = 0,
      approvedOpd = 0,
      paidApplicationsOpd = 0;

    // @ts-ignore
    let filteredDataOpd = opdAll.filter((obj) => Number(obj.animalName) == petKey);

    setOpdTable(filteredDataOpd);

    for (let i of filteredDataOpd) {
      if (i.status == "Initiated") {
        ++pendingOpd;
      } else if (i.status == "Awaiting Payment") {
        ++approvedOpd;
      } else if (i.status == "Payment Successful") {
        ++paidApplicationsOpd;
      }
    }

    setOpdTiles([
      {
        id: 1,
        label: "Total Applications",
        count: filteredDataOpd.length,
        icon: <Description />,
        status: "all",
      },
      { id: 2, label: "Pending", count: pendingOpd, icon: <MoreHoriz />, status: "Initiated" },
      { id: 3, label: "Approved", count: approvedOpd, icon: <Check />, status: "Awaiting Payment" },
      {
        id: 4,
        label: "Paid Applications",
        count: paidApplicationsOpd,
        icon: <CreditCard />,
        status: "Payment Successful",
      },
    ]);

    let pendingIpd = 0,
      approvedIpd = 0,
      paidApplicationsIpd = 0;

    // @ts-ignore
    let filteredDataIpd = ipdAll.filter((obj) => Number(obj.animalName) == petKey);
    setIpdTable(filteredDataIpd);

    for (let i of filteredDataIpd) {
      if (i.status == "Initiated") {
        ++pendingIpd;
      } else if (i.status == "Awaiting Payment") {
        ++approvedIpd;
      } else if (i.status == "Payment Successful") {
        ++paidApplicationsIpd;
      }
    }

    console.table({
      paidApplicationsIpd,
      approvedIpd,
      pendingIpd,
    });

    setIpdTiles([
      {
        id: 1,
        label: "Total Applications",
        count: filteredDataIpd.length,
        icon: <Description />,
        status: "all",
      },
      { id: 2, label: "Pending", count: pendingIpd, icon: <MoreHoriz />, status: "Initiated" },
      { id: 3, label: "Approved", count: approvedIpd, icon: <Check />, status: "Awaiting Payment" },
      {
        id: 4,
        label: "Paid Applications",
        count: paidApplicationsIpd,
        icon: <CreditCard />,
        status: "Payment Successful",
      },
    ]);
  };

  const columnsPetLicense = [
    {
      headerClassName: "cellColor",

      field: "srNo",

      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
    },

    {
      headerClassName: "cellColor",

      field: "applicationNumber",

      headerAlign: "center",
      // headerName: <FormattedLabel id="applicationNo" />,
      headerName: "Application No.",
      width: 280,
    },
    {
      headerClassName: "cellColor",

      field: "petLicenceNo",

      headerAlign: "center",
      headerName: <FormattedLabel id="licenseNo" />,
      width: 160,
    },
    {
      headerClassName: "cellColor",

      field: "ownerName",

      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      width: 250,
    },
    {
      headerClassName: "cellColor",

      field: "fullAddress",

      headerAlign: "center",
      headerName: <FormattedLabel id="detailAddress" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",

      field: "ownerMobileNo",

      headerAlign: "center",
      headerName: <FormattedLabel id="mobileNo" />,
      width: 130,
    },
    {
      headerClassName: "cellColor",

      field: "breedEn",

      headerAlign: "center",
      headerName: <FormattedLabel id="petName" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "petName",

      headerAlign: "center",
      headerName: <FormattedLabel id="petName" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "animalAge",

      headerAlign: "center",
      headerName: <FormattedLabel id="animalAge" />,
      width: 200,
      // flex: 1,
    },

    {
      headerClassName: "cellColor",

      field: "rabiesStatus",

      headerAlign: "center",
      headerName: <FormattedLabel id="antiRabiesVaccinationStatus" />,
      width: 250,
    },
    {
      headerClassName: "cellColor",

      field: "status",

      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 200,
    },
  ];

  const columnsOPD = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 80,
    },
    {
      headerClassName: "cellColor",

      field: "licenseNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="licenseNo" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "petAnimalEn" : "petAnimalMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="petAnimal" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "petAnimalBreedEn" : "petAnimalBreedMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="petBreed" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "animalColour",
      headerAlign: "center",
      headerName: <FormattedLabel id="animalColor" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "ownerFullName",
      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "status",
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 150,
    },
  ];

  return (
    <>
      <Head>
        <title>VMS - Dashboard</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.row} style={{ justifyContent: "center" }}>
          <FormControl variant="standard" error={!!error.petAnimalKey}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="petAnimal" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: "180px" }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    tilesData(value.target.value);
                  }}
                  label="petAnimalKey"
                >
                  {petAnimalDropDown &&
                    petAnimalDropDown.map((value, index) => (
                      <MenuItem
                        key={index}
                        value={
                          //@ts-ignore
                          value.id
                        }
                      >
                        {language == "en"
                          ? //@ts-ignore
                            value.petNameEn
                          : // @ts-ignore
                            value?.petNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="petAnimalKey"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{error?.petAnimalKey ? error.petAnimalKey.message : null}</FormHelperText>
          </FormControl>
        </div>

        <div className={styles.row} style={{ justifyContent: "center", marginTop: "2%" }}>
          <FormControl>
            {/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
            <RadioGroup
              name="dashboard"
              defaultValue="petLicense"
              sx={{ gap: 20 }}
              onChange={(e) => {
                setDashboardType(e.target.value);
              }}
              row
            >
              <FormControlLabel value="petLicense" control={<Radio />} label="Pet License" />
              <FormControlLabel value="opdRegistrations" control={<Radio />} label="OPD Registrations" />
              <FormControlLabel value="ipdRegistrations" control={<Radio />} label="IPD Registrations" />
            </RadioGroup>
          </FormControl>
        </div>
        {dashboardType == "petLicense" && (
          <>
            <div className={styles.row} style={{ justifyContent: "center" }}>
              <div className={styles.subTitle}>Pet License</div>
            </div>

            <div className={styles.tilesWrapper}>
              {petLicenseTiles &&
                petLicenseTiles.map((obj, i) => {
                  return (
                    <div className={styles.tile} key={i}>
                      <div className={styles.icon}>{obj.icon}</div>
                      <div className={styles.tileContent}>
                        <span style={{ textTransform: "uppercase" }}>{obj.label}</span>
                        <div className={styles.container}>
                          <div className={styles.slider}>
                            <span>{obj.count}</span>
                            <Button
                              variant="contained"
                              onClick={() => {
                                // updateTableData(obj.status);
                                obj.status == "all"
                                  ? setTable(
                                      petLicenses.filter((obj) => obj.petAnimalKey == watch("petAnimalKey")),
                                    )
                                  : // @ts-ignore
                                    setTable(
                                      petLicenses.filter((j) => {
                                        if (j.petAnimalKey == watch("petAnimalKey")) {
                                          return (
                                            j.status == obj.status[0] ||
                                            j.status == obj.status[1] ||
                                            j.status == obj.status[2]
                                          );
                                        }
                                      }),
                                    );
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                        {petLicenseTiles.length - 1 != i && <div className={styles.divider}></div>}
                      </div>
                    </div>
                  );
                })}
            </div>
            <DataGrid
              autoHeight
              sx={{
                marginTop: "5vh",
                width: "100%",

                "& .cellColor": {
                  backgroundColor: "#1976d2",
                  color: "white",
                },
                "& .redText": {
                  color: "red",
                },
                "& .orangeText": {
                  color: "orange",
                },
                "& .greenText": {
                  color: "green",
                },
                "& .blueText": {
                  color: "blue",
                },
              }}
              getCellClassName={(params) => {
                if (params.field === "status" && params.value == "Applied") {
                  return "orangeText";
                } else if (params.field === "status" && params.value == "Approved by Clerk") {
                  return "greenText";
                } else if (params.field === "status" && params.value == "Approved by HOD") {
                  return "greenText";
                } else if (params.field === "status" && params.value == "Reassigned by Clerk") {
                  return "redText";
                } else if (params.field === "status" && params.value == "Reassigned by HOD") {
                  return "redText";
                } else if (params.field === "status" && params.value == "Payment Successful") {
                  return "blueText";
                } else {
                  return "";
                }
              }}
              rows={table}
              //@ts-ignore
              columns={columnsPetLicense}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </>
        )}

        {dashboardType == "opdRegistrations" && (
          <>
            <div className={styles.row} style={{ justifyContent: "center" }}>
              <div className={styles.subTitle}>OPD Registrations</div>
            </div>

            <div className={styles.tilesWrapper}>
              {opdTiles &&
                opdTiles.map((obj, i) => {
                  return (
                    <div className={styles.tile} key={i}>
                      <div className={styles.icon}>{obj.icon}</div>
                      <div className={styles.tileContent}>
                        <span style={{ textTransform: "uppercase" }}>{obj.label}</span>
                        <div className={styles.container}>
                          <div className={styles.slider}>
                            <span>{obj.count}</span>
                            <Button
                              variant="contained"
                              onClick={() => {
                                // updateTableData(obj.status);
                                obj.status == "all"
                                  ? setOpdTable(
                                      opdAll.filter((obj) => obj.animalName == watch("petAnimalKey")),
                                    ) // @ts-ignore
                                  : setOpdTable(
                                      opdAll.filter((j) => {
                                        if (j.animalName == watch("petAnimalKey")) {
                                          return j.status == obj.status;
                                        }
                                      }),
                                    );
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                        {opdTiles.length - 1 != i && <div className={styles.divider}></div>}
                      </div>
                    </div>
                  );
                })}
            </div>

            <DataGrid
              autoHeight
              sx={{
                marginTop: "5vh",
                width: "100%",

                "& .cellColor": {
                  backgroundColor: "#1976d2",
                  color: "white",
                },
                "& .redText": {
                  color: "red",
                },
                "& .orangeText": {
                  color: "orange",
                },
                "& .greenText": {
                  color: "green",
                },
                "& .blueText": {
                  color: "blue",
                },
              }}
              getCellClassName={(params) => {
                if (params.field === "status" && params.value == "Initiated") {
                  return "orangeText";
                } else if (params.field === "status" && params.value == "Awaiting Payment") {
                  return "greenText";
                } else if (params.field === "status" && params.value == "Payment Successful") {
                  return "blueText";
                } else {
                  return "";
                }
              }}
              rows={opdTable}
              //@ts-ignore
              columns={columnsOPD}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </>
        )}

        {dashboardType == "ipdRegistrations" && (
          <>
            <div className={styles.row} style={{ justifyContent: "center" }}>
              <div className={styles.subTitle}>IPD Registrations</div>
            </div>

            <div className={styles.tilesWrapper}>
              {ipdTiles &&
                ipdTiles.map((obj, i) => {
                  return (
                    <div className={styles.tile} key={i}>
                      <div className={styles.icon}>{obj.icon}</div>
                      <div className={styles.tileContent}>
                        <span style={{ textTransform: "uppercase" }}>{obj.label}</span>
                        <div className={styles.container}>
                          <div className={styles.slider}>
                            <span>{obj.count}</span>
                            <Button
                              variant="contained"
                              onClick={() => {
                                obj.status == "all"
                                  ? setIpdTable(
                                      ipdAll.filter((obj) => obj.animalName == watch("petAnimalKey")),
                                    ) // @ts-ignore
                                  : setIpdTable(
                                      ipdAll.filter((j) => {
                                        if (j.animalName == watch("petAnimalKey")) {
                                          return j.status == obj.status;
                                        }
                                      }),
                                    );
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                        {ipdTiles.length - 1 != i && <div className={styles.divider}></div>}
                      </div>
                    </div>
                  );
                })}
            </div>

            <DataGrid
              autoHeight
              sx={{
                marginTop: "5vh",
                width: "100%",

                "& .cellColor": {
                  backgroundColor: "#1976d2",
                  color: "white",
                },
                "& .redText": {
                  color: "red",
                },
                "& .orangeText": {
                  color: "orange",
                },
                "& .greenText": {
                  color: "green",
                },
                "& .blueText": {
                  color: "blue",
                },
              }}
              getCellClassName={(params) => {
                if (params.field === "status" && params.value == "Initiated") {
                  return "orangeText";
                } else if (params.field === "status" && params.value == "Awaiting Payment") {
                  return "greenText";
                } else if (params.field === "status" && params.value == "Payment Successful") {
                  return "blueText";
                } else {
                  return "";
                }
              }}
              rows={ipdTable}
              //@ts-ignore
              columns={columnsOPD}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </>
        )}
      </Paper>
    </>
  );
};

export default Index;
