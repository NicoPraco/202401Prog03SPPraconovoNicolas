import { Persona } from './persona.js';

export class Extranjero extends Persona {
    paisOrigen;

    constructor(nombre, apellido, fecha, paisOrigen) {
        super(nombre, apellido, fecha);

        this.paisOrigen = paisOrigen;
    }

    // Metodos principales

    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.edad} ${this.sueldo} ${this.ventas}`;
    }

    toJson() {
        return JSON.stringify((this.id, this.nombre, this.apellido, this.edad, this.sueldo, this.ventas));
    }

    update(data) {
        super.update(data);
        this.paisOrigen = data.paisOrigen;
    }
}
