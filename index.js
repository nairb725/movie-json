fs=require('fs')

fs.readFile('movies.json', (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data));
  });


