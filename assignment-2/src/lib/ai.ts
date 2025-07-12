import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the model - using Gemini 2.5 Flash as requested
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export async function generateSummary(text: string): Promise<string> {
  try {
    // Clean the text first to remove obvious noise
    let cleanedText = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    // Remove common website noise patterns
    const noisePatterns = [
      /©.*?\d{4}.*?(reserved|rights)/gi,
      /copyright.*?\d{4}/gi,
      /all rights reserved/gi,
      /terms of service/gi,
      /privacy policy/gi,
      /cookie policy/gi,
      /follow us on/gi,
      /subscribe to/gi,
      /newsletter signup/gi,
      /social media/gi,
      /facebook\s*twitter\s*instagram/gi,
      /home\s*about\s*contact/gi,
    ];
    
    noisePatterns.forEach(pattern => {
      cleanedText = cleanedText.replace(pattern, '');
    });

    // Use Gemini AI to generate the summary
    const prompt = `Please read the following article content and provide a clear, concise summary in 2-3 sentences that captures the main points and key information. Focus only on the actual article content and ignore any website navigation, advertisements, or boilerplate text:

Article Content:
${cleanedText}

Summary:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();
    
    // Basic validation of the summary
    if (summary.length < 20) {
      throw new Error('Generated summary is too short');
    }
    
    return summary;
    
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    // Fallback to a simple extract if AI fails
    const words = text.split(' ').slice(0, 50);
    return words.join(' ') + '...';
  }
}

export async function translateToUrdu(englishText: string): Promise<string> {
  try {
    // Use Gemini AI to translate the English summary to Urdu
    const prompt = `Please translate the following English text to Urdu. Provide a natural, fluent translation that maintains the meaning and context:

English Text:
${englishText}

Urdu Translation:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const urduTranslation = response.text().trim();
    
    // Basic validation
    if (urduTranslation.length < 10) {
      throw new Error('Generated translation is too short');
    }
    
    return urduTranslation;
    
  } catch (error) {
    console.error('Error translating to Urdu with Gemini:', error);
    
    // Fallback to dictionary-based translation if AI fails
    const dictionary: Record<string, string> = {
      'the': 'یہ',
      'a': 'ایک', 
      'an': 'ایک',
      'is': 'ہے',
      'are': 'ہیں',
      'was': 'تھا',
      'were': 'تھے',
      'and': 'اور',
      'in': 'میں',
      'to': 'کو',
      'of': 'کا',
      'for': 'کے لیے',
      'on': 'پر',
      'with': 'کے ساتھ',
      'by': 'کے ذریعے',
      'at': 'پر',
      'from': 'سے',
      'this': 'یہ',
      'that': 'وہ',
      'article': 'مضمون',
      'blog': 'بلاگ',
      'content': 'مواد',
      'summary': 'خلاصہ',
      'children': 'بچے',
      'child': 'بچہ',
      'labour': 'مزدوری',
      'labor': 'مزدوری',
      'crisis': 'بحران',
      'million': 'ملین',
      'progress': 'ترقی',
      'reality': 'حقیقت',
      'survey': 'سروے',
      'study': 'مطالعہ',
      'research': 'تحقیق',
      'report': 'رپورٹ',
      'data': 'ڈیٹا',
      'according': 'کے مطابق',
      'government': 'حکومت',
      'pakistan': 'پاکستان',
      'sindh': 'سندھ',
      'country': 'ملک',
      'province': 'صوبہ',
      'policy': 'پالیسی',
      'education': 'تعلیم',
      'school': 'سکول',
      'work': 'کام',
      'working': 'کام کرنا',
      'poor': 'غریب',
      'poverty': 'غربت',
      'family': 'خاندان',
      'families': 'خاندان',
      'income': 'آمدن',
      'money': 'پیسہ',
      'economic': 'اقتصادی',
      'social': 'سماجی',
      'development': 'ترقی',
      'issue': 'مسئلہ',
      'problem': 'مسئلہ',
      'solution': 'حل',
      'help': 'مدد',
      'support': 'حمایت',
      'program': 'پروگرام',
      'project': 'منصوبہ',
      'year': 'سال',
      'years': 'سال',
      'time': 'وقت',
      'new': 'نیا',
      'old': 'پرانا',
      'young': 'جوان',
      'age': 'عمر',
      'people': 'لوگ',
      'person': 'شخص',
      'health': 'صحت',
      'rights': 'حقوق',
      'law': 'قانون',
      'legal': 'قانونی',
      'court': 'عدالت',
      'judge': 'جج',
      'case': 'کیس',
      'trial': 'مقدمہ'
    };

    // Simple word-by-word translation
    let translatedText = englishText;
    Object.keys(dictionary).forEach(englishWord => {
      const wordRegex = new RegExp(`\\b${englishWord}\\b`, 'gi');
      translatedText = translatedText.replace(wordRegex, dictionary[englishWord]);
    });

    return translatedText || englishText; // Return original if translation fails completely
  }
}
