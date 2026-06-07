import os
import glob
from PIL import Image

def convert_to_webp(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, file)
                webp_path = os.path.splitext(filepath)[0] + '.webp'
                
                try:
                    with Image.open(filepath) as img:
                        # Convert RGBA to RGB if saving as webp without alpha (though webp supports alpha)
                        # WebP supports alpha, so we can save it directly
                        img.save(webp_path, 'webp', quality=75, method=6)
                        
                        # Target is < 300KB
                        size_kb = os.path.getsize(webp_path) / 1024
                        if size_kb > 300:
                            # Try again with lower quality
                            img.save(webp_path, 'webp', quality=50, method=6)
                    
                    print(f"Converted: {file} -> .webp")
                    os.remove(filepath)
                except Exception as e:
                    print(f"Error converting {filepath}: {e}")

print("Starting image conversion...")
convert_to_webp(r'e:\TERM - 4\Project\1\assets')

print("Updating HTML and CSS files...")
base_dir = r'e:\TERM - 4\Project\1'
extensions = ['*.html', 'css/*.css', 'js/*.js']

for ext in extensions:
    # Use glob to find files
    search_pattern = os.path.join(base_dir, '**', ext)
    for filepath in glob.glob(search_pattern, recursive=True):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Simple replace for common extensions
            new_content = content.replace('.jpg', '.webp').replace('.png', '.webp').replace('.jpeg', '.webp').replace('.JPG', '.webp').replace('.PNG', '.webp')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated references in {os.path.basename(filepath)}")
        except Exception as e:
            print(f"Error updating {filepath}: {e}")

print("Done!")
