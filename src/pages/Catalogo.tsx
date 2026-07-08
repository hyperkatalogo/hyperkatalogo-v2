import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Shirt, Truck, ChevronLeft, ChevronRight, Search, MousePointerClick, X } from "lucide-react";
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ============================================================================
// DADOS ESTÁTICOS 
// ============================================================================
const CATEGORIAS = [
  { id: 1, titulo: "KIT DE ABRIGO", img: "/kit-de-abrigo.png", link: "https://photos.app.goo.gl/AcVbrSbL4imDJSgD8" },
  { id: 2, titulo: "KIT INFANTIL", img: "/kit-infantil.png", link: "https://photos.app.goo.gl/68EPCNHGSeDPPsv97" },
  { id: 3, titulo: "KIT DE TREINO", img: "/kit-de-treino.png", link: "https://photos.app.goo.gl/qyoKSK9B4Z5aWB5K8" },
  { id: 4, titulo: "VERSÃO JOGADOR", img: "/modelo-jogador.png", link: "https://photos.app.goo.gl/ixfk8k5dbZWdudzKA" },
  { id: 5, titulo: "MODELO FEMININO", img: "/modelo-feminino.jpg", link: "https://photos.app.goo.gl/2fuyRew8Yaqp5ZCn7" },
  { id: 6, titulo: "MANGA LONGA", img: "/manga-longa.png", link: "https://photos.app.goo.gl/jWiGyHsfcfosweQ8A" },
];

const SELECOES_ITEMS = [
  { id: 9, img: "/BRASIL.png", name: "BRASIL", link: "https://photos.app.goo.gl/caB7TJKQgLvpZLwk6" },
  { id: 4, img: "/ARGENTINA.png", name: "ARGENTINA", link: "https://photos.app.goo.gl/eAmjsAuosWDhkDHd8" },
  { id: 27, img: "/FRANÇA.png", name: "FRANÇA", link: "https://photos.app.goo.gl/LxP2avYb8EEvxevWA" },
  { id: 34, img: "/inglaterra.png", name: "INGLATERRA", link: "https://photos.app.goo.gl/5ACbDwoS4tEiZPSa6" },
  { id: 48, img: "/portugal.png", name: "PORTUGAL", link: "https://photos.app.goo.gl/6nkjpM6pMWgsgnQY6" },
  { id: 1, img: "/ALEMANHA.png", name: "ALEMANHA", link: "https://photos.app.goo.gl/iU92iRfttVxHjzV67" },
  { id: 25, img: "/espanha.png", name: "ESPANHA", link: "https://photos.app.goo.gl/vZjX6KtWDF4Lr4yP8" },
  { id: 38, img: "/italia.png", name: "ITÁLIA", link: "https://photos.app.goo.gl/ES5kUGDfk29D2iWm7" },
  { id: 56, img: "/URUGUAI.png", name: "URUGUAI", link: "https://photos.app.goo.gl/M35zXFDmM6drbnb8A" },
  { id: 31, img: "/HOLANDA.png", name: "HOLANDA", link: "https://photos.app.goo.gl/jPe1UkBAArPJdTHK8" },
  { id: 7, img: "/BELGICA.png", name: "BÉLGICA", link: "https://photos.app.goo.gl/jMcYp2L9gxrCYWQM6" },
  { id: 19, img: "/CROACIA.png", name: "CROÁCIA", link: "https://photos.app.goo.gl/cvUMVN31mJ2GQ7d69" },
  { id: 15, img: "/COLOMBIA.png", name: "COLÔMBIA", link: "https://photos.app.goo.gl/uPztD5iwwAWKEBFy6" },
  { id: 14, img: "/CHILE.png", name: "CHILE", link: "https://photos.app.goo.gl/aaJFm83DEdtXK7hs7" },
  { id: 43, img: "/MEXICO.png", name: "MÉXICO", link: "https://photos.app.goo.gl/hddwr1amtDuoAiF76" },
  { id: 26, img: "/USA.png", name: "EUA", link: "https://photos.app.goo.gl/r3j6fkkfFNBzGr7UA" },
  { id: 40, img: "/JAPAO.png", name: "JAPÃO", link: "https://photos.app.goo.gl/2AjcmpuiQP5k9MCw5" },
  { id: 42, img: "/MARROCOS.png", name: "MARROCOS", link: "https://photos.app.goo.gl/9Tv8RAy24FFwxHpG7" },
  { id: 51, img: "/SENEGAL.png", name: "SENEGAL", link: "https://photos.app.goo.gl/NT49ebZwkDxnkk6P6" },
  { id: 29, img: "/GANA.png", name: "GANA", link: "https://photos.app.goo.gl/T6qZr9fygzPXDWwo7" },
  { id: 44, img: "/NIGERIA.png", name: "NIGÉRIA", link: "https://photos.app.goo.gl/Fgw2Ff6XFTXAQH2j6" },
  { id: 11, img: "/CAMAROES.png", name: "CAMARÕES", link: "https://photos.app.goo.gl/vv4juW4J5q8MG6RV7" },
  { id: 17, img: "/COSTA-DO-MARFIM.png", name: "COSTA DO\nMARFIM", link: "https://photos.app.goo.gl/TpRSsg8JMKLToPip8" },
  { id: 54, img: "/SUICA.png", name: "SUÍÇA", link: "https://photos.app.goo.gl/vWMFqYnWmAdvJmRg8" },
  { id: 20, img: "/DINAMARCA.png", name: "DINAMARCA", link: "https://photos.app.goo.gl/DsAgEcggfDEd2mTt6" },
  { id: 53, img: "/SUECIA.png", name: "SUÉCIA", link: "https://photos.app.goo.gl/9HZsDsc1HzM9z1AZ8" },
  { id: 47, img: "/POLONIA.png", name: "POLÔNIA", link: "https://photos.app.goo.gl/KPVSHwS1CCReQjrs5" },
  { id: 52, img: "/SERVIA.png", name: "SÉRVIA", link: "https://photos.app.goo.gl/STchj4C6vG4DEpZy7" },
  { id: 28, img: "/GALES.png", name: "GALES", link: "https://photos.app.goo.gl/ZyXceLyCE4DQztC26" },
  { id: 24, img: "/ESCOCIA.png", name: "ESCÓCIA", link: "https://photos.app.goo.gl/weDGJ4LtMrmC4EFBA" },
  { id: 35, img: "/IRLANDA.png", name: "IRLANDA", link: "https://photos.app.goo.gl/zZbCuRrpUAJQLo4K9" },
  { id: 55, img: "/TURQUIA.png", name: "TURQUIA", link: "https://photos.app.goo.gl/BnJ86rgQqd6EJW4J7" },
  { id: 49, img: "/REPUBLICA-TCHECA.png", name: "REPÚBLICA\nT.", link: "https://photos.app.goo.gl/hTPMwB6FZiS9XTJR8" },
  { id: 50, img: "/ROMENIA.png", name: "ROMÊNIA", link: "https://photos.app.goo.gl/3khrVopsB5hUvzDT8" },
  { id: 6, img: "/AUSTRIA.png", name: "ÁUSTRIA", link: "https://photos.app.goo.gl/wZdXYHEyn1KcNMK3A" },
  { id: 33, img: "/HUNGRIA.png", name: "HUNGRIA", link: "https://photos.app.goo.gl/jkziQ5ke6rhYYFwQ8" },
  { id: 36, img: "/ISLANDIA.png", name: "ISLÂNDIA", link: "https://photos.app.goo.gl/zSdPuFwQPYkn2PNR6" },
  { id: 23, img: "/EQUADOR.png", name: "EQUADOR", link: "https://photos.app.goo.gl/S5Nbtv92dmEXK9ZL8" },
  { id: 46, img: "/PERU.png", name: "PERU", link: "https://photos.app.goo.gl/qyNY5YjWgXMiSyhr8" },
  { id: 45, img: "/PARAGUAI.png", name: "PARAGUAI", link: "https://photos.app.goo.gl/Q8QZYJunLRd3eJma6" },
  { id: 57, img: "/VENEZUELA.png", name: "VENEZUELA", link: "https://photos.app.goo.gl/VFmSGpo4tL22bbP97" },
  { id: 8, img: "/BOLIVIA.png", name: "BOLÍVIA", link: "https://photos.app.goo.gl/b2phKyfQzCEy6DDf8" },
  { id: 12, img: "/CANADA.png", name: "CANADÁ", link: "https://photos.app.goo.gl/uEWm3pgSkzuqtacK9" },
  { id: 18, img: "/COSTA-RICA.png", name: "COSTA RICA", link: "https://photos.app.goo.gl/kwLuDebd3WPet8XA9" },
  { id: 32, img: "/HONDURAS.png", name: "HONDURAS", link: "https://photos.app.goo.gl/aNDPtRiBjY4gXcLP9" },
  { id: 39, img: "/JAMAICA.png", name: "JAMAICA", link: "https://photos.app.goo.gl/vpgwpEhGAoqjWpNN6" },
  { id: 22, img: "/EL-SALVADOR.png", name: "EL SALVADOR", link: "https://photos.app.goo.gl/UUg35ZUe8rLeabbCA" },
  { id: 30, img: "/GUATEMALA.png", name: "GUATEMALA", link: "https://photos.app.goo.gl/o5Q5EcAcn91Hn7L7A" },
  { id: 21, img: "/EGITO.png", name: "EGITO", link: "https://photos.app.goo.gl/GGZKhJG6vesJBdhg9" },
  { id: 3, img: "/ARGELIA.png", name: "ARGÉLIA", link: "https://photos.app.goo.gl/5s2QC8ZezgeiKfgo9" },
  { id: 10, img: "/BURKINA-FASO.png", name: "BURKINA\nFASO", link: "https://photos.app.goo.gl/h9Kkgmt5BC8mUco27" },
  { id: 41, img: "/MALI.png", name: "MALI", link: "https://photos.app.goo.gl/LmuHW5tq3imrQMPn6" },
  { id: 13, img: "/CATAR.png", name: "CATAR", link: "https://photos.app.goo.gl/Cqeo8ecH2wjXtJKCA" },
  { id: 16, img: "/COREIA.png", name: "CORÉIA", link: "https://photos.app.goo.gl/Ea6v5JcUFt8xoaWE9" },
  { id: 2, img: "/ARABIA.png", name: "ARÁBIA S.", link: "https://photos.app.goo.gl/UCfdhPH5APQHeQQu6" },
  { id: 5, img: "/AUSTRALIA.png", name: "AUSTRÁLIA", link: "https://photos.app.goo.gl/8PctJ9u4NJMdkeq37" },
  { id: 37, img: "/ISRAEL.png", name: "ISRAEL", link: "https://photos.app.goo.gl/crmyrK9C4P824HX36" },
];

const BRASILEIRAO_ITEMS = [
  { id: 117, img: "/flamengo.png", name: "FLAMENGO", link: "https://photos.app.goo.gl/o6PYEX5zpCA8eWS26" },
  { id: 111, img: "/corinthians.png", name: "CORINTHIANS", link: "https://photos.app.goo.gl/dfA69Y5DqQnp6tJZ9" },
  { id: 129, img: "/sao-paulo.png", name: "SÃO PAULO", link: "https://photos.app.goo.gl/692z7kknkMrpNbYQA" },
  { id: 124, img: "/palmeiras.png", name: "PALMEIRAS", link: "https://photos.app.goo.gl/gGmmdazKUSUZnzDR8" },
  { id: 131, img: "/vasco.png", name: "VASCO", link: "https://photos.app.goo.gl/owYogG8wrZX8ri177" },
  { id: 114, img: "/cruzeiro.png", name: "CRUZEIRO", link: "https://photos.app.goo.gl/BA6PxTx2QuJt2Qtk8" },
  { id: 120, img: "/gremio.png", name: "GRÊMIO", link: "https://photos.app.goo.gl/zWu9A4r28wBMQjpn8" },
  { id: 122, img: "/internacional.png", name: "INTERNACIONAL", link: "https://photos.app.goo.gl/v7SZAw3J1WkvC6N49" },
  { id: 102, img: "/cam.png", name: "ATL. MINEIRO", link: "https://photos.app.goo.gl/kipCFqL49UyhDANv8" },
  { id: 118, img: "/fluminense.png", name: "FLUMINENSE", link: "https://photos.app.goo.gl/Ys5VSDcXQBctUsb98" },
  { id: 107, img: "/botafogo.png", name: "BOTAFOGO", link: "https://photos.app.goo.gl/vgRvn88DgoTRmMgF9" },
  { id: 128, img: "/santos.png", name: "SANTOS", link: "https://photos.app.goo.gl/3F1ahZ59PZTi5Vvr5" },
  { id: 106, img: "/bahia.png", name: "BAHIA", link: "https://photos.app.goo.gl/WG9RPV9MzZidPqdDA" },
  { id: 130, img: "/sport-TCHECA.png", name: "SPORT RECIFE", link: "https://photos.app.goo.gl/CXsjnBKMxdVa59LE9" },
  { id: 119, img: "/fortaleza.png", name: "FORTALEZA", link: "https://photos.app.goo.gl/iqKsK3mbgCKHsMUG9" },
  { id: 109, img: "/ceara.png", name: "CEARÁ", link: "https://photos.app.goo.gl/1iyr19ruxxuNAV7P6" },
  { id: 132, img: "/vitoria.png", name: "VITÓRIA", link: "https://photos.app.goo.gl/NtygApnJmmpAb6Hc7" },
  { id: 103, img: "/cap.png", name: "ATL. PARANAENSE", link: "https://photos.app.goo.gl/RAdARKofWuFnkrETA" },
  { id: 112, img: "/coritiba.png", name: "CORITIBA", link: "https://photos.app.goo.gl/wmTCuBrVu5etMUpo6" },
  { id: 127, img: "/santa-cruz.png", name: "SANTA CRUZ", link: "https://photos.app.goo.gl/xz6t5TnExoo3Wdh39" },
  { id: 123, img: "/nautico.png", name: "NÁUTICO", link: "https://photos.app.goo.gl/mQduSyXSRNG8Z9LL8" },
  { id: 125, img: "/psc.png", name: "PAYSANDU", link: "https://photos.app.goo.gl/1bx29AmxfXEs97aA7" },
  { id: 126, img: "/remo.png", name: "REMO", link: "https://photos.app.goo.gl/5c4TJTrJpCU5Z8At5" },
  { id: 121, img: "/guarani.png", name: "GUARANI", link: "https://photos.app.goo.gl/ehfz8EWT5vEXHXj87" },
  { id: 108, img: "/bragantino.png", name: "BRAGANTINO", link: "https://photos.app.goo.gl/RgXTr98M8o9Z3YNo6" },
  { id: 110, img: "/chapecoense.png", name: "CHAPECOENSE", link: "https://photos.app.goo.gl/Y7RDBcZtgQavRG9s7" },
  { id: 116, img: "/figueirense.png", name: "FIGUEIRENSE", link: "https://photos.app.goo.gl/wdFz1ahSz9RgXuSy8" },
  { id: 105, img: "/avai.png", name: "AVAI F.C", link: "https://photos.app.goo.gl/ZVrxTb1egXR7LY3A8" },
  { id: 113, img: "/criciuma.png", name: "CRICIÚMA E.C", link: "https://photos.app.goo.gl/8r881BPvzDC3vzD38" },
  { id: 101, img: "/america.png", name: "AMÉRICA", link: "https://photos.app.goo.gl/LqPhRR9KyZ2Yk1q3A" },
  { id: 104, img: "/acg.png", name: "ATLÉTICO\nGOIANIENSE", link: "https://photos.app.goo.gl/26DfRch2uBzKj3EXA" },
  { id: 115, img: "/csa.png", name: "CSA", link: "https://photos.app.goo.gl/aqUbKB3HGfit2fe98" }
];

const LALIGA_ITEMS = [
  { id: 213, img: "/REAL-MADRID.png", name: "REAL MADRID", link: "https://photos.app.goo.gl/PMh4koNb1JnPLzzT9" },
  { id: 205, img: "/BARCELONA.png", name: "BARCELONA", link: "https://photos.app.goo.gl/at6jweUQW7zcPuGN6" },
  { id: 204, img: "/ATL-MADRID.png", name: "ATL. MADRID", link: "https://photos.app.goo.gl/jzYJDuVvjQQ5MAzu9" },
  { id: 215, img: "/SEVILLA.png", name: "SEVILLA", link: "https://photos.app.goo.gl/fHcvHu23Qzgwm1Av5" },
  { id: 216, img: "/VALENCIA.png", name: "VALENCIA C.F", link: "https://photos.app.goo.gl/skbdTZ7Xog5Vw6Px6" },
  { id: 218, img: "/VILLARREAL.png", name: "VILLARREAL", link: "https://photos.app.goo.gl/rExVv963zMz1MiGH6" },
  { id: 203, img: "/BILBAO.png", name: "ATL. BILBAO", link: "https://photos.app.goo.gl/PwukKsk14fz3ux3i8" },
  { id: 214, img: "/REAL SOCIEDADE.png", name: "REAL SOCIEDADE", link: "https://photos.app.goo.gl/WpTHaDjsHDQHbC8d7" },
  { id: 212, img: "/BETIS.png", name: "REAL BETIS", link: "https://photos.app.goo.gl/PQwhJh6JVCVARju89" },
  { id: 207, img: "/celta-de-vigo.png", name: "CELTA DE VIGO", link: "https://photos.app.goo.gl/ykU7V3QFCKBtL63H8" },
  { id: 208, img: "/ESPANYOL.png", name: "ESPANYOL", link: "https://photos.app.goo.gl/nMCwWXLugEmbyir29" },
  { id: 211, img: "/osasuna.png", name: "OSASUNA", link: "https://photos.app.goo.gl/ER9w4BqR8PWgvtgH6" },
  { id: 217, img: "/VALLADOLID.png", name: "VALLADOLID", link: "https://photos.app.goo.gl/qybvGRxwMtYCY6Ht5" },
  { id: 209, img: "/GRANADA.png", name: "GRANADA F.C", link: "https://photos.app.goo.gl/Ja98vkPtMF1yyRqQA" },
  { id: 219, img: "/zaragoza.png", name: "ZARAGOZA", link: "https://photos.app.goo.gl/GQAVPrMoTGt5HL6J9" },
  { id: 210, img: "/la-coruna.png", name: "LA CORUNA", link: "https://photos.app.goo.gl/FgPBtrT4ngPAAaMw9" },
  { id: 201, img: "/alaves.png", name: "ALAVES", link: "https://photos.app.goo.gl/uPG46xcvVtu8f5GA9" },
  { id: 202, img: "/ALMERIA.png", name: "ALMERIA", link: "https://photos.app.goo.gl/7Y2gTxtr9eiK8e2B7" },
  { id: 206, img: "/cadiz.png", name: "CADIZ C.F", link: "https://photos.app.goo.gl/7sJxjyEXXCkr6XYE8" },
];

const PREMIER_ITEMS = [
  { id: 301, img: "/man-united.png", name: "M. UNITED", link: "https://photos.app.goo.gl/J4r8PzookyQuonxz5" },
  { id: 302, img: "/man-city.png", name: "M. CITY", link: "https://photos.app.goo.gl/iVKkEnCDSVBhGwrp6" },
  { id: 303, img: "/arsenal.png", name: "ARSENAL", link: "https://photos.app.goo.gl/pP5xwip49sh577rN6" },
  { id: 304, img: "/chelsea.png", name: "CHELSEA", link: "https://photos.app.goo.gl/ZKyqBd8kReuMU4kx5" },
  { id: 305, img: "/liverpool.png", name: "LIVERPOOL", link: "https://photos.app.goo.gl/tKuz88BqjY8jjVhe8" },
  { id: 306, img: "/spurs.png", name: "TOTTENHAM", link: "https://photos.app.goo.gl/XEuNUuHGEsEn4kGN6" },
  { id: 307, img: "/newcastle.png", name: "NEWCASTLE", link: "https://photos.app.goo.gl/Zr6LAg5rN5wJUh8R9" },
  { id: 308, img: "/aston-villa.png", name: "ASTON VILLA", link: "https://photos.app.goo.gl/m3c3yWEAnMCAP5Jr5" },
  { id: 309, img: "/west-ham.png", name: "WEST HAM", link: "https://photos.app.goo.gl/cmhVwaKJz9b1rTYZ8" },
  { id: 310, img: "/everton.png", name: "EVERTON", link: "https://photos.app.goo.gl/wagoc2YQ79JwoeSk9" },
  { id: 311, img: "/leicester.png", name: "LEICESTER CITY", link: "https://photos.app.goo.gl/82LxKdzfqRRrhghq8" },
  { id: 312, img: "/BRIGHTON.png", name: "BRIGHTON", link: "https://photos.app.goo.gl/8VDop5ngT331y8GE7" },
  { id: 313, img: "/wolfs.png", name: "WOLVES", link: "https://photos.app.goo.gl/9qUFsgrbzPho7z2VA" },
  { id: 314, img: "/crystal-palace.png", name: "CRYSTAL PALACE", link: "https://photos.app.goo.gl/wveqWVwb8ZBR6jas6" },
  { id: 315, img: "/southampton.png", name: "SOUTHAMPTON", link: "https://photos.app.goo.gl/kA4FrRZfUfj5MZjq9" },
  { id: 316, img: "/FOREST.png", name: "N. FOREST", link: "https://photos.app.goo.gl/3Azyo5ju3ZXkpcpf9" },
  { id: 317, img: "/LEEDS.png", name: "LEEDS", link: "https://photos.app.goo.gl/vzuYb4ruA1w9DLYy8" },
  { id: 318, img: "/FULHAM.png", name: "FULHAM", link: "https://photos.app.goo.gl/DUhbBAFcnude7hEs8" },
  { id: 319, img: "/BURNLEY.png", name: "BURNLEY", link: "https://photos.app.goo.gl/7yHhmDeysziykcqt8" },
  { id: 320, img: "/sunderland.png", name: "SUNDERLAND", link: "https://photos.app.goo.gl/3Ycr8AyezY989eYW6" },
  { id: 321, img: "/sheffield.png", name: "SHEFFIELD UNITED", link: "https://photos.app.goo.gl/f11FvapNMcHGhrQz6" },
  { id: 322, img: "/WATFORD.png", name: "WATFORD", link: "https://photos.app.goo.gl/HcA3Jw1aepSLccFT8" },
  { id: 323, img: "/norwich.png", name: "NORWICH", link: "https://photos.app.goo.gl/EPxGZeabKjUmUVvg8" },
  { id: 324, img: "/BROMWICH.png", name: "BROMWICH", link: "https://photos.app.goo.gl/swDfP7b6scL4Vd458" },
  { id: 325, img: "/BLACKBURN.png", name: "BLACKBURN", link: "https://photos.app.goo.gl/5yud3HTkXqfUcPgC8" },
  { id: 326, img: "/SWANSEA.png", name: "SWANSEA C.", link: "https://photos.app.goo.gl/TeW2nmKbWZBxynVK7" },
  { id: 327, img: "/STOKE.png", name: "STOKE CITY", link: "https://photos.app.goo.gl/kpB9UpZEV8GAE8gFA" },
  { id: 328, img: "/QUEENS.png", name: "QUEENS PARK", link: "https://photos.app.goo.gl/XoEkrtM4G5R46HRJ8" },
  { id: 329, img: "/BIRMINGHAM.png", name: "BIRMINGHAM C.", link: "https://photos.app.goo.gl/SyPrUSjWLzNYCfAv5" },
  { id: 330, img: "/HULL.png", name: "HULL CITY", link: "https://photos.app.goo.gl/rFAEXiWmEwQxMTUa7" },
  { id: 331, img: "/CARDIFF.png", name: "CARDIFF CITY", link: "https://photos.app.goo.gl/DnZJ5yrzg7mQUwoa9" },
  { id: 332, img: "/COVENTRY.png", name: "COVENTRY CITY", link: "https://photos.app.goo.gl/KiKn64byKBXCko5AA" },
  { id: 333, img: "/IPSWICH.png", name: "IPSWICH TOWN", link: "https://photos.app.goo.gl/6xt81SXzjT41t2zj6" },
  { id: 334, img: "/LUTON.png", name: "LUTON TOWN", link: "https://photos.app.goo.gl/KAdtjtbpgRQks3eF7" },
  { id: 335, img: "/D-COUNTRY.png", name: "D. COUNTRY", link: "https://photos.app.goo.gl/zPnWZopDFcFUJNB8A" },
  { id: 336, img: "/PLYMOUTH.png", name: "PLYMOUTH", link: "https://photos.app.goo.gl/RS2oGhjBfbHeygJZ6" }
];

const SERIEA_ITEMS = [
  { id: 401, img: "/JUVENTUS.png", name: "JUVENTUS", link: "https://photos.app.goo.gl/x6LvSPLT3TPi3AbN6" },
  { id: 402, img: "/MILAN.png", name: "MILAN", link: "https://photos.app.goo.gl/1umb2gkT8NnX4SFo9" },
  { id: 403, img: "/INTER.png", name: "INTER", link: "https://photos.app.goo.gl/JYGNF8Y8Y859VMWaA" },
  { id: 404, img: "/NAPOLI.png", name: "NAPOLI", link: "https://photos.app.goo.gl/QchoGtFf4UYaHNc57" },
  { id: 405, img: "/ROMA.png", name: "ROMA", link: "https://photos.app.goo.gl/ZbczEwTJDLu1F2H18" },
  { id: 406, img: "/LAZIO.png", name: "LAZIO", link: "https://photos.app.goo.gl/L5eXi3jhFvHn7nQXA" },
  { id: 407, img: "/FIORENTINA.png", name: "FIORENTINA", link: "https://photos.app.goo.gl/4TiA5ehTiuMESMZT7" },
  { id: 408, img: "/ATALANTA.png", name: "ATALANTA", link: "https://photos.app.goo.gl/zgZWtgVmHj5ap4PB9" },
  { id: 409, img: "/TORINO.png", name: "TORINO", link: "https://photos.app.goo.gl/4UtwF2FkgY5RNuVZ7" },
  { id: 410, img: "/SAMPDORIA.png", name: "SAMPDORIA", link: "https://photos.app.goo.gl/z9EmtkHXxrTnN3eX7" },
  { id: 411, img: "/PARMA.png", name: "PARMA", link: "https://photos.app.goo.gl/YEY64kR9D1fXdTGTA" },
  { id: 412, img: "/PALERMO.png", name: "PALERMO", link: "https://photos.app.goo.gl/jf9ASHTToNnkviH77" },
  { id: 413, img: "/UDINESE.png", name: "UDINESE", link: "https://photos.app.goo.gl/N3UGwosi6daDqmeQ9" },
  { id: 414, img: "/GENOA.png", name: "GENOA", link: "https://photos.app.goo.gl/fA6QpwrRcxnQsSD57" },
  { id: 415, img: "/BOLOGNA.png", name: "BOLOGNA", link: "https://photos.app.goo.gl/ucnGRiNzGC8Q22xZ8" },
  { id: 416, img: "/HELLAS.png", name: "HELLAS VERONA", link: "https://photos.app.goo.gl/NtsVQ66WwTJyGYYY9" },
  { id: 417, img: "/SASSUOLO.png", name: "SASSUOLO", link: "https://photos.app.goo.gl/CHWvcm4RpqBJWGiU8" },
  { id: 418, img: "/CAGLIARI.png", name: "CAGLIARI", link: "https://photos.app.goo.gl/41iEZvzo6NsQdorm6" },
  { id: 419, img: "/VENEZIA.png", name: "VENEZIA", link: "https://photos.app.goo.gl/nHRgg3DneoyfRZMWA" },
  { id: 420, img: "/EMPOLI.png", name: "EMPOLI", link: "https://photos.app.goo.gl/g6d4kNyVesEy9Xky9" },
  { id: 421, img: "/LECCE.png", name: "LECCE", link: "https://photos.app.goo.gl/PK1XjUtSZSWhXyiJA" },
  { id: 422, img: "/SALERNITANA.png", name: "SALERNITANA", link: "https://photos.app.goo.gl/2C5hxGQ9VomXAamSA" },
  { id: 423, img: "/MONZA.png", name: "MONZA", link: "https://photos.app.goo.gl/zDoVm3sef65baiPG6" },
  { id: 424, img: "/CREMONESE.png", name: "CREMONESE", link: "https://photos.app.goo.gl/2Y64A1GHEgrMZUGP6" },
  { id: 425, img: "/FROSINONE-TCHECA.png", name: "FROSINONE", link: "https://photos.app.goo.gl/MebXdbdUdwYJz8bM6" },
  { id: 426, img: "/BARI.png", name: "BARI", link: "https://photos.app.goo.gl/DuDVhV8kgyPvUWJA6" },
  { id: 427, img: "/BRESCIA.png", name: "BRESCIA", link: "https://photos.app.goo.gl/xc3v459LumAkFbieA" },
  { id: 428, img: "/PERUGIA.png", name: "PERUGIA", link: "https://photos.app.goo.gl/AyMe8NT53VJgRXCC6" },
];

const LIGUE1_ITEMS = [
  { id: 501, img: "/PSG.png", name: "PSG", link: "https://photos.app.goo.gl/pQV1F5xLvLZhGLdk6" },
  { id: 502, img: "/OLYMPIQUE.png", name: "OLYMPIQUE", link: "https://photos.app.goo.gl/Mp1C498XrFh4wtMr6" },
  { id: 503, img: "/LYON.png", name: "LYON", link: "https://photos.app.goo.gl/LDsKKKXqJZE9La2d8" },
  { id: 504, img: "/MONACO.png", name: "MONACO", link: "https://photos.app.goo.gl/g2UfybLhdbpMUG9e9" },
  { id: 505, img: "/LILLE.png", name: "LILLE", link: "https://photos.app.goo.gl/sBb3PWymrGHdruZt6" },
  { id: 506, img: "/BORDEAUX.png", name: "BORDEAUX", link: "https://photos.app.goo.gl/nnxQZP7EhXw2YMKs5" },
  { id: 507, img: "/RENNAIS.png", name: "RENNAIS", link: "https://photos.app.goo.gl/cEKNNPr4LzoEM8tj7" },
  { id: 508, img: "/NICE.png", name: "NICE", link: "https://photos.app.goo.gl/nEbdiKcBCnLsJ9DX9" },
  { id: 509, img: "/SAINT.png", name: "SAINT ÉTIENNE", link: "https://photos.app.goo.gl/ZEzcWCqbceMiwWYG8" },
  { id: 510, img: "/LENS.png", name: "LENS", link: "https://photos.app.goo.gl/81pHWr4UzjXA5cmbA" },
  { id: 511, img: "/NANTES.png", name: "NANTES", link: "https://photos.app.goo.gl/FPoHp4gW2QTEHH3i7" },
  { id: 512, img: "/TOULOUSE.png", name: "TOULOUSE", link: "https://photos.app.goo.gl/dF5YCgKTq6gdutY96" },
  { id: 513, img: "/STRASBOURG.png", name: "STRASBOURG", link: "https://photos.app.goo.gl/3HAfZESohLviykSH7" },
  { id: 514, img: "/STADE.png", name: "STADE REIMS", link: "https://photos.app.goo.gl/bEJwYvysZDSc2omo9" },
  { id: 515, img: "/LORIENT.png", name: "LORIENT", link: "https://photos.app.goo.gl/RNEEhgp3Zks5QMr36" },
  { id: 516, img: "/METZ.png", name: "METZ", link: "https://photos.app.goo.gl/WThEYZz2K3ziMEV48" },
];

const BUNDESLIGA_ITEMS = [
  { id: 601, img: "/BAYERN.png", name: "BAYERN", link: "https://photos.app.goo.gl/n8na827SNFQwvBQy5" },
  { id: 602, img: "/BORUSSIA.png", name: "BORUSSIA", link: "https://photos.app.goo.gl/AuXdWJfGD4b7n7ZT9" },
  { id: 603, img: "/LEVERKUSEN.png", name: "LEVERKUSEN", link: "https://photos.app.goo.gl/2jgrzFHnty9CusJx9" },
  { id: 604, img: "/LEIPZIG.png", name: "RB LEIPZIG", link: "https://photos.app.goo.gl/iKxduNV5GvBntnfCA" },
  { id: 605, img: "/FRANKFURT.png", name: "FRANKFURT", link: "https://photos.app.goo.gl/q7PD4yaTqqCAag2V6" },
  { id: 606, img: "/STUTTGART.png", name: "STUTTGART", link: "https://photos.app.goo.gl/JTdeqdxrcjWZyZn57" },
  { id: 607, img: "/WOLFSBURG.png", name: "WOLFSBURG", link: "https://photos.app.goo.gl/2JqD87o3iv6MLBxx8" },
  { id: 608, img: "/MONCHEN.png", name: "MONCHEN", link: "https://photos.app.goo.gl/sPKrVnXab6PTHk4W9" },
  { id: 609, img: "/SCHALKE.png", name: "SCHALKE 04", link: "https://photos.app.goo.gl/ZfcpZJdaJAiXnu8r7" },
  { id: 610, img: "/WERDER.png", name: "WERDER BREMEN", link: "https://photos.app.goo.gl/3Q6JE5Qdet9jz5tW6" },
  { id: 611, img: "/HAMBURGER -TCHECA.png", name: "HAMBURGER SV", link: "https://photos.app.goo.gl/Ko53rLqTRVXPJ1Ux6" },
  { id: 612, img: "/HERTHA.png", name: "HERTHA BSC", link: "https://photos.app.goo.gl/L3Jp8fcdSjUyUH43A" },
  { id: 613, img: "/KOLN.png", name: "FC. KOLN", link: "https://photos.app.goo.gl/pjsvtQMf4S9AAz6g7" },
  { id: 614, img: "/HOFFENHEIM.png", name: "HOFFENHEIM", link: "https://photos.app.goo.gl/wpt6Tfw6AnTLvXc89" },
  { id: 615, img: "/FREIBURG.png", name: "FREIBURG", link: "https://photos.app.goo.gl/Aqkkd4zUrFzVFfgu8" },
  { id: 616, img: "/UNION.png", name: "FC. UNION", link: "https://photos.app.goo.gl/4MszJFf2a2XxyBDEA" },
  { id: 617, img: "/AUGSBURG.png", name: "AUGSBURG", link: "https://photos.app.goo.gl/j6Psp8fhu5mj4HC37" },
  { id: 618, img: "/HEIDENHEIM.png", name: "HEIDENHEIM", link: "https://photos.app.goo.gl/1aEwaHFxAz8Hqck59" },
  { id: 619, img: "/FORTUNA.png", name: "FORTUNA", link: "https://photos.app.goo.gl/RCdxh3iAEd9BqcaE7" },
  { id: 620, img: "/PAULI.png", name: "ST. PAULI", link: "https://photos.app.goo.gl/ahHb2k17fpEbpswi8" },
];

// ============================================================================
// COMPONENTES OTIMIZADOS DE PERFORMANCE E UX
// ============================================================================

const SmartImage = memo(({ src, alt, className, eager = false }: any) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className={`absolute inset-0 bg-white/10 animate-pulse z-0 rounded-inherit`} />}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        className={`${className} transition-opacity duration-200 relative z-10 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
});

const FadeInSection = memo(({ children, className = "", delay = 0 }: any) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setVisible(entry.isIntersecting);
      });
    }, { rootMargin: '0px 0px -50px 0px' }); 

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={domRef} 
      className={`${className} transform transition-all duration-[800ms] ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.98]'}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
});

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function Catalogo() {
  const { id } = useParams(); 
  const [catalogo, setCatalogo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [termoPesquisa, setTermoPesquisa] = useState('');
  const isSearching = termoPesquisa.length > 0;

  const menuRef = useRef<HTMLDivElement>(null);
  const precosRef = useRef<HTMLDivElement>(null);
  const selecoesRef = useRef<HTMLDivElement>(null);
  const brasileiraoRef = useRef<HTMLDivElement>(null);
  const laligaRef = useRef<HTMLDivElement>(null);
  const premierRef = useRef<HTMLDivElement>(null);
  const serieARef = useRef<HTMLDivElement>(null);
  const ligue1Ref = useRef<HTMLDivElement>(null);
  const bundesligaRef = useRef<HTMLDivElement>(null);

  const [showMenuLeft, setShowMenuLeft] = useState(false);
  const [showMenuRight, setShowMenuRight] = useState(true);

  const [showPrecosLeft, setShowPrecosLeft] = useState(false);
  const [showPrecosRight, setShowPrecosRight] = useState(true);
  
  const [showSelLeft, setShowSelLeft] = useState(false);
  const [showSelRight, setShowSelRight] = useState(true);

  const [showBrasLeft, setShowBrasLeft] = useState(false);
  const [showBrasRight, setShowBrasRight] = useState(true);

  const [showLaligaLeft, setShowLaligaLeft] = useState(false);
  const [showLaligaRight, setShowLaligaRight] = useState(true);

  const [showPremierLeft, setShowPremierLeft] = useState(false);
  const [showPremierRight, setShowPremierRight] = useState(true);

  const [showSerieALeft, setShowSerieALeft] = useState(false);
  const [showSerieARight, setShowSerieARight] = useState(true);

  const [showLigue1Left, setShowLigue1Left] = useState(false);
  const [showLigue1Right, setShowLigue1Right] = useState(true);

  const [showBundesLeft, setShowBundesLeft] = useState(false);
  const [showBundesRight, setShowBundesRight] = useState(true);

  // Busca Inteligente
  const todosTimes = useMemo(() => [...SELECOES_ITEMS, ...BRASILEIRAO_ITEMS, ...LALIGA_ITEMS, ...PREMIER_ITEMS, ...SERIEA_ITEMS, ...LIGUE1_ITEMS, ...BUNDESLIGA_ITEMS], []);
  const timesFiltrados = useMemo(() => {
    if (!termoPesquisa) return [];
    const pesquisaNormalizada = termoPesquisa.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return todosTimes.filter(item => {
      const nomeNormalizado = item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return nomeNormalizado.includes(pesquisaNormalizada);
    });
  }, [termoPesquisa, todosTimes]);

  // Preços Dinâmicos do Banco de Dados
  const precosFormatados = useMemo(() => {
    if (!catalogo?.precos) return [];
    const m = catalogo.moeda || 'R$';
    const p = catalogo.precos;
    
    // Mapeamento que junta o nome da categoria com o preço preenchido
    const lista = [
      { id: 'cortaVento', titulo: "CORTA-VENTO", valor: p.cortaVento },
      { id: 'abrigo', titulo: "KIT DE ABRIGO", valor: p.abrigo },
      { id: 'treino', titulo: "KIT DE TREINO", valor: p.treino },
      { id: 'infantil', titulo: "KIT INFANTIL", valor: p.infantil },
      { id: 'jogador', titulo: "VERSÃO JOGADOR", valor: p.jogador },
      { id: 'mangaLonga', titulo: "MANGA LONGA", valor: p.mangaLonga },
      { id: 'feminino', titulo: "FEMININO", valor: p.feminino },
      { id: 'retro', titulo: "RETRÔ", valor: p.retro },
      { id: 'personalizacao', titulo: "PERSONALIZAÇÃO", valor: p.personalizacao },
    ];
    
    // Filtra apenas os que têm valor preenchido e formata o preço
    return lista.filter(item => item.valor && item.valor.trim() !== '').map(item => ({
      ...item,
      precoFinal: `${m} ${item.valor}`
    }));
  }, [catalogo]);

  useEffect(() => {
    async function fetchCatalogo() {
      try {
        let { data, error } = await supabase.from('catalogos').select('*').eq('slug', id).single();
        if (error || !data) {
          const { data: fallbackData } = await supabase.from('catalogos').select('*').eq('id', id).single();
          data = fallbackData;
        }
        if (data) setCatalogo(data);
      } catch (err) {
        console.error("Erro ao carregar loja:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCatalogo();
  }, [id]);

  useEffect(() => {
    if (catalogo) {
      document.title = catalogo.store_name || 'HyperKatalogo';
      let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = catalogo.logo_url || '/logo.jpg';
    }
  }, [catalogo]);

  const scroll = useCallback((ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) ref.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  }, []);

  const updateArrows = useCallback((ref: React.RefObject<HTMLDivElement | null>, setLeft: Function, setRight: Function) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setLeft(scrollLeft > 15);
      setRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 15);
    }
  }, []);

  useEffect(() => {
    if (!isSearching) {
      updateArrows(menuRef, setShowMenuLeft, setShowMenuRight);
      updateArrows(precosRef, setShowPrecosLeft, setShowPrecosRight);
      updateArrows(selecoesRef, setShowSelLeft, setShowSelRight);
      updateArrows(brasileiraoRef, setShowBrasLeft, setShowBrasRight);
      updateArrows(laligaRef, setShowLaligaLeft, setShowLaligaRight);
      updateArrows(premierRef, setShowPremierLeft, setShowPremierRight);
      updateArrows(serieARef, setShowSerieALeft, setShowSerieARight);
      updateArrows(ligue1Ref, setShowLigue1Left, setShowLigue1Right);
      updateArrows(bundesligaRef, setShowBundesLeft, setShowBundesRight);
    }
    const handleResize = () => {
      if (!isSearching) {
        updateArrows(menuRef, setShowMenuLeft, setShowMenuRight);
        updateArrows(precosRef, setShowPrecosLeft, setShowPrecosRight);
        updateArrows(selecoesRef, setShowSelLeft, setShowSelRight);
        updateArrows(brasileiraoRef, setShowBrasLeft, setShowBrasRight);
        updateArrows(laligaRef, setShowLaligaLeft, setShowLaligaRight);
        updateArrows(premierRef, setShowPremierLeft, setShowPremierRight);
        updateArrows(serieARef, setShowSerieALeft, setShowSerieARight);
        updateArrows(ligue1Ref, setShowLigue1Left, setShowLigue1Right);
        updateArrows(bundesligaRef, setShowBundesLeft, setShowBundesRight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSearching, precosFormatados, updateArrows]); 

  if (loading) return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center pt-12 px-4 pb-28">
      <div className="w-24 h-8 bg-white/5 animate-pulse rounded-full mb-8" />
      <div className="w-28 h-28 bg-white/5 animate-pulse rounded-full mb-6" />
      <div className="w-48 h-8 bg-white/5 animate-pulse rounded-md mb-10" />
      <div className="w-full max-w-sm flex gap-6 justify-center mb-12">
        <div className="w-14 h-14 bg-white/5 animate-pulse rounded-full" />
        <div className="w-14 h-14 bg-white/5 animate-pulse rounded-full" />
        <div className="w-14 h-14 bg-white/5 animate-pulse rounded-full" />
      </div>
      <div className="w-full max-w-sm h-[60px] bg-white/5 animate-pulse rounded-full mb-4" />
      <div className="w-full max-w-sm h-[60px] bg-white/5 animate-pulse rounded-full mb-12" />
      <div className="w-full max-w-sm flex gap-4 overflow-hidden">
        <div className="w-32 h-48 bg-white/5 animate-pulse rounded-3xl shrink-0" />
        <div className="w-32 h-48 bg-white/5 animate-pulse rounded-3xl shrink-0" />
        <div className="w-32 h-48 bg-white/5 animate-pulse rounded-3xl shrink-0" />
      </div>
    </div>
  );

  const whatsAppNumber = catalogo?.whatsapp?.replace(/\D/g, '') || '556793053894';
  const whatsAppLink = `https://wa.me/${whatsAppNumber}`;
  const temaCor = catalogo?.theme_color || '#007AFF';

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');`}</style>
      
      <div className="min-h-screen w-full bg-[#050505] text-white relative overflow-x-hidden antialiased" style={{ fontFamily: "'Montserrat', sans-serif", '--theme': temaCor } as React.CSSProperties}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 blur-[140px] w-full max-w-2xl h-[400px] rounded-full pointer-events-none opacity-15" style={{ backgroundColor: temaCor }} />

        <div className="w-full max-w-sm mx-auto flex flex-col items-center pt-10 px-4 pb-28">
          
          <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8 shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-2.5 h-2.5 bg-[#25D366] rounded-full animate-pulse shadow-[0_0_12px_2px_#25D366]"></div>
            <span className="text-xs font-black text-white tracking-[0.2em]">ONLINE</span>
          </div>
          
          <h2 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-5 uppercase animate-in fade-in duration-700">Catálogo Oficial</h2>

          <div className="w-28 h-28 rounded-full border-[3px] bg-black p-1 flex items-center justify-center relative overflow-hidden transition-all duration-500 hover:scale-105 animate-in zoom-in-90 duration-700" style={{ borderColor: temaCor, boxShadow: `0 0 45px ${temaCor}40` }}>
            {catalogo?.logo_url ? <SmartImage src={catalogo.logo_url} eager={true} className="w-full h-full object-cover rounded-full" /> : <SmartImage src="/logo.jpg" eager={true} className="w-full h-full object-contain rounded-full" />}
          </div>
          
          <h1 className="text-[28px] font-black tracking-tight text-white uppercase mt-6 mb-5 text-center transition-all duration-500 hover:tracking-wide animate-in fade-in duration-700">{catalogo?.store_name || "HYPERKATÁLOGO"}</h1>

          <div className="flex items-center gap-2 mb-10 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg animate-in fade-in duration-700">
            <MousePointerClick size={16} className="text-[#007AFF] animate-bounce" style={{ color: temaCor }} />
            <span className="text-[10px] font-black text-gray-200 tracking-[0.1em] uppercase">Clique para interagir com a página</span>
          </div>

          <h3 className="text-[11px] font-black tracking-widest text-white uppercase mb-5 animate-in fade-in duration-700">FALE CONOSCO:</h3>
          
          <div className="flex items-start justify-center gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {catalogo?.instagram && (
              <div className="flex flex-col items-center gap-2.5 group">
                <a href={catalogo.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-white/20 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 text-white shadow-[0_4px_15px_rgba(220,39,67,0.4)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase group-hover:text-white transition-colors duration-300">Instagram</span>
              </div>
            )}
            
            <div className="flex flex-col items-center gap-2.5 group">
              <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-white/20 bg-[#25D366] flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 text-white shadow-[0_4px_15px_rgba(37,211,102,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
              <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase group-hover:text-white transition-colors duration-300">WhatsApp</span>
            </div>

            {catalogo?.tiktok && (
              <div className="flex flex-col items-center gap-2.5 group">
                <a href={catalogo.tiktok} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-white/20 bg-black flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 text-white shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(1.5px 1.5px 0 #fe0050) drop-shadow(-1.5px -1.5px 0 #00f2fe)' }}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </a>
                <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase group-hover:text-white transition-colors duration-300">TikTok</span>
              </div>
            )}
          </div>

          <div className="w-48 h-[2px] mb-12 opacity-80 animate-in fade-in duration-700" style={{ backgroundImage: `linear-gradient(to right, transparent, ${temaCor}, transparent)` }}></div>

          <div className="w-full flex flex-col gap-4 px-2 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <a href="https://drive.google.com/drive/folders/1huxHu6yQruZTX-2E0vQTMHyW68tFnrsF?usp=share_link" target="_blank" rel="noopener noreferrer" className="w-full h-[60px] px-4 text-white font-bold text-[11px] sm:text-xs tracking-wider uppercase rounded-full flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-1 text-center leading-tight shadow-lg" style={{ backgroundColor: temaCor, boxShadow: `0 4px 20px ${temaCor}40` }}>
              <Shirt className="w-5 h-5 flex-shrink-0" /> CLIQUE AQUI E VEJA A TABELA DE MEDIDAS
            </a>
            <a href="https://melhorrastreio.com.br/" target="_blank" rel="noopener noreferrer" className="w-full h-[60px] px-4 bg-[#0d1117] border-[3px] text-white font-bold text-[11px] sm:text-xs tracking-wider uppercase rounded-full flex items-center justify-center gap-3 transition-all hover:bg-white/5 hover:-translate-y-1 text-center leading-tight shadow-lg" style={{ borderColor: `${temaCor}60` }}>
              <Truck className="w-5 h-5 flex-shrink-0" style={{ color: temaCor }} /> RASTREIE O SEU PEDIDO CLICANDO AQUI
            </a>
          </div>

          <FadeInSection className="w-full mb-4 px-2">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">MENU RÁPIDO:</h3>
              <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
            </div>
            
            <div className="relative flex items-center w-full">
              {showMenuLeft && (
                <button onClick={() => scroll(menuRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div ref={menuRef} onScroll={() => updateArrows(menuRef, setShowMenuLeft, setShowMenuRight)} className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {CATEGORIAS.map((cat) => (
                  <a key={cat.id} href={cat.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 flex-shrink-0 snap-center group">
                    <div className="w-32 h-48 rounded-2xl border-[3px] overflow-hidden bg-[#0d1117] transition-transform duration-300 group-hover:scale-105 shadow-lg relative" style={{ borderColor: `${temaCor}40` }}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <SmartImage src={cat.img} alt={cat.titulo} className="w-full h-full object-cover relative z-0" />
                    </div>
                    <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors tracking-wider mt-1 whitespace-pre-line">
                      {cat.titulo}
                    </span>
                  </a>
                ))}
              </div>

              {showMenuRight && (
                <button onClick={() => scroll(menuRef, 'right')} className="absolute -right-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95">
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </FadeInSection>

          {/* BANNERS GIGANTES SEPARADOS PARA EFEITO DE SCROLL INDIVIDUAL */}
          <div className="w-full mb-8 px-2 flex flex-col gap-6">
              <FadeInSection>
                <div className="flex items-center gap-3 mb-0">
                  <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">CATEGORIAS EM DESTAQUE:</h3>
                  <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                </div>
              </FadeInSection>

              <FadeInSection>
                <a href="https://photos.app.goo.gl/JwKbbiyrnrAv4V9LA" target="_blank" rel="noopener noreferrer" className="w-full rounded-3xl overflow-hidden border-[3px] transition-transform hover:scale-[1.02] active:scale-[0.98] block" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/corta-vento.jpg" eager={true} className="w-full h-auto block" />
                </a>
              </FadeInSection>
              
              <FadeInSection>
                <a href="https://photos.app.goo.gl/xHESUJ4F7zd6LjEZ8" target="_blank" rel="noopener noreferrer" className="w-full rounded-3xl overflow-hidden border-[3px] transition-transform hover:scale-[1.02] active:scale-[0.98] block" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/retro.jpg" className="w-full h-auto block" />
                </a>
              </FadeInSection>

              {/* ======================================================= */}
              {/* NOVO CARROSSEL DE PREÇOS (Cards Animados e Dinâmicos)     */}
              {/* ======================================================= */}
              {precosFormatados.length > 0 && (
                <FadeInSection className="w-full mt-2 mb-2">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">TABELA DE PREÇOS:</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                  </div>
                  
                  <div className="relative flex items-center w-full">
                    {showPrecosLeft && (
                      <button onClick={() => scroll(precosRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}

                    <div ref={precosRef} onScroll={() => updateArrows(precosRef, setShowPrecosLeft, setShowPrecosRight)} className="flex overflow-x-auto gap-4 pb-4 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
                      {precosFormatados.map((preco) => (
                        <div key={preco.id} className="w-30 h-18 rounded-2xl border-[3px] bg-[#0d1117] flex flex-col items-center justify-center p-3 relative overflow-hidden transition-transform duration-300 hover:scale-105 shadow-lg flex-shrink-0 snap-center" style={{ borderColor: `${temaCor}40` }}>
                          <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 text-center z-10">{preco.titulo}</span>
                          <span className="text-[17px] font-black text-white z-10 tracking-tight" style={{ color: temaCor }}>{preco.precoFinal}</span>
                        </div>
                      ))}
                    </div>

                    {showPrecosRight && (
                      <button onClick={() => scroll(precosRef, 'right')} className="absolute -right-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </FadeInSection>
              )}

              <FadeInSection>
                <div className="w-full rounded-3xl overflow-hidden border-[3px] transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/entrega_02.jpg" alt="Entrega Rápida" className="w-full h-auto block" />
                </div>
              </FadeInSection>
          </div>

          <FadeInSection className="w-full mb-6 px-2 relative z-20">
            <div className="relative flex items-center w-full h-14 rounded-2xl bg-[#0d1117] border-[3px] transition-all duration-300 overflow-hidden shadow-lg group focus-within:shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                 style={{ borderColor: isSearching ? temaCor : 'rgba(255,255,255,0.1)' }}>
              <div className="pl-4 pr-3 text-gray-400 group-focus-within:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Buscar time ou seleção..."
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                className="flex-grow h-full bg-transparent text-white text-[13px] font-semibold outline-none placeholder:text-gray-500"
              />
              {isSearching && (
                <button onClick={() => setTermoPesquisa('')} className="pr-4 text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>
          </FadeInSection>

          {isSearching ? (
            <div className="w-full px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sm font-black tracking-widest text-white uppercase mb-6 pl-1">Busca Rápida</h3>
              
              <div className="grid grid-cols-3 gap-y-8 gap-x-3">
                {timesFiltrados.length > 0 ? (
                  timesFiltrados.map((item) => {
                    const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver o time ${item.name.replace('\n', ' ')}`;
                    return (
                      <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group">
                        <div className="w-[72px] h-[72px] rounded-full border-[3px] bg-[#151515] flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-md" style={{ borderColor: temaCor }}>
                          <SmartImage src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-[10px] drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <span className="text-[10px] font-bold text-center text-gray-300 group-hover:text-white transition-colors whitespace-pre-line leading-tight">{item.name}</span>
                      </a>
                    );
                  })
                ) : (
                  <div className="col-span-3 text-center py-10 text-gray-500 text-sm font-semibold bg-[#0d1117] rounded-2xl border border-white/5">
                    Nenhum time ou seleção encontrado.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <FadeInSection className="w-full px-2 mb-10">
                <div className="w-full rounded-3xl overflow-hidden border-[3px] shadow-lg bg-[#0d1117] flex items-center justify-center relative" style={{ borderColor: `${temaCor}60` }}>
                  <SmartImage src="/fifa.jpg" alt="FIFA Banner" className="w-full h-auto block scale-110 origin-center" />
                </div>
              </FadeInSection>

              {/* SELEÇÕES */}
              <FadeInSection className="w-full px-2">
                  <div className="flex items-center gap-2 mb-5">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">SELEÇÕES:</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                  </div>
                  <div className="relative flex items-center w-full">
                    {showSelLeft && (
                      <button onClick={() => scroll(selecoesRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
                    )}
                    <div className="flex overflow-x-auto gap-4 pb-4 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory min-h-[120px]" ref={selecoesRef} onScroll={() => updateArrows(selecoesRef, setShowSelLeft, setShowSelRight)}>
                      {SELECOES_ITEMS.map((item) => {
                        const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver a seleção de ${item.name.replace('\n', ' ')}`;
                        return (
                          <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 min-w-[80px] snap-center group">
                            <div className="w-20 h-20 rounded-full border-[3px] bg-[#151515] flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-md" style={{ borderColor: temaCor }}>
                              <SmartImage src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-2" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors whitespace-pre-line">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                    {showSelRight && (
                      <button onClick={() => scroll(selecoesRef, 'right')} className="absolute -right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
                    )}
                  </div>
              </FadeInSection>

              {/* BRASILEIRÃO */}
              <FadeInSection className="w-full px-2 mb-12 mt-4">
                <div className="w-full rounded-[2rem] overflow-hidden border-[3px] shadow-2xl bg-[#0d1117] flex items-center justify-center relative transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/brasileirao.png" alt="Brasileirão Banner" className="w-full h-auto block scale-110 origin-center transition-transform duration-700 hover:scale-125" />
                </div>
              </FadeInSection>

              <FadeInSection className="w-full px-2">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">BRASILEIRÃO:</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                  </div>
                  <div className="relative flex items-center w-full">
                    {showBrasLeft && (
                      <button onClick={() => scroll(brasileiraoRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
                    )}
                    <div className="flex overflow-x-auto gap-5 pb-5 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory min-h-[120px]" ref={brasileiraoRef} onScroll={() => updateArrows(brasileiraoRef, setShowBrasLeft, setShowBrasRight)}>
                      {BRASILEIRAO_ITEMS.map((item) => {
                        const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver o time ${item.name.replace('\n', ' ')}`;
                        return (
                          <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 min-w-[85px] snap-center group">
                            <div className="w-20 h-20 rounded-full border-[3px] bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 shadow-lg" style={{ borderColor: temaCor }}>
                              <SmartImage src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-[10px] drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-pre-line">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                    {showBrasRight && (
                      <button onClick={() => scroll(brasileiraoRef, 'right')} className="absolute -right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
                    )}
                  </div>
              </FadeInSection>

              {/* LA LIGA */}
              <FadeInSection className="w-full px-2 mb-12 mt-4">
                <div className="w-full rounded-[2rem] overflow-hidden border-[3px] shadow-2xl bg-[#0d1117] flex items-center justify-center relative transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/laliga.png" alt="La Liga Banner" className="w-full h-auto block scale-110 origin-center transition-transform duration-700 hover:scale-125" />
                </div>
              </FadeInSection>

              <FadeInSection className="w-full px-2">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">LA LIGA:</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                  </div>
                  <div className="relative flex items-center w-full">
                    {showLaligaLeft && (
                      <button onClick={() => scroll(laligaRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
                    )}
                    <div className="flex overflow-x-auto gap-5 pb-5 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory min-h-[120px]" ref={laligaRef} onScroll={() => updateArrows(laligaRef, setShowLaligaLeft, setShowLaligaRight)}>
                      {LALIGA_ITEMS.map((item) => {
                        const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver o time ${item.name.replace('\n', ' ')}`;
                        return (
                          <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 min-w-[85px] snap-center group">
                            <div className="w-20 h-20 rounded-full border-[3px] bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 shadow-lg" style={{ borderColor: temaCor }}>
                              <SmartImage src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-[10px] drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-pre-line">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                    {showLaligaRight && (
                      <button onClick={() => scroll(laligaRef, 'right')} className="absolute -right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
                    )}
                  </div>
              </FadeInSection>

              {/* PREMIER LEAGUE */}
              <FadeInSection className="w-full px-2 mb-12 mt-4">
                <div className="w-full rounded-[2rem] overflow-hidden border-[3px] shadow-2xl bg-[#0d1117] flex items-center justify-center relative transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/premier-league.png" alt="Premier League Banner" className="w-full h-auto block scale-110 origin-center transition-transform duration-700 hover:scale-125" />
                </div>
              </FadeInSection>

              <FadeInSection className="w-full px-2 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">PREMIER LEAGUE:</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                  </div>
                  <div className="relative flex items-center w-full">
                    {showPremierLeft && (
                      <button onClick={() => scroll(premierRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
                    )}
                    <div className="flex overflow-x-auto gap-5 pb-5 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory min-h-[120px]" ref={premierRef} onScroll={() => updateArrows(premierRef, setShowPremierLeft, setShowPremierRight)}>
                      {PREMIER_ITEMS.map((item) => {
                        const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver o time ${item.name.replace('\n', ' ')}`;
                        return (
                          <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 min-w-[85px] snap-center group">
                            <div className="w-20 h-20 rounded-full border-[3px] bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 shadow-lg" style={{ borderColor: temaCor }}>
                              <SmartImage src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-[10px] drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-pre-line">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                    {showPremierRight && (
                      <button onClick={() => scroll(premierRef, 'right')} className="absolute -right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
                    )}
                  </div>
              </FadeInSection>

              {/* SERIE A */}
              <FadeInSection className="w-full px-2 mb-12 mt-4">
                <div className="w-full rounded-[2rem] overflow-hidden border-[3px] shadow-2xl bg-[#0d1117] flex items-center justify-center relative transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/serie-a.png" alt="Serie A Banner" className="w-full h-auto block scale-110 origin-center transition-transform duration-700 hover:scale-125" />
                </div>
              </FadeInSection>

              <FadeInSection className="w-full px-2 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">SERIE A:</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                  </div>
                  <div className="relative flex items-center w-full">
                    {showSerieALeft && (
                      <button onClick={() => scroll(serieARef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
                    )}
                    <div className="flex overflow-x-auto gap-5 pb-5 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory min-h-[120px]" ref={serieARef} onScroll={() => updateArrows(serieARef, setShowSerieALeft, setShowSerieARight)}>
                      {SERIEA_ITEMS.map((item) => {
                        const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver o time ${item.name.replace('\n', ' ')}`;
                        return (
                          <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 min-w-[85px] snap-center group">
                            <div className="w-20 h-20 rounded-full border-[3px] bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 shadow-lg" style={{ borderColor: temaCor }}>
                              <SmartImage src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-[10px] drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-pre-line">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                    {showSerieARight && (
                      <button onClick={() => scroll(serieARef, 'right')} className="absolute -right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
                    )}
                  </div>
              </FadeInSection>

              {/* LIGUE 1 */}
              <FadeInSection className="w-full px-2 mb-12 mt-4">
                <div className="w-full rounded-[2rem] overflow-hidden border-[3px] shadow-2xl bg-[#0d1117] flex items-center justify-center relative transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/ligue-1.png" alt="Ligue 1 Banner" className="w-full h-auto block scale-110 origin-center transition-transform duration-700 hover:scale-125" />
                </div>
              </FadeInSection>

              <FadeInSection className="w-full px-2 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">LIGUE 1:</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                  </div>
                  <div className="relative flex items-center w-full">
                    {showLigue1Left && (
                      <button onClick={() => scroll(ligue1Ref, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
                    )}
                    <div className="flex overflow-x-auto gap-5 pb-5 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory min-h-[120px]" ref={ligue1Ref} onScroll={() => updateArrows(ligue1Ref, setShowLigue1Left, setShowLigue1Right)}>
                      {LIGUE1_ITEMS.map((item) => {
                        const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver o time ${item.name.replace('\n', ' ')}`;
                        return (
                          <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 min-w-[85px] snap-center group">
                            <div className="w-20 h-20 rounded-full border-[3px] bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 shadow-lg" style={{ borderColor: temaCor }}>
                              <SmartImage src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-[10px] drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-pre-line">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                    {showLigue1Right && (
                      <button onClick={() => scroll(ligue1Ref, 'right')} className="absolute -right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
                    )}
                  </div>
              </FadeInSection>

              {/* BUNDESLIGA */}
              <FadeInSection className="w-full px-2 mb-12 mt-4">
                <div className="w-full rounded-[2rem] overflow-hidden border-[3px] shadow-2xl bg-[#0d1117] flex items-center justify-center relative transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1" style={{ borderColor: `${temaCor}40` }}>
                  <SmartImage src="/bundesliga.png" alt="Bundesliga Banner" className="w-full h-auto block scale-110 origin-center transition-transform duration-700 hover:scale-125" />
                </div>
              </FadeInSection>

              <FadeInSection className="w-full px-2 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase leading-[1.3]">BUNDESLIGA:</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, ${temaCor}80, transparent)` }}></div>
                  </div>
                  <div className="relative flex items-center w-full">
                    {showBundesLeft && (
                      <button onClick={() => scroll(bundesligaRef, 'left')} className="absolute -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
                    )}
                    <div className="flex overflow-x-auto gap-5 pb-5 w-full [&::-webkit-scrollbar]:hidden snap-x snap-mandatory min-h-[120px]" ref={bundesligaRef} onScroll={() => updateArrows(bundesligaRef, setShowBundesLeft, setShowBundesRight)}>
                      {BUNDESLIGA_ITEMS.map((item) => {
                        const urlDestino = item.link || `https://wa.me/${whatsAppNumber}?text=Olá! Gostaria de ver o time ${item.name.replace('\n', ' ')}`;
                        return (
                          <a key={item.id} href={urlDestino} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 min-w-[85px] snap-center group">
                            <div className="w-20 h-20 rounded-full border-[3px] bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95 shadow-lg" style={{ borderColor: temaCor }}>
                              <SmartImage src={item.img} alt={item.name.replace('\n', ' ')} className="w-full h-full object-contain p-[10px] drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-center text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-pre-line">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                    {showBundesRight && (
                      <button onClick={() => scroll(bundesligaRef, 'right')} className="absolute -right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
                    )}
                  </div>
              </FadeInSection>

            </>
          )}

          {/* ======================================================= */}
          {/* BANNER DE SUPORTE (FIM DA PÁGINA SEM BORDA)             */}
          {/* ======================================================= */}
          <FadeInSection className="w-full px-2 -mt-10 mb-4">
            <a 
              href={whatsAppLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full rounded-[2rem] overflow-hidden shadow-2xl relative transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] block" 
            >
              <SmartImage src="/SUPORTE.png" alt="Fale Conosco - Suporte" className="w-full h-auto block" />
            </a>
          </FadeInSection>

        </div>

        <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.4)] transition-all hover:scale-110 active:scale-95 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </a>
      </div>
    </>
  );
}