import { Delete, Visibility } from "@mui/icons-material"
import { IconButton, Paper } from "@mui/material"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import UploadButton from "./UploadButton"

import {
  addDocumentToLocalStorage,
  getDocumentFromLocalStorage,
  removeDocumentToLocalStorage,
} from "../../../components/redux/features/RTIOnlineSystem/rtiOnlineSystem"
import urls from "../../../URLS/urls"
import FileTable from "./FileUpload"

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("")
  const [additionalFiles, setAdditionalFiles] = useState([])
  /////////////////////////////////////////////////////
  const [RTIRelatedDocuments, setRTIRelatedDocuments] = useState([])
  /////////////////////////////////////////////////////

  const [uploading, setUploading] = useState(false)
  const [mainFiles, setMainFiles] = useState([])
  const language = useSelector((state) => state.labels.language)
  const [buttonInputStateNew, setButtonInputStateNew] = useState()

  // Delete
  const discard = async (props) => {
    console.log("propsDelete", props)
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${props.documentPath}`)
          .then((res) => {
            if (res.status == 200) {
              let attachement = getDocumentFromLocalStorage(
                "RTIRelatedDocuments"
              )?.filter((a) => a?.documentPath != props.documentPath)
                ?.map((a) => a)
                
              setAdditionalFiles(attachement)

              removeDocumentToLocalStorage("RTIRelatedDocuments")
              addDocumentToLocalStorage(
                "RTIRelatedDocuments",
                attachement
              )
              swal("File Deleted Successfully!", { icon: "success" })
            } else {
              swal("Something went wrong..!!!")
            }
          })
      }
      // else {
      //   swal("File is Safe")
      // }
    })
  }

  // Columns
  const columns = [
    // {
    //   field: "documentKey",
    //   headerName: "Document Id",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      field: "documentPath",
      headerName: "File Name",
      // minWidth: 50,
      // maxWidth: 180,
      headerAlign: "center",
      align: "center",
      flex: 1,
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
    {
      field: "attachedDate",
      headerName: "Attached Date",
      // field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Action",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        // console.log("record?.row?.attachmentName", record)
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
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                  "_blank"
                )
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
        )
      },
    },
  ]

  useEffect(() => {
    if (getDocumentFromLocalStorage("RTIRelatedDocuments") !== null) {
      setAdditionalFiles(
        getDocumentFromLocalStorage("RTIRelatedDocuments")
      )
    }
  }, [])

  useEffect(() => {
    console.log("additionalFiles1: ", [...mainFiles, ...additionalFiles])
    setRTIRelatedDocuments([...mainFiles, ...additionalFiles])

    addDocumentToLocalStorage("RTIRelatedDocuments", [
      ...mainFiles,
      ...additionalFiles,
    ])
  }, [mainFiles, additionalFiles])

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew)
    console.log("document props :", attachedFile)
  }, [props])

  useEffect(() => {}, [buttonInputStateNew])

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
          appName="RTI" //Module Name
          serviceName={"RTI-Application"} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={RTIRelatedDocuments} //state to be displayed in table
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  )
}

export default Documents
