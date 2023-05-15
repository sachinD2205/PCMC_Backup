import { useEffect, useRef } from "react";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import { Card, Button, message } from "antd";
import { useReactToPrint } from "react-to-print";
import router from "next/router";
// import URLS from '../../urls';
import axios from "axios";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
// import { Button, Paper } from '@mui/material';
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Grid } from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";

const Index = () => {
  const [data, setData] = useState(null);

  const { handleSubmit, control, reset } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "all",
  });
  const getData = () => {
    data = {
      name: "abc",
      Sports: "Hockey",
      fromDate: "2022-12-12",
      toDate: "2022-12-13",
      venue: "xyz",
      mobileNo: "123454789",
      email: "jnkj@gmail.com",
      amount: "500",
    };
    return data;
  };
  useEffect(() => {
    const fetchedData = getData();
    setData(fetchedData);
  }, []);
  const onSubmitForm = (formData) => {
    console.log(formData);
    console.log("form data is:" + formData.ApplicationNo);
  };
  const handleReset = () => {
    reset();
  };
  return (
    <>
      <div className={styles.main}>
        <div className={styles.small}>
          <div className={styles.one}>
            <div className={styles.logo}>
              <div>
                <img src="/logo.png" alt="" height="100vh" width="100vw" />
              </div>
              <div className={styles.date}>
                <h5>Receipt No :-</h5>
                <h5>Receipt Date :-</h5>
              </div>
            </div>
            <div className={styles.middle}>
              <h3>Pimpri Chinchwad Municipal Corporation</h3>
              <h4> Mumbai-Pune Road,</h4>
              <h4>Pimpri - 411018,</h4>
              <h4> Maharashtra, INDIA</h4>
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>Payment Screen</h2>
          </div>

          {/* <div className={styles.right}>
              <div className={styles.leftt}>
                <h4>Service Name</h4>
                <h4>TP:Part Plan</h4>
                <h5>Receipt No :-</h5>
                <h5>Receipt Date :-</h5>
              </div>
              <div>
                <h4>Address</h4>
                <h5>
                  Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune
                </h5>
              </div>
  </div>*/}

          <div className={styles.two}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid
                container
                spacing={3}
                sx={{
                  marginLeft: 5,
                  marginTop: 2,
                  marginBottom: 5,
                  align: "center",
                }}
              >
                {/* <Grid item className={classes.root}xs={4} sm={4} md={4} lg={4} xl={4}>
                  <label htmlFor="name">Name :</label>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Controller
                    name="Name"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Service Name required" }}
                    render={(field) => (
                      <TextField
                        disabled
                        required
                        id="name"
                        // variant="filled"
                        onChange={field.onChange}
                        value={data?.name} //{field.value}
                        defaultValue=""
                        label={"Name"} //optional
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item className={classes.root}xs={4} sm={4} md={4} lg={4} xl={4}>
                  <label htmlFor="sports">Sport Name :</label>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Controller
                    name="sport Name"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Application No required" }}
                    render={(field) => (
                      <TextField
                        disabled
                        required
                        id="sports"
                        // variant="filled"
                        onChange={field.onChange}
                        value={data?.Sports}
                        label={"Sport Name"} //optional
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item className={classes.root}xs={4} sm={4} md={4} lg={4} xl={4}>
                  <label htmlFor="fromDate">From Date :</label>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Controller
                    name="From date"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Application Name required" }}
                    render={(field) => (
                      <TextField
                        disabled
                        required
                        id="fromDate"
                        // variant="filled"
                        onChange={field.onChange}
                        value={data?.fromDate}
                        label={"From Date"} //optional
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item className={classes.root}xs={4} sm={4} md={4} lg={4} xl={4}>
                  <label htmlFor="toDate">To Date :</label>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Controller
                    name="To Date"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Service charges required" }}
                    render={(field) => (
                      <TextField
                        disabled
                        required
                        id="toDate"
                        // variant="filled"
                        onChange={field.onChange}
                        value={data?.toDate}
                        label={"To Date"} //optional
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item className={classes.root}xs={4} sm={4} md={4} lg={4} xl={4}>
                  <label htmlFor="venue">Venue :</label>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Controller
                    name="Venue"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Service charges required" }}
                    render={(field) => (
                      <TextField
                        disabled
                        required
                        id="venue"
                        // variant="filled"
                        onChange={field.onChange}
                        value={data?.venue}
                        label={"Venue"} //optional
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item className={classes.root}xs={4} sm={4} md={4} lg={4} xl={4}>
                  <label htmlFor="phoneNo">Phone No :</label>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Controller
                    name="Phone No"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Service charges required" }}
                    render={(field) => (
                      <TextField
                        disabled
                        required
                        id="phoneNo"
                        // variant="filled"
                        onChange={field.onChange}
                        value={data?.mobileNo}
                        label={"Mobile No."} //optional
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item className={classes.root}xs={4} sm={4} md={4} lg={4} xl={4}>
                  <label htmlFor="email">Email :</label>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Controller
                    name="Email"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Service charges required" }}
                    render={(field) => (
                      <TextField
                        disabled
                        required
                        id="email"
                        // variant="filled"
                        onChange={field.onChange}
                        value={data?.email}
                        label={"Email"} //optional
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item className={classes.root}xs={4} sm={4} md={4} lg={4} xl={4}>
                  <label htmlFor="amount">Amount :</label>
                </Grid> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Controller
                    name="Amount"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Service charges required" }}
                    render={(field) => (
                      <TextField
                        disabled
                        required
                        id="amount"
                        // variant="filled"
                        onChange={field.onChange}
                        value={data?.amount} //{field.value}
                        label={"Amount"} //optional
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  {/* // add onClick to buttons */}
                  <Button
                    type="primary"
                    variant="contained"
                    size="large"
                    onClick={() => alert("Payment processing...")}
                  >
                    Pay
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Button
                    type="primary"
                    variant="contained"
                    size="large"
                    onClick={
                      () => {
                        alert("Exit payment screen...");
                      }
                      // reset();
                    }
                  >
                    Exit
                  </Button>
                </Grid>
              </Grid>
            </form>
            {/* <p>
                <b>
                  Order No.:- 001235 Shri.ABC ,Address:-Plot
                  No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
                </b>
              </p> */}
            {/* <div className={styles.order}>
                Application Fees = 20.00<br></br> Certificate/Document/Map
                Fees = 150.00 <br></br>
                ----------------------------------------------------
                <br></br> Total Amount = 170.00 <br></br>Amount in Words = One
                Hundred and Seventy Rupees Only/--
              </div> */}

            <div className={styles.enquiry}>
              <div>
                <b>For Contact :- Mobile No:-9999999999</b>
              </div>
              <div>
                <b>email:-enquiry@pcmcindia.gov.in</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
