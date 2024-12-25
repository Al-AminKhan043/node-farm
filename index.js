
const { text } = require('express');
const fs=require('fs');
const http=require('http');
const { dirname } = require('path');
const url= require('url');
const slugify= require('slugify');


//files
//blocking , synchronous way

// const textIn=fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut= `This is what we know about avocado ${textIn}.\n created on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log("file written");


//non-blocking, asynchronous way

// fs.readFile('./starter/txt/start.txt', 'utf-8',(err,data1)=>{
    
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8',(err,data2)=>{
    
//         console.log(data2);
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8',(err,data3)=>{
    
//             console.log(data3);

//              fs.writeFile('./starter/txt/final.txt',`${data2} \n ${data3}` ,'utf-8',err=>{
//                console.log("your file has been written");
//              })

            
//             })
        
//         })

// })
// console.log('will read file');

//server

const replaceTemplate= (temp, product)=>{
    let output= temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output= output.replace(/{%IMAGE%}/g, product.image);
    output= output.replace(/{%PRICE%}/g, product.price);
    output= output.replace(/{%FROM%}/g, product.from);
    output= output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output= output.replace(/{%QUANTITY%}/g, product.quantity);
    output= output.replace(/{%DESCRIPTION%}/g, product.description);
    output= output.replace(/{%ID%}/g, product.id);

  if(! product.organic) output= output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    
return output;
}


const tempOverview= fs.readFileSync(`${__dirname}/starter/templates/overview.html`, 'utf-8')
const tempCard= fs.readFileSync(`${__dirname}/starter/templates/card.html`, 'utf-8')
const tempProduct= fs.readFileSync(`${__dirname}/starter/templates/product.html`, 'utf-8')
 const data= fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8')
 const dataObj= JSON.parse(data);

 const server= http.createServer((req,res)=>{
   

    const {query, pathname}=(url.parse(req.url, true))



//overview page

if(  pathname=== '/overview'){
    res.writeHead(200,{
        'Content-type': 'text/html'
     })
 const cardsHtml=dataObj.map((e)=> replaceTemplate(tempCard, e) ).join('');
  const output= tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);

    res.end(output);
}


//product page

else if(pathname=== '/product'){
    res.writeHead(200,{
        'Content-type': 'text/html'
     })
 const product= dataObj[query.id];
 const output= replaceTemplate(tempProduct,product);
res.end(output);
}

// api


else if(pathname==='/api'){
   


 res.writeHead(200,{
    'Content-type': 'application/json'
 })
 res.end(data);

   
}  

// not found

else {
    res.writeHead(404,{
        'Content-type':'text/html'
    });
    res.end('<h1>Page not found</h1>');
}
   
});
const port = process.env.PORT || 8000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});