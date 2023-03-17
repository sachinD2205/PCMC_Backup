import React from "react";
import styles from "../../../../styles/fireBrigadeSystem/noc.module.css";

const Noc = () => {
  return (
    <>
      <div className={styles.noc}>
        <div className={styles.nocMain}>
          <div className={styles.logoOne}>
            <img src="/logo.png" width="150px" height="150px" />
          </div>
          <div className={styles.mainTitle}>
            <h2>
              <b>Pimpri Chinchwad Municipal Corporation</b>
            </h2>
            <h2>
              <b>Fire Department</b>
            </h2>
          </div>
          <div className={styles.logoTwo}>
            <img src="/rts_servicelogo.png" width="160px" height="160px" />
          </div>
        </div>
        <div>
          <div>
            <h4>File No: </h4>
          </div>
          <div>
            <h4>O.W.No:-Fire/01/SRC-123/WS/37/2023</h4>
          </div>
          <div>
            <h4>Date:- 08/02/2023</h4>
          </div>
        </div>
        <h1>
          ....................................................................................................................
        </h1>
        <h2>
          Provisional Fire No Objection Certificate for Building Construction
        </h2>
        <div>
          <div>Token No:- 12765456777</div>
          <div>Token Date:-08/02/2023</div>
        </div>
        <div>
          <p>
            with reference to the application and Plans submitted,{" "}
            <b>Dt. 08/02/2023 & 11/01/2024 </b>
            by the under mentioned applicant, technical site inspection had been
            carried out by the Concerned Officer of the fire department in
            accordance with the submitted plan copies and documents.
            <p>
              Provisional Fire NOC is being here with issued under Rule
              6.2.6.1;607.2 & 19, and other applicable rules of Development
              Control Rules of PCMC, NBC 2016 - Part IV , G.R. Dt 10/03/2010,
              and under Sec3(2) of Maharashtra Fire & Life Safety Act 2006 &
              Rules 2009 , at the Under mentioned site, subject to compliance of
              the following conditions.
            </p>
          </p>
        </div>

        <div>
          <div>
            <h2>
              <b>Proposed Site Address</b>
            </h2>
            <h2>
              <b>S.No. 126/2, Wakad,Pune</b>
            </h2>
          </div>
          <div>
            <table>
              <tr>
                <td>Plot Area</td>
                <td>6900.00</td>
                <td>Sq.Mtrs</td>
              </tr>
              <tr>
                <td>Permissible FSI Area(Incl. TDR)</td>
                <td>8180.29</td>
                <td>Sq.Mtrs</td>
              </tr>
            </table>
          </div>
          <h2>Building Deatils -</h2>
          <div>
            <table style={{ border: "2px solid black", padding: "10" }}>
              <tr style={{ border: "2px solid black", padding: "10" }}>
                <th style={{ border: "2px solid black", padding: "10" }}>
                  Bldg.Nos.
                </th>
                <th style={{ border: "2px solid black", padding: "10" }}>
                  Height (From GL to Slab)
                </th>
                <th style={{ border: "2px solid black", padding: "10" }}>
                  No. of Floors
                </th>
                <th style={{ border: "2px solid black", padding: "10" }}>
                  Net Built Up Area (Sq.Mtrs)
                </th>
                <th style={{ border: "2px solid black", padding: "10" }}>
                  Gross Built Up Area (Sq.Mtrs)
                </th>
                <th style={{ border: "2px solid black", padding: "10" }}>
                  Occupancy Use Type
                </th>
                <th style={{ border: "2px solid black", padding: "10" }}>
                  Bldg. Classification
                </th>
              </tr>
              <tr>
                <td style={{ border: "2px solid black", padding: "10" }}>C</td>
                <td style={{ border: "2px solid black", padding: "10" }}>
                  21.34(Rev)
                </td>
                <td style={{ border: "2px solid black", padding: "10" }}>
                  BP+Gr.+04(Rev)
                </td>
                <td style={{ border: "2px solid black", padding: "10" }}>
                  2956.04(Rev)
                </td>
                <td style={{ border: "2px solid black", padding: "10" }}>
                  4871.49(Rev)
                </td>
                <td style={{ border: "2px solid black", padding: "10" }}>
                  (Shops + Offices)
                </td>
                <td style={{ border: "2px solid black", padding: "10" }}>
                  Mercantile Bldg.
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Noc;
