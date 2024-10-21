/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Button from '@mui/material/Button';
import axios  from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import "moment/locale/ar" 



const theme = createTheme({
  typography: {
    fontFamily: "Cairo, sans-serif",
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body1: "div",
        },
      },
    },
  },
});

function App() {
  const { t, i18n } = useTranslation();
  moment.locale("ar");
  const [temp, setTemp] = useState({
    temp: null,
    min: null,
    max: null,
    description: "",
    icon: "",
  });
  const [date, setDate] = useState("");
  let cancelToken = null;
  const [lang, setLang] = useState("ar");
  const direction = lang === "ar" ? "rtl" : "ltr";

  function handleLang(){
    if(lang === "ar"){
      i18n.changeLanguage("en");
      setLang("en");
      moment.locale("en");
    }else{
      i18n.changeLanguage("ar");
      setLang("ar");
      moment.locale("ar");
    }
    setDate(moment().format("MMM Do YY"));
  }


  useEffect(()=>{
    i18n.changeLanguage("ar");
    setDate(moment().format("MMM Do YY"));
    axios.get("https://api.openweathermap.org/data/2.5/weather?lat=30.06263&lon=31.24967&appid=878d4f017ea0de7a0ff1ae02a5fe56de",
      {
        cancelToken: new axios.CancelToken((c) => {
          cancelToken = c;
        })
      }
    ).
    then((res)=>{
      setTemp({
        temp: Math.round(res.data.main.temp -272.15),
        min: Math.round(res.data.main.temp_min -272.15),
        max: Math.round(res.data.main.temp_max -272.15),
        description: res.data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`
      })

    })
    .catch((err)=>{
      console.log(err)
    })
    return ()=>{
      cancelToken();
    }
  },[])
  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* Card Content */}
          <div
            style={{
              background: "rgb(28 52 91 / 36%)",
              color: "white",
              direction: direction,
              padding: "20px",
              borderRadius: "1rem",
            }}
          >
            {/* Date & City */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                marginBottom: "1rem",
                gap: "1rem",
              }}
            >
              <Typography
                variant="h2"
                style={{
                  fontWeight: "bold",
                }}
              >
                {t("Cairo")}
              </Typography>
              <Typography variant="h5">{date}</Typography>
            </div>
            {/* Date & City */}
            <hr />
            {/* Weather */}
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
              {/* Details */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}>
                
                <Typography variant="h1">{t(temp.temp)}</Typography>


                <Typography variant="h5" style={{
                  textTransform: "capitalize",
                }}>{t(temp.description)}</Typography>
  
                {/* Min & Max */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <h5>{t("MIN")}: {temp.min}</h5>
                  <h5 style={{margin:"0px 5px"}}>|</h5>
                  <h5>{t("MAX")}: {temp.max}</h5>
                </div>
                {/* Min & Max */}
              </div>
              {/* Details */}
              {/* icon */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <img style={{
                  width: "200px",
                  height: "200px",
                  
                }} src={temp.icon} alt="" />
              </div>
              {/* icon */}
            </div>
            {/* Weather */}
          </div>
          {/* Card Content */}
          {/* Language Translation */}
          <div
          dir={direction}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
          }}>
          <Button onClick={handleLang} variant="text" style={{color: "white"}}>{lang == "en" ? "Arabic" : "انجليزي"}</Button>
          </div>
          {/* Language Translation */}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
