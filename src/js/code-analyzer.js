/* eslint-disable no-console */
import * as esprima from 'esprima';
import * as escodegen  from 'escodegen';
import {Model} from './model_class';

let list_model;

let dic_function = {
    'Literal': parse_literal ,
    'Identifier': parse_identifier ,
    'BinaryExpression': parse_binary_exp ,
    'UnaryExpression': parse_unary_exp ,
    'VariableDeclarator': parse_variable_declarator ,
    'ReturnStatement': parse_return_stmt ,
    'MemberExpression': parse_member_exp ,
    'ExpressionStatement': parse_exp_stmt ,
    'AssignmentExpression': parse_assign_exp ,
    'UpdateExpression': parse_update_exp,
    'FunctionDeclaration': parse_func_decl ,
    'VariableDeclaration': parse_variable_declaration ,
    'BlockStatement': parse_block_stmt ,
    'IfStatement': parse_if_stmt ,
    'WhileStatement': parse_while_stmt,
    'ForStatement': parse_for_stmt,
    'Program': parse_program
};

let dic_types = {
    'VariableDeclarator': 'variable declarator' ,
    'ReturnStatement': 'return statement' ,
    'AssignmentExpression': 'assignment expression' ,
    'UpdateExpression': 'update expression',
    'FunctionDeclaration': 'function declaration' ,
    'VariableDeclaration': 'variable declaration' ,
    'IfStatement': 'if statement' ,
    'WhileStatement': 'while statement',
    'ForStatement': 'for statement',
}


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true});
};

function parse_literal(json_object) {
    let ans =  json_object.value;
    return ans;
}
function parse_identifier(json_object) {
    let ans = json_object.name;
    return ans;
}
function parse_binary_exp(json_object) {
    let ans = escodegen.generate(json_object);
    return ans;
}
function parse_unary_exp(json_object) {
    let ans = escodegen.generate(json_object);
    return ans;
}
function parse_member_exp(json_object) {
    let ans = escodegen.generate(json_object);
    return ans;
}
function parse_update_exp(json_object) {
    let ans = escodegen.generate(json_object);
    return ans;

}
function parse_assign_exp(json_object) {
    let curr_model = new Model(json_object.loc.start.line, dic_types[json_object.type], get_details(json_object.left),'',  get_details(json_object.right) );
    list_model.push(curr_model);
}
function parse_exp_stmt(json_object) {
    let ans = get_details(json_object.expression);
    return ans;
}
function parse_return_stmt(json_object) {
    let curr_model = new Model(json_object.loc.start.line, dic_types[json_object.type],'','',get_details(json_object.argument));
    list_model.push(curr_model);
}
function parse_block_stmt(json_object) {
    for (let i = 0; i < json_object.body.length; i++) {
        get_details(json_object.body[i]);
    }
}
function parse_if_stmt(json_object, inside_else_stmt) {
    let operator = json_object.test.operator;
    let left = get_details(json_object.test.left);
    let right = get_details(json_object.test.right);
    let condition = left + ' ' + operator + ' ' + right;
    let type = dic_types[json_object.type];
    if(inside_else_stmt) type = 'else if statement';
    let curr_model = new Model(json_object.loc.start.line,type,'',condition,'');
    list_model.push(curr_model);
    get_details(json_object.consequent);
    if(json_object.alternate && json_object.alternate.type  === json_object.type) parse_if_stmt(json_object.alternate, true );
    else get_details(json_object.alternate);
}
function parse_while_stmt(json_object) {
    let condition = get_details(json_object.test.left) + ' ' + json_object.test.operator + ' ' + get_details(json_object.test.right);
    let curr_model = new Model(json_object.loc.start.line, dic_types[json_object.type],'',condition,'');
    list_model.push(curr_model);
    get_details(json_object.body);
}
function parse_for_stmt(json_object) {
    let condition = get_details(json_object.test);
    let curr_model = new Model(json_object.loc.start.line, dic_types[json_object.type],'',condition,'');
    list_model.push(curr_model);
    get_details(json_object.init);
    get_details(json_object.update);
    get_details(json_object.body);
}
function parse_variable_declarator(json_object) {
    let curr_model = new Model(json_object.loc.start.line,dic_types[json_object.type], get_details(json_object.id),'',get_details(json_object.init));
    list_model.push(curr_model);
}
function parse_func_decl(json_object) {
    let curr_model = new Model(json_object.loc.start.line, dic_types[json_object.type], get_details(json_object.id) ,'','');
    list_model.push(curr_model);
    for (let i = 0; i < json_object.params.length; i++) {
        curr_model = new Model(json_object.params[i].loc.start.line, 'variable declaration', get_details(json_object.params[i]), '', '');
        list_model.push(curr_model);
    }
    get_details(json_object.body);
}
function parse_variable_declaration(json_object) {
    for (let i = 0; i < json_object.declarations.length; i++) {
        get_details(json_object.declarations[i]);
    }
}
function parse_program(json_object) {
    for (let i = 0; i < json_object.body.length; i++) {
        get_details(json_object.body[i]);
    }
}

function get_details(json_object) {
    if (json_object == null){
        return json_object;
    }
    let type = json_object.type;
    return dic_function[type](json_object);
}

const viewCode = (parsedCode) => {
    list_model = [];
    let json_object = JSON.parse(parsedCode);
    console.log(json_object.type);
    get_details(json_object);
    return list_model;
};



export {parseCode, viewCode};
