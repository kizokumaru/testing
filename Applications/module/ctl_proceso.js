exports.init = function (){
        proc = process.argv[1].split('/').reverse()[0];
        console.log('Se inicia el proceso.')
        console.log('  Procesos  : ', proc);
        console.log('  Argumentos: ', process.argv[2]==undefined?"Sin argumentos":process.argv[2]);
        console.log('  Plataforma: ', process.platform);
}

exports.exit = function (code){
        proc = process.argv[1].split('/').reverse()[0];
        console.log('Se finaliza el proceso')
        console.log('  Procesos  : ', proc);
        console.log('  Argumentos: ', process.argv[2]==undefined?"Sin argumentos":process.argv[2]);
        console.log('  Plataforma: ', process.platform);
        console.log('  Error: ', code==undefined?0:code);
        process.exit(code==undefined?0:code);
}

exports.logerr = function(err,code) {
        console.log('Fallo en el proceso: ',proc = process.argv[1].split('/').reverse()[0]);
        console.log('CODE:' ,err.code);
        console.log('FATAL:' ,err.fatal);
        console.log('ERRNO:' ,err.errno);
        console.log('SQLSTATE:' ,err.sqlState);
        console.log('STACK:' ,err.stack);
        //console.log(`Sentencia retorna: ${err}`);
        console.log('Salida del modulo');
        this.exit(code);
}

