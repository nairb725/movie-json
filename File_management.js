let json = ({"id":"287947","title":"Shazam! ","poster":"https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg","overview":"A boy is given the ability to become an adult superhero in times of need with a single magic word.","release_date":1553299200,"genres":["Action","Comedy","Fantasy"]});
console.log(json);


let date = new Date(json.release_date * 1000)
console.log(date);

let year = date.getYear()+1900
console.log(year);






console.log({id : json.id , title : json.title + year, poster : json.poster ,overview : json.overview ,release_date : json.release_date ,genres : json.genres});



console.log(process.argv)
