// http://localhost:4000/townPlanning/transactions/scrutinyForm/view

import React from 'react'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Radio,
  Checkbox,
  Select,
  DatePicker,
} from 'antd'
import { TextField } from '@mui/material'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import Head from 'next/head'
import { Option } from 'antd/lib/mentions'

const View = () => {
  return (
    <>
      <Head>
        <title>Scrutiny Form</title>
      </Head>
      <BasicLayout>
        <Card>
          <Row>
            <Col xl={10} lg={9} md={8} sm={6} xs={2}></Col>
            <Col xl={5} lg={6} md={8}>
              <h3>Scrutiny Form</h3>
            </Col>
          </Row>
        </Card>

        <Form layout='vertical'>
          <Card>
            <Row>
              <Col xs={10}></Col>
              <Col>
                <Form.Item>
                  <TextField
                    // defaultValue={modalData.serviceCharges}
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Detailed Remark',
                      },
                    ]}
                    // disabled={modalType}
                    id='standard-basic'
                    label='Application No.'
                    name='documentChecklist'
                    variant='standard'
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  />
                </Form.Item>
              </Col>
              <Col xs={10}></Col>
            </Row>

            <Row style={{ margin: '20px' }}>
              <Col xs={10}></Col>

              <Col>
                <h3>Departmental Remark</h3>
              </Col>

              <Col xs={10}></Col>
            </Row>
            <Row>
              <Col></Col>
            </Row>

            <Row>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='Land Details'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='BRT Corridore'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='Flood Line'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='Red Zone/ Buffer Zone'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='Reservation Detail'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='Road Width'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='Planned Road'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='Area Zone'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={2}></Col>
              <Col xs={5} lg={6}>
                <Form.Item
                  label='Special Zone'
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Site',
                    },
                  ]}
                >
                  <Select
                    defaultValue='Select'
                    style={{
                      width: 120,
                    }}
                  >
                    <Option value='Male'>Jack</Option>
                    <Option value='Female'>Lucy</Option>
                    <Option value='Other'>yiminghe</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              {/* style={{marginTop:30}}> */}
              <Col xs={2}></Col>

              <Col xs={5} lg={6}>
                <Form.Item>
                  <TextField
                    // defaultValue={modalData.serviceCharges}
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Detailed Remark',
                      },
                    ]}
                    // disabled={modalType}
                    id='standard-basic'
                    label='Detailed Remark'
                    name='documentChecklist'
                    variant='standard'
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  />
                </Form.Item>
              </Col>

              {/* END//// */}
            </Row>

            <Row style={{ marginTop: 50 }}>
              <Col xs={8}></Col>

              <Col>
                <Button>Submit</Button>
              </Col>
              <Col xs={2}></Col>

              <Col>
                <Button>Generate LOI</Button>
              </Col>
              <Col xs={2}></Col>

              <Col>
                <Button>Print</Button>
              </Col>
              <Col xs={2}></Col>

              <Col xs={8}></Col>
            </Row>
          </Card>
        </Form>
      </BasicLayout>
    </>
  )
}

export default View
