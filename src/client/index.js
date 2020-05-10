import './styles/main.scss'
import './styles/content.scss'
import '../../node_modules/flatpickr/dist/flatpickr.css'
import * as main from './js/app';
import {addTrip, getLocationDetails, placeTrips} from './js/formHandler';


export {
    main,
    addTrip,
    getLocationDetails,
    placeTrips
}
