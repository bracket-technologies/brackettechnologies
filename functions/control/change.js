module.exports = ({ controls }) => {
    
    return [{
      event: `change:[getInput().id]?${controls}??getInput().id`
    }]
}