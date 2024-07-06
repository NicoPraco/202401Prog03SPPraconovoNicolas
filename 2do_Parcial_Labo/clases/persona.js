export class Persona {
    id;
    nombre;
    apellido;
    fechaNacimiento;

    constructor(id, nombre, apellido, fechaNacimiento) {
        this.id = parseInt(id);
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = parseInt(fechaNacimiento);
    }

    // Metodos principales

    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.edad}`;
    }

    toJson() {
        return JSON.stringify((this.id, this.nombre, this.apellido, this.edad));
    }

    update(data) {
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.fechaNacimiento = Number(data.fechaNacimiento);
    }
}
