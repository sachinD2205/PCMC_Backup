import { Button, FormControl, Paper, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import styles from './goshwara.module.css'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import urls from '../../../../URLS/urls'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Index = () => {
  let router = useRouter()
  let selectedMenu = localStorage.getItem('selectedMenuFromDrawer')
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  )
  let language = useSelector((state) => state.labels.language)
  const [route, setRoute] = useState(null)

  // console.log("menuLabel",menuLabel);

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm()

  const componentRef = useRef()

  const [dataSource, setDataSource] = useState([])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  useEffect(() => {
    getLibraryKeys()
  }, [])



  const getLibraryKeys = () => {
    axios
      .get(
        `${urls.LMSURL}/trnBookIssueReturn/getAll`,
      )
      .then((r) => {
        setDataSource(
          r.data.trnBookIssueReturnList.map((row) => ({
            id: row.id,
            ...row
          })),
        )
      })
  }

  const backToHomeButton = () => {
    router.push('/marriageRegistration/dashboard')
  }
  return (
    <>
      <Paper
        sx={{
          padding: '5vh',
          border: 1,
          borderColor: 'grey.500',
        }}
      >
        <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            color="primary"
            style={{ float: 'right' }}
            onClick={handlePrint}
          >
            {language === 'en' ? 'Print' : 'प्रत काढा'}
          </Button>
          <p>
            <center>
              <h1>
                {
                  language === 'en'
                    ? "Book Issue/Return Register"
                    : "सदस्यत्व नोंदणी"
                }
              </h1>
            </center>
          </p>
          <Button
            onClick={backToHomeButton}
            variant="contained"
            color="primary"
            style={{ marginTop: '-100px' }}
          >
            {language === 'en' ? 'Back To home' : 'मुखपृष्ठ'}
          </Button>
        </div>
        <br />
        <div>
          <ComponentToPrint
            data={{ dataSource, language, ...menu, route }}
            ref={componentRef}
          />
        </div>
      </Paper>
    </>
  )
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper>
              <table className={styles.report}>
                {/* <thead className={styles.head}>
                  <tr>
                    <th colSpan={9}>
                      {
                        this?.props?.data?.language === 'en'
                          ? "Book Issue/Return Register"
                          : "सदस्यत्व नोंदणी"
                      }

                    </th>
                  </tr>
                </thead> */}
                <tbody>
                  <tr>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Sr.No' : 'अ.क्र'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Membership No' : 'सदस्यत्व क्र'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Book Name' : 'पुस्तकाचे नाव'}
                    </th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Library Member Name' : 'ग्रंथालय सदस्याचे नाव'}
                    </th> */}
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Librarian Remark' : 'ग्रंथपाल टिप्पणी'}
                    </th> */}
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Issued At' : 'मुद्दा जारी केले'}
                    </th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Issue Remark' : 'मुद्दा टिप्पणी'}
                    </th> */}

                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Returned At' : 'परत केले'}
                    </th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Return Remark' : 'परत टिप्पणी'}
                    </th> */}
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Fine' : 'वाचनालयाचे नाव'}
                    </th> */}
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {r?.membershipNo}
                          </td>
                          <td style={{textAlign:"left",paddingLeft:"2vh"}}>
                            {/* {this?.props?.data?.language === 'en'
                              ? r?.applicationNo
                              : r?.libraryNameMr} */}
                            {r?.bookName}
                          </td>
                          {/* <td style={{textAlign:"left",paddingLeft:"2vh"}}>
                            {r?.libraryMemberName}
                          </td> */}
                          {/* <td>
                            {r?.librarianComment}
                          </td> */}
                          <td>
                            {/* {this?.props?.data?.language === 'en'
                              ? r?.address
                              : r?.addressMr} */}
                            {r.issuedAt ? moment(r?.issuedAt).format('DD-MM-YYYY') : '-'}
                          </td>
                          {/* <td>
                            {r?.issueRemark}
                          </td> */}
                          <td>
                            {r.returnedAt ? moment(r?.returnedAt).format('DD-MM-YYYY') : '-'}
                          </td>
                          {/* <td>
                            {r?.returnRemark}
                          </td> */}
                          {/* <td>
                            {r?.fine}
                          </td> */}
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    )
  }
}

export default Index
