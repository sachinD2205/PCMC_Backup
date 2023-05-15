import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "../goshwara.module.css";
import axios from "axios";
// import urls from "../../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { ToWords } from "to-words";

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = ({ connectionData, usageType, ownership, slumName, villageName, componentRef }) => {
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
  const [selectedObject, setSelectedObject] = useState();
  const [work, setWork] = useState();

  //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
  let approvalId = router?.query?.id;
  useEffect(() => {
    // getWard();
    // getAllTableData();
    // getDepartment();
    // getRotationGroup();
    // getRotationSubGroup();
    // getNewsPaper();
    // getDate();
  });
  console.log("connectionData",ownership);

  // view
  return (
    <>
        <div>
        <ComponentToPrintOfficialNotesheet
          connectionData={connectionData}
          slumName={slumName}
          usageType={usageType}
          ownership={ownership}
          villageName={villageName}
          ref={componentRef}
        />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                    // onClick={handlePrint}
                    // onClick={()=>{window.print();return false;}}
                >
                    print
                </Button>

        {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                >
                    Digital Signature
                </Button> */}

        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push(`/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails`);
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};

class ComponentToPrintOfficialNotesheet extends React.Component {
  render() {
    const toWords = new ToWords({ localeCode: "mr-IN" });
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return (
      <>
      
        <div className={styles.main}>
          
          <div className={styles.small}>
          <div className={styles.head}>
        <h1>LOI GENERATION</h1>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
      </p>
      </div>
            <div className={styles.one}>
              
              <div className={styles.logoLOI}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middleLOI} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>
               
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h3>
                      <b>Service Name</b>
                    </h3>
                    <h5>
                     
                      <b>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </b>
                    </h5>
                  
                  </div>

                  <div className={styles.add1}>
                    <h3>
                      <b>Address</b>
                    </h3>
                    <h5>
                      <b>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </b>
                    </h5>
                    
                  </div>
                </div>
              </div>
             
            </div>
            <div style={{ marginLeft: "80px", marginRight: "80px"  }}>
              <h3>Application Date</h3>
              <p>03/12/21</p>
              <h3>Application Number</h3>
              <p>RAC100026799</p>
            </div>

            <div className={styles.sub} style={{ marginLeft: "80px", marginRight: "80px" }}>
              <h3>Subject : </h3>
              <p style={{ marginLeft: "10px"}}> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              
            </div>
            <div className={styles.box} style={{ marginLeft: "80px", marginRight: "80px" }}>
             
              <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              
            </div>


            
          </div>
        </div>
      </>
    );
  }
}

export default Index;
