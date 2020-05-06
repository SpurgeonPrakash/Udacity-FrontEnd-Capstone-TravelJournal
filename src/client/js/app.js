function init() {
    // Initialization of forms and buttons,
    const addButton = document.getElementById('addTrip');
    const formPanel = document.getElementById('form-content');
    const cancelButton = document.getElementById('cancel');
    const errorMessage = document.getElementById('errorMessage')


    addButton.addEventListener('click', ()=>{
        formPanel.style.display = 'block';
    })
    cancelButton.addEventListener('click', (event)=>{
        event.preventDefault();
        formPanel.style.display = 'none';
    })

    return {addButton, formPanel, cancelButton, errorMessage}
}

module.exports = init();
