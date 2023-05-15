import React, { useRef, useEffect, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import styles from './goshwara.module.css'
import {
    Button, Paper, FormControl, TextField, InputLabel, FormHelperText, Select, MenuItem, ThemeProvider
} from '@mui/material'

import { Controller, useForm, useFormContext } from 'react-hook-form'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import router from 'next/router'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import urls from '../../../../URLS/urls'
import theme from '../../../../theme'

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
    const [libraryKeys, setLibraryKeys] = useState([])


    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const backToHomeButton = () => {
        history.push({ pathname: '/homepage' })
    }

    useEffect(() => {
        getLibraryKeys()
    }, [])



    const getLibraryKeys = () => {
        axios
            .get(
                `${urls.LMSURL}/libraryMaster/getAll`,
            )
            .then((r) => {
                setLibraryKeys(
                    r.data.libraryMasterList.map((row) => ({
                        id: row.id,
                        // zoneName: row.zoneName,
                        // zoneNameMr: row.zoneNameMr,
                        libraryName: row.libraryName,
                    })),
                )
            })
    }


    useEffect(() => {
        if ([watch('libraryKey')]) {
            axios
                .get(`${urls.LMSURL}/bookMaster/getAll`)
                .then((res) => {
                    console.log("bookmaster", res.data)
                    setData(
                        res.data.bookMasterList.map((r, i) => ({
                            id: r.id,
                            srNo: i + 1,
                            author: r.author,
                            barcode: r.barcode,
                            bookClassification: r.bookClassification,

                            bookName: r.bookName,
                            // bookName1: bookTypeData?.find((obj) => obj?.id === r.bookName)
                            //   ?.bookName,
                            bookType: r.bookType,
                            bookSubType: r.bookSubType,

                            language: r.language,
                            // languageName: bookTypeData?.find((obj) => obj?.id === r.language)
                            //   ?.language,
                            bookEdition: r.bookEdition,
                            bookPrice: r.bookPrice,
                            publication: r.publication,
                            // publicationName: bookTypeData?.find(
                            //   (obj) => obj?.id === r.publication
                            // )?.publication,
                            // shelfCatlogSection: r.shelfCatlogSection,
                            // shelfCatlogSectionName: bookTypeData?.find(
                            //   (obj) => obj?.id === r.shelfCatlogSection
                            // )?.shelfCatlogSection,
                            // shelfNo: r.shelfNo,
                            // shelfNoName: bookTypeData?.find((obj) => obj?.id === r.shelfNo)
                            //   ?.shelfNo,

                            totalBooksCopy: r.totalBooksCopy,
                        }))
                    );
                });

        }
    }, [watch('libraryKey')])

    return (
        <>
            <ThemeProvider theme={theme}>
                <Paper
                    sx={{
                        padding: "5vh",
                        border: 1,
                        borderColor: 'grey.500',
                    }}>
                    <div>
                        <center>
                            <h1>Books</h1>
                        </center>
                    </div>
                    <div className={styles.searchFilter}>
                        <FormControl
                            variant="standard"
                            sx={{ marginTop: 2 }}
                            error={!!errors.libraryKey}
                        >
                            <InputLabel id="demo-simple-select-standard-label">
                                {/* <FormattedLabel id="zone" required /> */}
                                Library Selection
                            </InputLabel>
                            <Controller
                                render={({ field }) => (
                                    <Select
                                        //sx={{ width: 230 }}
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value)
                                            console.log(
                                                'Zone Key: ',
                                                value.target.value,
                                            )
                                            // setTemp(value.target.value)
                                        }}
                                        label="Library Selection  "
                                    >
                                        {libraryKeys &&
                                            libraryKeys.map((libraryKey, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={libraryKey.id}
                                                >
                                                    {/*  {zoneKey.zoneKey} */}

                                                    {/* {language == 'en'
                                                                                    ? libraryKey?.libraryName
                                                                                    : libraryKey?.libraryNameMr} */}
                                                    {libraryKey?.libraryName}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                )}
                                name="libraryKey"
                                control={control}
                                defaultValue=""
                            />
                            <FormHelperText>
                                {errors?.libraryKey
                                    ? errors.libraryKey.message
                                    : null}
                            </FormHelperText>
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
            </ThemeProvider>
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
                                        <th colSpan={9}>पुस्तकांचा अहवाल</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th >क्र.</th>
                                        <th >पुस्तकाचा प्रकार</th>
                                        <th >एकूण पुस्तके</th>
                                        <th >उपलब्ध पुस्तके</th>
                                        <th >दिलेली पुस्तके</th>
                                        <th >गहाळ पुस्तके</th>
                                        <th >वर्ग पुस्तके</th>
                                        <th >जीर्ण पुस्तके</th>
                                        <th >पुस्तक नुकसान भरपाई</th>

                                    </tr>

                                    {this.props.data && (this.props.data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.bookClassification}</td>
                                            <td>{item.totalBooksCopy}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
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
