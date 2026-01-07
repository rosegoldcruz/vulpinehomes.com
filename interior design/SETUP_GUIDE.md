# Vulpine AI Kitchen Visualizer - Complete Setup Guide

## 🦊 Overview
This is a production-ready AI-powered kitchen visualization tool that transforms customer photos in real-time, showing them exactly how their kitchen will look with RefaceKit cabinet products.

## 🚀 Features
- **AI Image Processing**: Uses Replicate AI models to transform kitchen photos
- **Mobile-First Design**: Optimized for social media browsers
- **Lead Capture**: Integrated with Supabase, GoHighLevel, and Twilio
- **Real-Time Visualization**: Before/after slider and side-by-side comparison
- **Automated Follow-Up**: SMS and email notifications to both customer and sales team
- **Style & Color Selection**: All RefaceKit products integrated

## 📋 Prerequisites

1. **Accounts You Need:**
   - Vercel account (for hosting)
   - Supabase account (database and storage)
   - Replicate account (AI image processing)
   - Twilio account (SMS notifications)
   - GoHighLevel account (CRM integration)
   - Resend account (email notifications)

2. **Local Development:**
   - Node.js 18.17.0 or higher
   - npm or yarn package manager

## 🔧 Setup Instructions

### Step 1: Clone and Install

```bash
# Create project directory
mkdir vulpine-visualizer
cd vulpine-visualizer

# Copy the files from this setup
# Then install dependencies
npm install
```

### Step 2: Database Setup (Supabase)

1. Create a new Supabase project
2. Run this SQL to create the leads table:

```sql
CREATE TABLE kitchen_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  doors TEXT,
  drawers TEXT,
  notes TEXT,
  selectedStyle TEXT,
  selectedColor TEXT,
  source TEXT DEFAULT 'vulpine_visualizer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_kitchen_leads_created_at ON kitchen_leads(created_at DESC);
CREATE INDEX idx_kitchen_leads_phone ON kitchen_leads(phone);
```

3. Create a storage bucket called `visualizations` in Supabase Storage
4. Set the bucket to public if you want to display images publicly

### Step 3: Environment Variables

1. Copy `.env.local.template` to `.env.local`
2. Fill in all the required values:

```env
# Get from Supabase dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...

# Get from Replicate.com > Account Settings
REPLICATE_API_TOKEN=r8_xxx...

# Get from OpenAI Platform
OPENAI_API_KEY=sk-xxx...

# Get from Twilio Console
TWILIO_ACCOUNT_SID=ACxxx...
TWILIO_AUTH_TOKEN=xxx...
TWILIO_PHONE_NUMBER=+14805551234
SALES_TEAM_PHONE=+14805559876

# Get from GoHighLevel > Settings > Webhooks
GHL_WEBHOOK_URL=https://api.gohighlevel.com/v1/hooks/xxx

# Get from Resend.com
RESEND_API_KEY=re_xxx...

NEXT_PUBLIC_APP_URL=https://vulpinehomes.com
```

### Step 4: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Add environment variables in Vercel dashboard
4. Add your custom domain (vulpinehomes.com)

### Step 5: GoHighLevel Integration

1. In GoHighLevel, create a webhook:
   - Go to Settings > Webhooks
   - Create new webhook
   - Set endpoint to receive lead data
   - Map fields:
     - first_name
     - last_name
     - phone
     - email
     - city
     - custom fields (doors, drawers, style, color)

2. Create automation workflow:
   - Trigger: New lead from webhook
   - Add to pipeline: "Kitchen Visualizer Leads"
   - Send internal notification
   - Start nurture sequence

### Step 6: Twilio Setup

1. Buy a phone number in Twilio
2. Set up messaging service
3. Configure webhook for replies (optional)
4. Test SMS sending

## 🎨 Customization

### Adding New Door Styles

Edit the `DOOR_STYLES` array in `page.tsx`:

```typescript
const DOOR_STYLES: DoorStyle[] = [
  { id: "newport", name: "Newport", category: "Luxury", image: "/styles/newport.jpg" },
  // Add more styles
];
```

### Adding New Colors

Edit the `DOOR_COLORS` array:

```typescript
const DOOR_COLORS: DoorColor[] = [
  { id: "midnight", name: "Midnight Blue", hex: "#191970" },
  // Add more colors
];
```

### Modifying AI Prompts

Edit prompts in `/app/api/vulpine-ai-visualizer/route.ts`:

```typescript
const STYLE_PROMPTS = {
  newport: "luxury newport style raised panel cabinet doors with ornate details",
  // Add more style descriptions
};
```

## 📱 Mobile Optimization

The tool is optimized for:
- Instagram in-app browser
- Facebook browser
- TikTok browser
- Safari iOS
- Chrome Android

Key optimizations:
- Touch-friendly interface
- Fast loading (< 2 seconds)
- Responsive images
- Simplified forms
- One-thumb navigation

## 🔍 Analytics Integration

Add analytics by installing:

```bash
npm install @vercel/analytics
```

Then add to your layout:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 🚨 Monitoring & Alerts

1. **Vercel Monitoring**: Automatic with deployment
2. **Supabase Monitoring**: Check dashboard for API usage
3. **Twilio Alerts**: Set up balance alerts
4. **Error Tracking**: Consider adding Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 📈 Performance Optimizations

1. **Image Optimization**:
   - Compress uploads before processing
   - Use Next.js Image component
   - Lazy load images

2. **Caching**:
   - Cache AI results for same style/color combinations
   - Use Vercel Edge caching

3. **Database**:
   - Add indexes for common queries
   - Use connection pooling

## 🔐 Security Considerations

1. **Rate Limiting**: Add to prevent abuse
2. **Input Validation**: Validate all form inputs
3. **File Upload Limits**: Max 5MB per image
4. **API Key Security**: Never expose keys client-side

## 🐛 Troubleshooting

### Common Issues:

1. **AI Processing Fails**:
   - Check Replicate API credits
   - Verify API key is correct
   - Check image format (must be base64)

2. **SMS Not Sending**:
   - Verify Twilio account is funded
   - Check phone number format (+1 prefix)
   - Ensure number is SMS-capable

3. **Database Errors**:
   - Check Supabase connection limits
   - Verify service key permissions
   - Check table structure matches code

4. **Slow Performance**:
   - Optimize images before upload
   - Use CDN for static assets
   - Enable Vercel Edge functions

## 📞 Support

For issues or questions:
- Technical: daniel@vulpinehomes.com
- Business: sales@refacekit.com
- Emergency: (480) 555-0123

## 🚀 Launch Checklist

- [ ] All API keys configured
- [ ] Database tables created
- [ ] Storage buckets set up
- [ ] SMS tested and working
- [ ] Email templates approved
- [ ] GoHighLevel webhook active
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Mobile testing complete
- [ ] Load testing performed
- [ ] Backup system in place
- [ ] Monitoring alerts configured
- [ ] Team trained on lead handling
- [ ] Legal/privacy policy added
- [ ] Analytics tracking verified

## 📊 Expected Performance

- **Page Load**: < 2 seconds
- **AI Processing**: 5-10 seconds per image
- **Lead Capture**: < 1 second
- **SMS Delivery**: < 5 seconds
- **Uptime Target**: 99.9%

## 🎯 Business Metrics to Track

1. **Conversion Rate**: Uploads → Leads
2. **Engagement Rate**: Style changes, comparisons
3. **Lead Quality**: Contact rate, close rate
4. **Cost Per Lead**: API costs / leads
5. **Response Time**: Lead → First contact

---

**Built by Daniel Cruz for RefaceKit/Vulpine Homes**
*Transform Kitchens. Transform Lives.*