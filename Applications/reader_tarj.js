const mariadb = require('mariadb');
const ctlproc = require('./module/ctl_proceso');
const ConnPool = require('./const/connection');
const csv = require('csv-parser');
const fs = require('fs');
const zeroPad = (num, places) => String(num).padStart(places, '0')
const pool = mariadb.createPool(ConnPool.ConnPool);

ctlproc.init();
var sql = "INSERT INTO tarjetas (apunteId, fechaContable, fechaValor,concepto, importeOriginal, moneda, importeD, importeH, tarjeta, procesoAlta, timestampAlta, procesoMod,timestampMod) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

data_array = [];
fs.createReadStream('./files/Gastos_e_Ingresos_tarjetas.csv')
  .pipe(csv({separator: ';'}))
  .on('headers', (headers) => {console.log(`First header: ${headers[4]}`)})
  .on('data', (data) => {
    try {
    let arr = []
    let d = new Date().toISOString();
    let imp = data["'IMPORTE'"].replace(" ","").replace("€","").replace(".","").replace(",",".");
    let concepto = data["'COMERCIO/CAJERO'"];
    concepto = concepto.substr(0,2)=="B_"?concepto.substr(2,concepto.length - 2):concepto;
    let tarjeta = concepto.substr(0,2)=="B_"?"B":"N";
    //console.log('IMPORTE orig: ' ,data["'Importe'"]);
   //console.log('IMPORTE: ' ,imp);
    //console.log(data["'F. contable'"].split("/").reverse().join("").concat(zeroPad(Math.abs(parseInt(data["'Seq'"])),10)));
    if(data["'FECHA'"]=="29-08-2018"){console.log(data["'FECHA'"].replace("-","/").replace("-","/"))}
    arr.push(data["'FECHA'"].replace("-","/").replace("-","/").split("/").reverse().join("").concat(zeroPad(Math.abs(parseInt(data["'SEQ'"])),10)));//apunteId, 
    arr.push(data["'FECHA'"].replace("-","/").replace("-","/").split("/").reverse().join("-")); //fechaContable, 
    arr.push(data["'FECHA'"].replace("-","/").replace("-","/").split("/").reverse().join("-")); //fechaValor, 
    arr.push(concepto); //concepto,
    arr.push(parseFloat(imp));//importeOriginal, 
    arr.push('EUR');//moneda, 
    
    arr.push(parseFloat(imp<0?Math.abs(imp):0.00)); //importeD, 
    arr.push(parseFloat(imp>0?Math.abs(imp):0.00)); //importeH, 
    arr.push(tarjeta);
    arr.push('Migracion'); //procesoAlta,
    arr.push(d.substr(0,10) + ' ' + d.substr(11,12)+'000'); 
    arr.push('Migracion'); //procesoAlta,
    arr.push(d.substr(0,10) + ' ' + d.substr(11,12)+'000'); 
    data_array.push(arr);
      
  } catch (error) {
    console.log(data);
    ctlproc.logerr(error);
  }}
  )
  .on('end', () => {
    console.log(`Leidas ${data_array.length}`)
    pool.getConnection()
        .then(conn => {
          //console.log(conn);
          console.log("connected ! connection id is " + conn.threadId);
          for (let index = 0; index < data_array.length; index++) {
            data_array[index];
            conn.query(sql, data_array[index])
                .then(res =>{
                  console.log("Correcto sin errores" + index);
                  console.log(res);
                  conn.commit();
                  conn.end();
                })
                .catch(err => {
                  //console.log('me quede en: ' + index);
                  if(err.code!="ER_DUP_ENTRY"){
                    console.log(data_array[index]);
                    ctlproc.logerr(err);
                  }else{
                    //console.log('Duplicado registro' + index);
                  }
                });
            conn.release(); //release to pool
          }
        })
        .catch(err => {
          ctlproc.logerr(err);
        })
  });   
