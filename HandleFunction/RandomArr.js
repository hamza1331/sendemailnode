function randomArray(unshuffled){
    let newArrr =  unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    return newArrr
  }

  module.exports = randomArray