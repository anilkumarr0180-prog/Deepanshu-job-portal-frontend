type ActiveAudioListener = (activeId: string | null) => void;

/**
 * AudioPlaybackManager
 * Lightweight coordinator ensuring only one audio message or preview plays at any time.
 * Prevents overlapping audio playback and manages cleanup across voice players.
 */
class AudioPlaybackManager {
  private activeId: string | null = null;
  private listeners: Set<ActiveAudioListener> = new Set();

  public getActiveId(): string | null {
    return this.activeId;
  }

  public play(id: string) {
    if (this.activeId !== id) {
      this.activeId = id;
      this.notify();
    }
  }

  public pause(id: string) {
    if (this.activeId === id) {
      this.activeId = null;
      this.notify();
    }
  }

  public stopAll() {
    this.activeId = null;
    this.notify();
  }

  public subscribe(listener: ActiveAudioListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.activeId);
      } catch (err) {
        console.error("Error in AudioPlaybackManager listener:", err);
      }
    });
  }
}

export const audioPlaybackManager = new AudioPlaybackManager();
