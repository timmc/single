# Single

A set of functions and monkeypatches for scripting the Double Robotics
telepresence bot.

## Installation

- Run `make`
- Drag `target/single.user.js` into Chrome's extensions window
- Load the Double control interface
- Start playing!

**Except**... I can't get the script injection to work, so just copy
the contents of utils.js, movement.js, and sequences.js into the JS
console when you have the page open. :-/

## Usage

- Use functions like `driveDist` to generate arrays of timed actions.
- Call `doSequence` on one of these sequences to execute it.

For example, run `doSequence(driveDist(200, 1, 0))` to drive on the
order of 200 feet (very approximate). Or, the following has about a 1
in 4 chance of making the robot fall over:

```javascript
doSequence(repeatSeq([dtw(-100, 0, 150), tw(90, 250), tw(-90, 400), dtw(200, 0, 200), tw(90, 1000), dtw(-100, 90, 1000)], 4))
```

Each action is something like "drive this fast" or "drive while
turning". These are combined with timeouts before the next action can
take place.

Call `stop()` to make the next action the last. This is
semi-permanent; use `unstop()` to allow further `doSequence` calls to
act.

## Code guide

- util.js provides some basic JS facilities
- movement.js provides movement functions
- sequences.js provides some sample sequences

## Disclaimer

This code *really* does not come with a warranty or claim of
fitness. In particular, you run a good chance of breaking the robot if
you are not careful with this code, or even if you are. (I mean, more
so than just driving it normally!)
