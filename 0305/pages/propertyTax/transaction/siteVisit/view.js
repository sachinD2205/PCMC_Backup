import React from "react"
import BasicLayout from "../../../../containers/Layout/BasicLayout"
import { Button, Col, Form, message, Row, Select } from "antd"
import DatePicker from "antd/lib/date-picker"
import KeyPressEvents from "../../../../util/KeyPressEvents"
import { useState } from "react"
import { TextField } from "@mui/material"
import moment from "moment"

// http://localhost:4000/hawkerManagementSystem/transactions/siteVisit/view
const View = () => {
  const [siteVisit] = Form.useForm()
  const [toDate, setToDate] = useState()
  const [fromDate, setFromDate] = useState()

  // HandleSAve
  const handleSave = () => {}

  // view
  return (
    <div>
      <BasicLayout titleProp={"Site Visit"}>
        <Form
          title="Site Visit"
          layout="vertical"
          Form={siteVisit}
          onFinish={handleSave}
        >
          {/** 1 st Row */}
          <Row>
            <Col xl={5} lg={5} md={24}></Col>
            <Col xl={6} lg={6} md={6} sm={6} xs={24}>
              <Form.Item
                name={"fromDate"}
                label="From Date"
                rules={[
                  {
                    required: true,
                    message: "From Date Selection is Required !!!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => {
                    setFromDate(moment(e, "YYYY-MM-DD").format("YYYY-MM-DD"))
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={6} lg={6} md={6} sm={6} xs={24}>
              <Form.Item
                name={"toDate"}
                label="To Date"
                rules={[
                  {
                    required: true,
                    message: "From Date Selection is Required !!!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => {
                    setToDate(moment(e, "YYYY-MM-DD").format("YYYY-MM-DD"))
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/** Next Row  */}
          <Row>
            <Col xl={3} lg={3} md={24}></Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={24}>
              <Form.Item
                name={"online"}
                label="Online"
                rules={[
                  {
                    required: true,
                    message: "Online Option Selection is Required !!!",
                  },
                ]}
              >
                <Select placeholder="Select Online Otion">
                  <Select.Option value="Option1">Option1</Select.Option>
                  <Select.Option value="Option2">Option2</Select.Option>
                  <Select.Option value="Option3">Option3</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={24}>
              <Form.Item
                name={"cFC"}
                label="CFC"
                rules={[
                  {
                    required: true,
                    message: "CFC Selection is Required !!!",
                  },
                ]}
              >
                <Select placeholder="Select CFC">
                  <Select.Option value="CFC1">CFC1</Select.Option>
                  <Select.Option value="CFC2">CFC2</Select.Option>
                  <Select.Option value="CFC3">CFC3</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                name={"applicationNo"}
                rules={[
                  {
                    required: true,
                    message: "Application No is Required !!!",
                  },
                ]}
              >
                <TextField
                  required
                  id="standard-basic"
                  label="Application NO."
                  variant="standard"
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
              </Form.Item>
            </Col>
          </Row>
          <br></br>
          <h1>Hawker Info </h1>
        </Form>
      </BasicLayout>
    </div>
  )
}

export default View
