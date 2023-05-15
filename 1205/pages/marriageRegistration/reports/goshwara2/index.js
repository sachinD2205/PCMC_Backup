import { Button, Paper } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import styles from "./goshwara.module.css";

const Index = () => {

  let router = useRouter();
  const [data, setData] = useState(null)

  useEffect(() => {
    axios
      .get(
        `${urls.MR}/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${localStorage.getItem("applicationId")}&serviceId=${localStorage.getItem("serviceId")}`,
      )
      .then((r) => {
        console.log('r.data', r.data)
        setData(r.data)
      })
  }, [])

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    router.push('/marriageRegistration/dashboard')
  };

  return (
    <div>
      {/* <BasicLayout titleProp={'none'}> */}
      <Paper>
        <div>
          <center>
            <h1>गोषवारा भाग २</h1>
          </center>
        </div>
        <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
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
      <ComponentToPrint data={data} ref={componentRef} />
      {/* </BasicLayout> */}
    </div>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Paper>
            <table className={styles.report}>
              <tr className={styles.trrow}>
                <td colSpan={2}>
                  <b>विवाह निबंधक कार्यालय :{' '}{this?.props?.data?.zone?.zoneNameMr}{' '}</b>
                </td>
              </tr>
              <tr>
                <th colSpan={2}>
                  <h1>गोषवारा भाग २</h1>
                </th>
              </tr>
              <tr>
                <td>
                  <b>विवाह नोंदणी क्रमांक:{' '}{this?.props?.data?.registrationNumber}{' '}</b>
                </td>
                <td className={styles.trrow}>
                  <b>दिनांक :{' '}{this?.props?.data?.applicationDate}{' '}</b>
                </td>
              </tr>
            </table>
            <table className={styles.data}>
              <tr>
                <th style={{ width: "50%" }}>साक्षीदारांची माहीती १: </th>
                <th style={{ width: "25%" }}>छायाचित्र </th>
                <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
              </tr>
              <tr>
                <td>
                  नावं: {this?.props?.data?.witnesses[0]?.witnessFName}{' '}
                  {this?.props?.data?.witnesses[0]?.witnessMName}{' '}
                  {this?.props?.data?.witnesses[0]?.witnessLName}
                  <br />
                  वय : {this?.props?.data?.witnesses[0]?.witnessAge}<br />
                  पत्ता : {this?.props?.data?.witnesses[0]?.witnessAddressC}<br />
                </td>
                <td
                  style={{
                    padding: "1.5vh",
                  }}
                  className={styles.tdcard}
                >
                  <div
                    className="photo"
                    style={{
                      backgroundColor: "beige",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <img
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.wfPhoto}`}
                      alt='Groom Photo'
                      // styles={{marginRight:"100px"}}
                      height={100}
                      width={120}
                    />
                  </div>
                </td>

                <td
                  style={{
                    padding: "1.5vh",
                  }}
                >
                  <div
                    className="thumb"
                    style={{
                      backgroundColor: "beige",
                      width: "100px",
                      height: "100px",
                      marginLeft: "7.2vw",
                    }}
                  >
                    <img
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.wfThumb}`}
                      alt='Groom Photo'
                      // styles={{marginRight:"100px"}}
                      height={100}
                      width={120}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th style={{ width: "50%" }}>साक्षीदारांची माहीती २: </th>
                <th style={{ width: "25%" }}>छायाचित्र </th>
                <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
              </tr>
              <tr>
                <td>
                  नावं: {this?.props?.data?.witnesses[1]?.witnessFName}{' '}
                  {this?.props?.data?.witnesses[1]?.witnessMName}{' '}
                  {this?.props?.data?.witnesses[1]?.witnessLName}
                  <br />
                  वय : {this?.props?.data?.witnesses[1]?.witnessAge}<br />
                  पत्ता : {this?.props?.data?.witnesses[1]?.witnessAddressC}<br />
                </td>
                <td
                  style={{
                    padding: "1.5vh",
                  }}
                  className={styles.tdcard}
                >
                  <div
                    className="photo"
                    style={{
                      backgroundColor: "beige",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <img
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.wsPhoto}`}
                      alt='Groom Photo'
                      // styles={{marginRight:"100px"}}
                      height={100}
                      width={120}
                    />
                  </div>
                </td>

                <td
                  style={{
                    padding: "1.5vh",
                  }}
                >
                  <div
                    className="thumb"
                    style={{
                      backgroundColor: "beige",
                      width: "100px",
                      height: "100px",
                      marginLeft: "7.2vw",
                    }}
                  >
                    <img
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.wsThumb}`}
                      alt='Groom Photo'
                      // styles={{marginRight:"100px"}}
                      height={100}
                      width={120}
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <th style={{ width: "50%" }}>साक्षीदारांची माहीती ३: </th>
                <th style={{ width: "25%" }}>छायाचित्र </th>
                <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
              </tr>
              <tr>
                <td>
                  नावं: {this?.props?.data?.witnesses[2]?.witnessFName}{' '}
                  {this?.props?.data?.witnesses[2]?.witnessMName}{' '}
                  {this?.props?.data?.witnesses[2]?.witnessLName}
                  <br />
                  वय : {this?.props?.data?.witnesses[2]?.witnessAge}<br />
                  पत्ता : {this?.props?.data?.witnesses[2]?.witnessAddressC}<br />
                </td>
                <td
                  style={{
                    padding: "1.5vh",
                  }}
                  className={styles.tdcard}
                >
                  <div
                    className="photo"
                    style={{
                      backgroundColor: "beige",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <img
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.wtPhoto}`}
                      alt='Groom Photo'
                      // styles={{marginRight:"100px"}}
                      height={100}
                      width={120}
                    />
                  </div>
                </td>

                <td
                  style={{
                    padding: "1.5vh",
                  }}
                >
                  <div
                    className="thumb"
                    style={{
                      backgroundColor: "beige",
                      width: "100px",
                      height: "100px",
                      marginLeft: "7.2vw",
                    }}
                  >
                    <img
                      src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.wtThumb}`}
                      alt='Groom Photo'
                      // styles={{marginRight:"100px"}}
                      height={100}
                      width={120}
                    />
                  </div>
                </td>
              </tr>
            </table>
            <table className={styles.report}>
              <tr>
                <td>
                  {" "}
                  <b>दिनांक :{' '}{this?.props?.data?.applicationDate}{' '}</b>
                </td>
              </tr>
              <tr className={styles.trrowf}>
                <td colSpan={2} style={{ paddingRight: "50px" }}>
                  {" "}
                  <b>
                    विवाह निबंधक <br></br>{' '}{this?.props?.data?.zone?.zoneNameMr}{' '}
                  </b>
                </td>
              </tr>
            </table>
          </Paper>
        </div>
      </div>
    );
  }
}

// class ComponentToPrint extends React.Component {
//   render() {
//     return (
//       <div style={{ padding: '13px' }}>
//         <div className="report">
//           <Card>
//             <table className={styles.report_table}>
//               <thead>
//                 <tr>
//                   <th colSpan={14}>
//                     <h3>
//                       <b>गोषवारा भाग २ </b>
//                     </h3>

//                     <Row>
//                       <Col span={18}></Col>
//                       <Col span={4}>
//                         {' '}
//                         <h3>
//                           {' '}
//                           <b>विवाह निबंधक कार्यालय : </b>
//                         </h3>
//                       </Col>
//                     </Row>

//                     <Row>
//                       <Col span={1}></Col>
//                       <Col span={4}>
//                         {' '}
//                         <h3>
//                           {' '}
//                           <b>विवाह नोंदणी क्रमांक: </b>
//                         </h3>
//                       </Col>
//                     </Row>
//                   </th>
//                 </tr>

//                 <tr>
//                   <th colSpan="22">
//                     <Row>
//                       <Col span={4}>
//                         <h3>
//                           <b>साक्षीदारांची माहीती :</b>
//                         </h3>
//                       </Col>
//                       <Col span={8}></Col>
//                       <Col span={4}>
//                         <h3>
//                           <b>छायाचित्र :</b>
//                         </h3>
//                       </Col>

//                       <Col span={2}></Col>
//                       <Col span={3}>
//                         <h3>
//                           <b>अंगठ्याचा ठसा :</b>
//                         </h3>
//                       </Col>
//                     </Row>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>
//                     <th colSpan="22">
//                       <Row>
//                         <Col
//                           xl={4}
//                           // style={{ padding: '10px' }}
//                         >
//                           नावं:
//                         </Col>
//                         <Col xl={10}></Col>
//                         <Col xl={8}>
//                           <Card
//                             style={{ height: 50, width: 80, background: 'red' }}
//                           ></Card>
//                         </Col>
//                       </Row>

//                       <Row>
//                         <Col style={{ padding: '10px' }}>वय :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>पत्ता :</Col>
//                       </Row>
//                     </th>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <th colSpan="22">
//                       <Row>
//                         <Col
//                           xl={4}
//                           // style={{ padding: '10px' }}
//                         >
//                           नावं:
//                         </Col>
//                         <Col xl={10}></Col>
//                         <Col xl={8}>
//                           <Card
//                             style={{ height: 50, width: 80, background: 'red' }}
//                           ></Card>
//                         </Col>
//                       </Row>

//                       <Row>
//                         <Col style={{ padding: '10px' }}>वय :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>पत्ता :</Col>
//                       </Row>
//                     </th>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <th colSpan="22">
//                       <Row>
//                         <Col
//                           xl={4}
//                           // style={{ padding: '10px' }}
//                         >
//                           नावं:
//                         </Col>
//                         <Col xl={10}></Col>
//                         <Col xl={8}>
//                           <Card
//                             style={{ height: 50, width: 80, background: 'red' }}
//                           ></Card>
//                         </Col>
//                       </Row>

//                       <Row>
//                         <Col style={{ padding: '10px' }}>वय :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>पत्ता :</Col>
//                       </Row>
//                     </th>
//                   </td>
//                 </tr>
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colSpan={14}>
//                     <Row>
//                       <Col span={7}>
//                         <b>दिनांक</b>
//                       </Col>

//                       <Col span={9}></Col>
//                       <Col span={7}>
//                         {' '}
//                         <b>
//                           विवाह निबंधक <br></br>फ क्षेत्रिय कार्यालय
//                         </b>
//                       </Col>
//                     </Row>
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </Card>
//         </div>
//       </div>
//     )
//   }
// }

export default Index;
