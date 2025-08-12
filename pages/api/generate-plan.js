// pages/api/generate-plan.js
import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { goal } = req.body;
  if (!goal || !goal.trim()) return res.status(400).json({ error: "Please provide a valid goal" });

  // إذا ما عندك مفتاح OpenAI، نرجع خطة تجريبية (بدون تكلفة)
  if (!client) {
    const demo = `خطة يومية قصيرة لتحقيق: ${goal}\n\n1) حدد أهم مهمة اليوم (30-60 دقيقة).\n2) قسم العمل إلى فترات 25-50 دقيقة مع استراحات قصيرة.\n3) حدد وقت للمراجعة المسائية (10 دقائق).\n4) إذا تعطلت: ارجع للخطوة 1 وقلّل حجم المهمة.\n\nنصيحة: اكتب ثلاث مهام رئيسية فقط اليوم وابدأ بالأصعب.`;
    return res.status(200).json({ plan: demo });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "أنت مساعد إنتاجية مختصر وواضح باللغة العربية." },
        { role: "user", content: `أعطني خطة يومية مبسطة ومباشرة لتحقيق هذا الهدف: ${goal}` }
      ],
      max_tokens: 400
    });

    const plan = response?.choices?.[0]?.message?.content || response?.choices?.[0]?.text || "لم يتم توليد خطة.";
    res.status(200).json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل في الاتصال بخدمة الذكاء. تفقد السجلات." });
  }
}
