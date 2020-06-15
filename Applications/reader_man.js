const mariadb = require('mariadb');
const ctlproc = require('./module/ctl_proceso');
const ConnPool = require('./const/connection');
const csv = require('csv-parser');
const fs = require('fs');
const zeroPad = (num, places) => String(num).padStart(places, '0')
const pool = mariadb.createPool(ConnPool.ConnPool);

ctlproc.init();
var sql = "INSERT INTO apuntes (apunteId, fechaContable, fechaValor,concepto, importeOriginal, moneda, saldoAnt, saldoPost, importeD, importeH, procesoAlta, timestampAlta, procesoMod,timestampMod) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

data_array = [];
fs.createReadStream('./files/Gastos_e_Ingresos_manuales.csv')
  .pipe(csv({separator: ';'}))
  .on('headers', (headers) => {console.log(`First header: ${headers[4]}`)})
  .on('data', (data) => {
    try {
    //console.log(data["'CONCEPTO'"])
    if(data["'CONCEPTO'"]=="'BBVA'"){
        console.log('elegido: ',data);
        let arr = []
        let d = new Date().toISOString();
        let imp = 0.00;
        let a ="";
        arr.push(data["'FECHA'"].split("/").reverse().join("").concat(zeroPad(parseInt(data_array.length) + 1,10)));//apunteId, 
        arr.push(data["'FECHA'"].split("/").reverse().join("-")); //fechaContable, 
        arr.push(data["'FECHA'"].split("/").reverse().join("-")); //fechaValor, 
        arr.push(data["'COMERCIO/CAJERO'"]); //concepto,
        arr.push(parseFloat(data["'IMPORTE'"].replace(",",".")));//importeOriginal, 
        arr.push('EUR');//moneda, 
        arr.push(0.00);//saldoAnt, 
        arr.push(0.00);//saldoPost, 
        arr.push(parseFloat(data["'IMPORTE'"].replace(",","."))<0?Math.abs(parseFloat(data["'IMPORTE'"].replace(",","."))):0.00); //importeD, 
        arr.push(parseFloat(data["'IMPORTE'"].replace(",","."))>0?Math.abs(parseFloat(data["'IMPORTE'"].replace(",","."))):0.00); //importeH, 
        arr.push('MANUAL'); //procesoAlta,
        arr.push(d.substr(0,10) + ' ' + d.substr(11,12)+'000'); 
        arr.push('Migracion'); //procesoAlta,
        arr.push(d.substr(0,10) + ' ' + d.substr(11,12)+'000'); 
        data_array.push(arr);
    }
      
  } catch (error) {
    console.log(data);
    ctlproc.logerr(error);
  }}
  )
  .on('end', () => {
    console.log(`Leidas ${data_array.length}`)
    pool.getConnection()
        .then(conn => {
          console.log("connected ! connection id is " + conn.threadId);
          for (let index = 0; index < data_array.length; index++) {
            data_array[index];
            conn.query(sql, data_array[index])
                .then(res =>{
                  console.log("Correcto sin errores" + index);
                  console.log(res);
                  conn.end();
                })
                .catch(err => {
                  console.log('me quede en: ' + index);
                  if(err.code!="ER_DUP_ENTRY"){
                    console.log(data_array[index]);
                    ctlproc.logerr(err);
                  }else{
                    console.log('Duplicado registro' + index);
                  }
                });
            conn.release(); //release to pool
          }
        })
        .catch(err => {
          ctlproc.logerr(err);
        })
  });   
