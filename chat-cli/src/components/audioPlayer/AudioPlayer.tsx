import ReactAudioPlayer from "react-audio-player";

const AudioPlayer = ({ src }: any) => {
  return <ReactAudioPlayer src={src} autoPlay={false} controls />;
};

export default AudioPlayer;
