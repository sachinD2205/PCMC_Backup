import React, { useEffect, useState } from "react";
import Head from "next/head";
// import styles from "../sbms.module.css";
import styles from "../sbms.module.css";
import { Paper, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import router from "next/router";
import sweetAlert from "sweetalert";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  // @ts-ignore
  const token = useSelector((state) => state.user.user.token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [huts, setHuts] = useState([]);
  const [slums, setSlums] = useState([{ id: 1, slumNameEn: "", slumNameMr: "" }]);
  const [table, setTable] = useState([]);
  const [selectedHuts, setSelectedHuts] = useState([]);
  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: "",
      financialYearMr: "",
    },
  ]);

  const {
    // register,
    reset,
    watch,
    // handleSubmit,
    control,
    setValue,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    //Get Huts
    axios.get(`${urls.SLUMURL}/mstHut/getAll`, config).then((res) => {
      console.log("hutdata",res.data.mstHutList)
      setHuts(
        res.data.mstHutList.map((j, i) => ({
          id: j.id,
          hutNo: j.hutNo,
        })),
      );
    });

    //Get Slums
    axios.get(`${urls.SLUMURL}/mstSlum/getAll`, config).then((res) => {
      setSlums(
        res.data.mstSlumList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          slumNameEn: j.slumName,
          slumNameMr: j.slumNameMr,
        })),
      );
    });

    //Get Financial Year
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll`, config)
      .then((res) => {
        setFinancialYear(
          res.data.financialYear.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          })),
        );
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
  }, []);

  useEffect(() => {
    setValue("year", financialYear[0]["financialYearEn"]);
    //Table Data
    getAllForBilling(financialYear[0]["financialYearEn"]);
  }, [huts, slums, financialYear]);

  const getAllForBilling = (year) => {
    //Table
    axios.get(`${urls.SLUMURL}/mstHut/getAllForBilling?billYear=${year}`, config).then((res) => {
      setTable(
        res.data.mstHutList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          hutNo: j.hutNo,
          slumNameEn: slums.find((obj) => obj.id == j.slumKey)?.slumNameEn,
          slumNameMr: slums.find((obj) => obj.id == j.slumKey)?.slumNameMr,
          ownerName: j.ownerFirstName + " " + j.ownerMiddleName + " " + j.ownerLastName ?? "--",
        })),
      );
    });
  };

  const generateBill = () => {
    const bodyForApi = {
      year: watch("year"),
      hutKeys: selectedHuts,
    };

    axios.post(`${urls.SLUMURL}/trnBill/bulk/generate`, bodyForApi, config).then((res) => {
      console.log(res.data);
    });
  };

  const columns = [
    {
      headerClassName: "cellColor",
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "slumNameEn" : "slumNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="slumName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "hutNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="hutNo" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "ownerName",
      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      width: 250,
    },
  ];

  return (
    <>
      <Head>
        <title>Hut Bill Generation</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Hut Bill Generation</div>
        <div className={styles.row} style={{ justifyContent: "center" }}>
          <FormControl
            // disabled={router.query.pageMode == "view" ? true : false}
            variant="standard"
            error={!!error.year}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* <FormattedLabel id="year" /> */}
              <FormattedLabel id="financialYear" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: "250px" }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // @ts-ignore
                  value={field.value}
                  onChange={(value) => {
                    getAllForBilling(value.target.value);
                    field.onChange(value);
                  }}
                  label="year"
                >
                  {financialYear &&
                    financialYear.map((value, index) => (
                      <MenuItem
                        key={index}
                        value={
                          //@ts-ignore
                          value.financialYearEn
                        }
                      >
                        {language == "en"
                          ? //@ts-ignore
                            value.financialYearEn
                          : // @ts-ignore
                            value?.financialYearMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="year"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{error?.year ? error.year.message : null}</FormHelperText>
          </FormControl>
        </div>
        <div className={styles.row} style={{ justifyContent: "center" }}>
          <DataGrid
            autoHeight
            sx={{
              marginTop: "2vh",
              maxWidth: "85%",

              "& .cellColor": {
                backgroundColor: "#125597",
                color: "white",
                // textShadow: "0.5px 1px black",
              },
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            // disableSelectionOnClick
            onSelectionModelChange={(allRowsId) => {
              // @ts-ignore
              console.log("allRowsId",allRowsId)
              setSelectedHuts(allRowsId);
            }}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>
        <div className={styles.buttons} style={{ justifyContent: "space-evenly" }}>
          <Button variant="contained" onClick={generateBill}>
            <FormattedLabel id="generate" />
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              router.push("/SlumBillingManagementSystem");
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
