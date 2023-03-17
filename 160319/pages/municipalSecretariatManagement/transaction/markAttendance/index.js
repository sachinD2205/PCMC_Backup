// ?agendaDate=2023-02-06&agendaNo=0000000022&committeeId=5

//localhost:8099/ms/api/mstDefineCommitteeMembers/getAll

import React, { useEffect, useState } from "react";
import router from "next/router";
import styles from "./markAttendace.module.css";

import URLs from "../../../../URLS/urls";
import axios from "axios";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Paper, Select, MenuItem, TextField, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Head from "next/head";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Save } from "@mui/icons-material";
import moment from "moment";

const Index = () => {
  const [committessData, setCommittessData] = useState([]);
  const [committeeName, setCommitteeName] = useState({});
  const [corporators, setCorporators] = useState([]);
  const [showForwrdGr, setShowForwrdGr] = useState(false);

  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  console.log(":451", router.query);
  useEffect(() => {
    //Get Committee Name
    // axios
    //   .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
    //   .then((res) => {
    //     res.data.committees.forEach((obj) => {
    //       let letSetData = router.query.committeeId == obj.committeeName;
    //       alert(letSetData);
    //       // setCommittessData()
    //       if (router.query.committeeId == obj.committeeName) {
    //         setCommitteeName(obj);
    //       }
    //     });
    //   })
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
      .then((r) => {
        setCommittessData(
          r?.data?.committees
            ?.filter((obj) => router.query.committeeId == obj.committeeName)
            .map((row) => ({
              id: row.id,
              comitteeEn: row.committeeName,
              comitteeMr: row.committeeNameMr,
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

    //Get Corporators
    axios
      .get(`${URLs.MSURL}/mstDefineCorporators/getAll`)
      .then((res) => {
        setCorporators(
          res.data.corporator.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            fullNameEn: j.firstName + " " + j.middleName + " " + j.lastname,
            fullNameMr: j.firstNameMr + " " + j.middleNameMr + " " + j.lastnameMr,
            attendance: "absent",
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
  console.log(":4124", committessData);
  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "fullNameEn" : "fullNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeMemberName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Select
              variant="standard"
              defaultValue={corporators[params.row.srNo - 1]["attendance"]}
              sx={{
                width: 200,
                textAlign: "center",
              }}
              onChange={(event) => {
                // @ts-ignore
                corporators[params.row.srNo - 1]["attendance"] = event.target.value;
              }}
            >
              <MenuItem key={2} value={"present"}>
                {language === "en" ? "Present" : "उपस्थित"}
              </MenuItem>
              <MenuItem key={3} value={"absent"}>
                {language === "en" ? "Absent" : "अनुपस्थित"}
              </MenuItem>
            </Select>
          </>
        );
      },
    },
  ];

  const onSubmit = () => {
    let committeeMembersAttendance = corporators.map((j, i) => ({
      // @ts-ignore
      listOfConcernCommitteeMembers: j.id,
      // @ts-ignore
      action: j.attendance,
    }));

    let date = moment(new Date()).format("YYYY-MM-DD");

    let CommId = committessData?.find((obj) => router.query.committeeId == obj.comitteeEn)?.id;

    const bodyForApi = {
      agendaNo: router.query.agendaNo,
      committeeId: CommId,
      date,
      attendanceCaptureFrom: "ONLINE",
      committeeMembersAttendance,
    };

    console.log("aara key", bodyForApi, committessData);
    axios.post(`${URLs.MSURL}/trnMarkAttendanceProceedingAndPublish/save`, bodyForApi).then((res) => {
      if (res.status === 200 || res.status === 201) {
        sweetAlert({
          title: "Success!",
          text: "Attendance marked successfully !",
          icon: "success",
          dangerMode: false,
          closeOnClickOutside: false,
        }).then((will) => {
          console.log(":lk", will);
          if (will) {
            setShowForwrdGr(true);
          }
        });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Mark Attendance</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Mark Attendance</div>
        <div
          className={styles.row}
          style={{
            justifyContent: "space-around",
            marginTop: 50,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              onChange={(e) => {
                console.log("Date Selected: ", e.target.value);
              }}
              inputFormat="dd/MM/yyyy"
              label={
                <span>
                  <FormattedLabel id="agendaDate" />
                </span>
              }
              disabled
              value={router.query.agendaDate}
              renderInput={(params) => (
                <TextField sx={{ width: "250px" }} {...params} size="small" fullWidth variant="standard" />
              )}
            />
          </LocalizationProvider>
          <TextField
            disabled
            sx={{ width: "250px" }}
            label={<FormattedLabel id="agendaNo" />}
            variant="standard"
            defaultValue={router.query.agendaNo ?? ""}
          />

          {committessData && (
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="committeeName" />}
              variant="standard"
              value={
                language === "en"
                  ? // @ts-ignore
                    committessData[0]?.comitteeEn
                  : // @ts-ignore
                    committessData[0]?.comitteeMr
              }
              InputLabelProps={{
                shrink: committessData ? true : false,
              }}
            />
          )}
        </div>
        <div className={styles.table}>
          <DataGrid
            autoHeight
            sx={{
              marginTop: "5vh",
              marginBottom: "3vh",
              width: "70%",

              "& .cellColor": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
            rows={corporators}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>

        <div className={styles.row} style={{ justifyContent: "center" }}>
          <div className={styles.buttons}>
            <Button
              // disabled={corporators ? false : true}
              disabled={showForwrdGr}
              color="success"
              variant="contained"
              endIcon={<Save />}
              onClick={() => {
                onSubmit();
              }}
            >
              <FormattedLabel id="save" />
            </Button>
            <Button
              disabled={corporators ? false : true}
              // endIcon={<Save />}
              variant="contained"
              onClick={() => {
                if (router.query.agendaNo)
                  router.push({
                    pathname: "/municipalSecretariatManagement/transaction/minutesOfMeeting",
                    query: { agendaNo: router.query.agendaNo },
                  });
              }}
            >
              Generatre MOM
            </Button>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default Index;
