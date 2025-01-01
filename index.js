const { createCanvas, loadImage } = require('canvas');
const express = require('express');

const app = express();

app.use(express.json());

app.post('/generate', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Please provide an imageUrl' });
    }

    try {
        const image = await loadImage(imageUrl);

        // إنشاء كانفاس بنفس أبعاد الصورة
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // رسم الصورة على الكانفاس
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // إعدادات النص
        ctx.font = `${image.width / 10}px Arial`; // حجم الخط النسبي للصورة
        ctx.fillStyle = 'white'; // لون النص
        ctx.textAlign = 'center'; // محاذاة النص
        ctx.textBaseline = 'middle'; // جعل النص في المنتصف

        // كتابة النص
        ctx.fillText('هلا', image.width / 2, image.height / 2);

        // تحويل الصورة إلى Buffer
        const buffer = canvas.toBuffer('image/png');

        // إرسال الصورة
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process the image' });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
