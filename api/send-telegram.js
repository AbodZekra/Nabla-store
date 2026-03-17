export default async function handler(req, res) {
    // تعيين CORS headers للردود
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 ساعة

    // معالجة طلب OPTIONS بشكل منفصل
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // التأكد من أن الطلب POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'الطريقة غير مسموحة' });
    }

    try {
        // قراءة البيانات المرسلة
        const { message, chatId } = req.body;
        
        // التحقق من وجود message
        if (!message) {
            return res.status(400).json({ error: 'الرسالة مطلوبة' });
        }
        
        // جلب التوكن من متغيرات البيئة في Vercel
        const token = process.env.BOT_TOKEN;
        const defaultChatId = process.env.CHAT_ID;
        
        if (!token) {
            console.error('BOT_TOKEN غير موجود في متغيرات البيئة');
            return res.status(500).json({ error: 'خطأ في إعدادات البوت' });
        }

        if (!defaultChatId) {
            console.error('CHAT_ID غير موجود في متغيرات البيئة');
            return res.status(500).json({ error: 'خطأ في إعدادات المحادثة' });
        }

        // استخدام chatId المرسل أو الافتراضي
        const targetChatId = chatId || defaultChatId;

        // إرسال الرسالة إلى تليغرام
        const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: targetChatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await telegramResponse.json();
        
        if (!data.ok) {
            console.error('خطأ من تليغرام:', data);
            return res.status(500).json({ 
                error: 'فشل إرسال الرسالة إلى تليغرام',
                details: data 
            });
        }
        
        // إرجاع النتيجة للموقع
        return res.status(200).json({
            success: true,
            ok: true,
            ...data
        });
        
    } catch (error) {
        console.error('خطأ في الدالة:', error);
        return res.status(500).json({ 
            error: 'فشل الإرسال',
            details: error.message 
        });
    }
}