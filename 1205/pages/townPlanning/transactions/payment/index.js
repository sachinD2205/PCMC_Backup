import React, { useRef } from 'react'
import styles from '../payment/payment.module.css'
import { Button, message } from 'antd'
import { useReactToPrint } from 'react-to-print'
import router from 'next/router'
import axios from 'axios'
import URLS from '../../../../URLS/urls'
import Image from 'next/image'

const Index = () => {
  const componentRef = useRef(null)

  const paymentDone = async () => {
    const final = 'Payment Successful'
    await axios
      .post(
        `${URLS.TPURL}/partplan/savepartplan`,
        {
          status: final,
          id: router.query.id,
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            role: 'CITIZEN',
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          message.success('Data Updated !')
          router.push('/townPlanning/transactions/partMap')
        }
      })
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'new document',
  })
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} />
      </div>
      <div className={styles.btn}>
        <Button type='primary' onClick={handlePrint}>
          print
        </Button>
        <Button type='primary' onClick={paymentDone}>
          Exit
        </Button>
      </div>
    </>
  )
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <Image src='/logo.png' alt='' height='100px' width='100px' />
                </div>
                <div className={styles.date}>
                  <h5>Receipt No :-</h5>
                  <h5>Receipt Date :-</h5>
                </div>
              </div>
              <div className={styles.middle}>
                <h4>Department Name : Town Planning</h4>

                <h4>Receipt</h4>
              </div>
              <div className={styles.right}>
                <div className={styles.leftt}>
                  <h4>Service Name</h4>
                  <h3>TP:Part Plan</h3>
                  <h5>Receipt No :-</h5>
                  <h5>Receipt Date :-</h5>
                </div>
                <div>
                  <h4>Address</h4>
                  <h5>
                    Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune
                  </h5>
                </div>
              </div>
            </div>
            <div className={styles.two}>
              <p>
                <b>
                  To,<br></br> Shri
                  <br></br> This is acknowledged that your application with
                  listed details received for Part Plan same message is sent on
                  you registered mobile no. and email.
                  <br></br>
                </b>
                <p>
                  <b>
                    Order No.:- 001235 Shri.ABC ,Address:-Plot
                    No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
                  </b>
                </p>
                <div className={styles.order}>
                  Application Fees = 20.00<br></br> Certificate/Document/Map
                  Fees = 150.00 <br></br>
                  ----------------------------------------------------
                  <br></br> Total Amount = 170.00 <br></br>Amount in Words = One
                  Hundred and Seventy Rupees Only/--
                </div>
              </p>

              <div className={styles.enquiry}>
                <div>
                  <b>For Contact :- Mobile No:-9999999999</b>
                </div>
                <div>
                  <b>email:-enquiry@pcmcindia.gov.in</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Index

//  import React from "react";
//  import styles from "../paymentOne/payment.module.css";

//  const index = () => {
//   return (
//     <div className={styles.main}>
//       <div className={styles.small}>
//         <div className={styles.one}>
//           <div className={styles.logo}>
//             <div>
//               <img src="/logo.png" alt="" height="100vh" width="100vw" />
//             </div>
//             <div>
//               <h5>Receipt No :-</h5>
//               <h5>Receipt Date :-</h5>
//             </div>
//           </div>
//           <div className={styles.middle}>
//             <h4>Department Name : Town Planning</h4>

//             <h4>Receipt</h4>
//           </div>
//           <div className={styles.right}>
//             <div className={styles.leftt}>
//               <h4>Service Name</h4>
//               <h3>TP:Part Plan</h3>
//               <h5>Receipt No :-</h5>
//               <h5>Receipt Date :-</h5>
//             </div>
//             <div>
//               <h4>Address</h4>
//               <h5>Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune</h5>
//             </div>
//           </div>
//         </div>
//         <div className={styles.two}>
//           <p>
//             <b>
//               To,<br></br> Dear Shri ABC,<br></br> This is acknowledged that
//               your application with listed details received for Part Plan same
//               message is sent on you registered mobile no. and email.<br></br>
//             </b>
//             <p>
//               <b>
//                 Order No.:- 001235 Shri.ABC ,Address:-Plot
//                 No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
//               </b>
//             </p>
//             <div className={styles.order}>
//               Application Fees = 20.00<br></br> Certificate/Document/Map Fees =
//               150.00 <br></br>
//               ----------------------------------------------------
//               <br></br> Total Amount = 170.00 <br></br>Amount in Words = One
//               Hundred and Seventy Rupees Only/--
//             </div>
//           </p>

//           <div className={styles.enquiry}>
//             <div>
//               <b>For Contact :- Mobile No:-9999999999</b>
//             </div>
//             <div>
//               <b>email:-enquiry@pcmcindia.gov.in</b>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default index;
