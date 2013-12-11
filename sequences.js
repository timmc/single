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


// Demo:
doSequence(patrolLoop);
