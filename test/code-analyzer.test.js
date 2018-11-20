import assert from 'assert';
import {parseCode, viewCode} from '../src/js/code-analyzer';
import {Model} from '../src/js/model_class';

describe('Declarations',() => {
    it(': variableDeclarator ', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('let a = 1;'))),
            [new Model(1, 'variable declarator', 'a', '', 1)]);});
    it(':FunctionDeclaration', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('function b(x){}'))),
            [new Model(1, 'function declaration', 'b', '', ''),
                new Model(1, 'variable declaration', 'x', '', '')]);});
});
describe('Statements',() => {
    it(': ForStatement ', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('for(var i = 0; i < 5; i = i++)\n{x = x + 1;}'))),
            [new Model(1,'for statement','','i < 5',''),
                new Model(1,'variable declarator','i','',0),
                new Model(1,'assignment expression','i','','i++'),
                new Model(2,'assignment expression','x','','x + 1'),]);});
    it(': WhileStatement ', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('while(i < 10)\n{i = n-1}'))),
            [new Model(1,'while statement','','i < 10',''),
                new Model(2,'assignment expression','i','','n - 1')]);});
    it(': IfStatement ', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('if(i < 10)\n{i = i - 7}'))),
            [new Model(1,'if statement','','i < 10',''),
                new Model(2,'assignment expression','i','','i - 7')]);});
    it(': IfStatement followed by else ', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('if(i < 10)\n{i = i - 7}\nelse\n{i = i + 7}'))),
            [new Model(1,'if statement','','i < 10',''),
                new Model(2,'assignment expression','i','','i - 7'),
                new Model(4,'assignment expression','i','','i + 7')]);});
    it(': IfStatement and ElseIfStatement ', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('if(i < 10)\n{i = i - 7;}\nelse\nif(x > 10)\n{i = 10;}'))),
            [new Model(1,'if statement','','i < 10',''),
                new Model(2,'assignment expression','i','','i - 7'),
                new Model(4,'else if statement','','x > 10',''),
                new Model(5,'assignment expression','i','',10)]);});
    it(':FunctionDeclaration with ReturnStatement', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('function binarySearch(){\nreturn -1;}'))),
            [new Model(1, 'function declaration', 'binarySearch', '', ''),
                new Model(2, 'return statement', '', '', '-1')]);});
});
describe('Expressions',() => {
    it('ForStatement with UpdateExpression(prefix = false)', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('for(var i = 0; i < 5; i = i++)\n{x = x + 1;}'))),
            [new Model(1,'for statement','','i < 5',''), new Model(1,'variable declarator','i','',0), new Model(1,'assignment expression','i','','i++'), new Model(2,'assignment expression','x','','x + 1'),]);});
    it('ForStatement with UpdateExpression(prefix = true)', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('for(var i = 0; i < 5; i = ++i)\n{x = x + 1;}'))),
            [new Model(1,'for statement','','i < 5',''),
                new Model(1,'variable declarator','i','',0),
                new Model(1,'assignment expression','i','','++i'),
                new Model(2,'assignment expression','x','','x + 1'),]);});
    it('AssignmentExpression with MemberExpression', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('x = arr[x];'))),
            [new Model(1,'assignment expression','x','','arr[x]'),]);});
    it('ExpressionStatement', () => {
        assert.deepEqual(viewCode(JSON.stringify(parseCode('let low;\n\n\nlow = 0;'))),
            [new Model(1,'variable declarator','low','',null),
                new Model(4,'assignment expression','low','',0)]);});
});
describe('Model',() => {
    let model_for_test = new Model(1,'for statement','','i < 5','');
    it('get_tr_string', () => {
        assert.equal(model_for_test.get_tr_string(),
            '<tr><td>1</td><td>for statement</td><td></td><td>i < 5</td><td></td></tr>');});
});

