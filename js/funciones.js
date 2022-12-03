

const tiendbd=(nombrebd, tabla)=>{
    //creando la base de datos

    const bd=new Dexie(nombrebd);
    bd.version(1).stores(tabla);
    bd.open();
    return bd;
 
}


//funcón insertar

const guardar=(tabla, datos)=>{
  
    let flag=empty(datos);

    if(flag){
        tabla.bulkAdd([datos]);
        console.log("inserción realizada")
        
    }
    else{
        console.log("No puedes dajar campos vacios")
    }
 
return flag;
    
}

//validaciones

const empty = object =>{
   
    let flag=false;
    for (const value in object){
        
        if(object[value]!="" && object.hasOwnProperty(value)){
            flag=true;
        }else{
            flag=false;
        }
    }
    return flag;
}



//Consultando datos

const consultar =(tabla, funcion)=>{
    let index=0;
    let obj={};

   tabla.count((cantidad)=>{
   if(cantidad){
       tabla.each(producto=>{
        producto=ordenarCampos(producto);
        funcion(producto, index++);
       })
    }else{
        funcion(0);
    }
   }
       )
}

//definir orden de los campos
const ordenarCampos = producto=>{
    let objProducto={};
    objProducto={
        id:producto.id,
        nombre:producto.nombre,
        descripcion:producto.descripcion
    }
    return objProducto;
}

//Creando etiquetas para agregar en la página
const crearEtiqueta=(etiqueta, agregarA, funcion)=>{
    const etiquetaACrear=document.createElement(etiqueta);
    if(etiquetaACrear){
     agregarA.appendChild(etiquetaACrear);}
    if(funcion){funcion(etiquetaACrear);}
}



export default tiendbd;

export {guardar,consultar, crearEtiqueta }