import { EyeTwoTone, PrinterOutlined, SearchOutlined } from '@ant-design/icons'
import { Card, Col, DatePicker, Form, Input, Row, Select, Table } from 'antd'
import React, { useState } from 'react'
import styles from './report.module.css'

import BasicLayout from '../../../../containers/Layout/BasicLayout'
import TextField from '@mui/material/TextField'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import { Button, Paper } from '@mui/material'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const DivorceReport = () => {
  const [dataSource, setDataSource] = useState()
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' })
  }
  return (
    <>
      {/* <BasicLayout titleProp={'none'}>
        <Card>
          <center>
            <h1>घटस्पोटीत व विधुर विधवा रिपोर्ट</h1>
          </center>
          <Row style={{ marginBottom: '10px' }}>
            <Col xl={22} lg={22} md={20} sm={18} xs={18}></Col>

            <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              <Button type="primary">Print</Button>
            </Col>
          </Row>
          <Row>
            <Col xl={18} lg={18} md={18} sm={18} xs={18}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <Input
                type="text"
                placeholder="Search.."
                name="search"
                suffix={<SearchOutlined />}
              ></Input>
            </Col>
          </Row>
          <br />
          <Card>
            <Row>
              <Col xl={4} lg={4} md={4} sm={24} xs={24}></Col>
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  name={'fromDate'}
                  label="From Date "
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Date',
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col xl={3} lg={3} md={3} sm={1}></Col>
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  name={'toDate'}
                  label="To Date "
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Date',
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>

            <br />
            <Row>
              <Col xl={4} lg={4} md={4} sm={24} xs={24}></Col>
              <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                <Form.Item
                  name={'Online'}
                  label="Online"
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Online',
                    },
                  ]}
                >
                  <Select placeholder="Online">
                    <Select.Option value="D1">Online 1</Select.Option>
                    <Select.Option value="D2">Online 2</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={4} md={4} sm={4}></Col>
              <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                <Form.Item
                  name={'CFC'}
                  label="CFC"
                  rules={[
                    {
                      required: true,
                      message: 'Please Select CFC',
                    },
                  ]}
                >
                  <Select placeholder="CFC">
                    <Select.Option value="CFC 1">CFC 1</Select.Option>
                    <Select.Option value="CFC 2">CFC 2</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <br />

          <ComponentToPrint dataToMap={dataSource} />
        </Card>
      </BasicLayout> */}

      <div>
        {/* <BasicLayout titleProp={'Marriage Certificate'}> */}
        <Paper>
          <div>
            <center>
              <h1>घटस्पोटीत व विधुर विधवा रिपोर्ट</h1>
            </center>
          </div>

          <div style={{ padding: 10 }}>
            <Button
              variant="contained"
              color="primary"
              style={{ float: 'right' }}
              onClick={handlePrint}
            >
              print
            </Button>
            <Button
              onClick={backToHomeButton}
              variant="contained"
              color="primary"
            >
              back To home
            </Button>
          </div>
        </Paper>
        <ComponentToPrint ref={componentRef} />
        {/* </BasicLayout> */}
      </div>
    </>
  )
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: '13px' }}>
          <div className="report">
            <Card>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>
                          घटस्पोटीत विधुर-विधवा यांच्या झालेल्या विवाह नोंदणी
                          बाबतचा रिपोर्ट
                        </b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>Sr.No.</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Registration Date</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Registration Number</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Husband Name</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Wife Name</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Marriage Date</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Husband Status</b>
                    </th>

                    <th colSpan={3}>
                      <b>Wife Status</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                  </tr>
                  {/* {this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td></td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </>
    )
  }
}
export default DivorceReport
