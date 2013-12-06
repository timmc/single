// Turn around. (Don't use 180; it (weirdly) alternates left vs. right.)
var sAboutFace = [tw(90, 1500), tw(90, 1500)];
// Repeat this for smooth forward motion.
var cForward = dtw(-100, 0, 1500);
// Use this component after the last cForward (allow balancing)
var cStabilize = dtw(0,0,1000);
var sHalfPatrol = [cForward, cForward, cForward, cStabilize].concat(sAboutFace);
// A patrol loop (forward, turn around, forward, turn around)
var patrolLoop = sHalfPatrol.slice().concat(sHalfPatrol);

// Run it:
doSequence(patrolLoop);
