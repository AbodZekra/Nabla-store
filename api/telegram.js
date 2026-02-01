// api/telegram.js
export default async function handler(req, res) {
    // ===== 1. إعدادات CORS =====
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // التعامل مع طلبات OPTIONS (لـ CORS Preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // ===== 2. التحقق من طريقة الطلب =====
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            message: 'يسمح فقط بطلبات POST'
        });
    }
    
    try {
        // ===== 3. الحصول على البيانات من الطلب =====
        const { type, user, product, message } = req.body;
        
        console.log('📩 بيانات الطلب المستلمة:', { type, user: { name: user?.name }, product: { name: product?.name } });
        
        // ===== 4. التحقق من البيانات الأساسية =====
        if (!type || !user || !user.name || !user.whatsapp) {
            return res.status(400).json({
                success: false,
                message: 'بيانات ناقصة. يرجى إرسال نوع الطلب، اسم المستخدم، ورقم الواتساب.'
            });
        }
        
        // ===== 5. الحصول على التوكن ورقم الدردشة من Environment Variables =====
        const BOT_TOKEN = process.env.BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;
        
        console.log('🔐 التحقق من Environment Variables...');
        console.log('BOT_TOKEN موجود:', !!BOT_TOKEN);
        console.log('CHAT_ID موجود:', !!CHAT_ID);
        
        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('❌ خطأ: التوكن أو معرف الدردشة غير مضبوط');
            return res.status(500).json({
                success: false,
                message: 'خطأ في إعدادات السيرفر. يرجى التحقق من Environment Variables.'
            });
        }
        
        // ===== 6. تنظيف رقم الهاتف =====
        const cleanPhone = (phone) => {
            return phone.replace(/[^0-9]/g, '');
        };
        
        const phoneNumber = cleanPhone(user.whatsapp);
        const whatsappLink = `https://wa.me/${phoneNumber}`;
        
        // ===== 7. بناء الرسالة حسب النوع =====
        let telegramMessage = '';
        const timestamp = new Date().toLocaleString('ar-SA', {
            timeZone: 'Asia/Riyadh',
            dateStyle: 'full',
            timeStyle: 'medium'
        });
        
        if (type === 'booking') {
            // رسالة حجز منتج
            telegramMessage = `
🎯 **طلب حجز جديد - متجر نابلا** 🎯

👤 **العميل:** ${user.name}
📱 **الواتساب:** ${user.whatsapp}
🔢 **الهاتف النظيف:** ${phoneNumber}

🛒 **المنتج:** ${product?.name || 'غير محدد'}
💰 **السعر:** ${product?.price || 'غير محدد'} ${product?.currency || 'ريال'}
📂 **الفئة:** ${product?.category || 'عام'}
⏰ **المدة:** ${product?.period || product?.duration || 'شهري'}

📝 **ملاحظات العميل:**
${product?.notes || 'لا توجد ملاحظات'}

${product?.features && product.features.length > 0 ? `✨ **المميزات:**\n${product.features.map(f => `• ${f}`).join('\n')}\n\n` : ''}

🕐 **وقت الطلب:** ${timestamp}
📌 **معرف الطلب:** ${Date.now()}

🔗 **رابط التواصل المباشر:** ${whatsappLink}
            `;
        } 
        else if (type === 'contact') {
            // رسالة تواصل
            telegramMessage = `
📩 **رسالة تواصل جديدة - متجر نابلا** 📩

👤 **المرسل:** ${user.name}
📱 **الواتساب:** ${user.whatsapp}
🔢 **الهاتف النظيف:** ${phoneNumber}

💬 **الرسالة:**
${message || 'لا توجد رسالة'}

🕐 **وقت الإرسال:** ${timestamp}

🔗 **رابط التواصل المباشر:** ${whatsappLink}
            `;
        } else {
            return res.status(400).json({
                success: false,
                message: 'نوع الطلب غير معروف. يجب أن يكون booking أو contact.'
            });
        }
        
        console.log('📨 إعداد رسالة التليجرام...');
        console.log('طول الرسالة:', telegramMessage.length, 'حرف');
        
        // ===== 8. إرسال الرسالة إلى بوت التليجرام =====
        const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            })
        });
        
        const telegramData = await telegramResponse.json();
        console.log('📤 رد التليجرام:', telegramData);
        
        // ===== 9. التحقق من نجاح الإرسال =====
        if (telegramData.ok) {
            console.log('✅ تم إرسال الرسالة بنجاح:', telegramData.result.message_id);
            
            // إنشاء رسالة ترحيبية للواتساب
            let whatsappWelcomeMessage = '';
            if (type === 'booking') {
                whatsappWelcomeMessage = `السلام عليكم ورحمة الله وبركاته 🌟\n\nأهلاً وسهلاً بك ${user.name}!\n\nلقد تلقينا طلبك للحصول على ${product?.name || 'المنتج المطلوب'}.\nسنتواصل معك خلال 24 ساعة لتأكيد الطلب وتنفيذه.\n\nشكراً لثقتك بنا!`;
            } else {
                whatsappWelcomeMessage = `السلام عليكم ورحمة الله وبركاته 🌟\n\nأهلاً وسهلاً بك ${user.name}!\n\nلقد تلقينا رسالتك وسنرد عليك خلال 24 ساعة.\n\nشكراً لتواصلك مع متجر نابلا!`;
            }
            
            const encodedMessage = encodeURIComponent(whatsappWelcomeMessage);
            const whatsappWelcomeLink = `${whatsappLink}?text=${encodedMessage}`;
            
            // ===== 10. الرد النهائي =====
            return res.status(200).json({
                success: true,
                message: 'تم إرسال الطلب بنجاح!',
                messageId: telegramData.result.message_id,
                whatsappLink: whatsappWelcomeLink,
                timestamp: new Date().toISOString(),
                debug: {
                    phoneCleaned: phoneNumber,
                    messageLength: telegramMessage.length
                }
            });
            
        } else {
            console.error('❌ خطأ من التليجرام:', telegramData);
            
            // محاولة بديلة: حفظ في السجل
            const errorLog = {
                type: type,
                user: user,
                product: product,
                message: message,
                error: telegramData.description,
                timestamp: new Date().toISOString()
            };
            
            console.error('📋 سجل الخطأ:', errorLog);
            
            // مع ذلك، نرد بنجاح للمستخدم مع تحذير
            return res.status(200).json({
                success: false,
                message: 'تم استلام طلبك ولكن هناك مشكلة تقنية في الإرسال',
                error: telegramData.description,
                received: true,
                fallback: true,
                whatsappLink: whatsappLink,
                manualMessage: 'يمكنك التواصل معنا مباشرة عبر الواتساب'
            });
        }
        
    } catch (error) {
        console.error('❌ خطأ في السيرفر:', error);
        
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ داخلي في السيرفر',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}