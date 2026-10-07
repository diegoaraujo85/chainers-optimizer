export function millisecondsUntilNextRun(now = new Date(), utcHour = 3): number {
  const next = new Date(now);
  next.setUTCHours(utcHour, 0, 0, 0);
  if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
  return next.getTime() - now.getTime();
}

export function scheduleDaily(task: () => Promise<void>, utcHour = 3): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const schedule = (): void => {
    timer = setTimeout(async () => {
      try {
        await task();
      } finally {
        if (!stopped) schedule();
      }
    }, millisecondsUntilNextRun(new Date(), utcHour));
  };
  schedule();
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}
