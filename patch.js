function dtw(d, t, w) {
    return {type: "d", drive: d, turn: t, wait: w};
}

function tw(t, w) {
    return {type: "t", turn: t, wait: w};
}

function doSequence(seq, k) {
    var i = 0;
    function doNext() {
        if(i >= seq.length) {
            if(k) k();
            return;
        }
        var next = seq[i++];
        if (next.type === "d") {
            sendCommandWithData(kDRCommandControlDrive, {drive: next.drive, turn: next.turn});
            setTimeout(doNext, next.wait);
        }
        else if (next.type === "t") {
            sendCommandWithData(kDRCommandTurnBy, {degrees: next.turn, degreesWhileDriving: 0});
            setTimeout(doNext, next.wait);
        }
    }
    doNext();
}
