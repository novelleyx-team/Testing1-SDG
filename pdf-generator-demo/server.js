const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allows your frontend to communicate with this backend
app.use(express.json());

// Mocking the database query for this example. 
// In a real app, you would run a SQL "SELECT * FROM report_metrics" here.
const databaseMock = [
    { feature_name: 'Dynamic PDF Generation', status: 'Completed', rating: 5, notes: 'Rendering perfectly in browser' },
    { feature_name: 'Custom Letterhead', status: 'Completed', rating: 5, notes: 'Logo aligned to top right' },
    { feature_name: 'Data Analysis Engine', status: 'In Progress', rating: 3, notes: 'Processing large sets slowly' },
    { feature_name: 'User Authentication', status: 'Pending', rating: 1, notes: 'Awaiting security review' }
];

// The API endpoint your frontend will call
app.get('/api/report-data', (req, res) => {
    // Send the analyzed data back to the website
    res.json(databaseMock); 
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
