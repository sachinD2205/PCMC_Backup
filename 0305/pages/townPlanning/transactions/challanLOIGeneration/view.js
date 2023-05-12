import React from "react";
import styles from "../challanLOIGeneration/view.module.css";

import { TextField } from "@mui/material";
import { Form, Card, Divider, DatePicker, Select, Button } from "antd";
import router from "next/router";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import KeyPressEvents from "../../../../util/KeyPressEvents";
import Head from "next/head";

const View = () => {
  return (
    <>
      <Head>
        <title>challan LOI Generation</title>
      </Head>
      <BasicLayout titleProp={"none"}>
        {/* Form Starts from here */}
        <Form
          layout="vertical"
          title="serviceForm"
          // form={serviceForm}
          // onFinish={onSave}
        >
          <Card>
            <Divider orientation="left" style={{ marginBottom: 30 }}>
              <h3>Challan LOI Generation</h3>
              <b> </b>
            </Divider>

            <div className={styles.topcolumn}>
              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: "Please Select Date",
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id="standard-basic"
                  label="Application Number"
                  variant="standard"
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </div>

            <div className={styles.row}>
              <Form.Item
                label="Date of Application: "
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: "Please Select Date",
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
                style={{ padding: 0 }}
              >
                <DatePicker
                // defaultValue={modalData.durationFrom}
                // disabled={modalType}
                // onChange={(e) => {
                //   setStartDate(moment(e).format('YYYY-MM-DD'))
                // }}
                />
              </Form.Item>
              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: "Please Select Date",
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id="standard-basic"
                  label="LOI No."
                  variant="standard"
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: "Please Select Date",
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id="standard-basic"
                  label="Applicant Name"
                  variant="standard"
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>

              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: "Please Select Date",
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id="standard-basic"
                  label="Application Received for"
                  variant="standard"
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: "Please Select Date",
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id="standard-basic"
                  label="Address of Applicant"
                  variant="standard"
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
            </div>

            <h3 className={styles.h3}>Charges Calculation</h3>

            {/* <div className={styles.row}>
              <Form.Item
                label='Charge Name '
                // style={{ padding: 0 }}
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date',
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <Select />
              </Form.Item>

              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date',
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id='standard-basic'
                  label='Amount as per Criteria'
                  variant='standard'
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date',
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id='standard-basic'
                  label='Amount'
                  variant='standard'
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
            </div>
            <div className={styles.row}>
              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date',
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id='standard-basic'
                  label='Amount in Word'
                  variant='standard'
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>

              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date',
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id='standard-basic'
                  label='SGST'
                  variant='standard'
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
              <Form.Item
                //name='applicationDate'
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date',
                  },
                  // {
                  //   type: "",
                  //   max: 10,
                  //   message: "Board Namr shoud be upto 11 numbers",
                  // },
                ]}
              >
                <TextField
                  required
                  id='standard-basic'
                  label='CGST'
                  variant='standard'
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
            </div> */}

            <div className={styles.row}>
              <div className={styles.column}>
                <Form.Item
                  label="Charge Name "
                  // style={{ padding: 0 }}
                  //name='applicationDate'
                  rules={[
                    {
                      required: true,
                      message: "Please Select Date",
                    },
                    // {
                    //   type: "",
                    //   max: 10,
                    //   message: "Board Namr shoud be upto 11 numbers",
                    // },
                  ]}
                >
                  <Select placeholder="Select Charge Name" />
                </Form.Item>

                <Form.Item
                  //name='applicationDate'
                  rules={[
                    {
                      required: true,
                      message: "Please Select Date",
                    },
                    // {
                    //   type: "",
                    //   max: 10,
                    //   message: "Board Namr shoud be upto 11 numbers",
                    // },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Amount in Word"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  />
                </Form.Item>
              </div>
              <div className={styles.column}>
                <Form.Item
                  //name='applicationDate'
                  rules={[
                    {
                      required: true,
                      message: "Please Select Date",
                    },
                    // {
                    //   type: "",
                    //   max: 10,
                    //   message: "Board Namr shoud be upto 11 numbers",
                    // },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Amount as per Criteria"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  />
                </Form.Item>
                <Form.Item
                  //name='applicationDate'
                  rules={[
                    {
                      required: true,
                      message: "Please Select Date",
                    },
                    // {
                    //   type: "",
                    //   max: 10,
                    //   message: "Board Namr shoud be upto 11 numbers",
                    // },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="SGST"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  />
                </Form.Item>
              </div>
              <div className={styles.column}>
                <Form.Item
                  //name='applicationDate'
                  rules={[
                    {
                      required: true,
                      message: "Please Select Date",
                    },
                    // {
                    //   type: "",
                    //   max: 10,
                    //   message: "Board Namr shoud be upto 11 numbers",
                    // },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Amount"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  />
                </Form.Item>
                <Form.Item
                  //name='applicationDate'
                  rules={[
                    {
                      required: true,
                      message: "Please Select Date",
                    },
                    // {
                    //   type: "",
                    //   max: 10,
                    //   message: "Board Namr shoud be upto 11 numbers",
                    // },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="CGST"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Buttons */}
            <div className={styles.buttons}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>

              <Button type="primary" htmlType="submit">
                Generate
              </Button>
              <Button
                // onClick={resetFrom}
                danger
                htmlType="submit"
                // style={{ color: 'white', backgroundColor: 'orange' }}
                type="default"
              >
                Clear
              </Button>
              <Button
                // onClick={cancelForm}
                type="primary"
                danger
                onClick={() =>
                  router.push(`/townPlanning/transactions/challanLOIGeneration`)
                }
              >
                Exit
              </Button>
              <Button
                // onClick={resetFrom}
                htmlType="submit"
                style={{ color: "white", backgroundColor: "orange" }}
                type="default"
              >
                Help
              </Button>
            </div>
          </Card>
        </Form>
      </BasicLayout>
    </>
  );
};

export default View;
