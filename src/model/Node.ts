export default class Node {
  private m_est: number = 0;
  private m_eft: number = 0;
  private m_lst: number = 0;
  private m_lft: number = 0;
  private m_slack: number = 0;
  constructor(
    private m_name: string,
    private m_duration: number,
    private m_predessors: string[],
    private m_successors: string[]
  ) {
    if (this.m_predessors.length === 1 && this.m_predessors[0] === "")
      this.m_predessors = [];
  }
  get name(): string {
    return this.m_name;
  }
  get duration(): number {
    return this.m_duration;
  }
  get predessors(): string[] {
    return this.m_predessors;
  }
  get est(): number {
    return this.m_est;
  }
  set est(value: number) {
    this.m_est = value;
  }
  get eft(): number {
    return this.m_eft;
  }
  set eft(value: number) {
    this.m_eft = value;
  }
  get lst(): number {
    return this.m_lst;
  }
  set lst(value: number) {
    this.m_lst = value;
  }
  get lft(): number {
    return this.m_lft;
  }
  set lft(value: number) {
    this.m_lft = value;
  }

  get slack(): number {
    return this.m_slack;
  }
  set slack(value: number) {
    this.m_slack = value;
  }

  get successors(): string[] {
    return this.m_successors;
  }
}
