export default class Filters {
  constructor() {
    this.form = document.getElementById('filters');
    this.difficultyFilter = document.getElementById('difficulty-filter'); // Nuevo filtro de dificultad
  }

  onClick(callback) {
    this.form.onsubmit = (e) => {
      e.preventDefault();
      const type = this.form.type.value;
      const words = this.form.words.value.trim().toLowerCase();
      const difficulty = this.difficultyFilter.value; // Capturamos el valor de dificultad

      // Pasamos todos los filtros al callback
      callback({ type, words, difficulty });
    }
  }
}
