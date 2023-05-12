import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import FileTableNotice from "../../FileUpload/FileTableNotice";

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("");
  const [activeFlag, setActiveFlag] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [noticeAttachment, setNoticeAttachment] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [noticeAttachmentFiltered, setNoticeAttachmentFiltered] = useState();
  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);

  const discard = async (props) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${urls.CFCURL}/file/discard?filePath=${props.filePath}`).then((res) => {
          if (res.status == 200) {
            // Active Flag Y
            let attachementY = JSON.parse(localStorage.getItem("noticeAttachment"))
              ?.filter((a) => a?.filePath != props.filePath)
              ?.map((a) => a);

            // Active Flag N
            let attachementDark = JSON.parse(localStorage.getItem("noticeAttachment"))
              ?.filter((a) => a?.filePath == props.filePath)
              ?.map((a) => a);

            // add active Flag N
            let attachementN = attachementDark.map((data, index) => {
              return {
                ...data,
                activeFlag: "N",
              };
            });

            let attachement = [...attachementY, ...attachementN];

            let attachementWithSrNo = attachement.map((data, index) => {
              return {
                ...data,
                srNo: index + 1,
              };
            });

            console.log("attachementN", attachementWithSrNo);

            setAdditionalFiles(attachementWithSrNo);
            localStorage.removeItem("noticeAttachment");
            localStorage.setItem("noticeAttachment", JSON.stringify(attachementWithSrNo));
            swal("File Deleted Successfully!", { icon: "success" });
          } else {
            swal("Something went wrong..!!!");
          }
        });
      } else {
        swal("File is Safe");
      }
    });
  };

  // Columns
  const columns = [
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      width: 140,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      // width: 300,
    },
    {
      // field:
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            {/** viewButton */}
            <IconButton
              color="primary"
              onClick={() => {
                console.log("record.row.filePath", record.row.filePath);
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`, "_blank");
              }}
            >
              <Visibility />
            </IconButton>
            {/** deleteButton */}
            {deleteButtonInputState && (
              <IconButton color="error" onClick={() => discard(record.row)}>
                <Delete />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // ----------------- useEffect -----------

  useEffect(() => {
    if (localStorage.getItem("noticeAttachment") !== null) {
      setAdditionalFiles(JSON.parse(localStorage.getItem("noticeAttachment")));
    }
    // delete
    if (localStorage.getItem("deleteButtonInputState") == "true") {
      setDeleteButtonInputState(true);
    } else if (localStorage.getItem("deleteButtonInputState") == "false") {
      setDeleteButtonInputState(false);
    }
  }, []);

  useEffect(() => {}, [deleteButtonInputState]);

  useEffect(() => {}, [noticeAttachment, mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("object", [...mainFiles, ...additionalFiles]);
    setNoticeAttachment([...mainFiles, ...additionalFiles]);
    localStorage.setItem("noticeAttachment", JSON.stringify([...mainFiles, ...additionalFiles]));
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
  }, [props]);

  useEffect(() => {}, [buttonInputStateNew]);

  useEffect(() => {
    if (noticeAttachment != null || noticeAttachment != undefined) {
      let dataSourceFiltered = noticeAttachment.filter((data) => {
        if (data?.activeFlag == "Y") {
          return data;
        }
      });
      console.log("dataSourceFiltered", dataSourceFiltered);
      setNoticeAttachmentFiltered(dataSourceFiltered);
    }
  }, [noticeAttachment]);

  useEffect(() => {}, [noticeAttachmentFiltered]);

  // view
  return (
    <>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 20,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "50px",
          marginRight: "75px",
          borderRadius: 100,
        }}
      >
        <strong style={{ display: "flex", justifyContent: "center" }}>
          <FormattedLabel id="document" />
        </strong>
      </div>
      <Paper
        style={{
          marginLeft: "15vh",
          marginRight: "17vh",
          marginTop: "5vh",
          marginBottom: "5vh",
        }}
        elevation={0}
      >
        {/** FileTableComponent **/}
        <FileTableNotice
          appName="LCMS" //Module Name
          serviceName={"L-Notice"} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          activeFlag={setActiveFlag}
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={
            noticeAttachmentFiltered == undefined || noticeAttachmentFiltered == ""
              ? []
              : noticeAttachmentFiltered
          }
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  );
};

export default Documents;
