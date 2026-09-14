import React, { useState, useMemo } from "react";

const PRICES = {
  sig: { label: "招牌鲜肉", en: "Signature Pork", price: 6.5 },
  corn: { label: "玉米鲜肉", en: "Corn & Pork", price: 6.8 },
  mush: { label: "香菇鲜肉", en: "Mushroom & Pork", price: 6.8 },
  seaweed: { label: "紫菜鲜肉", en: "Seaweed & Pork", price: 6.8 },
  chive: { label: "韭菜鲜肉", en: "Chive & Pork", price: 6.8 },
  shrimp: { label: "鲜虾鲜肉", en: "Shrimp & Pork", price: 7.2 },
  salted: { label: "咸蛋黄鲜肉", en: "Salted Egg & Pork", price: 6.8 },
  century: { label: "皮蛋鲜肉", en: "Century Egg & Pork", price: 6.8 },
};

const ORDERS = [
  { name: "Caroline 琛琛", items: { sig: 3 } },
  { name: "^_^Wu", items: { sig: 3 } },
  { name: "W_W", items: { sig: 1 } },
  { name: "Peter", items: { sig: 1, shrimp: 1 } },
  { name: "Sherry Liu", items: { shrimp: 2 } },
  { name: "sinsin", items: { sig: 1 } },
  { name: "LLL", items: { century: 1 } },
  { name: "なな", items: { sig: 1, corn: 1, century: 1 } },
  { name: "Xian", items: { shrimp: 1, salted: 1 } },
  { name: "傀儡娃娃", items: { century: 3, sig: 1, corn: 1 } },
  { name: "Lesleyᓩ", items: { corn: 1, salted: 1 } },
  { name: "无虞.", items: { corn: 1, salted: 1 } },
  { name: "Starry", items: { century: 1, salted: 1, sig: 1 } },
  { name: "摇粒绒是我我我我我", items: { salted: 1 } },
  { name: "🧂", items: { sig: 1, corn: 1, century: 1 } },
  { name: "Sadddie", items: { shrimp: 1, salted: 1, century: 1 } },
  { name: "Kylin", items: { corn: 1, shrimp: 1 } },
  { name: "Mint", items: { mush: 1, corn: 1 } },
  { name: "starlight💫", items: { shrimp: 1 } },
  { name: "weiwei", items: { corn: 1, mush: 1, chive: 1 } },
  { name: "Fei", items: { salted: 1, sig: 1 } },
  { name: "Choies", items: { corn: 1, salted: 1 } },
  { name: "Lynda Kwan", items: { mush: 1, sig: 1 } },
  { name: "ᥫᩣ", items: { seaweed: 1, salted: 1 } },
  { name: "於", items: { sig: 1, salted: 1, shrimp: 1, century: 1 } },
  { name: "Melissa Yu", items: { sig: 1, salted: 1 } },
  { name: "663", items: { sig: 1, shrimp: 1 } },
  { name: "wyh", items: { shrimp: 1, century: 1, corn: 1 } },
  { name: "幸运的笑笑子", items: { salted: 1 } },
  { name: "蒸汽秋葵", items: { sig: 1, seaweed: 1 } },
  { name: "coralreefs", items: { sig: 1, seaweed: 1 } },
  { name: "ellie6", items: { sig: 1 } },
  { name: "Shirley", items: { shrimp: 1, corn: 1 } },
];

function cost(items) {
  return Object.entries(items).reduce(
    (sum, [flavor, qty]) => sum + PRICES[flavor].price * qty,
    0
  );
}

function boxCount(items) {
  return Object.values(items).reduce((a, b) => a + b, 0);
}

export default function WontonDashboard() {
  const [paid, setPaid] = useState({});
  const [filter, setFilter] = useState("all");

  const members = useMemo(
    () =>
      ORDERS.map((m, i) => ({
        ...m,
        id: i,
        total: cost(m.items),
        boxes: boxCount(m.items),
      })),
    []
  );

  const grandTotal = members.reduce((s, m) => s + m.total, 0);
  const totalBoxes = members.reduce((s, m) => s + m.boxes, 0);
  const paidCount = Object.values(paid).filter(Boolean).length;
  const collected = members
    .filter((m) => paid[m.id])
    .reduce((s, m) => s + m.total, 0);

  const flavorTotals = useMemo(() => {
    const t = {};
    for (const key of Object.keys(PRICES)) t[key] = 0;
    members.forEach((m) => {
      Object.entries(m.items).forEach(([flavor, qty]) => {
        t[flavor] += qty;
      });
    });
    return t;
  }, [members]);

  const visibleMembers = members.filter((m) => {
    if (filter === "paid") return paid[m.id];
    if (filter === "unpaid") return !paid[m.id];
    return true;
  });

  const togglePaid = (id) => setPaid((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="wrap">
      <style>{`
        .wrap {
          --bg: #efe7d8;
          --paper: #fffcf6;
          --ink: #2b2420;
          --muted: #8a7f6e;
          --line: #ddd2bd;
          --red: #b5482a;
          --green: #5c7a5e;
          --gold: #b8862f;
          background: var(--bg);
          min-height: 100vh;
          padding: 20px 14px 60px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--ink);
          box-sizing: border-box;
        }
        .wrap * { box-sizing: border-box; }

        .shopHead {
          text-align: center;
          margin-bottom: 18px;
        }
        .shopName {
          font-family: Georgia, "Iowan Old Style", "Songti SC", serif;
          font-size: 26px;
          letter-spacing: 0.5px;
          margin: 0;
        }
        .shopSub {
          color: var(--muted);
          font-size: 13px;
          margin-top: 4px;
        }

        .ticket {
          background: var(--paper);
          border-radius: 4px;
          box-shadow: 0 1px 0 rgba(43,36,32,0.06);
          border: 1px solid var(--line);
          padding: 16px 16px 4px;
          margin-bottom: 16px;
          position: relative;
        }
        .ticket::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -1px;
          height: 10px;
          background:
            radial-gradient(circle at 8px 0, transparent 7px, var(--bg) 7.5px) repeat-x;
          background-size: 16px 10px;
        }

        .statRow {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
        }
        .statRow + .statRow { border-top: 1px dashed var(--line); }
        .statLabel { font-size: 13px; color: var(--muted); }
        .statValue {
          font-family: "SF Mono", Menlo, Consolas, monospace;
          font-size: 15px;
          font-weight: 600;
        }
        .statValue.big { font-size: 19px; }
        .statValue.green { color: var(--green); }
        .statValue.red { color: var(--red); }

        .progressTrack {
          height: 6px;
          background: var(--line);
          border-radius: 3px;
          margin: 2px 0 12px;
          overflow: hidden;
        }
        .progressFill {
          height: 100%;
          background: var(--green);
          transition: width 0.3s ease;
        }

        .tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }
        .tab {
          flex: 1;
          text-align: center;
          padding: 8px 0;
          font-size: 13px;
          border: 1px solid var(--line);
          background: var(--paper);
          color: var(--muted);
          border-radius: 6px;
        }
        .tab.active {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }

        .row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 8px;
        }
        .rowMain { flex: 1; min-width: 0; }
        .rowName {
          font-size: 14.5px;
          font-weight: 600;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rowItems {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.4;
        }
        .rowRight {
          text-align: right;
          flex-shrink: 0;
        }
        .rowTotal {
          font-family: "SF Mono", Menlo, Consolas, monospace;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .payBtn {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: var(--bg);
          color: var(--muted);
        }
        .payBtn.on {
          background: var(--green);
          border-color: var(--green);
          color: white;
        }

        .sectionTitle {
          font-family: Georgia, serif;
          font-size: 16px;
          margin: 22px 0 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--line);
        }

        .flavorGrid {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 6px 10px;
          font-size: 13px;
        }
        .flavorGrid .h {
          color: var(--muted);
          font-size: 11px;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--line);
        }
        .flavorName { }
        .flavorQty {
          font-family: "SF Mono", Menlo, Consolas, monospace;
          text-align: right;
        }
        .flavorAmt {
          font-family: "SF Mono", Menlo, Consolas, monospace;
          text-align: right;
          color: var(--muted);
        }
        .grandRow {
          margin-top: 6px;
          padding-top: 8px;
          border-top: 1px solid var(--ink);
          font-weight: 700;
        }
      `}</style>

      <div className="shopHead">
        <p className="shopSub">🥣 接龙 · 千里香小馄饨</p>
        <h1 className="shopName">Group Buy Collection</h1>
        <p className="shopSub">Freshly wrapped daily · min 20 boxes for delivery · delivers next Tuesday</p>
      </div>

      <div className="ticket">
        <div className="statRow">
          <span className="statLabel">Members</span>
          <span className="statValue">{members.length}</span>
        </div>
        <div className="statRow">
          <span className="statLabel">Total boxes</span>
          <span className="statValue">{totalBoxes}</span>
        </div>
        <div className="statRow">
          <span className="statLabel">Order total</span>
          <span className="statValue big">${grandTotal.toFixed(2)}</span>
        </div>
        <div className="statRow">
          <span className="statLabel">Collected</span>
          <span className="statValue big green">${collected.toFixed(2)}</span>
        </div>
        <div className="statRow">
          <span className="statLabel">Outstanding</span>
          <span className="statValue red">${(grandTotal - collected).toFixed(2)}</span>
        </div>
        <div style={{ paddingBottom: 14 }}>
          <div className="progressTrack">
            <div
              className="progressFill"
              style={{ width: `${grandTotal ? (collected / grandTotal) * 100 : 0}%` }}
            />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {paidCount} of {members.length} paid
          </div>
        </div>
      </div>

      <div className="tabs">
        {["all", "unpaid", "paid"].map((f) => (
          <div
            key={f}
            className={`tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "unpaid" ? "Unpaid" : "Paid"}
          </div>
        ))}
      </div>

      {visibleMembers.map((m) => (
        <div className="row" key={m.id}>
          <div className="rowMain">
            <div className="rowName">{m.name}</div>
            <div className="rowItems">
              {Object.entries(m.items)
                .map(([flavor, qty]) => `${PRICES[flavor].label} x${qty}`)
                .join(", ")}
            </div>
          </div>
          <div className="rowRight">
            <div className="rowTotal">${m.total.toFixed(2)}</div>
            <div
              className={`payBtn ${paid[m.id] ? "on" : ""}`}
              onClick={() => togglePaid(m.id)}
            >
              {paid[m.id] ? "Paid ✓" : "Mark paid"}
            </div>
          </div>
        </div>
      ))}

      <div className="sectionTitle">Prep summary — boxes to order per flavor</div>
      <div className="flavorGrid">
        <div className="h">Flavor</div>
        <div className="h flavorQty">Boxes</div>
        <div className="h flavorAmt">Amount</div>
        {Object.entries(PRICES).map(([key, info]) => (
          <React.Fragment key={key}>
            <div className="flavorName">
              {info.label} <span style={{ color: "var(--muted)" }}>· ${info.price.toFixed(2)}</span>
            </div>
            <div className="flavorQty">{flavorTotals[key]}</div>
            <div className="flavorAmt">${(flavorTotals[key] * info.price).toFixed(2)}</div>
          </React.Fragment>
        ))}
        <div className="flavorName grandRow">Total</div>
        <div className="flavorQty grandRow">{totalBoxes}</div>
        <div className="flavorAmt grandRow">${grandTotal.toFixed(2)}</div>
      </div>
    </div>
  );
}
