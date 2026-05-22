import React from "react";

export default function Contracts() {

const weekly = [
  { name: "Andrii Grizzly", contracts: 12, money: 420000 },
  { name: "Ghost", contracts: 8, money: 310000 },
];

const expenses = [
  { name: "Війна", amount: 120000 },
  { name: "Машини", amount: 50000 },
];

const contracts = [
  {
    name: "FIB CONTRACT",
    owner: "Andrii",
    members: "Ghost, Maryana",
    count: 3,
    income: 120000,
  },
  {
    name: "NG CONTRACT",
    owner: "Ghost",
    members: "Andrii, Maryana",
    count: 2,
    income: 90000,
  },
];

return (
<>
<div
style={{
display: "grid",
gridTemplateColumns: "1fr 1.2fr",
gap: "20px",
alignItems: "start",
padding: "20px",
background: "#050505",
minHeight: "100vh",
color: "white",
}}
>

{/* LEFT COLUMN */}
<div
style={{
display: "flex",
flexDirection: "column",
gap: "20px",
}}
>

{/* ADD CONTRACT */}
<div
className="panel"
style={{
background: "rgba(255,255,255,.05)",
border: "1px solid rgba(255,0,80,.2)",
borderRadius: "20px",
padding: "20px",
}}
>

<h2 style={{ color: "#ff0055", marginBottom: "20px" }}>
ДОДАТИ КОНТРАКТ
</h2>

<input
placeholder="📄 Назва контракту"
style={inputStyle}
/>

<div
style={{
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: "10px",
}}
>
<input placeholder="💰 Сума" style={inputStyle} />
<input placeholder="👑 Хто почав" style={inputStyle} />
</div>

<input
placeholder="👥 Учасники"
style={inputStyle}
/>

<div
style={{
marginTop: "15px",
padding: "15px",
background: "#151515",
borderRadius: "12px",
fontSize: "14px",
}}
>
<div style={{ color: "#ff0055", marginBottom: "10px" }}>
ℹ Учасників пишемо через кому
</div>

<div style={{ color: "#999" }}>
Приклад:
</div>

<div style={{ marginTop: "5px" }}>
Andrii Grizzly, Ghost, Maryana
</div>

<div
style={{
marginTop: "15px",
color: "#00ff99",
fontWeight: "700",
}}
>
Кількість учасників: 3
</div>
</div>

<button style={buttonStyle}>
ДОДАТИ КОНТРАКТ
</button>

<button
style={{
...buttonStyle,
background: "#222",
}}
>
ОЧИСТИТИ ПАНЕЛЬ
</button>

</div>

{/* WEEKLY */}
<div
className="panel"
style={{
background: "rgba(255,255,255,.05)",
border: "1px solid rgba(255,0,80,.2)",
borderRadius: "20px",
padding: "20px",
}}
>

<h2 style={{ color: "#ff0055", marginBottom: "20px" }}>
СУМА ЗА ТИЖДЕНЬ
</h2>

{weekly.map((item, index) => (
<div
key={index}
style={{
background: "#151515",
padding: "16px",
borderRadius: "14px",
marginBottom: "12px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
}}
>

<div>
<div style={{ fontWeight: "700" }}>
{index + 1}. {item.name}
</div>

<div
style={{
marginTop: "6px",
color: "#777",
fontSize: "13px",
}}
>
Контрактів: {item.contracts}
</div>
</div>

<div
style={{
color: "#00ff99",
fontWeight: "700",
fontSize: "22px",
}}
>
${item.money.toLocaleString()}
</div>

</div>
))}

</div>

{/* EXPENSES */}
<div
className="panel"
style={{
background: "rgba(255,255,255,.05)",
border: "1px solid rgba(255,0,80,.2)",
borderRadius: "20px",
padding: "20px",
}}
>

<h2 style={{ color: "#ff0055", marginBottom: "20px" }}>
РОЗХОДИ СІМʼЇ
</h2>

<input
placeholder="📄 Назва розходу"
style={inputStyle}
/>

<input
placeholder="💰 Сума"
style={inputStyle}
/>

<button style={buttonStyle}>
ДОДАТИ РОЗХІД
</button>

{expenses.map((item, index) => (
<div
key={index}
style={{
marginTop: "10px",
background: "#151515",
padding: "14px",
borderRadius: "12px",
display: "flex",
justifyContent: "space-between",
}}
>
<div>{item.name}</div>

<div
style={{
color: "#ff0055",
fontWeight: "700",
}}
>
-${item.amount.toLocaleString()}
</div>

</div>
))}

</div>

</div>

{/* RIGHT COLUMN */}
<div
className="panel"
style={{
background: "rgba(255,255,255,.05)",
border: "1px solid rgba(255,0,80,.2)",
borderRadius: "20px",
padding: "20px",
height: "fit-content",
}}
>

<h2 style={{ color: "#ff0055", marginBottom: "20px" }}>
СТАТИСТИКА
</h2>

<div
style={{
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: "15px",
marginBottom: "20px",
}}
>
 
{[
["42", "КОНТРАКТІВ"],
["$5,200,000", "ЗАГАЛЬНИЙ ДОХІД"],
["$4,100,000", "ЧИСТИЙ ДОХІД"],
["$1,200,000", "ДОХІД ЗА 7 ДНІВ"],
].map((item, index) => (
<div
key={index}
style={{
background: "#151515",
padding: "18px",
borderRadius: "14px",
}}
>
<div
style={{
color: "#00ff99",
fontWeight: "700",
fontSize: "24px",
}}
>
{item[0]}
</div>

<div
style={{
marginTop: "8px",
fontSize: "13px",
color: "#bbb",
}}
>
{item[1]}
</div>
</div>
))}

</div>

<div
style={{
display: "grid",
gridTemplateColumns: "2fr 1fr 1fr",
padding: "10px",
color: "#ff0055",
fontWeight: "700",
marginBottom: "10px",
}}
>
<div>КОНТРАКТ</div>
<div>УЧАСНИКИ</div>
<div>ДОХІД</div>
</div>

{contracts.map((item, index) => (
<div
key={index}
style={{
background: "#151515",
padding: "16px",
borderRadius: "14px",
marginBottom: "12px",
display: "grid",
gridTemplateColumns: "2fr 1fr 1fr",
alignItems: "center",
}}
>

<div>
<div style={{ fontWeight: "700" }}>
{item.name}
</div>

<div
style={{
marginTop: "10px",
fontSize: "13px",
color: "#777",
}}
>
👑 {item.owner}
</div>

<div
style={{
marginTop: "4px",
fontSize: "13px",
color: "#777",
}}
>
👥 {item.members}
</div>
</div>

<div>{item.count}</div>

<div
style={{
color: "#00ff99",
fontWeight: "700",
}}
>
${item.income.toLocaleString()}
</div>

</div>
))}

</div>

</div>
</>
);

}

const inputStyle = {
width: "100%",
padding: "14px",
marginBottom: "12px",
borderRadius: "12px",
border: "none",
background: "#151515",
color: "white",
};

const buttonStyle = {
width: "100%",
padding: "14px",
borderRadius: "12px",
border: "none",
background: "#ff0055",
color: "white",
fontWeight: "700",
cursor: "pointer",
marginTop: "10px",
};
