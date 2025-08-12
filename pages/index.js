// pages/index.js
import { useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    if (!goal.trim()) return;
    setLoading(true);
    setPlan("");
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      if (data.error) setPlan("خطأ: " + data.error);
      else setPlan(data.plan);
    } catch (e) {
      setPlan("حدث خطأ في الاتصال. حاول مرة أخرى.");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>مولِّد خطة إنتاجية شخصية</h1>
      <p>أدخل هدفك وسأعطيك خطة يومية بسيطة.</p>

      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="مثال: أكتب فصل من كتاب، أو أتعلم جافاسكربت..."
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />

      <div style={{ marginTop: 12 }}>
        <button
          onClick={generatePlan}
          disabled={!goal.trim() || loading}
          style={{ padding: "10px 18px", fontSize: 16 }}
        >
          {loading ? "جارٍ التوليد..." : "احصل على الخطة"}
        </button>
      </div>

      {plan && (
        <pre style={{ marginTop: 20, background: "#f5f5f5", padding: 12, whiteSpace: "pre-wrap" }}>
          {plan}
        </pre>
      )}

      <hr style={{ marginTop: 30 }} />
      <small>ملاحظة: إذا لم تضف مفتاح OpenAI، سيعطي التطبيق خطة تجريبية مجانية (وهمية) للعمل بدون تكلفة.</small>
    </div>
  );
}
