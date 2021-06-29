/**
 * Entry point of the webserver
 */

// Requirement to read files
const path = require('path')
const fs = require('fs')

// Express framework
const express = require('express')
const http = require('http')
const app = express()

// Will reload the webpage when a file change
const reload = require('reload')

// Import Swagger UI and its config, It will generate the HTML page
const swaggerUi = require('swagger-ui-express');
var options = require('./swagger-ui-config');

// Extract the @yaml content generated by yaml.js, needed by Swagger UI
const yaml = require('./yaml')

// Use YAML module to parse the @yaml content into @swaggerDocument
const YAML = require('yamljs');
const swaggerDocument = YAML.parse(yaml);

// Route /api, serve by swagger-ui, it is the HTML generated from @swaggerDocument
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Route /swagger is static, it is needed for the HTML generated content
app.use('/swagger', express.static(path.join(__dirname, '../swagger')))

// Create the server with the settings
const server = http.createServer(app)

// The server.listen method is wrapped into the reload module
// This will allow it to reload the page when files change
reload(app).then(function (reloadReturned) {
  server.listen(3000, function () {
    process.stdout.write('Listening http://localhost:3000/api\n')
    reloadReturned.reload()
  })

// Something goes wrong when reload try to start the server
}).catch(function (err) {
  console.error('Reload could not start the server', err)
})