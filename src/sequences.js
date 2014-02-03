/*
 * Sample sequences
 */

// A patrol loop (forward, turn around, forward, turn around)
function patrolLoop() {
    var half = [].concat(driveDist(10, 1, 0), wait(1300),
                         turnBy(180), wait(200));
    return repeatSeq(half, 2);
}

/*
 * Experimental sequences -- not reliable.
 */

function pentangle() {
    var segment = [].concat(driveDist(5, 1, 0), wait(1300),
                            turnBy(144), wait(200));
    return repeatSeq(segment, 5);
}

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

/**
 * Generate a forward/backward oscillation with a given period in ms
 * and a total wait time in ms. v = velocity, t = turn factor, turnAlt
 * = true for alternating the turn direction.
 */
function mOscillate(v, t, turnAlt, period, total_w) {
    var leftover = total_w % period;
    var reps = (total_w - leftover) / period;
    var hp = period / 2;
    var tb = t * (turnAlt ? -1 : 1);
    var iteration = driveTimed(v, t, hp).concat(driveTimed(-v, tb, hp));
    var ret = repeatSeq(iteration, reps);
    if (leftover > 0) {
        ret.push(dtw(0, 0, leftover));
    }
    return ret;
}

// Demo:
// doSequence(patrolLoop);
