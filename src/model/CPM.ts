import { CPMTable } from "./../@types/index";
import Node from "./Node";

export default class CPM {
  private m_nodes: Node[] = [];
  private m_total_duration: number = 0;
  constructor(private m_table: CPMTable) {
    // for each node,create new node after calculating its successor nodes
    this.m_table.forEach((row) => {
      // calculate successor nodes for node
      const successors = this.m_table
        .map((node) => {
          if (node.predessors.includes(row.name)) return node.name;
        })
        .filter((n) => n !== undefined) as string[];
      const predessors = row.predessors.split(",").map((s) => s.trim());

      this.m_nodes.push(
        new Node(row.name, row.duration, predessors, successors)
      );
    });
  }

  public Calculate(): CPMTable {
    // forward pass to find EST and EFT
    this.m_nodes.forEach((node) => {
      if (node.predessors.length === 0) {
        node.est = 0;
        node.eft = node.duration;
      } else {
        let maxPredEFT = Math.max(
          ...(node.predessors
            .map((p) => {
              const predNode = this.m_nodes.find((n) => n.name === p);
              if (predNode) return predNode.eft;
            })
            .filter((n) => n !== undefined) as number[])
        );

        node.est = maxPredEFT;
        node.eft = maxPredEFT + node.duration;
      }
      this.m_total_duration = Math.max(this.m_total_duration, node.eft);
    });
    // backward pass to find LST and LFT
    this.m_nodes.reverse().forEach((node) => {
      // if node has no successor, then its LFT is total duration
      if (node.successors.length === 0) {
        node.lft = this.m_total_duration;
      } else {
        node.lft = Math.min(
          ...(node.successors
            .map((s) => {
              const succNode = this.m_nodes.find((n) => n.name === s);
              if (succNode) return succNode.lst;
            })
            .filter((n) => n !== undefined) as number[])
        );
      }
      node.lst = node.lft - node.duration;
      node.slack = node.lft - node.eft;
    });

    // convert nodes to table
    return this.m_nodes.reverse().map((n) => {
      return {
        name: n.name,
        duration: n.duration,
        predessors: n.predessors.join(","),
        key: n.name,
        est: n.est,
        eft: n.eft,
        lst: n.lst,
        lft: n.lft,
        slack: n.slack,
      };
    });
  }

  get critical_path(): string[] {
    return this.m_nodes.filter((n) => n.slack === 0).map((n) => n.name);
  }
  get nodes(): Node[] {
    return this.m_nodes;
  }

  get total_duration(): number {
    return this.m_total_duration;
  }
}
