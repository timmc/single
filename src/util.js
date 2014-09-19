/*== Basic utilities ==*/

function hasOwnProperty(o, k) {
    return ({}).hasOwnProperty.call(o, k);
}

function extendObject(target, more) {
    for(k in more) {
        if (!hasOwnProperty(more, k)) {
            continue;
        }
        target[k] = more[k];
    }
    return target;
}
