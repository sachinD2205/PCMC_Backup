import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
} from 'antd'
import React from 'react'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import useForm from 'react'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import axios from 'axios'
import { useRouter } from 'next/router'
import moment from 'moment'
import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons'
import urls from '../../../../URLS/urls'

const View = () => {
  const [inputStateSave, setInputStateSave] = useState(false)
  const [taskTransferForm] = Form.useForm()
  const [formDuration, setFormDuration] = useState()
  const [toDuration, setToDuration] = useState()

  // preview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }

  // router
  const router = useRouter()

  // moveForward Button
  const moveForward = () => {
    alert('Move Forward Button Clicked !!!')
  }

  // moveBackward Button
  const moveBackward = () => {
    alert('Move Backward Button Clikced !!!')
  }

  // file Upload/Image
  const handleFile = () => {
    alert(' File Upload !!!')
  }

  // reset Form
  const resetForm = () => {
    taskTransferForm.resetFields()
  }

  // Post Api
  // handleSave Fun
  const handleSave = async () => {
    setInputStateSave(true)
    // get Form Values
    const allFields = taskTransferForm.getFieldValue()

    // setUpdated Values
    const bodyForApi = {
      ...allFields,
      toDuration,
      formDuration,
    }

    await axios
      .post(`${urls.MR}/api/TaskTransfer/saveTaskTransfer`, bodyForApi)
      .then((resp) => {
        if (resp.status == 200) {
          message.success('All Data Saved !!!')
          taskTransferForm.resetFields()
          router.push(`/marriageRegistration/transactions/taskTransfer`)
        }
      })
  }

  // view
  return (
    <div>
      <BasicLayout titleProp={'Task Transfer'}>
        <Form
          title='taskTransfer'
          form={taskTransferForm}
          layout='vertical'
          onFinish={handleSave}
        >
          {/** Rows */}
          <Row>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
              <Form.Item
                name={'departmentName'}
                label='Deparment Name'
                rules={[
                  {
                    required: true,
                    message: 'Deparment Name Selection is Required !!!',
                  },
                ]}
              >
                <Select placeholder='Select Deparment Name'>
                  <Select.Option value='Deparment Name 1'>
                    deparment 1
                  </Select.Option>
                  <Select.Option value='Deparment Name 2'>
                    deparment 2
                  </Select.Option>
                  <Select.Option value='Deparment Name 3'>
                    deparment 3
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
              <Form.Item
                name={'taskServiceName'}
                label='Task/Service Name'
                rules={[
                  {
                    required: true,
                    message: 'Task/Service Name Selection is Required !!!',
                  },
                ]}
              >
                <Select placeholder='Select Task/Service Name'>
                  <Select.Option value='Task/Service Name 1'>
                    Task/Service Name 1
                  </Select.Option>
                  <Select.Option value='Task/Service Name 2'>
                    Task/Service Name 2
                  </Select.Option>
                  <Select.Option value='Task/Service Name 3'>
                    Task/Service Name 3
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
              <Form.Item
                name={'employeeNameTransferFrom'}
                label='
            Employee Name (Transfer From)'
                rules={[
                  {
                    required: true,
                    message:
                      'Employee Name Transfer Form Selection is Required !',
                  },
                ]}
              >
                <Select placeholder='Select Employee Name Transfer Form'>
                  <Select.Option value='employeeNameTF1'>
                    Employee Name TF 1
                  </Select.Option>
                  <Select.Option value='employeeNameTF2'>
                    Employee Name TF 2
                  </Select.Option>
                  <Select.Option value='employeeNameTF3'>
                    Employee Name TF 3
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
              <Form.Item
                name={'employeeNameTransferTo'}
                label='Employee Name(Transfer To)'
                rules={[
                  {
                    required: true,
                    message:
                      'Employee Name Transfer To Selection is Required !',
                  },
                ]}
              >
                <Select placeholder='Select Employee Name Transfer To'>
                  <Select.Option value='employeeNameTT1'>
                    Employee Name TF 1
                  </Select.Option>
                  <Select.Option value='employeeNameTT2'>
                    Employee Name TF 2
                  </Select.Option>
                  <Select.Option value='employeeNameTT3'>
                    Employee Name TF 3
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
              <Form.Item
                name={'fromDuration'}
                label='From Duration'
                rules={[
                  {
                    required: true,
                    message: 'Form Duration Duration is Required !!!',
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => {
                    setFormDuration(
                      moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD')
                    )
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
              <Form.Item
                name={'toDuration'}
                label='To Duration'
                rules={[
                  {
                    required: true,
                    message: 'To Duration is Required !!!',
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => {
                    setToDuration(moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD'))
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          {/** Row End */}

          {/** Buttons */}
          <br />
          <Row>
            <Col xl={8} lg={8} md={8} sm={8}></Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={24}>
              <Button type='primary' onClick={moveForward}>
                Move Forward
              </Button>
            </Col>

            <Col xl={4} lg={4} md={4} sm={4} xs={24}>
              <Button type='primary' onClick={moveBackward}>
                Move BackWard
              </Button>
            </Col>
          </Row>
          {/** Buttons End  */}

          {/** Next Rows  */}
          <br />
          <Row>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={24}>
              <Form.Item
                label='Reason for Task Transfer'
                name='reasonForTaskTransfer'
                rules={[
                  {
                    required: false,
                    message: 'Please Upload Documents',
                  },
                ]}
              >
                {/**
         <Input
           // @ts-ignore
           labelCol={{ xs: 8 }}
           wrapperCol={{ xs: 8 }}
           accept="image/*"
           type={'file'}
           name={'file'}
           onChange={(e) => handleFile(e)}
         ></Input>
        */}

                {/** File Upload Antd */}
                <Upload.Dragger
                  onPreview={handlePreview}
                  maxCount={1}
                  // multiple files allowed or not
                  multiple={false}
                  // File Types which want you to allow upload
                  accept='.png,.jpeg,.jpg,.pdf'
                  // Action where you want to save
                  action={`${urls.MR}/TaskTransfer/saveTaskTransfer`}
                  // preview pic
                  //listType='picture'
                  //listType='text'
                  listType='picture-card'
                  // Before Upload  - Size Check
                  beforeUpload={(file) => {
                    console.log(file.size)
                    if (file.size >= 2097152) {
                      message.error('File Should not be more than 2 MB !')
                      return false
                    } else {
                      return true
                    }
                  }}
                >
                  {/**<CloudUploadOutlined />*/}
                  {/** 
       <UploadOutlined />
      */}
                  {/**Drag Files Here or <br /> */}

                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload.Dragger>
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={3} lg={3} md={3} sm={3} xs={24}>
              <Form.Item
                name={'counterNo'}
                rules={[
                  {
                    required: true,
                    message: 'Counter Number is Required !!!',
                  },
                ]}
              >
                <TextField
                  required
                  id='standard-basic'
                  label='Counter Number'
                  variant='standard'
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={3} lg={3} md={3} sm={3} xs={24}>
              <Form.Item name={'remarks'}>
                <TextField
                  id='standard-basic'
                  label='Remarks'
                  variant='standard'
                  onKeyPress={KeyPressEvents.isInputVarchar}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={3} lg={3} md={3} sm={3} xs={24}>
              <Form.Item
                label='Attach File'
                name='attachFile'
                rules={[
                  {
                    required: false,
                    message: 'Please Upload Documents',
                  },
                ]}
              >
                <Input
                  // @ts-ignore
                  labelCol={{ xs: 8 }}
                  wrapperCol={{ xs: 8 }}
                  accept='image/*'
                  type={'file'}
                  name={'file'}
                  onChange={(e) => handleFile(e)}
                ></Input>
              </Form.Item>
            </Col>
          </Row>

          {/** Start Buttons -  View / Edit / Delete  */}
          <Row>
            <Col sm={2} md={4} lg={4} xl={8}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              <Button
                type='primary'
                disabled={inputStateSave}
                htmlType='submit'
              >
                Save
              </Button>
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button onClick={resetForm}>Reset</Button>
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                danger
                onClick={() => {
                  router.push(`/marriageRegistration/transactions/taskTransfer`)
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
          {/** End  Buttons -  View / Edit / Delete  */}
        </Form>
      </BasicLayout>
    </div>
  )
}

export default View
