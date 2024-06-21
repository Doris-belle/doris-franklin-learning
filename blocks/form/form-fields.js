import { toClassName } from '../../scripts/aem.js';

function createFieldWrapper(fd) {
  const fieldWrapper = document.createElement('div');
  if (fd.Style) fieldWrapper.className = fd.Style;
  fieldWrapper.classList.add('field-wrapper', `${fd.Type}-wrapper`);

  fieldWrapper.dataset.fieldset = fd.Fieldset;

  return fieldWrapper;
}

const ids = [];
function generateFieldId(fd, suffix = '') {
  const slug = toClassName(`form-${fd.Name}${suffix}`);
  ids[slug] = ids[slug] || 0;
  const idSuffix = ids[slug] ? `-${ids[slug]}` : '';
  ids[slug] += 1;
  return `${slug}${idSuffix}`;
}

function createLabel(fd) {
  const label = document.createElement('label');
  label.id = generateFieldId(fd, '-label');
  label.textContent = fd.Label || fd.Name;
  label.setAttribute('for', fd.Id);
  return label;
}

function createRangeDes(fd) {
  const label = document.createElement('span');
  label.id = generateFieldId(fd, '-span');
  label.textContent = fd.Range;
  label.setAttribute('for', fd.Id);
  return label;
}

function setCommonAttributes(field, fd) {
  field.id = fd.Id;
  field.name = fd.Name;
  field.required = fd.Mandatory && (fd.Mandatory.toLowerCase() === 'true' || fd.Mandatory.toLowerCase() === 'x');
  field.placeholder = fd.Placeholder;
  field.value = fd.Value;
}

const createHeading = (fd) => {
  const fieldWrapper = createFieldWrapper(fd);

  const level = fd.Style && fd.Style.includes('sub-heading') ? 3 : 2;
  const heading = document.createElement(`h${level}`);
  heading.textContent = fd.Value || fd.Label;
  heading.id = fd.Id;

  fieldWrapper.append(heading);

  return { field: heading, fieldWrapper };
};

const createPlaintext = (fd) => {
  const fieldWrapper = createFieldWrapper(fd);

  const text = document.createElement('p');
  text.textContent = fd.Value || fd.Label;
  text.id = fd.Id;

  fieldWrapper.append(text);

  return { field: text, fieldWrapper };
};

const createConfirmation = (fd, form) => {
  form.dataset.confirmation = new URL(fd.Value).pathname;

  return {};
};

const createSubmit = (fd) => {
  const button = document.createElement('button');
  button.textContent = fd.Label || fd.Name;
  button.classList.add('button');
  button.type = 'submit';

  const fieldWrapper = createFieldWrapper(fd);
  fieldWrapper.append(button);
  return { field: button, fieldWrapper };
};

const createInput = (fd) => {
  const field = document.createElement('input');
  field.type = fd.Type;
  setCommonAttributes(field, fd);

  const fieldWrapper = createFieldWrapper(fd);
  const label = createLabel(fd);
  const rangeDes = createRangeDes(fd)
  field.setAttribute('aria-labelledby', label.id);
  fieldWrapper.append(field);
  fieldWrapper.append(label);
  fieldWrapper.append(rangeDes);

  return { field, fieldWrapper };
};

const createCheckbox = (fd) => {
  const { field, fieldWrapper } = createInput(fd);
  if (!field.value) field.value = 'checked';
  fieldWrapper.classList.add('selection-wrapper');

  return { field, fieldWrapper };
};

const FIELD_CREATOR_FUNCTIONS = {
  heading: createHeading,
  plaintext: createPlaintext,
  submit: createSubmit,
  confirmation: createConfirmation,
  checkbox: createCheckbox,
};

export default async function createField(fd, form) {
  fd.Id = fd.Id || generateFieldId(fd);
  const type = fd.Type.toLowerCase();
  const createFieldFunc = FIELD_CREATOR_FUNCTIONS[type] || createInput;
  const fieldElements = await createFieldFunc(fd, form);

  return fieldElements.fieldWrapper;
}
