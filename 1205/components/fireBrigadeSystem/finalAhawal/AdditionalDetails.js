import { Box, Grid, TextField } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";

import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// http://localhost:4000/hawkerManagementSystem/transactions/components/AdditionalDetails
const AdditionalDetails = () => {
  const [value, setValue] = React.useState(new Date());

  const [valueDate, setValueDate] = React.useState(new Date());
  const [valueDateTime, setValueDateTime] = React.useState(new Date());
  const [valueDateTimeVardi, setValueDateTimeVardi] = React.useState(
    new Date()
  );

  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  // finacialLoss
  // finacialLossMr
  // lossOfBuildingMaterial
  // lossOfBuildingMaterialMr
  // otherOutsideLoss
  // otherOutsideLossMr
  // actual
  // saveOfLoss
  // officerNameToReleaseVehicle
  // dateAndTimeOfVardi
  // totalTimeConsumedAtLocationInHrsAndMinutes

  return (
    <>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="finacialLoss" />}
            variant="standard"
            {...register("finacialLoss")}
            error={!!errors.finacialLoss}
            helperText={
              errors?.finacialLoss ? errors.finacialLoss.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="lossOfBuildingMaterial" />}
            variant="standard"
            {...register("lossOfBuildingMaterial")}
            error={!!errors.lossOfBuildingMaterial}
            helperText={
              errors?.lossOfBuildingMaterial
                ? errors.lossOfBuildingMaterial.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="otherOutsideLoss" />}
            variant="standard"
            {...register("otherOutsideLoss")}
            error={!!errors.otherOutsideLoss}
            helperText={
              errors?.otherOutsideLoss ? errors.otherOutsideLoss.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="finacialLossMr" />}
            variant="standard"
            {...register("finacialLossMr")}
            error={!!errors.finacialLossMr}
            helperText={
              errors?.finacialLossMr ? errors.finacialLossMr.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="lossOfBuildingMaterialMr" />}
            variant="standard"
            {...register("lossOfBuildingMaterialMr")}
            error={!!errors.lossOfBuildingMaterialMr}
            helperText={
              errors?.lossOfBuildingMaterialMr
                ? errors.lossOfBuildingMaterialMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="otherOutsideLossMr" />}
            variant="standard"
            {...register("otherOutsideLossMr")}
            error={!!errors.otherOutsideLossMr}
            helperText={
              errors?.otherOutsideLossMr
                ? errors.otherOutsideLossMr.message
                : null
            }
          />
        </Grid>
      </Grid>

      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="actual" />}
            variant="standard"
            {...register("actual")}
            error={!!errors.actual}
            helperText={errors?.actual ? errors.actual.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="saveOfLoss" />}
            variant="standard"
            {...register("saveOfLoss")}
            error={!!errors.saveOfLoss}
            helperText={errors?.saveOfLoss ? errors.saveOfLoss.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="constructionLoss" />}
            variant="standard"
            {...register("constructionLoss")}
            error={!!errors.constructionLoss}
            helperText={
              errors?.constructionLoss ? errors.constructionLoss.message : null
            }
          />
        </Grid>
        <Grid item xs={12} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="fireLossInformationDetails" />}
            variant="standard"
            {...register("fireLossInformationDetails")}
            error={!!errors.fireLossInformationDetails}
            helperText={
              errors?.fireLossInformationDetails
                ? errors.fireLossInformationDetails.message
                : null
            }
          />
        </Grid>
        <Grid item xs={12} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="fireLossInformationDetailsMr" />}
            variant="standard"
            {...register("fireLossInformationDetailsMr")}
            error={!!errors.fireLossInformationDetailsMr}
            helperText={
              errors?.fireLossInformationDetailsMr
                ? errors.fireLossInformationDetailsMr.message
                : null
            }
          />
        </Grid>
        {/* 
        <Grid item xs={4} sx={{ marginTop: "5%" }} className={styles.feildres}>
          <FormControl
            sx={{ width: "65%" }}
            error={!!errors.dateAndTimeOfVardi}
          >
            <Controller
              control={control}
              name="dateAndTimeOfVardi"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
               
                  <DateTimePicker
                    renderInput={(props) => (
                       <TextField
  sx={{width: "80%"}} size="small" {...props} />
                    )}
                    label={<FormattedLabel id="dateAndTimeOfVardi" />}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                  />
                </LocalizationProvider>
              )}
            />

            <FormHelperText>
              {errors?.dateAndTimeOfVardi
                ? errors.dateAndTimeOfVardi.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={4} className={styles.feildres}>
          <FormControl
            style={{ marginTop: 10 }}
            error={!!errors.dateAndTimeOfVardi}
          >
            <Controller
              control={control}
              // defaultValue={moment(dateAndTimeOfVardi).format(
              //   "YYYY-DD-MMThh:mm:ss"
              // )}
              name="dateAndTimeOfVardi"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    readOnly
                    label={<FormattedLabel id="dateAndTimeOfVardi" />}
                    value={field.value}
                    // onChange={(date) =>
                    //   field.onChange(
                    //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                    //   )
                    // }
                    //selected={field.value}
                    renderInput={(params) => (
                       <TextField
  sx={{width: "80%"}} size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.dateAndTimeOfVardi
                ? errors.dateAndTimeOfVardi.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={4} sx={{ marginTop: "5%" }} className={styles.feildres}>
          <FormControl sx={{ width: "65%" }} error={!!errors.vardiDispatchTime}>
            <Controller
              control={control}
              name="totalTimeConsumedAtLocationInHrsAndMinutes"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <TimePicker
                    label={
                      <FormattedLabel id="totalTimeConsumedAtLocationInHrsAndMinutes" />
                    }
                    // label="Total Time Consumed at Location in Hrs and Minutes *"
                    value={field.value}
                    onChange={(time) => field.onChange(time)}
                    selected={field.value}
                    renderInput={(params) => (
                       <TextField
  sx={{width: "80%"}} size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.vardiDispatchTime
                ? errors.vehicleDispatchTime.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
      </Grid>

      {/* <div>
            <FormControl
              style={{ marginTop: 10 }}
              error={!!errors.dateAndTimeOfVardi}
            >
              <Controller
                control={control}
                name="dateAndTimeOfVardi"
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      renderInput={(props) =>  <TextField
  sx={{width: "80%"}} {...props} />}
                      label={<FormattedLabel id="dateAndTimeOfVardi" />}
                      value={field.value}
                      selected={field.value}
                      onChange={(date) =>
                        field.onChange(
                          moment(date).format("YYYY-MM-DD hh:mm:ss")
                          // moment(date).format("YYYY-MM-DDThh:mm:ss")
                        )
                      }
                    /> 
                    <DateTimePicker
                      renderInput={(props) =>  <TextField
  sx={{width: "80%"}} {...props} />}
                      label={<FormattedLabel id="dateAndTimeOfVardi" />}
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              <FormHelperText>
                {errors?.dateAndTimeOfVardi
                  ? errors.dateAndTimeOfVardi.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div> */}

      {/* <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={(props) =>  <TextField
  sx={{width: "80%"}} {...props} />}
                label="Vehicle Left at Location Date and Time"
                value={valueDateTimeVardi}
                onChange={(newValue) => {
                  setValueDateTimeVardi(newValue);
                }}
              />
            </LocalizationProvider>
          </div> */}

      <br />
      <br />
      <Box className={styles.tableHead}>
        <Box className={styles.feildHead}>
          {<FormattedLabel id="paymentDetails" />}
        </Box>
      </Box>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            // size="small"
            id="standard-basic"
            // label={<FormattedLabel id="billPayerName" />}
            label="First Name"
            variant="standard"
            {...register("billPayerName")}
            error={!!errors.billPayerName}
            helperText={
              errors?.billPayerName ? errors.billPayerName.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="billPayerMiddleName" />}
            label="Middle Name"
            variant="standard"
            {...register("billPayerMiddleName")}
            error={!!errors.billPayerMiddleName}
            helperText={
              errors?.billPayerMiddleName
                ? errors.billPayerMiddleName.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="billPayerLastName" />}
            label="Last Name"
            variant="standard"
            {...register("billPayerLastName")}
            error={!!errors.billPayerLastName}
            helperText={
              errors?.billPayerLastName
                ? errors.billPayerLastName.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="billPayerNameMr" />}
            label="Name (In Marathi)"
            variant="standard"
            {...register("billPayerNameMr")}
            error={!!errors.billPayerNameMr}
            helperText={
              errors?.billPayerNameMr ? errors.billPayerNameMr.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="billPayerMiddleMr" />}
            label="Middle Name (In Marathi)"
            variant="standard"
            {...register("billPayerMiddleMr")}
            error={!!errors.billPayerMiddleMr}
            helperText={
              errors?.billPayerMiddleMr
                ? errors.billPayerMiddleMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="billPayerLastNameMr" />}
            label="Last Name (In Marathi)"
            variant="standard"
            {...register("billPayerLastNameMr")}
            error={!!errors.billPayerLastNameMr}
            helperText={
              errors?.billPayerLastNameMr
                ? errors.billPayerLastNameMr.message
                : null
            }
          />
        </Grid>
      </Grid>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="area" />}
            variant="standard"
            {...register("billPayeraddress")}
            error={!!errors.billPayeraddress}
            helperText={
              errors?.billPayeraddress ? errors.billPayeraddress.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="city" />}
            variant="standard"
            {...register("billPayerVillage")}
            error={!!errors.billPayerVillage}
            helperText={
              errors?.billPayerVillage ? errors.billPayerVillage.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="contactNumber" />}
            variant="standard"
            {...register("billPayerContact")}
            error={!!errors.billPayerContact}
            helperText={
              errors?.billPayerContact ? errors.billPayerContact.message : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="areaMr" />}
            variant="standard"
            {...register("billPayeraddressMr")}
            error={!!errors.billPayeraddressMr}
            helperText={
              errors?.billPayeraddressMr
                ? errors.billPayeraddressMr.message
                : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="cityMr" />}
            variant="standard"
            {...register("billPayerVillageMr")}
            error={!!errors.billPayerVillageMr}
            helperText={
              errors?.billPayerVillageMr
                ? errors.billPayerVillageMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="email" />}
            variant="standard"
            {...register("billPayerEmail")}
            error={!!errors.billPayerEmail}
            helperText={
              errors?.billPayerEmail ? errors.billPayerEmail.message : null
            }
          />
        </Grid>
      </Grid>
      <br />
      <br />

      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>
    </>
  );
};

export default AdditionalDetails;
