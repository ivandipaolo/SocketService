const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    //Se hace un broadcast del emit para que repercute en todas las pantallas
    
    
    socket.on('siguiente-ticket', (payload, callback) => {
        const next = ticketControl.siguiente();
        callback(next);
        socket.broadcast.emit('cola-tickets', ticketControl.tickets.length);
    })
    
    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return ({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        };
        const ticket = ticketControl.atenderTickets(escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

        socket.emit('cola-tickets', ticketControl.tickets.length);
        socket.broadcast.emit('cola-tickets', ticketControl.tickets.length);

        if (!ticket) {
            return ({
                ok: false,
                msg: 'Ya no hay mas tickets pendientes'
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    })
};



module.exports = {
    socketController
}

