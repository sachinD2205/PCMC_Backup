import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import styles from '../reports/print.module.css'
import { Button } from 'antd'
import URLS from '../../../../../URLS/urls'

import { useReactToPrint } from 'react-to-print'

const Print = () => {
  const router = useRouter()
  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  return (
    <>
      <div className={styles.main}>
        <div className={styles.buttons}>
          <Button type='primary' onClick={handlePrint}>
            Print
          </Button>

          <Button
            type='primary'
            onClick={() => {
              router.push({
                pathname: `${URLS.APPURL}/townPlanning/transactions/partMap/view`,
                query: {
                  pageMode: 'view',
                  ...router.query,
                },
              })
            }}
          >
            Back
          </Button>
        </div>

        {/* <table className={styles.tables}>
          <tbody>
            <tr>
              <th colSpan={2} className={styles.hpartplan}>
                <label>Application Part-Plan</label>
              </th>
            </tr>

            <tr className={styles.toprow}>
              <th>Application No</th>

              <td>{router.query.applicationNo}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Application Date</th>

              <td>{router.query.applicationDate}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Service Completion Date</th>

              <td>{router.query.serviceCompletionDate}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Title</th>

              <td>{router.query.title}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Subject</th>

              <td>{router.query.subject}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>First Name</th>

              <td>{router.query.firstName}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Middle Name</th>

              <td>{router.query.middleName}</td>
            </tr>

            <tr className={styles.toprow}>
              <th> Surname</th>

              <td> {router.query.surname}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Gender</th>

              <td>{router.query.gender}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Mobile</th>

              <td>{router.query.mobile}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Pincode</th>

              <td>{router.query.pincode}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Email Address </th>

              <td> {router.query.emailAddress}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Pan No</th>

              <td> {router.query.panNo}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>AadhaarNo </th>

              <td>{router.query.aadhaarNo}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Gat No</th>

              <td>{router.query.gatNo}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Village Name</th>

              <td>{router.query.villageName}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>TDR Zone</th>

              <td> {router.query.tDRZone}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Reservation No</th>

              <td>{router.query.reservationNo}</td>
            </tr>
          </tbody>
        </table> */}
      </div>

      <div>
        <ComponentToPrint
          ref={componentRef}
          serviceCompletionDate={router.query.serviceCompletionDate}
          emailAddress={router.query.emailAddress}
          mobile={router.query.mobile}
          panNo={router.query.panNo}
          aadhaarNo={router.query.aadhaarNo}
          pincode={router.query.pincode}
          gatNo={router.query.gatNo}
          villageName={router.query.villageName}
          tDRZone={router.query.tDRZone}
          reservationNo={router.query.reservationNo}
          gender={router.query.gender}
          surname={router.query.surname}
          middleName={router.query.middleName}
          firstName={router.query.firstName}
          title={router.query.title}
          subject={router.query.subject}
          applicationNo={router.query.applicationNo}
          applicationDate={router.query.applicationDate}
        />
      </div>
    </>
  )
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.printMain}>
        <table className={styles.tables}>
          <tbody>
            <tr>
              <th colSpan={2} className={styles.hpartplan}>
                <label>Application Details Part-Plan</label>
              </th>
            </tr>

            <tr className={styles.toprow}>
              <th>Application No</th>

              <td> {this.props.applicationNo}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Application Date</th>

              <td> {this.props.applicationDate}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Service Completion Date</th>

              <td> {this.props.serviceCompletionDate}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Title</th>

              <td> {this.props.title}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Subject</th>

              <td> {this.props.subject}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>First Name</th>

              <td> {this.props.firstName}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Middle Name</th>

              <td> {this.props.middleName}</td>
            </tr>

            <tr className={styles.toprow}>
              <th> Surname</th>

              <td> {this.props.surname}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Gender</th>

              <td> {this.props.gender}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Mobile</th>

              <td> {this.props.mobile}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Pincode</th>

              <td> {this.props.pincode}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Email Address </th>

              <td> {this.props.emailAddress}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Pan No</th>

              <td> {this.props.panNo}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>AadhaarNo </th>

              <td> {this.props.aadhaarNo}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Gat No</th>

              <td> {this.props.gatNo}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Village Name</th>

              <td> {this.props.villageName}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>TDR Zone</th>

              <td> {this.props.tDRZone}</td>
            </tr>

            <tr className={styles.toprow}>
              <th>Reservation No</th>

              <td> {this.props.reservationNo}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default Print
