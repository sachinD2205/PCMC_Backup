import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
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
import urls from '/URLS/urls'
import { PlusOutlined } from '@ant-design/icons'
import { Image } from 'next/image'
import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons'

// getBase64 view
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
  })

// component
const View = () => {
  const [inputStateSave, setInputStateSave] = useState(false)
  const [taskTransferForm] = Form.useForm()
  const [fromDuration, setfromDuration] = useState()
  const [toDuration, setToDuration] = useState()

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

  // reset Form
  const resetForm = () => {
    taskTransferForm.resetFields()
  }

  // const for File Upload
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const [files, setFiles] = useState()
  const [file1, setFile1] = useState()
  const [file2, setFile2] = useState()
  const [defaultFileList, setDefaultFileList] = useState([])
  const [progress, setProgress] = useState(0)
  const [config1, setConfig1] = useState()

  // cancell preview
  const handleCancel = () => setPreviewVisible(false)

  // handlePreview
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

  // Handle Change - On Change
  const handleOnChange = ({ file, fileList, event }) => {
    console.log(file, fileList, event)
    //Using Hooks to update the state to the current filelist
    setDefaultFileList(fileList)
    //filelist - [{uid: "-1",url:'Some url to image'}]
  }

  // CustomRequest handler
  const uploadImage = (options) => {
    const { onSuccess, onError, file, filename, onProgress } = options
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        console.log((event.loaded / event.total) * 100)
        onProgress({ percent: (event.loaded / event.total) * 100 }, file)
      },
    }

    if (filename == 'reasonForTaskTranfer') {
      setFile1(file)
    } else if (filename == 'attachFile') {
      setFile2(file)
    }
  }

  // handleSave Fun
  const handleSave = async () => {
    setInputStateSave(true)
    // get Form Values
    const allFields = taskTransferForm.getFieldValue()
    const bodyForApi = {
      ...allFields,
      toDuration,
      fromDuration,
    }

    // FormData
    let formData = new FormData()
    formData.append('taskTransferDao', JSON.stringify(bodyForApi))
    formData.append(`multipartFiles`, file1)
    formData.append(`multipartFiles`, file2)

    // Post -API
    let res = await axios
      .post(`${urls.CFCURL}/TaskTransfer/saveTaskTransfer`, formData, config1)
      .then((resp) => {
        if (resp.status == 200) {
          message.success('All Data Saved !!!')
          // taskTransferForm.resetFields();
          // router.push(`/citizenFacilitationCenter/transactions/taskTransfer`);
        }
      })
    console.log(res)
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
                    setfromDuration(
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
            {/** Photo */}
            <Col xl={4} lg={4} md={4} sm={4} xs={24}>
              {/** Attach File Photo */}
              <Form.Item
                label='Reason for Task Transfer'
                // name='reasonForTaskTranfer'
                rules={[
                  {
                    required: false,
                    message: 'Please Upload Documents',
                  },
                ]}
              >
                {/** File Upload Antd */}
                <Upload
                  name='reasonForTaskTranfer'
                  onPreview={handlePreview}
                  // multiple={true}
                  customRequest={uploadImage}
                  onChange={(options) => {
                    handleOnChange(options)
                  }}
                  //fileList={fileList}
                  maxCount={1}
                  accept='.png,.jpeg,.jpg,.pdf'
                  listType='picture-card'
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
                  <Button icon={<UploadOutlined />}>Upload</Button>

                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <Image
                      alt='example'
                      style={{
                        width: '100%',
                      }}
                      src={previewImage}
                    />
                  </Modal>
                </Upload>
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
              {/** Attach File Photo */}
              <Form.Item
                label='Attach File'
                //name="attachFile"
                rules={[
                  {
                    required: false,
                    message: 'Please Upload Documents',
                  },
                ]}
              >
                {/** File Upload Antd */}
                <Upload
                  // multiple={true}
                  name='attachFile'
                  onPreview={handlePreview}
                  customRequest={uploadImage}
                  // onChange={handleOnChange}
                  // fileList={fileList}
                  //onChange={(file) => handleOnChange(file, 'd1')}
                  // customRequest={(file) => handleChange(file)}

                  maxCount={1}
                  accept='.png,.jpeg,.jpg,.pdf'
                  listType='picture-card'
                  beforeUpeload={(file) => {
                    console.log(file.size)
                    if (file.size >= 2097152) {
                      message.error('File Should not be more than 2 MB !')
                      return false
                    } else {
                      return true
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>

                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <Image
                      alt='example'
                      style={{
                        width: '100%',
                      }}
                      src={previewImage}
                    />
                  </Modal>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/** Start Buttons -  View / Edit / Delete  */}
          <Row>
            <Col sm={2} md={4} lg={4} xl={8}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              <Button
                type='primary'
                // disabled={inputStateSave}
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
                  router.push(
                    `/citizenFacilitationCenter/transactions/taskTransfer`
                  )
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
