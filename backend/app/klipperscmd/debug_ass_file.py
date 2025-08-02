#!/usr/bin/env python3
"""
Debug script to inspect ASS file contents and verify karaoke formatting
"""

import sys
import os

def debug_ass_file(ass_file_path):
    """Debug ASS file contents and check karaoke formatting."""
    if not os.path.exists(ass_file_path):
        print(f"Error: ASS file not found: {ass_file_path}")
        return
    
    print(f"=== Debugging ASS file: {ass_file_path} ===")
    
    with open(ass_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    print(f"Total lines: {len(lines)}")
    print("\n=== HEADER SECTION ===")
    
    # Show header
    dialogue_started = False
    dialogue_count = 0
    
    for i, line in enumerate(lines[:30]):  # Show first 30 lines for header
        print(f"{i+1:2d}: {line}")
        if line.startswith('Dialogue:'):
            dialogue_started = True
            break
    
    if dialogue_started:
        print(f"\n=== DIALOGUE SECTION (first 5 lines) ===")
        dialogue_lines = [line for line in lines if line.startswith('Dialogue:')]
        
        for i, line in enumerate(dialogue_lines[:5]):
            print(f"{i+1}: {line}")
            
            # Check for karaoke tags
            if '\\k' in line:
                print(f"   -> ✅ Karaoke tags found!")
                # Extract karaoke parts
                import re
                karaoke_matches = re.findall(r'\\k(\d+)', line)
                if karaoke_matches:
                    print(f"   -> Karaoke timings: {karaoke_matches} (centiseconds)")
            else:
                print(f"   -> ❌ No karaoke tags found")
        
        print(f"\n=== SUMMARY ===")
        print(f"Total dialogue lines: {len(dialogue_lines)}")
        karaoke_lines = [line for line in dialogue_lines if '\\k' in line]
        print(f"Lines with karaoke: {len(karaoke_lines)}")
        print(f"Karaoke percentage: {len(karaoke_lines)/len(dialogue_lines)*100:.1f}%")
    else:
        print("❌ No dialogue lines found!")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python debug_ass_file.py <ass_file_path>")
        sys.exit(1)
    
    debug_ass_file(sys.argv[1]) 