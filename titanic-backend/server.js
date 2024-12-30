const express = require('express'); //Build web servers to handle HTTP requests
const cors = require('cors'); //Manage cross-origin HTTP requests between backend and frontend
const mongoose = require('mongoose'); //Database used is MongoDB
const axios = require('axios'); //Use to interact with external APIs, send HTTP requests to servers
const csv = require('csv-parser'); //Parse and process CSV files
const fs = require('fs');

const app = express();
const PORT = 5000;
// Mongo Atlas URI to connect to the Cloud Database 
const MONGO_URI = 'mongodb+srv://nblim2018:01AmeB7wwFkCwzLk@titanic.nfh0l.mongodb.net/?retryWrites=true&w=majority&appName=Titanic';

app.use(cors());
app.use(express.json());

//Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

const PassengerSchema = new mongoose.Schema({
    PassengerId: Number,
    Survived: Number,
    Pclass: Number,
    Name: String,
    Sex: String,
    Age: Number,
    SibSp: Number,
    Parch: Number,
    Ticket: String,
    Fare: Number,
    Cabin: String,
    Embarked: String
});

const Passenger = mongoose.model('Passenger', PassengerSchema);

//API to fetch CSV data from GitHub
app.get('/api/fetch-data', async (req, res) => {
    try {
        // Delete all existing passengers before importing new data
        await Passenger.deleteMany({});
        
        //The Kaggle link does not allow extraction of csv file directly and require authentication to access the dataset. 
        //You need to log in to Kaggle, and then use either their web interface or the Kaggle API (with an API token) to download the dataset.
        //The Github link directly points to a raw CSV file hosted on GitHub. You can access it via a simple HTTP GET request without any need for authentication or API keys. 
        const response = await axios.get('https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv', { responseType: 'stream' });

        const results = [];
        response.data.pipe(csv())
        .on('data', (data) => {
            // Adjust the data structure before inserting it into MongoDB
            const passengerData = {
                PassengerId: Number(data.PassengerId),
                Survived: Number(data.Survived),
                Pclass: Number(data.Pclass),
                Name: data.Name,
                Sex: data.Sex,
                Age: data.Age ? Number(data.Age) : null, // Ensure Age is a number or null
                SibSp: Number(data.SibSp),
                Parch: Number(data.Parch),
                Ticket: data.Ticket,
                Fare: Number(data.Fare),
                Cabin: data.Cabin || '', // Handle empty Cabin fields
                Embarked: data.Embarked
            };
            results.push(passengerData);
        })
        .on('end', async () => {
            try {
                // Insert data into MongoDB
                if (results.length > 0) {
                    await Passenger.insertMany(results);
                    res.status(200).json({ message: 'Data Imported Successfully!' });
                } else {
                    res.status(400).json({ message: 'No data to import.' });
                }
            } catch (error) {
                console.error('Error inserting data into MongoDB:', error);
                res.status(500).json({ message: 'Error inserting data into MongoDB.' });
            }
        });
    } catch (error) {
        console.error('Error fetching data from URL:', error);
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

// API to get all passengers 
app.get('/api/passengers', async(req, res) => {
    try {
        const passengers = await Passenger.find();
        res.status(200).json(passengers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving passengers.' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));