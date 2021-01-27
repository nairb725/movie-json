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
      console.log("Dossier d'output: " + output_dir);
      //Lancer fonction tri date
      sort_date(input_dir,output_dir);
      break;

    //Dans le cas où il y a une erreur d'argument  
    default:
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
    pivot = partitionner(tab,first,last,pivot)
    tri_date(tab,first,pivot-1)
    tri_date(tab,pivot+1,last)
  }
}

function partitionner(tab,first,last,pivot){
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

//Fonction swap qui échange de place deux élément d'un tableau
function swap(tab,a,b){
  let temp = tab[a];
  tab[a]=tab[b];
  tab[b]=temp;
}
