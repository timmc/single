/*
 * Movement primitives
 */

function dtw(d, t, w) {
    return {type: "d", drive: d, turn: t, wait: w};
}

function tw(t, w) {
    return {type: "t", turn: t, wait: w};
}

/*
 * Automation
 */

var noAutomation = false;

/** Stop processing automated commands. */
function stop() {
    noAutomation = true;
}

/** Allow automated commands again. */
function unstop() {
    noAutomation = false;
}

function doSequence(seq, k) {
    var i = 0;
    function doNext() {
        if(noAutomation || i >= seq.length) {
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

/*
 * Sequence builders
 */

function repeatSeq(seq, n) {
    var ret = [];
    for (var i = 0; i < n; i++) {
        ret = ret.concat(seq);
    }
    return ret;
}

// Drive for a total of total_w millis in chunks of at most chunk_w.
function driveTimed(d, t, total_w, chunk_w) {
    var ret = [], remain = total_w;
    while (remain > 0) {
        var w = Math.min(remain, chunk_w);
        ret.push(dtw(d, t, w));
        remain -= w;
    }
    return ret;
}

// Distance in feet, ratio to max speed
function driveDist(distance, ratio) {
    // Compute how many milliseconds we would have to travel at "light speed"
    // (maximum forward speed) to cover this distance.
    var lightMilliSeconds = distance * 400;
    var totalTime = Math.abs(lightMilliSeconds / ratio);
    var chunkTime = 1500 * ratio;
    var d = -100 * ratio;
    return driveTimed(d, 0, totalTime, chunkTime);
}
