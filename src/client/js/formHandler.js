let timer;

export async function addTrip(event) {
    event.preventDefault();
    const formItems = document.getElementById('travel-form').elements;
    console.log(formItems);
    const locations = document.getElementsByName('zipCode');
    let selectedLocation;
    for(let i=0;i<locations.length;i++){
        if(locations[i].checked){
            selectedLocation = locations[i].value.split(',');
        }
    }

    console.log(selectedLocation);

    if(formItems['duration'].value && formItems['destination'].value && formItems['departure'].value && selectedLocation){

        const data = {
            duration: formItems['duration'].value,
            departure: formItems['departure'].value,
            notes: formItems['notes'].value,
            destination: {
                placename: selectedLocation[2],
                coordinates: [selectedLocation[0], selectedLocation[1]]
            }
        }

        submitTravel(data).then(resp => {
            console.log(resp);
        }).catch(err => {
            console.log('err',err);
        })

    } else {

        Client.main.errorMessage.innerHTML = '<h3>Please fill all the required areas</h3>'
    }
}

const submitTravel = async (data) => {

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
export const getLocationDetails = async (name) => {

    clearTimeout(timer);
    Client.main.errorMessage.textContent = '';

    timer = setTimeout(async ()=>{
        const response = await fetch('http://api.geonames.org/postalCodeLookupJSON?username=***&placename='+name);
        console.log(response);
        let results = await response.json();

        Client.main.options.innerHTML = '';
        let createView = document.createDocumentFragment();
        if(results.postalcodes.length == 0){
            Client.main.errorMessage.textContent = 'Place you entered was not found, please try a real world place'
        }

        for(let i=0; i<results.postalcodes.length; i++){
            let group = document.createElement('div');
            group.className = 'group';
            let option = document.createElement('input');
            let label = document.createElement('label');
            label.textContent = `${results.postalcodes[i].placeName} - ${results.postalcodes[i].postalcode}`;
            option.type = 'radio';
            option.name = 'zipCode';
            if(i===0){option.checked = true}
            option.value = `${results.postalcodes[i].lat},${results.postalcodes[i].lng},${results.postalcodes[i].placeName}`;
            group.addEventListener('click', function () {
                const input = this.getElementsByTagName('input')[0];
                input.checked = true;
            });
            group.appendChild(option)
            group.appendChild(label)
            createView.appendChild(group);
            if(i === 3){break;}
        }


        Client.main.options.appendChild(createView);

    }, 500);
}


