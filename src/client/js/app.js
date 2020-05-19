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
    const form = document.getElementById('travel-form')
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
        form.reset();
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
        saveButton
    }
}

const getTrips = async () => {
    try {
        const trips = await fetch('http://localhost:8081/getTrips');
        return await trips.json();
    } catch (e) {
        Client.placeTrips(JSON.parse(localStorage.getItem('trips')));
    }
}

module.exports = init();

