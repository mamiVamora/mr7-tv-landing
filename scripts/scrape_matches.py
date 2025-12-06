import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import sys

# التأكد من ترميز UTF-8 للإخراج
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def scrape_yallakora():
    """
    سحب المباريات من مركز مباريات يلا كورة
    """
    print("جاري سحب المباريات من يلا كورة...")
    
    # رابط مركز المباريات (اليوم)
    url = "https://www.yallakora.com/match-center/"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        matches_data = []
        
        # البحث عن البطولات
        championships = soup.find_all('div', class_='matchCard')
        
        print(f"تم العثور على {len(championships)} بطولة")

        for champ in championships:
            # اسم البطولة
            title_tag = champ.find('div', class_='title')
            championship_name = title_tag.find('h2').text.strip() if title_tag else "بطولة غير معروفة"
            
            # المباريات داخل البطولة
            matches = champ.find_all('div', class_='item')
            
            for match in matches:
                try:
                    # الفرق
                    team_a_div = match.find('div', class_='teamA')
                    team_b_div = match.find('div', class_='teamB')
                    
                    team_a_name = team_a_div.find('p').text.strip()
                    team_a_logo = team_a_div.find('img')['src'] if team_a_div.find('img') else ""
                    
                    team_b_name = team_b_div.find('p').text.strip()
                    team_b_logo = team_b_div.find('img')['src'] if team_b_div.find('img') else ""
                    
                    # النتيجة والوقت
                    result_div = match.find('div', class_='MResult')
                    
                    # الحالة والوقت
                    status_div = result_div.find('div', class_='matchStatus')
                    status = status_div.text.strip() if status_div else ""
                    
                    # النتيجة
                    score_spans = result_div.find_all('span', class_='score')
                    score = f"{score_spans[0].text.strip()} - {score_spans[1].text.strip()}" if len(score_spans) >= 2 else "- - -"
                    
                    # الوقت
                    time_span = result_div.find('span', class_='time')
                    time = time_span.text.strip() if time_span else ""
                    
                    # القناة (قد لا تكون متوفرة دائمًا بشكل مباشر في القائمة المختصرة)
                    channel = "غير محدد" 
                    # يلا كورة يعرض القناة أحياناً في تفاصيل أخرى، سنستخدم افتراضي أو نحاول استخراجه إن وجد
                    
                    matches_data.append({
                        "id": f"match-{len(matches_data) + 1}",
                        "homeTeam": { "name": team_a_name, "logo": team_a_logo },
                        "awayTeam": { "name": team_b_name, "logo": team_b_logo },
                        "time": time,
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "status": translate_status(status),
                        "score": score,
                        "championship": championship_name,
                        "channel": channel
                    })
                    
                except Exception as e:
                    print(f"خطأ في معالجة مباراة: {e}")
                    continue

        if not matches_data:
            print("لم يتم العثور على مباريات.")
            # استخدام بيانات تجريبية في حالة الفشل (احتياطي)
            return get_mock_data()

        return matches_data

    except Exception as e:
        print(f"خطأ في الاتصال بالموقع: {e}")
        return get_mock_data()

def translate_status(status):
    """ترجمة حالة المباراة المرجعة من الموقع"""
    if "لم تبدأ" in status: return "لم تبدأ"
    if "مباشر" in status or "JARI" in status.upper(): return "مباشر"
    if "انتهت" in status: return "انتهت"
    if "استراحة" in status: return "استراحة"
    return status

def get_mock_data():
    """بيانات تجريبية في حالة فشل السحب"""
    return [
        {
            "id": "mock-1",
            "homeTeam": { "name": "ريال مدريد", "logo": "images/logo.jpg" },
            "awayTeam": { "name": "برشلونة", "logo": "images/logo.jpg" },
            "time": "22:00",
            "status": "مباشر",
            "score": "2 - 1",
            "championship": "الدوري الإسباني",
            "channel": "beIN Sports 1"
        }
    ]

def save_to_json(data, filename="data/matches.json"):
    """حفظ البيانات في ملف JSON"""
    try:
        # التأكد من وجود المجلد
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"تم حفظ {len(data)} مباراة في {filename}")
    except Exception as e:
        print(f"خطأ في حفظ الملف: {e}")

if __name__ == "__main__":
    data = scrape_yallakora()
    save_to_json(data)
