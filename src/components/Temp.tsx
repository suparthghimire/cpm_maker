import p5Types from "p5";
import Sketch from "react-p5";
let dragPoint: { x: number; y: number } | null = null;
const SQ_SIZE = 60;
export default function Temp() {
  const nodes = [
    {
      x: 40,
      y: 40,
    },
    {
      x: 120,
      y: 340,
    },
    {
      x: 140,
      y: 150,
    },
  ];

  function setup(p5: p5Types, canvasParentRef: Element) {
    p5.createCanvas(800, 500).parent(canvasParentRef);
  }
  function drawSq(p5: p5Types, pos: { x: number; y: number }) {
    p5.fill(255);
    p5.stroke(0);

    p5.square(pos.x, pos.y, SQ_SIZE);

    p5.square(pos.x + 10, pos.y + 10, 20);
    p5.square(pos.x + 30, pos.y + 10, 20);
    p5.square(pos.x + 10, pos.y + 30, 20);
    p5.square(pos.x + 30, pos.y + 30, 20);
  }
  function draw(p5: p5Types) {
    p5.background("pink");
    nodes.forEach((node) => drawSq(p5, { x: node.x, y: node.y }));
  }

  function mousePressed(p5: p5Types) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const isPressed = mouseInSq(
        p5,
        { x: nodes[i].x, y: nodes[i].y },
        SQ_SIZE
      );
      //   if (nodes[i]) {
      if (isPressed) {
        dragPoint = nodes.splice(i, 1)[0];
        nodes.push(dragPoint);
        break;
      }
      //   }
    }
  }
  function mouseReleased(p5: p5Types) {
    // console.log("mouse released");
    dragPoint = null;
  }
  function mouseDragged(p5: p5Types) {
    // console.log("mouse dragged");
    console.log(p5.mouseX);
    if (dragPoint) {
      dragPoint.x = p5.mouseX - SQ_SIZE / 2;
      dragPoint.y = p5.mouseY - SQ_SIZE / 2;
    }
  }

  function mouseInSq(p5: p5Types, pos: { x: number; y: number }, size: number) {
    const x = pos.x;
    const y = pos.y;
    const sqSize = size;
    if (
      p5.mouseX > x &&
      p5.mouseX < x + sqSize &&
      p5.mouseY > y &&
      p5.mouseY < y + sqSize
    ) {
      return true;
    }
    return false;
  }
  return (
    <Sketch
      draw={draw}
      setup={setup}
      mousePressed={mousePressed}
      mouseReleased={mouseReleased}
      mouseDragged={mouseDragged}
    />
  );
}
