const { readdirSync } = require('fs');
request = require('request')
fs=require('fs')
Jimp=require('jimp')
ColorThief = require('color-thief-jimp');
let start = new Date().getTime();
//Retire les deux premiers arguments qui sont toujours les mêmes
let myArgs = process.argv.slice(2);
let save_path;
//Si on retrouve -save en premier argument
if (myArgs[0] === '-save'){
  //On récupère le path pour sauvegarder les images
  save_path = myArgs[1]
  //On supprime les deux arguments pour pouvoir lancer le "menu switch"
  myArgs = myArgs.slice(2)
  //switch_menu
  switch_menu(save_path);
}
else{
  //switch_menu avec un "save_path" undefined, les fonctions de téléchargeront donc pas les poster
  switch_menu(save_path)
}
//Fonction qui va appeler d'autres fonctions en fonction des arguments
function switch_menu(save_path) {
  if (myArgs[0] === '-action')
    //Checking de l'argument suivant '-action'
    switch (myArgs[1]) {
      //Tri par date croissante
      case 'transform':
        console.log('Tri par date');
        //Stockage des input/output (strings) 
        input_dir = myArgs[2];
        output_dir = myArgs[3];
        console.log("Fichier d'input: " + input_dir);
        console.log("Dossier d'output: " + output_dir);
        //Lancer fonction tri date
        date(input_dir, output_dir,start);
        break;

      //Tri par date croissante
      case 'sort_date':
        console.log('Tri par date');
        //Stockage des input/output (strings) 
        input_dir = myArgs[2];
        output_dir = myArgs[3];
        console.log("Fichier d'input: " + input_dir);
        console.log("Dossier d'output: " + output_dir);
        //Lancer fonction tri date
        sort_date(input_dir, output_dir,start);
        break;

      case 'sort_title':
        console.log('Tri par titre');
        //Stockage des input/output (strings) 
        input_dir = myArgs[2];
        output_dir = myArgs[3];
        console.log("Fichier d'input: " + input_dir);
        console.log("Dossier d'output: " + output_dir);
        //Lancer fonction tri titre
        sort_title(input_dir, output_dir,start);
        break;

      case 'search_date':
        console.log('Recherche de film par année de production');
        //Stockage des input/output
        input_dir = myArgs[2];
        year = myArgs[3];
        sorted = myArgs[4];
        //Fonction tri/affichage nom des films de l'année <year>
        search_date(input_dir, year, sorted, save_path,start);
        break;

      case 'search_key_word':
        console.log('Recherche du film le plus récent, genre: [' + myArgs[4] + '] et qui comporte le mot clé [' + myArgs[3] + ']');
        //Stockage des input/output
        input_dir = myArgs[2];
        keyword = myArgs[3];
        genre = myArgs[4];
        //Fonction tri/affichage nom des films de l'année <year>
        search_key_word(input_dir, keyword, genre, save_path,start);
        break;

      case 'color':
        //Dossier des images
        path_dir = myArgs[2];
        color_read(path_dir,start);
        break;

      //Dans le cas où il y a une erreur d'argument  
      default:
        console.log("Je n'ai pas compris..");
    }
}

//fonction pour mettre la date après le titre
function date(input,output_dir,start){
  //Lecture du fichier 'input'
  fs.readFile(input, (err, data) => {
    if (err) throw err;
    //Stock des données dans tab
    let tab = (JSON.parse(data));
    //boucle pour extraction des éléments du tableau et mise des dates
    for(i=0; i<tab.length; i++) {
      let date = new Date(tab[i].release_date * 1000).getFullYear();
      tab[i].title = tab[i].title + " ("+ date +")"
    }
    //Ecriture du fichier 'output' avec les dates après le titre
    fs.writeFile(output_dir,JSON.stringify(tab,null,'\t'),function(err) {
      if(err) return console.error(err);
      console.log('Fichier avec date créé.');
      let stop = new Date().getTime();
      console.log("Algorithme exécuté en: " + (stop - start) + " ms");
      })
  });

}
//Fonction lecture du fichier + écriture: film triés par date croissante
function sort_date(input,output_dir){
  //Lecture du fichier 'input'
  fs.readFile(input, (err, data) => {
    if (err) throw err;
    //Stock des données dans tab
    let tab = (JSON.parse(data));
    //Tri des données
    tri_date_ASC(tab,0,tab.length-1);
    //Ecriture du fichier 'output' avec les films trié par date croissante
    fs.writeFile(output_dir,JSON.stringify(tab,null,'\t'),function(err) {
      if(err) return console.error(err);
      console.log('Fichier trié par date créé.');
      let stop = new Date().getTime();
      console.log("Algorithme exécuté en: " + (stop - start) + " ms");
      })
  });
}

//Fonction tri films par date croissante
function tri_date_ASC(tab,first,last){
  //Si premier < dernier
  if (first<last){
    let pivot = Math.floor((first+last)/2)
    pivot = part_date_ASC(tab,first,last,pivot)
    tri_date_ASC(tab,first,pivot-1)
    tri_date_ASC(tab,pivot+1,last)
  }
}
//Fonctio de tri film par date croissante
function part_date_ASC(tab,first,last,pivot){
  //Echanger tab[pivot] avec tab[last]
  swap(tab,pivot,last)
  //j premier élément
  j = first;
  //Exploration du tableau
  for (i=first;i<=last-1;i++){
    //Tri croissant ici
    if (tab[i].release_date <tab[last].release_date){
      //Echange tab[i] et tab[last] pour respecter l'ordre croissant
      swap(tab,i,j);
      j=j+1;
    }
  }
  //Pour échanger tab[last] et tab[j]
  swap(tab,last,j)
  //Renvoie j
  return j
}
//Fonction tri films par date décroissante
function tri_date_DESC(tab,first,last){
  //Si premier < dernier
  if (first<last){
    let pivot = Math.floor((first+last)/2)
    pivot = part_date_DESC(tab,first,last,pivot)
    tri_date_DESC(tab,first,pivot-1)
    tri_date_DESC(tab,pivot+1,last)
  }
}
//Fonction tri films par date décroissante
function part_date_DESC(tab,first,last,pivot){
  //Echanger tab[pivot] avec tab[last]
  swap(tab,pivot,last)
  //j premier élément
  j = first;
  //Exploration du tableau
  for (i=first;i<=last-1;i++){
    //Tri croissant ici
    if (tab[i].release_date > tab[last].release_date){
      //Echange tab[i] et tab[last] pour respecter l'ordre décroissant
      swap(tab,i,j);
      j=j+1;
    }
  }
  //Pour échanger tab[last] et tab[j]
  swap(tab,last,j)
  //Renvoie j
  return j
}

//Fonction lecture du fichier + écriture: film triés par ordre alphabétique
function sort_title(input,output_dir,start){
  //Lecture du fichier 'input'
  fs.readFile(input, (err, data) => {
    if (err) throw err;
    //Stock des données dans tab
    let tab = (JSON.parse(data));
    //Tri des données
    tri_title(tab,0,tab.length-1)
    //Ecriture du fichier 'output' avec les films trié par ordre alphabétique
    fs.writeFile(output_dir,JSON.stringify(tab,null,'\t'),function(err) {
      if(err) return console.error(err);
      console.log('Fichier trié par ordre alphabétique (titres) créé.');
      let stop = new Date().getTime();
      console.log("Algorithme exécuté en: " + (stop - start) + " ms");
      })
  });
}

//Fonction tri titre de films par ordre alphabétique
function tri_title(tab,first,last){
  //Si premier < dernier
  if (first<last){
    let pivot = Math.floor((first+last)/2)
    pivot = part_title(tab,first,last,pivot)
    tri_title(tab,first,pivot-1)
    tri_title(tab,pivot+1,last)
  }
}
//Fonction tri titre de films par ordre alphabétique
function part_title(tab,first,last,pivot){
  //Echanger tab[pivot] avec tab[last]
  swap(tab,pivot,last)
  //j premier élément
  j = first;
  //Exploration du tableau
  for (i=first;i<=last-1;i++){
    //Tri croissant ici
    if (tab[i].title <tab[last].title){
      //Echange tab[i] et tab[last] pour respecter l'ordre croissant
      swap(tab,i,j);
      j=j+1;
    }
  }
  //Pour échanger tab[last] et tab[j]
  swap(tab,last,j)
  //Renvoie j
  return j
}

//Fonction lecture du fichier + affichage console: titre des film triés selon une année précise
function search_date(input,year,sorted,save_path,start){
  //Lecture du fichier 'input'
  fs.readFile(input, (err, data) => {
    if (err) throw err;
    //Stock des données dans tab
    let tab = (JSON.parse(data));
    //Vérification de la valeur "true/false" de sorted
    if(sorted === 'true'){
      //utilisation de "tri_title" afin de trier les titres dans l'ordre alphabétique
      tri_title(tab,0,tab.length-1)
      for(i=0;i<tab.length;i++){
        //Extraction de l'année de parution pour chaque film à l'aide d'une boucle for
        date = new Date(tab[i].release_date * 1000)
        date_year = date.getFullYear();
        //Si l'année du film correspond à la demande utilisateur
        if(date_year == year){
          //Afficher le titre de celui-ci (+année)
          console.log(tab[i].title + ' ('+year+')');
          //Si "-save path" a été appelé
          if(save_path){
            //Téléchargement des poster des films triés
            const download = (url, path, callback) => {
              request.head(url, (err, res, body) => {
                request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
              })
            }
            const url = tab[i].poster
            const path = save_path+'poster_'+tab[i].id+'.png'
            download(url, path, () => {
            })
            console.log('Download of '+tab[i].title+' poster done!')
          }
        }
      }
      let stop = new Date().getTime();
      console.log("Algorithme exécuté en: " + (stop - start) + " ms");    
    }
    else if(sorted === 'false'){
      for(i=0;i<tab.length;i++){
        //Extraction de l'année de parution pour chaque film à l'aide d'une boucle for
        date = new Date(tab[i].release_date * 1000)
        date_year = date.getFullYear();
        //Si l'année du film correspond à la demande utilisateur
        if(date_year == year){
          //Afficher le titre de celui-ci (+année)
          console.log(tab[i].title + ' ('+year+')');
          //Si "-save path" a été appelé
          if(save_path){
            //Téléchargement des poster des films triés
            const download = (url, path, callback) => {
              request.head(url, (err, res, body) => {
                request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
              })
            }
            const url = tab[i].poster
            const path = save_path+'poster_'+tab[i].id+'_'+date_year+'.png'
            download(url, path, () => {
            })
            console.log('Download of '+tab[i].title+' poster done!')
          }
        }
      }
      let stop = new Date().getTime();
      console.log("Algorithme exécuté en: " + (stop - start) + " ms");    
    }
    else{
      //Case erreur sorted
      console.log('error in sorted value');
    }
  });
}
//Fonction lecture du fichier + affichage console: titre du film le plus récent + genre + mot clé
function search_key_word(input,keyword,genre,save_path,start){
  //Lecture du fichier 'input'
  fs.readFile(input, (err, data) => {
    if (err) throw err;
    //Stock des données dans tab
    let tab = (JSON.parse(data));
    let keywordTab =[];
    //Vérification de la valeur
    for(i=0;i<tab.length;i++){
      if(tab[i].genres){
        if((tab[i].genres).includes(genre)){
          desc = tab[i].overview.split(" ");
          if(desc.includes(keyword)){
            // console.log(tab[i].title);
            keywordTab[i] = tab[i];
          }
        }
      }
    }
    //Filtering := supprime tous les éléments vides du tableau
    let filtered = keywordTab.filter(function(){
      return true;
    })
    //Fonction de tri par date croissante
    tri_date_DESC(filtered,0,filtered.length-1);
    let rec = new Date(filtered[0].release_date*1000)
    //Affichage du titre + date + description du film trié
    console.log(filtered[0].title+" ("+rec+"). Description: "+filtered[0].overview);
    //Si "-save path" a été appelé
    if(save_path){
      //Téléchargement du poster du film trié
      const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
          request(url)
          .pipe(fs.createWriteStream(path))
          .on('close', callback)
        })
      }
      const url = filtered[0].poster
      const path = save_path+'poster_'+filtered[0].title+'.png'
      download(url, path, () => {
        console.log('Download of poster done!')
      })
    }
    let stop = new Date().getTime();
    console.log("Algorithme exécuté en: " + (stop - start) + " ms");
});
}

//Fonction swap qui échange de place deux élément d'un tableau
function swap(tab,a,b){
  let temp = tab[a];
  tab[a]=tab[b];
  tab[b]=temp;
}

//Fonction pour afficher la couleur moyenne de tous les fichiers d'un dossier d'images
function color_read(path,start){
  color_avg = [0,0,0];  //Init array 0 0 0 (couleurs rgb)
  files = readdirSync(path);  //Lecture du dossier
  let promises = [];  //Array de promise
  files.forEach(file =>{  //Pour chaque fichier du dossier
    let promise = Jimp.read(path+file); //Stocking des promise(Jimp.read)
    promises.push(promise) 
  });
    Promise.all(promises)
    .then((images) =>{
      images.forEach(image => {
          var dominantColor = ColorThief.getColor(image);
          // dominantColor = [intRed, intGreen, intBlue]
          color_avg[0] += dominantColor[0];   //
          color_avg[1] += dominantColor[1];   //avg en additionnant les valeurs
          color_avg[2] += dominantColor[2];   //
      })
      color_avg[0] = Math.floor(color_avg[0] / files.length);   //Moyenne de chaque teinte de couleur
      color_avg[1] = Math.floor(color_avg[1] / files.length);   // avg(r) puis g puis b
      color_avg[2] = Math.floor(color_avg[2] / files.length);   //
        
      avg_color_folder = RGBToHex(color_avg[0],color_avg[1],color_avg[2]) //Fonction pour convertir le RGB en #Hex (css-style)
        
      console.log('La couleur dominante du dossier est: '+avg_color_folder); //Affichage #HEX
      console.log('Code RGB: {R:'+color_avg[0]+' G:'+color_avg[1]+' B:'+color_avg[2]+'}'); //Affichage R G B
      let stop6 = new Date().getTime();
      console.log("Algorithme exécuté en: " + (stop6 - start) + " ms");
  });
}
//Conversion en Hex en fonction de RGB moyen du dossier
function RGBToHex(r,g,b){ 
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  if(r.length == 1){r = '0'+r;}
  if(g.length == 1){g = '0'+g;}
  if(b.length == 1){b = '0'+b;}
  return ('#'+r+g+b)
}