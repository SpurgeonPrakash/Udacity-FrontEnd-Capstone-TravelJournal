const flatpickr = require("flatpickr");
function init() {
    // Initialization of forms and buttons,
    const addButton = document.getElementById('addTrip');
    const formPanel = document.getElementById('form-content');
    const cancelButton = document.getElementById('cancel');
    const errorMessage = document.getElementById('errorMessage');
    const options = document.getElementById('options');
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

    return {addButton, formPanel, cancelButton, errorMessage, options, flatpickr}
}

module.exports = init();
