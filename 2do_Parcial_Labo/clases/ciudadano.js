import { Persona } from './persona.js';

export class Ciudadano extends Persona {
    dni;

    constructor(nombre, apellido, fecha, dni) {
        super(nombre, apellido, fecha);
        this.dni = parseInt(dni);
    }

    // Metodos principales

    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.edad} ${this.compras} ${this.telefono}`;
    }

    toJson() {
        return JSON.stringify((this.id, this.nombre, this.apellido, this.edad, this.compras, this.telefono));
    }

    update(data) {
        super.update(data);
        this.dni = Number(data.dni);
    }
}
