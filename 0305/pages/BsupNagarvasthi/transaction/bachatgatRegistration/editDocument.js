import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addDocumentToLocalStorage,getDocumentFromLocalStorage } from "../../../../components/bsupNagarVasthi/LocalStorageFunctions/bsupDoc";
import urls from "../../../../URLS/urls";
import FileTable from "../../uploadDocuments/FileUpload";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [bsupDocuments, setbsupDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const [alreadyFile, setAlreadyFiles]=useState([])
  const language = useSelector((state) => state.labels.language);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();

  // Delete
  const discard = async (props) => {
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
            let attachement = getDocumentFromLocalStorage("bsupDocuments")
              ?.filter((a) => a?.documentPath != props.documentPath)
              ?.map((a) => a);
            setAdditionalFiles(attachement);
            addDocumentToLocalStorage("bsupDocuments", attachement);
            swal("File Deleted Successfully!", { icon: "success" });
          } else {
            swal("Something went wrong..!!!");
          }
        });
      }
    });
  };

  // Columns
  const columns = [

    {
      field: "originalFileName",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      minWidth: 350,
    },
    {
      field: "documentType",
      headerName:  <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "attachedDate",
      headerName: <FormattedLabel id="attachedDate"/>,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Action",
      headerName:  <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
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
                console.log("record.row.filePath", record.row.filePath);
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`, "_blank");
              }}
            >
              <Visibility />
            </IconButton>
            <IconButton color="error" onClick={() => discard(record.row)}>
              <Delete />
            </IconButton>

            {/* <IconButton
              onClick={() => {
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton> */}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    console.log("bsupAlreadyDocuments", getDocumentFromLocalStorage("bsupAlreadyDocuments"));
    console.log("bsupDocuments", getDocumentFromLocalStorage("bsupDocuments"));
    
    if(getDocumentFromLocalStorage("bsupAlreadyDocuments")!==null){
      setAlreadyFiles(getDocumentFromLocalStorage("bsupAlreadyDocuments"))
    }
    if (getDocumentFromLocalStorage("bsupDocuments") !== null && getDocumentFromLocalStorage("bsupAlreadyDocuments")!==null) {
      setbsupDocuments([...alreadyFile]);
    }
  }, []);

  useEffect(() => {

    setbsupDocuments([...alreadyFile,...mainFiles, ...additionalFiles]);

    addDocumentToLocalStorage("bsupDocuments", [...alreadyFile,...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
    setbsupDocuments([...alreadyFile,...getDocumentFromLocalStorage("bsupDocuments")]);
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
          appName={props.appName} //Module Name
          serviceName={props.serviceName} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={bsupDocuments}
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  );
};

export default Documents;
