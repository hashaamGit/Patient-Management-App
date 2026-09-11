// ============================================================
// Hassan and Co. Healthcare Systems — Urdu Clinical Translation Engine
// Provides fluent, accurate Urdu translations for:
// - Medication Instructions & Timings
// - Dosages, Forms, and Frequencies
// - Lifestyle & Dietary Advice
// - Prescription Slip Labels for Print/PDF
// ============================================================

export const URDU_FREQUENCY_MAP: Record<string, string> = {
  'OD': 'دن میں ایک بار',
  'Once daily': 'دن میں ایک بار',
  'BD': 'دن میں دو بار (صبح و شام)',
  'Twice daily': 'دن میں دو بار (صبح و شام)',
  'TDS': 'دن میں تین بار (صبح، دوپہر، شام)',
  'Three times daily': 'دن میں تین بار (صبح، دوپہر، شام)',
  'QID': 'دن میں چار بار',
  'Four times daily': 'دن میں چار بار',
  'PRN': 'ضرورت کے وقت (تکلیف کی صورت میں)',
  'As needed': 'ضرورت کے وقت',
  'Stat': 'فوراً (ابھی)',
  'Q4H': 'ہر 4 گھنٹے بعد',
  'Q6H': 'ہر 6 گھنٹے بعد',
  'Q8H': 'ہر 8 گھنٹے بعد',
  'Bedtime': 'رات سوتے وقت',
  'HS': 'رات سوتے وقت',
  'Weekly': 'ہفتے میں ایک بار',
};

export const URDU_FORM_MAP: Record<string, string> = {
  'Tab': 'گولی',
  'Tablet': 'گولی',
  'Cap': 'کیپسول',
  'Capsule': 'کیپسول',
  'Syp': 'شربت',
  'Syrup': 'شربت',
  'Susp': 'شربت',
  'Suspension': 'شربت',
  'Inh': 'انہیلا',
  'Inhaler': 'انہیلا (سانس کی دوا)',
  'Inj': 'ٹیکہ',
  'Injection': 'ٹیکہ',
  'Drops': 'قطرے',
  'Drop': 'قطرے',
  'Cream': 'مرہم',
  'Ointment': 'مرہم',
  'Sachet': 'ساشے (پاؤڈر)',
  'Gel': 'جیل',
};

export const URDU_ROUTE_MAP: Record<string, string> = {
  'Oral': 'منہ کے ذریعے',
  'Inhaled': 'سانس کے ذریعے',
  'Topical': 'جلد پر لگانے کے لیے',
  'IV': 'ورید میں ٹیکہ',
  'IM': 'پٹھے میں ٹیکہ',
  'Sublingual': 'زبان کے نیچے',
  'Ophthalmic': 'آنکھ میں ڈالنے کے لیے',
  'Otic': 'کان میں ڈالنے کے لیے',
};

/**
 * Translates dosage strings to Urdu
 */
export const translateDosageToUrdu = (dosage?: string, form?: string): string => {
  if (!dosage) return 'حسب ہدایت';
  const d = dosage.toLowerCase().trim();
  const fUrdu = form ? (URDU_FORM_MAP[form] || form) : '';

  if (d.includes('1-2') || d.includes('1 to 2')) return `ایک سے دو ${fUrdu || 'گولیاں'}`;
  if (d.includes('1') && (d.includes('tab') || d.includes('cap') || !d.includes('puff'))) return `ایک ${fUrdu || 'گولی'}`;
  if (d.includes('2') && (d.includes('tab') || d.includes('cap'))) return `دو ${fUrdu || 'گولیاں'}`;
  if (d.includes('1/2') || d.includes('half')) return `آدھی ${fUrdu || 'گولی'}`;
  if (d.includes('puff')) {
    const puffs = d.match(/\d+/);
    return puffs ? `${puffs[0]} پف (سانس کھینچیں)` : 'دو پف';
  }
  if (d.includes('ml')) {
    const ml = d.match(/\d+(?:\.\d+)?/);
    return ml ? `${ml[0]} ملی لیٹر` : d;
  }
  if (d.includes('spoon') || d.includes('tsp')) return 'ایک چائے کا چمچ';
  if (d.includes('tbsp')) return 'ایک کھانے کا چمچ';
  if (d.includes('weight')) return 'وزن کے مطابق خوراک';

  return dosage;
};

/**
 * Translates duration strings to Urdu
 */
export const translateDurationToUrdu = (duration?: string): string => {
  if (!duration) return 'حسب ہدایت';
  const d = duration.toLowerCase().trim();

  if (d.includes('1 day')) return 'ایک دن';
  if (d.includes('2 day')) return 'دو دن';
  if (d.includes('3 day')) return '3 دن';
  if (d.includes('5 day')) return '5 دن';
  if (d.includes('7 day') || d.includes('1 week')) return '7 دن (ایک ہفتہ)';
  if (d.includes('10 day')) return '10 دن';
  if (d.includes('14 day') || d.includes('2 week')) return '14 دن (دو ہفتے)';
  if (d.includes('1 month') || d.includes('30 day')) return 'ایک مہینہ (30 دن)';
  if (d.includes('2 month')) return 'دو ماہ';
  if (d.includes('ongoing') || d.includes('continue')) return 'مسلسل جاری رکھیں';

  const daysMatch = d.match(/(\d+)\s*day/);
  if (daysMatch) return `${daysMatch[1]} دن`;

  const weeksMatch = d.match(/(\d+)\s*week/);
  if (weeksMatch) return `${weeksMatch[1]} ہفتے`;

  return duration;
};

/**
 * Translates medical instructions into fluent Urdu
 */
export const translateInstructionsToUrdu = (instructions?: string, frequency?: string): string => {
  const inst = (instructions || '').toLowerCase();
  const clauses: string[] = [];

  // Meal timing
  if (inst.includes('before breakfast') || inst.includes('empty stomach') || inst.includes('30 min before')) {
    clauses.push('صبح نہار منہ ناشتے سے آدھا گھنٹہ پہلے لیں');
  } else if (inst.includes('after meals') || inst.includes('after food') || inst.includes('after dinner') || inst.includes('with food') || inst.includes('with main meals')) {
    clauses.push('کھانے کے بعد لیں');
  } else if (inst.includes('before meals') || inst.includes('prior to food')) {
    clauses.push('کھانے سے آدھا گھنٹہ پہلے لیں');
  }

  // Frequency
  if (frequency && URDU_FREQUENCY_MAP[frequency]) {
    clauses.push(URDU_FREQUENCY_MAP[frequency]);
  }

  // Specific nuances
  if (inst.includes('rinse mouth')) clauses.push('استعمال کے بعد اچھی طرح کلی کریں');
  if (inst.includes('water') && !inst.includes('without')) clauses.push('خوب پانی کے ساتھ استعمال کریں');
  if (inst.includes('drowsiness') || inst.includes('do not drive')) clauses.push('غنودگی ہو سکتی ہے، ڈرائیونگ سے گریز کریں');
  if (inst.includes('course')) clauses.push('طبیعت بہتر ہونے کے باوجود کورس مکمل کریں');
  if (inst.includes('spacer')) clauses.push('ساتھ اسپیسر آلہ استعمال کریں');
  if (inst.includes('night') || inst.includes('bedtime')) clauses.push('رات سوتے وقت استعمال کریں');
  if (inst.includes('stop if stomach burning') || inst.includes('stop if pain')) clauses.push('معدے میں جلن یا تکلیف ہو تو دوا روک دیں');

  if (clauses.length === 0) {
    if (frequency && URDU_FREQUENCY_MAP[frequency]) {
      return URDU_FREQUENCY_MAP[frequency];
    }
    return instructions ? instructions : 'ڈاکٹر کی ہدایت کے مطابق استعمال کریں۔';
  }

  return clauses.join(' • ');
};

/**
 * Translates general clinical advice into fluent Urdu
 */
export const translateAdviceToUrdu = (advice?: string): string => {
  if (!advice) {
    return 'ادویات وقت پر پابندی سے استعمال کریں۔ نمک اور مرچ مصالحوں سے پرہیز کریں۔ پانی کا وافر استعمال کریں اور آرام کریں۔ علامات برقرار رہنے یا بگڑنے کی صورت میں فوری طور پر ہسپتال سے رجوع فرمائیں۔';
  }

  const adv = advice.toLowerCase();
  const lines: string[] = [];

  if (adv.includes('salt') || adv.includes('bp') || adv.includes('hypertens')) {
    lines.push('نمک، چکنائی اور تلی ہوئی اشیاء سے سخت پرہیز کریں۔ بلڈ پریشر روزانہ چیک کریں۔');
  }
  if (adv.includes('sugar') || adv.includes('diabet') || adv.includes('sweet')) {
    lines.push('چینی، میٹھی اشیاء اور کولڈ ڈرنکس سے مکمل پرہیز کریں۔ باقاعدگی سے واک کریں۔');
  }
  if (adv.includes('hydration') || adv.includes('fluid') || adv.includes('water')) {
    lines.push('روزانہ کم از کم 8 سے 10 گلاس صاف پانی اور او آر ایس (ORS) کا استعمال کریں۔');
  }
  if (adv.includes('sponge') || adv.includes('fever') || adv.includes('tepid')) {
    lines.push('تیز بخار کی صورت میں ماتھے اور بغلوں پر تازہ پانی کی ٹھنڈی پٹیاں کریں۔');
  }
  if (adv.includes('rest') || adv.includes('exertion')) {
    lines.push('مکمل آرام کریں اور بھاری وزن اٹھانے یا سخت مشقت سے گریز کریں۔');
  }
  if (adv.includes('follow') || adv.includes('week') || adv.includes('days')) {
    lines.push('ہدایت کے مطابق 7 دن بعد دوبارہ چیک اپ کروائیں۔');
  }

  if (lines.length === 0) {
    return 'ادویات کا باقاعدگی سے استعمال کریں۔ پرہیز کریں اور طبیعت بگڑنے پر فوری رجوع کریں۔';
  }

  return lines.join(' ');
};

export const URDU_SLIP_LABELS = {
  headerTitle: 'حسن اینڈ کمپنی ہیلتھ کیئر سسٹمز',
  officialSlip: 'آفیشل نسخہ و میڈیکل سلپ',
  patient: 'مریض کا نام:',
  ageGender: 'عمر / جنس:',
  date: 'تاریخ:',
  mrn: 'رجسٹریشن نمبر:',
  bp: 'بلڈ پریشر:',
  temp: 'بخار (حرارت):',
  pulse: 'نبض کی رفتار:',
  weight: 'وزن:',
  diagnosis: 'تشخیص (مرض):',
  rxHeading: 'نسخہ ادویات (Rx)',
  medName: 'دوا کا نام',
  strengthForm: 'طاقت و شکل',
  dosageFrequency: 'مقدار و تعدد',
  instructions: 'طریقہ استعمال و ہدایات',
  duration: 'مدت استعمال',
  price: 'قیمت',
  totalCost: 'کل متوقع میڈیکل اسٹور لاگت:',
  advice: 'پرہیز و ضروری ہدایات:',
  tests: 'تجویز کردہ ٹیسٹ (لیبارٹری):',
  followUp: 'اگلا چیک اپ:',
  docSign: 'معالج کے دستخط و مہر',
};
