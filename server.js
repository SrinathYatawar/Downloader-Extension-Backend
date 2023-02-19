const express=require('express');
const app=express();
const cors=require('cors')
const Http=require('http').createServer(app);
const Port = process.env.PORT || 4000 ;

Http.listen(Port);
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({origin:true}));


const fs=require('fs');

const http=require('http');

const https=require('https');

const path=require('path');

const url=require('url')


app.use(express.json({
    type: ['application/json', 'text/plain']
  }))




app.post('/photos/api',function(req,response){
        const URL=req.body.url;

       const parsedUrl = url.parse(URL);

       const protocol = parsedUrl.protocol === 'https:' ? https : http;

          var Extension='file';

       function getExtension(URLs){
     /*    // Get the last part of the path (after the last / character)
        const path = URLs.substring(URLs.lastIndexOf('/') + 1);
        // Get the file extension (after the last . character)
        Extension = (path.substring(path.lastIndexOf('.') + 1)).substring(0,3); */

       Extension=(URLs.includes('.jpg'))?'jpg':
       (URLs.includes('.mp4'))?'mp4':
       URLs.includes('.jpeg')?'jpeg':
       URLs.includes('.png')?'png':
       URLs.includes('.mp3')?'mp3':
       URLs.includes('.gif')?'gif':'mkv'

      }
      getExtension(URL);
    
     // console.log(Extension);
       
protocol
  .get(URL, res => {
    // Open file in local filesystem
    // Generate a 10-digit random number
const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;

    const file = fs.createWriteStream(`${randomNum}.${Extension}`);

    // Write data into local file
    res.pipe(file)

    // Close the file
    file.on('finish', () => {

      //code to make file to download to local file system
        


            if(!response.headersSent)  response.json({FileName_photo:`${randomNum}.${Extension}`,Status:'SuccessFully Downloaded'});


            app.get(`/${randomNum}.${Extension}`, (req, res) => {

              const filePath = `${__dirname}/${randomNum}.${Extension}` // replace with your desired file path
    
             // console.log(filePath)
             
    
              res.download(filePath, `${randomNum}.${Extension}`, (err) => {
    
                if (err) {
    
                  console.error(err);
    
                  res.status(500).send('Server Error');
    
                }
                else{       
    
            fs.unlink(`${randomNum}.${Extension}`, (err) => {
    
              if (err) {
    
                return;
              }
            })
                }
              })
            })

      file.close()



        setInterval(()=>{
          fs.unlink(`${randomNum}.${Extension}`, (err) => {
    
            if (err) {
  
              return;
            }
          })

    file.close();

        },30000)



    })
  })
  .on('error', err => {
    response.json({Status:'Cannot Download This File'});
  })

})



/* 

#######################################################################
#                                                                     #
#                                                                     # 
#                    INSTAGRAM PROCESS BEEGIN                         #
#                                                                     #
#                                                                     #
#######################################################################
 
*/












const puppeteer = require('puppeteer');

const request = require('request');


app.post('/insta/api',function(req,response){
     
  const URL=req.body.url;

    
(async () => {
  // Launch Puppeteer and create a new page
  const browser = await puppeteer.launch();

  const page = await browser.newPage();


  await page.setViewport({ width: 1280, height: 800 });

  // Navigate to the Instagram reel
  await page.goto(`${URL}`).catch(error=>
    {
      (response.json({Status:"Please Connect To Internet/Wrong URL"}))

             return;
  });
    
  var File_Type;

  var File_Type_Ext;

  if(URL.includes('https://www.instagram.com/reel/')){

  // Wait for the reel to load
  await page.waitForSelector('div.x1lliihq.x5yr21d.xh8yej3 video',{timeout:8000}).catch(err=>{
    
    if(!response.headersSent)response.json({Status:"Too Long To Respond"})
    
    return;
  });


  File_Type = await page.evaluate(() => {

    return document.querySelector('video').src;

  }).catch(err=>{
    if(!response.headersSent)response.json({Status:"Unable To Fetch Video"})
    return;
  });
   
    File_Type_Ext='mp4';
    
  }

  else if('https://www.instagram.com/p/'){

await page.waitForFunction(

  selector => document.querySelector(selector) && document.querySelector(selector).getAttribute('src') !== '',
  {},
  'div._aagu._aato div._aagv img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3',{timeout:8000}
).catch(err=>{
  if(!response.headersSent)response.json({Status:"Too Long To Respond"})
  return;
});

const element = await page.$('div._aagu._aato div._aagv img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3').catch(err=>{
  if(!response.headersSent)response.json({Status:"Too Long To Respond"})
  return;
});

File_Type = await element.evaluate(el => el.getAttribute('src')).catch(err=>{

  if(!response.headersSent)response.json({Status:"Unable To Fetch Image"})

  return;
});

     File_Type_Ext='jpg';

  }

  else{

    if(!response.headersSent)response.json({Status:"Incorrect  URL"})

  }


  const randomNum = Math.floor(Math.random() * 900000000000) + 100000000000;

  const fileStream = fs.createWriteStream(`${randomNum}.${File_Type_Ext}`);
   
     
   if(File_Type!==undefined){

  request(File_Type).pipe(fileStream)
    
       fileStream.on('finish',()=>{

        if(!response.headersSent)  response.json({Status: 'Successfully Download',FileName:`${randomNum}.${File_Type_Ext}`});
        
               
        app.get(`/${randomNum}.${File_Type_Ext}`, (req, res) => {

          const filePath = `${__dirname}/${randomNum}.${File_Type_Ext}` // replace with your desired file path

         // console.log(filePath)

          res.download(filePath, `${randomNum}.${File_Type_Ext}`, (err) => {

            if (err) {

              console.error(err);

              res.status(500).send('Server Error');

            }else{       

        fs.unlink(`${randomNum}.${File_Type_Ext}`, (err) => {

          if (err) {

            return;
          }
        })
            }
          });
        })
  
        fileStream.close();
       })

      }
      else{

         setTimeout(() => {

          fs.promises.unlink(`${__dirname}/${randomNum}.${File_Type_Ext}`)

          .catch((err) => {

            console.error(err);

          });

          fileStream.close()

        }, 2000);
        
      }

  // Close the browser
  await browser.close();

})();




})


