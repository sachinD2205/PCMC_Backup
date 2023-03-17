import CheckIcon from '@mui/icons-material/Check'
import { Button, Paper } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import styles from '../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'

import ClearIcon from '@mui/icons-material/Clear'
const Index = () => {
  const router = useRouter()

  return (
    <>
      <Paper
        sx={{
          marginLeft: 2,
          marginRight: 2,

          marginBottom: 2,
          padding: 1,
          border: 1,
          borderColor: 'grey.500',
        }}
      >
        <div className={styles.small}>
          <div
            style={{
              backgroundColor: '#3EADCF',
            }}
          >
            <h1
              style={{
                marginLeft: '350px',
                marginTop: '25px',
                color: 'yellow',
              }}
            >
              <b>पिंपरी चिंचवड महानगरपलिका,पिंपरी-४११०१८</b>
            </h1>
            <h3
              style={{
                marginLeft: '500px',
                color: 'yellow',
              }}
            >
              <b>महाराष्ट्र विवाह कायदा , १९९८</b>
            </h3>
          </div>

          <h3
            style={{
              marginLeft: '500px',
              marginTop: '25px',
              color: 'red',
            }}
          >
            <b>विवाह नोंदणी करण्याची प्रकिया</b>
          </h3>
          {/* term */}

          <div
            style={{
              marginLeft: '70px',
              marginTop: '25px',
              marginRight: '25px',
            }}
          >
            <h4>
              १) पिंपरी चिंचवड महानगरपलिका हद्दीतील क्षेत्रिय कार्यालया अंतर्गत
              प्रभागातील वर किंवा वधु या पैकी एकजण रहिवासी असावा व विवाह
              महाराष्ट्र राज्यमध्ये झालेला असणे आवश्यक आहे.
            </h4>

            {/* <h4>
              2) विवाह नोंदणी फोर्म नजीकच्या नागरी सुविधाकेंद्रावरून घेणे
              फोर्मवर, वर + वधु + साक्षीदारांचे पासपोर्ट साईजचे फोटो
              चिकटवावे.फोर्मच्या पान क्रमांक ४ वर रुपये 100/- किंमतीचे कोर्ट फी
              स्टैम्प लेबल <br />
              चिकटवावे.
            </h4> */}

            <h4
              style={{
                marginTop: '10px',
                marginRight: '25px',
              }}
            >
              2)फार्म सोबत वर + वधु यांच्या जन्म तारखेचा पुरवा म्हणुन शाळा
              सोडल्याचा दाखला / दहावी/बारवीचे प्रमाणपत्र / वाहनपरवाना /
              पासपोर्ट/ पॅनकार्ड / इत्यांदीपैकी एक नोटराईज्ड प्रमाणित केलेले
              झेरॉक्स प्रत जोडावी.
            </h4>

            <h4
              style={{
                marginTop: '10px',
                marginRight: '25px',
              }}
            >
              3) वर + वधु पत्याचे पुरावे म्हणून रेशनकार्ड/पासपोर्ट / निवडणुक
              ओळखपत्र / शासकीय कार्यालयांचे ओळखपत्र / संबंधितांच्या नावाचा
              उल्लेख असणारे वीजबील / बी.एस.एन.एल. टेलीफोन बील / आधार कार्ड /
              नोंदणीकृत भाडे करार / वाहनपरवाना यापैकी एक झेराक्स प्रत जोडावी.
              वरील सर्व झेरॉक्स प्रती अटेस्टेड / नोटराईज्ड सत्यप्रती असणे आवश्यक
              आहे.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              4) वर+ वधु यांचे ओळखीचे पुरवा म्हणून /आधारकार्ड / पॅनकार्ड /
              वाहनपरवाना / निवडणुक ओळखपत्र यापैकी एक पुरावा आवश्यक आहे.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              5) वर + वधु यांचे वरील प्रमाणे १) ओळखीचा पुरावा 2) पत्याचा पुरावा
              3) जन्मतारखेचा पुरावा असे तीन वेगवेगळे पुरावे देणे आवश्यक आहे.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              6)विवाह नोंदणी करीता 3 साक्षीदार असणे आवश्यक आहे. साक्षीदाराचे
              ओळखीचा पुरावा म्हणुन पासपोर्ट/आधारकार्ड/पॅनकार्ड / वाहनपरवाना /
              निवडणुक ओळखपत्र / यापैकी एक पुरावा असणे आवश्यक आहे.
            </h4>

            {/* <h4
              style={{
                marginTop: '10px',
              }}
            >
              7)फार्ममध्ये कॉलम क्र. ७ मध्ये पुरोहित - भटजी यांचे माहिती व
              स्वाक्षरी दिनांकात असावी.
            </h4> */}

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              7)मुस्लीम व्यक्तीच्या विवाह कायद्यान्वये विवाह झाला असल्यास  काझी यांचे माहिती व दिनांकासह स्वाक्षरी असावी. व
              निकाहनाम्याची अटेस्टेड प्रत जोडावी. निकाहनामा जर उर्दू भाषेत असेल,
              तर त्यांचे इंग्रजी किंवा मराठी भाषांतर करुन त्यातर संबंधीत काझी
              यांची स्वाक्षरी घेऊन प्रत सोबत जोडावी.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              8)पुर्ण भरलेला फार्म हा वधु / वर साक्षीदार यापैकी एक व्यक्तीने
              सकाळी १० ते १.३० या वेळेत दाखल केल्यास फॉर्म तपासुन टोकन क्रमांक व
              दिनांक वेळ सांगितली जाईल. त्यावेळी वर/वधु +3 साक्षीदार यांनी समक्ष
              हजर व्हावे त्याचदिवशी नोंदणी पुर्ण करून प्रमाणपत्र दिले जाईल.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              9) मूळ लग्नपत्रिका
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              10) वर, वधु घटस्पोटीत असल्यास कोर्टाच्या हुकुमनाम्याची नोटराईज्ड
              सत्यप्रत जोडणे आवश्यक आहे.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              11) लग्नविधी नसल्यास शासनाने दिलेल्या विहित नमुन्यातील
              प्रतिज्ञापत्र रु.१००/- चे स्टॅम्प पेपरवर सादर करणे आवश्यक आहे.
              तसेच लग्नविधी प्रसंगीचा एक फोटो आवश्यक आहे.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              12) वर-वधु प्रत्येकी १ फोटो (पासपोर्ट साईज )
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              13) साक्षीदार प्रत्येक १ फोटो (पासपोर्ट साईज )
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              14) सर्व मूळ कागदपत्रे विवाह नोंदणी करतेवेळी आणणे.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              15) वधु वर पैकी विधवा / विधुर असल्यास मयत पती किंवा पत्नीचा दाखला.
              अर्जसोवत नोटराईज्ड सत्यप्रत जोडणे आवश्यक आहे.
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              16) सदरचा फॉर्म नागरिक सुविधा केंद्रामार्फची रु. २० ची पावती जोडुन
              या कार्यालयाकडे सादर करावा,
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              17) विवाह नोंदणी अर्ज एजंट / दलाल यांचे मार्फत स्विकारले जाणार
              नाहीत.
            </h4>
          </div>

          <div
            className={styles.AcceptBtn}
            style={{
              marginRight: '20px',
            }}
          >
            <Button
              variant="contained"
              color="success"
              endIcon={<CheckIcon />}
              onClick={() => {
                router.push({
                  pathname: `/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration`,
                  query: {
                    pageMode: 'Add',
                  },
                })
              }}
            // disabled={state}
            >
              <FormattedLabel id="Tnc" />
            </Button>
            <div style={{ marginLeft: '5vh' }}>
              <Button
                variant="contained"
                color="error"
                endIcon={<ClearIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/dashboard`,
                    query: {
                      pageMode: 'Add',
                    },
                  })
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.row}></div>
      </Paper>
    </>
  )
}

export default Index
