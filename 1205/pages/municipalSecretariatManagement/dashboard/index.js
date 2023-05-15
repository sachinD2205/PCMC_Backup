import React, { useEffect, useState } from "react";
import { Button, FormControl, FormControlLabel, Paper, Radio, RadioGroup } from "@mui/material";
import styles from "./msm.module.css";
import Head from "next/head";
import urls from "../../../URLS/urls";
import axios from "axios";
import { AcUnit, Check, Description, HourglassTop, MoreHoriz, Undo } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";

const Dashboard = () => {
  const [dashboardType, setDashboardType] = useState("all");
  const [table, setTable] = useState([]);
  const [dockets, setDockets] = useState([]);
  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: "",
      financialYearMr: "",
    },
  ]);
  const [committeeName, setCommitteeName] = useState([
    {
      id: 1,
      committeeNameEn: "",
      committeeNameMr: "",
    },
  ]);
  const [docketTiles, setDocketTiles] = useState([
    {
      id: 1,
      label: "",
      count: 0,
      icon: <></>,
      status: "",
    },
  ]);

  useEffect(() => {
    //Get Fiscal Year
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll`)
      .then((res) => {
        console.log("Financial Year: ", res.data.financialYear);
        setFinancialYear(
          res.data.financialYear.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Committee
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAll`)
      .then((res) => {
        console.log("Committee: ", res.data.committees);
        setCommitteeName(
          res.data.committees.map((j) => ({
            id: j.id,
            committeeNameEn: j.committeeName,
            committeeNameMr: j.committeeNameMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });
  }, []);

  useEffect(() => {
    //Get all dockets
    axios.get(`${urls.MSURL}/trnNewDocketEntry/getAll`).then((res) => {
      setDockets(
        res.data.newDocketEntry
          .filter((j) => {
            if (dashboardType == "all") {
              return j;
            } else {
              return j.isAgendaPrepared == true;
            }
          })
          .map((j, i) => ({
            srNo: i + 1,
            ...j,
            subjectDate: moment(j.subjectDate).format("DD-MM-YYYY"),
            approvedDate: moment(j.approvedDate).format("DD-MM-YYYY"),
            financialYearEn: financialYear?.find((obj) => {
              return obj.id === j.financialYear;
            })?.financialYearEn,
            financialYearMr: financialYear?.find((obj) => {
              return obj.id === j.financialYear;
            })?.financialYearMr,
            committeeNameEn: committeeName?.find((obj) => {
              return obj.id === j.committeeId;
            })?.committeeNameEn,
            committeeNameMr: committeeName?.find((obj) => {
              return obj.id === j.committeeId;
            })?.committeeNameMr,
          })),
      );
    });
  }, [financialYear, dashboardType]);

  useEffect(() => {
    if (dockets.length > 0) {
      let submitted = 0,
        inProcess = 0,
        freezed = 0,
        reassigned = 0,
        approved = 0,
        onHold = 0;

      dockets.forEach((obj) => {
        // @ts-ignore
        if (obj.status == "ON HOLD") {
          ++onHold;
          // @ts-ignore
        } else if (obj.status == "SUBMITTED") {
          ++submitted;
          // @ts-ignore
        } else if (obj.status == "IN PROCESS") {
          ++inProcess;
          // @ts-ignore
        } else if (obj.status == "FREEZED") {
          ++freezed;
          // @ts-ignore
        } else if (obj.status == "APPROVE") {
          ++approved;
          // @ts-ignore
        } else if (obj.status == "REASSIGN") {
          ++reassigned;
        }
      });

      setDocketTiles([
        {
          id: 4,
          label: "In Process",
          count: inProcess,
          icon: <MoreHoriz />,
          status: "IN PROCESS",
        },
        {
          id: 5,
          label: "Reassigned",
          count: reassigned,
          icon: <Undo />,
          status: "REASSIGN",
        },
        {
          id: 6,
          label: "Freezed",
          count: freezed,
          icon: <AcUnit />,
          status: "FREEZED",
        },
        { id: 7, label: "Approved", count: approved, icon: <Check />, status: "APPROVE" },
        { id: 8, label: "On Hold", count: onHold, icon: <HourglassTop />, status: "ON HOLD" },
      ]);
    }

    // @ts-ignore
    setTable(dockets.filter((j) => j.status == "IN PROCESS"));
  }, [dockets]);

  const columns = [
    {
      headerClassName: "cellColor",

      field: "subjectDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectDate" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "approvedDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="approvedDate" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "financialYearEn",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="financialYear" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "committeeNameEn",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeName" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",

      field: "subject",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 130,
    },
    {
      headerClassName: "cellColor",

      field: "subjectSummary",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectSummary" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "outwardNumber",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="inwardNumber" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "inwardOutwardDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="inwardDate" />,
      width: 200,
    },
  ];

  return (
    <>
      <Head>
        <title>MSM - Dashboard</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Municipal Secretariat Managment System Dashboard</div>
        <div className={styles.row} style={{ justifyContent: "center", marginTop: "2%" }}>
          <FormControl>
            <RadioGroup
              name="dashboard"
              defaultValue="all"
              sx={{ gap: 20 }}
              onChange={(e) => {
                setDashboardType(e.target.value);
              }}
              row
            >
              <FormControlLabel value="all" control={<Radio />} label="All Dockets" />
              <FormControlLabel value="agendaPrepared" control={<Radio />} label="Agenda prepared dockets" />
            </RadioGroup>
          </FormControl>
        </div>

        {/* {dashboardType == "all" && (
          
        )} */}
        <>
          {docketTiles.length > 1 && (
            <div className={styles.tilesWrapper}>
              {docketTiles.map((obj, i) => {
                return (
                  <div className={styles.tile} key={i}>
                    <div className={styles.icon}>
                      {
                        // @ts-ignore
                        obj.icon
                      }
                    </div>
                    <div className={styles.tileContent}>
                      <span style={{ textTransform: "uppercase" }}>
                        {
                          // @ts-ignore
                          obj.label
                        }
                      </span>
                      <div className={styles.container}>
                        <div className={styles.slider}>
                          <span>
                            {
                              // @ts-ignore
                              obj.count
                            }
                          </span>
                          <Button
                            variant="contained"
                            onClick={() => {
                              obj.status == "all"
                                ? setTable(dockets) // @ts-ignore
                                : setTable(dockets.filter((j) => j.status == obj.status));
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                      {docketTiles.length - 1 != i && <div className={styles.divider}></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DataGrid
            autoHeight
            sx={{
              marginTop: 8,
              width: "100%",

              "& .cellColor": {
                backgroundColor: "#1976d2",
                color: "white",
              },
              "& .redText": {
                color: "red",
              },
              "& .orangeText": {
                color: "orange",
              },
              "& .greenText": {
                color: "green",
              },
              "& .blueText": {
                color: "blue",
              },
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </>
      </Paper>
    </>
  );
};

export default Dashboard;
