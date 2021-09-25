const path = require('path')
const fs = require('fs');
// const { runInThisContext } = require('vm');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        //El init lee este archivo y establece estas propiedades 
        this.init();
    };

    get toJson() { // El get lo hace como si fuese una propiedad de la clase al metodo, se puede usar como this.toJSON()
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    };

    init() {
        //Lee la data del archivo json y la pasa a un objeto
        const { hoy, ultimo, ultimos4, tickets } = require('../db/data.json');
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            this.guardarDB();
        }
    };

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson))
    };

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);
        this.guardarDB();
        return ticket.numero;
    };

    ultimo() {
        const ultimo = this.tickets[this.tickets.length-1].numero
        console.log(ultimo)
        return ultimo;
    };

    atenderTickets(escritorio) {
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); //Funcion shift extrae el ultimo elemento y lo retorna
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket);// Añade un elemento al primer lugar de mi arreglo
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1,1);//Remueve un elemento de un arreglo empezando al contrario osea (-1) desde la primera posicion (1).
        }

        this.guardarDB();
        return ticket;
    };
}

module.exports = TicketControl;