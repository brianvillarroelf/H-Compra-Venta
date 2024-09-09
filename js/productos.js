var productos = JSON.parse(localStorage.getItem("productos")) || [];
var seleccionado = null;

function registrarProducto() {
  var producto = document.getElementById("producto").value;
  var precio = document.getElementById("precio").value;
  var costo = document.getElementById("costo").value;
  var stock = document.getElementById("stock").value;
 
  producto = producto.trim()
  precio = parseFloat(precio);
  stock = parseInt(stock);

  if (producto == "" || costo =="" || precio == "" || stock == "") {
    Swal.fire({
      title: "Faltan Datos!",
      text: "Por favor llene todos los campos del formulario!!!",
      icon: "warning",
    });
    return;
  };

  var producto = {
    producto: producto,
    precio: precio,
    costo: costo,
    stock: stock

  };

  if(seleccionado != null){
    productos[seleccionado] = producto;
    
  }
  else{
    productos.push(producto);
  };


    localStorage.setItem("productos", JSON.stringify(productos));

  window.location.href = 'productos.html';
};

function cargarDatos() {
  var cadena='';
  for(let i = 0; i < productos.length; i++){
    cadena+= `
    <tr>
      <td>${i+1}</td>
      <td>${productos[i].producto}</td>
      <td>${productos[i].costo}</td>
      <td>${productos[i].precio}</td>
      <td>${productos[i].stock}</td>
      <td>
          <div class="acciones">
              <button onclick="editarProducto(${i})" class="btn btn-edit m5">
                  <i class="fa fa-edit"></i>
              </button>
              <button class="btn btn-delete m5" onclick="eliminarProducto(${i})">
                  <i class="fa fa-times"></i>
              </button>
          </div>
      </td>
  </tr>
    `;
  }
  
  if(productos.lenght == 0){
    cadena = `
    <tr>
      <td colspan="6" align="center">
      <br>    <br>
      No hay datos
      <br>    <br>    <br>
        <a href="productosForm.html" class="btn btn-show m5">
          <i class="fa fa-plus">Nuevo</i>
        </a>
      <br>    <br>    <br>    <br>
      </td>
    </tr>`
  }
  ;
  document.getElementById("listaProductos").innerHTML = cadena;
};

function eliminarProducto(posicion){
  Swal.fire({
      title: "Esta seguro?",
      text: "El producto se eliminará!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero eliminar!",
  }).then((result) => {
      if (result.isConfirmed) {            
          productos.splice(posicion, 1);
          localStorage.setItem('productos', JSON.stringify(productos));
          cargarDatos();

          Swal.fire({
              title: "Eliminado!",
              text: "El producto ha sido eliminada.",
              icon: "success",
          });
      }
  });
};

function editarProducto(posicion){

  localStorage.setItem('producto_seleccionado', posicion);

  window.location.href = 'productosForm.html';

};

function setearDatos(){

  seleccionado = localStorage.getItem('producto_seleccionado');

  if(seleccionado !== null && seleccionado >= 0 && seleccionado != undefined){
    var elProducto = productos[seleccionado];
    
    document.getElementById("producto").value = elProducto.producto;
    document.getElementById("precio").value = elProducto.precio;
    document.getElementById("costo").value = elProducto.costo;
    document.getElementById("stock").value = elProducto.stock;

  };
};

function buscarProducto(){
  var buscador = document.getElementById("buscar").value;
  buscador = buscador.trim().toLowerCase();

  var nuevoArray=[];
  if(buscador == '' || buscador == null){
    nuevoArray = JSON.parse(localStorage.getItem("productos")) || [];
  }
  else{
    for(let i = 0; i < productos.length; i++){
      var texto = productos[i].producto.toLowerCase();
      if(texto.search(buscador) >= 0){
        nuevoArray.push(productos[i]);
      }
  }
}
productos = nuevoArray;
cargarDatos();
};