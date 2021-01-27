fs=require('fs')
//Retire les deux premiers arguments qui sont toujours les mêmes
let myArgs = process.argv.slice(2);
//Si on retrouve un argument -action:
if (myArgs[0] === '-action'){
  //Checking de l'argument suivant '-action'
  switch (myArgs[1]){
    //Tri par date croissante
    case 'sort_date':
      console.log('Tri par date');
      //Stockage des input/output (strings) 
      input_dir = myArgs[2];
      output_dir = myArgs[3];
      console.log("Fichier d'input: " + input_dir);
      console.log("Fichier d'output: " + output_dir);
      //Lancer fonction tri date
      sort_date(input_dir,output_dir);
      let stop = new Date().getTime();
      console.log("Temps éxécuté : " + (stop - start) + " ms")
      break;

    case 'sort_title': 
      console.log('Tri par titre');
      //Stockage des input/output (strings) 
      input_dir = myArgs[2];
      output_dir = myArgs[3];
      console.log("Fichier d'input: " + input_dir);
      console.log("Dossier d'output: " + output_dir);
      //Lancer fonction tri titre
      sort_title(input_dir,output_dir);
      let stop1 = new Date().getTime();
      console.log("Temps éxécuté : " + (stop1 - start) + " ms")
      break;

    case 'search_date':
      console.log('Recherche de film par année de production');
      //Stockage des input utilisateurs
      input_dir=myArgs[2];
      year=myArgs[3];
      sorted=myArgs[4];
      //Fonction tri/affichage nom des films de l'année <year>
      search_date(input_dir,year,sorted)
      let stop2 = new Date().getTime();
      console.log("Temps éxécuté : " + (stop2 - start) + " ms")
      break;

    case 'search_key_word':
      console.log('Recherche du film le plus récent dans un genre donné avec un mot clé');
      //Stockage des input utilisateurs
      input_dir = myArgs[2];
      keyword=myArgs[3];
      genre=myArgs[4];
      //Fonction affichage du filme le plus récent, dans un genre donné, avec un mot clé spécifique
      search_key_word(input_dir,keyword,genre)
      break;

    //Dans le cas où il y a une erreur d'argument  
    default:
      let stop3 = new Date().getTime();
      console.log("Temps éxécuté : " + (stop3 - start) + " ms")
      console.log("Je n'ai pas compris..")
  }
}

//Fonction lecture du fichier + écriture: film triés par date croissante
function sort_date(input,output_dir){
  //Lecture du fichier 'input'
  fs.readFile(input, (err, data) => {
    if (err) throw err;
    //Stock des données dans tab
    let tab = (JSON.parse(data));
    //Tri des données
    tri_date(tab,0,tab.length-1);
    //Ecriture du fichier 'output' avec les films trié par date croissante
    fs.writeFile(output_dir,JSON.stringify(tab,null,'\t'),function(err) {
      if(err) return console.error(err);
      console.log('Fichier trié par date créé.');
      })
  });
}

//Fonction tri films par date croissante
function tri_date(tab,first,last){
  //Si premier < dernier
  if (first<last){
    let pivot = Math.floor((first+last)/2)
    pivot = part_date(tab,first,last,pivot)
    tri_date(tab,first,pivot-1)
    tri_date(tab,pivot+1,last)
  }
}

function part_date(tab,first,last,pivot){
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

//Fonction lecture du fichier + écriture: film triés par ordre alphabétique
function sort_title(input,output_dir){
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
function search_date(input,year,sorted){
  //Lecture du fichier 'input'
  fs.readFile(input, (err, data) => {
    if (err) throw err;
    //Stock des données dans tab
    let tab = (JSON.parse(data));
    //Vérification de la valeur "true/false" de sorted
    if(sorted === 'true'){
      console.log('true');
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
        }
      }
    }
    else{
      //Case erreur sorted
      console.log('error in sorted value');
    }
  });
}
//Fonction lecture du fichier + affichage console: titre du film le plus récent + genre + mot clé
function search_key_word(input,keyword,genre){
  //Lecture du fichier 'input'
  fs.readFile(input, (err, data) => {
    if (err) throw err;
    //Stock des données dans tab
    let tab = (JSON.parse(data));
    //Vérification de la valeur
    for(i=0;i<tab.length;i++){
      if(tab[i].genres){
        if((tab[i].genres).includes(genre)){
          if(tab[i]){

          }
        }
      }
    }
});
}

//Fonction swap qui échange de place deux élément d'un tableau
function swap(tab,a,b){
  let temp = tab[a];
  tab[a]=tab[b];
  tab[b]=temp;
}
