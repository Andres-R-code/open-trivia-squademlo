function randomArray(incorrectas, correcta) {
    let answers = [];
    incorrectas.forEach(r => { answers.push(r); });
    answers.push(correcta);
    answers.sort(function () { return 0.5 - Math.random(); });
    return answers;
}

function getQuest() {
    const can = $('#cantidad').val();
    const cat = $('#categorias').val();
    const dif = $('#dificultad').val();
    const tipo = $('#tipo').val();

    let url = `https://opentdb.com/api.php?amount=${can}${cat}&difficulty=${dif}&type=${tipo}`;
    fetch(url).then((response) => response.json()).then((data) => renderQuest(data.results));
    // $('#progressbar').progress('reset').progress({ total: can });
}

// function progressBar(data) {
//   $('#progressbar').progress('increment');
//   $('#checkbox' + data).checkbox('set disabled'); // Desahabilita los checkbox
// }



function renderQuest(data) {


  let html = '';
  let ids = [];

  data.forEach((row, index) => {

    ids.push(index);
    html += `
      <div class="ui stacked segments">
      <div class="ui inverted grey segment">
      <div id="timer"></div>
      </div>
      <div class="ui segment padded">${row.category}</div>
      <div class="ui inverted blue segment very padded center aligned">
      <h3><i class="ui quote left icon"></i> ${row.question} <i class="ui quote right icon"></i></h3>
      </div>
      <div class="ui horizontal segments">`;
    randomArray(row.incorrect_answers, row.correct_answer).forEach(r => {
      html += `<div class="ui center aligned very padded button segment" name="answers${index}" value="${[r, index, row.correct_answer]}" onclick="progressBar(${index})">
        <p>${r}</p>
        </div>`
    });

    html += `</div>
      <div class="ui inverted grey segment">
      </div></div>`;
  });
  document.getElementById('renderquestions').innerHTML = html;
  
  const numbertimer = ids.length * 10;
  let a = new crono("timer", numbertimer, 0);
  a.conteoSegundos();
}

function respuesta(ids) {
    const elementos = numberToArray(ids);
    elementos.forEach(data => {
        const resp = document.getElementsByName('answers' + data); // Recoge la informacion de los input con el name="answers"
        resp.forEach((row) => {
            if (row.checked) {
                $('.checkbox').checkbox('set disabled'); // Desahabilita los checkbox
                $('#resultadorespuestas').addClass('disabled'); // Deshabilita el submit principa
                $('#resultadorespuestas').val("Puedes generar nuevas preguntas desde el formulario de la izquierda, buena suerte!");
                const valores = row.value.split(',');
                if (valores[0] === valores[2]) {
                    $('#dimmergood' + data).dimmer('show');
                } else {
                    $('#dimmerbad' + data).dimmer('show');
                }
            }
        });
    });
}

function numberToArray(cantidad) {
    let a = [];
    for (let i = 1; i < cantidad + 1; i++) {
        a.push(i);
    }
    return a;
}

function getCat() {
    fetch('https://opentdb.com/api_category.php').then((response) => response.json()).then((data) => renderCat(data));
}

getCat();

function renderCat(data) {
    const catData = document.getElementById('categorias');
    let html = `<option value="&category=">Seleccionar Categoria</option>`;
    for (const cat of data.trivia_categories) {
        html += `<option value="&category=${cat.id}">${cat.name}</option>`;
    }
    catData.innerHTML = html;
}

$('.ui.dropdown').dropdown(); // inicializa el select en semantic ui

// Funcion con switch para determinar el color de algunos elementos segun la dificultad
function colorDifficulty(difficulty) {
    switch (difficulty) {
        case 'hard':
            return 'red';
            break;
        case 'medium':
            return 'blue';
            break;
        case 'easy':
            return 'green';
            break;
    }
}

// Funcion para capitalizar
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function deleteSpaces(string) {
    string.split(" ").join("");
} 

function crono(id, inicio, final) {
    //variables auxiliares
    this.id = id;
    this.inicio = inicio;
    this.final = final;
    this.contador = this.inicio;

    // funcion conteoSegundos se encarga de realizar el conteo
    this.conteoSegundos = function () {
        // Comprobacion de finalizacion de conteo
        if (this.contador == this.final) {
            this.conteoSegundos = null;
            return;
        }

        document.getElementById(this.id).innerHTML = this.contador--;
        // se invoca la función conteoSegundos con el metodo setTimeout
        setTimeout(this.conteoSegundos.bind(this), 1000);
    };
}

// parametersTimer permite ajustar los parametros de entrada del temporizador
