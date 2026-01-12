import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Big7 Collections Boutique – Full Financial Management System
// Includes: Dashboard, Records, Reports, Export, Login (basic), SMS placeholder

export default function Big7FinanceApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ type: "", amount: "", person: "", note: "" });

  useEffect(() => {
    const saved = localStorage.getItem("big7-records");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("big7-records", JSON.stringify(records));
  }, [records]);

  const addRecord = () => {
    if (!form.type || !form.amount) return alert("Fill required fields");

    const newRecord = {
      ...form,
      amount: Number(form.amount),
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    };

    setRecords([newRecord, ...records]);

    if (form.type === "Worker Payment") {
      alert(`SMS RECEIPT\nHello ${form.person || "Staff"}, you have been paid GHS ${form.amount}.\nBig7 Collections`);
    }

    setForm({ type: "", amount: "", person: "", note: "" });
  };

  const totalByType = (type) =>
    records.filter((r) => r.type === type).reduce((sum, r) => sum + r.amount, 0);

  const exportCSV = () => {
    const headers = "Type,Amount,Person,Note,Date\n";
    const rows = records
      .map((r) => `${r.type},${r.amount},${r.person || ""},${r.note || ""},${r.date}`)
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "big7-financial-records.csv";
    link.click();
  };

  if (!loggedIn) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-80">
          <CardContent className="p-4">
            <h2 className="font-bold mb-2">Admin Login</h2>
            <Input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="mt-3 w-full"
              onClick={() => password === "big7admin" && setLoggedIn(true)}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Big7 Collections – Financial Dashboard</h1>

      {/* Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-3">Weekly Sales<br /><b>GHS {totalByType("Weekly Sales")}</b></CardContent></Card>
        <Card><CardContent className="p-3">Profit Savings<br /><b>GHS {totalByType("Profit Savings")}</b></CardContent></Card>
        <Card><CardContent className="p-3">Worker Payments<br /><b>GHS {totalByType("Worker Payment")}</b></CardContent></Card>
        <Card><CardContent className="p-3">Total Savings<br /><b>GHS {totalByType("Savings")}</b></CardContent></Card>
      </div>

      {/* Record Form */}
      <Card className="mb-6">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <select className="border p-2 rounded" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="">Select Record Type</option>
            <option>Savings</option>
            <option>Weekly Sales</option>
            <option>Worker Savings</option>
            <option>Worker Payment</option>
            <option>Rent Savings</option>
            <option>Susu</option>
            <option>Loan Savings</option>
            <option>Profit Savings</option>
          </select>

          <Input placeholder="Amount (GHS)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input placeholder="Person / Worker" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} />
          <Input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />

          <Button className="md:col-span-2" onClick={addRecord}>Add Record</Button>
        </CardContent>
      </Card>

      {/* Export */}
      <Button onClick={exportCSV} className="mb-4">Export to Excel (CSV)</Button>

      {/* Records */}
      <div className="grid gap-3">
        {records.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4">
              <b>{r.type}</b> – GHS {r.amount}
              {r.person && <div>Person: {r.person}</div>}
              {r.note && <div>Note: {r.note}</div>}
              <div className="text-sm text-gray-500">{r.date}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
