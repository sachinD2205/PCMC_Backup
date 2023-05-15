import { Button, Card } from "antd";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from './report.module.css'
import styles from "./goshwara.module.css";

// http://localhost:4000/marriageRegistration/reports/goshwara1/goshwaraReport1
// Goshwara Part – 1
const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };

  // view
  return (
    <div>
      <BasicLayout titleProp={"none"}>
        <Card>
          <div>
            <center>
              <h1>गोषवारा भाग १</h1>
            </center>
          </div>
          <div style={{ padding: 10 }}>
            <Button
              type="primary"
              style={{ float: "right" }}
              onClick={handlePrint}
            >
              print
            </Button>
            <Button onClick={backToHomeButton} type="primary">
              back To home
            </Button>
          </div>
        </Card>
        <ComponentToPrint ref={componentRef} />
      </BasicLayout>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <Card>
          <table className={styles.report}>
            <tr className={styles.trrow}>
              <td colSpan={2}>
                <b>विवाह निबंधक कार्यालय :</b>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <h1>गोषवारा भाग १</h1>
              </th>
            </tr>
            <tr>
              <td>
                <b>विवाह नोंदणी क्रमांक:</b>
              </td>
              <td className={styles.trrow}>
                <b>दिनांक :</b>
              </td>
            </tr>
          </table>
          <table className={styles.data}>
            <tr>
              <th style={{ width: "50%" }}>वराची माहीती </th>
              <th style={{ width: "25%" }}>छायाचित्र </th>
              <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
            </tr>
            <tr>
              <td>
                नावं:<br></br>
                वय :<br></br>
                पत्ता :<br></br>
                सही :<br></br>
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
                  वराचा छायाचित्र
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
                  वराचा अंगठ्याचा ठसा
                </div>
              </td>
            </tr>
            <tr>
              <th style={{ width: "50%" }}>वधूची माहीती </th>
              <th style={{ width: "25%" }}>छायाचित्र </th>
              <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
            </tr>
            <tr>
              <td>
                नावं:<br></br>
                वय :<br></br>
                पत्ता :<br></br>
                सही :<br></br>
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
                  वधूचा छायाचित्र
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
                  वधूचा अंगठ्याचा ठसा
                </div>
              </td>
            </tr>
          </table>
          <table className={styles.report}>
            <tr>
              <td>
                {" "}
                <b>दिनांक :</b>
              </td>
            </tr>
            <tr className={styles.trrowf}>
              <td colSpan={2} style={{ paddingRight: "50px" }}>
                {" "}
                <b>
                  विवाह निबंधक <br></br>फ क्षेत्रिय कार्यालय:
                </b>
              </td>
            </tr>
          </table>
        </Card>
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
//             <table className={styles.report}>
//               <tr>
//                 <th colspan="2">गोषवारा भाग १</th>
//               </tr>
//               <tr>
//                 <td>विवाह निबंधक कार्यालय :</td>
//                 <td>विवाह नोंदणी क्रमांक:</td>
//               </tr>
//             </table>

//             <table className={styles.report_table}>
//               <thead>
//                 <tr>
//                   <th colSpan={14}>
//                     <h3>
//                       <b>गोषवारा भाग १ </b>
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
//                     {/* <Row>
//                       <Col span={4}>
//                         <h3>
//                           <b>वराची माहीती :</b>
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
//                     </Row> */}

//                     <tr>
//                       <th>वराची माहीती</th>

//                       <th>छायाचित्र</th>
//                       <th>अंगठ्याचा ठसा</th>
//                     </tr>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>
//                     <th colSpan="22">
//                       <Row>
//                         <Card>
//                           <table className={styles.goshwara}>
//                             <tr>
//                               <th>वराची माहीती</th>
//                               <th>छायाचित्र</th>
//                               <th>अंगठ्याचा ठसा</th>
//                             </tr>
//                             <tr>
//                               <td>
//                                 नावं:<br></br>
//                                 वय :<br></br>
//                                 पत्ता :<br></br>
//                                 सही :<br></br>
//                               </td>
//                               <td>
//                                 <Card
//                                   style={{
//                                     height: 200,
//                                     width: 150,
//                                     background: 'yellow',
//                                   }}
//                                 ></Card>
//                               </td>
//                               <td>
//                                 <Card
//                                   style={{
//                                     height: 200,
//                                     width: 150,
//                                     background: 'yellow',
//                                   }}
//                                 ></Card>
//                               </td>
//                             </tr>
//                           </table>
//                         </Card>

//                         {/* <td>
//                           नावं:<br></br>
//                           वय :<br></br>
//                           पत्ता :<br></br>
//                           सही :<br></br>
//                         </td>
//                         <td>
//                           <Card
//                             style={{
//                               height: 250,
//                               width: 150,
//                               background: 'yellow',
//                             }}
//                           ></Card>
//                         </td> */}
//                       </Row>

//                       {/* <Row>
//                         <Col style={{ padding: '10px' }}>वय :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>पत्ता :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>सही :</Col>
//                       </Row> */}
//                     </th>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <th colSpan="35">
//                       <Col xl={30}></Col>
//                       <Col xl={8}>
//                         <Card
//                           style={{
//                             height: 250,
//                             width: 150,
//                             background: 'yellow',
//                           }}
//                         ></Card>
//                       </Col>

//                       <Row>
//                         <Col style={{ padding: '10px' }}>नावं:</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>वय :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>पत्ता :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>सही :</Col>
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