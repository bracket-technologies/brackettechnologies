module.exports = ({ id }) => {
    
    var input_id = window.value[id].type === 'Input' ? id : `${id}-input`
    return [{
        "event": `input:${input_id}?():${input_id}.data()=():${input_id}.element.value().toPrice().else().0;():${input_id}.element.value=():${input_id}.data().else().0`
    }]
}