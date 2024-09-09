var productos = JSON.parse(localStorage.getItem("productos")) || [];
var clientes = JSON.parse(localStorage.getItem("clientes")) || [];
var ventas = JSON.parse(localStorage.getItem("ventas")) || [];
var carrito = [];

function cargarProductos() {
  var cadena='';
  for(let i = 0; i < productos.length; i++){
    cadena+= `
    <tr>
      <td>${productos[i].producto}</td>
      <td>${productos[i].precio}</td>
      <td>${productos[i].stock}</td>
      <td>
          <div class="acciones">
              <button onclick="agregarCarrito(${i})" class="btn btn-show m5">
                  <i class="fa fa-plus"></i>
              </button>
          </div>
      </td>
    </tr>
    `;

  }
  if(productos.length == 0){
    cadena += `<tr>
    <td colspan="4">
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

function buscarProducto(){
  var buscador = document.getElementById("buscarProducto").value;
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
cargarProductos();
};

function cargarClientes(){
  var cadena='';
  for(let i = 0; i < clientes.length; i++){
    cadena+= `
    <option value="${clientes[i].nombre}">${clientes[i].nombre +' '+ clientes[i].apellidos}</option>
    `
  }
  document.getElementById('cliente').innerHTML = cadena;
};

function agregarCarrito(parametro){
  var elemento = {
    producto: productos[parametro].producto,
    precio: productos[parametro].precio,
    stock: productos[parametro].stock,
    cantidad: 1,
    subtotal: function(){
      return this.cantidad *this.precio;
    }
  }
  carrito.push(elemento);
  cargarCarrito();

};

function cargarCarrito(){
  var cadena = '';
  for(let i = 0; i < carrito.length; i++){
    cadena += `
    <tr>
      <td>${carrito[i].producto}</td>
      <td>${carrito[i].precio}</td>      
      <td>
        <input type="number" onchange="cambiaCantidad(${i}, this)" value="${carrito[i].cantidad}" class="form" placeholder="Cantidad">
      </td>
      <td>${carrito[i].subtotal()}</td>
      <td>
        <button onclick="quitarCarrito(${i})" class="btn btn-delete m5">
          <i class="fa fa-times"></i>        
      </td>
    </tr>
    `
  }
  document.getElementById('listaCarrito').innerHTML = cadena;
  calcularTotal();
};

function quitarCarrito(posicion){
  carrito.splice(posicion,1);
  cargarCarrito();
}

function calcularTotal(){
  var descuento = document.getElementById('descuento').value;

  var total = 0;
  for(let i= 0; i < carrito.length; i++){
    total += carrito[i].subtotal();
  }
  totalNeto = total - descuento
  document.getElementById('totalNeto').innerHTML = totalNeto;
}
function cambiaCantidad(posicion,elemento){
  if(elemento.value <= 0){
    Swal.fire({
      title: "No puede ser cero",
      text: "Por favor ingrese un valor mayor a 0",
      icon: "warning"
    });
    return;
  };
  carrito[posicion].cantidad = (elemento.value != null || elemento.value != '') ? elemento.value : 1;
  cargarCarrito();
}

function registrarVenta(){
  var cliente = document.getElementById('cliente').value;
  var fecha = document.getElementById('fecha').value;
  var comprobante = document.getElementById('comprobante').value;
  var descuento = document.getElementById('descuento').value;
  var total = 0;

  for(let i = 0; i < carrito.length; i++){
    total += carrito[i].subtotal();
  }

  if(cliente == '' || fecha == '' || comprobante == '' || total == 0){
    Swal.fire({
      title: "Faltan datos!",
      text: "Por favor llene todos los campos",
      icon: "warning"
    });
    return;
  }

  var venta = {
    cliente: cliente,
    fecha: fecha,
    comprobante: comprobante,
    total: total,
    descuento: (descuento =='') ? 0 : descuento,
    usuario: 'Brian Villarroel',    
    detalle: carrito
  }
  ventas.push(venta);
  localStorage.setItem('ventas', JSON.stringify(ventas));
  
  var losProductos = JSON.parse(localStorage.getItem('productos'));
  //actualizamos el stock de los productos
  for(let i = 0; i < carrito.length; i++){
    for(let j = 0; j < losProductos.length; j++){
      if(losProductos[j].producto == carrito[i].producto){
        losProductos[j].stock -= parseInt(carrito[i].cantidad);
      }
    }
  }
  localStorage.setItem('productos', JSON.stringify(losProductos));
  //limpiamos el carrito
  /* carrito = [];
  //cargamos el carrito
  cargarCarrito(); */
  window.location.href = 'ventas.html';
}

function cargarDatos(){
  var cadena='';
  for(let i = 0; i < ventas.length; i++){
    cadena+= `
    <tr>
      <td>${i+1}</td>
      <td>${ventas[i].cliente}</td>
      <td>${ventas[i].fecha}</td>
      <td>${ventas[i].comprobante}</td>
      <td>${ventas[i].total}</td>
      <td>${ventas[i].descuento}</td>
      <td>${parseFloat(ventas[i].total) - parseFloat(ventas[i].descuento)}</td>
      <td>${ventas[i].usuario}</td>
      <td>
          <div class="acciones">
              <button onclick="verVenta(${i})" class="btn btn-show m5">
                <i class="fa fa-eye"></i>
              </button>
              <button onclick="eliminarVenta(${i})" class="btn btn-delete m5">
                <i class="fa fa-times"></i>
              </button>
          </div>
      </td>
    </tr>
`;

  }
  if(ventas.length == 0){
    cadena += `<tr>
    <td colspan="9">
    <br>    <br>
    No hay ventas registradas!
    <br>    <br>    <br>
    <a href="productosForm.html" class="btn btn-nuevo">
      <i class="fa fa-plus">Nuevo</i>
    </a>
    <br>    <br>    <br>    <br>
    </td>
    </tr>`
  }
  ;
  document.getElementById("listaVentas").innerHTML = cadena;
  cargarTotales();

}

function buscarVenta(){
  var buscador = document.getElementById("buscar").value;
  buscador = buscador.trim().toLowerCase();

  var nuevoArray=[];
  if(buscador == '' || buscador == null){
    nuevoArray = JSON.parse(localStorage.getItem("ventas")) || [];
  }
  else{
    for(let i = 0; i < ventas.length; i++){
      var texto = ventas[i].cliente.toLowerCase();
      if(texto.search(buscador) >= 0){
        nuevoArray.push(ventas[i]);
      }
  }
}
ventas = nuevoArray;
cargarDatos();
};

function eliminarVenta(posicion){
  var laVenta = ventas[posicion];
  console.log(laVenta);
  Swal.fire({
      title: "Esta seguro?",
      text: "La venta se eliminara!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero eliminar!",
  }).then((result)=>{
      if(result.isConfirmed){
        var losProductos = JSON.parse(localStorage.getItem('productos'));
        for(let i = 0; i < laVenta.detalle.length; i++){
          for(let j = 0; j < losProductos.length; j++){
            if(losProductos[j].producto == laVenta.detalle[i].producto){
              if (parseInt(losProductos[j].stock) == parseInt(laVenta.detalle[i].cantidad)) {
                losProductos[j].stock += parseInt(laVenta.detalle[i].cantidad);
              }
              else{
                Swal.fire({
                  title: "Error!",
                  text: "No hay suficiente stock!",
                  icon: "error"
                });
                return;
              }
            }
          }
        }
        localStorage.setItem('productos', JSON.stringify(losProductos));
        ventas.splice(posicion, 1);
        localStorage.setItem('ventas', JSON.stringify(ventas));
        cargarDatos();

        Swal.fire({
          title: "Eliminado!",
          text: "La venta ha sido eliminada!",
          icon: "success",
        });
      }
    });
}

function verVenta(posicion){
  localStorage.setItem('posicionVenta', posicion);
  window.location.href = 'ventasVer.html';
}

function mostrarVenta(){
  var posicion = localStorage.getItem('posicionVenta');
  var laVenta = ventas[posicion];
  console.log(laVenta);

  if(laVenta == null || laVenta == undefined){
    Swal.fire({
      title: "No existe la venta!",
      text: "La venta no existe o ha sido eliminada",
      icon: "warning",
    }).then((result) => {
      window.location.href = 'ventas.html';
    });
  }

  document.getElementById('cliente').innerText = laVenta.cliente;
  document.getElementById("fecha").innerText = laVenta.fecha;
  document.getElementById("comprobante").innerText = laVenta.comprobante;
  document.getElementById("total").innerText = laVenta.total;
  document.getElementById("descuento").innerText = laVenta.descuento;
  document.getElementById("totalNeto").innerText = parseFloat(laVenta.total) - parseFloat(laVenta.descuento);
  document.getElementById("usuario").innerText = laVenta.usuario;
  document.getElementById("ltotal").innerText = laVenta.total;

  var cadena = '';
  for(let i = 0; i< laVenta.detalle.length; i++){
    var subtotal = parseFloat(laVenta.detalle[i].precio) * parseFloat(laVenta.detalle[i].cantidad);
    cadena += `
    <tr>
      <td>${laVenta.detalle[i].producto}</td>
      <td>${laVenta.detalle[i].precio}</td>
      <td>${laVenta.detalle[i].cantidad}</td>
      <td>${subtotal}</td>
    `;
  }
  document.getElementById("listaVer").innerHTML = cadena;
}

function cargarTotales(){
  var cantidadVentas = 0;
  var ventasMes =0;
  var totalVentas = 0;

  for(let i = 0; i < ventas.length; i++){
    var laFecha = ventas[i].fecha;
    var laFecha = new Date(laFecha);
    var fechaActual = new Date();

    if(laFecha.getFullYear() == fechaActual.getFullYear()){
      totalVentas += parseFloat(ventas[i].total) - parseFloat(ventas[i].descuento);

      if(laFecha.getMonth() == fechaActual.getMonth()){
        ventasMes += parseFloat(ventas[i].total) - parseFloat(ventas[i].descuento);
      }
      cantidadVentas++;
    }
}
document.getElementById("cantidadVentas").innerText = cantidadVentas;
document.getElementById("ventasMes").innerText = ventasMes;
document.getElementById("totalVentas").innerText = totalVentas;
}