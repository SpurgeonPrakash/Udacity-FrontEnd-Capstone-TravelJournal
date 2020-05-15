const flatpickr = require("flatpickr");

function init() {
    // Initialization of forms and buttons,
    const addButton = document.getElementById('addTrip');
    const formPanel = document.getElementById('form-content');
    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');
    const errorMessage = document.getElementById('errorMessage');
    const options = document.getElementById('options');
    const tripPanel = document.getElementById('tripPanel');
    flatpickr('#departure',{
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    })


    addButton.addEventListener('click', ()=>{
        formPanel.style.display = 'block';
    })
    cancelButton.addEventListener('click', (event)=>{
        event.preventDefault();
        formPanel.style.display = 'none';
    })


    getTrips().then(res => {
        Client.placeTrips(res);
    })

    return {
        addButton,
        formPanel,
        cancelButton,
        errorMessage,
        options,
        flatpickr,
        tripPanel,
        saveButton}
}

const getTrips = async () => {
    try {
        const trips = await fetch('http://localhost:8081/getTrips');
        const parsed = await trips.json();
        return parsed;
    } catch (e) {
        console.log('girdi')
        Client.placeTrips(JSON.parse(localStorage.getItem('trips')));
    }



}

module.exports = init();

