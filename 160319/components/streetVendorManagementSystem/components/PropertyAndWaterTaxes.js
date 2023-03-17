import { Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../styles/view.module.css";

/** Sachin Durge */
// PropertyAndWaterTaxes
const PropertyAndWaterTaxes = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

  const [shrink1, setShrink1] = useState();
  const [shrink2, setShrink2] = useState();

  // Pay Button
  const payBtn = () => {
    toast.success("Paid Successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // view
  return (
    <>
      <ToastContainer />
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong> {<FormattedLabel id="propertyTaxes" />}</strong>
      </div>

      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
          <TextField
            autoFocus
            disabled={watch("disabledFieldInputState")}
            id="standard-basic"
            variant="standard"
            label=<FormattedLabel id="propertyTaxNumber" />
            {...register("propertyTaxNumber")}
            error={!!errors.propertyTaxNumber}
            helperText={errors?.propertyTaxNumber ? errors.propertyTaxNumber.message : null}
          />
        </Grid>
        {watch("disabledFieldInputState") ? (
          <></>
        ) : (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
            <div className={styles.btn1}>
              <Button
                className={styles.pay1}
                sx={{ marginRight: 8 }}
                variant="contained"
                //  padding="20px"
                color="primary"
                // endIcon={<ClearIcon />}
                onClick={() => {
                  setShrink1(true);
                  setValue("proprtyAmount", "15000");
                }}
              >
                {<FormattedLabel id="viewBill" />}
              </Button>
            </div>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
          <TextField
            id="standard-basic"
            disabled={watch("disabledFieldInputState")}
            InputLabelProps={{ shrink: shrink1 }}
            label={<FormattedLabel id="proprtyAmount" />}
            {...register("proprtyAmount")}
            error={!!errors.proprtyAmount}
            helperText={errors?.proprtyAmount ? errors.proprtyAmount.message : null}
          />
        </Grid>
        {watch("disabledFieldInputState") ? (
          <></>
        ) : (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
            <div className={styles.btn1}>
              <Button
                className={styles.pay1}
                sx={{ marginRight: 8 }}
                variant="contained"
                //  padding="20px"
                color="primary"
                // endIcon={<ClearIcon />}
                onClick={() => payBtn()}
              >
                {<FormattedLabel id="pay" />}
              </Button>
            </div>
          </Grid>
        )}
      </Grid>

      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong>
          <FormattedLabel id="waterTaxes" />
        </strong>
      </div>

      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}

          <TextField
            disabled={watch("disabledFieldInputState")}
            autoFocus
            id="standard-basic"
            variant="standard"
            label=<FormattedLabel id="waterConsumerNo" />
            {...register("waterConsumerNo")}
            error={!!errors.waterConsumerNo}
            helperText={errors?.waterConsumerNo ? errors.waterConsumerNo.message : null}
          />
        </Grid>
        {watch("disabledFieldInputState") ? (
          <></>
        ) : (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
            <div className={styles.btn1}>
              <Button
                className={styles.pay1}
                sx={{ marginRight: 8 }}
                variant="contained"
                //  padding="20px"
                color="primary"
                // endIcon={<ClearIcon />}
                onClick={() => {
                  setShrink2(true);
                  setValue("waterAmount", "250");
                }}
              >
                {<FormattedLabel id="viewBill" />}
              </Button>
            </div>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
          <TextField
            disabled={watch("disabledFieldInputState")}
            id="standard-basic"
            InputLabelProps={{ shrink: shrink2 }}
            label={<FormattedLabel id="waterAmount" />}
            {...register("waterAmount")}
            error={!!errors.waterAmount}
            helperText={errors?.waterAmount ? errors.waterAmount.message : null}
          />
        </Grid>
        {watch("disabledFieldInputState") ? (
          <></>
        ) : (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
            <div className={styles.btn1}>
              <Button
                className={styles.pay1}
                sx={{ marginRight: 8 }}
                variant="contained"
                color="primary"
                // endIcon={<ClearIcon />}
                onClick={() => payBtn()}
              >
                {<FormattedLabel id="pay" />}
              </Button>
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default PropertyAndWaterTaxes;
