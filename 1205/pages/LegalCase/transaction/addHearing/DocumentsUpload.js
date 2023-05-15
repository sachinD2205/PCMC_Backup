import { Delete, Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import FileTable from "./FileTable";
import FileTable from "../../FileUpload/FileTable copy";

const Documents = () => {
  const [attachedFile, setAttachedFile] = useState('')
  const [additionalFiles, setAdditionalFiles] = useState([])
  const [finalFiles, setFinalFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [mainFiles, setMainFiles] = useState([])

  useEffect(() => {
    console.log("Language bol: ", language)
    console.log("Table Files: ", additionalFiles)
    setFinalFiles([...mainFiles, ...additionalFiles])
  }, [mainFiles, additionalFiles])

const language = useSelector((state) => state.labels.language)

  const columns = [
    // {
    //   headerName: 'Sr.No',
    //   field: 'srNo',
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: 'File Name',
      field: 'originalFileName',
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: 'File Type',
      field: 'extension',
      width: 140,
    },
    {
      headerName: 'Uploaded By',
      field: language ==='en'?'attachedNameEn':'attachedNameMr',
      // field: language ==='en'?'attachedNameMr':'attachedNameEn',
      flex: 1,
      // width: 300,
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color='primary'
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.attachmentName}`,
                  '_blank'
                )
              }}
            >
              <Visibility />
            </IconButton>

            <IconButton
              color='error'
              onClick={() => discard(record.row.attachmentName, record.row.srNo)}
            >
              <Delete />
            </IconButton>
          </>
        )
      },
    },
  ]

  return (
    <>
      <FileTable
        appName="LCMS" //Module Name
        serviceName={"L-Notice"} //Transaction Name
        fileName={attachedFile} //State to attach file
        filePath={setAttachedFile} // File state upadtion function
        newFilesFn={setAdditionalFiles} // File data function
        columns={columns} //columns for the table
        rows={finalFiles} //state to be displayed in table
        uploading={setUploading}
      />
    </>
  );
};

export default Documents;
