import os
import glob
import re

directories = [
    '/home/nicoj/dev/xXN1CG4M3RXx/n1code/admin/src/pages',
    '/home/nicoj/dev/xXN1CG4M3RXx/n1code/admin/src/components'
]

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    content = re.sub(r'(\w+)\.links\.map\(', r'(\1.links || []).map(', content)
    content = re.sub(r'(\w+)\.games\.map\(', r'(\1.games || []).map(', content)
    content = re.sub(r'(\w+)\.anime\.map\(', r'(\1.anime || []).map(', content)
    content = re.sub(r'(\w+)\.skills\.map\(', r'(\1.skills || []).map(', content)
    content = re.sub(r'(\w+)\.projects\.map\(', r'(\1.projects || []).map(', content)
    
    content = re.sub(r'(?<!\.)(links)\.map\(', r'(\1 || []).map(', content)
    content = re.sub(r'(?<!\.)(projects)\.map\(', r'(\1 || []).map(', content)
    content = re.sub(r'(?<!\.)(skills)\.map\(', r'(\1 || []).map(', content)
    content = re.sub(r'(?<!\.)(messages)\.map\(', r'(\1 || []).map(', content)
    content = re.sub(r'(?<!\.)(items)\.map\(', r'(\1 || []).map(', content)

    content = re.sub(r'(\w+)\.background\.type', r'\1.background?.type', content)
    content = re.sub(r'(\w+)\.background\.imageUrl', r'\1.background?.imageUrl', content)
    content = re.sub(r'(\w+)\.background\.color1', r'\1.background?.color1', content)
    content = re.sub(r'(\w+)\.background\.color2', r'\1.background?.color2', content)
    content = re.sub(r'(\w+)\.background\.opacity', r'\1.background?.opacity', content)

    content = re.sub(r'(\w+)\.pageBackground\.type', r'\1.pageBackground?.type', content)
    content = re.sub(r'(\w+)\.pageBackground\.imageUrl', r'\1.pageBackground?.imageUrl', content)
    content = re.sub(r'(\w+)\.pageBackground\.color1', r'\1.pageBackground?.color1', content)
    content = re.sub(r'(\w+)\.pageBackground\.color2', r'\1.pageBackground?.color2', content)

    # 3. Default state initialization: We can just use python to add default state initialization
    # if `if (!data.background)` is not present, add it.
    if "data = docSnap.data();" in content and "data.background =" not in content:
        replacement = """          data = docSnap.data();
          if (!data.background) {
            data.background = { type: "gradient", color1: "#000036", color2: "#000016", imageUrl: "", opacity: 100 };
          }
          if (!data.pageBackground) {
            data.pageBackground = { type: "color", color1: "#0b0f19", color2: "#000000", imageUrl: "" };
          }
          if (!data.links) {
            data.links = [];
          }"""
        content = content.replace("const data = docSnap.data();", replacement)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for d in directories:
    for f in glob.glob(d + '/*.jsx'):
        process_file(f)
