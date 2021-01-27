let json = ({"id":"287947","title":"Shazam! ","poster":"https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg","overview":"A boy is given the ability to become an adult superhero in times of need with a single magic word.","release_date":1553299200,"genres":["Action","Comedy","Fantasy"]});

let date = new Date(json.release_date * 1000)
//mise des millisecondes en secondes et 
let year = date.getYear()+1900
//création d'une date

console.log({id : json.id , title : json.title + year, poster : json.poster ,overview : json.overview ,release_date : json.release_date ,genres : json.genres});
//remise en forme json
