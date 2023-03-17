import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import FormattedLabel from './FormattedLabel'
import axios from 'axios'
import router from 'next/router'
import { useSelector } from 'react-redux'
import { Add, Delete } from '@mui/icons-material'
import { Button, IconButton, TextField } from '@mui/material'
import URLs from '../../URLS/urls'

const TableFile = (props) => {
  const [table, setTable] = useState([])
  const [runAgain, setRunAgain] = useState(false)

  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  useEffect(() => {
    setRunAgain(false)
    setTable(props.rows)
    console.log('props.rows: ', props.rows)
  }, [runAgain])

  const handleFile = (event, rowData) => {
    if (event.target.files) {
      let formData = new FormData()
      formData.append('file', event.target.files[0])
      axios
        .post(
          `${URLs.CFCURL}/file/upload?appName=${props.appName}&serviceName=${props.serviceName}`,
          formData
        )
        .then((r) => {
          if (r.status === 200) {
            const temp = props.rows
            console.log('Before: ', temp)

            temp[rowData.srNo - 1]['filePath'] = r.data.filePath
            temp[rowData.srNo - 1]['status'] = 'upload'

            console.log('After: ', temp)
            props.rowUpdation(temp)
            setRunAgain(true)

            console.log('Rows: ', props.rows)
          }
        })
    }
  }

  const columns = [
    // {
    //   headerClassName: 'cellColor',
    //   headerAlign: 'center',
    //   field: 'srNo',
    //   headerName: <FormattedLabel id='srNo' />,
    //   width: 100,
    //   sortable: false,
    // },
    {
      headerClassName: 'cellColor',
      field: language === 'en' ? 'documentNameEn' : 'documentNameMr',
      headerAlign: 'center',
      align: 'center',
      headerName: <FormattedLabel id='fileName' />,
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      cellClassName: 'columnColor',
      headerAlign: 'center',
      align: 'center',
      field: 'isDocumentMandetory',
      headerName: <FormattedLabel id='mandatoryOrOptional' />,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.isDocumentMandetory ? (
              <FormattedLabel id='mandatory' required />
            ) : (
              <FormattedLabel id='optional' />
            )}
          </>
        )
      },
    },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'upload',
      headerName: <FormattedLabel id='upload' />,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <UploadButton
              use={router.query.pageMode}
              rowData={props.rows[params.row.srNo - 1]}
              deletePath={() => {
                const files = props.rows
                files[params.row.srNo - 1]['filePath'] = ''
                files[params.row.srNo - 1]['status'] = 'upload'
                props.rowUpdation(files)
                setRunAgain(true)
              }}
              Change={(e) => {
                handleFile(e, params.row)
              }}
            />
          </>
        )
      },
    },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'remark',
      headerName: <FormattedLabel id='remark' />,
      hide: router.query.pageMode === 'new' ? true : false,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <span
              style={{
                fontSize: 14,
              }}
            >
              {props.rows[params.row.srNo - 1]['remark']}
            </span>
          </>
        )
      },
    },
  ]

  return (
    <div>
      <DataGrid
        sx={{
          marginTop: '5vh',
          marginBottom: '3vh',
          width: '80vw',
          '& .cellColor': {
            backgroundColor: '#1976d2',
            color: 'white',
          },
          '& .redText': {
            color: 'red',
          },
          '& .normalText': {
            color: 'black',
          },
        }}
        // @ts-ignore
        getCellClassName={(params) => {
          if (params.field === 'isDocumentMandetory' || params.value == null) {
            return params.value == true ? 'redText' : 'normalText'
          }
        }}
        rows={table}
        // @ts-ignore
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        hideFooter
        disableSelectionOnClick
        disableColumnMenu
      />
      {
        // router.query.pageMode === 'view'
        router.query.id &&
          props.rows.find((obj) => obj.status === 'upload') && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button variant='contained' onClick={() => props.uploadAgain()}>
                <FormattedLabel id='save' />
              </Button>
            </div>
          )
      }
    </div>
  )
}

export default TableFile

export const UploadButton = (props) => {
  // const [file, setFile] = useState(null)

  useEffect(() => {
    console.log('RowData: ', props.rowData)
  }, [])

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '5px 5px',
            width: 'max-content',
            cursor: 'pointer',
          }}
        >
          {!props.rowData.filePath && (
            <>
              <Add
                sx={{
                  width: 30,
                  height: 30,
                  border: '1.4px dashed #1976d2',
                  color: '#1976d2',
                  marginRight: 1.5,
                }}
              />

              <input
                type='file'
                onChange={(e) => {
                  // @ts-ignore
                  if (e.target.files[0]) {
                    // @ts-ignore
                    // setFile(e.target.files[0])
                    props.Change(e)
                  }
                }}
                required
                hidden
              />
              <span
                style={{
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: 12,
                  color: '#1976d2',
                }}
              >
                {<FormattedLabel id='addFile' />}
              </span>
            </>
          )}
          {props.rowData.filePath && (
            <>
              <Button
                variant='contained'
                onClick={() => {
                  window.open(
                    `${URLs.CFCURL}/file/preview?filePath=${props.rowData.filePath}`,
                    '_blank'
                  )
                }}
              >
                {<FormattedLabel id='preview' />}
              </Button>
              {props.rowData.filePath && props.rowData.status === 'upload' && (
                <IconButton
                  onClick={() => {
                    axios
                      .delete(
                        `${URLs.CFCURL}/file/discard?filePath=${props.rowData.filePath}`
                      )
                      .then((res) => {
                        if (res.status === 200) {
                          // setFile(null)
                          props.deletePath()
                        }
                      })
                  }}
                >
                  <Delete color='error' />
                </IconButton>
              )}
            </>
          )}
        </label>
      </div>
    </>
  )
}
