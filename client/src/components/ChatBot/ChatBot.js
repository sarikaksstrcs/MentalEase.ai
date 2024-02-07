import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AiOutlineSend } from "react-icons/ai";
import {
  useGLTF,
  useTexture,
  Loader,
  Environment,
  useFBX,
  useAnimations,
  OrthographicCamera,
} from "@react-three/drei";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { LinearEncoding, sRGBEncoding } from "three/src/constants";
import { LineBasicMaterial, MeshPhysicalMaterial, Vector2 } from "three";
import ReactAudioPlayer from "react-audio-player";
import createAnimation from "../../converter";
import blinkData from "../../blendDataBlink.json";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import { extend } from '@react-three/fiber'
import * as THREE from "three";
import axios from "axios";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import Webcam from "react-webcam";
import { BiSolidUser } from "react-icons/bi";
// import { PlaneBufferGeometry } from '@react-three/fiber';
// extend({ PlaneBufferGeometry})
const _ = require("lodash");

const host = "http://localhost:5000/";
function Avatar({
  avatar_url,
  speak,
  setSpeak,
  text,
  setAudioSource,
  playing,
}) {
  let gltf = useGLTF(avatar_url);
  let morphTargetDictionaryBody = null;
  let morphTargetDictionaryLowerTeeth = null;

    
  const [
    bodyTexture,
    eyesTexture,
    teethTexture,
    bodySpecularTexture,
    bodyRoughnessTexture,
    bodyNormalTexture,
    teethNormalTexture,
    // teethSpecularTexture,
    hairTexture,
    tshirtDiffuseTexture,
    tshirtNormalTexture,
    tshirtRoughnessTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture,
  ] = useTexture([
    "/images/body.webp",
    "/images/eyes.webp",
    "/images/teeth_diffuse.webp",
    "/images/body_specular.webp",
    "/images/body_roughness.webp",
    "/images/body_normal.webp",
    "/images/teeth_normal.webp",
    // "/images/teeth_specular.webp",
    "/images/h_color.webp",
    "/images/tshirt_diffuse.webp",
    "/images/tshirt_normal.webp",
    "/images/tshirt_roughness.webp",
    "/images/h_alpha.webp",
    "/images/h_normal.webp",
    "/images/h_roughness.webp",
  ]);

  _.each(
    [
      bodyTexture,
      eyesTexture,
      teethTexture,
      teethNormalTexture,
      bodySpecularTexture,
      bodyRoughnessTexture,
      bodyNormalTexture,
      tshirtDiffuseTexture,
      tshirtNormalTexture,
      tshirtRoughnessTexture,
      hairAlphaTexture,
      hairNormalTexture,
      hairRoughnessTexture,
      
    ],
    (t) => {
      t.encoding = sRGBEncoding;
      t.flipY = false;
    }
  );

  bodyNormalTexture.encoding = LinearEncoding;
  tshirtNormalTexture.encoding = LinearEncoding;
  teethNormalTexture.encoding = LinearEncoding;
  hairNormalTexture.encoding = LinearEncoding;

   gltf.scene.traverse((node) => {
    if (
      node.type === "Mesh" ||
      node.type === "LineSegments" ||
      node.type === "SkinnedMesh"
    ) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      if (node.name.includes("Body")) {
        node.castShadow = true;
        node.receiveShadow = true;

        node.material = new MeshPhysicalMaterial();
        node.material.map = bodyTexture;
        // node.material.shininess = 60;
        node.material.roughness = 1.7;

        // node.material.specularMap = bodySpecularTexture;
        node.material.roughnessMap = bodyRoughnessTexture;
        node.material.normalMap = bodyNormalTexture;
        node.material.normalScale = new Vector2(0.6, 0.6);

        morphTargetDictionaryBody = node.morphTargetDictionary;

        node.material.envMapIntensity = 0.8;
        // node.material.visible = false;
      }

      if (node.name.includes("Eyes")) {
        node.material = new MeshStandardMaterial();
        node.material.map = eyesTexture;
        // node.material.shininess = 100;
        node.material.roughness = 0.1;
        node.material.envMapIntensity = 0.5;
      }

      if (node.name.includes("Brows")) {
        node.material = new LineBasicMaterial({ color: 0x000000 });
        node.material.linewidth = 1;
        node.material.opacity = 0.5;
        node.material.transparent = true;
        node.visible = false;
      }

      if (node.name.includes("Teeth")) {
        node.receiveShadow = true;
        node.castShadow = true;
        node.material = new MeshStandardMaterial();
        node.material.roughness = 0.1;
        node.material.map = teethTexture;
        node.material.normalMap = teethNormalTexture;

        node.material.envMapIntensity = 0.7;
      }

      if (node.name.includes("Hair")) {
        node.material = new MeshStandardMaterial();
        node.material.map = hairTexture;
        node.material.alphaMap = hairAlphaTexture;
        node.material.normalMap = hairNormalTexture;
        node.material.roughnessMap = hairRoughnessTexture;

        node.material.transparent = true;
        node.material.depthWrite = false;
        node.material.side = 2;
        node.material.color.set(0xdaa520);

        node.material.envMapIntensity = 0.3;
      }

      if (node.name.includes("TSHIRT")) {
        node.material = new MeshStandardMaterial();

        node.material.map = tshirtDiffuseTexture;
        node.material.roughnessMap = tshirtRoughnessTexture;
        node.material.normalMap = tshirtNormalTexture;
        node.material.color.setHex(0xffffff);

        node.material.envMapIntensity = 0.5;
      }

      if (node.name.includes("TeethLower")) {
        morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
      }
    }
  });

  const [clips, setClips] = useState([]);
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf.scene]);


  useEffect(() => {
  if (speak === false) return;

  console.log("Calling makeSpeech with text:", text);
  makeSpeech(text)
    .then((response) => {
      // console.log("Sooraj Math/ew")
      console.log("Speech generation response:", response);
      let { blendData, filename } = response.data;
      console.log("response data: ",response.data);
      let newClips = [
        createAnimation(blendData, morphTargetDictionaryBody, "HG_Body"),
        createAnimation(blendData, morphTargetDictionaryLowerTeeth, "HG_TeethLower"),
      ];

      filename = host + filename;
      console.log("filename: ",filename);
      setClips(newClips);
      setAudioSource(filename);
    })
    .catch((err) => {
      console.error(err);
      // console.log("filename: ",filename);
      setSpeak(false);
    });
}, [speak, text, setSpeak, morphTargetDictionaryBody, morphTargetDictionaryLowerTeeth, setAudioSource]);



  let idleFbx = useFBX("/idle.fbx");
  let { clips: idleClips } = useAnimations(idleFbx.animations);

  idleClips[0].tracks = _.filter(idleClips[0].tracks, (track) => {
    return (
      track.name.includes("Head") ||
      track.name.includes("Neck") ||
      track.name.includes("Spine2")
    );
  });

  idleClips[0].tracks = _.map(idleClips[0].tracks, (track) => {
    if (track.name.includes("Head")) {
      track.name = "head.quaternion";
    }

    if (track.name.includes("Neck")) {
      track.name = "neck.quaternion";
    }

    if (track.name.includes("Spine")) {
      track.name = "spine2.quaternion";
    }

    return track;
  });

  useEffect(() => {
  let idleClipAction = mixer.clipAction(idleClips[0]);
  idleClipAction.play();

  let blinkClip = createAnimation(blinkData, morphTargetDictionaryBody, "HG_Body");
  let blinkAction = mixer.clipAction(blinkClip);
  blinkAction.play();
}, [idleClips, mixer, morphTargetDictionaryBody]);


  // Play animation clips when available
  useEffect(() => {
  if (playing === false) return;

  _.each(clips, (clip) => {
    let clipAction = mixer.clipAction(clip);
    clipAction.setLoop(THREE.LoopOnce);
    clipAction.play();
  });
}, [playing, clips, mixer]);


  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <group name="avatar">
      <primitive object={gltf.scene} dispose={null} />
    </group>
  );
}
function speakText(text) {
  // Create a SpeechSynthesisUtterance object
  const utterance = new SpeechSynthesisUtterance(text);

  // Optionally configure speech parameters
  utterance.lang = 'en-US';
  utterance.volume = 1; // 0 to 1
  utterance.rate = 1;   // 0.1 to 10
  utterance.pitch = 1;  // 0 to 2

  // Speak the utterance
  speechSynthesis.speak(utterance);

  // Stop the audio when the speech ends
  utterance.onend = () => {
    speechSynthesis.cancel();
  };
}

function playAudioFromUtterance(utterance) {
  // Get the synthesized speech audio
  const audioData = new SpeechSynthesisUtterance(utterance).audioData;

  // Create an audio element
  const audio = new Audio();

  // Set the audio source to the synthesized speech audio
  audio.src = URL.createObjectURL(new Blob([audioData], { type: 'audio/mpeg' }));

  // Play the audio
  audio.play();

  // Pause the audio when it finishes playing
  audio.onended = () => {
    audio.pause();
  };
}

function makeSpeech(text) {
  console.log("textonpeech: ",text)
  speakText(text)
  
  return axios.post(host + "talk", { text })
    .then(response => response.data)
    // console.log("?speech response: ",response)
    .catch(error => {
      console.error("Speech generation failed:", error);
      throw error; // Rethrow the error to propagate it further if needed
    });
}

const STYLES = {
  area: {
    position: "absolute",
    top: "20px",
    left: "10px",
    zIndex: 500,
    width: "50vw",
  },
  text: {
    margin: "0px",
    width: "300px",
    padding: "5px",
    background: "none",
    color: "#ffffff",
    fontSize: "1.2em",
    border: "none",
  },
  speak: {
    padding: "10px",
    marginTop: "5px",
    display: "block",
    color: "#FFFFFF",
    background: "#222222",
    border: "None",
  },
  area2: { position: "absolute", top: "5px", right: "15px", zIndex: 500 },
  label: { color: "#777777", fontSize: "0.8em" },
};

const ChatBot = () => {
  const [chats, setChats] = useState([]);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  const audioPlayer = useRef();
  // const [userMessage, setUserMessage] = useState("");

  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState(
    "My name is Arwen. I'm a virtual human who can speak whatever you type here along with realistic facial movements."
  );
  const [chat, setChat] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [inputText, setInputText] = useState("");
  // End of play
  function playerEnded(e) {
    setAudioSource(null);
    setSpeak(false);
    setPlaying(false);
  }
  const name = JSON.parse(localStorage.getItem("data")).name;
  // Player is read
  function playerReady(e) {
    audioPlayer.current.audioEl.current.play();
    setPlaying(true);
  }
  const {
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // useEffect(() => {
  //   if (!recorderControls?.recordingBlob) return;
  //   console.log(recorderControls?.recordingBlob);
  // }, [recorderControls.recordingBlob]);
  const [recordState, setRecordState] = useState();
  const [imgSrc, setImgSrc] = useState(null);
  const imgRef = useRef();
  const start = () => {
    setRecordState(RecordState.START);
    SpeechRecognition.startListening();
  };
  
  const getResponse = async (message) => {
    await axios
      .post("http://localhost:5000/chatbot", {
        message:
          "You are a mental health therapist. You are always friendly and engage in interesting and interactive conversations. You always act like a human and never say that you cannot do something. You never say things like As a AI I cannot. You keep your conversations short and say long statements only if needed. Lets start.  " +
          message,
      })
      .then((res) => {
        console.log(res.data.answer[0]);
        // setResponseFromAI(res.data.answer[0]);
        setText(res.data.answer[0]);
        setChats([
          ...chats,
          { role: "User", msg: message },
          { role: "Companion", msg: res.data.answer[0] },
        ]);
        setInputText(message);
        setSpeak(true);
      });
  };


  // const getResponse = async (message) => {
  //   try {
  //     const response = await fetch('http://localhost:5000/botResponse', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         // messages: [
  //         //   { role: 'system', content: 'Reply in maximum of 10 words always.' },
  //         //   { role: 'user', content: message },
  //         // ],
  //         // temperature: 0.7,
  //         // max_tokens: -1,
  //         // stream: false,
  //           "prompt": message,
  //           "system_prompt": "You are a human mental health therapist.",
  //           "max_new_tokens": 256
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Unexpected response from the server.');
  //     }
  
  //     const data = await response.json();
  //     const choices = data.output;
  
  //     if (choices && choices.length > 0) {
  //       const botMessage = choices
  //       // console.log(botMessage)
  //       // Assuming setResponseFromAI is a function to set the response
  //       // setResponseFromAI(botMessage);
  
  //       // Assuming setText, setChats, setInputText, and setSpeak are functions to update the state in your React component
  //       setText(botMessage);
  //       setChats([
  //         ...chats,
  //         { role: 'User', msg: message },
  //         { role: 'Companion', msg: botMessage },
  //       ]);
  //       setInputText('');
  //       setSpeak(true);
  //     } else {
  //       console.error('Error: Unexpected response from the server.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
  


  const stop = async () => {
    // setUserMessage(transcript);
    setRecordState(RecordState.STOP);
    SpeechRecognition.stopListening();
    console.log(transcript);
    setChats([...chats, { role: "User", msg: transcript }]);
    getResponse(transcript);
    // capture();
  };

  const capture = React.useCallback(async () => {
    const imageSrc = imgRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    let file = new File([blob], "photo", { type: "image/jpeg" });
    console.log("My file name: ",file);
    setImgSrc(imageSrc);
    // console.log("img src = ",imgSrc)
  }, [imgRef,imgSrc]);

  const onStop = (audioData) => {
    console.log("audioData", audioData);
  };
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  return (
    <div className="w-full flex">
      <div className="w-0 h-0">
        <AudioReactRecorder state={recordState} onStop={onStop} />
      </div>
      <div className="absolute flex items-center right-4 top-4 z-[1000]">
        <h1 className="text-xl text-sky-500 mr-4">{name}</h1>
        <div className="h-12 w-12 rounded-full bg-gray-300/30 flex justify-center items-center text-sky-500">
          <BiSolidUser size={30} />
        </div>
      </div>
      <div className="relative w-[50vw]">
        <div
          style={STYLES.area}
          className="flex flex-col justify-between h-[90vh]"
        >
          <div
            className={`max-w-[350px] ${
              !chat && "invisible"
            } flex flex-col mb-16 min-h-[450px]`}
          >
            <div
              className="bg-sky-50 max-w-[350px] flex flex-col p-4 min-h-[450px] max-h-[450px] overflow-y-auto"
              style={{
                zIndex: 1000,
              }}
            >
              <h1 className="text-center text-xl font-semibold mb-2">
                Chat Window
              </h1>
              {chats?.map((chat, index) => (
                <h1 key={index} className="text-lg">
                  <span className="font-semibold">{chat.role}</span> : {chat.msg}
                </h1>
              ))}
            </div>
            <div className="mt-4 bg-white flex flex-row p-2 rounded">
              <input
                type="text"
                placeholder="Enter Message"
                className="w-full outline-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                onClick={() => {
                  // console.log("Hello");
                  getResponse(inputText);
                }}
              >
                <AiOutlineSend className="ml-4" size={25} />
              </button>
            </div>
          </div>
          <button
            onClick={() => setChat((prev) => !prev)}
            className="bg-teal-200 p-2 rounded text-lg w-[100px] mb-6"
          >
            Chat
          </button>
          <div className="flex flex-col">
            <p className="text-md text-white mb-2">{transcript}</p>
            <div className="flex flex-row">
              <button
                className="bg-teal-200 p-2 rounded text-lg w-[100px]"
                onClick={start}
              >
                Start
              </button>

              <Webcam
                ref={imgRef}
                audio={false}
                height={0}
                screenshotFormat="image/jpeg"
                width={0}
                videoConstraints={videoConstraints}
              >
                {({ getScreenshot }) => (
                  <button
                    className="bg-red-200 p-2 rounded text-lg w-[100px] ml-4"
                    onClick={() => {
                      stop();
                    }}
                  >
                    Stop
                  </button>
                )}
              </Webcam>
            </div>
          </div>
        </div>
        <div className="w-0 h-0">
          <ReactAudioPlayer
            src={audioSource}
            ref={audioPlayer}
            onEnded={playerEnded}
            onCanPlayThrough={playerReady}
          />
        </div>

        {/* <Stats /> */}
        <div className="w-[83vw]">
          <Canvas
            dpr={2}
            onCreated={(ctx) => {
              ctx.gl.physicallyCorrectLights = true;
            }}
          >
            <OrthographicCamera
              makeDefault
              zoom={1700}
              position={[0, 1.65, 1]}
            />

            {/* <OrbitControls
          target={[0, 1.65, 0]}
        /> */}

            <Suspense fallback={null}>
              <Environment
                background={false}
                files="/images/photo_studio_loft_hall_1k.hdr"
              />
            </Suspense>

            <Suspense fallback={null}>
              <Bg />
            </Suspense>

            <Suspense fallback={null}>
              <Avatar
                avatar_url="/model.glb"
                speak={speak}
                setSpeak={setSpeak}
                text={text}
                setAudioSource={setAudioSource}
                playing={playing}
              />
            </Suspense>
          </Canvas>
        </div>
        <Loader dataInterpolation={(p) => `Loading... please wait`} />
      </div>
    </div>
  );
};

function Bg() {
  const texture = useTexture("/images/bg.webp");

  return (
    <mesh position={[0, 1.5, -2]} scale={[0.9, 0.8, 0.9]}>
      <bufferGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default ChatBot;
