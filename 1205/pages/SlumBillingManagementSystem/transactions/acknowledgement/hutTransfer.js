import React, { useEffect, useRef, useState } from 'react'
import styles from './acknowledgement.module.css'
import router, { useRouter } from 'next/router'
import { useReactToPrint } from 'react-to-print'
import { Button, Card } from '@mui/material'
import urls from '../../../../URLS/urls'
import axios from 'axios'
import moment from 'moment'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { useSelector } from "react-redux"

const Index = () => {
  const componentRef = useRef(null)
  const router = useRouter()
  const logedInUser = localStorage.getItem("loggedInUser")
  let user = useSelector((state) => state.user.user)

  const [data, setData] = useState(null)
  const [selectedHutData, setSelectedHutData] = useState(null)
  const [hutOwnerData, setHutOwnerData] = useState(null)
  const [slumData, setSlumData] = useState({});
  const [areaData, setAreaData] = useState({});
  const [zoneData, setZoneData] = useState({});
  const [villageData, setVillageData] = useState({});
  const [cityData, setCityData] = useState({});
  const cityDropDown = [
    {
      id: 1,
      cityEn: "Pimpri",
      cityMr: "पिंपरी",
    },
    {
      id: 2,
      cityEn: "Chinchwad",
      cityMr: "चिंचवड",
    },
    {
      id: 3,
      cityEn: "Bhosari",
      cityMr: "भोसरी",
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'new document',
  })

  useEffect(()=>{
    getHutData(data?.hutKey)
  },[data])

  useEffect(()=>{
    getSlumData(selectedHutData?.slumKey);
    getAreaData(selectedHutData?.areaKey);
    getZoneData(selectedHutData?.zoneKey);
    getVillageData(selectedHutData?.villageKey);
    getCityData(selectedHutData?.cityKey);
  },[selectedHutData])

  const getSlumData = (slumKey) => {
    axios.get(`${urls.SLUMURL}/mstSlum/getAll`).then((r) => {
      let result = r.data.mstSlumList;
      let slum = result && result.find((each)=>each.id == slumKey)
      console.log("getSlumData", result, slumKey, slum);
      setSlumData(slum);
    });
  };

  const getAreaData = (areaKey) => {
    axios.get(`${urls.SLUMURL}/master/area/getAll`).then((r) => {
      let result = r.data.area;
      let area = result && result.find((each)=>each.id == areaKey)
      console.log("getareaData", result, areaKey, area);
      setAreaData(area);
    });
  };

  const getZoneData = (zoneKey) => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let result = res.data.zone;
      let zone = result && result.find((each)=>each.id == zoneKey)
      console.log("getzoneData", result, zoneKey, zone);
      setZoneData(zone);
    });
  }

  const getVillageData = (villageKey) => {
    axios.get(`${urls.SLUMURL}/master/village/getAll`).then((r) => {
      let result = r.data.village;
      let village = result && result.find((each)=>each.id == villageKey)
      console.log("getvillageData", result, villageKey, village);
      setVillageData(village);
    });
  };

  const getCityData = (cityKey) => {
   let city = cityDropDown && cityDropDown.find((city)=>city.id == cityKey)
   setCityData(city);
  }

  const getHutData = (selectedId) => {
    console.log("getHutData");
    axios.get(`${urls.SLUMURL}/mstHut/getAll`).then((r) => {
      let result = r.data.mstHutList;
      let selectedHut = result && result.find((obj) => obj.id == selectedId);
      console.log("hutOwner", selectedHut, hutOwner);
      let hutOwner = selectedHut && selectedHut.mstHutMembersList.find((obj) => obj.headOfFamily === "Yes");
      setHutOwnerData(hutOwner);
      setSelectedHutData(selectedHut);
    });
  };

  console.log("aaaslum",slumData);
  console.log("aaaarea",areaData);
  console.log("aaazone",zoneData);
  console.log("aaavillage",villageData);
  console.log("aaacity",cityData);

  useEffect(() => {
    console.log('router.query', router.query)
    // if (router.query.id && router.query.serviceId) {
    if (router.query.id) {

      // axios
      //   .get(
      //     `${urls.RTI}/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${router.query.id}&serviceId=${router.query.serviceId}`,
      //   )
      //   .then((r) => {
      //     console.log('r.data', r.data)
      //     setData(r.data)
      //   })

      if (logedInUser === "citizenUser") {
        axios.get(`${urls.SLUMURL}/trnTransferHut/search/applicationNumber?applicationNumber=${router.query.id}`, {
            headers: {
                UserId: user.id
            }
        },).then((r) => {
          setData(r.data)
        })
    }else{
      axios.get(`${urls.SLUMURL}/trnTransferHut/search/applicationNumber?applicationNumber=${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
    },).then((r) => {
      setData(r.data)
    })
    }
  }
  }, [])

  return (
    <>
      <div>
        <ComponentToPrint data={data} slumData={slumData} areaData={areaData} zoneData={zoneData} villageData={villageData} cityData={cityData} ref={componentRef} selectedHutData={selectedHutData} hutOwnerData={hutOwnerData}/>
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
        <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push('/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails')
          }}
        >
          <FormattedLabel id="exit" />
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
          <div className={styles.one}>
            <div className={styles.logo}>
              <div>
                <img src="/logo.png" alt="" height="100vh" width="100vw" />
              </div>
            </div>
            <div
              className={styles.middle}
              styles={{ paddingTop: '15vh', marginTop: '20vh' }}
            >
              <h1>
              <b><FormattedLabel id="pimpariChinchwadMaha" /></b>
              </h1>
              {/* <h4>
                  {' '}
                  <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
                </h4> */}

              {/* <h4>
                  {' '}
                  <b>महाराष्ट्र, भारत</b>
                </h4> */}
            </div>
            <div className={styles.logo1}>
              <img
                src="/smartCityPCMC.png"
                alt=""
                height="100vh"
                width="100vw"
              />
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>
            <b><FormattedLabel id="appAcknowldgement"/></b>
            </h2>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h3>
                <FormattedLabel id="ackDear" />, <b>{this?.props?.data?.proposedOwnerFirstName+ " "+this?.props?.data?.proposedOwnerMiddleName +" "+this?.props?.data?.proposedOwnerLastName}</b>
                </h3>
                <h3><FormattedLabel id="ackpcmcthanku" /></h3>
                <h3>
                <FormattedLabel id='ackHutTransferShortDesc' />
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}><FormattedLabel id="ackApplicationSummery" /></h2>
            </div>
            <Card>
              {/* <h2 className={styles.summary}>Application Summary</h2> */}
              <div className={styles.summ}>
                <div>
                  <h3><FormattedLabel id="applicationNo" /> </h3>
                  <h3><FormattedLabel id="applicantName" /> </h3>
                  <h3><FormattedLabel id="dateofApplication" /> </h3>
                  <h3><FormattedLabel id="address" /> </h3>
                </div>
                <div>
                  <h3> : {this?.props?.data?.applicationNo}</h3>
                  <h3>
                    {' '}
                    : <b>{this?.props?.data?.proposedOwnerFirstName+ " "+this?.props?.data?.proposedOwnerMiddleName +" "+this?.props?.data?.proposedOwnerLastName}</b>
                  </h3>
                  <h3>
                    {' '}
                    :{' '}
                    {moment(this?.props?.data?.applicationDate).format(
                      'DD-MM-YYYY',
                    )}
                  </h3>
                  <h3>
                    : {`${this?.props?.slumData?.slumName}, ${this?.props?.areaData?.areaName}, ${this?.props?.zoneData?.zoneName}, ${this?.props?.villageData?.villageName}`}{' '}
                    {/* {this?.props?.data?.abuildingNameMr} {','}
                    {this?.props?.data?.aroadNameMr} {','}{' '}
                    {this?.props?.data?.alandmarkMr} {','}{' '}
                    {this?.props?.data?.acityNameMr} {','}{' '}
                    {this?.props?.data?.astateMr}{' '} */}
                  </h3>
                </div>
              </div>
            </Card>
            <div className={styles.query}>
              <h4>
              <FormattedLabel id="ackplzContactNearestOperator"/>
              </h4>
            </div>

            <div className={styles.foot}>
              <div className={styles.add}>
                <h5><FormattedLabel id="pimpariChinchwadMaha" /></h5>
                <h5> <FormattedLabel id="ackpcmcAddress" /></h5>
                {/* <h5> महाराष्ट्र, भारत</h5> */}
              </div>
              <div className={styles.add1}>
                <h5><FormattedLabel id="ackPcmcphNo"/></h5>
                {/* <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5> */}
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: '5vh',
                }}
              >
                <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: '5vh',
                  marginRight: '5vh',
                }}
              >
                <img src="/barcode.png" alt="" height="50vh" width="100vw" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Index
