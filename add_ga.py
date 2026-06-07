import os
import glob

ga_snippet = """
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
"""

search_console_meta = '  <meta name="google-site-verification" content="YOUR_SEARCH_CONSOLE_VERIFICATION_CODE" />\n'

base_dir = r'e:\TERM - 4\Project\1'
for filepath in glob.glob(os.path.join(base_dir, '*.html')):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'Google Analytics' not in content:
        # Insert before </head>
        content = content.replace('</head>', f'{search_console_meta}{ga_snippet}</head>')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added GA to {os.path.basename(filepath)}")
