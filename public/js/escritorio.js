//HTML refs
//queryselector = primer h1 q encuentre.
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblUltimoTicket = document.querySelector('small');
const lblPendientes = document.querySelector('#lblPendientes');
const alerta = document.querySelector('.alert')

const searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio.')
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerHTML = escritorio;

alerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('cola-tickets', (pendientes) => {
    pendientes !== 0 ? 
    lblPendientes.innerText = pendientes :
    lblPendientes.style.display = 'none'
})

btnAtender.addEventListener('click', () => {
    //Se desestructura el payload con lo que enviamos del socket.on(atender ticket)
    socket.emit('atender-ticket', {escritorio}, ({ok, ticket, msg}) => {
    if (!ok){
        return alerta.style.display = '';
    }
    lblUltimoTicket.innerText = `Ticket ${ticket.numero}`;
    })
})