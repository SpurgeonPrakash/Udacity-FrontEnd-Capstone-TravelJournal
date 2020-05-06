export async function addTrip(event) {
    event.preventDefault();
    const formItems = document.getElementById('travel-form').elements;
    console.log(formItems)

    if(formItems['duration'].value && formItems['destination'].value && formItems['departure'].value){
        getLocationDetails(formItems['destination'].value).then(resp => {
            console.log(resp);
        }).catch(err => {
            console.log(err);
        })
        // submitTravel(formItems).then(resp => {
        //     console.log(resp);
        // }).catch(err => {
        //     console.log('err',err);
        // })

    } else {

        Client.main.errorMessage.innerHTML = '<h3>Please fill all the required areas</h3>'
    }
}

const submitTravel = async ({duration, departure, destination, notes}) => {
    const data = {
        duration: duration.value,
        departure: departure.value,
        notes: notes.value,
        destination: destination.value
    }
    const response = await fetch('http://localhost:8081/addTrip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return await response.json();
}
//change env variables
const getLocationDetails = async (name) => {
    const response = await fetch('http://api.geonames.org/postalCodeLookupJSON?username=****&placename='+name);
    console.log(response);
    return await response.json();
}
