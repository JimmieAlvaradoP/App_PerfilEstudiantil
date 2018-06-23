//var wsUrl = "http://url.dominio/server.php?wsdl";//para probar de afuera.

var pictureSource; // picture source
var destinationType; // sets the format of returned value
window.latitude1 = "";
window.longitude1 = "";
window.user = "QWERTY77";
window.map_qr = null;
document.addEventListener("deviceready", onDeviceReady, false);

function showAlert(msj){
  navigator.notification.alert(msj, // message
      'UNAB', // title
      '' // buttonName);
} //fin function mensaje.
// PhoneGap is ready

function onDeviceReady(){
  // Do cool things here...
  document.getElementById('largeImage').src = '';
  clearCache();
  pictureSource = navigator.camera.PictureSourceType;
  destinationType = navigator.camera.DestinationType;
}

function clearCache(){
  navigator.camera.cleanup();
}

function getImage(source){
  // Retrieve image file location from specified source
  navigator.camera.getPicture(uploadPhoto, onFail, {
    quality: 50,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: source
  }); //destinationType: navigator.camera.DestinationType.FILE_URI
}

function onFail(message){
  clearCache();
  //alert('Captura Descartada.');
  showAlert('Captura Descartada.' + message);
}

function uploadPhoto(imageURI){
  var largeImage = document.getElementById('largeImage');
  largeImage.style.display = 'block';
  largeImage.src = "data:image/jpeg;base64," + imageURI;
}

function prev(imageURI){
  var largeImage = document.getElementById('preview');
  largeImage.style.display = 'block';
  largeImage.src = imageURI;
}

function iabLoadError(event){
  alert(event.type + ' - ' + event.message);
}

function muestraFotoActual(msg){
  var rut = document.getElementById('rut').value;
  var link = "http://72.14.183.67/ws/s2/archivos/" + rut + ".html"

  if (rut == '') {
    showAlert('Debe ingresar rut de usuario valido!');
  } else {
    var ref = window.open(link, '_blank', 'location=yes');
    ref.addEventListener('loadstart', function(event) {
      showAlert('Url: ' + event.url);
    });
  }
}

function enviaFormulario(){
  //var foto=document.getElementById('largeImage');
  var fotoSrc = document.getElementById('largeImage').src;
  var nombres = document.getElementById('nombres').value;
  var apellidos = document.getElementById('apellidos').value;
  var rut = document.getElementById('rut').value;
  var edad = document.getElementById('edad').value;
  var sexo = document.getElementById('sexo').value;
  var correo = document.getElementById('correo').value;
  var fono = document.getElementById('fono').value;
  var carrera = document.getElementById('carrera').value;
  window.user = $('#user_ubicacion').val();
  var myLatLng = {
    lat: window.latitude1,
    lng: window.longitude1
  };
  window.map_qr.animateCamera({target: myLatLng, zoom: 17, tilt: 60, bearing: 140, duration: 5000});
  // Add a marker
  var text = [
    "Ubicación Actual:\n", window.latitude1 + "," + window.longitude1
  ].join("\n");
  var marker = window.map_qr.addMarker({title: text, position: myLatLng});
  marker.showInfoWindow();

  if (fotoSrc == '' || nombres == '' || apellidos == '' || rut == '' || edad == '' || sexo == '' || correo == '' || fono == '' || carrera == '') {
    showAlert('Debe Ingresar los valores!');
  } else {
    //var fotoCod=encodeImageFileAsURL(foto);

    $.ajax({
      cache: false,
      // puede ser GET, POST
      type: "POST",
      // Tipo de retorno
      dataType: "html",
      // pagina php que recibe la llamada
      url: "http://72.14.183.67/ws/s2/perfil.php",
      // datos, ej: $_POST['data']
      data: {
        foto: fotoSrc,
        nombres: nombres,
        apellidos: apellidos,
        rut: rut,
        edad: edad,
        sexo: sexo,
        correo: correo,
        fono: fono,
        carrera: carrera,
        sede: sede,
        coordenadas: window.latitude1 + "," + window.longitude1,
        fecha_creacion: Date().getTime()
      },
      success: function(msg) {
        console.log(msg);
        if (msg == '1') {
          showAlert('Faltan datos ó el archivo ya existe!');
        } else {
          showAlert('Perfil creado!.');
          WebSer();

        }
      },
      // acciones cuando hay error en comunicacion el el php
      error: function(xhr, status, msg2) {
        //alert('4');
        console.log(xhr);
      }
    }); //fin ajax

  }
}

function WebSer(){
  var rut = document.getElementById('rut').value;
  //var foto=document.getElementById('largeImage');
  var qr = "http://72.14.183.67/ws/s2/archivos/" + rut + ".html"

  if (rut == '') {
    showAlert('Debe Ingresar un Rut!');
  } else {
    //var fotoCod=encodeImageFileAsURL(foto);

    $.ajax({
      cache: false,
      // puede ser GET, POST
      type: "POST",
      // Tipo de retorno
      dataType: "html",
      // pagina php que recibe la llamada
      url: "http://72.14.183.67/ws/s2/qr.php",
      // datos, ej: $_POST['data']
      data: {
        rut: rut,
        qr
      },
      /*beforeSend: function(){
                document.getElementById('divCargando').style.display="block";
                $("#labelCargando").html('Cargando...');
            },*/
      // acciones cuando me retorna algo el PHP
      success: function(msg) {
        console.log(msg);
        if (msg == '1') {
          showAlert('Faltan datos o el archivo ya existe!');
        } else {
          showAlert('QR creado!');

        }
      },
      // acciones cuando hay error en comunicacion el el php
      error: function(xhr, status, msg2) {
        //alert('4');
        console.log(xhr);
      }
    }); //fin ajax

  }
}

function GetSource(){
  var rut = document.getElementById('rut').value;
  //var foto=document.getElementById('largeImage');

  if (rut == '') {
    showAlert('Debe ingresar rut!');
  } else {
    //var fotoCod=encodeImageFileAsURL(foto);

    $.ajax({
      cache: false,
      // puede ser GET, POST
      type: "POST",
      // Tipo de retorno
      dataType: "html",
      // pagina php que recibe la llamada
      url: "http://72.14.183.67/ws/getSrc/getSrc.php",
      // datos, ej: $_POST['data']
      data: {
        rut: rut
      },
      /*beforeSend: function(){
                document.getElementById('divCargando').style.display="block";
                $("#labelCargando").html('Cargando...');
            },*/
      // acciones cuando me retorna algo el PHP
      success: function(msg) {
        console.log(msg);
        if (msg == '1') {
          showAlert('Ha ocurrido un Error. Archivo ya existe!');
        } else {
          // showAlert('ok gs!.');
          // showAlert(msg);
          prev(msg);
        }
      },
      // acciones cuando hay error en comunicacion el el php
      error: function(xhr, status, msg2) {
        //alert('4');
        console.log(xhr);
      }
    }); //fin ajax

  }
}

function sendSMS(){
  var fono = document.getElementById('fono').value;
  var rut = document.getElementById('rut').value;
  if (fono == '') {
    showAlert('Debe Ingresar el Fono!');
  } else {

    var textoURl = "http://72.14.183.67/ws/s2/archivos_qr/" + rut + "_qr.html";

    if (SMS) {
      SMS.sendSMS(fono, textoURl, function() {
        showAlert('Message sent successfully');
      }, function(e) {
        showAlert('Message Failed:' + e);
      });
    }

  }
}

function scanCode(){
  cordova.plugins.barcodeScanner.scan(function(result) {
    showAlert("We got a barcode\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
    if (result.text == '') {
      showAlert('Escaneo cancelado');
    } else {
      GetSource();
    }

  }, function(error) {
    showAlert("Scanning failed: " + error);
  }, {
    preferFrontCamera: true, // iOS and Android
    showFlipCameraButton: true, // iOS and Android
    showTorchButton: true, // iOS and Android
    torchOn: true, // Android, launch with the torch switched on (if available)
    saveHistory: true, // Android, save scan history (default false)
    prompt: "Place a barcode inside the scan area", // Android
    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
    orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
    disableAnimations: true, // iOS
    disableSuccessBeep: false // iOS and Android
  });
} //fin function


var option = {
  enableHighAccuracy: true // use GPS as much as possible
};

plugin.google.maps.LocationService.getMyLocation(option, function(location) {
  //map qr
  var divqr = document.getElementById("map2");
  window.map_qr = plugin.google.maps.Map.getMap(divqr);
  window.latitude1 = location.latLng.lat.toFixed(3);
  window.longitude1 = location.latLng.lng.toFixed(3);
  //marker.showInfoWindow();
});
}, false);
