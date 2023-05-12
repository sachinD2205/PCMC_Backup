import React, { useRef, useEffect, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import styles from './goshwara.module.css'
import {
    Button, Paper, FormControl, TextField
} from '@mui/material'

import { Controller, useForm, useFormContext } from 'react-hook-form'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import router from 'next/router'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import urls from '../../../../URLS/urls'
const Goshwara2Main = () => {
    const router = useRouter()
    const {
        control,
        register,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useForm()
    const [data, setData] = useState()

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const backToHomeButton = () => {
        history.push({ pathname: '/homepage' })
    }

    useEffect(() => {
        if (watch('fromDate') && watch('toDate')) {
            console.log("Inside", watch('fromDate'), watch('toDate'))

            const finalBody = {
                fromDate: watch('fromDate'),
                toDate: watch('toDate')
            }

            console.log('Search Body', finalBody)
            axios
                .post(
                    `${urls.MR
                    }/reports/ghoshwara1`,
                    finalBody
                )
                .then((res) => {
                    console.log('inside1', res.data)
                    setData(res.data)

                })
                .catch((err) => {
                    console.log(err.response)
                })

        }
    }, [watch('fromDate'), watch('toDate')])

    return (
        <>


            <Paper
                sx={{
                    padding: "5vh",
                    border: 1,
                    borderColor: 'grey.500',
                }}>
                <div>
                    <center>
                        <h1>Goshwara Part-2</h1>
                    </center>
                </div>
                <div className={styles.searchFilter}>
                    <FormControl sx={{ marginTop: 0 }}>
                        <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                            <span style={{ fontSize: 14 }}>
                                                From Date                                            </span>
                                        }
                                        value={field.value}

                                        onChange={(date) =>
                                            field.onChange(moment(date).format('YYYY-MM-DD'))
                                        }
                                        selected={field.value}
                                        center
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                fullWidth
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 12,
                                                        marginTop: 3,
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </FormControl>
                    <FormControl sx={{ marginTop: 0, marginLeft: "10vh" }}>
                        <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                            <span style={{ fontSize: 14 }}>
                                                To Date                                            </span>
                                        }
                                        value={field.value}

                                        onChange={(date) =>
                                            field.onChange(moment(date).format('YYYY-MM-DD'))
                                        }
                                        selected={field.value}
                                        center
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                fullWidth
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 12,
                                                        marginTop: 3,
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </FormControl>
                </div>
                <div style={{ padding: 10 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ float: "right" }}
                        onClick={handlePrint}
                    >
                        print
                    </Button>
                    <Button
                        onClick={backToHomeButton}
                        variant="contained"
                        color="primary"
                    >
                        back To home
                    </Button>
                </div>
                <br />
                <div>
                    <ComponentToPrint ref={componentRef} data={data} />
                </div>

            </Paper>
        </>
    )
}

class ComponentToPrint extends React.Component {
    render() {
        return (
            <>
                <div>
                    <div>
                        <Paper>
                            <table className={styles.report}>
                                <thead className={styles.head}>
                                    <tr >
                                        <th colSpan={8}>Goshwara Part-2</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th >Sr.No</th>
                                        <th >Zone</th>
                                        <th >Ward</th>
                                        <th >Marriage Registration No</th>
                                        <th >Marriage Date</th>
                                        <th >Witness 1 Name</th>
                                        <th >Witness 2 Name</th>
                                        <th >Witness 3 Name</th>
                                    </tr>

                                    {this.props.data && (this.props.data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.zoneName}</td>
                                            <td>{item.wardName}</td>
                                            <td>{item.registrationNumber}</td>
                                            <td>{item.marriageDate}</td>
                                            <td>{item.witnesses[0] ? (item.witnesses[0].witnessFName + " " + item.witnesses[0].witnessLName) : ""}</td>
                                            <td>{item.witnesses[1] ? (item.witnesses[1].witnessFName + " " + item.witnesses[1].witnessLName) : ""}</td>
                                            <td>{item.witnesses[2] ? (item.witnesses[2].witnessFName + " " + item.witnesses[2].witnessLName) : ""}</td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </Paper>
                    </div>
                </div>
            </>
        )
    }
}

export default Goshwara2Main
