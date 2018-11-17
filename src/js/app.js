import $ from 'jquery';
import {parseCode, viewCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let listModels = viewCode(JSON.stringify(parsedCode));
        $('#parsedView').empty();
        let html_table_trs = '';
        for(let i = 0; i < listModels.length; i++)
        {
            html_table_trs = html_table_trs +listModels[i].get_tr_string();
        }
        $('#parsedView').append('<table class="w3-class"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody>' + html_table_trs +'</tbody></table>');

    });
});
