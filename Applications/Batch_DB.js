const mariadb = require('mariadb');
console.log("Creando conexión");
const pool = mariadb.createPool({ host: 'localhost', user: 'pi', password: 'beatriz2411', database:'familia_eco', connectionLimit: 5 });

var sql = "INSERT INTO apuntes (apunteId, fechaContable, fechaValor,concepto, importeOriginal, moneda, saldoAnt, saldoPost, importeD, importeH, procesoAlta, procesoMod) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
var values = [
             [1,'2020-06-06','2020-06-06','Company Inc',1535.33,'EUR',1000.00,2535.33,0.00,1535.33,'MANUAL','MANUAL'],
             [2,'2020-06-06','2020-06-06','Asteriod',1535.33,'EUR',1000.00,2535.33,0.00,1535.33,'MANUAL','MANUAL']
             ];
connection.serverVersion();
connection.connect();
connection.beginTransaction();
try {
    connection.batch(sql,values);
    //must handle error if any
    connection.commit();
  } catch (err) {
    connection.rollback();
    //handle error
  }
;

process.exit();

