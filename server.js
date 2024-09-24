const express = require('express');
const bodyParser = require('body-parser');
const ocrRoutes = require('./src/routes/ocrRoutes');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// API routes
app.use('/api', ocrRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
