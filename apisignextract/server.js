require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line
const apiRoutes = require('./src/router/apiRoutes')
const path = require('path');

const app = express();
app.use(cors()); // Add this line to enable CORS for all routes
const PORT = process.env.PORT || 5500;
app.use(express.json())
app.use(apiRoutes)

// Serve extracted_data directory as static files
app.use('/extracted_data', express.static('extracted_data'));

app.get('/',(req,res)=>{
    res.send("hello from express js")
})
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`)) 