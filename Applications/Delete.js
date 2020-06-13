const mariadb = require('mariadb');
console.log("Creando conexión");
const pool = mariadb.createPool({ host: 'localhost', user: 'pi', password: 'beatriz2411', database:'familia_eco',connectionLimit: 5 });

var sql = "DELETE FROM apuntes Where apunteId = 1";

//console.log(pool.getConnection());

pool.getConnection()
    .then(conn => {
      console.log("connected ! connection id is " + conn.threadId);
      conn.query(sql)
        .then(res =>{console.log(res);})
        .catch(err => {
          console.log(`not connected due to error: ${err}`);
          process.exit(4);
        });
      conn.release(); //release to pool
    })
    .catch(err => {
      console.log(`not connected due to error: ${err}`);
      process.exit(4);
    });
