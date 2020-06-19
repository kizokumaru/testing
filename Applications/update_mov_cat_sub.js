//Obtener datos de la tabla concepto_codigos y guardarlos en un array.
const ctlproc = require('./module/ctl_proceso');
const mariadb = require('mariadb');
const ConnPool = require('./const/connection');
const pool = mariadb.createPool(ConnPool.ConnPool);
async function asyncFunction() {
  var conn;
  try {
    var conn = await pool.getConnection();
    const concepto_codigo = await conn.query({sql:"SELECT clave, categoria, subcategoria FROM concepto_codigos",rowsAsArray:false});
    //console.log('Numero de conceptos: ', concepto_codigo.length);
    const apuntes = await conn.query({sql:"SELECT apunteId, concepto FROM apuntes WHERE categoria is null",rowsAsArray:false});
    //console.log(apuntes);
    console.log('Apuntes sin categoria: ', apuntes.length);
    let array = [];
    apuntes.forEach(element => { 
        //console.log(element.concepto);
        let row = [];
        let datos = concepto_codigo.filter(filterByClave,obtenerClave(element.concepto));
        //console.log(datos[0] + element.apunteId)
        if (datos[0]!==undefined) {
            row.push(datos[0].categoria);
            row.push(datos[0].subcategoria);
            row.push(element.apunteId);
            //console.log('Datos: ' , datos);
            //console.log('ROW: ' , sql,row);
            array.push(row);
        }else{
            console.log('No encontrado: ' , element.concepto);
        }
    });
    console.log('Updateamos.',array[0]);
    let sql = 'UPDATE apuntes SET categoria = ?, subcategoria = ? WHERE apunteId = ?';
    //let sql = 'select * from apuntes WHERE apunteId = ?';
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        var query = await conn.query(sql, element);
        console.log(query);        
    }

        //console.log('Rows affected:', results.affectedRows);
        //conn.commit();
    
    //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
    //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
        console.log(err);
        throw err;
  } finally {
    ctlproc.exit();
    if (conn) {
      return conn.end();
    }
  }
}
// Abrir cursor tablas apuntes (repetir proceso para tarjetas e historico) aquellos que no tengan categoria o subcategoria definida
// Para cada registro, se debe realizar obtenerClave, con la clave filtrar array para obtener categoria y subcategoria
// Actualizar registro con categoria y subcategoria. 
function filterByClave(clave){
    //console.log('clave: ', clave);
    //console.log('this: ', this);
    if (clave.clave == this){
        return true;
    }else{
    return false} ;
}
function obtenerClave(str) {
    //console.log('obtenerClave',str)
    str = str.toUpperCase();
    const regex = new RegExp("-|^[A-Z]/|\/|\\|\\[|\\]|\\.|,|%|&|Ç|`|\\*|'|è|é|:|\\+|ó|\\d|SEGUROS|LUZ ENDESA ENERG FACTURA","gi");
    const regextract = new RegExp("[a-zA-Z]{3,}");
    let res = regextract.exec(str.replace(regex, '').trim());
    //console.log(res);
    //console.log('Clave: ', res[0]);
    return res[0];
}

ctlproc.init();
asyncFunction();
