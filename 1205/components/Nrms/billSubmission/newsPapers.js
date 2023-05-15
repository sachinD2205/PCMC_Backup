import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import styles from "./view.module.css";

// witness
const NewsPapers = () => {
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [newsPaper, setNewsPaper] = useState([]);
  const [selectedNewsPaper, setSelectedNewsPaper] = useState([]);
  useEffect(() => {
    console.log("selectedNewsPaper", selectedNewsPaper);
  }, [selectedNewsPaper]);

  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext({
    // defaultValues: { paymentDetails: [] },
  });

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "paymentDetails", // unique name for your Field Array
  });

  //  Append Function
  const appendFun = () => {
    append({
      newsPaper: null,
      agencyPublishedDate: "",
      standarFormatSize: "",
      agencyBillWiseRate: "",
      calculatedRate: "",
      approvedRate: "",
      totalAmount: "",
      totalDeduction: "",
      totalTaxDeduction: "",
      totalNetAmount: "",
    });
  };

  const handleChangeNewsPaper = (value, index) => {
    setSelectedNewsPaper([...selectedNewsPaper, value.target.value]);

    const body = {
      newsPaperGroupKey: getValues("rotationGroupKey"),
      newsPaperSubGroupKey: getValues("rotationSubGroupKey"),
      newsPaperLevel: getValues("newsPaperLevel"),
      newsPaperName: value.target.value,
      standardFormatSize: getValues("standardFormatSize"),
    };

    // useEffect(() => {
    // if (getValues("paymentDetails")?.length > 0) {
    //   setValue("paymentDetails", getValues("paymentDetails"))
    // }
    // }, [])

    axios.post(`${urls.NRMS}/rateChargeMaster/getByInps`, body).then((r) => {
      console.log("r.data", r.data);

      setValue(`paymentDetails.${index}.agencyPublishedDate`, getValues("newsPublishDate"));

      setValue(`paymentDetails.${index}.agencyBillWiseRate`, 0);

      setValue(`paymentDetails.${index}.approvedRate`, 0);

      setValue(`paymentDetails.${index}.totalDeduction`, 0);

      setValue(`paymentDetails.${index}.totalTaxDeduction`, 0);

      setValue(`paymentDetails.${index}.standarFormatSize`, r?.data[0]?.standardFormatSizeTxt);

      setValue(`paymentDetails.${index}.calculatedRate`, r?.data[0]?.amount);

      setValue(
        `paymentDetails.${index}.totalAmount`,
        r?.data[0]?.amount * getValues(`paymentDetails.${index}.standarFormatSize`),
      );

      setValue(`paymentDetails.${index}.totalNetAmount`, getValues(`paymentDetails.${index}.totalAmount`));

      if (index + 1 == getValues("newsPapersLength")) {
        let final = [];
        final = getValues("paymentDetails")?.map((r) => r.totalNetAmount);
        let sum = 0;
        final.map((r) => {
          if (r != null) {
            sum = parseFloat(sum) + parseFloat(r);
          }
        });

        console.log("final007", final);
        console.log("sum007", sum);

        setValue("billAmount", sum);
      }
    });
  };

  // Call Append In UseEffect - First Time Only
  useEffect(() => {
    console.log("paymentDetails.length", getValues(`paymentDetails`)?.length);
    if (getValues(`paymentDetails`)?.length == 0) {
      appendFun();
    }
  }, []);

  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`paymentDetails.length`) == getValues("newsPapersLength")) {
      setButtonValue(true);
    } else {
      appendFun();
      setButtonValue(false);
    }
  };

  const getNewsPapers = () => {
    let newsPapers = getValues("newsPapers")?.split(",");

    console.log("newsPapers", newsPapers);

    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      let finall = r.data.newspaperMasterList.filter((x) => newsPapers?.includes(x.id.toString()));
      console.log("finall", finall);
      setNewsPaper(finall);
    });
    //
  };

  useEffect(() => {
    if (getValues("newsPapersLength")?.length !== 0) {
      setButtonValue(false);
      console.log("News Papers Commoa Separated", getValues("newsPapers"));
      getNewsPapers();
    }
    //
  }, []);

  useEffect(() => {
    {
      console.log("GGGGGG", watch(`paymentDetails`));
    }
  }, [getValues("paymentDetails")]);

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setDisabled(false);
      console.log("enabled");
    } else {
      setDisabled(true);
      console.log("disabled");
    }
  }, [router.query.pageMode]);

  return (
    <>
      {fields.map((witness, index) => {
        return (
          <Grid key={index}>
            <div className={styles.row}>
              <div
                className={styles.details}
                style={{
                  marginRight: "820px",
                }}
              >
                <div
                  className={styles.h1Tag}
                  style={{
                    height: "40px",
                    width: "300px",
                  }}
                >
                  <h3
                    style={{
                      color: "white",
                      marginTop: "7px",
                    }}
                  >
                    News Paper
                    {/* {<FormattedLabel id="witness" />} */}
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>

            <Grid container>
              <Grid container>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  //
                >
                  {watch(`paymentDetails.${index}.newsPaper`) == null ? (
                    <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.newsPaper}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* {<FormattedLabel id="Gender" required />} */}
                        News Paper
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={disabled}
                            sx={{ width: 230 }}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              handleChangeNewsPaper(value, index);
                            }}
                            label={language == "en" ? "News Paper *" : "वृत्तपत्र *"}
                          >
                            {newsPaper &&
                              newsPaper
                                ?.filter((o) => selectedNewsPaper && !selectedNewsPaper?.includes(o.id))
                                ?.map((n, index) => (
                                  <MenuItem key={index} value={n.id}>
                                    {language == "en" ? n?.newspaperName : n?.newspaperNameMr}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name={`paymentDetails.${index}.newsPaper`}
                        control={control}
                        defaultValue={null}
                      />

                      <FormHelperText>{errors?.newsPaper ? errors.newsPaper.message : null}</FormHelperText>
                    </FormControl>
                  ) : (
                    <>
                      <TextField
                        disabled={disabled}
                        sx={{ width: 230 }}
                        id="standard-basic"
                        value={
                          language == "en"
                            ? newsPaper.find((rr) => watch(`paymentDetails.${index}.newsPaper`) == rr.id)
                                ?.newspaperName
                            : newsPaper.find((rr) => watch(`paymentDetails.${index}.newsPaper`) == rr.id)
                                ?.newspaperNameMr
                        }
                        label={language == "en" ? "News Paper" : "वृत्तपत्र"}
                        variant="standard"
                        key={witness.id}
                        InputLabelProps={{ shrink: true }}
                      />
                    </>
                  )}
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl error={!!errors.agencyPublishedDate} sx={{ marginTop: 0 }}>
                    <Controller
                      control={control}
                      name="agencyPublishedDate"
                      defaultValue={null}
                      // format="DD/MM/YYYY"
                      key={witness.id}
                      {...register(`paymentDetails.${index}.agencyPublishedDate`)}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled={disabled}
                            maxDate={new Date()}
                            ///
                            inputFormat="DD/MM/YYYY"
                            ///
                            label={
                              // <span style={{ fontSize: 16 }}>{<FormattedLabel id="BirthDate" required />}</span>
                              <span style={{ fontSize: 16 }}>
                                {language == "en" ? "Published Date" : "प्रकाशन दिनांक"}
                              </span>
                            }
                            ///
                            value={field.value || null}
                            onChange={(date) => {
                              field.onChange(moment(date).format("YYYY-MM-DD"));
                            }}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.paymentDetails?.[index]?.agencyPublishedDate
                        ? errors?.paymentDetails?.[index]?.agencyPublishedDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    label={language == "en" ? "Standard Format Size" : "मानक स्वरूप आकार"}
                    variant="standard"
                    key={witness.id}
                    {...register(`paymentDetails.${index}.standarFormatSize`)}
                    error={!!errors?.paymentDetails?.[index]?.standarFormatSize}
                    helperText={
                      errors?.paymentDetails?.[index]?.standarFormatSize
                        ? errors?.paymentDetails?.[index]?.standarFormatSize.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    //InputLabelProps={{ shrink: (watch('paymentDetails.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}
                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == "en" ? "Agency Bill Wise Rate" : "एजन्सी बिलप्रमाणे दर (प्र.से.मी)"}
                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    key={witness.id}
                    {...register(`paymentDetails.${index}.agencyBillWiseRate`)}
                    error={!!errors?.agencyBillWiseRate?.[index]?.agencyBillWiseRate}
                    helperText={
                      errors?.paymentDetails?.[index]?.agencyBillWiseRate
                        ? errors?.paymentDetails?.[index]?.agencyBillWiseRate.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    //InputLabelProps={{ shrink: (watch('paymentDetails.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}
                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == "en" ? "Calculated Rate" : "गणना केलेला दर (प्र.से.मी)"}
                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    key={witness.id}
                    {...register(`paymentDetails.${index}.calculatedRate`)}
                    error={!!errors?.paymentDetails?.[index]?.calculatedRate}
                    helperText={
                      errors?.paymentDetails?.[index]?.calculatedRate
                        ? errors?.paymentDetails?.[index]?.calculatedRate.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    //InputLabelProps={{ shrink: (watch('paymentDetails.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}
                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == "en" ? "Approved Rate" : "मंजूर दर (प्र.से.मी)"}
                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    key={witness.id}
                    {...register(`paymentDetails.${index}.approvedRate`)}
                    error={!!errors?.paymentDetails?.[index]?.approvedRate}
                    helperText={
                      errors?.paymentDetails?.[index]?.approvedRate
                        ? errors?.paymentDetails?.[index]?.approvedRate.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    //InputLabelProps={{ shrink: (watch('paymentDetails.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}
                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == "en" ? "Total Amount" : "एकूण रक्कम रु."}
                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    key={witness.id}
                    {...register(`paymentDetails.${index}.totalAmount`)}
                    error={!!errors?.paymentDetails?.[index]?.totalAmount}
                    helperText={
                      errors?.paymentDetails?.[index]?.totalAmount
                        ? errors?.paymentDetails?.[index]?.totalAmount.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    //InputLabelProps={{ shrink: (watch('paymentDetails.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}
                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == "en" ? "Penalty Deductions" : "वजा दंड र रु."}
                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    key={witness.id}
                    {...register(`paymentDetails.${index}.totalDeduction`)}
                    error={!!errors?.agencyBillWiseRate?.[index]?.totalDeduction}
                    helperText={
                      errors?.paymentDetails?.[index]?.totalDeduction
                        ? errors?.totalDeduction?.[index]?.totalDeduction.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    //InputLabelProps={{ shrink: (watch('paymentDetails.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}
                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == "en" ? "TDS Deduction" : "वजा टीडीएस र रु."}
                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    key={witness.id}
                    {...register(`paymentDetails.${index}.totalTaxDeduction`)}
                    error={!!errors?.paymentDetails?.[index]?.totalTaxDeduction}
                    helperText={
                      errors?.paymentDetails?.[index]?.totalTaxDeduction
                        ? errors?.paymentDetails?.[index]?.totalTaxDeduction.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    //InputLabelProps={{ shrink: (watch('paymentDetails.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}
                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == "en" ? "Total Payeble" : "निव्वळ देय र रु."}
                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    key={witness.id}
                    {...register(`paymentDetails.${index}.totalNetAmount`)}
                    error={!!errors?.paymentDetails?.[index]?.totalNetAmount}
                    helperText={
                      errors?.paymentDetails?.[index]?.totalNetAmount
                        ? errors?.paymentDetails?.[index]?.totalNetAmount.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      })}

      {router?.query?.pageMode === "Add" || router?.query?.pageMode === "Edit" ? (
        <div className={styles.row} style={{ marginTop: 50 }}>
          <Button disabled={btnValue} onClick={() => buttonValueSetFun()} variant="contained">
            Add News Paper
            {/* {<FormattedLabel id="witnessAdd" />} */}
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default NewsPapers;
