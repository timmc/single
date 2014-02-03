/*
 * Library of movement commands as functions that can either be bound
 * to the same object or run in the window context. See the basicApi
 * var at the end for a public API.
 */

function initAutomation() {
    this.noAutomation = false;
}

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

/** Stop processing automated commands. */
function stop() {
    this.noAutomation = true;
}

/** Allow automated commands again. */
function unstop() {
    this.noAutomation = false;
}

function doSequence(seq, k) {
    var i = 0;
    function doNext() {
        if(this.noAutomation || i >= seq.length) {
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

/**
 * Drive at velocity v for a total of total_w millis with turn rate t.
 */
function driveTimed(v, t, total_w) {
    var ret = [], remain = total_w;
    var chunk_w = 250; // About as long as the command lasts.
    var d = vToD(v);
    while (remain > 0) {
        var w = Math.min(remain, chunk_w);
        ret.push(dtw(d, t, w));
        remain -= w;
    }
    return ret;
}

/**
 * Drive dist feet at velocity v with turn t. (Turn is not
 * well-defined, and may change meaning in the future. Use at own
 * risk.)
 */
function driveDist(dist, v, t) {
    if (v === 0) {
        return [];
    }
    // Compute how many milliseconds we would have to travel at "light speed"
    // (maximum forward speed) to cover this distance.
    var lightMilliSeconds = dist * 400;
    var totalTime = Math.abs(lightMilliSeconds / v);
    // TODO: Account for time to start/stop?
    return driveTimed(v, t, totalTime);
}

/**
 * Turn by the specified degrees.
 */
function turnBy(degrees) {
    var ret = [];
    // Adjust for overeagerness. (Based on 90° turns.)
    degrees = degrees / 1.07;
    var dir = degrees === 0 ? 0 : Math.abs(degrees) / degrees;
    var remainAbs = degrees === 0 ? 0 : degrees / dir;
    while (remainAbs > 0) {
        // We can't use 180; it (weirdly) alternates left vs. right.
        var turn = Math.min(90, remainAbs);
        ret.push(tw(turn * dir, 17 * turn));
        remainAbs -= turn;
    }
    return ret;
}

/** Just wait this any milliseconds before the next action. */
function wait(w) {
    return [dtw(0, 0, w)];
}

var basicApi = {
    init:initAutomation,
    dtw:dtw,
    tw:tw,
    vToD:vToD,
    dToV:dToV,
    stop:stop,
    unstop:unstop,
    doSequence:doSequence,
    repeatSeq:repeatSeq,
    driveTimed:driveTimed,
    driveDist:driveDist,
    turnBy:turnBy,
    wait:wait
};
