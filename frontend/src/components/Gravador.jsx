//https://blog.logrocket.com/how-to-create-video-audio-recorder-react/
import { useState, useRef, useEffect } from "react";
import { Mic, Disc, Square } from "lucide-react";
import api from "../services/api";

const mimeType = "audio/webm";

export default function Gravador({ onNovoAudio }) {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const audioChunksRef = useRef([]);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("A API MediaRecorder não é suportada no seu navegador.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    audioChunksRef.current = [];
    mediaRecorder.current.start();

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      audioChunksRef.current.push(event.data);
    };
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    if (!mediaRecorder.current) return;

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      const nomeArquivo = `gravacao-${Date.now()}.webm`;
      const formData = new FormData();
      formData.append("titulo", "Treino sem título");
      formData.append("audio", new File([audioBlob], nomeArquivo, { type: mimeType }));

      try {
        const response = await api.post("/audios", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (onNovoAudio) {
          onNovoAudio(response.data);
        }
      } catch (error) {
        console.error(error);

        const novoAudioLocal = {
          id: `local-${Date.now()}`,
          titulo: "Treino sem título",
          createdAt: new Date().toISOString(),
          url: URL.createObjectURL(audioBlob),
        };

        if (onNovoAudio) {
          onNovoAudio(novoAudioLocal);
        }
      }

      audioChunksRef.current = [];
    };

    mediaRecorder.current.stop();
  };

  useEffect(() => {
    return () => {
      // stop media stream tracks
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  return (
    <div className="w-full">
      {!permission ? (
        <button
          onClick={getMicrophonePermission}
          type="button"
          className="border border-brand-primary/30 rounded-xl px-4 py-2 flex gap-2 justify-center items-center bg-brand-primary text-brand-dark cursor-pointer text-base hover:bg-brand-primary/90"
        >
          <Mic/> Ativar Microfone
        </button>
      ) : null}

      {permission && recordingStatus === "inactive" ? (
        <button
          type="button"
          onClick={startRecording}
          className="rounded-xl px-4 py-2 flex gap-2 justify-center items-center bg-brand-primary text-black font-bold text-base "
        >
          <Disc className="animate-pulse" /> Iniciar Gravação
        </button>
      ) : null}

      {recordingStatus === "recording" ? (
        <button
          onClick={stopRecording}
          type="button"
          className="border border-brand-accent rounded-xl px-4 py-2 flex gap-2 justify-center items-center bg-brand-accent/20 text-red-400 text-base"
        >
          <Square size={16} /> Parar e Salvar
        </button>
      ) : null}
    </div>
  );
}
