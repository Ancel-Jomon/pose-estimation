import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils/camera_utils.js";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils.js";
import { POSE_CONNECTIONS,HAND_CONNECTIONS,FACEMESH_TESSELATION } from "@mediapipe/holistic";

const videoElement = document.getElementsByClassName("input_video")[0];

const guideCanvas = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = guideCanvas.getContext("2d");

const holistic = new Holistic({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
}});

const onResults = (results) => {
  // Draw landmark guides
  drawResults(results);
};
holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true,
});
holistic.onResults(onResults);

const drawResults = (results) => {
  guideCanvas.width = videoElement.videoWidth;
  guideCanvas.height = videoElement.videoHeight;
 
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
  canvasCtx.drawImage(results.image, 0, 0,
    guideCanvas.width,guideCanvas.height);
  // Use `Mediapipe` drawing functions
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#00cff7",
    lineWidth: 4,
  });
  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: "#ff0364",
    lineWidth: 2,
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
    color: "#C0C0C070",
    lineWidth: 1,
  });
  if (results.faceLandmarks && results.faceLandmarks.length === 478) {
    //draw pupils
    drawLandmarks(
      canvasCtx,
      [results.faceLandmarks[468], results.faceLandmarks[468 + 5]],
      {
        color: "#ffe603",
        lineWidth: 2,
      }
    );
  }
  drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
    color: "#eb1064",
    lineWidth: 5,
  });
  drawLandmarks(canvasCtx, results.leftHandLandmarks, {
    color: "#00cff7",
    lineWidth: 2,
  });
  drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
    color: "#22c3e3",
    lineWidth: 5,
  });
  drawLandmarks(canvasCtx, results.rightHandLandmarks, {
    color: "#ff0364",
    lineWidth: 2,
  });
};

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});
camera.start();
