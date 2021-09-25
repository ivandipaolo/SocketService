const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerHTML = `Ultimo ticket ${ultimo}`;
})

btnCrear.addEventListener('click', async () => {
    socket.emit('siguiente-ticket', null, (ticket) => {
        lblNuevoTicket.innerHTML = `Siguiente ticket ${ticket + 1}`
    });
});

console.log('Nuevo Ticket HTML');