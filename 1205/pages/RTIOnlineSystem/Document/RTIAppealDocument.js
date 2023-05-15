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
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import FileTable from "./FileUpload"

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("")
  const [additionalFiles, setAdditionalFiles] = useState([])
  const [RTIAppealRelatedDocuments, setRTIRelatedDocuments] = useState([])

  const [uploading, setUploading] = useState(false)
  const [mainFiles, setMainFiles] = useState([])
  const language = useSelector((state) => state.labels.language)
  const [buttonInputStateNew, setButtonInputStateNew] = useState()

  // Delete
  const discard = async (props) => {
    console.log("propsDelete", props)
    swal({
      title: language=="en"?"Delete?":'हटवायचे?',
      text: language=="en"?"Are you sure you want to delete this file ?":'तुम्हाला खात्री आहे की तुम्ही ही फाइल हटवू इच्छिता?',
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${props.documentPath}`)
          .then((res) => {
            if (res.status == 200) {
              // let attachement = getDocumentFromLocalStorage(
              //   "RTIAppealRelatedDocuments"
              // )
              //   ?.filter((a) => a?.filePath != props.documentPath)
              //   ?.map((a) => a)
              // setAdditionalFiles(attachement)

              // removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
              // addDocumentToLocalStorage(
              //   "RTIAppealRelatedDocuments",
              //   attachement
              // )

              let attachement = getDocumentFromLocalStorage(
                "RTIAppealRelatedDocuments"
              )?.filter((a) => a?.documentPath != props.documentPath)
                ?.map((a) => a)
                
              setAdditionalFiles(attachement)

              removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
              addDocumentToLocalStorage(
                "RTIAppealRelatedDocuments",
                attachement
              )
              swal(language=="en"?"File Deleted Successfully!":'फाइल यशस्वीरित्या हटवली!', { icon: "success" })
            } else {
              swal(language=="en"?"Something went wrong..!!!":"Something went wrong..!!!")
            }
          })
      }
    })
  }

  // Columns
  const columns = [
    {
      field: "originalFileName",
      headerName: <FormattedLabel id='fileNm' />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType"/>,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "attachedDate",
      headerName: <FormattedLabel id='attachDate'/>,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions"/>,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (record) => {
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
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                  "_blank"
                )
              }}
            >
              <Visibility />
            </IconButton>

            <IconButton color="error" onClick={() => discard(record.row)}>
              <Delete />
            </IconButton>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    if (getDocumentFromLocalStorage("RTIAppealRelatedDocuments") !== null) {
      setAdditionalFiles(
        getDocumentFromLocalStorage("RTIAppealRelatedDocuments")
      )
    }
  }, [])

  useEffect(() => {
    console.log("additionalFiles1: ", [...mainFiles, ...additionalFiles])
    setRTIRelatedDocuments([...mainFiles, ...additionalFiles])

    addDocumentToLocalStorage("RTIAppealRelatedDocuments", [
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
          marginTop: "2vh",
          marginBottom: "5vh",
        }}
        elevation={4}
      >
        <FileTable
          appName="RTI" //Module Name
          serviceName={"RTI-Appeal"} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={RTIAppealRelatedDocuments} //state to be displayed in table
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  )
}

export default Documents
