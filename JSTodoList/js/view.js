import AddTodo from './components/add-todo.js';
import Modal from './components/modal.js';
import Filters from './components/filters.js';

export default class View {
  constructor() {
    this.model = null;
    this.table = document.getElementById('table');
    this.addTodoForm = new AddTodo();
    this.modal = new Modal();
    this.filters = new Filters();
    
    // Event listeners para las acciones
    this.addTodoForm.onClick((title, description, difficulty) => this.addTodo(title, description, difficulty));
    this.modal.onClick((id, values) => this.editTodo(id, values));
    this.filters.onClick((filters) => this.filter(filters));
  }

  setModel(model) {
    this.model = model;
  }

  render() {
    const todos = this.model.getTodos();
    todos.forEach((todo) => this.createRow(todo));
  }

  filter(filters) {
    const { type, words } = filters;
    const [, ...rows] = this.table.getElementsByTagName('tr');
    for (const row of rows) {
      const [title, description] = row.children;
      let shouldHide = false;

      // Filtro de palabras en título y descripción
      if (words) {
        shouldHide = !title.innerText.toLowerCase().includes(words.toLowerCase()) &&
                     !description.innerText.toLowerCase().includes(words.toLowerCase());
      }

      // Filtro por estado completado
      const shouldBeCompleted = type === 'completed';
      const isCompleted = row.querySelector('input[type="checkbox"]').checked;

      if (type !== 'all' && shouldBeCompleted !== isCompleted) {
        shouldHide = true;
      }

      // Aplicar visibilidad de la fila
      if (shouldHide) {
        row.classList.add('d-none');
      } else {
        row.classList.remove('d-none');
      }
    }
}


  addTodo(title, description, difficulty) {
    const todo = this.model.addTodo(title, description, difficulty);
    this.createRow(todo);
  }

  toggleCompleted(id) {
    this.model.toggleCompleted(id);
  }

  editTodo(id, values) {
    this.model.editTodo(id, values);
    const row = document.getElementById(id);
    row.children[0].innerText = values.title;
    row.children[1].innerText = values.description;
    row.children[2].innerHTML = `<span class="difficulty-level ${values.difficulty.toLowerCase()}">${values.difficulty}</span>`;
    row.children[3].children[0].checked = values.completed;
}


  removeTodo(id) {
    this.model.removeTodo(id);
    document.getElementById(id).remove();
  }

  createRow(todo) {
    const row = document.createElement('tr');
    row.setAttribute('id', todo.id);

    // Verificamos que 'difficulty' esté definido; si no, asignamos un valor predeterminado
    const difficulty = todo.difficulty ? todo.difficulty : 'Easy';

    // Define el contenido de cada celda en el orden correcto
    row.innerHTML = `
        <td>${todo.title}</td>
        <td>${todo.description}</td>
        <td class="text-center">
            <span class="difficulty-level ${difficulty.toLowerCase()}">${difficulty}</span>
        </td>
        <td class="text-center">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} />
        </td>
        <td class="text-right">
            <button class="btn btn-primary mb-1"><i class="fa fa-pencil"></i></button>
            <button class="btn btn-danger mb-1 ml-1"><i class="fa fa-trash"></i></button>
        </td>
    `;

    // Añadir el evento de toggle al checkbox
    const checkbox = row.children[3].querySelector('input[type="checkbox"]');
    checkbox.onclick = () => this.toggleCompleted(todo.id);

    // Configurar el botón de edición
    const editBtn = row.children[4].querySelector('.btn-primary');
    editBtn.setAttribute('data-toggle', 'modal');
    editBtn.setAttribute('data-target', '#modal');
    editBtn.onclick = () => this.modal.setValues({
        id: todo.id,
        title: row.children[0].innerText,
        description: row.children[1].innerText,
        completed: checkbox.checked,
    });

    // Configurar el botón de eliminación
    const removeBtn = row.children[4].querySelector('.btn-danger');
    removeBtn.onclick = () => this.removeTodo(todo.id);

    // Añadir la fila a la tabla
    this.table.querySelector('tbody').appendChild(row);
}

}
