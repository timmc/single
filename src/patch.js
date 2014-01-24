/*
 * Movement primitives
 */

// "drive" is -100 for full speed ahead, -200 is full speed backwards.
// Don't blame me, that's just the command language.

// I'm not entirely sure what "turn" does while driving. It may be
// more about the ratio in rotation rate between the wheels, or about
// the turning radius.

// In turn-only mode, "turn" behaves normally between -178 and 178
// (degrees CW and CCW respectively), but for values +/- 179 and 180
// will alternate direction. I have no idea why. Larger values seem to
// be ignored, although they used to just be cut off at 270-ish.

// "wait" is time in milliseconds before executing next command. It is
// not part of the Double's command language.

/**
 * Drive while turning. Effective max turn at drive=0 is ~75
 * degrees.
 */
function dtw(d, t, w) {
    return {type: "d", drive: d, turn: t, wait: w};
}

/**
 * Turn in place (can turn faster/farther than a dtw command.)
 */
function tw(t, w) {
    return {type: "t", turn: t, wait: w};
}

/*
 * Movement abstractions
 */

// The notion of "velocity" is an abstraction on top of the Double
// primitives. It ranges from 1 (full speed ahead) to -1 (full speed
// backwards).

/** Convert velocity to drive. */
function vToD(v) {
    return v * (v > 0 ? -100 : -200);
}

/** Convert drive to velocity. */
function dToV(d) {
    return d / (d > 0 ? -100 : -200);
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
