var clientes = JSON.parse(localStorage.getItem("clientes")) || [];
var seleccionado = null;

function registrarCliente() {
  var nombre = document.getElementById("nombre").value;
  var apellidos = document.getElementById("apellidos").value;
  var documento = document.getElementById("documento").value;
  var tipo = document.getElementById("tipo").value;
  var telefono = document.getElementById("telefono").value;
  var correo = document.getElementById("correo").value;
  

  if (nombre.trim() == "" || apellidos.trim() == "" || documento.trim() == "" || telefono.trim() == "" || correo.trim() == "") {
    Swal.fire({
      title: "Faltan Datos!",
      text: "Por favor llene todos los campos del formulario!!!",
      icon: "warning",
    });
    return;
  };

  var cliente = {
    nombre: nombre,
    apellidos: apellidos,
    documento: documento,
    tipo: tipo,
    telefono: telefono,
    correo: correo,
    
  };

  if(seleccionado != null){
    clientes[seleccionado] = cliente;
    
  }
  else{
    clientes.push(cliente);
  };


    localStorage.setItem("clientes", JSON.stringify(clientes));

  window.location.href = 'clientes.html';
};

function cargarDatos() {
  var cadena='';
  for(let i = 0; i < clientes.length; i++){
    cadena+= `
    <tr>
                                    <td>${i+1}</td>
                                    <td>${clientes[i].nombre}</td>
                                    <td>${clientes[i].apellidos}</td>
                                    <td>${clientes[i].documento}</td>
                                    <td>${clientes[i].tipo}</td>
                                    <td>${clientes[i].telefono}</td>
                                    <td>${clientes[i].correo}</td>
                                    <td>
                                        <div class="acciones">

                                            <button onclick="editarCliente(${i})" class="btn btn-edit m5">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button class="btn btn-delete m5" onclick="eliminarCliente(${i})">
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

    `

  };
  document.getElementById("listaClientes").innerHTML = cadena;
};

function eliminarCliente(posicion){
  Swal.fire({
      title: "Esta seguro?",
      text: "El cliente se eliminará!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero eliminar!",
  }).then((result) => {
      if (result.isConfirmed) {            
        clientes.splice(posicion, 1);
          localStorage.setItem('clientes', JSON.stringify(clientes));
          cargarDatos();

          Swal.fire({
              title: "Eliminado!",
              text: "El cliente ha sido eliminada.",
              icon: "success",
          });
      }
  });
};

function editarCliente(posicion){

  localStorage.setItem('cliente_seleccionado', posicion);

  window.location.href = 'clientesForm.html';

};

function setearDatos(){

  seleccionado = localStorage.getItem('cliente_seleccionado');

  if(seleccionado !== null && seleccionado >= 0 && seleccionado != undefined){
    var elCliente = clientes[seleccionado];
    
    document.getElementById("nombre").value = elCliente.nombre;
    document.getElementById("apellidos").value = elCliente.apellidos;
    document.getElementById("documento").value = elCliente.documento;
    document.getElementById("tipo").value = elCliente.tipo;
    document.getElementById("telefono").value = elCliente.telefono;
    document.getElementById("correo").value = elCliente.correo;
    
  };
};

function buscarCliente(){
  var buscador = document.getElementById("buscar").value;
  buscador = buscador.trim().toLowerCase();

  var nuevoArray=[];
  if(buscador == '' || buscador == null){
    nuevoArray = JSON.parse(localStorage.getItem("clientes")) || [];
  }
  else{
    for(let i = 0; i < clientes.length; i++){
      var texto = clientes[i].nombre.toLowerCase();
      if(texto.search(buscador) >= 0){
        nuevoArray.push(clientes[i]);
      }
  }
}
clientes = nuevoArray;
cargarDatos();
};