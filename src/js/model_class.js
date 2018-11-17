class Model {
    constructor(_line, _type, _name, _condition, _value)
    {
        this.line = _line;
        this.type = _type;
        this.name = _name;
        this.condition = _condition;
        this.value = _value;
    }
    get_tr_string(){
        return '<tr>' +
            '<td>'+this.line+'</td>' +
            '<td>'+this.type+'</td>' +
            '<td>'+this.name+'</td>' +
            '<td>'+this.condition+'</td>' +
            '<td>'+this.value+'</td>' +
            '</tr>';
    }

}

export {Model};
