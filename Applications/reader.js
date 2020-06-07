const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('/home/pi/Downloads/data.csv')
  .pipe(csv({separator: ';', skipLines: 5}))
  .on('data', (row) => {
    console.log(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
