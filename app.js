const express = require('express');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// Configuration for connecting to Azure SQL Database
const config = {
  user: 'teste',
  password: 'Secret123',
  server: 'starfield.database.windows.net',
  database: 'starfield',
  options: {
    encrypt: true, // For security, set to true for Azure
  },
};

// Route to fetch and display data
app.get('/', async (req, res) => {
  try {
    // Connect to the Azure SQL Database
    await sql.connect(config);
    
    // Query the "item" table
    const result = await sql.query`SELECT name, value, weight FROM item`;
    
    // Render a web page with the retrieved data
    res.send(`
      <h1>Items</h1>
      <ul>
        ${result.recordset.map(item => `<li>${item.name} - Value: ${item.value}, Weight: ${item.weight}</li>`).join('')}
      </ul>
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the SQL connection
    await sql.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
