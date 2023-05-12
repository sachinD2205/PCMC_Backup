import { Button, Grid } from "@mui/material";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../acknowledgement/loiGeneratedReceipt.module.css"
// /sportsPortal/sportsPortal/transaction/groundBookingNew/scrutiny/LoiGenerationRecipt.module.css"
// sportsPortal/transaction/groundBookingNew/scrutiny/LoiGenerationRecipt.module.css";
// D:\PCMC\pcmc-front-end\pages\sportsPortal\transaction\groundBookingNew\scrutiny\LoiGenerationRecipt.module.css
const LoiGenerationRecipt = () => {
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const componentRef = useRef(null);
  const router = useRouter();

  const logedInUser = localStorage.getItem("loggedInUser");
  const [applications, setApplicationDetails] = useState([])
  const [data, setdata] = useState();
const [deptnm,setDeptNm]=useState(null)
const [departments, setDepartments] = useState([]);
const [hutData, setHutData] = useState({});

const [slumData, setSlumData] = useState({});
const [areaData, setAreaData] = useState({});
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

useEffect(()=>{
  getSlumData(data?.slumKey);
  getAreaData(data?.areaKey);
  getVillageData(data?.villageKey);
  getCityData(data?.cityKey);
  getApplicationDetails(data);
  getHutData(data?.hutKey);
},[data])

useEffect(()=>{
    getSlumData(hutData?.slumKey);
    getAreaData(hutData?.areaKey);
    getVillageData(hutData?.villageKey);
    getCityData(hutData?.cityKey);
  },[hutData])



const getHutData = (selectedId) => {
    axios.get(`${urls.SLUMURL}/mstHut/getAll`).then((r) => {
      let result = r.data.mstHutList;
      let selectedHut = result && result.find((obj) => obj.id == selectedId);
      console.log("selectedHUt",selectedHut, result);
        setHutData(selectedHut);
    });
  };

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

  let user = useSelector((state) => state.user.user)

  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
        setDepartments(
            r.data.department.map((row) => ({
                id: row.id,
                department: row.department,
            }))
        );
    });
};

//funxtion to get photopass issuance data by filter by application no

  const getLoiGenerationData = (applicationNo) => {
    // axios.get(`${urls.SPURL}/groundBooking/getById?id=${router?.query?.applicationId}`).then((res) => {
    //   setdata(res.data);
    //   console.log("loi recept data", res.data);
    // });


    if (logedInUser === "citizenUser") {
      axios.get(`${urls.SLUMURL}/trnTransferHut/search/applicationNumber?applicationNumber=${applicationNo}`, {
        headers: {
          UserId: user.id
        }
      }).then((res) => {
          setdata(res.data);
          console.log("res.data",res.data)
      });
    } else {
      axios.get(`${urls.SLUMURL}/trnTransferHut/search/applicationNumber?applicationNumber=${applicationNo}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }).then((res) => {
        setdata(res.data);
      })
    }
  };

  useEffect(() => {
    console.log("useeffect");
    getDepartments()
  }, []);

  useEffect(() => {
    if(router.query.id){
      getLoiGenerationData(router.query.id);
    }
  }, [router.query.id])


  // function to get data of LOI payment

  const getApplicationDetails = (data) => {
    if (logedInUser === "citizenUser") {
      axios.get(`${urls.SLUMURL}/trnTransferHut/getAll`, {
        headers: {
          UserId: user.id
        }
      },).then((res) => {
        let temp = res.data.trnTransferHutList;
        let result = temp && temp.find((each)=> each.applicationNo == data?.applicationNo)
        setApplicationDetails(result?.trnLoiList[result?.trnLoiList?.length-1])
      console.log("getApplicationDetails",result?.trnLoiList[result?.trnLoiList?.length-1]);
      })
    } else {
      axios.get(`${urls.SLUMURL}/trnTransferHut/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      },).then((res) => {
        let temp = res.data.trnTransferHutList;
        let result = temp && temp.find((each)=> each.applicationNo == data?.applicationNo)
        setApplicationDetails(result?.trnLoiList[result?.trnLoiList?.length-1])
      console.log("getApplicationDetails",result?.trnLoiList[result?.trnLoiList?.length-1]);
      })
    }
  }


  // Handle Print
  
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });



  const loiPayment = () => {
    let _body = {
      title: data.proposedOwnerTitle,
      middleName: data.proposedOwnerMiddleName,
      firstName: data.proposedOwnerFirstName,
      lastName: data.proposedOwnerLastName,
      mobileNo: data.proposedOwnerMobileNo,
      ...data,
      loiNo: applications?.loiNo,
      transactionRefNo: applications?.transactionRefNo,
      transactionType: applications?.transactionType,
      referenceKey: data?.id,
      isComplete:true,
      id: applications?.id,
      status: data?.status,
      activeFlag: data?.activeFlag
    }
    if (logedInUser === "citizenUser") {
      const tempData = axios
      .post(`${urls.SLUMURL}/trnLoi/transferHut/save`, _body, {
        headers: {
          UserId: user.id,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", `LOI payment agaist ${data.applicationNo} done successfully !`, "success");
          router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
        }
      });
    } else {
      const tempData = axios
      .post(`${urls.SLUMURL}/trnLoi/transferHut/save`, _body, {
        headers: {
          UserId: user.id,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", `LOI payment agaist ${data.applicationNo} done successfully !`, "success");
          router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
        }
      });
    }
  }
  // const router = useRouter()
  // View
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} hutData={hutData} data={data} slumData={slumData} areaData={areaData} villageData={villageData} cityData={cityData}  application={applications} deptNm={deptnm} />
      </div>
      <br />

      <div className={styles.btn}>

        <Button
          variant="contained"
          color="primary"
          onClick={() => loiPayment()}
        // endIcon={<SaveIcon />}
        >
          <FormattedLabel id="payment" />
        </Button>
        <Button variant="contained" sx={{ size: "23px" }} type="primary" onClick={handlePrint}>
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            swal({
              title: "Exit?",
              text: "Are you sure you want to exit this Record ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal("Record is Successfully Exit!", {
                  icon: "success",
                });
                router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
              } else {
                swal("Record is Safe");
              }
            });
          }}
        >
          <FormattedLabel id="exit" />
        </Button>


      </div>
    </>
  );
};
// class component To Print
class ComponentToPrint extends React.Component {
  render() {
    console.log(this.props.data, "props");
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <Grid container>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12} sx={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
                <Grid>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </Grid>
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12} sx={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
                <h1 style={{textAlign:"center"}}>
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
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12} sx={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </Grid>
            </Grid>
            <div>
              <h2 className={styles.heading}>
                <b><FormattedLabel id="serviceAcceptance" /></b>
              </h2>
            </div>

            <div className={styles.two}>
              <p>
                <b>
                  <h3><FormattedLabel id="ackDear" />, {this?.props?.data?.currentOwnerFirstName + " " + this?.props?.data?.currentOwnerMiddleName + " " + this?.props?.data?.currentOwnerLastName}</h3>
                  <br></br> <FormattedLabel id="hutTransferAmt" />: {this?.props?.applications?.amount} <br />
                  <FormattedLabel id="determineandPayAmt" />
                  <br /> <FormattedLabel id="contactNearestpcmcDivisionalOffice" /><br></br>
                </b>
              </p>

              <div className={styles.date2}>
                <h4><FormattedLabel id="departmentKey" /> : </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  <b><FormattedLabel id="slumKey" /></b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4><FormattedLabel id="loiNo" /> : </h4> <h4 style={{ marginLeft: "10px" }}>{this?.props?.applications?.loiNo}</h4>
              </div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}><FormattedLabel id="srNo" /></th>
                    <th colSpan={8}><FormattedLabel id="chargeNm" /></th>
                    <th colSpan={2}><FormattedLabel id="amount" /></th>
                  </tr>
                  <tr>
                    <td colSpan={4}><FormattedLabel id="no1" /></td>
                    <td colSpan={4}><FormattedLabel id="hutTransfer" /></td>
                    <td colSpan={4}>{this?.props?.applications?.amount}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}> <FormattedLabel id="other" /></td>
                    <td colSpan={4}>{this?.props?.data?.penaltyCharge}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b><FormattedLabel id="totalAmount" /> : {this?.props?.applications?.totalAmount}</b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4><FormattedLabel id="applicationNo" /> : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.applicationNo}</h4>
              </div>

              <div className={styles.date2}>
                <h4><FormattedLabel id="applicantName" /> : </h4>
                <h4 style={{ marginLeft: "10px" }}>{this?.props?.data?.currentOwnerFirstName + " " + this?.props?.data?.currentOwnerMiddleName + " " + this?.props?.data?.currentOwnerLastName}</h4>
              </div>

              <div className={styles.date2}>
                <h4><FormattedLabel id="dateofApplication" /> :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " + moment(this?.props?.data?.applicationDate).format("DD-MM-YYYY")}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4><FormattedLabel id="applicantAddress" /> : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>

                  {`${this?.props?.slumData?.slumName ? this?.props?.slumData?.slumName : ""}, ${this?.props?.areaData?.areaName ? this?.props?.areaData?.areaName : ""}, ${this?.props?.villageData?.villageName ? this?.props?.villageData?.villageName : ""}, ${this?.props?.cityData?.cityEn ? this?.props?.cityData?.cityEn : ""} ${this?.props?.hutData?.pincode}`}

                </h4>
              </div>

              <hr />

              <Grid container>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  <h5><FormattedLabel id="pimpariChinchwadMaha" /></h5>
                  
                  <h5><FormattedLabel id="ackpcmcAddress" /></h5>
                  <h5> <FormattedLabel id="ackstateCountry" /></h5>
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  <h5><FormattedLabel id="ackPcmcphNo" /></h5>
                  <h5><FormattedLabel id="emailId" />: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12} sx={{marginTop:"10px"}}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
