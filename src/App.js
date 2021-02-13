import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

const App = () => {
  const [peer, setPeer] = useState(null);
  const [localID, setLocalID] = useState("");
  const remoteRef = useRef(null);
  const localRef = useRef(null);
  const localNameRef = useRef(null);
  const remoteNameRef = useRef(null);
  useEffect(() => {
    const newPeer = new Peer("yard");
    setPeer(newPeer);
  }, []);

  useEffect(() => {
    if (peer) {
      peer.on("open", (id) => {
        setLocalID(id);
      });
      peer.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            localRef.current.srcObject = stream;
            call.answer(stream);
            call.on("steam", (remoteStream) => {
              remoteRef.current.srcObject = remoteStream;
            });
          })
          .catch((error) => {
            console.log(error.name);
          });
      });
    }
  }, [peer]);

  const makeCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localRef.current.srcObject = stream;
        const call = peer.call("sy", stream);
        call.on("stream", (remoteStream) => {
          remoteRef.current.srcObject = remoteStream;
        });
      })
      .catch((error) => {
        console.log(error.name);
      });
  };

  return (
    <div>
      <input
        ref={localNameRef}
        type="text"
        placeholder="Enter Your Room Name"
      />
      <input
        ref={remoteNameRef}
        type="text"
        placeholder="Enter Remote Room Name"
      />
      <h4>My Local ID {localID}</h4>
      <video title="My local Video" ref={localRef} playsInline autoPlay></video>
      <video
        title="My remote Video"
        ref={remoteRef}
        playsInline
        autoPlay
      ></video>
      <button onClick={makeCall}>Make Call</button>
    </div>
  );
};
export default App;
