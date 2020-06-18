//Obtener datos de la tabla concepto_codigos y guardarlos en un array.
// Abrir cursor tablas apuntes (repetir proceso para tarjetas e historico) aquellos que no tengan categoria o subcategoria definida
// Para cada registro, se debe realizar obtenerClave, con la clave filtrar array para obtener categoria y subcategoria
// Actualizar registro con categoria y subcategoria. 


function obtenerClave(str) {
    const regex = new RegExp("-|^[A-Z]/|\/|\\|\\[|\\]|\\.|,|%|&|Ç|`|\\*|'|è|é|:|\\+|ó|\\d|SEGUROS|LUZ ENDESA ENERG FACTURA","gi");
    const regextract = new RegExp("[A-Z]{3,}");
    var res = regextract.exec(str.trim().replace(regex, ''));
    console.log(res);
    return res;
}

