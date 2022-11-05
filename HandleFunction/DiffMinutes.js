function diff_minutes(dt1) 
 {
  var diff = Math.abs(new Date() - new Date(dt1));
  return Math.floor((diff/1000)/60);
  
 }
 module.exports = diff_minutes