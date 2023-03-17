import React from "react";
import { Row, Col, Table } from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Grid,
  Paper,
  IconButton,
  Box,
  Typography,
  Modal,
  TextField,
  Tooltip,
  MenuItem,
  FormHelperText,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import {
  setSelectedNotice,
  setSelectedNoticeAttachmentToSend,
} from "../../../../features/userSlice";
import { setSelectedNoticeHistoryToSend } from "../../../../features/userSlice";
import { setSelectedConcernDeptUserListToSend } from "../../../../features/userSlice";
import { setSelectedParawisePoints } from "../../../../features/userSlice";

import { Controller, useForm } from "react-hook-form";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";

const Index = () => {
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedNoticeType, setSelectedNoticeType] =
    useState("Created Notice");
  const [createdNoticeType, setCreatedNoticeType] = useState([]);
  const [incomingNoticeType, setIncomingNoticeType] = useState([]);
  const [sentNoticeType, setSentNoticeType] = useState([]);
  const [loading, setLoading] = useState(false);

  let user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];
  let tableData5 = [];
  let tableData6 = [];
  let tableData7 = [];
  let tableData8 = [];
  let tableData9 = [];
  let tableData10 = [];
  let tableData11 = [];
  let tableData12 = [];
  let tableData13 = [];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    methods,
    // getValue,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(noticeSchema),
  });

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  // const authority = user?.menus?.find((r) => {
  //   return user?.menus.find((r) => r.id == selectedMenuFromDrawer)?.roles;
  //   // return router.pathname.split("/").pop() === selectedMenuFromDrawer;
  // })?.roles;

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let abc = [];
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  useEffect(() => {
    getDepartments();
  }, []);

  useEffect(() => {
    console.log("router.query1", router.query);
    if (router.query.mode === "Create") {
      // getCreatedNoticeByUser();
    } else if (router.query.mode === "Sent") {
      // getSentNoticesByUser();
    } else if (router.query.mode === "Edit") {
      // getIncomingNoticesByUser();
    }
  }, []);

  useEffect(() => {
    // getCreatedNoticeByUser();
  }, [departments]);

  // Get Table - Data
  const getNoticeDetails = () => {
    // setLoading(true);
    let statuses = [];
    statuses = [
      "NOTICE_DRAFT",
      "NOTICE_REASSIGNED",
      "NOTICE_CREATED",
      "NOTICE_APPROVED",
      "PARAWISE_REPORT_CREATED",
      "PARAWISE_REPORT_DRAFT",
      "RESPONSE_TO_NOTICE_APPROVED",
      "RESPONSE_TO_NOTICE_CREATED",
      "PARAWISE_REPORT_REASSIGNED",
      "RESPONSE_TO_NOTICE_REASSIGNED",
      "PARAWISE_REPORT_APPROVED",
      "FINAL_APPROVED",
    ];

    axios
      .post(`${urls.LCMSURL}/notice/getTrnNoticeByStatus`, {
        // .post(`http://localhost:8098/lc/api/notice/getTrnNoticeByStatus`, {
        statuses,
      })
      // .get(`http://localhost:8098/lc/api/notice/getTrnNoticeData`)
      .then((res) => {
        console.log("resprrre", res);
        setLoading(false);

        if (!res.data && res.data.length == 0) {
          return;
        }

        if (authority.find((val) => val === "NOTICE_ENTRY")) {
          tableData1 = res?.data?.filter((data, index) => {
            return data.status === "NOTICE_DRAFT";
          });
        }
        if (authority.find((val) => val === "NOTICE_APPROVAL")) {
          tableData2 = res?.data?.filter((data, index) => {
            return data.status === "NOTICE_CREATED";
          });
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
          tableData3 = res.data.filter((data, index) => {
            return data.status === "NOTICE_APPROVED";
          });
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
          tableData4 = res.data.filter((data, index) => {
            return data.status === "PARAWISE_REPORT_DRAFT";
          });
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_APPROVAL")) {
          tableData5 = res.data.filter((data, index) => {
            console.log("adata", data);
            return data.status === "PARAWISE_REPORT_CREATED";
          });
        }

        if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
          tableData6 = res.data.filter((data, index) => {
            return data.status === "PARAWISE_REPORT_APPROVED";
          });
        }

        if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
          tableData7 = res.data.filter((data, index) => {
            return data.status === "RESPONSE_TO_NOTICE_DRAFT";
          });
        }

        if (authority.find((val) => val === "RESPONSE_TO_NOTICE_APPROVAL")) {
          tableData8 = res.data.filter((data, index) => {
            return data.status === "RESPONSE_TO_NOTICE_CREATED";
          });
        }

        if (authority.find((val) => val === "FINAL_APPROVAL")) {
          tableData9 = res.data.filter((data, index) => {
            return data.status === "RESPONSE_TO_NOTICE_APPROVED";
          });
        }

        if (authority.find((val) => val === "FINAL_APPROVAL")) {
          tableData10 = res.data.filter((data, index) => {
            return data.status === "FINAL_APPROVED";
          });
        }

        if (authority.find((val) => val === "NOTICE_ENTRY")) {
          tableData11 = res.data.filter((data, index) => {
            return data.status === "NOTICE_REASSIGNED";
          });
        }

        if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
          tableData12 = res.data.filter((data, index) => {
            return data.status === "RESPONSE_TO_NOTICE_REASSIGNED";
          });
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
          tableData13 = res.data.filter((data, index) => {
            return data.status === "PARAWISE_REPORT_REASSIGNED";
          });
        } else {
          // setDataSource(res.data);
        }

        tableData = [
          ...tableData1,
          ...tableData2,
          ...tableData3,
          ...tableData4,
          ...tableData5,
          ...tableData6,
          ...tableData7,
          ...tableData8,
          ...tableData9,
          ...tableData10,
          ...tableData11,
          ...tableData12,
          ...tableData13,
        ];

        console.log("tableData", tableData);
        tableData.sort((a, b) => {
          console.log("sortedTableData", a, b);
          // return b - a;
        });

        let _res = tableData.map((r, i) => {
          console.log("res TD", r.timeStamp, r.id);
          return {
            srNo: i + 1,
            id: r.id,
            // noticeDate: r.noticeDate,
            remark: r.remark ? r.remark : "-",
            // designation: r.designation ? r.designation : "-",
            noticeRecivedDate: r.noticeRecivedDate,
            requisitionDate: r.requisitionDate,
            concernDeptUserList: r.concernDeptUserList,
            noticeDate: r.noticeDate,
            timeStamp: r.timeStamp ? r.timeStamp : "-",
            // noticeDate: moment(r.noticeDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
            // noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
            //   "YYYY-MM-DD"
            // ),
            // requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
            //   "YYYY-MM-DD"
            // ),
            // documentOriName: r.documentOriName,
            noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson
              ? r.noticeRecivedFromAdvocatePerson
              : "-",

            // noticeRecivedFromPerson:
            //   employeeList.find(
            //     (obj) => obj.id === r.noticeRecivedFromPerson
            //   )?.firstNameEn +
            //   " " +
            //   employeeList.find(
            //     (obj) => obj.id === r.noticeRecivedFromPerson
            //   )?.lastNameEn,
            // department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department
              ? departments?.find((obj) => obj?.id === r.department)?.department
              : "-",
            attachedFile: r.attachedFile,
            status: r.status,
            noticeAttachment: r.noticeAttachment,
            noticeHisotry: r.noticeHisotry,
            parawiseTrnParawiseReportDaoLst: r.parawiseTrnParawiseReportDaoLst,
            noticeDetails: r.noticeDetails ? r.noticeDetails : "-",
            remark: r.remark ? r.remark : "-",
            advocateAddress: r.advocateAddress ? r.advocateAddress : "-",
            // noticeSentDate: r.noticeSentDate ? r.noticeSentDate : "-",
          };
        });

        console.log("2323", _res);

        setDataSource(_res);

        // let _res = res.data.map((r, i) => {
        //   return {
        //     srNo: i + 1,
        //     id: r.id,
        //     noticeDate: r.noticeDate,
        //     noticeRecivedDate: r.noticeRecivedDate,
        //     requisitionDate: r.requisitionDate,
        //     // noticeDate: moment(r.noticeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
        //     // noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
        //     //   "YYYY-MM-DD"
        //     // ),
        //     // requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
        //     //   "YYYY-MM-DD"
        //     // ),
        //     // documentOriName: r.documentOriName,
        //     noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson,
        //     department: r.department,
        //     departmentName: departments?.find((obj) => obj?.id === r.department)
        //       ?.department,
        //     attachedFile: r.attachedFile,
        //     status: r.status,
        //     noticeAttachment: r.noticeAttachment,
        //     noticeHisotry: r.noticeHisotry,
        //   };
        // });

        // setDataSource(_res);

        // if (res.createdUserId === user.id) {
        //   console.log("created", res.createdUserId);
        //   getCreatedNoticeByUser();
        // } else if (res.senderUser === user.id) {
        //   console.log("sender", res.senderUser);
        //   getSentNoticesByUser();
        // } else if (res.receiverUser === user.id) {
        //   console.log("receiver", res.receiverUser);
        //   getIncomingNoticesByUser();
        // }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getCreatedNoticeByUser = () => {
    axios
      .get(`${urls.LCMSURL}/notice/getCreatedNoticesByUser`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("res getCreatedNoticesByUser", res);

        setDataSource(
          res.data.notice.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            noticeDate: moment(r.noticeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            documentOriName: r.documentOriName,
            noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson,
            department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department,
            attachedFile: r.attachedFile,
            status: r.status,
            noticeAttachment: r.noticeAttachment,
            noticeHisotry: r.noticeHisotry,
          }))
        );
      });
  };

  const getIncomingNoticesByUser = () => {
    axios
      .get(`${urls.LCMSURL}/notice/getIncomingNoticesByUser`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("res getIncomingNoticesByUser", res);

        setDataSource(
          res.data.notice.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            noticeDate: moment(r.noticeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            documentOriName: r.documentOriName,
            noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson,
            department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department,
            attachedFile: r.attachedFile,
            status: r.status,
            noticeAttachment: r.noticeAttachment,
            noticeHisotry: r.noticeHisotry,
          }))
        );
      });
  };

  const getSentNoticesByUser = () => {
    axios
      .get(`${urls.LCMSURL}/notice/getSentNoticesByUser`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("res getSentNoticesByUser", res);

        setDataSource(
          res.data.notice.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            noticeDate: moment(r.noticeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            documentOriName: r.documentOriName,
            noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson
              ? r.noticeRecivedFromAdvocatePerson
              : "-",
            department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department,
            attachedFile: r.attachedFile,
            status: r.status,
            noticeAttachment: r.noticeAttachment,
            noticeHisotry: r.noticeHisotry,
          }))
        );
      });
  };

  const getDepartments = async () => {
    setLoading(true);

    try {
      const departmentResponse = await axios.get(
        `${urls.CFCURL}/master/department/getAll`
      );
      console.log("departmentResponse dep", departmentResponse);
      setDepartments(
        departmentResponse.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        }))
      );

      let statuses = [];
      statuses = [
        "NOTICE_DRAFT",
        "NOTICE_REASSIGNED",
        "NOTICE_CREATED",
        "NOTICE_APPROVED",
        "PARAWISE_REPORT_DRAFT",
        "PARAWISE_REPORT_REASSIGNED",
        "PARAWISE_REPORT_CREATED",
        "PARAWISE_REPORT_APPROVED",
        "RESPONSE_TO_NOTICE_DRAFT",
        "RESPONSE_TO_NOTICE_REASSIGNED",
        "RESPONSE_TO_NOTICE_CREATED",
        "RESPONSE_TO_NOTICE_APPROVED",
        "FINAL_APPROVED",
      ];

      let noticeResponse = await axios.post(
        `${urls.LCMSURL}/notice/getTrnNoticeByStatus`,
        {
          statuses,
        }
      );

      handleDepartmentAndNoticeData(departmentResponse, noticeResponse);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDepartmentAndNoticeData = (departmentsResponse, noticeRes) => {
    try {
      console.log("respe", noticeRes);
      setLoading(false);

      if (!noticeRes.data && noticeRes.data.length == 0) {
        return;
      }

      if (authority.find((val) => val === "NOTICE_ENTRY")) {
        tableData1 = noticeRes?.data?.filter((data, index) => {
          return data.status === "NOTICE_DRAFT";
        });
      }
      if (authority.find((val) => val === "NOTICE_APPROVAL")) {
        tableData2 = noticeRes?.data?.filter((data, index) => {
          return data.status === "NOTICE_CREATED";
        });
      }

      if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
        tableData3 = noticeRes.data.filter((data, index) => {
          return data.status === "NOTICE_APPROVED";
        });
      }

      if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
        tableData4 = noticeRes.data.filter((data, index) => {
          return data.status === "PARAWISE_REPORT_DRAFT";
        });
      }

      if (authority.find((val) => val === "PARAWISE_REPORT_APPROVAL")) {
        tableData5 = noticeRes.data.filter((data, index) => {
          return data.status === "PARAWISE_REPORT_CREATED";
        });
      }

      if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
        tableData6 = noticeRes.data.filter((data, index) => {
          return data.status === "PARAWISE_REPORT_APPROVED";
        });
      }

      if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
        tableData7 = noticeRes.data.filter((data, index) => {
          return data.status === "RESPONSE_TO_NOTICE_DRAFT";
        });
      }

      if (authority.find((val) => val === "RESPONSE_TO_NOTICE_APPROVAL")) {
        tableData8 = noticeRes.data.filter((data, index) => {
          return data.status === "RESPONSE_TO_NOTICE_CREATED";
        });
      }

      if (authority.find((val) => val === "FINAL_APPROVAL")) {
        tableData9 = noticeRes.data.filter((data, index) => {
          return data.status === "RESPONSE_TO_NOTICE_APPROVED";
        });
      }

      if (authority.find((val) => val === "FINAL_APPROVAL")) {
        tableData10 = noticeRes.data.filter((data, index) => {
          return data.status === "FINAL_APPROVED";
        });
      }

      if (authority.find((val) => val === "NOTICE_ENTRY")) {
        tableData11 = noticeRes.data.filter((data, index) => {
          return data.status === "NOTICE_REASSIGNED";
        });
      }

      if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
        tableData12 = noticeRes.data.filter((data, index) => {
          return data.status === "RESPONSE_TO_NOTICE_REASSIGNED";
        });
      }

      if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
        tableData13 = noticeRes.data.filter((data, index) => {
          return data.status === "PARAWISE_REPORT_REASSIGNED";
        });
      } else {
        // setDataSource(noticeRes.data);
      }

      tableData = [
        ...tableData1,
        ...tableData2,
        ...tableData3,
        ...tableData4,
        ...tableData5,
        ...tableData6,
        ...tableData7,
        ...tableData8,
        ...tableData9,
        ...tableData10,
        ...tableData11,
        ...tableData12,
        ...tableData13,
      ];

      console.log("tableData", tableData);

      let _res = tableData.map((r, i) => {
        console.log("noticeRes TD", r);
        return {
          srNo: i + 1,
          id: r.id,
          remark: r.remark ? r.remark : "-",
          noticeRecivedDate: r.noticeRecivedDate ? r.noticeRecivedDate : "-",
          requisitionDate: r.requisitionDate ? r.requisitionDate : "-",
          concernDeptUserList: r.concernDeptUserList
            ? r.concernDeptUserList
            : "-",
          noticeDate: r.noticeDate ? r.noticeDate : "-",
          // noticeDate: r.noticeDate
          //   ? moment(r.noticeDate).format("DD-MM-YYYY")
          //   : "-",

          noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson
            ? r.noticeRecivedFromAdvocatePerson
            : "-",

          departmentName: departmentsResponse?.data?.department?.find(
            (obj) => obj?.id === r.department
          )?.department
            ? departmentsResponse?.data?.department?.find(
                (obj) => obj?.id === r.department
              )?.department
            : "-",
          attachedFile: r.attachedFile ? r.attachedFile : "-",
          status: r.status ? r.status : "-",
          noticeAttachment: r.noticeAttachment ? r.noticeAttachment : "-",
          noticeHisotry: r.noticeHisotry ? r.noticeHisotry : "-",
          parawiseTrnParawiseReportDaoLst: r.parawiseTrnParawiseReportDaoLst
            ? r.parawiseTrnParawiseReportDaoLst
            : "-",
          noticeDetails: r.noticeDetails ? r.noticeDetails : "-",
          remark: r.remark ? r.remark : "-",
          advocateAddress: r.advocateAddress ? r.advocateAddress : "-",
          timeStamp: r.timeStamp ? r.timeStamp : "-",
          inwardNo: r.inwardNo ? r.inwardNo : "-",
        };
      });

      console.log("2323", _res);
      setDataSource(_res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Delete By ID
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.LCMSURL}/notice/discardTrnNotice/${value}`)
          .then((res) => {
            console.log("del res", res);
            if (res.status == 226) {
              // message.success("Record Deleted !!!");
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getReligionDetails();
              // getcaseCategory();
              getDepartments();
              // setButtonInputState(false);
            }
          });
      }
    });
    // await
  };

  // Edit Record
  const editRecord = (record) => {
    console.log("Record : ---> ", record);

    router.push({
      pathname: "/LegalCase/transaction/newNotice/view",
      query: {
        pageMode: "Edit",
        ...record,

        // noticeDate: moment(record.row.noticeDate, "YYYY-MM-DD").format(
        //   "YYYY-MM-DD"
        // ),
        // noticeRecivedFromAdvocatePerson:
        //   record.row.noticeRecivedFromAdvocatePerson,
        // department: record.row.department,
        // departmentName: departments?.find(
        //   (obj) => obj?.id === record.row.department
        // )?.department,

        // noticeRecivedDate: moment(
        //   record.noticeRecivedDate,
        //   "YYYY-MM-DD"
        // ).format("YYYY-MM-DD"),

        // requisitionDate: moment(record.requisitionDate, "YYYY-MM-DD").format(
        //   "YYYY-MM-DD"
        // ),
      },
    });
  };

  const onApproveNoticeClick = (params) => {
    router.push({
      pathname: "/LegalCase/transaction/newNotice/approveNotice",
      query: {
        pageMode: "Edit",
        ...params,
      },
    });
  };

  const columns = [
    {
      // headerName: "Sr.No",
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   headerName: "Notice No.",
    //   field: "noticeNo",
    //   width: 100,
    // },
    {
      // headerName: "Notice Date",
      headerName:<FormattedLabel id="noticeDate"/>,
      field: "noticeDate",
      // flex: 1,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      // headerName: "Time Stamp",
      headerName:<FormattedLabel id="timeStamp"/>,
      field: "timeStamp",
      // flex: 1,
      width: 120,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   headerName: "Notice Recevied Date",
    //   field: "noticeReceviedDate",
    //   width: 200,
    // },
    {
      // headerName: "Notice received from Advocate/Person",
      headerName:<FormattedLabel id="noticeRecivedFromAdvocatePerson"/>,
      field: "noticeRecivedFromAdvocatePerson",
      // flex: 1,
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   headerName: "Department Name",
    //   field: "departmentName",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   headerName: "Notice received through",
    //   field: "noticeReceivedThrough",
    //   width: 200,
    // },
    // {
    //   headerName: "Requisition Date",
    //   field: "requisitionDate",
    //   width: 180,
    // },
    // {
    //   headerName: "Attached File",
    //   field: "attachedFile",
    //   width: 130,
    // },
    // {
    //   headerName: "Parawise Information from concern Department",
    //   field: "parawiseInformationFromConcernDepartment",
    //   width: 350,
    // },
    // {
    //   headerName: "Digital Signature",
    //   field: "digitalSignature",
    //   width: 150,
    // },
    {
      headerName: "Status",
      field: "status",
      // flex: 1,
      width: 280,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        return (
          <>
            {/* NOTICE_DRAFT */}
            {authority?.includes("NOTICE_ENTRY") &&
              params.row.status === "NOTICE_DRAFT" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/editNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT NOTICE
                </Button>
              )}
            {/* NOTICE_APPROVAL */}
            {authority?.includes("NOTICE_APPROVAL") &&
              params.row.status === "NOTICE_CREATED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    console.log("543", params.row);
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/sendNotice",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  NOTICE APPROVAL
                </Button>
              )}
            {/* PARAWISE_ENTRY */}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              params.row.status === "NOTICE_APPROVED" && (
                // params.row.status === "PARAWISE_REPORT_DRAFT") && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname: "/LegalCase/transaction/parawiseReport/addForm",
                      query: {
                        pageMode: "Edit",
                        authority,
                        ...params.row,
                      },
                    });
                  }}
                >
                  PARAWISE ENTRY
                </Button>
              )}

            {/* PARAWISE_REPORT_EDIT */}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              params.row.status === "PARAWISE_REPORT_DRAFT" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/parawiseReport/editParawiseReport",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT PARAWISE REPORT
                </Button>
              )}

            {/* PARAWISE_APPROVAL */}
            {authority?.includes("PARAWISE_REPORT_APPROVAL") &&
              params.row.status === "PARAWISE_REPORT_CREATED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/parawiseReport/sendNotice",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Add",
                        ...params.row,
                      },
                    });
                  }}
                >
                  PARAWISE APPROVAL
                </Button>
              )}

            {/* RESPONSE_TO_NOTICE_ENTRY */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "PARAWISE_REPORT_APPROVED" && (
                // || params.row.status === "RESPONSE_TO_NOTICE_DRAFT"
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/addForm",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  RESPONSE TO NOTICE ENTRY
                </Button>
              )}

            {/* RESPONSE_TO_NOTICE_EDIT */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "RESPONSE_TO_NOTICE_DRAFT" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/editResponseToNotice",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT RESPONSE TO NOTICE
                </Button>
              )}

            {/* RESPONSE TO NOTICE APPROVAL */}
            {authority?.includes("RESPONSE_TO_NOTICE_APPROVAL") &&
              params.row.status === "RESPONSE_TO_NOTICE_CREATED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/sendNotice",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  RESPONSE TO NOTICE APPROVAL
                </Button>
              )}
            {authority?.includes("FINAL_APPROVAL") &&
              params.row.status === "RESPONSE_TO_NOTICE_APPROVED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/sendNotice",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Final",
                        ...params.row,
                      },
                    });
                  }}
                >
                  FINAL APPROVAL
                </Button>
              )}
            {authority?.includes("FINAL_APPROVAL") &&
              params.row.status === "FINAL_APPROVED" && (
                <Button
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                    backgroundColor: "green",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#556CD6",
                    },
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/newNotice/digitalSignature",
                      query: {
                        pageMode: "Final",
                        ...params.row,
                      },
                    });
                  }}
                >
                  {/* DIGITAL SIGNATURE */}
                  SIGN AND APPROVE
                </Button>
              )}
            {authority?.includes("NOTICE_ENTRY") &&
              params.row.status === "NOTICE_REASSIGNED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/editNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT NOTICE
                </Button>
              )}

            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "RESPONSE_TO_NOTICE_REASSIGNED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/editResponseToNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT RESPONSE TO NOTICE
                </Button>
              )}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              params.row.status === "PARAWISE_REPORT_REASSIGNED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    dispatch(
                      setSelectedParawisePoints(
                        params.row.parawiseTrnParawiseReportDaoLst
                      )
                    );
                    router.push({
                      pathname:
                        "/LegalCase/transaction/parawiseReport/editParawiseReport",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT PARAWISE REPORT
                </Button>
              )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >

        {/* For Header */}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="notice" />
          </h2>
        </Box>

        <Box sx={{}}>
          {loading ? (
            // <Box sx={{}}>
            <Loader />
          ) : (
            // </Box>
            <Grid container sx={{marginTop:"10px"}}>
              <Grid item xs={10}></Grid>
              <Grid item xs={2} sx={{ paddingBottom: "5px" }}>
                {authority?.includes("NOTICE_ENTRY") ? (
                  <Button
                  
                    // type="primary"
                    variant="contained"
                    size="small"
                    onClick={() =>
                      router.push({
                        pathname: "/LegalCase/transaction/newNotice/view",
                        query: {
                          showNoticeAttachment: true,
                          pageMode: "Add",
                        },
                      })
                    }
                    endIcon={<AddIcon />}
                  >
                    {/* Create Notice */}
                    <FormattedLabel id="createNotice"/>
                  </Button>
                ) : (
                  ""
                )}
              </Grid>
              {console.log("dataSource", dataSource)}

              <Grid item xs={12}>
                {/* <Box
            sx={{
              margin: 5,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <FormControl
              // error={!!errors.department}
              variant="standard"
              sx={{
                width: "40%",
                backgroundColor: "white",
              }}
            >
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Select Notice Type"
                value={selectedNoticeType}
                sx={{ backgroundColor: "white" }}
                onChange={(value) => {
                  setSelectedNoticeType(value.target.value);
                  if ("Inbox Notice" === value.target.value) {
                    getIncomingNoticesByUser();
                  } else if ("Outbox Notice" === value.target.value) {
                    getSentNoticesByUser();
                  } else {
                    getCreatedNoticeByUser();
                  }
                }}
              >
                {["Created Notice", "Inbox Notice", "Outbox Notice"].map(
                  (department, index) => (
                    <MenuItem key={index} value={department}>
                      {department}
                    </MenuItem>
                  )
                )}
              </Select>

              <FormHelperText>
                {errors?.department ? errors?.department.message : null}
              </FormHelperText>
            </FormControl>
          </Box> */}

                <DataGrid
                  disableColumnFilter
                  disableColumnSelector
                  disableToolbarButton
                  disableDensitySelector
                  components={{ Toolbar: GridToolbar }}
                  // componentsProps={{
                  //   toolbar: {
                  //     showQuickFilter: false,
                  //     disableExport: true,
                  //     disableToolbarButton: true,
                  //   },
                  // }}
                  autoHeight
                  rowHeight={35}
                  headerHeight={40}
                  sx={{
                    backgroundColor: "white",
                  }}
                  rows={dataSource || []}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  //checkboxSelection
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
