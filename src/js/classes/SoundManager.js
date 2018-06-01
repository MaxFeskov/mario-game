export default class SoundManager {
  constructor(trackList = {}) {
    this.trackList = trackList;
    this.trackListName = Object.keys(trackList);

    this.playedSounds = new Set();
    this.stopedSounds = new Set();
  }

  add(settings, ...queue) {
    const {
      autoplay = false, repeat = false, volume = 1,
    } = settings;

    const audio = document.createElement('audio');
    audio.volume = volume;
    audio.dataset.current = 0;

    const sound = {
      audio,
      queue,
    };

    if (autoplay) {
      this.play(sound);
    }

    audio.addEventListener('ended', () => {
      const next = Number(audio.dataset.current) + 1;

      if (sound.queue[`${next}`] !== undefined) {
        audio.dataset.current = next;
        this.play(sound);
      } else if (repeat) {
        audio.dataset.current = 0;
        this.play(sound);
      } else {
        this.stopedSounds.delete(sound);
      }
    });

    return sound;
  }

  play(sound) {
    const {
      audio, queue,
    } = sound;

    const soundNumber = Number(audio.dataset.current);
    const soundName = queue[`${soundNumber}`];

    if (this.trackListName.includes(soundName)) {
      if (audio) {
        const newSrc = this.trackList[`${soundName}`].track;

        if (!audio.src.includes(newSrc)) {
          audio.src = newSrc;
        }

        audio.play();
        this.playedSounds.add(sound);
      }
    }
  }

  pause(sound) {
    const { audio } = sound;

    if (audio) {
      audio.play().then(() => {
        audio.pause();

        this.playedSounds.delete(sound);
        this.stopedSounds.add(sound);
      });
    }
  }

  stop(sound) {
    const { audio } = sound;

    if (audio) {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.dataset.current = 0;

        this.playedSounds.delete(sound);
        this.stopedSounds.add(sound);
      });
    }
  }

  static volume(sound, value) {
    if (value >= 0 && value <= 1) {
      const { audio } = sound;

      audio.volume = value;
    }
  }

  setVolume(sound, value) {
    this.constructor.volume(sound, value);
  }

  mute(sound) {
    const { audio } = sound;
    audio.dataset.volume = audio.volume;

    this.setVolume(sound, 0);
  }

  unmute(sound) {
    const { audio } = sound;

    this.setVolume(sound, audio.dataset.volume);
  }

  playAll() {
    this.stopedSounds.forEach((sound) => {
      this.play(sound);
    });
  }

  pauseAll() {
    this.playedSounds.forEach((sound) => {
      this.pause(sound);
    });
  }

  stopAll() {
    this.playedSounds.forEach((sound) => {
      this.stop(sound);
    });
  }

  setVolumeAll(value) {
    this.playedSounds.forEach((sound) => {
      this.setVolume(sound, value);
    });

    this.stopedSounds.forEach((sound) => {
      this.setVolume(sound, value);
    });
  }

  muteAll() {
    this.playedSounds.forEach((sound) => {
      this.mute(sound);
    });

    this.stopedSounds.forEach((sound) => {
      this.mute(sound);
    });
  }

  unmuteAll() {
    this.playedSounds.forEach((sound) => {
      this.unmute(sound);
    });

    this.stopedSounds.forEach((sound) => {
      this.unmute(sound);
    });
  }
}
