const mariadb = require('mariadb');
const ctlproc = require('./module/ctl_proceso');
const ConnPool = require('./const/connection');
ctlproc.init();
console.log(ConnPool);
const pool = mariadb.createPool(ConnPool.ConnPool);

var sql = "INSERT INTO apuntes (apunteId, fechaContable, fechaValor,concepto, importeOriginal, moneda, saldoAnt, saldoPost, importeD, importeH, procesoAlta, procesoMod) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
var values =[1,'2020-06-06','2020-06-06','Company Inc',1535.33,'EUR',1000.00,2535.33,0.00,1535.33,'MANUAL','MANUAL'];

//console.log(pool.getConnection());

pool.getConnection()
    .then(conn => {
      console.log("connected ! connection id is " + conn.threadId);
      conn.query(sql, values)
        .then(
          res =>{
            console.log("Correcto sin errores");
            console.log(res);
            ctlproc.exit(0);
          }
          )
        .catch(err => {
          ctlproc.logerr(err);
        });
      conn.release(); //release to pool
    })
    .catch(err => {
      ctlproc.logerr(err);
    })
;   

