import React, { useState } from "react";
import { MdSettingsVoice } from "@react-icons/all-files/md/MdSettingsVoice";
import { cloudinaryFunction } from "../../cloudinary";
import Img from "../../images/img.png";
import RecordRTC from "recordrtc";
import "./inputMsg.css";

const InputMsg = ({ sendMsg }: any) => {
  const [msg, setMsg] = useState<any>("");
  const [imageMsg, setimageMsg] = useState<any>("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<RecordRTC | null>(null);

  const send = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e?.key === "Enter") {
      if (imageMsg !== "") {
        const data = await cloudinaryFunction(imageMsg, "image");
        sendMsg(data);
        setimageMsg("");
      } else {
        sendMsg(msg);
        setMsg("");
      }
    }
  };
  const sendByClick = async () => {
    if (imageMsg !== "") {
      const data = await cloudinaryFunction(imageMsg, "image");
      sendMsg(data);
      setimageMsg("");
    } else {
      sendMsg(msg);
      setMsg("");
    }
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
        });
        recorder.startRecording();
        setIsRecording(true);
        setMediaRecorder(recorder);
      })
      .catch((error) => console.log(error));
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stopRecording(async () => {
        const recordedBlob = mediaRecorder.getBlob();
        const data = await cloudinaryFunction(recordedBlob, "video");
        sendMsg(data);
        setIsRecording(false);
        setMediaRecorder(null);
      });
    }
  };

  return (
    <div className="input-msg">
      <div className="input-msg-container">
        <input
          onKeyDown={send}
          onChange={(e) => setMsg(e.target.value)}
          placeholder={
            imageMsg !== ""
              ? `can't write msg with img send the img and then write msg`
              : "Type something..."
          }
          type="text"
          className="msg-input"
          value={msg}
          disabled={imageMsg !== ""}
        />
        <div className="right-container">
          <div className="add-image-container">
            <input
              onChange={(e) =>
                setimageMsg(e.target.files ? e.target.files[0] : "")
              }
              style={{ display: "none" }}
              id="img"
              type="file"
            />
            {imageMsg?.type?.startsWith("image") ? (
              <div className="image-valid">
                {imageMsg.name}{" "}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setimageMsg("");
                  }}
                  className="delete-img"
                >
                  x
                </span>
              </div>
            ) : (
              <label htmlFor="img">
                <img className="img-icon" src={Img} alt="" />
              </label>
            )}
          </div>
          <button onClick={sendByClick} className="input-msg-btn">
            Send
          </button>
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="input-msg-btn record-btn recording"
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="input-msg-btn record-btn"
            >
              <MdSettingsVoice size="14px" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputMsg;
