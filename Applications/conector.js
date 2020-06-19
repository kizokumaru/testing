const ctlproc = require('./module/ctl_proceso');
const mariadb = require('mariadb');
const ConnPool = require('./const/connection');
const pool = mariadb.createPool(ConnPool.ConnPool);
async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM apuntes");
    console.log(rows); //[ {val: 1}, meta: ... ]
    //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
    //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
    throw err;
  } finally {
    ctlproc.exit();
    if (conn) {
      return conn.end();
    }
  }
}

//
ctlproc.init();
asyncFunction();