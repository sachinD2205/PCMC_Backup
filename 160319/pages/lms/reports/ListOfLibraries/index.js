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
    getZoneKeys()
  }, [])



  const getLibraryKeys = () => {
    axios
      .get(
        `${urls.LMSURL}/libraryMaster/getAll`,
      )
      .then((r) => {
        setDataSource(
          r.data.libraryMasterList.map((row) => ({
            id: row.id,
            zoneName: zoneKeys?.find((r, i) => row.zoneKey == r.id)?.zoneName,
            // zoneNameMr: row.zoneNameMr,
            libraryName: row.libraryName,
          })),
        )
      })
  }

  const [zoneKeys, setZoneKeys] = useState([])
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            // zoneName: zoneKeys?.find((r, i) => row.zoneKey == r.id)?.zoneName,
            zoneName:row.zoneName,
            zoneNameMr: row.zoneNameMr,
          })),
        )
      })
      .catch((err) => {
        swal('Error!', 'Somethings Wrong Zones not Found!', 'error')
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
                    ? "List of Libraries/Competitive Study Centre"
                    : "पिंपरी चिंचवड मधील वाचनालये"
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
                    <th colSpan={8}>
                      {
                        this?.props?.data?.language === 'en'
                          ? "List of Libraries"
                          : "पिंपरी चिंचवड मधील वाचनालये"
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
                      {this?.props?.data?.language === 'en' ? 'Zone' : 'झोन'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Library Name/Competitive Study Centre' : 'वाचनालयाचे नाव'}
                    </th>

                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td style={{textAlign:"left",paddingLeft:"5vh"}}>
                            {r?.zoneName}
                          </td>
                          <td style={{textAlign:"left",paddingLeft:"5vh"}}>
                            {this?.props?.data?.language === 'en'
                              ? r?.libraryName
                              : r?.libraryNameMr}
                          </td>


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
