var MESES_LIMITE = 4*12;
var MULTIPLICADOR_MENORES = 0.30;
var MULTIPLICADOR_JUBILADOS = 0.10;
var MULTIPLICADOR_EMPRESAS = 0.0125;
var MULTIPLICADOR_IMPORTACION = 0.10;
var CANTIDAD_EMPLEADOS_PROMEDIO = 20;

var mes = 0;

//POBLACION
var poblacion = 1000000;
var menores = 0;
var activos = 0;
var jubilados = 0;

//EMPRESAS
var empresas = 0;
var exportacion = 0;
var produccion = 0;

//EMPLEO
var empleo = 0.8;
var salarioMinimo = 1000;
var jubilacion = 0.8;
var desocupacion = 0;

//CLASES
var claseAlta = 0.10;
var claseMedia = 0.75;
var claseBaja = 0.15;

//ECONOMIA
var canastaBasica = 800;
var inflacion = 0;
var importacion = 0;
var exportacion = 0;

//CONSUMO
var consumoInterno = 0.8;
var consumoExterno = 0.2;
var ahorro = 0;

//IMAGEN
var imagenPositiva = 0.4;

//PRESUPUESTO
var disponible = 0;
var invertido = 0;

var educacionCienciaTecnologia = 0;
var saludSeguridad = 0;
var empleoObraPublica = 0;

//BANCO CENTRAL
var reservas = 0;
var deuda = 0;

function calcularMes(){
    calcularDistribucionPoblacion();
    calcularEmpresas();
    calcularEmpleo();
    calcularConsumo();
    calcularImpuestos();
    calcularImagen();
}

function siguienteMes(){
    calcularMes();
    mes++;
    mostrar();
}

function mostrar(){

    $("#mandato").css('width', porcentaje(mes/MESES_LIMITE));

    //POBLACION
    $("#poblacion").text(formatoNumero(poblacion));
    $("#menores").text(formatoNumero(menores));
    $("#activos").text(formatoNumero(activos));
    $("#jubilados").text(formatoNumero(jubilados));

    //EMPRESAS
    $("#empresas").text(formatoNumero(empresas));
    $("#produccion").text(pesos(produccion));

    //EMPLEO
    $("#empleo").text(porcentaje(empleo));
    $("#salarioMinimo").text(pesos(salarioMinimo));
    $("#desocupacion").text(porcentaje(desocupacion));
    $("#jubilacion").text(porcentaje(jubilacion));

    //CLASES
    $("#claseAlta").text(porcentaje(claseAlta));
    $("#claseMedia").text(porcentaje(claseMedia));
    $("#claseBaja").text(porcentaje(claseBaja));

    //ECONOMIA
    $("#canastaBasica").text(pesos(canastaBasica));
    $("#importacion").text(pesos(importacion));
    $("#exportacion").text(pesos(exportacion));

    //CONSUMO
    $("#consumoInterno").text(porcentaje(consumoInterno));
    $("#consumoExterno").text(porcentaje(consumoExterno));
    $("#ahorro").text(porcentaje(ahorro));

    //IMAGEN
    $("#imagenPositiva").text(porcentaje(imagenPositiva));

    //PRESUPUESTO
    $("#disponible").text(pesos(disponible));
    $("#invertido").text(pesos(invertido));

    //BANCO CENTRAL
    $("#reservas").text(pesos(reservas));
    $("#deuda").text(pesos(deuda));

}

function calcularDistribucionPoblacion(){
    menores = MULTIPLICADOR_MENORES*poblacion;
    jubilados = MULTIPLICADOR_JUBILADOS*poblacion;
    activos = poblacion - menores - jubilados;
}

function calcularEmpresas(){
    empresas = MULTIPLICADOR_EMPRESAS*poblacion;
    valorAgregado = educacionCienciaTecnologia;
    empleadosPrivados = CANTIDAD_EMPLEADOS_PROMEDIO*empresas;
    produccion = (1 + valorAgregado)*empresas;
}

function calcularEmpleo(){
    empleadosPublicos = empleoObraPublica/salarioMinimo;
    empleoTotal = empleadosPrivados + empleadosPublicos;
    empleo = empleoTotal/activos;
    desocupacion = (1 - empleo);
    if(desocupacion < 0){
        desocupacion = 0;
    }
}

function calcularConsumo(){

    var necesidades = poblacion * canastaBasica;
    var noConsumido = poblacion * (canastaBasica - salarioMinimo);
    if(noConsumido < 0){
        noConsumido = 0;
    }

    demandaInterna = (1 - MULTIPLICADOR_IMPORTACION)*necesidades;
    importacion = MULTIPLICADOR_IMPORTACION*necesidades;

    var demandaTotal = demandaInterna + importacion + noConsumido;

    consumoInterno = demandaInterna/demandaTotal;
    consumoExterno = importacion/demandaTotal;
    ahorro = noConsumido/demandaTotal;
}

function calcularImpuestos(){
    multiplicadorImpuestosEmpresas = sliderImpuestosEmpresas.attr("value")/100;
    multiplicadorImpuestosTrabajadores = sliderImpuestosTrabajadores.attr("value")/100;
    multiplicadorImpuestosImportaciones = sliderImpuestosImportaciones.attr("value")/100;
    multiplicadorImpuestosExportaciones = sliderImpuestosExportaciones.attr("value")/100;

    var impuestosEmpresas = produccion*multiplicadorImpuestosEmpresas;
    var impuestosTrabajadores = empleoTotal*salarioMinimo*multiplicadorImpuestosTrabajadores;
    var impuestosImportaciones = importacion*multiplicadorImpuestosImportaciones;
    var impuestosExportaciones = exportacion*multiplicadorImpuestosExportaciones;

    disponible += impuestosEmpresas;
    disponible += impuestosTrabajadores;
    disponible += impuestosImportaciones;
    disponible += impuestosExportaciones;
}

function calcularImagen(){
    imagenPositiva = 1 - desocupacion;
}

//Botones
function liquidarReservas(){
    reservas-=1000000;
    disponible+=1000000;
    mostrar();
}

function pedirPrestamo(){
    deuda+=1000000;
    reservas+=1000000;
    mostrar();
}

function pagarDeuda(){
    deuda-=1000000;
    reservas-=1000000;
    mostrar();
}

function inicializar(){
    //Mostrar porcentajes en sliders.
    $("input[data-provide='slider']").slider({
        formatter: function(value) {
            return value+"%";
        }
    });

    sliderJubilacion.slider('setValue', jubilacion*100);

    //Sliders Presupuesto
    sliderEducacionCienciaTecnologia.on("slide", sliderEducacionCienciaTecnologiaHandler).data('slider');
    sliderSaludSeguridad.on("slide", sliderSaludSeguridadHandler).data('slider');
    sliderEmpleoObraPublica.on("slide", sliderEmpleoObraPublicaHandler).data('slider');

    calcularMes();
    mostrar();
}

var sliderSalarioMinimo = $("#sliderSalarioMinimo");
var sliderJubilacion = $("#sliderJubilacion");

//Handlers Presupuesto
var sliderEducacionCienciaTecnologia = $("#sliderEducacionCienciaTecnologia");
function sliderEducacionCienciaTecnologiaHandler(){
    var multiplicador = sliderEducacionCienciaTecnologia.attr("value")/100;
    educacionCienciaTecnologia = disponible*multiplicador;
    actualizarInvertido();
}

var sliderSaludSeguridad = $("#sliderSaludSeguridad");
function sliderSaludSeguridadHandler(){
    var multiplicador = sliderSaludSeguridad.attr("value")/100;
    saludSeguridad = disponible*multiplicador;
    actualizarInvertido();
}

var sliderEmpleoObraPublica = $("#sliderEmpleoObraPublica");
function sliderEmpleoObraPublicaHandler(){
    var multiplicador = sliderEmpleoObraPublica.attr("value")/100;
    empleoObraPublica = disponible*multiplicador;
    actualizarInvertido();
}

function actualizarInvertido(){
    invertido = educacionCienciaTecnologia + saludSeguridad + empleoObraPublica;
    $("#invertido").text(pesos(invertido));
}

//Sliders Impuestos
var sliderImpuestosEmpresas = $("#sliderImpuestosEmpresas");
var sliderImpuestosTrabajadores = $("#sliderImpuestosTrabajadores");
var sliderImpuestosImportaciones = $("#sliderImpuestosImportaciones");
var sliderImpuestosExportaciones = $("#sliderImpuestosExportaciones");

//Funciones auxiliares de formato
function porcentaje(numero){
    return formatoNumero((numero*100).toFixed(2))+"%";
}

function pesos(n){
    return "$" + formatoNumero(n);
}

function formatoNumero(numero){
    return numero.toLocaleString();
}
