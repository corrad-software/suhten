type EchoLike = {
  private: (ch: string) => { listen: (event: string, cb: (data: unknown) => void) => void };
  leave: (ch: string) => void;
  disconnect: () => void;
};

/** Reverb/Echo optional — returns null when unset; AINA falls back to polling. */
export function getEcho(): EchoLike | null {
  return null;
}

export function disconnectEcho(): void {
  // no-op without Reverb
}
