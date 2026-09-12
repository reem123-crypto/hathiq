from pathlib import Path
replacements = {
    '#5DCCB4': '#213851',
    '#5dccb4': '#213851',
    '#1B3A52': '#213851',
    '#1b3a52': '#213851',
    '#7FD9C5': '#4A6782',
    '#7fd9c5': '#4A6782',
    '#3FBAA3': '#a17c1a',
    '#3fbaa3': '#a17c1a',
    '#6FCDB9': '#ccb24c',
    '#6fcdb9': '#ccb24c',
    '#2A9B87': '#7c6112',
    '#2a9b87': '#7c6112',
    '#6366f1': '#213851',
    '#3b82f6': '#213851',
    'rgba(99, 102, 241,': 'rgba(33, 56, 81,',
    'rgba(236, 72, 153,': 'rgba(161, 124, 26,',
    'linear-gradient(135deg, #5DCCB4 0%, #1B3A52 100%)': 'linear-gradient(135deg, #213851 0%, #a17c1a 100%)',
    'linear-gradient(135deg, #5DCCB4 0%, #1b3a52 100%)': 'linear-gradient(135deg, #213851 0%, #a17c1a 100%)',
}
for p in Path('frontend').rglob('*'):
    if p.is_file() and p.suffix.lower() in {'.css', '.html', '.svg', '.js'}:
        text = p.read_text(encoding='utf-8')
        original = text
        for old, new in replacements.items():
            text = text.replace(old, new)
        if text != original:
            p.write_text(text, encoding='utf-8')
            print(f'Updated {p}')
print('Done')
