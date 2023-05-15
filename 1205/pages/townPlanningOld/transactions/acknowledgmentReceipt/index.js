import React, { useRef } from 'react'
import styles from '../acknowledgmentReceipt/view.module.css'
import { Card, Button } from 'antd'
import router from 'next/router'
import { useReactToPrint } from 'react-to-print'
import Image from 'next/image'

const Index = () => {
  const componentRef = useRef(null)

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
        <Button
          type='primary'
          onClick={() => {
            router.push('/townPlanning/transactions/partMap')
          }}
        >
          Exit
        </Button>
      </div>
    </>
  )
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.mainn}>
        <div className={styles.main}>
          <div className={styles.smain}>
            <div className={styles.logo}>
              <Image src='/logo.png' alt='' height='100vh' width='100vw' />
            </div>
            <div>
              <h1>Pimpri Chinchwad Municipal Corporation</h1>
              <h3> Mumbai-Pune Road,</h3>
              <h3>Pimpri - 411018,</h3>
              <h3> Maharashtra, INDIA</h3>
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>Application Acknowledgment</h2>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h3>Dear, {router.query.fullName}</h3>
                <h3>Thank you for using PCMC e-District System.</h3>
                <h3>
                  Your application for Part-Plan Certificate under Government of
                  India has been successfully submitted.
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}>Application Summary</h2>
            </div>
            <Card>
              {/* <h2 className={styles.summary}>Application Summary</h2> */}
              <div className={styles.summ}>
                <div>
                  <h3>AIN </h3>
                  <h3>Name of the Applicant </h3>
                  <h3>Date of the Application </h3>
                  <h3>Address </h3>
                </div>
                <div>
                  <h3> : 1672673737</h3>
                  <h3> : {router.query.fullName}</h3>
                  <h3> : 19/08/2022</h3>
                  <h3>
                    : line no.:1,
                    <br></br>plot no.14,pundlik nagar, garkheda parisar
                    Aurangabad
                  </h3>
                </div>
              </div>
            </Card>
            <div className={styles.query}>
              <h4>
                For any query please contact your nearest operator or the
                following contact details:
              </h4>
            </div>

            <div className={styles.add}>
              <h5>Block Development Officer,</h5>
              <h5> Corporation : Pimpari-Chichwad,</h5>
              <h5> Sub-Division : Pimpari-Chichwad,</h5>
              <h5>District : Pune, India</h5>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Index
