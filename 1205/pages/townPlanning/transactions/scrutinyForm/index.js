import React from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Card, Button, Table, Col, Row } from "antd";
import { useRouter } from "next/router";
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import Head from "next/head";

const Index = () => {
  const cols = [
    {
      title: "Application Date",
      dataIndex: "appDate",
    },
    {
      title: "Application Number",
      dataIndex: "serviceName",
    },
    {
      title: "Subject (Service Name)",
      dataIndex: "durationFrom",
    },
    {
      title: "Title",
      dataIndex: "durationTo",
    },
    {
      title: "First Name",
      dataIndex: "serviceCharges",
    },
    {
      title: "Middle Name",
      dataIndex: "certificateCharges",
    },
    {
      title: "Surname/Last Name",
      dataIndex: "freeFirstCertificateCopy",
    },
    {
      title: "Gender",
      dataIndex: "delayCharges",
    },
    {
      title: "Reservation No.",
      dataIndex: "dependsOn",
    },
    {
      title: "TDR Zone",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Village Name",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Gat No.",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Pincode",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Aadhaar No.",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Pan No.",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Mobile",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Email Address",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Service Completion Date",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Actions",
      width: "56px",
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EditTwoTone
                // onClick={() => showModalForEdit(record)}
                />
                <DeleteOutlined
                //   onClick={() => deleteRecord(record)}
                />
                <EyeTwoTone
                //   onClick={() => showModalForView(record)}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  const router = useRouter();
  return (
    <>
      <Head>
        <title>Scrutiny Form</title>
      </Head>
      <BasicLayout titleProp={"none"}>
        <Card>
          <Row>
            <Col xl={22} lg={21} md={20} sm={19}></Col>
            <Col>
              <Button
                onClick={() =>
                  router.push(`/townPlanning/transactions/scrutinyForm/view`)
                }
              >
                Add New
              </Button>
            </Col>
          </Row>
        </Card>

        <Card>
          <Table
            bordered
            columns={cols}
            scroll={{ x: 400 }}
            // dataSource={dataSource}
          />
        </Card>
      </BasicLayout>
    </>
  );
};

export default Index;
