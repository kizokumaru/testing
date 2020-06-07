const mariadb = require('mariadb');
console.log("Creando conexión");
const pool = mariadb.createPool({ host: 'localhost', user: 'pi', password: 'beatriz2411', database:'familia_eco',connectionLimit: 5 });

pool.getConnection()
    .then(conn => {
      console.log("connected ! connection id is " + conn.threadId);
      conn
         .query({rowsAsArray:true,sql:'SELECT * FROM apuntes'})
         .then(res =>{console.log(res);});
      conn.release(); //release to pool
    })
    .catch(err => {
      console.log("not connected due to error: " + err);
    });

