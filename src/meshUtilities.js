export const traingulationMatrices = [
  //Left Top
  109,
  108,
  151,

  // Bottom Second and Right Bottom
  9,
  336,
  337,

  // Right First
  297,
  338,
  337,

  // Top second
  338,
  10,
  151,

  // Bottom First
  107,
  9,
  108,

  ///Top first
  10,
  109,
  151,
];

// Triangle drawing method
const drawPath = (ctx, points, closePath) => {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.strokeStyle = "grey";
  ctx.stroke(region);
};

const rect = [
  [200, 100],
  [500, 100],
  [500, 300],
  [200, 300]
];

// Drawing Mesh
export const drawMesh = (predictions, ctx) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const keypoints = prediction.scaledMesh;

      //  Draw Triangles
      for (let i = 0; i < traingulationMatrices.length / 3; i++) {
        // Get sets of three keypoints for the triangle
        const points = [
          traingulationMatrices[i * 3],
          traingulationMatrices[i * 3 + 1],
          traingulationMatrices[i * 3 + 2]
        ].map((index) => keypoints[index]);
        //  Draw triangle
        console.log(points);
        drawPath(ctx, points, true);
      }
      // drawPath(ctx, rect, true);

      // Draw Dots
      // for (let i = 0; i < keypoints.length; i++) {
      //   const x = keypoints[i][0];
      //   const y = keypoints[i][1];

      //   ctx.beginPath();
      //   ctx.arc(x, y, 1 /* radius */, 0, 3 * Math.PI);
      //   ctx.fillStyle = "aqua";
      //   ctx.fill();
      // }
    });
  }
};
