
function login() {
  var usuario = document.getElementById("usuario").value;
  var password = document.getElementById("password").value;

  if (usuario === "admin" && password === "admin") {
    
    localStorage.setItem('sesion', 'si');

    Swal.fire({
      title: "¡Bienvenido!",
      text: "Sesión iniciada correctamente",
      icon: "success",
    }).then(() => {
      window.location.href = "index.html";
    });
  } else {
    Swal.fire({
      title: "Error",
      text: "Usuario o contraseña incorrectos", 
      icon: "error",
    }).then(() => {
      window.location.href = "login.html";
    });
  }
};

function verificar(){
  if(localStorage.getItem('sesion') != 'si'){
    window.location.href = "login.html";
  }
/*   else{
    window.location.href = "login.html";
  } */
};

function logout(){
  Swal.fire({
    title: "¿Está seguro?",
    text: "Se cerrará la sesión",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, cerrar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('sesion');
      window.location.href = "login.html";
    }
  })
};