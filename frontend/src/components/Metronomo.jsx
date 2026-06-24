export default function Metronomo() {
  return (
    <div>
      <iframe
        src="https://guitarapp.com/metronome.html?embed=true&tempo=120&timeSignature=2&pattern=1"
        title="Online Metronome"
        style={{width: "100%", 
            height:"520px",
            borderStyle: "none",
            borderRadius: "4px",}}
      ></iframe>
    </div>
  );
}
