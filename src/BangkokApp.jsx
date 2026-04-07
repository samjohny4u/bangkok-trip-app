import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ============ TRIP DATA ============
const TRIP_DATA = {
  hotel: { name: "Storybook Flora", address: "57/14 Soi Ratchaprarop 8, Makkasan", lat: 13.7563, lng: 100.5418 },
  emergency: [
    { label: "Tourist Police", number: "1155" },
    { label: "Medical Emergency", number: "1669" },
    { label: "Bumrungrad Hospital", number: "+6622667000" },
    { label: "Jurassic World", number: "+66968213089" },
    { label: "White Orchid Cruise", number: "+66632673536" },
    { label: "Space & Time Cube+", number: "+66655811917" },
  ],
  goBag: {
    always: [
      "4-6 diapers + wipes", "1 change of clothes per kid", "2x power banks (CHARGED) + cables", "GoPro (charged)",
      "Sunscreen", "Mosquito repellent", "ORS sachets", "Cash in zip bag (small notes)",
      "Waterproof phone pouch", "Passport photocopies", "Hand sanitizer + tissues",
      "2-3 snack packs for daughter", "Baby carrier (folded)", "Pocari Sweat / electrolytes"
    ],
    daySpecific: {
      "2026-04-07": ["Smart casual for Red Sky Bar", "No flip-flops/sleeveless for men"],
      "2026-04-08": ["Extra snacks — longest day of the trip"],
      "2026-04-09": ["🚨 CARRIER ONLY tonight. Leave BOTH strollers at hotel"],
      "2026-04-13": ["Waterproof pouch", "Quick-dry clothes", "Water shoes", "Dark colours"],
      "2026-04-14": ["Waterproof pouch", "Quick-dry clothes", "Water shoes", "Dark colours"],
      "2026-04-15": ["Waterproof pouch if Songkran still active"],
    }
  },
  days: [
    {
      date: "2026-04-06", dow: "MON", title: "ARRIVAL + NANA + TERMINAL 21",
      theme: "Light arrival day. No Dusit. No buggy yet.",
      booked: [],
      alerts: ["No compact buggy — daughter walks today. Keep distances short.", "Buy Pocari Sweat + ORS at 7-Eleven near hotel."],
      budget: { food: "600-900", transport: "300-400", activities: "0" },
      timeline: [
        { time: "07:10", end: "09:30", activity: "Land DMK → Taxi to hotel", type: "transit", dur: 140, location: "Don Mueang Airport", lat: 13.9126, lng: 100.6068, details: "SIM cards + pharmacy at airport. Taxi ~200-350 THB with tolls. Order buggy on Lazada." },
        { time: "09:30", end: "10:15", activity: "7-Eleven supplies run", type: "flex", dur: 45, location: "Near hotel", details: "Pocari Sweat 4+ bottles, water, snacks, diapers, wipes." },
        { time: "10:30", end: "11:30", activity: "Nana noodles", type: "food", dur: 60, location: "Nana area", lat: 13.7407, lng: 100.5530, details: "Street vendor in Nana area. Grab from hotel ~60-70 THB." },
        { time: "11:45", end: "15:00", activity: "Terminal 21 Asok", type: "activity", dur: 195, location: "Terminal 21", lat: 13.7376, lng: 100.5601, floor: "Pier 21 food court, 5F", details: "Basecamp: back of food court, glass windows. BTS Nana → Asok (1 stop)." },
        { time: "15:00", end: "15:30", activity: "Dough Bros donuts", type: "food", dur: 30, location: "Interchange 21, Asok", lat: 13.7370, lng: 100.5605, details: "Same BTS exit. Nutella filled, Thai tea flavor. Grab and go." },
        { time: "15:30", end: "18:00", activity: "CentralWorld browse", type: "activity", dur: 150, location: "CentralWorld", lat: 13.7466, lng: 100.5392, details: "BTS Asok → Siam (2 stops). St. Paul palmiers, After You, Make Me Mango (L3), Wanjai Café (7F)." },
        { time: "18:00", end: "19:00", activity: "Walk to hotel via Pratunam", type: "transit", dur: 60, location: "Pratunam area", details: "Orient yourselves. Hotel neighbourhood." },
      ],
      food: [
        { name: "Nana Noodles", where: "Nana area street vendor", thai: null, order: "Ask locals", kid: true },
        { name: "Cheese Tart", where: "Terminal 21, food court upper floors", thai: null, order: "Point and order", kid: true },
        { name: "Calore Pork Rice", where: "Terminal 21, Pier 21 5F", thai: "ข้าวหมูคั่วไก่", order: "Point and order", kid: true },
        { name: "Roti-Curry", where: "Terminal 21, Pier 21 5F", thai: "โรตี แกงมัสซามัน", order: "Point and order", kid: true },
        { name: "Dough Bros Donuts", where: "Interchange 21, Asok", thai: null, order: "Nutella filled, Thai tea flavor", kid: true },
        { name: "St. Paul Palmiers", where: "CentralWorld (verify floor)", thai: null, order: "Point and order", kid: true },
        { name: "After You Kakigori", where: "CentralWorld", thai: null, order: "Order from menu", kid: true },
        { name: "Make Me Mango", where: "CentralWorld L3", thai: null, order: "Mango sticky rice + ice cream", kid: true },
        { name: "Wanjai Café Shaved Ice", where: "CentralWorld 7F", thai: null, order: "Order from menu", kid: true },
      ]
    },
    {
      date: "2026-04-07", dow: "TUE", title: "SEA LIFE + SIAM/MBK + RED SKY BAR",
      theme: "Indoor mall crawl. No buggy yet — daughter walks.",
      booked: [{ name: "SEA LIFE Ocean World", time: "Flexible", ref: "TE0310122510000049", note: "Siam Paragon B1-B2. 4 travellers." }],
      alerts: ["No compact buggy yet — plan sit-down breaks for daughter.", "Smart casual for Red Sky Bar (no flip-flops/sleeveless)."],
      budget: { food: "1200-1800", transport: "200-300", activities: "2000-3000 (Red Sky)" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit Central Park breakfast", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, floor: "Parkside Market, LG Floor", details: "Basecamp: corner booth, pram as 4th chair. Vendors: Pranom chicken rice + Cheese Roti. 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "10:30", end: "11:00", activity: "BTS to Siam", type: "transit", dur: 30, location: "BTS Sala Daeng → Siam", details: "Direct, 2 stops." },
        { time: "11:00", end: "13:00", activity: "SEA LIFE Ocean World", type: "booked", dur: 120, location: "Siam Paragon B1-B2", lat: 13.7462, lng: 100.5347, details: "BOOKED — flexible entry. Stroller OK. Kids under 3 free." },
        { time: "13:00", end: "13:30", activity: "Siam Paragon food", type: "food", dur: 30, location: "Siam Paragon", details: "Thongyoy Café has RELOCATED — verify new location on arrival. After You backup dessert stop." },
        { time: "13:30", end: "16:00", activity: "MBK Center food crawl", type: "food", dur: 150, location: "MBK Center", lat: 13.7441, lng: 100.5300, floor: "6F & 7F food courts", details: "Skywalk from Siam. Basecamp: pillar tables. Mo-Mo 7F, Takoyaki hunt 5-6F, Guay Jub Dum Nern 6F, Pad Thai 6F. ⏱ Set 10-min search limit per stall — if not found, move on." },
        { time: "16:00", end: "17:00", activity: "Don Don Donki", type: "activity", dur: 60, location: "MBK 2F, old Tokyu side", details: "BTS National Stadium Exit 4. Sushi, snacks, Japanese products." },
        { time: "17:00", end: "17:30", activity: "Walk to CentralWorld", type: "transit", dur: 30, location: "Skywalk", details: "Browse if not done Apr 6." },
        { time: "17:30", end: "19:00", activity: "Red Sky Bar sunset", type: "activity", dur: 90, location: "Centara Grand, 55F", lat: 13.7468, lng: 100.5393, details: "All ages. Sunset 17:30-18:30. Budget 2-3K THB. Smart casual." },
        { time: "19:00", end: "19:45", activity: "BTS home", type: "transit", dur: 45, location: "BTS", details: "Any Siam-area BTS station." },
      ],
      food: [
        { name: "Pranom Chicken Rice", where: "Dusit, Parkside Market", thai: "ข้าวไก่ตุ๋น", order: "ข้าวไก่ตุ๋น 1 จาน ไม่เผ็ด ครับ", kid: true, visual: "Bowls of dark-braised chicken, 'Pranom' sign." },
        { name: "Cheese Roti", where: "Dusit, Parkside Market", thai: "โรตีเชียร์ส", order: "โรตีเชียร์ส 1 ชิ้น ไม่หวานมาก ครับ", kid: true, visual: "Vendor stretching thin dough on griddle." },
        { name: "Mo-Mo-Paradise Shabu", where: "MBK 7F (moved from 6F)", thai: null, order: "Buffet, 259-450 THB/person. 1hr 40min limit.", kid: true },
        { name: "Takoyaki", where: "MBK 5-6F (also at Siam Paragon basement food hall)", thai: null, order: "Walk entire food court systematically", kid: true },
        { name: "Guay Jab Nam Khon", where: "MBK 6F Food Legends — stall: Guay Jub Dum Nern", thai: null, order: "Point and order", kid: true, visual: "Dark broth, rolled noodles, crispy pork. ⏱ Hard to find — 10 min search max then move on." },
        { name: "Pad Thai Shrimp", where: "MBK 6F", thai: "ผัดไทยกุ้ง", order: "ผัดไทยกุ้ง ไม่เผ็ดมาก", kid: true },
      ]
    },
    {
      date: "2026-04-08", dow: "WED", title: "ASIATIQUE MEGA-DAY",
      theme: "Full day at one location. Heaviest day. Buggy arrives!",
      booked: [
        { name: "Jurassic World", time: "1:30 PM", ref: "TE0310122540000029", note: "Arrive by 1:15. 3 travellers. Single entry." },
        { name: "White Orchid Cruise", time: "7:30 PM", ref: "BR-1342231229", note: "Exchange voucher by 7:00 PM. 4 travellers." }
      ],
      alerts: ["Check hotel reception for Lazada buggy delivery!", "White Orchid: exchange voucher at meeting point BEFORE cruise. Arrive by 7:00 PM."],
      budget: { food: "400-600", transport: "400-600", activities: "640-960 (SkyFlyers)" },
      timeline: [
        { time: "08:00", end: "08:30", activity: "Check buggy delivery", type: "flex", dur: 30, location: "Hotel reception", details: "Lazada compact buggy should have arrived." },
        { time: "08:30", end: "10:30", activity: "Dusit Central Park breakfast", type: "food", dur: 120, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Vendors: Nakhon Pathom Tom Yum Noodle (Michelin — order Nam Sai for kids) + Thong Smith Boat Noodles. 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "11:00", end: "12:30", activity: "Return / head south", type: "transit", dur: 90, location: "Hotel area", details: "Quick refresh or head directly to Asiatique." },
        { time: "12:30", end: "13:15", activity: "Taxi to Asiatique", type: "transit", dur: 45, location: "Asiatique", lat: 13.7074, lng: 100.5041, details: "Taxi ~150 THB off-peak. Arrive by 1:00 PM." },
        { time: "13:30", end: "15:00", activity: "Jurassic World", type: "booked", dur: 90, location: "Asiatique", details: "BOOKED 1:30 PM. 6,000+ sqm. Indoor AC. Pram OK. Single entry only." },
        { time: "15:00", end: "16:30", activity: "SkyFlyers", type: "activity", dur: 90, location: "Asiatique (next to JW)", details: "135m giant swing. 320 THB each. Check height for daughter." },
        { time: "16:30", end: "17:30", activity: "Browse Asiatique", type: "activity", dur: 60, location: "Asiatique riverside", details: "Shops open ~4-5 PM. Flat riverside promenade, pram-friendly." },
        { time: "17:30", end: "18:30", activity: "Riverside dinner", type: "food", dur: 60, location: "Asiatique restaurant", details: "Early dinner at a riverside restaurant inside Asiatique." },
        { time: "18:45", end: "19:30", activity: "Voucher exchange", type: "booked", dur: 45, location: "Asiatique meeting point", details: "⚠️ Exchange White Orchid voucher. BE THERE BY 7:00 PM." },
        { time: "19:30", end: "21:30", activity: "White Orchid Cruise", type: "booked", dur: 120, location: "Chao Phraya River", details: "Thai buffet + seafood + Thai dance + live band. Free beer. Tips not included." },
        { time: "22:00", end: "22:45", activity: "Taxi home", type: "transit", dur: 45, location: "Hotel", details: "~200-300 THB late evening." },
      ],
      food: [
        { name: "Nakhon Pathom Tom Yum Noodle", where: "Dusit (Michelin)", thai: null, order: "Ask for 'Nam Sai' (clear broth, no chili) for kids", kid: true, visual: "Massive queue, Michelin signs." },
        { name: "Thong Smith Boat Noodles", where: "Dusit", thai: "ก๋วยเตี๋ยวเรือ", order: "ก๋วยเตี๋ยวเรือ 3 ถ้วย ไม่เผ็ดมาก ครับ", kid: false, visual: "Booth #1 in Michelin row." },
      ]
    },
    {
      date: "2026-04-09", dow: "THU", title: "EM DISTRICT + CHINATOWN",
      theme: "Morning malls, evening street food. CARRIER ONLY for Chinatown.",
      booked: [],
      alerts: ["🚨 CARRIER ONLY tonight. Leave BOTH strollers at hotel before Chinatown.", "Chinatown: max 4 food stops with kids. Hit Tier 1 first."],
      budget: { food: "800-1200", transport: "500-600", activities: "0" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit breakfast", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Vendors: Shangra Law House shrimp noodles + New Camp beef skewers. 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "10:30", end: "11:00", activity: "Transit to EM District", type: "transit", dur: 30, location: "MRT/BTS", details: "MRT Silom → Sukhumvit → BTS Asok → Phrom Phong." },
        { time: "11:00", end: "14:00", activity: "EM District malls", type: "activity", dur: 180, location: "EM District", lat: 13.7311, lng: 100.5693, details: "Emsphere, Emporium, EmQuartier. Dior Gold House (free). After You at EmQuartier." },
        { time: "14:30", end: "16:00", activity: "Free time / Baan Suan", type: "flex", dur: 90, location: "Flexible", details: "Baan Suan Sathorn garden café (~15 min taxi) or rest at EM District." },
        { time: "16:30", end: "17:15", activity: "Return hotel, prep carrier", type: "transit", dur: 45, location: "Hotel", details: "⚠️ Leave BOTH strollers at hotel. Pack baby carrier." },
        { time: "17:30", end: "20:00", activity: "Chinatown food run", type: "food", dur: 150, location: "Yaowarat Road", lat: 13.7412, lng: 100.5083, details: "Taxi ~100-120 THB. NO PRAMS. Carrier only. MRT: Wat Mangkon." },
        { time: "20:00", end: "20:30", activity: "Taxi home", type: "transit", dur: 30, location: "Hotel", details: "~100-150 THB." },
      ],
      food: [
        { name: "Shangra Law House Noodles", where: "Dusit", thai: "ผัดกุ้งเส้นหมี่", order: "ผัดกุ้งเส้นหมี่ เผ็ดน้อย ครับ ใส่กุ้งเยอะๆ", kid: false, visual: "Wok station with big flames." },
        { name: "New Camp Beef Skewers", where: "Dusit", thai: "เนื้อย่างเสียบไม้", order: "เนื้อย่าง 4 ไม้ ไม่เผ็ดมาก ครับ", kid: true, visual: "Charcoal grill with skewers." },
        { name: "Yaowarat Toasted Buns ⭐", where: "Chinatown, front of GSB bank", thai: null, order: "Paper slip: pandan custard, egg custard, milk. Get crispy.", kid: true, visual: "GPS: 13.741199, 100.508343. Opens 7PM.", tier: 1 },
        { name: "Pa Tong Go Savoey ⭐", where: "Chinatown, Yaowarat", thai: null, order: "Pandan custard + Thai milk tea custard dip", kid: true, visual: "Giant bronze wok landmark.", tier: 1 },
        { name: "Thai Hang Chicken Rice ⭐", where: "Chinatown", thai: null, order: "Khao Man Gai (chicken rice) + Suki Hang for adults", kid: true, tier: 1 },
        { name: "Lek & Rut Tod Mun Goong ⭐", where: "Chinatown, Soi Texas", thai: null, order: "Deep-fried shrimp patties + Goong Pao prawns", kid: true, tier: 1 },
        { name: "Khao Gaeng Jake Puey", where: "Chinatown", thai: null, order: "Pad Pu (crab) + Panang Mu (pork curry)", kid: true, tier: 2 },
      ]
    },
    {
      date: "2026-04-10", dow: "FRI", title: "MELAND + MOPPET + EVENING FLEX",
      theme: "Kids energy burn + luxury shopping.",
      booked: [],
      alerts: ["Moppet flea market ends April 12. If skipped today, only chance is Apr 12."],
      budget: { food: "600-900", transport: "400-600", activities: "1250-1830 (Meland)" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit breakfast", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Vendors: Thai Crispy Crepe + Isan Som Tam & Gai Yang (kids: chicken + sticky rice). 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "10:30", end: "11:00", activity: "BTS to Siam", type: "transit", dur: 30, details: "BTS Sala Daeng → Siam." },
        { time: "11:00", end: "14:00", activity: "Meland Theme Park", type: "activity", dur: 180, location: "Siam Paragon 5F North", lat: 13.7462, lng: 100.5347, details: "5,000 sqm, 6 zones. ~1,250-1,830 THB/child. Non-slip socks ~60-100 THB. Leave pram at entrance." },
        { time: "14:30", end: "15:00", activity: "BTS to Chit Lom", type: "transit", dur: 30, details: "1 stop." },
        { time: "15:00", end: "17:00", activity: "Moppet Luxury Flea Market", type: "activity", dur: 120, location: "The Market Bangkok", lat: 13.7440, lng: 100.5407, details: "Pre-loved luxury brands. Ends Apr 12. Connected to BTS Chit Lom." },
        { time: "17:30", end: "18:00", activity: "Return hotel", type: "transit", dur: 30, details: "Quick refresh." },
        { time: "19:00", end: "21:00", activity: "Evening: Pak Nam OR June Pang", type: "flex", dur: 120, location: "Choose one", details: "A: Pak Nam Night Market (BTS to Pak Nam, ~45 min). B: June Pang Bakery (MRT Sam Yan, pandan toast 159 THB, cash only, opens 4 PM)." },
      ],
      food: [
        { name: "Thai Crispy Crepe", where: "Dusit", thai: "ครีปเป้กรอบ", order: "ครีปเป้กรอบ ช็อกโกแลต 1 ชิ้น ครับ", kid: true, visual: "Thin crepe on flat griddle." },
        { name: "Gai Yang + Sticky Rice", where: "Dusit", thai: "ส้มตำแก่ย่าง ข้าวเหนียว", order: "ส้มตำแก่ย่าง ข้าวเหนียว ไม่เผ็ดมาก ครับ", kid: true, visual: "Mortar-and-pestle, charcoal drum grill." },
        { name: "June Pang Pandan Toast", where: "1529-1531 Banthat Thong Rd", thai: null, order: "Pandan Custard Toast + Coconut Milk Ice Cream (159 THB). Cash only.", kid: true },
      ]
    },
    {
      date: "2026-04-11", dow: "SAT", title: "SPACE & TIME CUBE + FLEX",
      theme: "West MRT day. Dusit on the way.",
      booked: [{ name: "Space & Time Cube+", time: "2:00 PM", ref: "TE0315022690000038", note: "Seacon Bangkae, Floor B, B43. Under 80cm free." }],
      alerts: [],
      budget: { food: "600-900", transport: "300-400", activities: "0 (prepaid)" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit breakfast", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Vendors: Adults treat — Sakon Nakhon Som Tam (NOT for kids) + Bottomless Coffee 5F. Kids: repeat Pranom. 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "10:30", end: "11:30", activity: "MRT to Seacon Bangkae", type: "transit", dur: 60, details: "MRT Silom → Blue Line → Phasi Charoen (BL37), Exit 1. ~30 min." },
        { time: "11:30", end: "13:30", activity: "Seacon Bangkae lunch", type: "food", dur: 120, location: "Seacon Bangkae", lat: 13.7159, lng: 100.4047, details: "Food court lunch + Don Don Donki B1-B2." },
        { time: "14:00", end: "16:00", activity: "Space & Time Cube+", type: "booked", dur: 120, location: "Seacon Bangkae, Floor B, B43", details: "BOOKED 2 PM. 27 rooms + 4D Rail Cinema. Pram OK. Under 80cm free." },
        { time: "16:30", end: "17:15", activity: "MRT back central", type: "transit", dur: 45, details: "Optional: MRT Wat Mangkon for quick Chinatown snack." },
        { time: "18:00", end: "21:00", activity: "Evening flex", type: "flex", dur: 180, location: "Flexible", details: "June Pang if not done (MRT Sam Yan). OR Pak Nam. OR rest." },
      ],
      food: [
        { name: "Bottomless Coffee", where: "Dusit 5F", thai: null, order: "House blend. Adults only.", kid: false },
        { name: "Don Don Donki snacks", where: "Seacon Bangkae B1-B2", thai: null, order: "Browse and grab", kid: true },
      ]
    },
    {
      date: "2026-04-12", dow: "SUN", title: "ICONSIAM + MAKRO",
      theme: "Riverside mall + hypermarket.",
      booked: [],
      alerts: ["⚖️ ICONSIAM = quadruple dessert risk. Eat savory BETWEEN desserts.", "Moppet flea market ENDS TODAY. Taxi to Chit Lom on way back if not done."],
      budget: { food: "800-1200", transport: "400-500", activities: "0" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit breakfast", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Wildcard — repeat favourites or try new. 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "10:30", end: "11:00", activity: "Transit to ICONSIAM", type: "transit", dur: 30, details: "MRT → BTS Sala Daeng → BTS Krung Thon Buri → Gold Line (16 THB flat)." },
        { time: "11:00", end: "15:00", activity: "ICONSIAM Sook Siam", type: "food", dur: 240, location: "ICONSIAM", lat: 13.7268, lng: 100.5100, floor: "Sook Siam, Ground Floor", details: "Basecamp: outer perimeter near Dear Tummy. Skip chaotic center." },
        { time: "15:00", end: "15:30", activity: "Gold Line → BTS Chong Nonsi", type: "transit", dur: 30, details: "Silom Line." },
        { time: "15:30", end: "17:30", activity: "Makro Sathon", type: "activity", dur: 120, location: "Makro Sathon", lat: 13.7210, lng: 100.5285, details: "~10 min walk from BTS Chong Nonsi. Bulk snacks, souvenirs. 2 hours." },
        { time: "17:30", end: "19:00", activity: "Market Bangkok (near Platinum Mall)", type: "activity", dur: 90, location: "The Market Bangkok, Ratchadamri Rd", lat: 13.7440, lng: 100.5407, details: "Near Platinum Mall, Pratunam area. Browse before heading home. Connected to BTS Chit Lom." },
        { time: "19:00", end: "19:45", activity: "Taxi home", type: "transit", dur: 45, details: "With shopping bags." },
      ],
      food: [
        { name: "Kanum Krok", where: "ICONSIAM Sook Siam GF", thai: null, order: "Point and order", kid: true },
        { name: "Kanom Chin Nam Ya", where: "ICONSIAM Sook Siam", thai: "ขนมจีนน้ำยา", order: "ขนมจีนน้ำยา ครับ ไม่เผ็ดมาก", kid: true },
        { name: "Muslim Roti + Curry", where: "ICONSIAM Sook Siam", thai: "โรตีกับแกง", order: "โรตีกับแกง ครับ ใส่ผักเยอะๆ จานใหญ่", kid: true },
        { name: "Salapao Dumplings", where: "ICONSIAM Sook Siam", thai: "ซาลาเปา", order: "ซาลาเปา 8 ชิ้น ครับ", kid: true },
        { name: "Skewered Pork Rice", where: "ICONSIAM waterfront entrance", thai: null, order: "Point and order", kid: true },
        { name: "Pandan + Coconut Ice Cream", where: "ICONSIAM near Dear Tummy", thai: null, order: "Point and order", kid: true },
        { name: "Hom Charoen Dessert", where: "ICONSIAM", thai: null, order: "Point and order", kid: true },
      ]
    },
    {
      date: "2026-04-13", dow: "MON", title: "SONGKRAN DAY 1: MALL CELEBRATION",
      theme: "Thai New Year. Mall/skywalk viewing only. Train only.",
      booked: [],
      alerts: ["🎉 SONGKRAN — TRAIN ONLY. No taxis.", "View water fights from skywalks. Do NOT go street level with kids."],
      budget: { food: "600-900", transport: "200-300", activities: "0" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit breakfast (MRT)", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Take MRT, not taxi. Repeat favourites." },
        { time: "10:30", end: "11:00", activity: "BTS to Siam", type: "transit", dur: 30, details: "BTS Sala Daeng → Siam." },
        { time: "11:00", end: "17:00", activity: "Siam area mall crawl", type: "activity", dur: 360, location: "CentralWorld / Siam Paragon / MBK", lat: 13.7466, lng: 100.5392, details: "All connected by skywalks. Watch water fights from above. CentralWorld family celebrations." },
        { time: "17:00", end: "18:30", activity: "Skywalk Songkran viewing", type: "activity", dur: 90, location: "Chit Lom-Siam skywalks", details: "Celebrations peak late afternoon." },
        { time: "19:00", end: "20:00", activity: "Indoor dinner + BTS home", type: "food", dur: 60, location: "Siam area mall", details: "Train only home." },
      ],
      food: [
        { name: "After You", where: "CentralWorld", thai: null, order: "Order from menu", kid: true },
        { name: "St. Paul Palmiers", where: "CentralWorld", thai: null, order: "Restock if loved on Apr 6", kid: true },
        { name: "Roast Duck Rice", where: "MBK", thai: null, order: "Point and order", kid: true },
        { name: "Khao Mok Gai", where: "MBK", thai: null, order: "Point and order", kid: true },
      ]
    },
    {
      date: "2026-04-14", dow: "TUE", title: "SONGKRAN DAY 2: FLEX + PLANNED",
      theme: "Morning flex. Afternoon EM District. Train only.",
      booked: [],
      alerts: ["TRAIN ONLY — Songkran still active."],
      budget: { food: "600-900", transport: "200-300", activities: "0" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit breakfast (MRT)", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Repeat favourites." },
        { time: "10:30", end: "13:00", activity: "FLEX: Catch up", type: "flex", dur: 150, location: "Flexible", details: "MBK remaining food, Terminal 21 shopping, Meland revisit, or any missed item." },
        { time: "14:00", end: "17:00", activity: "EM District revisit", type: "activity", dur: 180, location: "EM District", lat: 13.7311, lng: 100.5693, details: "Second pass. After You at EmQuartier. Emsphere food hall." },
        { time: "17:00", end: "18:30", activity: "Songkran skywalk viewing", type: "activity", dur: 90, location: "Phrom Phong or Siam skywalks", details: "Last Songkran viewing." },
        { time: "19:00", end: "20:00", activity: "Dinner + BTS home", type: "food", dur: 60, location: "EM District", details: "Train only." },
      ],
      food: [
        { name: "MBK Pork Skewers", where: "MBK 6F", thai: "หมูเสียบไม้", order: "หมูเสียบ 4 ไม้ ไม่เผ็ดมาก", kid: true },
        { name: "Thai Fried Rice", where: "MBK 6F", thai: "ข้าวผัดหมู", order: "ข้าวผัดหมู ไม่เผ็ดมาก", kid: true },
        { name: "Calore Grub", where: "MBK 7F", thai: null, order: "Point and order", kid: true },
        { name: "Saang Sang Crab Noodles", where: "MBK 7F", thai: null, order: "Point and order", kid: true },
      ]
    },
    {
      date: "2026-04-15", dow: "WED", title: "FULL FLEX DAY",
      theme: "Catch up on anything missed.",
      booked: [],
      alerts: ["Check your food checklist — what's still unchecked?"],
      budget: { food: "Variable", transport: "Variable", activities: "Variable" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit breakfast", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Any remaining untried stall. 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "10:30", end: "17:00", activity: "FLEX: Choose from list", type: "flex", dur: 390, location: "Variable", details: "Pak Nam / June Pang / Baan Suan / ICONSIAM revisit / Terminal 21 / MBK remaining food / Takoyaki round 2 / Meland revisit / Chinatown (if rained out Apr 9)." },
        { time: "18:00", end: "20:00", activity: "Light dinner near hotel", type: "food", dur: 120, location: "Pratunam area", details: "Street food or Indian restaurants." },
      ],
      food: []
    },
    {
      date: "2026-04-16", dow: "THU", title: "FINAL FULL DAY",
      theme: "Last full day. Favourites + local shopping.",
      booked: [],
      alerts: [],
      budget: { food: "600-900", transport: "200-300", activities: "400-500 (Baiyoke)" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit — revisit #1 favourite", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Make it memorable. 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "10:30", end: "11:30", activity: "Baan Suan Sathorn", type: "flex", dur: 60, location: "Baan Suan Sathorn", lat: 13.7232, lng: 100.5341, details: "Garden café. ~15 min taxi from Dusit. If not done earlier." },
        { time: "12:00", end: "15:00", activity: "Pratunam shopping", type: "activity", dur: 180, location: "Pratunam", lat: 13.7530, lng: 100.5400, details: "Platinum Fashion Mall, Indra Square. Baiyoke Sky 84F (400-500 THB incl. buffet)." },
        { time: "15:00", end: "17:00", activity: "Final packing", type: "flex", dur: 120, location: "Hotel", details: "Organize luggage." },
        { time: "18:00", end: "20:00", activity: "Last dinner", type: "food", dur: 120, location: "Hotel area or Dusit", details: "Favourite vendor or nearby restaurant." },
      ],
      food: []
    },
    {
      date: "2026-04-17", dow: "FRI", title: "DEPARTURE",
      theme: "Flight at 23:40 DMK.",
      booked: [],
      alerts: ["Flight is 23:40. Taxi to DMK by 20:00."],
      budget: { food: "400-600", transport: "300-450", activities: "0" },
      timeline: [
        { time: "08:30", end: "10:15", activity: "Dusit — FINAL breakfast", type: "food", dur: 105, location: "Dusit Central Park", lat: 13.7255, lng: 100.5290, details: "Last bowl. Savour it. 🚕 Request Grab 15 min early. If 2 cancellations, walk to ARL Ratchaprarop immediately." },
        { time: "10:30", end: "13:00", activity: "Last activity", type: "activity", dur: 150, location: "Terminal 21 / MBK", lat: 13.7376, lng: 100.5601, details: "Last-minute gifts, Don Don Donki snacks for flight." },
        { time: "14:00", end: "19:00", activity: "Hotel: pack + rest", type: "flex", dur: 300, location: "Hotel", details: "Final packing. Feed kids. Change to travel clothes." },
        { time: "20:00", end: "21:00", activity: "Taxi to DMK", type: "transit", dur: 60, location: "DMK Airport", lat: 13.9126, lng: 100.6068, details: "~200-350 THB with tolls. 30-45 min." },
        { time: "21:00", end: "23:40", activity: "Airport + flight", type: "transit", dur: 160, location: "DMK Airport", details: "Magic Food Point: Guay Jab or egg-noodle soup (kid-safe). Flight at 23:40." },
      ],
      food: [
        { name: "DMK Guay Jab", where: "Magic Food Point", thai: null, order: "Point and order", kid: true },
        { name: "DMK Egg Noodle Soup", where: "Magic Food Point", thai: "ก๋วยเตี๋ยว", order: "Point and order", kid: true },
      ]
    }
  ]
};

// ============ LOCATION MAPPING ============
const LOCATION_KEYS = {
  "Terminal 21": "terminal21", "Pier 21": "terminal21",
  "MBK": "mbk", "MBK Center": "mbk",
  "CentralWorld": "centralworld",
  "Siam Paragon": "siamparagon",
  "ICONSIAM": "iconsiam", "Sook Siam": "iconsiam",
  "Dusit": "dusit", "Dusit Central Park": "dusit", "Parkside Market": "dusit",
  "EM District": "emdistrict", "EmQuartier": "emdistrict", "Emsphere": "emdistrict", "Emporium": "emdistrict",
  "Chinatown": "chinatown", "Yaowarat": "chinatown",
  "Seacon Bangkae": "seaconbangkae",
  "DMK": "dmk", "Magic Food Point": "dmk",
};

function getLocationKey(where) {
  if (!where) return null;
  const w = where.toLowerCase();
  for (const [keyword, key] of Object.entries(LOCATION_KEYS)) {
    if (w.includes(keyword.toLowerCase())) return key;
  }
  return null;
}

function getDayLocationKeys(dayData) {
  const keys = new Set();
  dayData.timeline.forEach(t => {
    if (t.location) {
      const k = getLocationKey(t.location);
      if (k) keys.add(k);
    }
  });
  dayData.food.forEach(f => {
    const k = getLocationKey(f.where);
    if (k) keys.add(k);
  });
  return keys;
}

function getMissedFoodForDay(dayIndex, days, checkedFood) {
  const todayData = days[dayIndex];
  const todayKeys = getDayLocationKeys(todayData);
  const missed = [];

  for (let i = 0; i < dayIndex; i++) {
    const pastDay = days[i];
    pastDay.food.forEach(item => {
      const isChecked = !!checkedFood[`${pastDay.date}-${item.name}`];
      if (isChecked) return;

      const itemLocKey = getLocationKey(item.where);
      if (itemLocKey && todayKeys.has(itemLocKey)) {
        const alreadyToday = todayData.food.some(f => f.name === item.name);
        const checkedAnywhere = Object.keys(checkedFood).some(k => k.endsWith(`-${item.name}`) && checkedFood[k]);
        if (!alreadyToday && !checkedAnywhere) {
          missed.push({ ...item, missedFrom: `Apr ${parseInt(pastDay.date.split("-")[2])}` });
        }
      }
    });
  }
  return missed;
}

// ============ HELPERS ============
const typeColors = { transit: "#64748b", food: "#f59e0b", activity: "#3b82f6", booked: "#16a34a", flex: "#8b5cf6" };
const typeLabels = { transit: "🚕", food: "🍜", activity: "🎯", booked: "✅", flex: "⏳" };
const typeNames = { transit: "Transit", food: "Food", activity: "Activity", booked: "Booked", flex: "Flexible" };

function getGoogleMapsLink(lat, lng, locationText) {
  if (locationText) return `https://maps.google.com/?q=${encodeURIComponent(locationText)}`;
  if (lat && lng) return `https://maps.google.com/?q=${lat},${lng}`;
  return null;
}

function parseTime(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getBangkokNowMins() {
  const bkk = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  return bkk.getHours() * 60 + bkk.getMinutes();
}

function getBangkokDateStr() {
  const bkk = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  return `${bkk.getFullYear()}-${String(bkk.getMonth() + 1).padStart(2, "0")}-${String(bkk.getDate()).padStart(2, "0")}`;
}

function getBangkokTime() {
  try {
    const bkk = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    const hours = bkk.getHours();
    const minutes = bkk.getMinutes();
    return { hours, minutes, totalMinutes: hours * 60 + minutes };
  } catch {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return { hours, minutes, totalMinutes: hours * 60 + minutes };
  }
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  try {
    const trimmed = timeStr.trim();
    const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
      let h = parseInt(match12[1]);
      const m = parseInt(match12[2]);
      const period = match12[3].toUpperCase();
      if (period === "AM" && h === 12) h = 0;
      if (period === "PM" && h !== 12) h += 12;
      return h * 60 + m;
    }
    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      return parseInt(match24[1]) * 60 + parseInt(match24[2]);
    }
    return null;
  } catch {
    return null;
  }
}

function getCurrentActivity(timeline) {
  const nowMins = getBangkokNowMins();
  let currentIdx = -1;
  let nextIdx = -1;
  for (let i = 0; i < timeline.length; i++) {
    const start = parseTime(timeline[i].time);
    const end = parseTime(timeline[i].end);
    if (nowMins >= start && nowMins < end) currentIdx = i;
    if (nowMins < start && nextIdx === -1) nextIdx = i;
  }
  return { currentIdx, nextIdx };
}

function formatCountdown(ms) {
  if (ms <= 0) return "TIME'S UP";
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  const rm = mins % 60;
  return hrs > 0 ? `${hrs}h ${rm}m left` : `${rm}m left`;
}

function getReminders(day, bangkokNowMinutes, isToday) {
  if (!isToday) return [];
  const reminders = [];

  // a) BOOKED EVENT COUNTDOWNS
  for (const booked of (day.booked || [])) {
    if (reminders.length >= 3) break;
    const mins = parseTimeToMinutes(booked.time);
    if (mins === null || mins <= bangkokNowMinutes) continue;
    const diff = mins - bangkokNowMinutes;
    if (diff <= 15) {
      reminders.push({ id: `booked-${booked.name}`, level: "urgent", icon: "🚨", title: `NOW: ${booked.name} — go now!`, subtitle: booked.note || "", dismissible: true });
    } else if (diff <= 60) {
      reminders.push({ id: `booked-${booked.name}`, level: "warning", icon: "⏰", title: `Booked: ${booked.name} in ${diff}min`, subtitle: booked.note || "", dismissible: true });
    }
  }

  // b) HARD DEADLINES from timeline details
  for (const item of (day.timeline || [])) {
    if (reminders.length >= 3) break;
    if (!item.details) continue;
    const deadlineMatch = item.details.match(/(?:by|before|arrive by)\s+(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/i);
    if (!deadlineMatch) continue;
    const deadlineMins = parseTimeToMinutes(deadlineMatch[1]);
    if (deadlineMins === null || deadlineMins <= bangkokNowMinutes) continue;
    const diff = deadlineMins - bangkokNowMinutes;
    if (diff <= 10) {
      reminders.push({ id: `deadline-${item.time}`, level: "urgent", icon: "⚠️", title: `DEADLINE: ${item.activity}`, subtitle: deadlineMatch[0], dismissible: true });
    } else if (diff <= 30) {
      reminders.push({ id: `deadline-${item.time}`, level: "warning", icon: "⏳", title: `Deadline soon: ${item.activity}`, subtitle: `${deadlineMatch[0]} — ${diff}min away`, dismissible: true });
    }
  }

  // c) LEAVE-SOON: next upcoming non-flex timeline item
  if (reminders.length < 3) {
    const nextItem = (day.timeline || []).find(item => {
      const start = parseTimeToMinutes(item.time);
      return start !== null && start > bangkokNowMinutes;
    });
    if (nextItem && nextItem.type !== "flex") {
      const start = parseTimeToMinutes(nextItem.time);
      const diff = start - bangkokNowMinutes;
      if (diff <= 15) {
        reminders.push({ id: `leave-${nextItem.time}`, level: "warning", icon: "🏃", title: `Leave soon for ${nextItem.activity}`, subtitle: `Starts at ${nextItem.time} — ${diff}min`, dismissible: true });
      } else if (diff <= 30) {
        reminders.push({ id: `leave-${nextItem.time}`, level: "info", icon: "📍", title: `Next: ${nextItem.activity} in ${diff}min`, subtitle: nextItem.location || "", dismissible: true });
      }
    }
  }

  // d) DAILY ALERTS — first matching alert
  if (reminders.length < 3) {
    const alertItem = (day.alerts || []).find(a => a.includes("🚨") || a.toUpperCase().includes("ONLY") || a.toUpperCase().includes("TRAIN"));
    if (alertItem) {
      reminders.push({ id: `alert-${alertItem.substring(0, 30)}`, level: "info", icon: "ℹ️", title: alertItem, subtitle: "", dismissible: true });
    }
  }

  return reminders.slice(0, 3);
}

// ============ localStorage helpers ============
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ============ COMPONENTS ============

function NowNextBanner({ timeline }) {
  const { currentIdx, nextIdx } = getCurrentActivity(timeline);
  if (currentIdx === -1 && nextIdx === -1) return null;
  const current = currentIdx >= 0 ? timeline[currentIdx] : null;
  const next = nextIdx >= 0 ? timeline[nextIdx] : null;
  return (
    <div style={{ background: "#0f172a", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
      {current && (
        <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flexShrink: 0, background: "#22c55e", borderRadius: 4, padding: "2px 7px" }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>NOW</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{current.activity}</div>
            {current.location && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{current.location}</div>}
          </div>
          <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{current.time}–{current.end}</div>
        </div>
      )}
      {next && (
        <div style={{ padding: "8px 14px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 10, borderTop: current ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
          <div style={{ flexShrink: 0, background: "#1e293b", borderRadius: 4, padding: "2px 7px", border: "1px solid #334155" }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#64748b", letterSpacing: 0.5 }}>NEXT</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{next.activity}</div>
          </div>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{next.time}</div>
        </div>
      )}
    </div>
  );
}

function ReminderBanner({ reminders, dismissed, onDismiss }) {
  const visible = reminders.filter(r => !dismissed[r.id]);
  if (visible.length === 0) return null;
  const palette = {
    urgent:  { bg: "#fef2f2", border: "#fca5a5", titleColor: "#7f1d1d", subColor: "#991b1b" },
    warning: { bg: "#fffbeb", border: "#fde68a", titleColor: "#78350f", subColor: "#92400e" },
    info:    { bg: "#eff6ff", border: "#bfdbfe", titleColor: "#1e3a8a", subColor: "#1e40af" },
  };
  return (
    <div style={{ marginBottom: 8 }}>
      {visible.map(r => {
        const s = palette[r.level] || palette.info;
        return (
          <div key={r.id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: 10, marginBottom: 6, display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{r.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.titleColor, lineHeight: 1.3 }}>{r.title}</div>
              {r.subtitle && <div style={{ fontSize: 11, color: s.subColor, marginTop: 2, opacity: 0.85 }}>{r.subtitle}</div>}
            </div>
            {r.dismissible && (
              <button onClick={() => onDismiss(r.id)} style={{ background: "transparent", border: "none", color: s.subColor, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: "0 2px", flexShrink: 0, opacity: 0.7 }}>✕</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TimelineCard({ item, isActive, onActivate, activeTimers, onToggleTimer, cardRef }) {
  const [expanded, setExpanded] = useState(false);
  const mapLink = getGoogleMapsLink(item.lat, item.lng, item.location);
  const timer = activeTimers[item.time];
  const now = Date.now();
  const remaining = timer ? (timer.end - now) : null;
  const isOvertime = remaining !== null && remaining <= 0;
  const progress = timer ? Math.min(1, (now - timer.start) / (timer.end - timer.start)) : 0;

  return (
    <div
      ref={cardRef}
      style={{
        background: isOvertime ? "#fef2f2" : isActive ? "#f0f9ff" : "#fff",
        borderRadius: 12,
        marginBottom: 8,
        border: `1.5px solid ${isOvertime ? "#fca5a5" : isActive ? typeColors[item.type] : "#e5e7eb"}`,
        overflow: "hidden",
        transition: "all 0.2s",
        boxShadow: isActive ? `0 2px 12px ${typeColors[item.type]}44` : "none"
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}
      >
        <div style={{ minWidth: 52, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: typeColors[item.type], fontFamily: "'JetBrains Mono', monospace" }}>{item.time}</div>
          <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>{item.dur}min</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14 }}>{typeLabels[item.type]}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b", lineHeight: 1.3 }}>{item.activity}</span>
            {isActive && <span style={{ fontSize: 9, fontWeight: 800, background: "#22c55e", color: "#fff", padding: "1px 6px", borderRadius: 4, letterSpacing: 0.5 }}>NOW</span>}
          </div>
          {item.location && <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 3 }}>{item.location}{item.floor ? ` · ${item.floor}` : ""}</div>}
          {timer && (
            <div style={{ marginTop: 6 }}>
              <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress * 100}%`, background: isOvertime ? "#ef4444" : progress > 0.75 ? "#f59e0b" : "#22c55e", borderRadius: 2, transition: "width 1s linear" }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: isOvertime ? "#ef4444" : "#64748b", marginTop: 3 }}>{formatCountdown(remaining)}</div>
            </div>
          )}
        </div>
        <div style={{ fontSize: 16, color: "#94a3b8", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</div>
      </div>

      {expanded && (
        <div style={{ padding: "0 14px 12px 14px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ paddingTop: 10, fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>{item.details}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {mapLink && (
              <a href={mapLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", background: "#eff6ff", color: "#2563eb", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid #bfdbfe" }}>
                📍 Navigate
              </a>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleTimer(item.time, item.dur); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", background: timer ? "#fef2f2" : "#f0fdf4", color: timer ? "#dc2626" : "#16a34a", borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${timer ? "#fecaca" : "#bbf7d0"}`, cursor: "pointer" }}
            >
              {timer ? "⏹ Stop" : "⏱ I'm Here"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FoodCard({ item, checked, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  return (
    <div style={{ background: "#fff", borderRadius: 10, marginBottom: 6, border: "1px solid #e5e7eb", overflow: "hidden", opacity: checked ? 0.5 : 1 }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? "#22c55e" : "#d1d5db"}`, background: checked ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "#fff", fontSize: 12, fontWeight: 700 }}
        >
          {checked ? "✓" : ""}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
            {item.name}
            {item.kid && <span style={{ marginLeft: 6, fontSize: 10, background: "#dcfce7", color: "#166534", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>KID-SAFE</span>}
            {item.kid === false && <span style={{ marginLeft: 6, fontSize: 10, background: "#fef3c7", color: "#92400e", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>ADULTS</span>}
            {item.tier === 1 && <span style={{ marginLeft: 4, fontSize: 10, background: "#fef2f2", color: "#dc2626", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>MUST-HIT</span>}
            {item.missedFrom && <span style={{ marginLeft: 4, fontSize: 10, background: "#f3e8ff", color: "#7c3aed", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>Missed {item.missedFrom}</span>}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{item.where}</div>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 12px 10px", borderTop: "1px solid #f1f5f9" }}>
          {item.order && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>How to order:</div>
              <div style={{ fontSize: 12, color: "#1e293b" }}>{item.order}</div>
            </div>
          )}
          {item.thai && (
            <button
              onClick={() => setShowOrder(!showOrder)}
              style={{ marginTop: 8, padding: "8px 14px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, cursor: "pointer", width: "100%" }}
            >
              {showOrder ? (
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", textAlign: "center", lineHeight: 1.4 }}>{item.thai}<br /><span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>Show this to the vendor ☝️</span></div>
              ) : (
                <div style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>🇹🇭 Show Thai to vendor</div>
              )}
            </button>
          )}
          {item.visual && <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 6 }}>👀 {item.visual}</div>}
        </div>
      )}
    </div>
  );
}

// ============ MAIN APP ============
export default function BangkokApp() {
  const [dayIndex, setDayIndex] = useState(() => {
    const saved = lsGet("bkk_dayIndex", null);
    if (saved !== null && Number.isInteger(saved) && saved >= 0 && saved < TRIP_DATA.days.length) {
      return saved;
    }
    const today = new Date().toISOString().split("T")[0];
    const idx = TRIP_DATA.days.findIndex(d => d.date === today);
    return idx >= 0 ? idx : 0;
  });

  const [activeTab, setActiveTab] = useState("timeline");

  const [checkedFood, setCheckedFood] = useState(() => lsGet("bkk_checkedFood", {}));

  const [activeTimers, setActiveTimers] = useState(() => {
    const saved = lsGet("bkk_activeTimers", {});
    const now = Date.now();
    // Discard timers that ended more than 24 hours ago
    return Object.fromEntries(
      Object.entries(saved).filter(([, v]) => v && v.end > now - 86400000)
    );
  });

  const [, forceUpdate] = useState(0);
  const [showPanel, setShowPanel] = useState(null);
  const [dismissedReminders, setDismissedReminders] = useState({});
  const [reminderTick, setReminderTick] = useState(0);

  const day = TRIP_DATA.days[dayIndex];
  const activeItemRef = useRef(null);
  const isToday = day.date === getBangkokDateStr();
  const { currentIdx, nextIdx } = isToday ? getCurrentActivity(day.timeline) : { currentIdx: -1, nextIdx: -1 };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reminders = useMemo(() => {
    const { totalMinutes } = getBangkokTime();
    return getReminders(day, totalMinutes, isToday);
  }, [day, isToday, reminderTick]);

  const dismissReminder = useCallback((id) => {
    setDismissedReminders(prev => ({ ...prev, [id]: true }));
  }, []);

  // Persist state to localStorage
  useEffect(() => { lsSet("bkk_dayIndex", dayIndex); }, [dayIndex]);
  useEffect(() => { lsSet("bkk_checkedFood", checkedFood); }, [checkedFood]);
  useEffect(() => { lsSet("bkk_activeTimers", activeTimers); }, [activeTimers]);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  // Reminder tick — re-evaluate every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setReminderTick(n => n + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to active item when viewing today's timeline
  useEffect(() => {
    if (isToday && activeTab === "timeline" && activeItemRef.current) {
      setTimeout(() => activeItemRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }
  }, [isToday, activeTab, dayIndex]);

  const toggleTimer = useCallback((timeKey, durMinutes) => {
    setActiveTimers(prev => {
      if (prev[timeKey]) {
        const next = { ...prev };
        delete next[timeKey];
        return next;
      }
      return { ...prev, [timeKey]: { start: Date.now(), end: Date.now() + durMinutes * 60000 } };
    });
  }, []);

  const toggleFood = useCallback((name, originalDate) => {
    const dateKey = originalDate || day.date;
    setCheckedFood(prev => ({ ...prev, [`${dateKey}-${name}`]: !prev[`${dateKey}-${name}`] }));
  }, [day.date]);

  const missedFood = getMissedFoodForDay(dayIndex, TRIP_DATA.days, checkedFood);
  const allFood = [...day.food, ...missedFood];
  const foodCount = allFood.length;

  const prevDay = () => setDayIndex(i => Math.max(0, i - 1));
  const nextDay = () => setDayIndex(i => Math.min(TRIP_DATA.days.length - 1, i + 1));
  const goToday = () => {
    const idx = TRIP_DATA.days.findIndex(d => d.date === getBangkokDateStr());
    if (idx >= 0) setDayIndex(idx);
  };

  const totalBudget = 40000;
  const dayBudgets = TRIP_DATA.days.map(d => {
    const avg = (s) => {
      if (!s || s === "Variable") return 0;
      const parts = s.split("-").map(n => parseInt(n.replace(/[^\d]/g, "")));
      return parts.length === 2 ? (parts[0] + parts[1]) / 2 : parts[0] || 0;
    };
    return avg(d.budget.food) + avg(d.budget.transport) + avg(d.budget.activities);
  });
  const spentSoFar = dayBudgets.slice(0, dayIndex).reduce((a, b) => a + b, 0);
  const todayEst = dayBudgets[dayIndex];

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Nunito', -apple-system, sans-serif", position: "relative", paddingBottom: 70 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", padding: "16px 16px 14px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <button onClick={prevDay} disabled={dayIndex === 0} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", fontSize: 16, cursor: "pointer", opacity: dayIndex === 0 ? 0.3 : 1 }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: 1 }}>DAY {dayIndex + 1} OF 12</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginTop: 2 }}>APR {parseInt(day.date.split("-")[2])} ({day.dow})</div>
          </div>
          <button onClick={nextDay} disabled={dayIndex === TRIP_DATA.days.length - 1} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", fontSize: 16, cursor: "pointer", opacity: dayIndex === TRIP_DATA.days.length - 1 ? 0.3 : 1 }}>›</button>
        </div>
        <button onClick={goToday} style={{ display: "block", margin: "0 auto", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "3px 14px", color: "#cbd5e1", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Today</button>

        <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{day.title}</div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 3 }}>{day.theme}</div>
        </div>

        {day.booked.length > 0 && day.booked.map((b, i) => (
          <div key={i} style={{ marginTop: 6, padding: "6px 10px", background: "rgba(34,197,94,0.15)", borderRadius: 6, border: "1px solid rgba(34,197,94,0.3)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80" }}>✅ {b.time} — {b.name}</div>
            <div style={{ fontSize: 10, color: "#86efac", marginTop: 2 }}>Ref: {b.ref} · {b.note}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {day.alerts.length > 0 && (
        <div style={{ padding: "8px 16px" }}>
          {day.alerts.map((a, i) => (
            <div key={i} style={{ padding: "8px 10px", marginBottom: 4, background: a.includes("🚨") ? "#fef2f2" : "#fffbeb", borderRadius: 8, border: `1px solid ${a.includes("🚨") ? "#fecaca" : "#fde68a"}`, fontSize: 12, color: a.includes("🚨") ? "#991b1b" : "#92400e", fontWeight: 600, lineHeight: 1.4 }}>
              {a}
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", padding: "6px 16px", gap: 6 }}>
        {[["timeline", "📋 Schedule"], ["food", `🍜 Food (${foodCount})`], ["budget", "💰 Budget"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: activeTab === key ? "#1e293b" : "#e2e8f0", color: activeTab === key ? "#fff" : "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "8px 16px 16px" }}>
        {activeTab === "timeline" && (
          <div>
            {isToday && <NowNextBanner timeline={day.timeline} />}
            {isToday && <ReminderBanner reminders={reminders} dismissed={dismissedReminders} onDismiss={dismissReminder} />}
            <div style={{ padding: "6px 10px", marginBottom: 8, background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe", fontSize: 11.5, color: "#1e40af", fontWeight: 600 }}>
              💧 Hydration checks: 11 AM + 2 PM — electrolytes for kids, water for adults
            </div>
            {day.timeline.map((item, i) => (
              <TimelineCard
                key={`${day.date}-${i}`}
                item={item}
                isActive={i === currentIdx}
                cardRef={i === currentIdx ? activeItemRef : null}
                onActivate={() => {}}
                activeTimers={activeTimers}
                onToggleTimer={toggleTimer}
              />
            ))}
          </div>
        )}

        {activeTab === "food" && (
          <div>
            {allFood.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🍽</div>
                <div style={{ fontSize: 13 }}>Flex day — check your food checklist and pick what's still unchecked!</div>
              </div>
            ) : (
              <>
                {day.food.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontWeight: 600 }}>
                      TODAY'S FOOD — {day.food.filter(f => checkedFood[`${day.date}-${f.name}`]).length} / {day.food.length} tried
                    </div>
                    {day.food.map((item) => (
                      <FoodCard key={`${day.date}-${item.name}`} item={item} checked={!!checkedFood[`${day.date}-${item.name}`]} onToggle={() => toggleFood(item.name)} />
                    ))}
                  </>
                )}

                {missedFood.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, color: "#7c3aed", marginTop: day.food.length > 0 ? 14 : 0, marginBottom: 6, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ background: "#f3e8ff", padding: "2px 8px", borderRadius: 4 }}>🔄 MISSED — Try today</span>
                      <span style={{ color: "#94a3b8", fontWeight: 400 }}>{missedFood.length} item{missedFood.length > 1 ? "s" : ""}</span>
                    </div>
                    {missedFood.map((item) => {
                      const origDay = TRIP_DATA.days.find(d => d.food.some(f => f.name === item.name));
                      const origDate = origDay ? origDay.date : day.date;
                      return (
                        <FoodCard key={`missed-${item.name}`} item={item} checked={!!checkedFood[`${origDate}-${item.name}`]} onToggle={() => toggleFood(item.name, origDate)} />
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "budget" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>TRIP BUDGET</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", fontFamily: "'JetBrains Mono', monospace" }}>฿{Math.round(totalBudget - spentSoFar).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>of ฿{totalBudget.toLocaleString()}</div>
              </div>
              <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(spentSoFar / totalBudget) * 100}%`, background: spentSoFar / totalBudget > 0.8 ? "#ef4444" : "#3b82f6", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>~฿{Math.round(spentSoFar).toLocaleString()} estimated spent (Days 1-{dayIndex})</div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>TODAY'S ESTIMATE</div>
              {[["🍜 Food", day.budget.food], ["🚕 Transport", day.budget.transport], ["🎯 Activities", day.budget.activities]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>{label}</span>
                  <span style={{ fontWeight: 700, color: "#1e293b", fontFamily: "'JetBrains Mono', monospace" }}>฿{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: "#1e293b" }}>Est. Total</span>
                <span style={{ color: "#1e293b", fontFamily: "'JetBrains Mono', monospace" }}>~฿{Math.round(todayEst).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 50 }}>
        {[["gobag", "🎒", "Go-Bag"], ["transport", "🗺", "Routes"], ["emergency", "🆘", "SOS"]].map(([key, icon, label]) => (
          <button
            key={key}
            onClick={() => setShowPanel(showPanel === key ? null : key)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: showPanel === key ? "#f1f5f9" : "transparent", border: "none", borderRadius: 8, padding: "4px 16px", cursor: "pointer" }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: showPanel === key ? "#1e293b" : "#94a3b8" }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Panels */}
      {showPanel && (
        <div style={{ position: "fixed", bottom: 56, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: "1px solid #e5e7eb", borderRadius: "16px 16px 0 0", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", maxHeight: "55vh", overflow: "auto", zIndex: 49, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>
              {showPanel === "gobag" && "🎒 Today's Go-Bag"}
              {showPanel === "transport" && "🗺 Route from Hotel"}
              {showPanel === "emergency" && "🆘 Emergency Contacts"}
            </div>
            <button onClick={() => setShowPanel(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#64748b" }}>✕</button>
          </div>

          {showPanel === "gobag" && (
            <div>
              {TRIP_DATA.goBag.always.map((item, i) => (
                <div key={i} style={{ fontSize: 12.5, color: "#334155", padding: "4px 0", borderBottom: "1px solid #f8fafc" }}>• {item}</div>
              ))}
              {TRIP_DATA.goBag.daySpecific[day.date] && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginTop: 10, marginBottom: 4 }}>⚠️ TODAY ONLY:</div>
                  {TRIP_DATA.goBag.daySpecific[day.date].map((item, i) => (
                    <div key={i} style={{ fontSize: 12.5, color: "#991b1b", padding: "3px 0", fontWeight: 600 }}>• {item}</div>
                  ))}
                </>
              )}
            </div>
          )}

          {showPanel === "transport" && (
            <div>
              {day.timeline.filter(t => t.lat || t.lng || t.location).map((t, i) => (
                <a
                  key={i}
                  href={getGoogleMapsLink(t.lat, t.lng, t.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f1f5f9", textDecoration: "none" }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${typeColors[t.type]}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{typeLabels[t.type]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{t.location}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{t.time} · Tap to navigate</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#3b82f6" }}>→</div>
                </a>
              ))}
            </div>
          )}

          {showPanel === "emergency" && (
            <div>
              {TRIP_DATA.emergency.map((e, i) => (
                <a
                  key={i}
                  href={`tel:${e.number}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9", textDecoration: "none" }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{e.label}</div>
                    <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{e.number}</div>
                  </div>
                  <div style={{ background: "#fef2f2", color: "#dc2626", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, border: "1px solid #fecaca" }}>📞 Call</div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
