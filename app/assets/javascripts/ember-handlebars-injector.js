/* jshint undef: true, unused: true, debug:true */
/* globals console:false, md5:false */
(function() {
    var patchers = {};
    var finder = '';
    var DEBUG = false;
    var re = new RegExp("(.*)\\[(\\d+)\\]$", "g");

    function _find_in_tree(parts, statements) {
        var query = parts.shift(),
            count = 0,
            antiMatches = {"if-else": "if", "each-else": "each"},
            inverse = false,
            found;
        if (query.match(re)){
            var splitted = query.split(re);
            query = splitted[1];
            count = parseInt(splitted[2]);
        }

        if (query.length === 0) { // can be the case after split
            found = [statements[count], statements, count];
        } else {
            if (antiMatches[query]){
                query = antiMatches[query];
                inverse = true;
            }
            for (var idx=0; idx < statements.length; idx ++) {
                var entry = statements[idx];
                if (entry.mustache && entry.mustache.id.string === query) {
                    if (inverse && !entry.inverse)
                        continue;
                    if (count === 0){
                        found = [entry, statements, idx];
                        break;
                    }
                    count -= 1;
                }
            }
        }

        if (found && parts.length){
            return _find_in_tree(parts, inverse ? found[0].inverse.statements : found[0].program.statements);
        }
        if (!found && DEBUG)
            debugger;
        return found;
    }

    function _find_ast_part(query, statements){
        if (typeof (query) === "string") query = query.split(" ");
        return _find_in_tree(query, statements);
    }


    var originalParse = Handlebars.parse;
    var Patcher = function(){};
    Patcher.prototype = {
        parse: function(string){
            var ast = originalParse(string),
                hash = md5(string);
            if (DEBUG && finder.length && string.indexOf(finder) !== -1)
                    console.log("Finder found in " + hash + "\n", string);
            if (patchers[hash]){
                for(var i=0; i < patchers[hash].length; i++ ) {
                    try {
                        var res = patchers[hash][i](ast, hash, string);
                        if (res){
                            ast = res;
                        }
                    } catch (e) {
                        window.console && console.warn(e);
                    }
                }
            }
            return ast;
        },
        addGeneralPatcher: function(hashes, cb){
            if (typeof hashes === "string") hashes = [hashes];
            for (var i=0;i < hashes.length; i++) {
                var hash = hashes[i];
                if (!patchers[hash]) patchers[hash] = [cb];
                else patchers[hash].push(cb);
            }
        },
        setFinder: function(exp){
            finder = exp;
        },
        setDebug: function(val){
            DEBUG = val;
        },
        insertAt: function(ast, pos, tmpl, options){
            var shift = (options && options.shift) || 0;
            if (typeof (tmpl) === "string") {
                tmpl = Handlebars.parse(tmpl);
            }
            var target_statements = ast.statements;
            if (typeof(pos) === "string") {
                var target = _find_ast_part(pos, target_statements);
                if (target) {
                    target_statements = target[1];
                    pos = target[2] + 1 + shift;
                } else {
                    throw "Sorry can't find " + pos + "in" + ast;
                }
            }
            for (var idx=0; idx < tmpl.statements.length; idx++){
                target_statements.insertAt(pos + idx, tmpl.statements[idx]);
            }
            if (options && options.replace){
                target_statements.splice(pos-1, 1);
            }
        },
        replaceWith: function(ast, pos, tmpl){
            return this.insertAt(ast, pos, tmpl, {replace: true});
        }
    };
    window.TemplatePatcher = new Patcher();
    Handlebars.parse = window.TemplatePatcher.parse;
})();