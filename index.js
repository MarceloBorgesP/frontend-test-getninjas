document.body.onload = init;

function init() {
  loadForm(json._embedded.request_fields, "form");
  loadForm(json._embedded.user_fields, "form-user");
  stepper(verifyRequired);
}

function loadForm(fields, elemAppend) {
  fields.forEach(generateForm);
  
  function generateForm(field) {
    var formList = document.getElementById(elemAppend);
    formList.innerHTML += `
      <li class="form-block">
        <label for="${field.name}">${field.label}</label>
        ${field.required ? `<span class=\"error hidden\" id=\"error ${field.name}\">Este campo é requerido</span>` : ""}
        `+ generateOptions(field) +`
      </li>`;
  }

  function generateOptions(field) {
    switch(field.type) {
      case 'enumerable':
        return field.allow_multiple_value ? generateCheckboxes(field) : generateSelects(field);
      case 'big_text':
        return generateTextArea(field);
      case 'lat_lng':
      case 'small_text':
      case 'email':
      case 'phone':
        return generateInput(field);
    }
  }

  function generateTextArea(field) {
    return `<textarea id="${field.name} ${field.required ? "class=\"validate\"" : ""} name="${field.name} placeholder="${field.placeholder}"></textarea>`
  }

  function generateCheckboxes(field) {
    var html = `<ul id="${field.name}" name="${field.name}" placeholder="${field.name}">`;
    for(var key in field.values) {
      html += `
      <li>
        <input type="checkbox" class="validateCheckbox" name="${field.name}" id="${field.values[key]}" value="${field.values[key]}">
        <label for="${field.values[key]}">${field.values[key]}</label>
      </li>
      `
    }
    return html+='</ul>';
  }

  function generateSelects(field) {
    var html = `
      <select id="${field.name}" ${field.required ? "class=\"validate\"" : ""} name="${field.name}" placeholder="${field.name}">
      <option value="">${field.mask}</option>`;
    for(var key in field.values) {
      html += `<option value="${field.values[key]}">${field.values[key]}</option>`
    }
    return html+='</select>';
  }

  function generateInput(field) {
    return `<input name="${field.name}" type="${field.type}" ${field.required ? "class=\"validate\"" : ""}>`;
  }
}

function stepper(condition) {
  var next = document.getElementById('next');
  next.addEventListener("click", function() {
    if (condition()) {
      document.getElementById('step1').classList.add('hidden');
      document.getElementById('step2').classList.remove('hidden');
    }
  });

  var submit = document.getElementById('submit');
  submit.addEventListener("click", function() {
    if (condition()) {
      alert('Formulário enviado com sucesso!');
    }
  });
}

function verifyRequired() {
    let status = true;
    // VALIDATE CHECKBOXES
    
    let checkboxes = getVisibleClasses('validateCheckbox');
    let checkboxesNames = {};

    for (i = 0; i < checkboxes.length; i++) {
      if (checkboxesNames[checkboxes[i].name] === undefined) checkboxesNames[checkboxes[i].name] = false;
      if (checkboxes[i].checked) checkboxesNames[checkboxes[i].name] = true;
    }

    for (name in checkboxesNames) {
      let elem = document.getElementById(`error ${name}`);
      if (elem) {
        if (!checkboxesNames[name]) {
          elem.classList.remove('hidden');
          status = false;
        }
        else elem.classList.add('hidden');
      }
    }

    // VALIDATE OTHER FIELDS
    let validate = getVisibleClasses('validate');

    for (let i = 0; i < validate.length; i++) {
      let classes = document.getElementById(`error ${validate[i].name}`).classList;
      if (!validate[i].value) {
        classes.remove('hidden');
        status = false;
      } 
      else classes.add('hidden');
    }

    return status;
}

function getVisibleClasses(className) {
  var array = document.getElementsByClassName(className);
  array = [].slice.call(array);
  var i = array.length
  while (i--) {
    if (array[i].offsetWidth === 0 && array[i].offsetHeight === 0){
      array.splice(i, 1);
    }
  }

  return array;
}
