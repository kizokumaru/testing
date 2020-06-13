const mariadb = require('mariadb');
console.log("Creando conexión");

const pool = mariadb.createPool({ 
    host: 'localhost', 
    user: 'pi', 
    password: 'beatriz2411', 
    database:'familia_eco',
    connectionLimit: 5 
});

var sql = "SELECT * FROM apuntes";

let fetchData = async () => {
    let conecction
    try{
        console.log('getConnection');
        conecction = await pool.getConnection();
        console.log('query')
        const filas = await conecction.query(sql);
        console.log(filas.lenght);
        filas.forEach((fila) => {
            console.log(fila);
        })
    }catch(err){
        console.log(err);
        return err;
    }
}

fetchData()


