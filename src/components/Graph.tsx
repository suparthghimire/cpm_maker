import Sketch from "react-p5";
import p5Types from "p5";
import Node from "../model/Node";
import { useMantineTheme } from "@mantine/core";

const sqSize = 40;
let dragNode: Node | null = null;

const windowXOffset = 40;
const windowYOffset = 92;

let panOffset: p5Types.Vector | null = null;

export default function Graph({ nodes }: { nodes: Node[] }) {
  const theme = useMantineTheme();
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(
      window.innerWidth - windowXOffset,
      window.innerHeight - windowYOffset
    ).parent(canvasParentRef);
  };
  function mousePressed(p5: p5Types) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const isPressed = mouseInSq(
        p5,
        { x: nodes[i].x, y: nodes[i].y },
        sqSize + 80
      );
      if (isPressed) {
        p5.cursor("grabbing");
        dragNode = nodes.splice(i, 1)[0];
        nodes.push(dragNode);
        break;
      } else {
        panOffset = p5.createVector(p5.mouseX, p5.mouseY);
      }
    }
  }
  function mouseReleased(p5: p5Types) {
    dragNode = null;
    panOffset = null;
  }
  function mouseDragged(p5: p5Types) {
    if (dragNode) {
      dragNode.x = p5.mouseX - (sqSize + 120) / 2;
      dragNode.y = p5.mouseY - (sqSize + 120) / 2;
    } else {
      if (panOffset) {
        const newPanOffset = p5.createVector(p5.mouseX, p5.mouseY);
        const diff = p5.createVector(
          newPanOffset.x - panOffset.x,
          newPanOffset.y - panOffset.y
        );
        panOffset = newPanOffset;
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].x += diff.x;
          nodes[i].y += diff.y;
        }
      }
    }
  }
  function mouseInSq(p5: p5Types, pos: { x: number; y: number }, size: number) {
    return (
      p5.mouseX > pos.x + 40 &&
      p5.mouseX < pos.x + 40 + size &&
      p5.mouseY > pos.y + 40 &&
      p5.mouseY < pos.y + 40 + size
    );
  }
  function drawNode(p5: p5Types, node: Node) {
    p5.fill(255);
    p5.noStroke();

    let OFFSET_X = 0;
    let OFFSET_Y = 0;

    p5.textSize(25);
    p5.stroke(0);

    p5.square(node.x + OFFSET_X + 40, node.y + OFFSET_Y + 40, sqSize + 80);

    p5.noStroke();
    // center center
    p5.square(node.x + OFFSET_X + 80, node.y + OFFSET_Y + 80, sqSize);

    // center left
    p5.square(node.x + OFFSET_X + 80 - 40, node.y + OFFSET_Y + 80, sqSize);

    // center right
    p5.square(node.x + OFFSET_X + 80 + 40, node.y + OFFSET_Y + 80, sqSize);

    // p5.stroke(0);
    // top center
    p5.square(node.x + OFFSET_X + 80, node.y + OFFSET_Y + 80 - 40, sqSize);

    // top right
    p5.square(node.x + OFFSET_X + 80 - 40, node.y + OFFSET_Y + 80 - 40, sqSize);

    // top left
    p5.square(node.x + OFFSET_X + 80 + 40, node.y + OFFSET_Y + 80 - 40, sqSize);

    // bottom center
    p5.square(node.x + OFFSET_X + 80, node.y + OFFSET_Y + 80 + 40, sqSize);
    // bottom left
    p5.square(node.x + OFFSET_X + 80 - 40, node.y + OFFSET_Y + 80 + 40, sqSize);

    // bottom right
    p5.square(node.x + OFFSET_X + 80 + 40, node.y + OFFSET_Y + 80 + 40, sqSize);

    p5.noStroke();
    p5.fill("black");
    p5.textAlign(p5.CENTER, p5.CENTER);
    // name of node
    p5.text(node.name, node.x + OFFSET_X + 100, node.y + OFFSET_Y + 100);
    //duration
    p5.text(
      node.duration,
      node.x + OFFSET_X + 100,
      node.y + OFFSET_Y + 100 - 40
    );
    // slack
    p5.text(node.slack, node.x + OFFSET_X + 100, node.y + OFFSET_Y + 100 + 40);

    // est
    p5.text(
      node.est,
      node.x + OFFSET_X + 100 - 40,
      node.y + OFFSET_Y + 100 - 40
    );
    // eft
    p5.text(
      node.eft,
      node.x + OFFSET_X + 100 + 40,
      node.y + OFFSET_Y + 100 - 40
    );
    // lst
    p5.text(
      node.lst,
      node.x + OFFSET_X + 100 - 40,
      node.y + OFFSET_Y + 100 + 40
    );
    // lft
    p5.text(
      node.lft,
      node.x + OFFSET_X + 100 + 40,
      node.y + OFFSET_Y + 100 + 40
    );

    // table border
    p5.stroke(0);
    // inner top line
    p5.line(
      node.x + OFFSET_X + 40,
      node.y + OFFSET_Y + 80,
      node.x + OFFSET_X + 160,
      node.y + OFFSET_Y + 80
    );
    // inner bottom line
    p5.line(
      node.x + OFFSET_X + 40,
      node.y + OFFSET_Y + 120,
      node.x + OFFSET_X + 160,
      node.y + OFFSET_Y + 120
    );
    // top left small line
    p5.line(
      node.x + OFFSET_X + 80,
      node.y + OFFSET_Y + 40,
      node.x + OFFSET_X + 80,
      node.y + OFFSET_Y + 80
    );
    // top right small line
    p5.line(
      node.x + OFFSET_X + 120,
      node.y + OFFSET_Y + 40,
      node.x + OFFSET_X + 120,
      node.y + OFFSET_Y + 80
    );
    // bottom left small line
    p5.line(
      node.x + OFFSET_X + 80,
      node.y + OFFSET_Y + 120,
      node.x + OFFSET_X + 80,
      node.y + OFFSET_Y + 160
    );
    // bottom right small line
    p5.line(
      node.x + OFFSET_X + 120,
      node.y + OFFSET_Y + 120,
      node.x + OFFSET_X + 120,
      node.y + OFFSET_Y + 160
    );
    p5.noStroke();
  }
  const draw = (p5: p5Types) => {
    p5.background(theme.colors.dark[9]);
    p5.noStroke();

    // p5.translate(p5.width / 2, p5.height / 2);

    let visited = new Array(nodes.length).fill(false);

    function dfs(node: Node) {
      const nodeIdx = nodes.findIndex((n) => n.name === node.name);

      if (visited[nodeIdx] === false) {
        drawNode(p5, node);
        visited[nodeIdx] = true;
      }

      // draw line from current node to successors's x and y

      p5.stroke(255);
      p5.strokeWeight(4);
      let OFFSET_X = 0;
      let OFFSET_Y = 0;
      node.successors.forEach((s) => {
        const sNode = nodes.find((n) => n.name === s) as Node;
        p5.line(
          node.x + OFFSET_X + 100 + 60,
          node.y + OFFSET_Y + 100,
          sNode.x + OFFSET_X + 100 - 60,
          sNode.y + OFFSET_Y + 100
        );
      });
      p5.strokeWeight(1);
      p5.noStroke();

      node.successors.forEach((s) => {
        const sIdx = nodes.findIndex((n) => n.name === s);
        if (visited[sIdx] == false) {
          const sNode = nodes[sIdx];
          // sNode.x = node.x + OFFSET_X + xDist;
          dfs(sNode);
        }
      });
    }

    nodes.forEach((n) => dfs(n));
  };
  function windowResized(p5: p5Types) {
    p5.resizeCanvas(
      window.innerWidth - windowXOffset,
      window.innerHeight - windowYOffset
    );
  }
  function mouseMoved(p5: p5Types) {
    // check if cursor is over a node
    // if yes change cursor to pointer
    // else change cursor to default
    for (let i = nodes.length - 1; i >= 0; i--) {
      const isPressed = mouseInSq(
        p5,
        { x: nodes[i].x, y: nodes[i].y },
        sqSize + 80
      );
      //   if (nodes[i]) {
      if (isPressed) {
        p5.cursor("grab");
        break;
      } else {
        p5.cursor("all-scroll");
      }
    }
    // console.log(p5.mouseX, p5.mouseY);
  }
  return (
    <Sketch
      mousePressed={mousePressed}
      mouseDragged={mouseDragged}
      mouseReleased={mouseReleased}
      windowResized={windowResized}
      mouseMoved={mouseMoved}
      setup={setup}
      draw={draw}
    />
  );
}
