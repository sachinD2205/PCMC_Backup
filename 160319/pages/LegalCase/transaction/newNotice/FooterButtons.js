import React from "react";
import { useRouter } from "next/router";
import { Button, Grid } from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

const FooterButtons = ({ handleBack, activeStep, steps }) => {
  const router = useRouter();

  return (
    <Grid container sx={{ padding: "10px" }}>
      <Grid
        item
        xs={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={() => router.push(`/LegalCase/transaction/newNotice/`)}
        >
          <FormattedLabel id="exit" />
        </Button>
      </Grid>
      <Grid item xs={9}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleBack}
          disabled={activeStep == 0}
          sx={{ mr: 1 }}
          size="small"
        >
          <FormattedLabel id="back" />
        </Button>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {activeStep !== steps.length && (
          <Button
            color="primary"
            variant="contained"
            type="submit"
            size="small"
          >
            <FormattedLabel id="saveAndNext" />
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default FooterButtons;
