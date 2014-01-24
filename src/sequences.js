/*
 * Basic commands and sequences -- building blocks for other sequences.
 */

// Turn around. (Don't use 180; it (weirdly) alternates left vs. right.)
var aboutFace = [tw(90, 1500), tw(90, 1500)];
// Repeat this for smooth forward motion.
var cForward = dtw(-100, 0, 1500);
// Use this command after the last cForward (allow balancing)
var cStabilize = dtw(0,0,1300);

/*
 * Sample sequences
 */

var halfPatrol = [cForward, cForward, cForward, cStabilize].concat(aboutFace);
// A patrol loop (forward, turn around, forward, turn around)
var patrolLoop = [].concat(halfPatrol, halfPatrol);

/*
 * Experimental sequences -- not reliable.
 */

var pentangleSegment = [
  cForward, cForward, cStabilize, tw(72, 1700), tw(72, 1700)
];
var pentangle = [].concat(
  pentangleSegment, pentangleSegment, pentangleSegment,
  pentangleSegment, pentangleSegment
);

// Generate a weird stumbly sequence.
function mStumble(n) {
    var res = [];
    for (var i = 0; i <= n; i++) {
        var d = Math.random() * -75 - 25;
        var t = Math.random() * 180 - 90;
        var w = Math.random() * 400 + 100;
        res.push(dtw(d, t, w));
    }
    return res;
}

// Demo:
// doSequence(patrolLoop);
