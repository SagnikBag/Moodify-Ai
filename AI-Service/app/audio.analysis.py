import librosa
import numpy as np


def analyze_audio(file_path):

    # Load audio file

    audio,sample_rate = librosa.load(
        file_path,
        sr=22050,
        mono=True
    )

    # calculate duration

    duration = librosa.get_duration(
        y=audio,
        sr=sample_rate
    )

    # calculate bpm(tempo)

    tempo,beats = librosa.beat.beat_track(
        y=audio,
        sr=sample_rate
    )

    # calculate ram energy

    rms = librosa.feature.rms(y=audio)
    energy = float(np.mean(rms))

      # Calculate Spectral Centroid

    spectral_centroid = librosa.feature.spectral_centroid(
        y=audio,
        sr=sample_rate
    )

    centroid = float(np.mean(spectral_centroid))

    # calculate zero crossing rate

    zero_crossing = librosa.feature.zero_crossning_rate(y=audio)
    zcr = float(np.mean(zero_crossing))

    return{
        "duration":round(float(duration),2),
        "tempo": round(float(np.asarray(tempo).mean()),2),
        "energy":round(energy,4),
        "spectral_centroid": round(centroid,2),
        "zero_crossing_rate": round(zcr,4)
    }