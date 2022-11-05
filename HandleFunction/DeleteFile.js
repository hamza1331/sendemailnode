const fs = require('fs')
async function deleteFile(fileName){
 if(fileName!==undefined){
    
         return fs.unlink(__dirname + '/../../techfinderfiles/' + fileName,(error)=>{
            if(error){
                console.log('error->',error)
            }
            return{
                message:"Success"
            }
        })
    } 
 else{
    return{
        message:"Failed",
        error:"File can not be null"
    }
 }
}
module.exports = deleteFile