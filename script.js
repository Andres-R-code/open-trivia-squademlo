function getQuest() {

  const cantidad = document.getElementById('cantidad').value;
  const categorias = document.getElementById('categorias').value;
  const dificultad = document.getElementById('dificultad').value;
  const tipo = document.getElementById('tipo').value;

  let url = `https://opentdb.com/api.php?amount=${cantidad}${categorias}&difficulty=${dificultad}&type=${tipo}`;

  $('#progressbar').progress('reset').progress({
    total: cantidad
  });

  
  

  fetch(url)
    .then((response) => response.json())
    .then((data) => renderQuest(data.results));
}

function progressBar(data) {
  $('#progressbar').progress('increment');
  $('#checkbox' + data).checkbox('set disabled'); // Desahabilita los checkbox
}

function renderQuest(data) {

  let html = '';
  let id = 0;

  data.forEach((row, index) => {

    id += 1;
    row.id = id;

    let answers = [];
    row.incorrect_answers.forEach(r => {
      answers.push(r);
    });
    answers.push(row.correct_answer);
    answers.sort(function () {
      return 0.5 - Math.random();
    });

    html += `
    <div class="ui tall stacked raised segment" id="segmentrespuestas${id}">
      <h4 class="ui dividing header">
      <div class="ui icon" data-tooltip="Este color tiene relacion con la dificultad!">
        <i class="tasks ${colorDifficulty(row.difficulty)} icon"></i>
        </div>
        <div class="content">
          ${row.category}
          <div class="sub header">${capitalize(row.difficulty)} | ${capitalize(row.type)} | ${row.correct_answer}</div>
        </div>
      </h4>
      
      <div class="ui inverted ${colorDifficulty(row.difficulty)} tertiary segment very padded center aligned">
      <h4><i class="ui quote left icon"></i> ${row.question} <i class="ui quote right icon"></i></h4>
      </div>
  
      <div class="ui equal width form">

      <div class="ui divider"></div>

      <div class="inline fields" id="checkbox${row.id}">`;

    answers.forEach(respuesta => {
      html += `<div class="field">
            <div class="ui toggle checkbox">
            <input type="radio" name="answers${row.id}" value="${[respuesta,id,row.correct_answer]}" onclick="progressBar(${row.id})">
            <label>${respuesta}</label>
            </div>
            </div>`;
    });

    html += `
    </div>
    </div>

    

    <div class="ui dimmer" id="dimmergood${row.id}">
    <div class="content">  
    <h2 class="ui inverted icon header">
    <i class="star yellow icon"></i>
    <div class="content">Respuesta correcta!
    <div class="sub header">${row.correct_answer}</div>
    </div>
    </h2>
    </div>
    </div>
    
    
    <div class="ui dimmer" id="dimmerbad${row.id}">
    <div class="content">  
    <h2 class="ui inverted icon header">
    <i class="x red icon"></i>
    <div class="content">Respuesta incorrecta!
    <div class="sub header">${row.correct_answer}</div>
    </div>
    </h2>
    </div>
    </div>

    </div>`;
  });
  html += `
  <input type="submit" class="ui fluid button orange" onclick="getAnswers(${id})" id="resultadorespuestas">
  <div class="ui basic segment"></div>`;

  document.getElementById('form').innerHTML = html;
}

function getAnswers(ids) {
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
  const url = 'https://opentdb.com/api_category.php';
  fetch(url)
    .then((response) => response.json())
    .then((data) => renderCat(data));
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