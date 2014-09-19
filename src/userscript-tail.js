function runAsUserscript() {

function splitFirst(s, sep) {
    if (s == null) {
        return [];
    }
    var first = s.indexOf(sep);
    if (first === -1) {
        return [s];
    } else {
        return [s.substring(0, first), s.substring(first + sep.length)];
    }
}

// Would work if unsafeWindow was provided by Chrome:
// dumpApiIntoWindow(unsafeWindow);

// Alternatively:
// unsafeWindow.Single = Single;

// Because Chrome doesn't give us unsafeWindow, and TamperMonkey won't
// install, we have to do this mind-numbingly stupid thing:

/*
 * For JSON.stringify, serialize fns as strings, but give both a prefix.
 */
function apiReplacer(k, v) {
    if (typeof v === 'function') {
        return 'Function|' + v.toString();
    } else if (typeof v === 'string') {
        return 'String|' + v;
    } else {
        return v;
    }
}

function apiReviver(k, v) {
    if (typeof v === 'string') {
        var parts = splitFirst(v, '|');
        if (parts[0] === 'Function') {
            // parens make expression, not statement
            window.e = parts[1];
            return eval('(' + parts[1] + ')');
        } else if (parts[0] === 'String') {
            return parts[1];
        } else {
            throw new Error("Unrecognized type: " + parts[0])
        }
    } else {
        return v;
    }
}

var inline = '(function() { \n\
$splitFirst \n\
\n\
$apiReviver \n\
\n\
var api = JSON.parse(JSON.stringify($api), apiReviver); \n\
var examples = JSON.parse(JSON.stringify($examples), apiReviver); \n\
\n\
$hasOwnProperty \n\
\n\
$extendObject \n\
\n\
function dumpApiIntoWindow() { \n\
    extendObject(window, api); \n\
    extendObject(window, examples); \n\
} \n\
setTimeout(dumpApiIntoWindow, 1000); //XXX \n\
// Only mutate once copied into window. \n\
//window.Single = api; \n\
//window.Single.examples = examples; \n\
})()';

var replacements = {
    splitFirst: splitFirst.toString(),
    apiReviver: apiReviver.toString(),
    api: JSON.stringify(basicApi, apiReplacer),
    examples: JSON.stringify(sequenceExamples, apiReplacer),
    hasOwnProperty: hasOwnProperty.toString(),
    extendObject: extendObject.toString()
};

for(k in replacements) {
    if(!hasOwnProperty(replacements, k)) continue;
    inline = inline.replace('\$' + k, replacements[k]);
}

var script = document.createElement('script');
script.appendChild(document.createTextNode(inline));
unsafeWindow.console.log(inline, script);
var target = document.body || document.head || document.documentElement;
target.appendChild(script);

} // runAsUserscript

if (typeof unsafeWindow !== 'undefined' && !runAsUserscript.run) {
    runAsUserscript();
    runAsUserscript.run = true;
}
