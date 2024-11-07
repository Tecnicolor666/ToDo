import Alert from './alert.js';

export default class Modal {
  constructor() {
    this.title = document.getElementById('modal-title');
    this.description = document.getElementById('modal-description');
    this.completed = document.getElementById('modal-completed');
    this.difficulty = document.getElementById('modal-difficulty'); // Campo de dificultad en el modal
    this.btn = document.getElementById('modal-btn');
    this.alert = new Alert('modal-alert');
    this.todo = null;
  }

  setValues(todo) {
    this.todo = todo;
    this.title.value = todo.title;
    this.description.value = todo.description;
    this.completed.checked = todo.completed;
    this.difficulty.value = todo.difficulty; // Configuramos el valor de dificultad
  }

  onClick(callback) {
    this.btn.onclick = () => {
      if (!this.title.value || !this.description.value) {
        this.alert.show('Title and description are required');
        return;
      }

      $('#modal').modal('toggle');

      // Pasamos la dificultad junto con los otros valores al callback
      callback(this.todo.id, {
        title: this.title.value,
        description: this.description.value,
        completed: this.completed.checked,
        difficulty: this.difficulty.value
      });
    };
  }
}
