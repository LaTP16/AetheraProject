import json
import random
with open(r'c:\Users\USER\Desktop\AetheraProject\Datasets\D4_testimonials.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    themes = ['academic_pressure', 'social_isolation', 'financial_stress']
    for theme in themes:
        matches = [x for x in data if x.get('theme') == theme]
        if matches:
            print(random.choice(matches))

