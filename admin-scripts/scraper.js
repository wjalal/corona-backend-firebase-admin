const puppeteer = require('puppeteer');
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser')
const admin = require('firebase-admin');

const app = admin.initializeApp();

const db = admin.firestore();

const url = 'http://103.247.238.92/webportal/pages/covid19-bedstatus.php'
const hospitals = []
const covidBed = []
const covidBedOccupied = []
const covidICU = []
const covidICUOccupied = []
const covidHDU = []
const covidHDUOccupied = []
const dataTable = []

let count = 0

async function configureBrowser() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox"]
    })
    const page = await browser.newPage()
    await page.goto(url)
    return page
}

async function getData(page) {
    await page.reload()
    let html = await page.evaluate(() => document.body.innerHTML)
    // $("#empty_bed_information",html).each(()=>{
    //     console.log($(this))
    // })
    // console.log(html)
    const $ = cheerio.load(html)
    const table = $('#empty_bed_information')
    cheerioTableparser($);
    let data = $("#empty_bed_information").parsetable(false, false, true);
    // data.forEach(a=>{
    //     con
    // })
    //Hospitals
    // console.log("Hospitals")
    // console.log(data[1])
    data[1].forEach(a => {
        hospitals.push(data[a])
    })

    //5 Covid bed
    // console.log("COVID Bed")
    // console.log(data[5])
    data[5].forEach(a => {
        covidBed.push(data[a])
    })
    //6 Covid Occupied
    // console.log("COVID Occupied Bed")
    // console.log(data[6])
    data[6].forEach(a => {
        covidBedOccupied.push(data[a])
    })
    //10 Cvid ICU
    // console.log("COVID ICU")
    // console.log(data[10])
    data[10].forEach(a => {
        covidICU.push(data[a])
    })
    //11 Cvid ICU Occuped
    // console.log("COVID Occupied ICU")
    // console.log(data[11])
    data[11].forEach(a => {
        covidICUOccupied.push(data[a])
    })
    //15 Coid HDU
    data[15].forEach(a => {
        covidHDU.push(data[a])
    })
    //16 Coid HDU Occupied
    data[5].forEach(a => {
        covidHDUOccupied.push(data[a])
    })

    for (let i = 2; i < 154; i++) {
        let id = i
        let name = data[1][i].trim();
        let bed = data[5][i];
        let bedOcc = data[6][i];
        let icu = data[10][i];
        let icuOcc = data[11][i];
        let hdu = data[15][i];
        let hduOcc = data[16][i];
        let ventilator = data[19][i]
        let oxygencylinder = data[21][i]
        let lastUpdate = data[25][i]
        db.collection('hospitalsMain').doc(name).update({
            id, name: name.replace(',', ' '), bed, bedOcc, icu, icuOcc, hdu, hduOcc, ventilator, oxygencylinder, lastUpdate
        })
            .then(() => {
                count++;
                console.log(count + " updated"); 
            })
            .catch((error) => {
                console.log(error);
            });

        dataTable.push({ id, name, bed, bedOcc, icu, icuOcc, hdu, hduOcc, ventilator, oxygencylinder, lastUpdate })
    }
    dataTable.forEach(a => {
        console.log(a)
    })
    //=============
    //Data from the last row
    db.collection('totalCount').doc('totalCount').update({
        bed: data[5][154],
        bedOcc: data[6][154],
        icu: data[10][154],
        icuOcc: data[11][154],
        hdu: data[15][154],
        hduOcc: data[16][154],
        ventilator: data[19][154],
        oxyCil: data[21][154]
    })
        .then(() => {
            console.log("Total beds available " + data[5][154] + " " + data[6][154]);
            console.log("Data UPDATED!!");
        })
        .catch((error) => {
            console.log(error);
        });


    // console.log($('#empty_bed_information > tbody > tr').each((index, element) => {
    //     let hospital=$($(element).find("td")[0]).text().trim();
    //     hospitals.push(hospital)
    //     }))
    return dataTable

}

async function monitor() {
    let page = await configureBrowser()
    let data = getData(page)
    return data
}
monitor()
hospitals.forEach(e => {
    console.log(e)
})

module.exports = monitor









/*
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBO8Yh2KLflx9L2AyTseFOjeFGL2Wzu0kM",
    authDomain: "covid19-app-bd.firebaseapp.com",
    projectId: "covid19-app-bd",
    storageBucket: "covid19-app-bd.appspot.com",
    messagingSenderId: "865345576877",
    appId: "1:865345576877:web:4036610686f1e167190b24"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

*/