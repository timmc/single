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

/** Generate a random wander with n segments. */
function mWander(n) {
    var res = [];
    for (var i = 0; i <= n; i++) {
        var choose = Math.random();
        if (choose < 0.1) {
            var wait = Math.random() * 1500;
            res.push(dtw(0, 0, wait));
        } else if (choose < 0.2) {
            var turn = Math.random() * 180 - 90;
            var wait = Math.random() * 800;
            res.push(tw(turn, wait));
        } else {
            var dist = Math.random() * 3 + 2;
            var velocity = Math.random() * 0.5 + 0.5;
            var turn = Math.random() * 180 - 90;
            res = res.concat(driveDist(dist, velocity, turn));
        }
    }
    return res;
}

// Demo:
// doSequence(patrolLoop);
