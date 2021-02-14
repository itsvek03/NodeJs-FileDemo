//libraries
const http =require('http');
const fs = require('fs');
const { dirname } = require('path');
const url = require('url')

//port number
 port =3200;

 
 //Reading the files
let tempCard= fs.readFileSync(__dirname+"/template/cardmaster.html","utf-8");
let tempOverview= fs.readFileSync(__dirname+"/template/overview.html","utf-8");
let tempProduct= fs.readFileSync(__dirname+"/template/product.html","utf-8");

//Data Reading 
let newobj= fs.readFileSync(__dirname+"/datafile/data.json","utf-8");
let dataobj = JSON.parse(newobj);


//Replacing value with static data
const replaceTemplate =(temp,product) =>{

    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
     output = output.replace(/{%IMAGE%}/g,product.image);
     output = output.replace(/{%PRICE%}/g,product.price);
     output = output.replace(/{%FROM%}/g,product.from);
     output = output.replace(/{%PRODUCTNUTRIENTSNAME%}/g,product.nutrients);
     output = output.replace(/{%QUANTITY%}/g,product.quantity);
     output = output.replace(/{%DESCRIPTION%}/g,product.description);
     output = output.replace(/{%ID%}/g,product.id);
     if(!product.organic){
        output = output.replace(/{%NOTORANGIC%}/g,'not_organic');
     }
     return output;
}



//Read File from file and write into a srever
const app = http.createServer((req,res) =>{
   
    const {query,pathname} =url.parse(req.url,true);
    //OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{"content-type":"text.html"});
        let cardshtml =dataobj.map(e1 =>  replaceTemplate(tempCard,e1)).join('');
        const cardmaster=tempOverview.replace('{%PRODUCTCARD%}',cardshtml)
        res.write(cardmaster);
    }


    //PRODUCT PAGE
    else if(pathname === '/product'){
        res.writeHead(200,{"content-type":"text.html"});
        const product =dataobj[query.id]
        const output=replaceTemplate(tempProduct,product);
        res.write(output);
        res.end();
        
    } 

    //API
    else if(pathname === '/API'){
        res.writeHead(200,{"content-type":"application/json"});
        res.write(newobj);          
    }
    
    //ERROR Page
    else{
        res.writeHead(404,{
            "content-type":"text/html",

        });
        res.end('<h1>Error page not found</h1>');
    }
});

app.listen(port,() =>{console.log('Port running')})

//console.log(__dirname);