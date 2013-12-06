// Attempt a patrol loop (forward, turn around, forward, turn around)
doSequence([
  dtw(-100, 0, 500), dtw(-100, 0, 500), dtw(-100, 0, 500), dtw(-100, 0, 500),
  dtw(0, 0, 750),
  tw(180, 300),
  dtw(-100, 0, 500), dtw(-100, 0, 500), dtw(-100, 0, 500), dtw(-100, 0, 500),
  dtw(0, 0, 750),
  tw(180, 300)
]);
