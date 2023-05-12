import React from "react";

import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Card, Button, Table, Col, Row } from "antd";
import { useRouter } from "next/router";
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import Head from "next/head";

const Index = () => {
  const cols = [
    {
      title: "Application Number",
      dataIndex: "serviceName",
    },
    {
      title: "LOI No.",
      dataIndex: "durationFrom",
    },
    {
      title: "Name of Applicant",
      dataIndex: "durationTo",
    },
    {
      title: "Date of Application",
      dataIndex: "serviceCharges",
    },
    {
      title: "Application Received For",
      dataIndex: "certificateCharges",
    },
    {
      title: "Address of Applicant",
      dataIndex: "freeFirstCertificateCopy",
    },
    {
      title: "Charge Name",
      dataIndex: "delayCharges",
    },
    {
      title: "Amount as Per Criteria",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Amount in Editable Mode",
      dataIndex: "typeOfCategory",
    },
    {
      title: "Amount in Word",
      dataIndex: "typeOfCategory",
    },
    {
      title: "SGST",
      dataIndex: "typeOfCategory",
    },
    {
      title: "CGST",
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
        <title>Challan LOI Generation</title>
      </Head>
      <BasicLayout titleProp={"none"}>
        <Card>
          <Row>
            <Col xl={22} lg={21} md={20} sm={19}></Col>
            <Col>
              <Button
                onClick={() =>
                  router.push(
                    `/townPlanning/transactions/challanLOIGeneration/view`
                  )
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
