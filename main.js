/* button.addEventListener("click",(e) => {
    e.target => indica el elemento que ha recibido el click - podria ser una img,svg u otro dentro del boton
    e.currentTarget => es el elemento que esta escuchando el evento - es el boton
}) */
import countries from './countries.json' // se importa el archivo json con la data de los paises
import { toast } from 'https://cdn.skypack.dev/wc-toast'

function changeTimeZone (date, timeZone) {
  // esta validacion se podria obviar y solo hacer el cambio del return
  const dateUse = typeof date === 'string'
    ? new Date(date) // la fecha entregada se pasa a formato que da la funcion Date
    : date // si no, devuelve la fecha como esta nomas
  console.log(dateUse)
  return new Date(dateUse.toLocaleString('en-US', { // el new Date solo procesa las fechas en inglés
    // con el timezon que se entrega, se moficia la hora segun el pais
    timeZone
  }))
}

function transformDateToString (date) {
  const localeDate = date.toLocaleString('es-ES', { // transforma dependiendo de la ubicacion que le demos de parametro 'es-Es'
    hour12: false,
    hour: 'numeric',
    minute: 'numeric'
  })
  console.log(localeDate)
  return localeDate.replace(':00', 'H') // hacemos replace para editar el formato de la hora al salir
}
// $ -> ESTO NO ES JQUERY es una funcion creada que recibe el tipo de elemento y lo podemos guardar en una variable
const $ = selector => document.querySelector(selector)
const $input = $('input'); console.log($input) // -> podemos manejar el input datetime por ejemplo
// const $form = $('form') -> lo cambiamos por un evento change del input datetime, se irá actualizando
const $textarea = $('textarea')

$input.addEventListener('change', () => { // para cuando cambie la fecha u hora
  const date = $input.value
  /* $('form').addEventListener('submit', (event) => { // escuchamos el evento submit del form
   event.preventDefault() // evita que haga lo por defecto (refrescar la pagina)
  // no mostraba nada, por que el input no tenia atributo name, se debe definir para que haga el array
  // en date se guarda el valor del input en formato de objeto {date: '2022-09-13T14:00'}
   const { date } = Object.fromEntries(new window.FormData($form)) // FormData - metodo que obtiene todos los elementos del form con el tipoInput: valor */
  /* Object.fromEntries - metodo que crea un array de arrays en un objeto (json)
  const array = [['algo', 1], ['equipo', 'UC']]
  console.log(array)
  const nuevoObjeto = Object.fromEntries(array)
  console.log(nuevoObjeto) */
  const times = {} // objeto vacio para agrupar los paises
  const mainDate = new Date(date) // se le da formato completo a partir del date obtenido del valor del input

  countries.forEach(c => { // recorremos objetos de countries.json
    const { country_code: code, emoji, timezones } = c // sacamos del objeto esos valores y los guardamos
    const [timezone] = timezones // para ver la primera posicion de los timezones del objeto (tiene varios) "America/Bogota" por ej.
    const dateInTimezone = changeTimeZone(mainDate, timezone) // recibe la fecha/hora modificada
    const hour = dateInTimezone.getHours() // obtenemos solo la hora (HH:) del resultado

    times[hour] ??= [] // console.log(dateInTimezone.getHours())
    times[hour].push({
      date: dateInTimezone,
      code,
      emoji,
      timezones
    })
    // ordenamos el array times de mayor a menor
    const sortedTimes = Object.entries(times).sort(([timeA], [timeB]) => +timeB - +timeA)
    console.log(sortedTimes)
    const html = sortedTimes.map(([, countries]) => { // en sortedtimes tenemos un arreglo con los paises (ordenados) y lo recorremos con map
      console.log(countries)
      // {date: Tue Sep 13 2022 14:00:00 GMT-0300 (hora de verano de Chile), code: 'UY', emoji: '🇺🇾', timezones: Array(1)}
      const flags = countries.map(country => `${country.emoji}`).join(' ') // obtiene la bandera de cada elemento recorrido
      const [country] = countries
      const { date } = country
      return `${transformDateToString(date)} ${flags}` // devolvemos el emoji y la hora modificada luego de llamar a la funcion
    }).join('\n')
    console.log(html)

    navigator.clipboard.writeText(html) // para copiar lo que tiene de valor un objeto/variable/array
      .then(() => {
        toast('¡Copiado al portapapeles!', {
          icon: {
            type: 'success'
          }
        })
      })

    $textarea.value = html // agregar el resultado en el textarea
  })
})
// const spainDate = changeTimeZone(mainDate, mainTimeZone)
// const argentinaDate = changeTimeZone(mainDate, argentinaInfo.timezones[0])
// console.log({ spainDate, argentinaDate, colombiaDate })
// HAY UNA NUEVA API LLAMADA TEMPORAL para revisarla y es mas facil de usar y obtener los datos de DATE
