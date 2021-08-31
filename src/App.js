import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh, traingulationMatrices } from "./meshUtilities.js";

const width = 720;
const height = 500;

function App() {
  const webcamReference = useRef(null);
  const canvasReference = useRef(null);

  const loadFacemesh = async () => {
    const network = await facemesh.load({
      inputResolution: { width: width, height: height },
      scale: 0.8,
      maxContinuousChecks: 15
    });
    setInterval(() => {
      detectFace(network);
    }, 100);
  };

  const detectFace = async (network) => {
    if (
      typeof webcamReference.current !== "undefined" &&
      webcamReference.current !== null &&
      webcamReference.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamReference.current.video;
      const videoWidth = webcamReference.current.video.videoWidth;
      const videoHeight = webcamReference.current.video.videoHeight;

      // Set video width
      webcamReference.current.video.width = videoWidth;
      webcamReference.current.video.height = videoHeight;

      // Set canvas width
      canvasReference.current.width = videoWidth;
      canvasReference.current.height = videoHeight;

      // Make Detections
      const faceEstimate  = await network.estimateFaces(video);
      const imageSrc = webcamReference.current.getScreenshot();

      //Get canvas context
      const ctx = canvasReference.current.getContext("2d");
      drawMesh(faceEstimate, ctx);


      const predictions = faceEstimate;
      if (predictions.length > 0) {
        predictions.forEach((prediction) => {
          const keypoints = prediction.scaledMesh;
    
          //  Draw Triangles
          const all_p = [];
          for (let i = 0; i < traingulationMatrices.length / 3; i++) {
            // Get sets of three keypoints for the triangle
            const points = [
              traingulationMatrices[i * 3],
              traingulationMatrices[i * 3 + 1],
              traingulationMatrices[i * 3 + 2]
            ].map((index) => keypoints[index]);
            const pp = [
              [points[0][0], points[0][1]],
              [points[1][0], points[1][1]],
              [points[2][0], points[2][1]]
            ];
            all_p.push(pp);
          }
          const final = [
            all_p[0][1],
            all_p[2][0],
            all_p[3][1],
            all_p[1][1],
          ];
          // const boxes = tf.concat([final[2], final[0]]).reshape([-1, 4]);
          const hh = final[2][1] - final[2][1];
          const ww = final[0][0] - final[2][0];
          // ctx.drawImage(new Image(imageSrc), final[2][0], final[2][1], final[0][0], final[0][1], 0,0,ww,hh);
          // console.log(new Image(imageSrc));
          // const crop = tf.image.cropAndResize(tf.tensor(), boxes, [0], [final[2][1] - final[2][1], final[0][0] - final[2][0]]);
          // console.log(crop);
        });
      }


      // console.log(res);
      // if (res) {
      //   const crop = tf.image.cropAndResize(video, res.boxes, [0], [res.height, res.width]);
      //   console.log(crop);
      // }
    }
  };

  loadFacemesh();

  return (
    <div className="App">
      <Webcam
        ref={webcamReference}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: width,
          height: height
        }}
      />

      <canvas
        ref={canvasReference}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500
        }}
      />
    </div>
  );
}

export default App;
