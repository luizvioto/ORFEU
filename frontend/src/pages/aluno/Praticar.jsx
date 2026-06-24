import { Metronome as IconeMetronomo } from "lucide-react";
import Metronomo from "../../components/Metronomo";
import Timer from "../../components/Timer";

export default function Praticar({ onTimerExpire }) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 1800);

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-2xl bg-brand-dark text-brand-primary p-6 rounded-xl">
          <IconeMetronomo />
          <h2>Sala de Treino</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Metronomo />
          </div>
          <Timer expiryTimestamp={time} onExpire={onTimerExpire} />
        </div>
      </div>
    </div>
  );
}