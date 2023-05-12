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
  const [GrievanceRelatedDocuments, setGrievanceRelatedDocuments] = useState([]);
  /////////////////////////////////////////////////////

  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();

  // Delete
  const discard = async (props) => {
    console.log("propsDelete", props);
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${urls.CFCURL}/file/discard?filePath=${props.documentPath}`).then((res) => {
          if (res.status == 200) {
            let attachement = getDocumentFromLocalStorage("GrievanceRelatedDocuments")
              ?.filter((a) => a?.documentPath != props.documentPath)
              ?.map((a) => a);
            setAdditionalFiles(attachement);

            removeDocumentToLocalStorage("GrievanceRelatedDocuments");
            addDocumentToLocalStorage("GrievanceRelatedDocuments", attachement);
            swal("File Deleted Successfully!", { icon: "success" });
          } else {
            swal("Something went wrong..!!!");
          }
        });
      }
      // else {
      //   swal("File is Safe")
      // }
    });
  };

  // Columns
  const columns = [
    // {
    //   field: "documentKey",
    //   headerName: "Document Id",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      field: "originalFileName",
      headerName: <FormattedLabel id="originalFileName" />,
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
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
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
    {
      field: "attachedDate",
      headerName: <FormattedLabel id="attachedDate" />,
      // field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actionns" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        console.log("record?.row?.attachmentName", record);
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

            <IconButton color="error" onClick={() => discard(record.row)}>
              <Delete />
            </IconButton>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (getDocumentFromLocalStorage("GrievanceRelatedDocuments") !== null) {
      setAdditionalFiles(getDocumentFromLocalStorage("GrievanceRelatedDocuments"));
    }
  }, []);

  useEffect(() => {
    console.log("additionalFiles1: ", [...mainFiles, ...additionalFiles]);
    setGrievanceRelatedDocuments([...mainFiles, ...additionalFiles]);

    addDocumentToLocalStorage("GrievanceRelatedDocuments", [...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
    console.log("document props :", attachedFile);
  }, [props]);

  useEffect(() => {}, [buttonInputStateNew]);

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
          appName="GM" //Module Name
          serviceName={"GM-CMPL"} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={GrievanceRelatedDocuments} //state to be displayed in table
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  );
};

export default Documents;
