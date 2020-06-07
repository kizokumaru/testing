const mariadb = require('mariadb');
console.log("Creando conexión");
const pool = mariadb.createPool({ host: 'localhost', user: 'pi', password: 'beatriz2411', database:'familia_eco',connectionLimit: 5 });

var sql = "INSERT INTO apuntes (apunteId, fechaContable, fechaValor,concepto, importeOriginal, moneda, saldoAnt, saldoPost, importeD, importeH, procesoAlta, procesoMod) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
var values =[1,'2020-06-06','2020-06-06','Company Inc',1535.33,'EUR',1000.00,2535.33,0.00,1535.33,'MANUAL','MANUAL'];

console.log(pool.getConnection());

pool.getConnection()
    .then(conn => {
      console.log("connected ! connection id is " + conn.threadId);
      conn.query(sql, values).then(res =>{console.log(res);});
      conn.release(); //release to pool
    })
    .catch(err => {
      console.log("not connected due to error: " + err);
      process.exit(4);
    });
