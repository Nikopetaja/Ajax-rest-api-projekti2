// Fetch train stations from Digitraffic API
fetch('https://rata.digitraffic.fi/api/v1/metadata/stations')
    .then(response => response.json())
    .then(data => {
        const stationSelect = document.getElementById('station');
        data.forEach(station => {
            const option = document.createElement('option');
            option.value = station.stationShortCode;
            option.textContent = station.stationName;
            stationSelect.appendChild(option);
        });
    });

// Function to search for timetable data based on the selected station
function searchTimetable() {
    const selectedStation = document.getElementById('station').value;
    // Construct API endpoint URL based on the selected station
    const apiUrl = `https://rata.digitraffic.fi/api/v1/live-trains/station/${selectedStation}`;

    // Fetch timetable data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Display timetable data on the webpage
            displayTimetable(data);
        })
        .catch(error => {
            console.error('Error fetching timetable data:', error);
        });
}

// Function to display timetable data
function displayTimetable(data) {
    const timetableDiv = document.getElementById('timetable');
    // Clear previous timetable data
    timetableDiv.innerHTML = '';

    // Loop through the data and display relevant information
    data.forEach(train => {
        const trainInfo = document.createElement('div');
        trainInfo.textContent = `Train ${train.trainNumber} - ${train.trainType}`;

        // Display departure and arrival times
        const departureTime = train.timeTableRows.find(row => row.type === 'DEPARTURE');
        const arrivalTime = train.timeTableRows.find(row => row.type === 'ARRIVAL');
        if (departureTime && arrivalTime) {
            trainInfo.textContent += `, Departure: ${departureTime.scheduledTime}, Arrival: ${arrivalTime.scheduledTime}`;
        } else {
            trainInfo.textContent += ', Timetable information not available';
        }

        timetableDiv.appendChild(trainInfo);
    });
}
