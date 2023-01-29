import Sketch from "react-p5";
import p5Types from "p5";
import Node from "../model/Node";

const sqSize = 40;
let dragNode: Node | null = null;

export default function Graph({ nodes }: { nodes: Node[] }) {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, 800).parent(canvasParentRef);
  };

  function mousePressed(p5: p5Types) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const isPressed = mouseInSq(
        p5,
        { x: nodes[i].x, y: nodes[i].y },
        sqSize + 80
      );
      //   if (nodes[i]) {
      if (isPressed) {
        console.log("dragging " + nodes[i].name);
        dragNode = nodes.splice(i, 1)[0];
        nodes.push(dragNode);
        break;
      }
    }
  }

  function mouseReleased(p5: p5Types) {
    dragNode = null;
  }
  function mouseDragged(p5: p5Types) {
    if (dragNode) {
      console.log("dragging " + dragNode.name);
      dragNode.x = p5.mouseX - (sqSize + 120) / 2;
      dragNode.y = p5.mouseY - (sqSize + 120) / 2;
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

    p5.textSize(20);
    p5.stroke(0);

    p5.square(node.x + 40, node.y + 40, sqSize + 80);

    p5.noStroke();
    // center center
    p5.square(node.x + 80, node.y + 80, sqSize);

    // center left
    p5.square(node.x + 80 - 40, node.y + 80, sqSize);

    // center right
    p5.square(node.x + 80 + 40, node.y + 80, sqSize);

    // p5.stroke(0);
    // top center
    p5.square(node.x + 80, node.y + 80 - 40, sqSize);

    // top right
    p5.square(node.x + 80 - 40, node.y + 80 - 40, sqSize);

    // top left
    p5.square(node.x + 80 + 40, node.y + 80 - 40, sqSize);

    // bottom center
    p5.square(node.x + 80, node.y + 80 + 40, sqSize);
    // bottom left
    p5.square(node.x + 80 - 40, node.y + 80 + 40, sqSize);

    // bottom right
    p5.square(node.x + 80 + 40, node.y + 80 + 40, sqSize);

    p5.noStroke();
    p5.fill("black");
    p5.textAlign(p5.CENTER, p5.CENTER);
    // name of node
    p5.text(node.name, node.x + 100, node.y + 100);
    //duration
    p5.text(node.duration, node.x + 100, node.y + 100 - 40);
    // slack
    p5.text(node.slack, node.x + 100, node.y + 100 + 40);

    // est
    p5.text(node.est, node.x + 100 - 40, node.y + 100 - 40);
    // eft
    p5.text(node.eft, node.x + 100 + 40, node.y + 100 - 40);
    // lst
    p5.text(node.lst, node.x + 100 - 40, node.y + 100 + 40);
    // lft
    p5.text(node.lft, node.x + 100 + 40, node.y + 100 + 40);

    // table border
    p5.stroke(0);
    // inner top line
    p5.line(node.x + 40, node.y + 80, node.x + 160, node.y + 80);
    // inner bottom line
    p5.line(node.x + 40, node.y + 120, node.x + 160, node.y + 120);
    // top left small line
    p5.line(node.x + 80, node.y + 40, node.x + 80, node.y + 80);
    // top right small line
    p5.line(node.x + 120, node.y + 40, node.x + 120, node.y + 80);
    // bottom left small line
    p5.line(node.x + 80, node.y + 120, node.x + 80, node.y + 160);
    // bottom right small line
    p5.line(node.x + 120, node.y + 120, node.x + 120, node.y + 160);
    p5.noStroke();
  }
  const draw = (p5: p5Types) => {
    p5.background(240);
    p5.noStroke();

    let visited = new Array(nodes.length).fill(false);

    function dfs(node: Node) {
      const nodeIdx = nodes.findIndex((n) => n.name === node.name);

      if (visited[nodeIdx] === false) {
        drawNode(p5, node);
        visited[nodeIdx] = true;
      }

      // draw line from current node to successors's x and y

      p5.stroke(0);
      node.successors.forEach((s) => {
        const sNode = nodes.find((n) => n.name === s) as Node;
        p5.line(
          node.x + 100 + 60,
          node.y + 100,
          sNode.x + 100 - 60,
          sNode.y + 100
        );
      });
      p5.noStroke();

      // if (node.successors.length > 1) {
      //   node.successors.forEach((s, idx) => {
      //     const sNode = nodes.find((n) => n.name === s) as Node;
      //     //       if index is less than half of length of successors
      //     if (idx < node.successors.length / 2) sNode.y = node.y - idx * yDist;
      //     else sNode.y = node.y + idx * yDist;
      //   });
      // }

      node.successors.forEach((s) => {
        const sIdx = nodes.findIndex((n) => n.name === s);
        if (visited[sIdx] == false) {
          const sNode = nodes[sIdx];
          // sNode.x = node.x + xDist;
          dfs(sNode);
        }
      });
    }

    // p5.translate(p5.width / 2 - 500, p5.height / 2);
    nodes.forEach((n) => dfs(n));

    // create an array of length same as nodes and fill them all with false
  };

  return (
    <Sketch
      mousePressed={mousePressed}
      mouseDragged={mouseDragged}
      mouseReleased={mouseReleased}
      setup={setup}
      draw={draw}
    />
  );
}
