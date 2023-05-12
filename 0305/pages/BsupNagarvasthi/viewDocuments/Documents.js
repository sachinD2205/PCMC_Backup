import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UploadButton from "./UploadButton";

import {
  addDocumentToLocalStorage,
  getDocumentFromLocalStorage,
  removeDocumentToLocalStorage,
} from "../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import urls from "../../../URLS/urls";
import FileTable from "./FileUpload";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  /////////////////////////////////////////////////////
  const [bsupDocuments, setbsupDocuments] = useState([]);
  /////////////////////////////////////////////////////

  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();

  // Columns
  const columns = [
    {
      field: "originalFileName",
      headerName: "FileName",

      // minWidth: 50,
      // maxWidth: 180,
      headerAlign: "center",
      align: "center",
      // flex: 1,
      minWidth: 350,
      // renderCell: (record) => {
      //   console.log(":50", record)
      //   let naming = record.value.substring(
      //     record.value.lastIndexOf("__") + 2,
      //     record.value.length
      //   )
      //   return <div>{naming}</div>
      // },
    },
    // {
    //   field: "documentType",
    //   headerName: "File Type",
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 1,
    // },
    {
      field: "fileType",
      headerName: "File Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },

    // {
    //   field: "userName",
    //   headerName: "Uploaded By",
    //   // field: language === "en" ? "attachedNameEn" : "attachedNameMr",
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 1,
    // },
    // {
    //   field: "attachedDate",
    //   headerName: "Attached Date",

    //   headerAlign: "center",
    //   align: "center",
    //   flex: 1,
    // },
    {
      field: "Action",
      headerName: "Actions",
      // <FormattedLabel id="actionns" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        console.log("record?.row?.attachmentName", record.row);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                // console.log("record.row.filePath", record.row.filePath)
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`, "_blank");
              }}
            >
              <Visibility />
            </IconButton>

            {/* {buttonInputStateNew && (
              <IconButton color="error" onClick={() => discard(record.row)}>
                <Delete />
              </IconButton>
            )} */}
            {/* 
            <IconButton color="error" onClick={() => discard(record.row)}>
              <Delete />
            </IconButton> */}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (getDocumentFromLocalStorage("bsupDocuments") !== null) {
      setbsupDocuments(getDocumentFromLocalStorage("bsupDocuments"));
    }
  }, []);

  useEffect(() => {
    console.log("additionalFiles1: ", [...mainFiles, ...additionalFiles]);
    setbsupDocuments([...mainFiles, ...additionalFiles]);

    addDocumentToLocalStorage("bsupDocuments", [...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
    console.log("document props :", props);
  }, [props]);

  useEffect(() => {}, [buttonInputStateNew]);

  useEffect(() => {
    setAdditionalFiles(
      props?.file.map((val) => {
        return val;
      }),
    );
    setAttachedFile(
      props?.file.map((val) => {
        return val;
      }),
    );
  }, [props]);

  return (
    <>
      <Paper
        style={{
          // marginLeft: "15vh",
          // marginRight: "17vh",
          marginTop: "2vh",
          marginBottom: "5vh",
        }}
        elevation={4}
      >
        <FileTable
          appName="BSUP-Scheme" //Module Name
          serviceName={"BSUP-BachatgatRegistration"} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={bsupDocuments} //state to be displayed in table
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  );
};

export default Documents;
