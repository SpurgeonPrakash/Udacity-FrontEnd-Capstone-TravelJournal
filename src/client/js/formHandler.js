let timer;
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export async function addTrip(event) {
    event.preventDefault();
    const form = document.getElementById('travel-form');
    const formItems = form.elements;
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
                locationName: formItems['destination'].value,
                coordinates: [selectedLocation[0], selectedLocation[1]],
                countryCode: selectedLocation[3]
            }
        }

        submitTravel(data).then(resp => {
            placeTrips(resp.data);
            form.reset();
            Client.main.cancelButton.click();
            Client.main.options.innerHTML = '';
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
export const getLocationDetails = async (name, details) => {

    clearTimeout(timer);
    Client.main.errorMessage.textContent = '';
    Client.main.saveButton.disabled = false;
    timer = setTimeout(async ()=>{
        const response = await fetch(`http://localhost:8081/getLocationDetails/${name}/${details ? true : false}`);

        let results = await response.json();
        console.log(results);
        Client.main.options.innerHTML = '';
        let createView = document.createDocumentFragment();
        if(results.length == 0){
            Client.main.errorMessage.textContent = 'Place you entered was not found, please try a real world place';
            Client.main.saveButton.disabled = true;
        }

        for(let i=0; i<results.length; i++){
            let group = document.createElement('div');
            group.className = 'group';
            let option = document.createElement('input');
            let label = document.createElement('label');
            label.textContent = `${results[i].adminName1} / ${results[i].adminName2} - ${results[i].postalcode}`;
            option.type = 'radio';
            option.name = 'zipCode';
            if(i===0){option.checked = true}
            option.value = `${results[i].lat},${results[i].lng},${results[i].placeName},${results[i].countryCode}`;
            group.addEventListener('click', function () {
                const input = this.getElementsByTagName('input')[0];
                input.checked = true;
            });
            group.appendChild(option)
            group.appendChild(label)
            createView.appendChild(group);
        }


        Client.main.options.appendChild(createView);

    }, 500);
}

export const placeTrips = (trips) => {
    const panel = document.createDocumentFragment();
    trips.forEach(trip => {
        console.log(trip);
        let tripItem = document.createElement('div');
        tripItem.className = 'tripItem';
        tripItem.id = trip.id;

        let header = document.createElement('div');
        header.style.gridArea = 'b'
        header.innerHTML = `<h3>${trip.destination.locationName.toUpperCase()}</h3>`
        handleWeather(trip, tripItem);
        let content = document.createElement('div');
        content.style.gridArea = 'c';
        let duration = document.createElement('p');
        duration.textContent = `Duration: ${trip.duration} Days.`
        let departure = document.createElement('p');
        const until = dateDiffInDays(new Date(), new Date(trip.departure));
        departure.textContent = until > 0 ? `Departure: ${trip.departure} - ${until} Days left` : `Departure: Was on  ${trip.departure} (Past trip)`

        let notes = document.createElement('article');
        notes.textContent = trip.notes;

        let imageHolder = document.createElement('div');
        imageHolder.className = 'tripImg';
        let img = document.createElement('img');
        img.src = trip.tripImg.webformatURL;
        img.alt = trip.destination.locationName;
        imageHolder.appendChild(img);

        let deleteButton = document.createElement('button');
        deleteButton.textContent = "delete";
        deleteButton.addEventListener('click', () => {
            deleteTrip(trip.id);
        })

        content.appendChild(duration);
        content.appendChild(departure);
        content.appendChild(notes);

        tripItem.appendChild(header);
        tripItem.appendChild(deleteButton);
        tripItem.appendChild(content);
        tripItem.appendChild(imageHolder);
        panel.appendChild(tripItem);
    })
    Client.main.tripPanel.innerHTML = '';
    Client.main.tripPanel.appendChild(panel);
}

const handleWeather = async (trip, view) => {
    const weatherView = document.createElement('div');
    const curr = document.createElement('div');

    curr.innerHTML = `<h4>Current Weather</h4>${trip.weather.data[0].temp} C`;
    weatherView.className = 'tripWeather';
    const currImg = document.createElement('img');
    currImg.src = `https://www.weatherbit.io/static/img/icons/${trip.weather.data[0].weather.icon}.png`;
    currImg.alt = trip.weather.data[0].weather.description;

    curr.appendChild(currImg);
    weatherView.appendChild(curr);
    for(let i=0;i<trip.weather.data.length;i++){
        if(trip.departure === trip.weather.data[i].datetime){
            let forecasted = document.createElement('div');
            forecasted.innerHTML = `<h4>Forecasted Weather on ${trip.weather.data[i].datetime}</h4>${trip.weather.data[i].temp} C`;
            let forecastedImg = document.createElement('img');
            forecastedImg.src = `https://www.weatherbit.io/static/img/icons/${trip.weather.data[0].weather.icon}.png`;
            forecastedImg.alt = trip.weather.data[0].weather.description;
            forecasted.appendChild(forecastedImg)
            weatherView.appendChild(forecasted);
        }
    }

    view.appendChild(weatherView);
}

export const deleteTrip = async (id) => {
    if(id) {
        const response = await fetch('http://localhost:8081/deleteTrip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id})
        })
        const data = await response.json();
        placeTrips(data.data);
    }
}
