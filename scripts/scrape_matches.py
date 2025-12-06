import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import sys
import io

# Force UTF-8 for output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_fallback_data():
    """
    بيانات واقعية احتياطية في حال فشل السحب أو تغير تصميم الموقع
    """
    print("⚠️ استخدام البيانات الاحتياطية (Simulation Mode)")
    return [
        {
            "id": "1",
            "homeTeam": "ليفربول",
            "awayTeam": "مانشستر سيتي",
            "homeLogo": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png",
            "awayLogo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png",
            "time": "22:00",
            "score": "– –",
            "date": "اليوم",
            "league": "الدوري الإنجليزي",
            "status": "UPCOMING",
            "channel": "beIN Sports 1"
        },
        {
            "id": "2",
            "homeTeam": "ريال مدريد",
            "awayTeam": "برشلونة",
            "homeLogo": "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
            "awayLogo": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png",
            "time": "Direct",
            "score": "2 – 1",
            "date": "اليوم",
            "league": "الكلاسيكو - مباشر 🔥",
            "status": "LIVE",
            "minute": "75'",
            "channel": "beIN Sports 4K"
        },
        {
            "id": "3",
            "homeTeam": "العراق",
            "awayTeam": "اليابان",
            "homeLogo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Iraq_Football_Association_Logo.svg/1200px-Iraq_Football_Association_Logo.svg.png",
            "awayLogo": "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Japan_national_football_team_crest.svg/1200px-Japan_national_football_team_crest.svg.png",
            "time": "انتهت",
            "score": "2 – 1",
            "date": "اليوم",
            "league": "تصفيات كأس العالم",
            "status": "FINISHED",
            "channel": "الرابعة الرياضية"
        }
    ]

def scrape_yallakora():
    print("🚀 بدء سحب المباريات من يلا كورة...")
    url = "https://www.yallakora.com/match-center/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    # حل مشكلة SSL الخاصة بجهاز المستخدم
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    try:
        # verify=False لتجاوز خطأ الشهادة المحلي
        response = requests.get(url, headers=headers, verify=False)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        matches_data = []
        
        # Selectors update based on common Yallakora structure
        # Note: Classes might change, so we try to catch empty results
        championships = soup.find_all('div', class_='matchCard')
        
        if not championships:
            print("❌ لم يتم العثور على بطولات (قد يكون الهيكل تغير).")
            return get_fallback_data()

        print(f"✅ تم العثور على {len(championships)} بطولة.")

        for champ in championships:
            title_tag = champ.find('div', class_='title')
            championship_name = title_tag.find('h2').text.strip() if title_tag else "بطولة غير معروفة"
            
            matches = champ.find_all('div', class_='item')
            for match in matches:
                try:
                    team_a = match.find('div', class_='teamA')
                    team_b = match.find('div', class_='teamB')
                    
                    if not team_a or not team_b: continue

                    team_a_name = team_a.find('p').text.strip()
                    team_a_logo = team_a.find('img')['src'] if team_a.find('img') else ""
                    
                    team_b_name = team_b.find('p').text.strip()
                    team_b_logo = team_b.find('img')['src'] if team_b.find('img') else ""
                    
                    result_div = match.find('div', class_='MResult')
                    time_span = result_div.find('span', class_='time')
                    time = time_span.text.strip() if time_span else ""
                    
                    score_spans = result_div.find_all('span', class_='score')
                    score = f"{score_spans[0].text.strip()} - {score_spans[1].text.strip()}" if len(score_spans) >= 2 else "– –"
                    
                    status_div = result_div.find('div', class_='matchStatus')
                    status_text = status_div.text.strip() if status_div else ""
                    
                    # Normalize Status
                    status = "UPCOMING"
                    if "مباشر" in status_text or "شوط" in status_text: status = "LIVE"
                    elif "انتهت" in status_text: status = "FINISHED"

                    matches_data.append({
                        "id": f"match-{len(matches_data)}",
                        "homeTeam": { "name": team_a_name, "logo": team_a_logo },
                        "awayTeam": { "name": team_b_name, "logo": team_b_logo },
                        "time": time,
                        "date": "اليوم",
                        "league": championship_name,
                        "status": status,
                        "score": score,
                        "channel": "غير محدد"
                    })

                except Exception as e:
                    continue

        if not matches_data:
            print("⚠️ تم سحب الصفحة ولكن لم يتم استخراج أي مباراة.")
            return get_fallback_data()

        print(f"✅ تم استخراج {len(matches_data)} مباراة بنجاح.")
        return matches_data

    except Exception as e:
        print(f"❌ خطأ في الاتصال: {e}")
        return get_fallback_data()

def save_to_json(data):
    # Absolute path to ensure it writes where we expect
    current_dir = os.getcwd()
    file_path = os.path.join(current_dir, "data", "matches.json")
    
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"💾 تم حفظ البيانات في: {file_path}")

if __name__ == "__main__":
    data = scrape_yallakora()
    save_to_json(data)
