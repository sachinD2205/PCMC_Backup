import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "./report.module.css";
import URLs from "../../../URLS/urls";

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Print, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [petAnimal, setPetAnimal] = useState([{ id: 1, nameEn: "", nameMr: "" }]);
  const [petBreeds, setPetBreeds] = useState([{ id: 1, breedEn: "", breedMr: "" }]);

  const [table, setTable] = useState([]);

  const componentRef = useRef(null);

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: "Date wise License Expiry Report",
  });

  let reportSchema = yup.object().shape({
    petAnimalKey: yup.number().required("Please select an animal").typeError("Please select an animal"),
    fromDate: yup.date().typeError(`Please select a from Date`).required(`Please select a from Date`),
    toDate: yup.date().typeError(`Please select a to Date`).required(`Please select a to Date`),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(reportSchema),
  });

  useEffect(() => {
    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimal(
        res.data.mstPetAnimalList.map((j, i) => ({
          srNo: i + 1,
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
          srNo: i + 1,
          id: j.id,
          breedEn: j.breedNameEn,
          breedMr: j.breedNameMr,
        })),
      );
    });
  }, []);

  const columns = [
    {
      headerClassName: "cellColor",

      field: "licenseNo",

      headerAlign: "center",
      headerName: <FormattedLabel id="licenseNo" />,
      width: 260,
    },
    {
      headerClassName: "cellColor",

      field: "ownerName",

      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      width: 300,
    },

    {
      headerClassName: "cellColor",

      field: language == "en" ? "breedEn" : "breedMr",

      headerAlign: "center",
      headerName: <FormattedLabel id="petBreed" />,
      width: 220,
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
    },

    // {
    //   headerClassName: "cellColor",

    //   field: "status",

    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="status" />,
    //   width: 200,
    // },
  ];

  const finalSubmit = (data) => {
    const fromDate = moment(data.fromDate).format("DD/MM/YYYY");
    const toDate = moment(data.toDate).format("DD/MM/YYYY");

    axios
      .get(
        `${URLs.VMS}/trnRenewalPetLicence/getAllExpiryReportByFromDateAndToDateAndPetType?fromDate=${fromDate}&toDate=${toDate}&petTypeKey=${data.petAnimalKey}`,
      )
      .then((res) => {
        console.log(res.data.trnRenewalPetLicenceList);
        setTable(
          res.data.trnRenewalPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            ...j,
            breedEn: petBreeds.find((obj) => obj.id == j.animalBreedKey)?.breedEn,
            breedMr: petBreeds.find((obj) => obj.id == j.animalBreedKey)?.breedMr,
          })),
        );
      });
  };

  return (
    <>
      <Head>
        <title>Issued License Expiry Report</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Date wise Issued License Expiry Report</div>

        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row}>
            <FormControl variant="standard" error={!!error.petAnimalKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="petAnimal" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="petAnimalKey"
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === "en" ? obj.nameEn : obj.nameMr}
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
            <FormControl error={!!error.fromDate}>
              <Controller
                control={control}
                name="fromDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="fromDate" required />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "200px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                          error={!!error.fromDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{error?.fromDate ? error.fromDate.message : null}</FormHelperText>
            </FormControl>
            <FormControl error={!!error.toDate}>
              <Controller
                control={control}
                name="toDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="toDate" required />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "200px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                          error={!!error.toDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{error?.toDate ? error.toDate.message : null}</FormHelperText>
            </FormControl>

            <div style={{ display: "flex", gap: 20 }}>
              <Button variant="contained" type="submit" endIcon={<Search />}>
                <FormattedLabel id="search" />
              </Button>
              <Button variant="contained" onClick={handleToPrint} endIcon={<Print />}>
                <FormattedLabel id="print" />
              </Button>
            </div>
          </div>
        </form>

        <div ref={componentRef}>
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
              } else if (
                params.field === "status" &&
                (params.value == "Reassigned by Clerk" ||
                  params.value == "Reassigned by HOD" ||
                  params.value == "Rejected by HOD")
              ) {
                return "redText";
              } else if (params.field === "status" && params.value == "Payment Successful") {
                return "blueText";
              } else {
                return "";
              }
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>
      </Paper>
    </>
  );
};

export default Index;
