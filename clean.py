import re
with open('src/components/LearningSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'onClick=\{\(\) => \{\s*if \(cat\.id === \'CALENDARIO\'\) \{\s*setCalendarModal\(true\);\s*\} else \{\s*setActiveFilter\(isSelected \? \'ALL\' : cat\.id\);\s*\}\s*\}\}',
    'onClick={() => setActiveFilter(isSelected ? \'ALL\' : cat.id)}',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'isSelected && cat\.id !== \'CALENDARIO\'',
    'isSelected',
    content
)

content = re.sub(
    r'\{cat\.id === \'CALENDARIO\' \? \'Ver fechas \(D7\)\' : \(isSelected \? \'Filtrado activo\' : \'Explorar contenidos\'\)\}',
    '{isSelected ? \'Filtrado activo\' : \'Explorar contenidos\'}',
    content
)

with open('src/components/LearningSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
